const MemorySession = require("../models/MemorySession");
const MemoryMessage = require("../models/MemoryMessage");

class MemorySessionService {
  async createSession(userId) {
    return await MemorySession.create({
      userId,
      title: "New Memory Session",
    });
  }

  async getSessions(userId) {
    return await MemorySession.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async getSession(sessionId, userId) {
    const session = await MemorySession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      const error = new Error("Memory session not found.");
      error.status = 404;
      throw error;
    }

    const messages = await MemoryMessage.find({
      sessionId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return {
      session,
      messages,
    };
  }

  async getSessionById(sessionId, userId) {
    const session = await MemorySession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      const error = new Error("Memory session not found.");
      error.status = 404;
      throw error;
    }

    return session;
  }

  async renameSession(sessionId, userId, title) {
    if (!title?.trim()) {
      const error = new Error("Title is required.");
      error.status = 400;
      throw error;
    }

    return await MemorySession.findOneAndUpdate(
      {
        _id: sessionId,
        userId,
      },
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );
  }

  async deleteSession(sessionId, userId) {
    await MemoryMessage.deleteMany({
      sessionId,
    });

    return await MemorySession.findOneAndDelete({
      _id: sessionId,
      userId,
    });
  }

  async saveMessage({
    sessionId,
    role,
    content,
    sources = [],
    metadata = {},
    }) {

    const message = await MemoryMessage.create({
        sessionId,
        role,
        content,
        sources,
        metadata,
    });

    const session = await MemorySession.findById(sessionId);

    if (!session) {
        return message;
    }

    const update = {
        lastMessage: content,
    };

    if (
        role === "user" &&
        session.title === "New Memory Session"
    ) {
        update.title =
        content.length > 40
            ? `${content.substring(0, 40)}...`
            : content;
    }

    await MemorySession.findByIdAndUpdate(
        sessionId,
        update
    );

    return message;
    }

  async getRecentMessages(sessionId, limit = 8) {
    return await MemoryMessage.find({
      sessionId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new MemorySessionService();
module.exports.MemorySessionService = MemorySessionService;
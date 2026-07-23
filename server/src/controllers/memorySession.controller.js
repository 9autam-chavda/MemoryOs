const memorySessionService = require("../services/memorySession.service");

const createSession = async (req, res) => {
  try {
    const session = await memorySessionService.createSession(req.user.id);

    return res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to create session.",
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await memorySessionService.getSessions(req.user.id);

    return res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to load sessions.",
    });
  }
};

const getSession = async (req, res) => {
  try {
    const data = await memorySessionService.getSession(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const renameSession = async (req, res) => {
  try {
    const session = await memorySessionService.renameSession(
      req.params.id,
      req.user.id,
      req.body.title
    );

    return res.json({
      success: true,
      session,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    await memorySessionService.deleteSession(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  renameSession,
  deleteSession,
};
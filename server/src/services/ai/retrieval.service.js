import MemoryItem from "../../models/MemoryItem.js";
import embeddingService from "./embedding.service.js";
import cosineSimilarity from "../../utils/cosineSimilarity.js";

const DEFAULT_TOP_K = Number(process.env.RETRIEVAL_TOP_K || 5);
const DEFAULT_THRESHOLD = Number(process.env.RETRIEVAL_THRESHOLD || 0.6);

class RetrievalService {

    /**
     * Retrieve the most relevant memories for a question.
     *
     * @param {string} question
     * @param {string} userId
     * @param {Object} options
     * @returns {Promise<Array>}
     */
    async retrieve(question, userId, options = {}) {

        if (!question?.trim()) {
            throw new Error("Question is required.");
        }

        if (!userId) {
            throw new Error("User ID is required.");
        }

        const topK = options.topK ?? DEFAULT_TOP_K;
        const threshold = options.threshold ?? DEFAULT_THRESHOLD;

        const startedAt = Date.now();

        // ---------------------------------------------------
        // Step 1
        // Generate embedding for the question
        // ---------------------------------------------------

        const queryEmbedding = await embeddingService.generate(question);

        // ---------------------------------------------------
        // Step 2
        // Load only required fields
        // ---------------------------------------------------

        const memories = await MemoryItem.find({
            userId
        })
            .select(`
                fileName
                fileType
                summary
                category
                extractedText
                embedding
                metadata
                createdAt
            `)
            .lean();

        // ---------------------------------------------------
        // Step 3
        // Calculate cosine similarity
        // ---------------------------------------------------

        const scoredMemories = [];

        for (const memory of memories) {

            if (
                !memory.embedding ||
                !Array.isArray(memory.embedding) ||
                memory.embedding.length === 0
            ) {
                continue;
            }

            const similarity = cosineSimilarity(
                queryEmbedding,
                memory.embedding
            );

            if (similarity < threshold) {
                continue;
            }

            scoredMemories.push({

                id: memory._id,

                fileName: memory.fileName,

                fileType: memory.fileType,

                summary: memory.summary,

                category: memory.category,

                content: memory.extractedText,

                metadata: memory.metadata,

                createdAt: memory.createdAt,

                similarity: Number(similarity.toFixed(4))
            });

        }

        // ---------------------------------------------------
        // Step 4
        // Highest similarity first
        // ---------------------------------------------------

        scoredMemories.sort(
            (a, b) => b.similarity - a.similarity
        );

        // ---------------------------------------------------
        // Step 5
        // Return Top K
        // ---------------------------------------------------

        const results = scoredMemories.slice(0, topK);

        // ---------------------------------------------------
        // Debug Logging
        // ---------------------------------------------------

        console.log(`
================ Retrieval ================

Question        : ${question}

User            : ${userId}

Total Memories  : ${memories.length}

Matched         : ${results.length}

Highest Score   : ${results[0]?.similarity ?? "N/A"}

Execution Time  : ${Date.now() - startedAt} ms

===========================================
`);

        return results;
    }
}

export default new RetrievalService();
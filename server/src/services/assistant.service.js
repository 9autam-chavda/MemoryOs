import retrievalService from "./ai/retrieval.service.js";
import contextService from "./ai/context.service.js";

class AssistantService {

    async process(question, userId) {

        const memories =
            await retrievalService.retrieve(
                question,
                userId
            );

        const { context, sources } =
            contextService.build(memories);

        return {

            success: true,

            question,

            context,

            sources

        };

    }

}

export default new AssistantService();
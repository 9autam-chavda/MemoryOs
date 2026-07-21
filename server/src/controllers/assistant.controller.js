import assistantService from "../services/assistant.service.js";

export const askAssistant = async (req, res, next) => {

    try {

        const { question } = req.body;

        const result = await assistantService.process(
            question,
            req.user.id
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};
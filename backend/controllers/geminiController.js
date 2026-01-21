const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiController = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("prompt", req.body.prompt);
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(prompt);

        res.json({
            success: true,
            text: result.response.text(),
        });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({
            success: false,
            message: "Gemini API failed",
        });
    }
};

module.exports = {
    geminiController,
};

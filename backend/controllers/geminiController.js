import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const geminiController = async (req, res) => {
    try {
        const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // Set headers for SSE-like streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const prompt = `Generate 3 detailed chapters about the topic: "${topic}". 
        For each chapter:
        1. Start with strictly include the marker: ---CHAPTER_START--- followed by the Chapter Title.
        2. Provide at least 300 words of engaging content.
        3. End the content with strictly include the marker: ---IMAGES---.
        4. After ---IMAGES---, provide exactly 3 unique, search-optimized tags for image generation. Each tag must be 1-2 words long and consist ONLY of concrete visual nouns and objects (e.g., "farm-tractor", "muddy-boots", "cow-udder"). Avoid poetic or abstract language.
        
        Format example:
        ---CHAPTER_START--- Title
        Content...
        ---IMAGES--- concrete-object1, concrete-object2, concrete-object3`;

        // Correct way to list models in @google/genai SDK
        try {
            const modelsResult = await genAI.models.list();
            console.log("Available models:", modelsResult);
        } catch (listError) {
            console.log("Could not list models directly. Try checking GenAI instance properties:", Object.keys(genAI));
        }

        const result = await genAI.models.generateContentStream({
            model: "models/gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        let accumulatedText = '';
        let lastProcessedIndex = 0;
        let chapterIndex = 0;

        for await (const chunk of result) {
            if (chunk?.candidates?.length > 0) {
                const text = chunk.candidates[0]?.content?.parts?.[0]?.text;
                if (text) {
                    accumulatedText += text;

                    // Stream the raw text chunk
                    res.write(`data: ${JSON.stringify({ text })}\n\n`);

                    // Check for complete chapter image markers
                    const subText = accumulatedText.substring(lastProcessedIndex);
                    const imageMarkerRegex = /---IMAGES---\s*([^\n\r]+)/g;
                    let match;

                    while ((match = imageMarkerRegex.exec(subText)) !== null) {
                        const rawKeywords = match[1].trim();
                        const parts = rawKeywords.split(',').map(k => k.trim()).filter(k => k);

                        // Clean up the main topic for search (replace spaces with hyphens)
                        const cleanTopic = topic.trim().replace(/\s+/g, '-');
                        console.log(cleanTopic);
                        const images = parts.slice(0, 3).map((kw, i) => {
                            // Clean up the keyword phrase (hyphenate)
                            const cleanKw = kw.replace(/\s+/g, '-');
                            // Return LoremFlickr URL combining topic and specific keyword
                            return `https://loremflickr.com/600/400/${encodeURIComponent(cleanTopic)},${encodeURIComponent(cleanKw)}?lock=${chapterIndex}${i}`;
                        });

                        // Stream the images for this chapter
                        if (images.length > 0) {
                            res.write(`data: ${JSON.stringify({ images, chapterIndex })}\n\n`);
                        }

                        lastProcessedIndex += match.index + match[0].length;
                        chapterIndex++;
                    }
                }
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("Gemini Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Gemini API failed",
            });
        } else {
            res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
            res.end();
        }
    }
};

export { geminiController };

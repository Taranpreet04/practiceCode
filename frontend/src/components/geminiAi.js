import React, { useState, useEffect, useRef } from 'react';
import './geminiAi.css';

export default function GeminiAi() {
    const [topic, setTopic] = useState('');
    const [chapters, setChapters] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const [chapterImages, setChapterImages] = useState({});
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentText, chapters]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGenerating(true);
        setChapters([]);
        setCurrentText('');
        setChapterImages({});

        try {
            const response = await fetch('http://localhost:7000/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error('Failed to generate content');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;

                        try {
                            const data = JSON.parse(dataStr);

                            // Handle text chunks
                            if (data.text) {
                                accumulatedText += data.text;

                                // Split text by chapter marker
                                const parts = accumulatedText.split('---CHAPTER_START---');
                                if (parts.length > 1) {
                                    const completedChapters = parts.slice(1, -1).map(ch => {
                                        // Remove the ---IMAGES--- marker and keywords from display
                                        return ch.replace(/---IMAGES---[^\n]*\n?/g, '').trim();
                                    });
                                    const inProgressChapter = parts[parts.length - 1];

                                    setChapters(completedChapters);
                                    setCurrentText(inProgressChapter);
                                } else {
                                    setCurrentText(accumulatedText);
                                }
                            }

                            // Handle image data
                            if (data.images && data.chapterIndex !== undefined) {
                                setChapterImages(prev => ({
                                    ...prev,
                                    [data.chapterIndex]: data.images
                                }));
                            }
                        } catch (err) {
                            console.error('Error parsing chunk:', err);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Something went wrong!');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="gemini-ai-container">
            <h1>3-Chapter AI Generator</h1>
            <form onSubmit={handleGenerate} className="prompt-form">
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic for your 3-chapter series..."
                    disabled={isGenerating}
                    rows={4}
                />
                <button type="submit" disabled={isGenerating || !topic.trim()}>
                    {isGenerating ? 'Generating...' : 'Generate Chapters'}
                </button>
            </form>

            <div className="chapters-display" ref={scrollRef}>
                {chapters.map((chapter, index) => (
                    <div key={index} className="chapter-block">
                        <h2>Chapter {index + 1}</h2>
                        <div className="chapter-content">
                            {chapter.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                        {chapterImages[index] && (
                            <div className="chapter-images">
                                {chapterImages[index].map((imgUrl, imgIdx) => (
                                    <div key={imgIdx} className="image-wrapper">
                                        <img
                                            src={imgUrl}
                                            alt={`Chapter ${index + 1} - Illustration ${imgIdx + 1}`}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {currentText && (
                    <div className="chapter-block current">
                        <h2>Chapter {chapters.length + 1} {isGenerating && <span className="typing-indicator">...</span>}</h2>
                        <div className="chapter-content">
                            {currentText.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                        {chapterImages[chapters.length] && (
                            <div className="chapter-images">
                                {chapterImages[chapters.length].map((imgUrl, imgIdx) => (
                                    <div key={imgIdx} className="image-wrapper">
                                        <img
                                            src={imgUrl}
                                            alt={`Chapter ${chapters.length + 1} - Illustration ${imgIdx + 1}`}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!isGenerating && chapters.length === 0 && !currentText && (
                    <p className="placeholder-text" style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
                        Type a topic above to begin streaming your chapters!
                    </p>
                )}
            </div>
        </div>
    );
}

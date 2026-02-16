import React, { useState, useEffect, useRef } from 'react';
import './ChapterGenerator.css';

const ChapterGenerator = () => {
    const [topic, setTopic] = useState('');
    const [chapters, setChapters] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const scrollRef = useRef(null);

    const [chapterImages, setChapterImages] = useState({});

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
        setChapterImages({});
        setCurrentText('');

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
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') break;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                accumulatedText += data.text;

                                // Split text by chapter marker
                                const parts = accumulatedText.split('---CHAPTER_START---');
                                if (parts.length > 1) {
                                    const completedChapters = parts.slice(1, -1);
                                    const inProgressChapter = parts[parts.length - 1];

                                    setChapters(completedChapters);
                                    setCurrentText(inProgressChapter);
                                } else {
                                    setCurrentText(accumulatedText);
                                }
                            } else if (data.images) {
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

    const parseChapter = (rawText) => {
        const [content, imageSection] = rawText.split('---IMAGES---');
        const keywords = imageSection ? imageSection.split(',').map(k => k.trim()).filter(k => k) : [];
        return { content, keywords };
    };

    return (
        <div className="chapter-generator-container">
            <h1>AI Chapter & Image Explorer</h1>
            <form onSubmit={handleGenerate} className="topic-form">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., Cyberpunk Cities of 2077)"
                    disabled={isGenerating}
                />
                <button type="submit" disabled={isGenerating || !topic.trim()}>
                    {isGenerating ? 'Generate Series' : 'Generate Chapters'}
                </button>
            </form>

            <div className="chapters-display" ref={scrollRef}>
                {chapters.map((chapterRaw, index) => {
                    const { content, keywords } = parseChapter(chapterRaw);
                    const images = chapterImages[index];

                    return (
                        <div key={index} className="chapter-block">
                            <h2>Chapter {index + 1}</h2>
                            <div className="chapter-content">
                                {content.split('\n').map((para, i) => para.trim() && (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            <div className="chapter-images">
                                {images ? (
                                    images.map((imgUrl, i) => (
                                        <div key={i} className="image-wrapper">
                                            <img src={imgUrl} alt="Topic relevance" loading="lazy" />
                                        </div>
                                    ))
                                ) : (
                                    keywords.map((kw, i) => (
                                        <div key={i} className="image-wrapper">
                                            <img
                                                src={`https://loremflickr.com/600/400/${encodeURIComponent(`${topic},${kw}`)}?lock=${index}${i}`}
                                                alt={kw}
                                                loading="lazy"
                                            />
                                            <span className="image-caption">{kw}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}

                {currentText && (
                    <div className="chapter-block current">
                        <h2>Chapter {chapters.length + 1} {isGenerating && <span className="typing-indicator">...</span>}</h2>
                        <div className="chapter-content">
                            {parseChapter(currentText).content.split('\n').map((para, i) => para.trim() && (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                )}

                {!isGenerating && chapters.length === 0 && !currentText && (
                    <p className="placeholder-text">Enter a topic and watch your story come to life with images!</p>
                )}
            </div>
        </div>
    );
};

export default ChapterGenerator;

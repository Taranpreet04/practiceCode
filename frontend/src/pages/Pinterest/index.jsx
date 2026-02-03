import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pinterest = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [pins, setPins] = useState([]);
    const [selectedPins, setSelectedPins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [alreadyImportedPins, setAlreadyImportedPins] = useState([]);

    const userId = "66f11bdb87ccaa6ae0ed9d08";

    const connectPinterest = () => {
        setIsConnecting(true);
        window.location.href = `http://127.0.0.1:7000/api/pinterest/login?state=${userId}`;
    };

    const handleOAuthCallback = async (code) => {
        setLoading(true);
        setMessage('Completing connection...');
        try {
            await axios.get(`http://localhost:7000/api/pinterest/callback?code=${code}&state=${userId}`);
            setMessage('Pinterest connected successfully!');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            fetchBoards();
        } catch (err) {
            console.error('Error in OAuth callback', err);
            setMessage('Failed to complete Pinterest connection.');
        } finally {
            setLoading(false);
        }
    };

    const fetchImportedPins = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/pinterest/imported-pins?userId=${userId}`);
            setAlreadyImportedPins(res.data.items || []);
        } catch (err) {
            console.error('Error fetching imported pins', err);
        }
    };

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:7000/api/pinterest/boards?userId=${userId}`);
            console.log("boards", res.data.items)
            setBoards(res.data.items);
            setIsConnected(true);
        } catch (err) {
            console.error('Error fetching boards', err);
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchPins = async (boardId) => {
        setLoading(true);
        setSelectedBoard(boardId);
        try {
            const res = await axios.get(`http://localhost:7000/api/pinterest/boards/${boardId}/pins?userId=${userId}`);
            setPins(res.data.items);
        } catch (err) {
            console.error('Error fetching pins', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePinSelection = (pinId) => {
        setSelectedPins(prev =>
            prev.includes(pinId) ? prev.filter(id => id !== pinId) : [...prev, pinId]
        );
    };

    const importPins = async () => {
        if (selectedPins.length === 0) return;
        setImporting(true);
        setMessage('Importing images...');
        try {
            const res = await axios.post('http://localhost:7000/api/pinterest/import', {
                pins: selectedPins,
                userId
            });
            setMessage(`Successfully imported ${res.data.count} images!`);
            setSelectedPins([]);
            fetchImportedPins();
        } catch (err) {
            console.error('Error importing pins', err);
            setMessage('Failed to import images.');
        } finally {
            setImporting(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        fetchImportedPins();
        fetchBoards();
        if (code) {
            handleOAuthCallback(code);
        } else {
            fetchBoards();
        }
    }, []);

    console.log("boards==", boards)
    console.log("pins==", pins)
    console.log("selectedPins==", selectedPins)
    return (
        <div className="pinterest-container">
            <div className="pinterest-header">
                <h1>Pinterest Import</h1>
                {!isConnected ? (
                    <button className="pinterest-btn" onClick={connectPinterest}>
                        Connect Pinterest
                    </button>
                ) : (
                    <button className="pinterest-btn secondary" onClick={() => setSelectedBoard(null)}>
                        Back to Boards
                    </button>
                )}
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            {loading && <div>Loading...</div>}

            {!loading && isConnected && !selectedBoard && (
                <div className="boards-grid">
                    {boards.map(board => (
                        <div key={board.id} className="board-card" onClick={() => fetchPins(board.id)}>
                            <h3>{board.name}</h3>
                            <p>{board.pin_count} Pins</p>
                        </div>
                    ))}
                </div>
            )}

            {!loading && selectedBoard && (
                <div className="pins-grid">
                    {pins.map(pin => (
                        <div
                            key={pin.id}
                            className={`pin-item ${selectedPins.includes(pin.id) ? 'selected' : ''}`}
                            onClick={() => togglePinSelection(pin.id)}
                        >
                            <img
                                src={pin.media?.images?.['originals']?.url || pin.media?.images?.['600x']?.url || ""}
                                alt={pin.title}
                                className="pin-image"
                            />
                            <input
                                type="checkbox"
                                checked={selectedPins.includes(pin.id)}
                                readOnly
                                className="pin-checkbox"
                            />
                        </div>
                    ))}
                </div>
            )}

            {selectedPins.length > 0 && !importing && (
                <div className="import-bar">
                    <span>{selectedPins.length} Pins Selected</span>
                    <button className="pinterest-btn" onClick={importPins}>
                        Import Selected
                    </button>
                </div>
            )}

            {importing && (
                <div className="import-bar">
                    <span>Importing... Please wait.</span>
                </div>
            )}
            {alreadyImportedPins.length > 0 && (
                <div className="imported-section">
                    <h2>Already Imported Pins</h2>
                    <div className="pins-grid">
                        {alreadyImportedPins.map(pin => (
                            <div key={pin._id} className="pin-item">
                                <img src={pin.localUrl} alt="Imported" className="pin-image" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pinterest;
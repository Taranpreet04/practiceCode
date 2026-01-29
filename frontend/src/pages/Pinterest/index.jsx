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

    const userId = "66f11bdb87ccaa6ae0ed9d08";

    const connectPinterest = () => {
        window.location.href = `http://127.0.0.1:7000/api/pinterest/login?state=${userId}`;
        // const data = fetch(`http://127.0.0.1:7000/api/pinterest/login`)
        //     .then(res => res.json())
        //     .then(data => console.log(data))
        //     .catch(err => console.error(err));
    };

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:7000/api/pinterest/boards?userId=${userId}`);
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
        } catch (err) {
            console.error('Error importing pins', err);
            setMessage('Failed to import images.');
        } finally {
            setImporting(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

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
                            <img src={pin.media.images['originals'].url} alt={pin.title} className="pin-image" />
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
        </div>
    );
};

export default Pinterest;
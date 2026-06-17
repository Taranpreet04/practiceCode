import React, { useState, useRef, useEffect } from 'react';

const ChatBody = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      // 1. Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Open Deepgram WebSocket connection
      // We pass the API key as the sec-websocket-protocol 'token'
      const apiKey = process.env.REACT_APP_DEEPGRAM_KEY;
      if (!apiKey) {
        alert("Deepgram API Key is missing in .env file!");
        return;
      }

      const socket = new WebSocket(
        'wss://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&interim_results=true',
        ['token', apiKey]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('Deepgram WebSocket connection opened');
        
        // 3. Start media recorder when socket is ready
        // Use a mimetype supported by Deepgram, like audio/webm
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        // Send chunks to Deepgram every 250ms
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(250);
        setIsRecording(true);
        setTranscript('');
        setInterimTranscript('');
      };

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const newTranscript = received?.channel?.alternatives?.[0]?.transcript;

        if (newTranscript) {
          if (received.is_final) {
            // Append final sentence to the main transcript
            setTranscript((prev) => prev + (prev ? ' ' : '') + newTranscript);
            setInterimTranscript('');
          } else {
            // Update the temporary interim transcript
            setInterimTranscript(newTranscript);
          }
        }
      };

      socket.onclose = () => {
        console.log('Deepgram WebSocket connection closed');
      };

      socket.onerror = (error) => {
        console.error('Deepgram WebSocket Error:', error);
      };

    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Send close message to tell Deepgram we're done sending audio
      const closeMessage = JSON.stringify({ type: 'CloseStream' });
      socketRef.current.send(closeMessage);
      // We don't close socket immediately; we let it process the last audio and close gracefully
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>🎙️ Live Speech to Text (Deepgram WebSocket)</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={startRecording}
          disabled={isRecording}
          style={{
            padding: '10px 20px',
            backgroundColor: isRecording ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRecording ? 'not-allowed' : 'pointer',
          }}
        >
          {isRecording ? '🔴 Recording...' : '🎙️ Start Recording'}
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          style={{
            padding: '10px 20px',
            backgroundColor: !isRecording ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !isRecording ? 'not-allowed' : 'pointer',
          }}
        >
          ⏹️ Stop Recording
        </button>
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#f0f4ff',
          border: '1px solid #c0cfff',
          borderRadius: '8px',
          maxWidth: '600px',
          minHeight: '100px',
        }}
      >
        <strong>Live Transcript:</strong>
        <p style={{ marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
          {transcript}
          {interimTranscript && (
            <span style={{ color: '#666', fontStyle: 'italic' }}>
              {transcript ? ' ' : ''}
              {interimTranscript}
            </span>
          )}
          {!transcript && !interimTranscript && (
            <span style={{ color: '#aaa' }}>Your speech will appear here as you type...</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatBody;
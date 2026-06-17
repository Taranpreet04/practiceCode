import React, { useRef, useState, useEffect } from "react";
import { menuItems } from "../common/Sidebar/Sidebar";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
    useEffect(() => {
        console.log("MOUNT:", item?.label);
        return () => {
            console.log("UNMOUNT:", item?.label);
        };
    }, [item]);

    return (
        <div
            className="card p-4 mb-3 shadow-sm rounded"
            style={{ 
                margin: "10px auto", 
                minHeight: "150px", 
                width: "100%",
                maxWidth: "600px", 
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0" 
            }}
        >
            <h5 className="mb-3">{item?.label || "Interaction"}</h5>
            <p>This is a component dynamically added. You can put any interactive elements here.</p>
            <footer>
                <Link to={item?.path || "#"}>
                    Go to {item?.label || "Link"}
                </Link>
            </footer>
        </div>
    );
};

const ScrollTest = () => {
    // State to hold the displayed components in the feed
    const [displayedItems, setDisplayedItems] = useState([
        menuItems[0] || { label: "Initial Component", path: "/" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(1);
    
    // Reference to the bottom of the container
    const bottomRef = useRef(null);

    // Auto-scroll function
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Trigger auto-scroll whenever displayedItems changes (new item added)
    useEffect(() => {
        scrollToBottom();
    }, [displayedItems]);

    // Handle user interaction (adding the next component to the screen)
    const handleNextInteraction = () => {
        // Fetch the next item from menuItems to simulate a new component
        const nextItem = menuItems[currentIndex % menuItems.length] || { label: `Interaction ${currentIndex + 1}`, path: "/" };
        
        // Append it to the end of the state array
        setDisplayedItems((prev) => [...prev, nextItem]);
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div
            className='page-container'
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh", // Full viewport height so it scrolls within this area
                backgroundColor: "#f9f9f9"
            }}
        >
            {/* Header */}
            <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
                <h3>ChatGPT-like Dynamic Components</h3>
                <p>Click the button below to interact. New components appear at the bottom and push older ones up.</p>
            </div>

            {/* Scrollable Container for Components */}
            <div 
                style={{
                    flex: 1, 
                    overflowY: "auto", 
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {displayedItems.map((item, index) => (
                    // We render each item sequentially
                    <Card key={index} item={item} />
                ))}
                
                {/* This invisible div is what we scroll to smoothly */}
                <div ref={bottomRef} style={{ height: "1px" }} />
            </div>

            {/* User Input / Action Area */}
            <div style={{ padding: "20px", backgroundColor: "#fff", borderTop: "1px solid #ddd", display: "flex", justifyContent: "center" }}>
                <button 
                    onClick={handleNextInteraction}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: "#10a37f", // ChatGPT green
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                    }}
                >
                    Simulate Next Interaction
                </button>
            </div>
        </div>
    );
};

export {
    ScrollTest
};

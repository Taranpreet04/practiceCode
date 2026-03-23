import React, { useState } from "react";
import { Stage, Layer, Image, Circle, Text } from "react-konva";
import useImage from "use-image";

const URL = "https://picsum.photos/id/1015/600/400"; // your image

export default function ImageComment() {
    const [image] = useImage(URL);
    const [comments, setComments] = useState([]);

    const handleClick = (e) => {
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        const text = prompt("Enter comment");
        if (!text) return;

        setComments([
            ...comments,
            {
                x: pointerPosition.x,
                y: pointerPosition.y,
                text,
            },
        ]);
    };
    console.log("comments", comments)
    return (
        <Stage
            width={600}
            height={400}
            onClick={handleClick}
            style={{ border: "1px solid #ccc" }}
        >
            <Layer>
                <Image image={image} width={600} height={400} />

                {comments.map((c, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            x={c.x}
                            y={c.y}
                            radius={15}
                            fill="white"
                            stroke="black"
                        />
                        <Text
                            x={c.x - 5}
                            y={c.y - 7}
                            text={String(index + 1)}
                            fontSize={14}
                            fill="black"
                        />
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
    );
}

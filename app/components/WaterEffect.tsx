"use client";

import { useEffect, useRef } from "react";

export default function WaterRippleEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        // Water simulation variables
        const resolution = 3; // Lower = higher quality but slower
        const cols = Math.floor(width / resolution);
        const rows = Math.floor(height / resolution);

        let current = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
        let previous = new Array(cols).fill(0).map(() => new Array(rows).fill(0));

        const dampening = 0.99;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resize);

        // Mouse interaction
        const handleMouseMove = (e: MouseEvent) => {
            const x = Math.floor(e.clientX / resolution);
            const y = Math.floor(e.clientY / resolution);

            if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
                // Create ripple at mouse position
                for (let i = -2; i <= 2; i++) {
                    for (let j = -2; j <= 2; j++) {
                        const nx = x + i;
                        const ny = y + j;
                        if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1) {
                            previous[nx][ny] = 255;
                        }
                    }
                }
            }
        };

        const handleClick = (e: MouseEvent) => {
            const x = Math.floor(e.clientX / resolution);
            const y = Math.floor(e.clientY / resolution);

            if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
                // Create bigger ripple on click
                for (let i = -5; i <= 5; i++) {
                    for (let j = -5; j <= 5; j++) {
                        const nx = x + i;
                        const ny = y + j;
                        if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1) {
                            previous[nx][ny] = 512;
                        }
                    }
                }
            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("click", handleClick);

        const animate = () => {
            // Update water simulation
            for (let x = 1; x < cols - 1; x++) {
                for (let y = 1; y < rows - 1; y++) {
                    current[x][y] =
                        (previous[x - 1][y] +
                            previous[x + 1][y] +
                            previous[x][y - 1] +
                            previous[x][y + 1]) /
                        2 -
                        current[x][y];
                    current[x][y] *= dampening;
                }
            }

            // Render
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, width, height);

            const imageData = ctx.createImageData(width, height);

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const value = current[x][y];

                    // Map water height to color
                    const intensity = Math.min(Math.abs(value), 255);

                    // Purple/violet gradient based on ripple intensity
                    const r = Math.floor(99 + intensity * 0.3);
                    const g = Math.floor(102 + intensity * 0.2);
                    const b = Math.floor(241 + intensity * 0.05);
                    const a = Math.floor(intensity * 0.4);

                    // Fill pixels
                    for (let i = 0; i < resolution; i++) {
                        for (let j = 0; j < resolution; j++) {
                            const pixelX = x * resolution + i;
                            const pixelY = y * resolution + j;

                            if (pixelX < width && pixelY < height) {
                                const index = (pixelY * width + pixelX) * 4;
                                imageData.data[index] = r;
                                imageData.data[index + 1] = g;
                                imageData.data[index + 2] = b;
                                imageData.data[index + 3] = a;
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Swap buffers
            [current, previous] = [previous, current];

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}
        />
    );
}

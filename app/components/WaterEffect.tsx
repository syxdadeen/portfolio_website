"use client";

import { useEffect, useRef } from "react";

export default function WaterEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        const drawWave = (
            yOffset: number,
            amplitude: number,
            frequency: number,
            phase: number,
            opacity: number,
            color: string
        ) => {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            for (let x = 0; x <= canvas.width; x += 5) {
                const y =
                    yOffset +
                    Math.sin((x * frequency + phase) / 100) * amplitude +
                    Math.sin((x * frequency * 0.5 + phase * 1.3) / 150) * (amplitude * 0.5);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `${color}00`);
            gradient.addColorStop(0.5, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${color}${Math.floor(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);

            ctx.fillStyle = gradient;
            ctx.fill();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            time += 0.005;

            // Multiple layers of waves for depth
            drawWave(canvas.height * 0.7, 60, 0.8, time * 50, 0.15, "#7c3aed");
            drawWave(canvas.height * 0.75, 50, 1, time * 40, 0.12, "#6366f1");
            drawWave(canvas.height * 0.8, 40, 1.2, time * 30, 0.1, "#8b5cf6");
            drawWave(canvas.height * 0.85, 35, 0.9, time * 35, 0.08, "#a78bfa");

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
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
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

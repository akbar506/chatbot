"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Github } from "lucide-react";

export default function Home() {
  const [positions, setPositions] = useState([
    { x: 0, y: 0, speedX: 2, speedY: 2, rotation: 0, scale: 1 },
    { x: 0, y: 0, speedX: -2, speedY: 1.5, rotation: 0, scale: 1 },
    { x: 0, y: 0, speedX: 1.5, speedY: -2, rotation: 0, scale: 1 },
  ]);
  const heroRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setPositions(prevPositions => 
        prevPositions.map(pos => {
          // Random chance to change direction and speed
          const shouldChangeDirection = Math.random() < 0.09;
          let newSpeedX = shouldChangeDirection ? 
            pos.speedX + (Math.random() * 2 - 1) : pos.speedX;
          let newSpeedY = shouldChangeDirection ? 
            pos.speedY + (Math.random() * 2 - 1) : pos.speedY;

          // Keep speed within bounds
          newSpeedX = Math.max(Math.min(newSpeedX, 4), -4);
          newSpeedY = Math.max(Math.min(newSpeedY, 4), -4);

          // Update position
          let newX = pos.x + newSpeedX;
          let newY = pos.y + newSpeedY;

          // Bounce off boundaries with random angle change
          if (Math.abs(newX) > 150) {
            newSpeedX = -newSpeedX * (1 + Math.random() * 0.4);
            newX = newX > 0 ? 150 : -150;
          }
          if (Math.abs(newY) > 150) {
            newSpeedY = -newSpeedY * (1 + Math.random() * 0.4);
            newY = newY > 0 ? 150 : -150;
          }

          // Update rotation and scale
          const newRotation = (pos.rotation + (Math.random() * 2)) % 360;
          const newScale = 0.8 + Math.sin(Date.now() / 1000) * 0.2;

          return {
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: newRotation,
            scale: newScale,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-black text-white">
        <nav className="flex justify-between items-center p-5">
          {/* <div className="flex items-center">
            <div className="translate-y-px [&amp;_svg]:size-4 [&amp;_svg]:shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg></div>
          </div> */}
          <span className="font-bold text-2xl">AI CHAT</span>
          <Link href={"https://github.com/akbar506/chatbot"}>
            <Github />
          </Link>
        </nav>
        <div
          ref={heroRef}
          className="relative overflow-hidden min-h-[calc(100vh-100px)] flex items-center justify-center"
        >
          {/* Curved line */}
          <div className="hidden lg:block">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,40 100,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
          </svg>
          </div>

          {/* Animated balls */}
          <div
            className="absolute w-32 h-32 rounded-full bg-white/50 blur-2xl"
            style={{
              left: "15%",
              top: "20%",
              transform: `translate(${positions[0].x}px, ${positions[0].y}px) rotate(${positions[0].rotation}deg) scale(${positions[0].scale})`,
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full bg-white/50 blur-3xl"
            style={{
              right: "20%",
              top: "30%",
              transform: `translate(${positions[1].x}px, ${positions[1].y}px) rotate(${positions[1].rotation}deg) scale(${positions[1].scale})`,
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className="absolute w-24 h-24 rounded-full bg-white/50 blur-2xl"
            style={{
              left: "30%",
              bottom: "25%",
              transform: `translate(${positions[2].x}px, ${positions[2].y}px) rotate(${positions[2].rotation}deg) scale(${positions[2].scale})`,
              transition: "transform 0.1s linear",
            }}
          />

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">The next era of Artificial Intelligence</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Discover a new dimension of web interaction with our cutting-edge solutions powered by the Gemini AI model, designed to transform your online presence.
            </p>
            <Link
              href="/chats"
              className="inline-block bg-white text-black font-medium py-3 px-8 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}


"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ComingSoon() {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {

        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <div
            className="flex-col p-8 bg-cover bg-center relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            style={{
                backgroundImage: "url('/logo.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 25%",
                backgroundSize: "contain",
            }}
        >
            {/* Floating particles */}
            {windowSize.width > 0 &&
                [...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-cyan-400/50"
                        initial={{
                            x: Math.random() * windowSize.width,
                            y: Math.random() * windowSize.height,
                            opacity: Math.random(),
                        }}
                        animate={{
                            y: [null, -50],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}

            {/* Glow circles */}
            <motion.div
                className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main content */}
            <div className="relative z-10 text-center mt-64">
                <motion.div
                    className="mt-12 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-2xl text-slate-200">Coming Soon...</span>
                </motion.div>

                <motion.p
                    className="mt-6 text-lg text-slate-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                >
                    🚀 We’re tuning up something exciting.
                    <br/>
                    <span className="text-xl">Stay tuned!</span>
                </motion.p>
            </div>
        </div>
    );
}
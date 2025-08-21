"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // phone number without country code
    const isFormValid = email && password;

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/logged_home");
        } else {
            const data = await res.json();
            alert(data.message || "Invalid login. Try again or create an account.");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center"
              style={{ backgroundImage: "url('/login-bg.jpg')" }}>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#00f5d4] via-[#00bbf9] to-[#2ec4b6] bg-clip-text text-transparent animate-pulse drop-shadow-lg">Login</h1>

            <div className="flex flex-col gap-5 w-full max-w-md bg-white/90 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-yellow-200 text-gray-600">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border rounded-lg"
                />
                <input
                    type="tel"
                    placeholder="Phone Number (without country code)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border rounded-lg"
                />
                <button
                    onClick={handleLogin}
                    disabled={!isFormValid}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                >
                    Login
                </button>
                <button
                    onClick={() => router.push("/create")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    New User? Book here
                </button>
            </div>
        </main>
    );
}
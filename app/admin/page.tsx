"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const validUsername = "admin_dasun";
    const validPassword = "Nilusha1234";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === validUsername && password === validPassword) {
            // Redirect to dashboard on successful login
            router.push("admin/dashboard");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <main
            className="flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center"
            style={{
                backgroundImage: "url('/admin_bg.jpg')",
            }}
        >
            <h2 className="text-3xl bg-linear-to-r from-[#D6C7FF] to-[#DBE9F4] bg-clip-text text-transparent">Welcome Back Sir 👋</h2>

            {/* Manual Login */}
            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4 w-full max-w-md"
            >
                <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border rounded-md"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border rounded-md"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                    Login
                </button>
            </form>
        </main>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CreatePage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+61");
    const [phone, setPhone] = useState("");

    const isFormValid = name && address && email && phone;

    const handleNext = async () => {
        if (!isFormValid) {
            alert("Please fill all required fields");
            return;
        }

        const payload = {
            name,
            address,
            email,
            phoneNumber: `${countryCode}${phone}`,
        };

        const res = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            alert(j.error || "Failed to save user");
            return;
        }

        // Immediately sign them in (password = phoneNumber)
        const loginRes = await signIn("credentials", {
            redirect: false,
            email,
            password: `${countryCode}${phone}`,
        });

        if (loginRes?.ok) {
            router.push("/add_appointment");
        } else {
            alert("Created user but failed to log in.");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center"
              style={{ backgroundImage: "url('/create_bg.jpg')" }}>
            <h1 className="text-3xl font-bold mb-4 text-center">Customer details</h1>
            <p className="text-gray-600 mb-6 text-center">Enter your details to proceed.</p>

            <div className="flex flex-col gap-5 w-full max-w-md bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col ">
                    <label className="font-semibold mb-1">Name*</label>
                    <input type="text" placeholder="John Doe" value={name} onChange={(e)=>setName(e.target.value)} className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div className="flex flex-col ">
                    <label className="font-semibold mb-1">Address*</label>
                    <input type="text" placeholder="123 Street Name" value={address} onChange={(e)=>setAddress(e.target.value)} className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div className="flex flex-col ">
                    <label className="font-semibold mb-1">Email*</label>
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div className="flex flex-col ">
                    <label className="font-semibold mb-1">Contact Number*</label>
                    <div className="flex">
                        <select value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className="border-2 rounded-l-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none">
                            <option value="+61">+61</option>
                            <option value="+94">+94</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+91">+91</option>
                        </select>
                        <input type="tel" placeholder="123456789" value={phone} onChange={(e)=>setPhone(e.target.value)} className="p-3 border-2 border-l-0 rounded-r-xl flex-1 focus:ring-2 focus:ring-blue-400 outline-none" />
                    </div>
                </div>
                <button onClick={handleNext} disabled={!isFormValid} className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-blue-600 disabled:bg-gray-400 transition mt-4">
                    Next →
                </button>
            </div>
        </main>
    );
}
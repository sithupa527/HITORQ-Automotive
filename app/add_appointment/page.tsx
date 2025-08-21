"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddAppointmentPage() {
    const router = useRouter();

    const [idType, setIdType] = useState<"Rego" | "VIN">("Rego");
    const [idValue, setIdValue] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const services = [
        { key: "roadworthy", title: "Roadworthy Services", desc: "Get your vehicle roadworthy with our thorough and reliable inspections. Book today for quick service and peace of mind.", img: "/services/roadworthy.png" },
        { key: "4wd_mods", title: "4WD Modifications", desc: "Upgrade your off-road experience with our expert 4WD modifications for better performance and durability.", img: "/services/4wd_mods.png" },
        { key: "general_service", title: "General Servicing & Repairs", desc: "Keep your vehicle in top condition with our reliable general servicing and repairs. Book your appointment today.", img: "/services/general_service.png" },
        { key: "tyres", title: "Tyres", desc: "We supply and fit brand new tyres for affordable prices.", img: "/services/tyres.png" },
        { key: "accessories", title: "4WD Accessory Fitting", desc: "Enhance your 4WD with our expert accessory fitting service. Schedule your upgrade today.", img: "/services/accessories.png" },
        { key: "suspension", title: "4WD Suspension Upgrade", desc: "Transform your vehicle with our professional suspension installation services. Contact us to schedule your upgrade today.", img: "/services/suspension.png" },
        { key: "other", title: "Any Other Repair", desc: "For all other repairs, contact us today to discuss your needs.", img: "/services/other.png" },
    ];

    const isFormValid = idValue && selectedService;

    const handleNext = () => {
        if (!isFormValid) {
            alert("Please fill in the details and select a service.");
            return;
        }

        const qs = new URLSearchParams({
            vehicleIdType: idType,
            vehicleIdValue: idValue,
            serviceType: selectedService!,
        }).toString();

        router.push(`/extra_info?${qs}`);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center"
              style={{ backgroundImage: "url('/add_app.jpg')" }}>
            <h1 className="text-3xl font-bold mb-6 text-center">Book Your Appointment</h1>

            <div className="flex flex-col gap-5 w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={idType === "Rego"} onChange={() => setIdType("Rego")} />
                        Rego Number
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={idType === "VIN"} onChange={() => setIdType("VIN")} />
                        VIN Number
                    </label>
                </div>
                <input
                    type="text"
                    placeholder={idType === "Rego" ? "Enter Rego Number" : "Enter VIN Number"}
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            <h2 className="text-xl font-semibold text-center mb-4">Select Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {services.map((s) => (
                    <div
                        key={s.key}
                        className={`cursor-pointer p-4 rounded-xl border shadow-lg backdrop-blur-md bg-white/30 transition transform hover:scale-105 ${selectedService === s.key ? "ring-4 ring-blue-400" : ""}`}
                        onClick={() => setSelectedService(s.key)}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Image src={s.img} alt={s.title} width={50} height={50} className="rounded" />
                            <h3 className="font-bold text-lg">{s.title}</h3>
                        </div>
                        <p className="text-gray-700 text-sm">{s.desc}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={handleNext}
                    disabled={!isFormValid}
                    className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-blue-600 disabled:bg-gray-400 transition"
                >
                    next →
                </button>
            </div>
        </main>
    );
}
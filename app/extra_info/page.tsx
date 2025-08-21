"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function fmtDateIso(date: Date) {
    const pad = (n: number) => `${n}`.padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function ExtraInfo() {
    const router = useRouter();
    const sp = useSearchParams();
    const vehicleIdType = sp.get("vehicleIdType") || "";
    const vehicleIdValue = sp.get("vehicleIdValue") || "";
    const serviceType = sp.get("serviceType") || "";

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>("");

    const dateIso = useMemo(() => (selectedDate ? fmtDateIso(selectedDate) : ""), [selectedDate]);
    const canFetch = useMemo(() => !!dateIso, [dateIso]);
    const now = new Date();

    const filteredSlots = slots.filter((iso) => {
        const d = new Date(iso);
        // keep only future slots
        return d > now;
    });

    // fetch slots when date chosen
    useEffect(() => {
        if (!canFetch) return;
        (async () => {
            const res = await fetch(`/api/appointments/availability?date=${dateIso}`);
            const j = await res.json();
            setSlots(j.slots || []);
        })();
    }, [dateIso, canFetch]);

    const book = async () => {
        if (!selectedSlot) {
            alert("Select a time slot");
            return;
        }
        const res = await fetch("/api/appointments", {
            method: "POST",
            body: JSON.stringify({
                serviceType,
                vehicleIdType,
                vehicleIdValue,
                startAtIso: selectedSlot, // ISO
            }),
        });
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            alert(j.error || "Booking failed");
            return;
        }
        router.push("/logged_home");
    };

    const handleBack = () => {
        // send back filled form
        const qs = new URLSearchParams({
            vehicleIdType,
            vehicleIdValue,
            serviceType,
        }).toString();
        router.push(`/add_appointment?${qs}`);
    };

    return (
        <main
            className="min-h-screen flex flex-col items-center p-8 bg-cover bg-center "
            style={{ backgroundImage: "url('/add_app.jpg')" }}
        >
            <h1 className="text-3xl font-bold mb-2 text-center">Choose Date & Time</h1>
            <p className="text-gray-700 mb-6 text-center">Jobs take 3 hours. We operate 8am–5pm.</p>
            <div className="absolute top-4 left-4">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 shadow"
                >
                    ← Back
                </button>
            </div>

            <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
                {/* Calendar */}
                <div>
                    <label className="block font-semibold mb-3 text-2xl">Select date</label>
                    <div className="flex justify-center">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            fromDate={new Date()} // disables earlier dates
                            className="rounded-lg bg-white p-4 shadow text-gray-600"
                            styles={{
                                caption: { textAlign: "center" }, // center the month caption
                                month: { margin: "0 auto" },      // center the month grid
                            }}
                            modifiers={{
                                disabled: { before: new Date() } // block all days before today
                            }}
                            modifiersStyles={{
                                disabled: { color: "#aaa", backgroundColor: "#f3f3f3", textDecoration: "line-through" }
                            }}
                        />
                    </div>
                </div>

                {/* Slots */}
                {selectedDate && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3">
                            Available time slots for {selectedDate.toDateString()}
                        </h2>
                        {slots.length === 0 ? (
                            <p className="text-gray-600">No slots left for this date.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {slots.map((iso) => {
                                    const d = new Date(iso);
                                    const label = d.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    return (
                                        <button
                                            key={iso}
                                            onClick={() => setSelectedSlot(iso)}
                                            className={`px-4 py-2 rounded-xl border shadow ${
                                                selectedSlot === iso
                                                    ? "ring-4 ring-blue-400 bg-white"
                                                    : "bg-white/60 hover:bg-white"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-10">
                    <button
                        onClick={book}
                        disabled={!selectedSlot}
                        className="w-full py-4 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Book now →
                    </button>
                </div>
            </div>
        </main>
    );
}
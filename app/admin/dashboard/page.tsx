"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface Appointment {
    id: string;
    serviceType: string;
    startAt: string;
    status: string;
    vehicle?: { regoNumber?: string; vinNumber?: string };
    vehicleIdValue?: string;
    user: {
        name: string;
        phoneNumber: string;
        email: string;
    };
}

export default function AdminDashboard() {
    const [ongoingAppointments, setOngoingAppointments] = useState<Appointment[]>([]);
    const [finishedAppointments, setFinishedAppointments] = useState<Appointment[]>([]);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);

    // Load appointments
    useEffect(() => {
        fetch("/api/admin/appointments")
            .then((r) => r.json())
            .then((appointments: Appointment[]) => {
                setOngoingAppointments(appointments.filter((a) => a.status === "ongoing"));
                setFinishedAppointments(appointments.filter((a) => a.status === "completed"));
            })
            .catch(console.error);
    }, []);

    // Mark appointment as finished
    const markAsFinished = async (id: string, userName: string, phoneNumber: string) => {
        setPopupMessage(`Please call ${userName} at ${phoneNumber}`);

        const res = await fetch(`/api/admin/appointments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" }),
        });

        if (res.ok) {
            setOngoingAppointments((prev) => prev.filter((a) => a.id !== id));
            const updated = ongoingAppointments.find((a) => a.id === id);
            if (updated) {
                setFinishedAppointments((prev) => [updated, ...prev]);
            }
        }
    };
    const deleteAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;

        const res = await fetch(`/api/admin/appointments/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setOngoingAppointments((prev) => prev.filter((a) => a.id !== id));
            setFinishedAppointments((prev) => prev.filter((a) => a.id !== id));
        }
    };

    return (
        <main
            className="flex flex-col items-center min-h-screen p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('/admin_dashboard.jpg')" }}
        >
            <h1 className="text-3xl font-bold mb-6">Welcome Mr.Dharmarathna!</h1>

            {/* Popup reminder */}
            {popupMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center text-black">
                        <p className="text-lg font-semibold mb-4">{popupMessage}</p>
                        <button
                            onClick={() => setPopupMessage(null)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Ongoing Appointments */}
            <section className="mb-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Ongoing Appointments</h2>
                {ongoingAppointments.length > 0 ? (
                    <ul className="space-y-4">
                        {ongoingAppointments.map((app) => (
                            <li
                                key={app.id}
                                className="p-4 bg-white rounded-lg shadow flex justify-between items-center text-black"
                            >
                                <div>
                                    <p className="font-bold">
                                        {app.vehicle?.regoNumber
                                            ? `Rego: ${app.vehicle.regoNumber}`
                                            : app.vehicle?.vinNumber
                                                ? `VIN: ${app.vehicle.vinNumber}`
                                                : app.vehicleIdValue
                                                    ? `${app.vehicleIdValue.length === 17 ? "VIN" : "Rego"}: ${app.vehicleIdValue}`
                                                    : "No vehicle info"}
                                    </p>
                                    <p>{app.user.name} — {app.user.email}</p>
                                    <p>📞 {app.user.phoneNumber}</p>
                                    <p>{app.serviceType}</p>
                                    <p>
                                        {new Date(app.startAt).toLocaleDateString()}{" "}
                                        {new Date(app.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => markAsFinished(app.id, app.user.name, app.user.phoneNumber)}
                                        className="text-green-600 hover:text-green-800 text-3xl"
                                    >
                                        <FaCheckCircle />
                                    </button>
                                    <button
                                        onClick={() => deleteAppointment(app.id)}
                                        className="text-red-600 hover:text-red-800 text-2xl"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No ongoing appointments.</p>
                )}
            </section>

            {/* Finished Appointments preview */}
            <section className="w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Finished Appointments</h2>
                    <Link href="/admin/appointment_history" className="text-blue-600 hover:underline">
                        View All →
                    </Link>
                </div>
                {finishedAppointments.length > 0 ? (
                    <ul className="space-y-4">
                        {finishedAppointments.slice(0, 3).map((app) => (
                            <li key={app.id} className="p-4 bg-white rounded-lg shadow text-black">
                                <p className="font-bold">
                                    {app.vehicle?.regoNumber
                                        ? `Rego: ${app.vehicle.regoNumber}`
                                        : app.vehicle?.vinNumber
                                            ? `VIN: ${app.vehicle.vinNumber}`
                                            : app.vehicleIdValue
                                                ? `${app.vehicleIdValue.length === 17 ? "VIN" : "Rego"}: ${app.vehicleIdValue}`
                                                : "No vehicle info"}
                                </p>
                                <p>{app.user.name} — {app.user.email}</p>
                                <p>📞 {app.user.phoneNumber}</p>
                                <p>{app.serviceType}</p>
                                <p>
                                    {new Date(app.startAt).toLocaleDateString()}{" "}
                                    {new Date(app.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No finished appointments yet.</p>
                )}
            </section>
        </main>
    );
}
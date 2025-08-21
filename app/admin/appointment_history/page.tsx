"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";


const loadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    return { jsPDF, autoTable };
};

interface Appointment {
    id: string;
    serviceType: string;
    startAt: string;
    endAt?: string;
    vehicleIdValue?: string;
    user: { name: string; email: string; phoneNumber?: string };
    vehicle?: { regoNumber?: string; vinNumber?: string };
}

export default function AppointmentHistory() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetch("/api/admin/appointments/history")
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.error("Error:", err));
    }, []);

    const generatePDF = async () => {
        const { jsPDF, autoTable } = await loadPDF();
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Appointment History Report", 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [["#", "Booking Date", "Completed Date", "Customer", "Vehicle", "Service Type"]],
            body: appointments.map((app, index) => {
                const vehicleLabel = app.vehicle?.regoNumber
                    ? `Rego: ${app.vehicle.regoNumber}`
                    : app.vehicle?.vinNumber
                        ? `VIN: ${app.vehicle.vinNumber}`
                        : app.vehicleIdValue
                            ? `${app.vehicleIdValue.length === 17 ? "VIN" : "Rego"}: ${app.vehicleIdValue}`
                            : "N/A";

                return [
                    index + 1,
                    new Date(app.startAt).toLocaleString(),
                    app.endAt ? new Date(app.endAt).toLocaleString() : "—",
                    `${app.user.name}\n${app.user.email}\n${app.user.phoneNumber || ""}`,
                    vehicleLabel,
                    app.serviceType,
                ];
            }),
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save("appointment_history.pdf");
    };

    return (
        <div className="p-6">
            {/* Header with button on right */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Appointment History</h1>
                <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                    📄 Download PDF
                </button>
            </div>

            {/* Show appointments */}
            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500">No completed appointments yet.</p>
                ) : (
                    appointments.map((app) => {
                        const vehicleLabel = app.vehicle?.regoNumber
                            ? `Rego: ${app.vehicle.regoNumber}`
                            : app.vehicle?.vinNumber
                                ? `VIN: ${app.vehicle.vinNumber}`
                                : app.vehicleIdValue
                                    ? `${app.vehicleIdValue.length === 17 ? "VIN" : "Rego"}: ${app.vehicleIdValue}`
                                    : "No vehicle info";

                        return (
                            <div
                                key={app.id}
                                className="border p-4 rounded-lg shadow bg-white text-black"
                            >
                                <p className="font-bold">{vehicleLabel}</p>
                                <p>{app.user.name} — {app.user.email} 📞 {app.user.phoneNumber}</p>
                                <p className="text-sm text-gray-600">{app.serviceType}</p>
                                <p className="text-sm">
                                    <strong>Booked:</strong>{" "}
                                    {new Date(app.startAt).toLocaleDateString()}{" "}
                                    {new Date(app.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                                {app.endAt && (
                                    <p className="text-sm">
                                        <strong>Completed:</strong>{" "}
                                        {new Date(app.endAt).toLocaleDateString()}{" "}
                                        {new Date(app.endAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
//admin/history
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// GET all appointments (with User + Vehicle)
export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { startAt: "asc" },
            include: {
                user: true,
                vehicle: true,
            },
        });

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
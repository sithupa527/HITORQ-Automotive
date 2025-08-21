import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { startAt: "desc" },
            include: {
                user: true,
                vehicle: true,
            },
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ error: "Failed to fetch appointment history" }, { status: 500 });
    }
}
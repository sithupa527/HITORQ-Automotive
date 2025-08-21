import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appointments/availability?date=YYYY-MM-DD
// Returns available 3-hour slot starts between 08:00 and 17:00
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");
        if (!dateStr) return NextResponse.json({ error: "date is required" }, { status: 400 });

        const day = new Date(`${dateStr}T00:00:00`);
        const startOfDay = new Date(day);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);

        // Generate candidate starts: 08:00, 11:00, 14:00 (3-hour slots)
        const slots: string[] = [];
        const starts = [8, 11, 14];
        starts.forEach(h => {
            const s = new Date(day);
            s.setHours(h, 0, 0, 0);
            if (s >= startOfDay && s <= endOfDay) slots.push(s.toISOString());
        });

        const appts = await prisma.appointment.findMany({
            where: {
                startAt: { gte: startOfDay },
                endAt: { lte: endOfDay },
            },
            select: { startAt: true, endAt: true },
        });

        const available = slots.filter((iso) => {
            const start = new Date(iso);
            const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
            const conflicts = appts.some(a => a.startAt < end && a.endAt > start);
            return !conflicts;
        });

        return NextResponse.json({ date: dateStr, slots: available });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
    }
}
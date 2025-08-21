import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/appointments?status=ongoing|completed (optional)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") ?? undefined;

        const appts = await prisma.appointment.findMany({
            where: {
                user: { email: session.user.email },
                ...(status ? { status } : {}),
            },
            orderBy: { startAt: "asc" },
        });

        return NextResponse.json(appts);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

// POST /api/appointments
// body: { serviceType, vehicleIdType, vehicleIdValue, description?, startAtIso }
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { serviceType, vehicleIdType, vehicleIdValue, description, startAtIso } = body;

        if (!serviceType || !vehicleIdType || !vehicleIdValue || !startAtIso) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const startAt = new Date(startAtIso);
        const endAt = new Date(startAt.getTime() + 3 * 60 * 60 * 1000); // 3 hours

        // Ensure slot is free (no overlap)
        const overlap = await prisma.appointment.findFirst({
            where: {
                OR: [
                    {
                        startAt: { lt: endAt },
                        endAt: { gt: startAt },
                    },
                ],
            },
        });
        if (overlap) {
            return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
        }

        const appt = await prisma.appointment.create({
            data: {
                userId: user.id,
                serviceType,
                description: description ?? null,
                vehicleIdType,
                vehicleIdValue,
                startAt,
                endAt,
                status: "ongoing",
            },
        });

        return NextResponse.json(appt, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }
}
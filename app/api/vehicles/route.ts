import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const vehicles = await prisma.vehicle.findMany({
            where: { user: { email: session.user.email } },
            orderBy: { id: "asc" },
        });

        return NextResponse.json(vehicles);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { regoNumber, vinNumber, type } = await req.json();
        if (!regoNumber && !vinNumber) {
            return NextResponse.json({ error: "regoNumber or vinNumber required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const vehicle = await prisma.vehicle.create({
            data: {
                regoNumber: regoNumber ?? null,
                vinNumber: vinNumber ?? null,
                type: type ?? null,
                userId: user.id,
            },
        });

        return NextResponse.json(vehicle, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
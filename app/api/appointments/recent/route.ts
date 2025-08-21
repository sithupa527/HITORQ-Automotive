import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await prisma.appointment.findMany({
            where: { user: { email: session.user.email }, status: "completed" },
            orderBy: { updatedAt: "desc" },
            take: 10,
        });
        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error fetching recent appointments" }, { status: 500 });
    }
}
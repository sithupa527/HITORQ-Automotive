// app/api/appointments/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const appt = await prisma.appointment.findUnique({ where: { id } });
    if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(appt);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const updated = await prisma.appointment.update({
            where: { id },
            data,
        });
        return NextResponse.json(updated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error updating appointment" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.appointment.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error deleting appointment" }, { status: 500 });
    }
}

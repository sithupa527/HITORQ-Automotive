// app/api/admin/appointments/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await req.json();

        if (!["ongoing", "completed"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status },
            include: { user: true, vehicle: true },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deletedAppointment = await prisma.appointment.delete({ where: { id } });
        return NextResponse.json({ success: true, data: deletedAppointment }, { status: 200 });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json({ success: false, error: "Failed to delete appointment" }, { status: 500 });
    }
}

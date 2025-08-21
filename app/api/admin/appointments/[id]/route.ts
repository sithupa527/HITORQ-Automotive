import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const deletedAppointment = await prisma.appointment.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, data: deletedAppointment });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to delete appointment" }, { status: 500 });
    }
}
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        if (!["ongoing", "completed"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updated = await prisma.appointment.update({
            where: { id: params.id },
            data: { status },
            include: {
                user: true,
                vehicle: true,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json(
            { error: "Failed to update appointment" },
            { status: 500 }
        );
    }
}

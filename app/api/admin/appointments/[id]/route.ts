import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        await prisma.appointment.delete({
            where: { id: params.id },
        });

        return NextResponse.json(
            { message: "Appointment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json(
            { error: "Failed to delete appointment" },
            { status: 500 }
        );
    }
}
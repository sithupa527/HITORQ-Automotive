import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: create (or return existing) user. Phone is used as password.
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, address, email, phoneNumber } = body;

        if (!name || !address || !email || !phoneNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            // keep existing but ensure username/password set to spec
            const updated = await prisma.user.update({
                where: { id: existing.id },
                data: {
                    name,
                    address,
                    phoneNumber,
                    username: email,
                    password: phoneNumber,
                },
            });
            return NextResponse.json(updated, { status: 200 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                address,
                email,
                phoneNumber,
                username: email,
                password: phoneNumber,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
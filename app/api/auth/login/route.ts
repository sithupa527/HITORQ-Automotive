import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json(); // password is phone number w/out country code

        if (!email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.phoneNumber) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Strip country code if present
        const strippedPhone = user.phoneNumber.replace(/^\+\d{1,3}/, "");

        if (strippedPhone !== password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, email: user.email, name: user.name },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
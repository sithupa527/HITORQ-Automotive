import "./globals.css";
import Providers from "./providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hitorq Automotive",
    description: "Welcome to HITORQ Automotive, your trusted destination for all things automotive. From routine servicing to advanced 4WD upgrades, tyre replacements, diagnostics, and more — we keep your vehicle performing at its best.\n" +
        "\n" +
        "Whether you're looking to book a service, track your vehicle’s progress, or shop quality automotive products, our platform is designed to put you in the driver’s seat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
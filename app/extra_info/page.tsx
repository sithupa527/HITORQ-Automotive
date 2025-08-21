"use client";

import { Suspense } from "react";
import ExtraInfoInner from "./extra-info-inner";

export default function ExtraInfo() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExtraInfoInner />
        </Suspense>
    );
}

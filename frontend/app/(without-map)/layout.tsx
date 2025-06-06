// app/(without-map)/layout.tsx
'use client';

import MapLayout from "../mapLayout";

export default function WithMapLayout({ children }: { children: React.ReactNode }) {
    return (
        <MapLayout>
            <main className="flex-grow pt-25">{children}</main>
        </MapLayout>
    );
}

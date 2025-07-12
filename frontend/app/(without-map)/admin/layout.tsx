// app/(without-map)/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-green-50 to-green-100 pt-24 pb-16 flex">
      {/* Menu latéral */}
      <ul className="menu bg-base-200 rounded-box w-64 shadow-xl text-green-900 h-fit ml-4">
        <li>
          <div className="menu-dropdown-toggle font-bold text-lg">Trip</div>
          <ul className="menu-dropdown menu-dropdown-show ml-4">
            <li>
              <Link href="/admin/trip/create">Création</Link>
            </li>
            <li>
              <Link href="/admin/trip/edit">Modification</Link>
            </li>
            <li>
              <Link href="/admin/trip/delete">Suppression</Link>
            </li>
          </ul>
        </li>
        <li>
          <div className="menu-dropdown-toggle font-bold text-lg">Step</div>
          <ul className="menu-dropdown menu-dropdown-show ml-4">
            <li>
              <Link href="/admin/step/create">Création</Link>
            </li>
            <li>
              <Link href="/admin/step/edit">Modification</Link>
            </li>
            <li>
              <Link href="/admin/step/delete">Suppression</Link>
            </li>
          </ul>
        </li>
      </ul>

      {/* Contenu dynamique */}
      <section className="ml-8 p-6 bg-white rounded-lg shadow-lg flex-1">
        {children}
      </section>
    </main>
  );
}

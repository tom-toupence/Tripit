"use client";

export default function AdminPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-green-50 to-green-100 pt-24 pb-16 flex justify-center items-start">
      <ul className="menu bg-base-200 rounded-box w-64 shadow-xl text-green-900">
        <li>
          <div className="menu-dropdown-toggle font-bold text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            Trip
          </div>
          <ul className="menu-dropdown menu-dropdown-show ml-4">
            <li>
              <a>Création</a>
            </li>
            <li>
              <a>Modification</a>
            </li>
            <li>
              <a>Suppression</a>
            </li>
          </ul>
        </li>

        <li>
          <div className="menu-dropdown-toggle font-bold text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c1.38 0 2.5-1.12 2.5-2.5S13.38 3 12 3s-2.5 1.12-2.5 2.5S10.62 8 12 8zm0 4c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z"
              />
            </svg>
            Step
          </div>
          <ul className="menu-dropdown menu-dropdown-show ml-4">
            <li>
              <a>Création</a>
            </li>
            <li>
              <a>Modification</a>
            </li>
            <li>
              <a>Suppression</a>
            </li>
          </ul>
        </li>
      </ul>
    </main>
  );
}

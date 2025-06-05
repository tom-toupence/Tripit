// app/about/page.tsx

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 top-16">
        <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-tr from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About This Random Project
    </h1>
    <p className="text-lg max-w-xl text-center mb-6">
        Bienvenue sur la page About la plus random du web.
    <br />
    Ici, on fait des sites <span className="font-semibold">trop stylés</span> avec Next.js, du gradient qui claque,
    et un soupçon de bonne humeur (parfois).
    <br /><br />
    Pourquoi cette page existe ? <br />
        Parce qu’on a tous besoin d’une page About, même si personne ne la lit vraiment.
    <br /><br />
    Si t’es arrivé jusque-là, franchement, gg. Par contre,
        <span className="text-green-600 font-bold"> t’as pas de mental </span>
    et tu devrais changer de sport et te mettre au basket. 🏀
      </p>
      <div className="mt-6 opacity-80">
    <span className="text-sm">- L’équipe Random -</span>
    </div>
    </main>
);
}

// app/about/page.tsx

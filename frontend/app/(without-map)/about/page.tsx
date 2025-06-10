"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    "/assets/images/me.png",       // Portrait ou souvenir de voyage
    "/assets/images/rooftop.png",  // Partage, rencontres
    "/assets/images/lantern.png",  // Vietnam, paysages, inspiration
];

export default function AboutPage() {
    return (
        <main className="min-h-screen w-full bg-gradient-to-b from-white via-green-50 to-green-100 pt-24 pb-16 flex flex-col">
            <section className="max-w-5xl mx-auto flex flex-col gap-16">

                {/* 1. Mon goût du voyage */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Image à gauche */}
                    <motion.div
                        className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg h-72 relative bg-green-50"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={images[0]}
                            alt="Voyage et découverte"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                    {/* Texte à droite */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Une passion du voyage & de la découverte
                        </h2>
                        <p className="text-lg text-green-900/90 leading-relaxed">
                            Depuis toujours, j’ai été attiré par l’aventure et la découverte de nouvelles cultures. Voyager, pour moi, c’est bien plus que changer de décor: c’est s’ouvrir à l’inattendu, s’émerveiller devant la beauté du monde, et sortir de sa zone de confort pour mieux se découvrir soi-même. <br /><br />
                            Ce projet est né de ce besoin de garder une trace de ces instants précieux et de partager tout ce que j’ai pu apprendre lors de mes différents périples.
                        </p>
                    </div>
                </div>

                {/* 2. Partager & donner envie de voyager */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                    {/* Image à droite */}
                    <motion.div
                        className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg h-72 relative bg-green-50"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={images[1]}
                            alt="Partage, blog, rencontres"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                    {/* Texte à gauche */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Partager mes conseils, mes galères… et donner envie
                        </h2>
                        <p className="text-lg text-green-900/90 leading-relaxed">
                            À travers ce site, j’ai voulu faire plus qu’un simple carnet de route. J’y partage mes anecdotes, mes coups de cœur, mais aussi les galères, les imprévus qui me sont arrivés. <br /><br />
                            Mon objectif : donner envie de voyager à celles et ceux qui hésitent encore, transmettre quelques astuces, rassurer face à l’inconnu, et surtout : donner un aperçu sincère de la réalité du voyage, entre émerveillement et imprévus.
                            <br /><br />
                            N’hésite pas à me laisser un message sur la page <span className="font-semibold text-green-700">Contact</span>, je serai ravie d’échanger et de découvrir aussi tes propres aventures !
                        </p>
                    </div>
                </div>

                {/* 3. Le Vietnam, un déclic & des paysages à couper le souffle */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Image à gauche */}
                    <motion.div
                        className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg h-72 relative bg-green-50"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={images[2]}
                            alt="Vietnam, paysages, inspiration"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                    {/* Texte à droite */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Le Vietnam&nbsp;: le voyage qui a tout changé
                        </h2>
                        <p className="text-lg text-green-900/90 leading-relaxed">
                            Ce projet a véritablement pris forme lors de mon stage au Vietnam. Ce pays m’a bouleversée par sa diversité, la générosité de ses habitants et la richesse de ses paysages: rizières d’un vert éclatant, lanternes colorées de Hoi An, plages dorées, marchés animés… <br /><br />
                            Cette expérience m’a appris à vivre au rythme d’une culture différente et à m’ouvrir encore plus sur le monde. <br /><br />
                            Si tu cherches de l’inspiration pour tes prochains voyages, ou si tu veux juste t’évader quelques minutes, j’espère que tu trouveras ici de quoi rêver… et surtout, de quoi passer à l’action !
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

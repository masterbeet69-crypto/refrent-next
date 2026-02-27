import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { RefInput } from '@/components/search/RefInput';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-bg min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-ink mb-4 max-w-2xl leading-tight">
            Vérifiez la disponibilité d&apos;un bien en quelques secondes
          </h1>
          <p className="text-ink3 text-lg mb-10 max-w-lg">
            Entrez le code REF du bien immobilier pour connaître son statut instantanément.
          </p>
          <RefInput />
          <p className="mt-4 text-xs text-ink4">
            5 vérifications gratuites par semaine · Accès illimité après inscription
          </p>
        </section>

        {/* How it works */}
        <section className="bg-bg2 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl text-ink mb-3">Comment ça marche</h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: "Obtenez le code REF",  desc: "L'agent immobilier vous communique le code REF du bien." },
              { step: '2', title: 'Entrez le code',       desc: 'Saisissez le code REF dans la barre de recherche.' },
              { step: '3', title: 'Connaissez le statut', desc: 'Disponible, Réservé, Occupé ou Indisponible — en temps réel.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-surf rounded-r3 p-6 shadow-sh1 text-left">
                <div className="w-8 h-8 rounded-rf bg-accl text-acc font-bold text-sm flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-ink mb-1">{title}</h3>
                <p className="text-sm text-ink3">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

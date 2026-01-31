import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import AdminLogo from '../../components/AdminLogo';

export default function ObjectionsCourantes() {
  const navigate = useNavigate();

  const fixerObjections = [
    {
      number: '1️⃣',
      objection: '« Je n\'ai pas le temps »',
      sousTexte: 'méfiance + surcharge mentale',
      reponse: 'Justement, l\'échange sert à voir si ça peut vous en faire gagner.\nSi ce n\'est pas pertinent, on s\'arrête là.',
    },
    {
      number: '2️⃣',
      objection: '« Envoyez-moi un mail »',
      sousTexte: 'défense automatique',
      reponse: 'Bien sûr.\nL\'échange permet juste de vérifier si le mail vaut la peine d\'être lu.\n20 minutes suffisent.',
    },
    {
      number: '3️⃣',
      objection: '« Je ne suis pas intéressé »',
      sousTexte: 'rejet générique',
      reponse: 'Aucun souci.\nAvant de raccrocher, est-ce que l\'IA appliquée à votre travail est un sujet aujourd\'hui… ou pas du tout ?\n\n(on qualifie, on ne force pas)',
    },
    {
      number: '4️⃣',
      objection: '« C\'est encore une formation… »',
      sousTexte: 'saturation du marché',
      reponse: 'Justement, l\'échange sert à voir si celle-ci est différente… ou inutile pour vous.',
    },
    {
      number: '5️⃣',
      objection: '« Je n\'y connais rien en IA »',
      sousTexte: 'peur d\'incompétence',
      reponse: 'C\'est justement le profil pour lequel l\'échange est utile.\nOn ne parle pas de technique, mais d\'usage concret.',
    },
  ];

  const closerObjections = [
    {
      number: '6️⃣',
      objection: '« Je dois réfléchir »',
      sousTexte: 'objection molle / peur de décider',
      reponse: 'Bien sûr.\nSur quoi exactement souhaitez-vous réfléchir ?\n\n(on clarifie, on ne pousse pas)',
    },
    {
      number: '7️⃣',
      objection: '« C\'est trop cher »',
      sousTexte: 'valeur non encore ancrée',
      reponse: 'Comparé à quoi ?\nAu coût de continuer sans structure pendant encore un an ?',
    },
    {
      number: '8️⃣',
      objection: '« Je peux apprendre ça gratuitement sur YouTube »',
      sousTexte: 'confusion information / transformation',
      reponse: 'Oui, comme on peut apprendre le sport seul.\nLa question est : est-ce que ça vous a déjà permis de structurer une pratique durable ?',
    },
    {
      number: '9️⃣',
      objection: '« Je ne suis pas sûr d\'en avoir vraiment besoin »',
      sousTexte: 'manque de projection',
      reponse: 'Si rien ne change dans 6 mois, qu\'est-ce que ça implique pour vous aujourd\'hui ?',
    },
    {
      number: '🔟',
      objection: '« J\'ai déjà essayé l\'IA, ça ne m\'a pas servi »',
      sousTexte: 'mauvaise expérience passée',
      reponse: 'Justement, sans cadre et sans méthode, l\'IA déçoit vite.\nLa formation sert à structurer, pas à tester.',
    },
  ];

  const cpfObjections = [
    {
      number: '1️⃣1️⃣',
      objection: '« C\'est gratuit avec le CPF ? »',
      reponse: 'Le CPF est un droit, pas un argument commercial.\nOn le regarde uniquement si la formation est pertinente pour vous.',
    },
    {
      number: '1️⃣2️⃣',
      objection: '« Je veux absolument utiliser mon CPF »',
      reponse: 'Très bien.\nAvant cela, validons si le projet de formation a réellement du sens pour vous.',
    },
    {
      number: '1️⃣3️⃣',
      objection: '« Je veux en profiter tant que le CPF existe »',
      reponse: 'On ne se forme pas pour profiter d\'un dispositif,\nmais pour répondre à un besoin réel.',
      alert: 'Phrase interdite côté commercial',
    },
  ];

  const sortieObjections = [
    {
      number: '1️⃣4️⃣',
      objection: '« Finalement ce n\'est pas pour moi »',
      reponse: 'Merci pour votre clarté.\nC\'est exactement l\'objectif de cet échange.\n\n(qualité > vente)',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/formation')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <AdminLogo />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Objections Courantes</h1>
              <p className="text-sm text-slate-600">Guide complet de gestion des objections</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12" />
            <h2 className="text-3xl font-bold">OBJECTIONS COURANTES – AISSOCIATE</h2>
          </div>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Réponses conformes et structurées pour gérer toutes les objections en prospection et closing
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-emerald-600 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                <h3 className="text-2xl font-bold">OBJECTIONS EN PHASE FIXER</h3>
              </div>
              <p className="mt-2 text-emerald-50">
                (prospection / qualification – avant toute vente)
              </p>
            </div>

            <div className="space-y-4">
              {fixerObjections.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{item.number}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.objection}</h4>
                      <div className="bg-slate-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Sous-texte :</span> {item.sousTexte}
                        </p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                        <p className="text-sm font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Réponse conforme
                        </p>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                          {item.reponse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-blue-600 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                <h3 className="text-2xl font-bold">OBJECTIONS EN PHASE CLOSER</h3>
              </div>
              <p className="mt-2 text-blue-50">
                (entretien de décision)
              </p>
            </div>

            <div className="space-y-4">
              {closerObjections.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{item.number}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.objection}</h4>
                      <div className="bg-slate-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Sous-texte :</span> {item.sousTexte}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Réponse conforme
                        </p>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                          {item.reponse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-red-600 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-2xl font-bold">OBJECTIONS LIÉES AU CPF</h3>
              </div>
              <p className="mt-2 text-red-50 font-bold">
                (ULTRA SENSIBLE)
              </p>
            </div>

            <div className="space-y-4">
              {cpfObjections.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{item.number}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.objection}</h4>
                      {item.alert && (
                        <div className="bg-red-100 rounded-lg p-3 mb-4 border-l-4 border-red-500">
                          <p className="text-sm font-bold text-red-800 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {item.alert}
                          </p>
                        </div>
                      )}
                      <div className="bg-slate-100 rounded-lg p-4 border-l-4 border-slate-400">
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          {item.alert ? 'Recadrage conforme' : 'Réponse conforme'}
                        </p>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                          {item.reponse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-slate-700 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                <h3 className="text-2xl font-bold">OBJECTIONS DE SORTIE / NO GO</h3>
              </div>
              <p className="mt-2 text-slate-300">
                (et c'est OK)
              </p>
            </div>

            <div className="space-y-4">
              {sortieObjections.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-300">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{item.number}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.objection}</h4>
                      <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-slate-400">
                        <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Réponse conforme
                        </p>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                          {item.reponse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-10 h-10" />
              <h3 className="text-2xl font-bold">RÈGLE D'OR AISSOCIATE</h3>
            </div>
            <p className="text-xl text-center italic mb-2">
              (à afficher aux commerciaux)
            </p>
            <div className="bg-white/20 rounded-xl p-6 mt-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-center leading-relaxed">
                Une objection n'est pas un problème.<br />
                Une pression commerciale, si.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/formation')}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la formation
          </button>
        </div>
      </main>
    </div>
  );
}

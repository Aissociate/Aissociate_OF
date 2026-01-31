import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle2, AlertTriangle, Clock, Target, TrendingUp } from 'lucide-react';
import AdminLogo from '../../components/AdminLogo';

export default function ScriptExplications() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/formation')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <AdminLogo />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Le Script et ses Explications</h1>
            <p className="text-sm text-slate-600">Module Closer obligatoire</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Script Complet - RDV Closer</h2>
              <p className="text-slate-600 mt-2">Formation IA - Diagnostic & Décision</p>
            </div>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-emerald-700" />
              <p className="font-bold text-emerald-900 text-lg">Durée cible : 30 minutes</p>
            </div>
            <p className="text-emerald-800">
              Ce script structure votre rendez-vous pour maximiser l'impact tout en respectant le temps du prospect.
            </p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <div className="border-l-4 border-blue-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">🔔</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Ouverture - Recadrage & Continuité</h3>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-blue-400">
                    <p className="mb-2">"Bonjour Alexandre, c'est [Prénom].</p>
                    <p className="mb-2">Merci de m'avoir accordé ce temps.</p>
                    <p>Vous avez échangé avec [Prénom du fixer] il y a quelques jours, il m'a partagé rapidement votre contexte."</p>
                  </div>
                  <div className="bg-blue-100 rounded p-4">
                    <p className="font-semibold text-blue-900 mb-2">Objectifs :</p>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Assurer la continuité</li>
                      <li>• Valoriser le travail du fixer</li>
                      <li>• Installer un cadre sérieux</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-purple-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xl">🧱</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Cadre du Rendez-vous</h3>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-purple-400">
                    <p className="mb-2">"Avant de commencer, je préfère être clair sur l'objectif de cet échange.</p>
                    <p className="mb-3">Ces 30 minutes servent à :</p>
                    <ul className="mb-3 ml-4 space-y-1">
                      <li>– comprendre votre situation réelle,</li>
                      <li>– voir s'il y a un sujet IA à adresser chez vous,</li>
                      <li>– et décider à la fin si ça vaut le coup d'aller plus loin… ou pas.</li>
                    </ul>
                    <p className="mb-2">Si ce n'est pas pertinent, on s'arrêtera là.</p>
                    <p>Ça vous va comme cadre ?"</p>
                  </div>
                  <div className="bg-purple-100 rounded p-4">
                    <p className="font-semibold text-purple-900 mb-2">Objectifs :</p>
                    <ul className="text-purple-800 text-sm space-y-1">
                      <li>• Rassurer</li>
                      <li>• Baisser la pression</li>
                      <li>• Poser un contrat psychologique</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-emerald-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-2xl">Phase 1 - Diagnostic</h3>
                    <p className="text-emerald-600 font-semibold">70% du temps</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-lg">Usage Actuel</h4>
                    </div>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-emerald-400">
                      <p>"Pour commencer simplement : aujourd'hui, comment l'IA est utilisée chez vous, concrètement ?"</p>
                    </div>
                    <div className="bg-emerald-100 rounded p-3">
                      <p className="font-semibold text-emerald-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-emerald-800 text-sm">
                        <li>• Faire parler</li>
                        <li>• Détecter l'usage réel vs fantasmé</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-lg">Structure & Cadre</h4>
                    </div>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-emerald-400">
                      <p className="mb-2">"Est-ce qu'il existe aujourd'hui :</p>
                      <ul className="ml-4 space-y-1">
                        <li>– des règles claires,</li>
                        <li>– des usages autorisés / interdits,</li>
                        <li>– ou une formation officielle pour vos équipes ?"</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-100 rounded p-3">
                      <p className="font-semibold text-emerald-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-emerald-800 text-sm">
                        <li>• Mettre en évidence le vide structurel</li>
                        <li>• Sans accuser</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-lg">Risque & Responsabilité</h4>
                    </div>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-emerald-400">
                      <p className="mb-2">"Question importante : est-ce que vous savez aujourd'hui :</p>
                      <ul className="ml-4 space-y-1">
                        <li>– qui utilise l'IA,</li>
                        <li>– avec quelles données,</li>
                        <li>– et sous quelle responsabilité juridique ?"</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-100 rounded p-3">
                      <p className="font-semibold text-emerald-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-emerald-800 text-sm">
                        <li>• Activer la conscience du risque</li>
                        <li>• Sans dramatiser</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-emerald-900 text-lg">Vision Dirigeant</h4>
                    </div>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-emerald-400">
                      <p className="mb-2">"Quand vous vous projetez à 12-18 mois, vous aimeriez que l'IA soit plutôt :</p>
                      <ul className="ml-4 space-y-1">
                        <li>– un outil maîtrisé,</li>
                        <li>– ou quelque chose que vous subissez ?"</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-100 rounded p-3">
                      <p className="font-semibold text-emerald-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-emerald-800 text-sm">
                        <li>• Projection</li>
                        <li>• Activation identitaire</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-cyan-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 text-xl">🔄</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Reformulation Stratégique</h3>
                </div>
                <div className="bg-cyan-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-cyan-400">
                    <p className="mb-2">"Si je résume ce que vous m'avez dit :</p>
                    <ul className="mb-3 ml-4 space-y-1">
                      <li>– l'IA est déjà utilisée,</li>
                      <li>– sans cadre précis,</li>
                      <li>– avec des risques que vous n'avez pas forcément le temps de gérer,</li>
                      <li>– et vous aimeriez reprendre la main sans transformer ça en usine à gaz.</li>
                    </ul>
                    <p>C'est fidèle à votre situation ?"</p>
                  </div>
                  <div className="bg-cyan-100 rounded p-4">
                    <p className="font-semibold text-cyan-900 mb-2">Objectifs :</p>
                    <ul className="text-cyan-800 text-sm space-y-1">
                      <li>• Alignement</li>
                      <li>• Faire dire "oui"</li>
                      <li>• Préparer la prescription</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-orange-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-xl">⚖️</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Phase 2 - Polarisation Décisionnelle</h3>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-orange-400">
                    <p className="mb-2">"À ce stade, il y a généralement deux options pour un dirigeant :</p>
                    <p className="mb-1">👉 soit ne rien formaliser et accepter une zone grise,</p>
                    <p className="mb-3">👉 soit poser un cadre simple pour reprendre le contrôle.</p>
                    <p className="mb-2">La question, ce n'est pas si l'IA est utilisée, mais comment elle l'est.</p>
                    <p>Vous vous reconnaissez plutôt dans quelle option ?"</p>
                  </div>
                  <div className="bg-orange-100 rounded p-4">
                    <p className="font-semibold text-orange-900 mb-2">Objectifs :</p>
                    <ul className="text-orange-800 text-sm space-y-1">
                      <li>• Réduire le choix</li>
                      <li>• Rendre l'inaction inconfortable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-rose-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 text-xl">🎁</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Phase 3 - Prescription (PAS Pitch)</h3>
                </div>
                <div className="bg-rose-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-rose-400">
                    <p className="mb-3">"Dans les entreprises qui nous ressemblent, la solution la plus simple n'est pas technique.</p>
                    <p className="mb-2">C'est généralement :</p>
                    <ul className="mb-3 ml-4 space-y-1">
                      <li>– une formation d'initiation claire,</li>
                      <li>– adaptée aux métiers,</li>
                      <li>– avec un cadre juridique et opérationnel simple,</li>
                      <li>– pour que tout le monde parle le même langage."</li>
                    </ul>
                  </div>
                  <div className="bg-rose-100 rounded p-4">
                    <p className="font-semibold text-rose-900 mb-2">Objectifs :</p>
                    <ul className="text-rose-800 text-sm space-y-1">
                      <li>• Positionner la formation comme conséquence logique</li>
                      <li>• Pas comme produit à vendre</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-green-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Financement (Sans Forcer)</h3>
                </div>
                <div className="bg-green-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-green-400">
                    <p>"Un point important : dans beaucoup de cas, ce type de formation est financé via l'OPCO ou le CPF, ce qui évite d'engager votre trésorerie."</p>
                  </div>
                  <div className="bg-green-100 rounded p-4">
                    <p className="font-semibold text-green-900 mb-2">Objectifs :</p>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Lever la barrière prix</li>
                      <li>• Sans vendre</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-indigo-500 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-xl">🧠</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Test d'Adhésion</h3>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded p-4 text-slate-800 mb-4 italic border-l-4 border-indigo-400">
                    <p>"À ce stade, est-ce que ça fait sens pour vous, ou est-ce que vous voyez un frein majeur ?"</p>
                  </div>
                  <div className="bg-indigo-100 rounded p-4">
                    <p className="font-semibold text-indigo-900 mb-2">Objectifs :</p>
                    <ul className="text-indigo-800 text-sm space-y-1">
                      <li>• Faire sortir les objections</li>
                      <li>• Avant le closing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="border-l-4 border-blue-600 pl-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">✅</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl">Closing - Décision Claire</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-bold text-green-900 text-lg mb-3">OPTION OUI</h4>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-green-400">
                      <p className="mb-2">"Dans ce cas, je vous propose quelque chose de simple :</p>
                      <p className="mb-2">on valide ensemble le principe, on regarde les modalités concrètes (financement, planning),</p>
                      <p>et on avance proprement."</p>
                    </div>
                    <div className="bg-green-100 rounded p-3">
                      <p className="font-semibold text-green-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-green-800 text-sm">
                        <li>• Sécuriser la décision</li>
                        <li>• Sans pression</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-3">OPTION NON / PAS MAINTENANT</h4>
                    <div className="bg-white rounded p-4 text-slate-800 mb-3 italic border-l-4 border-slate-400">
                      <p className="mb-2">"Parfait, c'est une décision claire.</p>
                      <p>Au moins, vous savez exactement où vous en êtes sur le sujet, et vous pourrez y revenir si le contexte évolue."</p>
                    </div>
                    <div className="bg-slate-100 rounded p-3">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Objectifs :</p>
                      <ul className="text-slate-800 text-sm">
                        <li>• Sortir par le haut</li>
                        <li>• Préserver la relation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
                Règles d'Or pour les Closers
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    NE PAS FAIRE
                  </h4>
                  <ul className="space-y-3 text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">❌</span>
                      <span>Ne pas pitcher</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">❌</span>
                      <span>Ne pas convaincre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">❌</span>
                      <span>Ne pas sauver le deal</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    À FAIRE
                  </h4>
                  <ul className="space-y-3 text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✅</span>
                      <span>Diagnostiquer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✅</span>
                      <span>Reformuler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✅</span>
                      <span>Faire décider</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold mb-4">Phrase à Ancrer</h3>
                <p className="text-xl italic leading-relaxed">
                  "Je ne vends pas une formation.<br />
                  J'aide un dirigeant à reprendre le contrôle."
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={() => navigate('/formation')}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Retour à la formation
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}

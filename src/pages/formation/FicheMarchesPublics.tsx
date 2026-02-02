import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCheck, Clock, Target, Award, Users, Star, MapPin, Euro, Mail, CheckCircle, Building2, Search, FileText, TrendingUp, Shield, Briefcase } from 'lucide-react';
import AdminLogo from '../../components/AdminLogo';

export default function FicheMarchesPublics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
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
            <h1 className="text-xl font-bold text-slate-900">Fiche Formation Marchés Publics</h1>
            <p className="text-sm text-slate-600">Programme complet et détaillé</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Apprenez à Maîtriser les Marchés Publics</h2>
              <p className="text-slate-600 mt-2">Avec lemarchepublic.fr - Formation pratique et opérationnelle</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-lg mb-8">
            <p className="text-slate-800 leading-relaxed">
              Les marchés publics représentent <strong>plus de 100 milliards d'euros par an en France</strong>. Cette formation vous donne toutes les clés pour accéder à ces opportunités et développer votre chiffre d'affaires avec les collectivités et administrations publiques. Maîtrisez <strong>lemarchepublic.fr</strong>, la plateforme de référence pour identifier et répondre aux appels d'offres.
            </p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                Pourquoi se former aux marchés publics ?
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900">Opportunités Massives</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    Accédez à un marché de 100+ milliards d'euros avec des clients publics fiables et solvables.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900">Sécurité des Paiements</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    Les administrations publiques sont des payeurs sûrs avec des délais de paiement réglementés.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-slate-900">Formation Intensive</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    14 heures pour maîtriser toutes les étapes, de la recherche à la réponse aux appels d'offres.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-cyan-600" />
                    <h4 className="font-bold text-slate-900">Approche Pratique</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    Mise en pratique immédiate sur la plateforme avec accompagnement personnalisé.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-slate-900">Financement OPCO</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    Formation éligible au financement OPCO, FAF et autres dispositifs de formation professionnelle.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                À qui s'adresse cette formation ?
              </h3>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4">Public visé</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Chefs d'entreprise</p>
                      <p className="text-slate-700 text-sm">Dirigeants souhaitant diversifier leurs sources de revenus</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Responsables commerciaux</p>
                      <p className="text-slate-700 text-sm">Cadres en charge du développement commercial B2G</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Créateurs d'entreprise</p>
                      <p className="text-slate-700 text-sm">Entrepreneurs visant les marchés publics dès le démarrage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Responsables développement</p>
                      <p className="text-slate-700 text-sm">Professionnels en charge de la croissance et des nouveaux marchés</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Prérequis</h4>
                  <p className="text-slate-700 text-sm">
                    Connaissance de base de votre activité et de votre offre commerciale. Maîtrise de l'outil informatique et de la navigation internet.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                Programme Détaillé de la Formation
              </h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-emerald-900 text-lg mb-2">
                        Module 1 : Comprendre les Marchés Publics (4h)
                      </h4>
                      <p className="text-emerald-800 text-sm mb-3 italic">
                        Maîtriser le cadre réglementaire et les processus de passation
                      </p>
                      <ul className="text-emerald-800 text-sm space-y-2 mb-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Le cadre juridique :</strong> Code de la commande publique, principes fondamentaux (liberté d'accès, égalité de traitement, transparence)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Les types de marchés :</strong> Marchés publics, marchés subséquents, accords-cadres, concessions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Les seuils de passation :</strong> Marchés à procédure adaptée (MAPA), procédures formalisées, seuils européens</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Les acteurs :</strong> Acheteurs publics, pouvoir adjudicateur, candidats, titulaires, contrôleurs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Le processus de passation :</strong> De la définition du besoin à la notification, calendrier type</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Les critères d'attribution :</strong> Prix, valeur technique, performances environnementales et sociales</span>
                        </li>
                      </ul>
                      <p className="text-sm text-emerald-700 italic font-semibold">Cas pratiques | Analyse de marchés types | Quiz de validation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 text-lg mb-2">
                        Module 2 : Maîtriser lemarchepublic.fr (5h)
                      </h4>
                      <p className="text-blue-800 text-sm mb-3 italic">
                        Devenir expert de la plateforme de référence des marchés publics
                      </p>
                      <ul className="text-blue-800 text-sm space-y-2 mb-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Création du compte entreprise :</strong> Inscription, validation, paramétrage de votre profil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Navigation et recherche :</strong> Interface, filtres avancés, recherche par mots-clés, codes CPV</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Configuration des alertes :</strong> Paramétrage intelligent des alertes email par domaine, zone géographique, montant</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Analyse du DCE :</strong> Lire et comprendre un Dossier de Consultation des Entreprises, identifier les pièces obligatoires</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Gestion des favoris :</strong> Organiser sa veille, suivre les marchés intéressants</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Tableau de bord :</strong> Suivre vos candidatures, gérer vos réponses en cours</span>
                        </li>
                      </ul>
                      <p className="text-sm text-blue-700 italic font-semibold">Atelier pratique sur plateforme | Recherche en direct | Configuration personnalisée</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-orange-900 text-lg mb-2">
                        Module 3 : Optimiser sa Réponse (5h)
                      </h4>
                      <p className="text-orange-800 text-sm mb-3 italic">
                        Construire des dossiers gagnants et augmenter votre taux de succès
                      </p>
                      <ul className="text-orange-800 text-sm space-y-2 mb-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Le dossier administratif :</strong> DC1, DC2, attestations fiscales et sociales, RIB, assurances, documents obligatoires</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>L'offre technique :</strong> Mémoire technique, méthodologie, moyens humains et matériels, références clients</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>L'offre financière :</strong> Décomposition du prix global et forfaitaire (DPGF), acte d'engagement, calcul des prix</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Le dépôt en ligne :</strong> Procédure de dématérialisation, signature électronique, respect des délais</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Le suivi post-candidature :</strong> Comprendre les notifications, gérer les demandes de compléments, référé précontractuel</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Les recours possibles :</strong> Référé suspension, référé précontractuel, recours au tribunal administratif</span>
                        </li>
                      </ul>
                      <p className="text-sm text-orange-700 italic font-semibold">Atelier : Rédaction d'une réponse complète | Analyse de cas réels | Simulation de dépôt</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-600" />
                Objectifs Pédagogiques
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                À l'issue de la formation, le participant sera capable de :
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Comprendre</strong> le fonctionnement des marchés publics, leur cadre réglementaire et les obligations des parties</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Utiliser</strong> efficacement la plateforme lemarchepublic.fr pour identifier les opportunités pertinentes</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Analyser</strong> un dossier de consultation et évaluer la pertinence d'une candidature</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Constituer</strong> un dossier administratif complet et conforme aux exigences réglementaires</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Rédiger</strong> une offre technique convaincante et une offre financière compétitive</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Déposer</strong> sa candidature de manière dématérialisée en respectant les procédures et délais</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Optimiser</strong> ses chances de succès en comprenant les critères d'évaluation des acheteurs publics</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Méthodes Pédagogiques
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Formation Action</h4>
                  <p className="text-blue-800 text-sm">
                    Alternance d'apports théoriques (30%) et de mises en pratique (70%) pour une acquisition immédiate des compétences.
                  </p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg">
                  <h4 className="font-bold text-emerald-900 mb-2">Études de Cas Réels</h4>
                  <p className="text-emerald-800 text-sm">
                    Analyse de vrais dossiers de marchés publics, décryptage des attentes des acheteurs, exemples de réponses gagnantes et perdantes.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-lg">
                  <h4 className="font-bold text-orange-900 mb-2">Travail sur vos Projets</h4>
                  <p className="text-orange-800 text-sm">
                    Recherche d'opportunités réelles correspondant à votre activité et début de constitution de votre premier dossier de réponse.
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-500 p-5 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Ressources Documentaires</h4>
                  <p className="text-slate-800 text-sm">
                    Remise de documents types, check-lists, modèles de mémoires techniques et guide pratique post-formation.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-600" />
                Modalités d'Évaluation
              </h3>

              <div className="bg-slate-50 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Quiz de connaissances</p>
                      <p className="text-slate-700 text-sm">Évaluation des acquis théoriques sur le cadre réglementaire</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Exercices pratiques</p>
                      <p className="text-slate-700 text-sm">Mise en situation : recherche, analyse et début de réponse à un appel d'offres</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Attestation de formation</p>
                      <p className="text-slate-700 text-sm">Remise d'une attestation de fin de formation mentionnant les compétences acquises</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Informations Pratiques
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-50 border-l-4 border-slate-600 p-5 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Durée et Format</h4>
                  <p className="text-slate-700 text-sm mb-2">
                    <strong>14 heures (2 jours)</strong> de formation intensive
                  </p>
                  <p className="text-slate-700 text-sm">
                    Format : Présentiel ou distanciel (classe virtuelle synchrone) selon les sessions
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-600 p-5 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Effectifs</h4>
                  <p className="text-slate-700 text-sm">
                    <strong>Minimum :</strong> 3 participants | <strong>Maximum :</strong> 8 participants (pour garantir la qualité de l'accompagnement)
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-600 p-5 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Accessibilité</h4>
                  <p className="text-slate-700 text-sm">
                    Formation accessible aux personnes en situation de handicap. Merci de nous contacter pour étudier les adaptations possibles.
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-600 p-5 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 mb-2">Délais d'accès</h4>
                  <p className="text-slate-700 text-sm">
                    L'inscription est effective après validation du dossier administratif et du financement. Délai minimum de <strong>14 jours</strong> avant le démarrage de la session.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Informations Administratives</h3>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Lieu de la formation</h4>
                      <p className="text-slate-700 text-sm">
                        <strong>Présentiel :</strong> 36 Chemin de l'État Major, La Montagne, 97417 Saint-Denis, La Réunion
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        <strong>Distanciel :</strong> Via plateforme de visioconférence (lien communiqué avant la formation)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Euro className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-3">Tarifs et Financement</h4>
                      <div className="mb-4">
                        <p className="text-slate-900 font-semibold mb-1">Tarif inter-entreprises :</p>
                        <p className="text-2xl font-bold text-emerald-600">1 050 € HT</p>
                        <p className="text-slate-600 text-sm">par participant</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-slate-900 font-semibold mb-1">Tarif intra-entreprise :</p>
                        <p className="text-slate-700 text-sm">Sur devis (nous consulter)</p>
                      </div>
                      <p className="text-slate-700 text-sm mb-3">Votre formation peut être prise en charge par :</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">OPCO (Opérateurs de Compétences)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">FAF (Fonds d'Assurance Formation)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">Plan de développement des compétences</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">France Travail (demandeurs d'emploi)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">Financement personnel</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mt-3 italic">
                        Nous vous accompagnons dans vos démarches de financement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Contact et Inscription</h4>
                      <p className="text-slate-700 text-sm mb-3">
                        Pour toute question, inscription ou demande de devis :
                      </p>
                      <div className="space-y-1">
                        <p className="text-slate-700 text-sm">
                          <strong>Email :</strong> <a href="mailto:contact@aissociate.re" className="text-emerald-600 hover:text-emerald-700">contact@aissociate.re</a>
                        </p>
                        <p className="text-slate-700 text-sm">
                          <strong>Téléphone :</strong> <a href="tel:0692246860" className="text-emerald-600 hover:text-emerald-700">0692 24 68 60</a>
                        </p>
                        <p className="text-slate-700 text-sm">
                          <strong>Site web :</strong> <a href="https://www.aissociate.re" className="text-emerald-600 hover:text-emerald-700">www.aissociate.re</a>
                        </p>
                      </div>
                      <p className="text-slate-600 text-sm mt-3">
                        <strong>Référent Handicap :</strong> Pour toute situation de handicap nécessitant des adaptations, contactez-nous pour étudier les solutions possibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-8 text-white">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Organisme de Formation Certifié</h3>
                  <div className="space-y-1 text-emerald-100 text-sm">
                    <p><strong>Numéro de déclaration d'activité (NDA) :</strong> 04973754797</p>
                    <p>Enregistré auprès de la DEETS La Réunion</p>
                    <p className="mt-3">RCS St-Denis 995 220 407 - APE 8559A</p>
                    <p>SARL AIssociate au Capital Social de 100 €</p>
                  </div>
                  <p className="mt-4 text-emerald-100 text-xs italic">
                    Cet enregistrement ne vaut pas agrément de l'État
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-gradient-to-r from-slate-50 to-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Search className="w-6 h-6 text-emerald-600" />
                  En Résumé
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Référence</p>
                    <p className="font-bold text-slate-900">MARCHEPUB1</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Durée</p>
                    <p className="font-bold text-slate-900">14 heures (2 jours)</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Tarif</p>
                    <p className="font-bold text-slate-900">1 050 € HT</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Niveau</p>
                    <p className="font-bold text-slate-900">Débutant</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Format</p>
                    <p className="font-bold text-slate-900">Présentiel ou distanciel</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Financement</p>
                    <p className="font-bold text-slate-900">OPCO, FAF, etc.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={() => navigate('/formation')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Retour à la formation
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}

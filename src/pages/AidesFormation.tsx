import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AlertTriangle, TrendingUp, Euro, ShieldCheck, Rocket, Users, Building2, Globe as Globe2, Flame, Target, CheckCircle2, ArrowRight, Clock, Zap, Award, Sparkles, ChevronRight, Timer, Quote, Star, GraduationCap, MessageCircle, LifeBuoy, Heart } from 'lucide-react';

export default function AidesFormation() {
  const [seats, setSeats] = useState(7);
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 23, s: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 47; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const initiatives = [
    {
      title: 'Plan France 2030',
      amount: '2,5 Mds €',
      description: 'Investissement massif de l\'État pour l\'intelligence artificielle dans les entreprises françaises',
      icon: Rocket,
    },
    {
      title: 'FEDER & Région Réunion',
      amount: 'jusqu\'à 90 000 €',
      description: 'Financement européen pour la transformation numérique et l\'adoption de l\'IA par les PME ultra-marines',
      icon: Globe2,
    },
    {
      title: 'OPCO & Plan de Développement des Compétences',
      amount: 'jusqu\'à 100 %',
      description: 'Prise en charge intégrale de la formation IA pour vos salariés par votre opérateur de compétences',
      icon: ShieldCheck,
    },
    {
      title: 'CPF de Transition & FNE-Formation',
      amount: '3 000 € min.',
      description: 'Dispositifs activables immédiatement pour former chaque collaborateur à l\'IA',
      icon: Euro,
    },
    {
      title: 'Crédit d\'Impôt Formation Dirigeant',
      amount: '+ 522 € / an',
      description: 'Avantage fiscal cumulable pour chaque journée de formation du chef d\'entreprise',
      icon: Award,
    },
    {
      title: 'Aide Unique Apprentissage IA',
      amount: '6 000 €',
      description: 'Prime pour l\'embauche d\'un alternant formé aux métiers de l\'intelligence artificielle',
      icon: TrendingUp,
    },
  ];

  const reunionCompanies = [
    'Groupe Bourbon',
    'Run Market',
    'Groupe Caillé',
    'Cilam',
    'Vindemia',
    'Groupe GBH',
    'Groupe Adrien Bellier',
    'Edena',
    'Royal Bourbon Industries',
    'Groupe Quartier Français',
    'Téréos Océan Indien',
    'Groupe Ravate',
  ];

  const fears = [
    {
      icon: AlertTriangle,
      title: 'Vos concurrents ont déjà commencé',
      description: 'Pendant que vous hésitez, 68% des PME réunionnaises du top 100 ont lancé un projet IA en 2025. Le train part sans ceux qui attendent.',
    },
    {
      icon: Users,
      title: 'Le fossé générationnel paralyse vos équipes',
      description: 'Vos séniors gardent le savoir métier, vos juniors maîtrisent le digital. Sans pont, vous perdez les deux. L\'IA est ce pont.',
    },
    {
      icon: Flame,
      title: 'Le marché réunionnais est en crise',
      description: '1 entreprise sur 3 ressent une baisse de marge en 2025. La productivité n\'est plus un luxe, c\'est une question de survie.',
    },
    {
      icon: Clock,
      title: 'Les aides ne dureront pas',
      description: 'Les enveloppes 2026 sont limitées. Chaque semaine d\'attente, c\'est de l\'argent qui part à un concurrent plus rapide que vous.',
    },
  ];

  const testimonials = [
    {
      name: 'Jean-Marc Hoarau',
      role: 'Dirigeant, BTP & Construction',
      company: 'PME 34 salaries - Saint-Denis',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Peur de rater le train',
      quote: "Je pensais que l'IA c'était pour les grands groupes. AIssociate m'a montré qu'avec 7 200 € d'aides cumulées, j'ai pu former toute mon équipe de chantier. On gagne 12h par semaine sur la planification.",
      highlight: '7 200 € d\'aides obtenues',
      rating: 5,
    },
    {
      name: 'Marie-Christine Payet',
      role: 'Fondatrice, Cabinet d\'expertise comptable',
      company: '18 collaborateurs — Saint-Pierre',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Fossé générationnel',
      quote: "Mes séniors refusaient le digital, mes juniors partaient à Paris. Avec la formation IA financée à 100% par notre OPCO, toute l'équipe parle le même langage. Turnover divisé par 3 en 8 mois.",
      highlight: 'Turnover divisé par 3',
      rating: 5,
    },
    {
      name: 'Laurent Vienne',
      role: 'PDG, Distribution alimentaire',
      company: 'Groupe 52 salariés — Le Port',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Concurrence locale',
      quote: "Mon concurrent direct a lancé l'IA avant moi. J'ai serré les dents, monté un dossier avec AIssociate, obtenu 18 400 € d'aides. 6 mois plus tard, j'ai repris 2 points de part de marché.",
      highlight: '+2 pts de part de marché',
      rating: 5,
    },
    {
      name: 'Sandrine Ramassamy',
      role: 'Directrice, Agence de communication',
      company: '9 salariés — Saint-Gilles',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Aides publiques',
      quote: "Je ne connaissais ni le FNE, ni le FEDER Réunion. En 1h de rendez-vous, ils ont identifié 4 dispositifs cumulables. Résultat : 9 800 €, formation IA intégrale payée, zéro avance de trésorerie.",
      highlight: '9 800 € sans avance',
      rating: 5,
    },
    {
      name: 'Frédéric Grondin',
      role: 'Gérant, Société de transport',
      company: '28 chauffeurs — Saint-André',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Crise du marché',
      quote: "Marges écrasées, gasoil qui explose, j'étais à 2 doigts de fermer. L'IA m'a permis d'optimiser les tournées : -23% de km parcourus. L'aide France 2030 a payé 83% du projet.",
      highlight: '-23% de kilomètres',
      rating: 5,
    },
    {
      name: 'Véronique Technau',
      role: 'Directrice RH, Industrie agroalimentaire',
      company: '76 salariés — Le Tampon',
      avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Écart générationnel',
      quote: "On avait 4 générations dans l'usine. L'IA est devenue le langage commun. Mes ouvriers séniors forment les jeunes sur les outils IA, c'est eux qui ont repris du galon. Ambiance transformée.",
      highlight: '4 générations réunies',
      rating: 5,
    },
    {
      name: 'Patrick Fontaine',
      role: 'PDG, Cabinet d\'architecture',
      company: '12 architectes — Saint-Paul',
      avatar: 'https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Opportunité IA mature',
      quote: "J'attendais que l'IA soit « prête ». Elle l'est depuis 18 mois et je ne le savais pas. AIssociate m'a montré 5 cas concrets qui tournent chez mes confrères réunionnais. J'ai signé le jour même.",
      highlight: 'ROI en 4 mois',
      rating: 5,
    },
    {
      name: 'Nadia Boyer',
      role: 'Fondatrice, E-commerce local',
      company: '6 salariés — Saint-Denis',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Montant des aides',
      quote: "On m'avait dit 3 000 € grand maximum. Avec leur expertise, on est monté à 11 250 €. La formation IA couvre le SAV, le marketing, la logistique. Mon CA a bondi de +38% en un trimestre.",
      highlight: '+38% de CA',
      rating: 5,
    },
    {
      name: 'Olivier Bertil',
      role: 'Gérant, Entreprise du bâtiment',
      company: '41 salariés — Sainte-Marie',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Analogie Internet',
      quote: "Mon père disait en 1999 : « Internet c'est un gadget ». Il a fermé en 2008. Je ne referai pas la même erreur avec l'IA. 22 400 € d'aides obtenues, 90 k€ de projet, l'avenir est tracé.",
      highlight: '22 400 € d\'aides',
      rating: 5,
    },
    {
      name: 'Christine Hoareau',
      role: 'Directrice, Centre de santé',
      company: '24 soignants — Saint-Benoît',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
      context: 'Productivité équipe',
      quote: "15 heures récupérées par semaine sur l'administratif. Mes soignants sont enfin dispos pour les patients. C'est humainement ET économiquement le meilleur investissement de ma carrière.",
      highlight: '15h/semaine récupérées',
      rating: 5,
    },
  ];

  const benefits = [
    'Automatiser 30 à 60 % des tâches répétitives de vos équipes',
    'Récupérer 8 à 15 heures par semaine et par collaborateur',
    'Réduire vos coûts opérationnels jusqu\'à -42 %',
    'Gagner des parts de marché pendant que vos concurrents hésitent encore',
    'Transformer vos juniors en profils hybrides IA en moins de 90 jours',
    'Valoriser vos séniors en leur donnant des super-pouvoirs plutôt que de les remplacer',
    'Financer l\'intégralité de la formation avec les aides publiques',
    'Devenir LA référence IA de votre secteur sur l\'île',
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Palais de l'Élysée — République française"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-900/95"></div>

        <div className="absolute top-0 left-0 right-0 flex h-1.5 z-10">
          <div className="flex-1 bg-[#002395]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#ED2939]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-full backdrop-blur-sm">
              <span className="inline-flex h-5 w-7 overflow-hidden rounded-sm shadow-md border border-white/30" aria-label="Drapeau français">
                <span className="flex-1 bg-[#002395]"></span>
                <span className="flex-1 bg-white"></span>
                <span className="flex-1 bg-[#ED2939]"></span>
              </span>
              <span className="text-xs font-bold text-white tracking-wide">RÉPUBLIQUE FRANÇAISE</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
              <Flame className="w-4 h-4" />
              ALERTE CHEFS D'ENTREPRISE RÉUNIONNAIS
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-8 leading-tight">
            L'État vous finance
            <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              jusqu'à 90 000 €
            </span>
            pour intégrer l'IA dans votre PME.
          </h1>

          <p className="text-xl sm:text-2xl text-slate-200 mb-8 leading-relaxed max-w-4xl">
            Pendant que vous lisez ces lignes, <strong className="text-orange-300">vos concurrents à La Réunion transforment leur entreprise avec des aides publiques</strong> dont la plupart des dirigeants ignorent encore l'existence.
          </p>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-4xl">
            En 2026, ce n'est plus une question de "si" vous devez intégrer l'IA. C'est une question de <strong className="text-white">"à quelle vitesse"</strong>. Et l'État paie pour que vous le fassiez.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/formulaire"
              className="group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-5 rounded-xl font-black text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              JE VEUX MES AIDES MAINTENANT
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#preuves"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-5 rounded-xl font-bold text-lg border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              Voir les preuves
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
            <div className="border-l-4 border-orange-500 pl-4">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">3 000 €</div>
              <div className="text-sm text-slate-300">minimum garanti</div>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">5 693 €</div>
              <div className="text-sm text-slate-300">aide moyenne</div>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">90 000 €</div>
              <div className="text-sm text-slate-300">projets ambitieux</div>
            </div>
            <div className="border-l-4 border-rose-500 pl-4">
              <div className="text-3xl sm:text-4xl font-black text-rose-400">-42 %</div>
              <div className="text-sm text-slate-300">coûts en moyenne</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 border-b-4 border-rose-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Timer className="w-6 h-6 animate-pulse" />
          <p className="font-bold text-lg">
            Enveloppe 2026 limitée — Clôture dans{' '}
            <span className="bg-white/20 px-3 py-1 rounded-lg font-mono font-black">
              {String(timeLeft.h).padStart(2, '0')}h {String(timeLeft.m).padStart(2, '0')}m {String(timeLeft.s).padStart(2, '0')}s
            </span>
            {' '}— Plus que <span className="underline decoration-wavy">{seats} places</span> ce mois-ci
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              LA VÉRITÉ QU'ON NE VOUS DIT PAS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Si vous ne bougez pas dans les 90 prochains jours,<br />
              <span className="text-rose-600">vous serez dépassé par vos concurrents.</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ce n'est pas une menace. C'est un constat. Et c'est exactement ce qui s'est passé entre 1999 et 2003 avec Internet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {fears.map((fear, i) => {
              const Icon = fear.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border-2 border-rose-100 hover:border-rose-300 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{fear.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{fear.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <p className="text-xl sm:text-2xl font-bold mb-4">
              Ne laissez pas vos concurrents prendre 12 mois d'avance.
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-white text-rose-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-black text-lg shadow-lg transition-all transform hover:scale-105"
            >
              <AlertTriangle className="w-5 h-5" />
              STOPPER L'HÉMORRAGIE MAINTENANT
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Reunion des dirigeants"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-300 px-4 py-2 rounded-full text-sm font-bold mb-4">
              LE PARALLÈLE HISTORIQUE QUE VOUS NE POUVEZ PAS IGNORER
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
              2026 est à l'IA ce que 1998 était à Internet.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Souvenez-vous des entrepreneurs qui disaient : <em>"Internet, c'est juste une mode."</em><br />
              <strong className="text-orange-300">Où sont-ils aujourd'hui ?</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="text-5xl font-black text-orange-400 mb-4">1998</div>
              <h3 className="text-xl font-bold mb-3">Les pionniers d'Internet</h3>
              <p className="text-slate-300">Ceux qui ont créé leur site dès 1998 dominent encore leur marché 28 ans plus tard. Les autres ont disparu.</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 shadow-2xl shadow-orange-500/20 transform scale-105">
              <div className="text-5xl font-black text-white mb-4">2026</div>
              <h3 className="text-xl font-bold mb-3 text-white">La fenêtre IA se ferme</h3>
              <p className="text-white/90">Les entreprises qui intègrent l'IA maintenant construiront leur avantage pour les 20 prochaines années. Les autres seront rachetées ou fermées.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="text-5xl font-black text-rose-400 mb-4">2030</div>
              <h3 className="text-xl font-bold mb-3">Le point de non-retour</h3>
              <p className="text-slate-300">Selon McKinsey, 70% des entreprises non-IA auront disparu ou seront en difficulté majeure. La fenêtre aura été verrouillée.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-slate-300 mb-5">
              Dans quel camp voulez-vous être ? Les pionniers ou les disparus ?
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl shadow-orange-500/40 transition-all transform hover:scale-105"
            >
              <Rocket className="w-5 h-5" />
              REJOINDRE LES PIONNIERS IA
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              L'ÉTAT A DÉCIDÉ DE PAYER POUR VOUS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
              6 dispositifs publics cumulables<br />
              pour financer votre transformation IA.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Le gouvernement veut que les PME françaises rattrapent leur retard. <strong>Il a mis 2,5 milliards d'euros sur la table.</strong> Votre part est là, il suffit de la prendre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {initiatives.map((init, i) => {
              const Icon = init.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border-2 border-orange-100 hover:border-orange-400 shadow-lg hover:shadow-2xl hover:shadow-orange-200 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-black text-orange-600">{init.amount}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{init.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{init.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl sm:text-3xl font-black mb-4">
              Ces aides sont CUMULABLES entre elles.
            </h3>
            <p className="text-xl text-emerald-50 max-w-3xl mx-auto mb-8">
              La plupart des dirigeants réunionnais n'en activent qu'une seule. Nos clients activent jusqu'à 4 dispositifs simultanément, et obtiennent en moyenne <strong className="text-yellow-300">5 693 €</strong> de financement public pour leur projet IA.
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 hover:bg-yellow-50 px-8 py-4 rounded-xl font-black text-lg shadow-xl transition-all transform hover:scale-105"
            >
              <Euro className="w-5 h-5" />
              CALCULER MES AIDES EN 2 MINUTES
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-emerald-100 mt-4">
              Simulation gratuite et sans engagement
            </p>

          </div>
        </div>
      </section>

      <section id="preuves" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              LA RÉUNION PASSE À L'ACTION
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Les leaders économiques de l'île<br />
              ont <span className="text-orange-600">déjà intégré l'IA</span>.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Pendant que certains se demandent encore "à quoi ça sert", les plus gros acteurs de La Réunion forment leurs équipes et automatisent leurs processus. Vous allez attendre qu'ils raflent tout le marché ?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {reunionCompanies.map((company, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border-2 border-slate-200 hover:border-orange-400 hover:shadow-lg transition-all text-center group"
              >
                <Building2 className="w-8 h-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 text-sm">{company}</div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  IA intégrée
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 text-center">
              <div className="text-5xl font-black text-orange-400 mb-2">68 %</div>
              <div className="text-slate-300">des PME du top 100 réunionnais ont lancé un projet IA en 2025</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-8 text-center shadow-2xl shadow-orange-500/30">
              <div className="text-5xl font-black mb-2">+ 34 %</div>
              <div className="text-orange-50">de productivité moyenne constatée chez nos clients après 6 mois</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">12 mois</div>
              <div className="text-slate-300">de retard cumulé en moyenne pour les entreprises qui n'ont pas encore commencé</div>
            </div>
          </div>

          <div className="mt-12 bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-xl font-bold text-slate-900 mb-2">
              Vous voulez rejoindre ces leaders avant que l'écart ne soit irrattrapable ?
            </p>
            <p className="text-slate-600 mb-6">
              Nos experts analysent votre secteur et identifient qui bouge déjà chez vos concurrents directs.
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg transition-all transform hover:scale-105"
            >
              <Building2 className="w-5 h-5" />
              DEMANDER MON ANALYSE CONCURRENTIELLE
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.4),transparent_70%)]"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award className="w-4 h-4" />
              L'ORGANISME DE FORMATION IA DE RÉFÉRENCE À LA RÉUNION
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
              Plus qu'une formation.<br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Un accompagnement à vie.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-center shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-all">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-white" />
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">+300</div>
              <div className="text-sm sm:text-base font-bold text-orange-50">stagiaires formés à La Réunion</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/50 text-amber-400/50'}`} />
                ))}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-amber-300 mb-2">4,5 / 5</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">note moyenne stagiaires</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">Groupe WhatsApp</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">entraide 7j/7 entre stagiaires</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all">
              <LifeBuoy className="w-10 h-10 mx-auto mb-3 text-orange-400" />
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">Suivi à vie</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">accompagnement au-delà de la formation</div>
            </div>
          </div>

          <div className="mt-10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
            <Heart className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg text-slate-100">
              <strong className="text-white">Nous ne vous lâchons pas à la fin de la formation.</strong> Groupe WhatsApp privé, sessions de révision mensuelles, réponses à vos questions pendant toute votre vie professionnelle.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
              ILS L'ONT FAIT AVANT VOUS — VOICI LEUR HISTOIRE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
              10 dirigeants réunionnais<br />
              <span className="text-orange-600">ont franchi le pas. Sans regret.</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des chefs d'entreprise comme vous. Mêmes peurs au départ, mêmes doutes. Découvrez ce qu'ils ont obtenu après avoir activé les aides et intégré l'IA dans leur PME.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-orange-300 shadow-lg hover:shadow-2xl hover:shadow-orange-100 transition-all relative overflow-hidden group"
              >
                <Quote className="absolute top-4 right-4 w-16 h-16 text-orange-100 group-hover:text-orange-200 transition-colors" />

                <div className="relative">
                  <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black px-3 py-1 rounded-full mb-4">
                    {t.context.toUpperCase()}
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>

                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold mb-6">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.highlight}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-sm text-slate-600">{t.role}</div>
                      <div className="text-xs text-slate-500">{t.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-orange-500/30">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(4)].map((_, idx) => (
                <Star key={idx} className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              ))}
              <Star className="w-6 h-6 fill-yellow-300/60 text-yellow-300/60" />
            </div>
            <p className="text-2xl sm:text-3xl font-black mb-3">
              4,5 / 5 de satisfaction sur plus de 300 stagiaires réunionnais
            </p>
            <p className="text-lg text-orange-50 mb-8 max-w-2xl mx-auto">
              Votre témoignage sera peut-être le 301ème. Mais pour ça, il faut commencer.
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-white text-orange-600 hover:bg-slate-100 px-10 py-5 rounded-xl font-black text-lg shadow-2xl transition-all transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              REJOINDRE NOS 300+ STAGIAIRES
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Equipe travaillant avec IA"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-900/70"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-sm font-bold mb-4">
              CE QUI VOUS ATTEND DE L'AUTRE CÔTÉ
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
              Imaginez votre entreprise dans 90 jours.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Pas dans 5 ans. Dans 90 jours. Voici ce que nos clients réunionnais constatent après un programme de formation IA financé à 100%.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-slate-100">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-2xl font-bold text-white mb-3">
              Ces résultats, ils sont à portée de votre équipe.
            </p>
            <p className="text-lg text-slate-300 mb-8">
              Il suffit d'un premier pas : 30 minutes pour construire votre feuille de route IA personnalisée.
            </p>
            <Link
              to="/formulaire"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-5 rounded-xl font-black text-xl shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105"
            >
              <Target className="w-6 h-6" />
              JE VEUX CES RÉSULTATS EN 90 JOURS
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-orange-400 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full text-sm font-black mb-4">
                <Zap className="w-4 h-4" />
                OFFRE RÉSERVÉE AUX CHEFS D'ENTREPRISE RÉUNIONNAIS
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-4">
                Audit IA Gratuit<br />
                <span className="text-orange-400">+ Simulation d'aides personnalisée</span>
              </h2>
              <p className="text-xl text-slate-300">
                Valeur réelle : 890 € — <strong className="text-white">Gratuit pour les 10 premiers dirigeants du mois</strong>
              </p>
            </div>

            <div className="p-8 sm:p-12">
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                En 30 minutes au téléphone, un expert IA certifié Qualiopi analyse votre entreprise et vous remet :
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'La cartographie des tâches automatisables dans votre PME',
                  'Le montant exact des aides auxquelles vous avez droit',
                  'Un plan d\'action sur 90 jours pour votre équipe',
                  'Le calcul du ROI estimé sur 12 mois',
                  'La liste des concurrents directs déjà équipés en IA',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-l-4 border-rose-500 p-5 rounded-r-xl mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 mb-1">Attention : places ultra-limitées</div>
                    <p className="text-slate-700 text-sm">
                      Nous ne pouvons pas accompagner plus de 10 dirigeants par mois pour garantir la qualité. <strong>Plus que {seats} places disponibles</strong> pour ce mois-ci.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/formulaire"
                onClick={() => setSeats(s => Math.max(1, s - 1))}
                className="group block w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-6 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all transform hover:scale-105 text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  RÉSERVER MON AUDIT GRATUIT
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="text-sm font-semibold text-orange-100 mt-2">
                  Réponse garantie sous 24h ouvrées
                </div>
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Certifié Qualiopi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span>100% La Réunion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl sm:text-2xl text-slate-300 mb-6 italic leading-relaxed">
            "Dans 2 ans, il y aura deux types de PME à La Réunion :<br />
            <strong className="text-orange-400">celles qui auront pris le virage de l'IA</strong><br />
            et celles qui auront disparu."
          </p>
          <p className="text-lg text-slate-400 mb-10">
            La question n'est plus <em>"est-ce que je dois me former ?"</em><br />
            La vraie question c'est : <strong className="text-white">"est-ce que je veux être du bon côté de l'histoire ?"</strong>
          </p>
          <Link
            to="/formulaire"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-10 py-5 rounded-xl font-black text-lg shadow-2xl shadow-orange-500/30 transition-all transform hover:scale-105"
          >
            OUI, JE VEUX EN PROFITER
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <Footer />

      <Link
        to="/formulaire"
        className="fixed bottom-6 right-6 z-40 group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-5 py-4 rounded-full font-black shadow-2xl shadow-orange-500/50 transition-all transform hover:scale-110 flex items-center gap-2 md:hidden"
        aria-label="Réserver mon audit gratuit"
      >
        <Zap className="w-5 h-5" />
        Mes aides
      </Link>
    </div>
  );
}

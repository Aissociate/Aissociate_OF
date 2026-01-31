import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

export default function BlogArticle() {
  const { id } = useParams();

  const article = {
    id: 1,
    title: 'Comment l\'IA transforme la formation professionnelle',
    category: 'Formation',
    date: '15 Janvier 2026',
    readTime: '5 min',
    author: 'Marie Dubois',
    image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=1200',
    content: `
      <p>L'Intelligence Artificielle révolutionne de nombreux secteurs, et la formation professionnelle n'échappe pas à cette transformation. Les nouvelles technologies permettent de personnaliser l'apprentissage, d'améliorer l'engagement des apprenants et d'optimiser les résultats.</p>

      <h2>Une personnalisation sans précédent</h2>
      <p>Grâce à l'IA, chaque apprenant peut bénéficier d'un parcours de formation adapté à son niveau, son rythme et ses objectifs. Les systèmes intelligents analysent les performances en temps réel et ajustent automatiquement le contenu et la difficulté des exercices.</p>

      <h2>Des outils d'assistance intelligents</h2>
      <p>Les chatbots et assistants virtuels permettent aux apprenants d'obtenir des réponses instantanées à leurs questions, 24h/24 et 7j/7. Cette disponibilité permanente améliore significativement l'expérience d'apprentissage et réduit les taux d'abandon.</p>

      <h2>L'analyse prédictive au service de la réussite</h2>
      <p>Les algorithmes d'IA peuvent identifier les apprenants en difficulté avant même qu'ils ne décrochent, permettant ainsi aux formateurs d'intervenir de manière proactive. Cette approche préventive améliore considérablement les taux de réussite.</p>

      <h2>Des contenus toujours à jour</h2>
      <p>L'IA facilite la création et la mise à jour des contenus pédagogiques. Les formateurs peuvent générer rapidement des supports de cours, des quiz et des exercices pratiques, tout en maintenant une qualité constante.</p>

      <h2>Vers une formation hybride optimisée</h2>
      <p>L'avenir de la formation professionnelle réside dans une approche hybride qui combine le meilleur de l'humain et de la machine. L'IA prend en charge les tâches répétitives et l'analyse de données, permettant aux formateurs de se concentrer sur l'accompagnement personnalisé et le développement des soft skills.</p>

      <p><strong>En conclusion</strong>, l'Intelligence Artificielle n'est pas là pour remplacer les formateurs, mais pour les assister et améliorer l'efficacité globale des parcours de formation. Les organismes qui sauront intégrer ces technologies de manière pertinente auront un avantage compétitif significatif dans les années à venir.</p>
    `
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>

      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{article.readTime} de lecture</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Cet article vous a été utile ?
              </h3>
              <p className="text-slate-700 mb-6">
                Découvrez nos formations pour maîtriser l'IA dans votre activité professionnelle
              </p>
              <Link
                to="/formations"
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Voir nos formations
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Articles similaires</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/blog/2" className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Article"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  5 outils IA indispensables pour votre entreprise
                </h3>
                <p className="text-sm text-slate-600">7 min de lecture</p>
              </div>
            </Link>

            <Link to="/blog/3" className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/8438977/pexels-photo-8438977.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Article"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  ChatGPT au service de votre stratégie commerciale
                </h3>
                <p className="text-sm text-slate-600">6 min de lecture</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

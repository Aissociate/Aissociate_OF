import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: 'Comment l\'IA transforme la formation professionnelle',
      excerpt: 'Découvrez comment l\'Intelligence Artificielle révolutionne les méthodes d\'apprentissage et améliore l\'efficacité des formations.',
      category: 'Formation',
      date: '15 Janvier 2026',
      readTime: '5 min',
      image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 2,
      title: '5 outils IA indispensables pour votre entreprise',
      excerpt: 'Une sélection des meilleurs outils d\'IA pour automatiser vos processus et gagner en productivité au quotidien.',
      category: 'Outils',
      date: '10 Janvier 2026',
      readTime: '7 min',
      image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 3,
      title: 'ChatGPT au service de votre stratégie commerciale',
      excerpt: 'Apprenez à utiliser ChatGPT pour optimiser vos processus de vente, qualifier vos leads et améliorer votre closing rate.',
      category: 'Commercial',
      date: '5 Janvier 2026',
      readTime: '6 min',
      image: 'https://images.pexels.com/photos/8438977/pexels-photo-8438977.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const categories = [
    { name: 'Tous', count: 12 },
    { name: 'Formation', count: 5 },
    { name: 'IA & Technologie', count: 4 },
    { name: 'Commercial', count: 3 }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Notre blog</h1>
            <p className="text-xl text-slate-300">
              Conseils, actualités et retours d'expérience sur l'IA, la formation professionnelle et la transformation digitale
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${article.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <Link
                    to={`/blog/${article.id}`}
                    className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
                  >
                    Lire l'article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 sm:p-10 border border-orange-200 text-center">
            <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ne manquez aucun article
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles, conseils et actualités directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-400 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

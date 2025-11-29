class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue</h1>
            <p className="text-gray-600 mb-4">Désolé, quelque chose s'est mal passé.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    return (
      <div className="min-h-screen" data-name="app" data-file="app.js">
        <Navigation currentPage="home" />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="text-6xl mb-4">🤖</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Planning Intelligent Automatique
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                L'algorithme organise automatiquement votre temps entre cours, révisions et hobbies
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => window.location.href = 'planning.html'} 
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                  <div className="icon-zap"></div>
                  Voir mon Planning Auto
                </button>
                <button onClick={() => window.location.href = 'subjects.html'} 
                  className="px-8 py-4 bg-indigo-500/30 backdrop-blur-sm border-2 border-white rounded-xl font-bold text-lg hover:bg-indigo-500/50 transition-all">
                  Gérer mes matières
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        {/* NEW FEATURES BANNER */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white">
              <div className="text-4xl">✨</div>
              <div className="text-center md:text-left">
                <p className="font-bold text-xl mb-1">Nouveau : Intelligence Artificielle de Planning</p>
                <p className="text-emerald-100">Réinsertion automatique des matières mal comprises • Actualisation en temps réel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
              Pourquoi StudyPlanner ?
            </h2>
            <p className="text-center text-xl text-gray-600 mb-16">
              Un seul objectif : maximiser votre apprentissage avec zéro effort d'organisation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon="zap"
                title="100% Automatique"
                description="Planning généré instantanément selon vos cours, matières et hobbies"
                gradient="from-yellow-500 to-orange-500"
                link="planning.html"
              />
              <FeatureCard
                icon="brain"
                title="Réinsertion Auto"
                description="Matières mal comprises replacées automatiquement dans votre planning"
                gradient="from-red-500 to-pink-500"
                link="pomodoro.html"
              />
              <FeatureCard
                icon="library"
                title="SM-2 Intelligent"
                description="Algorithme de répétition espacée pour mémorisation optimale"
                gradient="from-purple-500 to-indigo-500"
                link="subjects.html"
              />
              <FeatureCard
                icon="heart"
                title="Équilibre Vie/Études"
                description="Hobbies intégrés automatiquement • 90min/jour garanties"
                gradient="from-green-500 to-emerald-500"
                link="planning.html"
              />
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Comment ça marche ?
            </h2>
            <div className="space-y-8">
              <StepCard
                number="1"
                title="Ajoutez vos cours et matières"
                description="Entrez votre emploi du temps et les sujets à réviser avec leurs priorités"
                color="blue"
              />
              <StepCard
                number="2"
                title="L'algorithme génère votre planning"
                description="Analyse automatique des créneaux libres et placement intelligent des révisions"
                color="purple"
              />
              <StepCard
                number="3"
                title="Suivez vos sessions Pomodoro"
                description="Étudiez avec le timer et notez votre compréhension (0-5)"
                color="indigo"
              />
              <StepCard
                number="4"
                title="Réinsertion automatique"
                description="Note < 3 ? La matière est replacée automatiquement dans le planning avec priorité maximale"
                color="red"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <StatCard icon="cpu" label="Algorithme SM-2" subtitle="Répétition espacée" />
              <StatCard icon="zap" label="Génération Auto" subtitle="0 clic nécessaire" />
              <StatCard icon="refresh-cw" label="Actualisation" subtitle="Toutes les 5 min" />
              <StatCard icon="target" label="Max 6h/jour" subtitle="Évite surcharge" />
            </div>
          </div>
        </div>

        {/* Library Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Bibliothèque de ressources
              </h2>
              <p className="text-center text-xl text-gray-600 mb-12">
                Centralisez vos PDF de cours et exercices
              </p>
              <div onClick={() => window.location.href = 'library.html'}
                className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 cursor-pointer bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1">
                <div className="bg-white rounded-xl p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <div className="icon-book-open text-5xl text-white"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Bibliothèque de cours
                      </h3>
                      <p className="text-gray-600 text-lg mb-4">
                        Organisez vos ressources PDF par matière pour un accès rapide
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">Cours</span>
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">Exercices</span>
                        <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium">Fiches</span>
                      </div>
                    </div>
                    <div className="icon-arrow-right text-3xl text-indigo-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Prêt à révolutionner vos études ?</h2>
            <p className="text-xl mb-8 text-indigo-100">
              Laissez l'intelligence artificielle organiser votre temps pendant que vous vous concentrez sur l'apprentissage
            </p>
            <button onClick={() => window.location.href = 'planning.html'} 
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl">
              Démarrer maintenant
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 StudyPlanner. Planning intelligent automatique propulsé par l'algorithme SM-2.</p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

function FeatureCard({ icon, title, description, gradient, link }) {
  return (
    <div onClick={() => window.location.href = link}
      className="card hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer">
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}>
        <div className={`icon-${icon} text-3xl text-white`}></div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, color }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    indigo: 'from-indigo-500 to-purple-500',
    red: 'from-red-500 to-orange-500'
  };

  return (
    <div className="flex items-start gap-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${colors[color]} flex-shrink-0 text-white text-2xl font-bold`}>
        {number}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, subtitle }) {
  return (
    <div className="card text-center hover:shadow-xl transition-all">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500">
        <div className={`icon-${icon} text-3xl text-white`}></div>
      </div>
      <div className="text-xl font-bold text-indigo-600 mb-1">{label}</div>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
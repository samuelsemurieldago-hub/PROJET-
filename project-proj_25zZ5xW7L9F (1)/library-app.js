function LibraryApp() {
  try {
    const [resources, setResources] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      title: '', subject: '', type: 'cours', url: '', description: ''
    });
    const [filter, setFilter] = React.useState('all');

    React.useEffect(() => {
      const saved = localStorage.getItem('library');
      setResources(saved ? JSON.parse(saved) : []);
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newResources = [...resources, { ...formData, id: Date.now().toString() }];
      localStorage.setItem('library', JSON.stringify(newResources));
      setResources(newResources);
      setFormData({ title: '', subject: '', type: 'cours', url: '', description: '' });
      setShowForm(false);
    };

    const handleDelete = (id) => {
      const filtered = resources.filter(r => r.id !== id);
      localStorage.setItem('library', JSON.stringify(filtered));
      setResources(filtered);
    };

    const filteredResources = filter === 'all' ? resources : resources.filter(r => r.type === filter);

    const getTypeColor = (type) => {
      const colors = {
        cours: 'bg-indigo-100 text-indigo-700',
        exercice: 'bg-purple-100 text-purple-700',
        fiche: 'bg-pink-100 text-pink-700'
      };
      return colors[type] || colors.cours;
    };

    return (
      <div className="min-h-screen" data-name="library-app" data-file="library-app.js">
        <Navigation currentPage="library" />
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">Bibliothèque de cours</h1>
            <p className="text-xl text-indigo-100">Vos ressources d'apprentissage en un seul endroit</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'btn-primary' : 'bg-gray-200'}`}>
                Tous
              </button>
              <button onClick={() => setFilter('cours')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'cours' ? 'btn-primary' : 'bg-gray-200'}`}>
                Cours
              </button>
              <button onClick={() => setFilter('exercice')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'exercice' ? 'btn-primary' : 'bg-gray-200'}`}>
                Exercices
              </button>
              <button onClick={() => setFilter('fiche')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'fiche' ? 'btn-primary' : 'bg-gray-200'}`}>
                Fiches
              </button>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <div className="flex items-center space-x-2">
                <div className="icon-plus text-lg"></div>
                <span>Ajouter ressource</span>
              </div>
            </button>
          </div>

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Nouvelle ressource</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input type="text" placeholder="Titre" className="input-field" value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  <input type="text" placeholder="Matière" className="input-field" value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                  <select className="input-field" value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="cours">Cours PDF</option>
                    <option value="exercice">Exercices</option>
                    <option value="fiche">Fiche révision</option>
                  </select>
                  <input type="url" placeholder="URL du PDF" className="input-field" value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})} required />
                  <textarea placeholder="Description (optionnel)" className="input-field" rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  <button type="submit" className="btn-primary w-full">Enregistrer</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(resource => (
              <div key={resource.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
                    <div className="icon-file-text text-2xl text-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{resource.title}</h3>
                      <button onClick={() => handleDelete(resource.id)} 
                        className="text-red-500 hover:text-red-700 ml-2">
                        <div className="icon-trash-2 text-lg"></div>
                      </button>
                    </div>
                    <p className="text-sm mb-2" style={{color: 'var(--text-secondary)'}}>
                      {resource.subject}
                    </p>
                    {resource.description && (
                      <p className="text-sm mb-3 text-gray-600">{resource.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1 rounded text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-all">
                        <div className="flex items-center gap-1">
                          <div className="icon-download text-sm"></div>
                          <span>Ouvrir PDF</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="icon-book-open text-6xl mb-4 mx-auto" style={{color: 'var(--text-secondary)'}}></div>
              <p className="text-xl" style={{color: 'var(--text-secondary)'}}>
                Aucune ressource pour le moment
              </p>
              <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
                Ajouter votre première ressource
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('LibraryApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LibraryApp />);
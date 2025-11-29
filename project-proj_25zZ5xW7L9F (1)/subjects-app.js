function SubjectsApp() {
  try {
    const [subjects, setSubjects] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      name: '', estimatedTime: 60, priority: 3
    });

    React.useEffect(() => {
      setSubjects(StorageManager.getSubjects());
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newSubjects = [...subjects, { 
        ...formData, 
        id: Date.now().toString(),
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
        sessions: []
      }];
      StorageManager.saveSubjects(newSubjects);
      setSubjects(newSubjects);
      setFormData({ name: '', estimatedTime: 60, priority: 3 });
      setShowForm(false);
    };

    const handleDelete = (id) => {
      const filtered = subjects.filter(s => s.id !== id);
      StorageManager.saveSubjects(filtered);
      setSubjects(filtered);
    };

    const getPriorityColor = (priority) => {
      const colors = {
        1: 'bg-red-100 text-red-700',
        2: 'bg-orange-100 text-orange-700',
        3: 'bg-yellow-100 text-yellow-700',
        4: 'bg-blue-100 text-blue-700',
        5: 'bg-green-100 text-green-700'
      };
      return colors[priority] || colors[3];
    };

    return (
      <div className="min-h-screen" data-name="subjects-app" data-file="subjects-app.js">
        <Navigation currentPage="subjects" />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Matières à étudier</h1>
              <p style={{color: 'var(--text-secondary)'}}>Gérez vos sujets de révision</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <div className="flex items-center space-x-2">
                <div className="icon-plus text-lg"></div>
                <span>Ajouter</span>
              </div>
            </button>
          </div>

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Nouvelle matière</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom de la matière"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <div>
                    <label className="block mb-2 text-sm font-medium">Temps estimé (minutes)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                      min="15"
                      step="15"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Priorité (1=urgent, 5=faible)</label>
                    <input
                      type="range"
                      className="w-full"
                      min="1"
                      max="5"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    />
                    <div className="text-center font-medium">{formData.priority}</div>
                  </div>
                  <button type="submit" className="btn-primary w-full">Enregistrer</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {subjects.map(subject => (
              <div key={subject.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(subject.priority)}`}>
                        Priorité {subject.priority}
                      </span>
                      <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                        {subject.estimatedTime} min
                      </span>
                      {subject.lastReview && (
                        <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                          Dernière révision: {new Date(subject.lastReview).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(subject.id)} 
                    className="text-red-500 hover:text-red-700">
                    <div className="icon-trash-2 text-xl"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SubjectsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SubjectsApp />);

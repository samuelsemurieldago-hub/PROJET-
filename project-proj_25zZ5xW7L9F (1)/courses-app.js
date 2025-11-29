function CoursesApp() {
  try {
    const [courses, setCourses] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      name: '', day: 'Lundi', startTime: '08:00', 
      endTime: '09:00', type: 'course'
    });

    React.useEffect(() => {
      setCourses(StorageManager.getCourses());
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newCourses = [...courses, { ...formData, id: Date.now().toString() }];
      StorageManager.saveCourses(newCourses);
      setCourses(newCourses);
      setFormData({ name: '', day: 'Lundi', startTime: '08:00', endTime: '09:00', type: 'course' });
      setShowForm(false);
    };

    const handleDelete = (id) => {
      const filtered = courses.filter(c => c.id !== id);
      StorageManager.saveCourses(filtered);
      setCourses(filtered);
    };

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    return (
      <div className="min-h-screen" data-name="courses-app" data-file="courses-app.js">
        <Navigation currentPage="courses" />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Cours & Activités</h1>
              <p style={{color: 'var(--text-secondary)'}}>Gérez votre emploi du temps</p>
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
              <h2 className="text-xl font-bold mb-4">Nouveau cours/activité</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <select className="input-field" value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="course">Cours</option>
                    <option value="activity">Activité personnelle</option>
                  </select>
                  <select className="input-field" value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="time" className="input-field" value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                    <input type="time" className="input-field" value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-primary w-full">Enregistrer</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="card flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{course.name}</h3>
                  <p style={{color: 'var(--text-secondary)'}}>
                    {course.day} • {course.startTime} - {course.endTime} • 
                    {course.type === 'course' ? ' Cours' : ' Activité'}
                  </p>
                </div>
                <button onClick={() => handleDelete(course.id)} 
                  className="text-red-500 hover:text-red-700">
                  <div className="icon-trash-2 text-xl"></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CoursesApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CoursesApp />);
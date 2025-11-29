function HistoryApp() {
  try {
    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
      setSessions(StorageManager.getSessions().reverse());
    }, []);

    const getTotalTime = () => {
      return sessions.reduce((acc, s) => acc + s.duration, 0);
    };

    const getAverageQuality = () => {
      if (sessions.length === 0) return 0;
      const sum = sessions.reduce((acc, s) => acc + s.quality, 0);
      return (sum / sessions.length).toFixed(1);
    };

    const getSessionsBySubject = () => {
      const bySubject = {};
      sessions.forEach(s => {
        if (!bySubject[s.subjectName]) {
          bySubject[s.subjectName] = { count: 0, time: 0 };
        }
        bySubject[s.subjectName].count++;
        bySubject[s.subjectName].time += s.duration;
      });
      return bySubject;
    };

    const subjectStats = getSessionsBySubject();

    return (
      <div className="min-h-screen" data-name="history-app" data-file="history-app.js">
        <Navigation currentPage="history" />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Historique & Statistiques</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
                  <div className="icon-clock text-xl text-blue-600"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{getTotalTime()} min</div>
                  <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Temps total</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
                  <div className="icon-target text-xl text-green-600"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Sessions</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100">
                  <div className="icon-star text-xl text-purple-600"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{getAverageQuality()}/5</div>
                  <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Qualité moyenne</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Par matière</h2>
              <div className="space-y-3">
                {Object.entries(subjectStats).map(([name, stats]) => (
                  <div key={name} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                        {stats.count} session{stats.count > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{stats.time} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Dernières sessions</h2>
              <div className="space-y-3">
                {sessions.slice(0, 10).map(session => (
                  <div key={session.id} className="flex justify-between items-center pb-3 border-b" style={{borderColor: 'var(--border-color)'}}>
                    <div>
                      <div className="font-medium">{session.subjectName}</div>
                      <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                        {new Date(session.timestamp).toLocaleDateString('fr-FR')} - {session.duration} min
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded text-sm bg-gray-100">
                      Qualité: {session.quality}/5
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('HistoryApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HistoryApp />);
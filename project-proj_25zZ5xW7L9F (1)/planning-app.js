function PlanningApp() {
  const [weekPlanning, setWeekPlanning] = React.useState(null);
  const [hobbies, setHobbies] = React.useState([]);
  const [showHobbyForm, setShowHobbyForm] = React.useState(false);
  const [newHobby, setNewHobby] = React.useState('');
  const [selectedDay, setSelectedDay] = React.useState('Lundi');
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState(null);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // CHARGEMENT AUTO AU DÉMARRAGE
  React.useEffect(() => {
    const savedHobbies = StorageManager.getHobbies();
    setHobbies(savedHobbies);

    // Vérifier si mise à jour nécessaire
    const needsUpdate = StorageManager.needsUpdate();
    const savedData = StorageManager.getPlanning();

    if (needsUpdate || !savedData) {
      // GÉNÉRATION AUTO
      const newPlanning = SmartPlanner.autoGenerate();
      setWeekPlanning(newPlanning);
      setLastUpdate(new Date());
    } else {
      setWeekPlanning(savedData.planning);
      setLastUpdate(new Date(savedData.generatedAt));
    }
  }, []);

  // AUTO-REFRESH toutes les 5 min si activé
  React.useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (StorageManager.needsUpdate()) {
        const newPlanning = SmartPlanner.autoGenerate();
        setWeekPlanning(newPlanning);
        setLastUpdate(new Date());
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleAddHobby = (e) => {
    e.preventDefault();
    if (newHobby.trim()) {
      const updated = [...hobbies, { id: Date.now().toString(), name: newHobby }];
      setHobbies(updated);
      StorageManager.saveHobbies(updated);
      setNewHobby('');
      setShowHobbyForm(false);
      
      // Régénérer planning
      const newPlanning = SmartPlanner.autoGenerate();
      setWeekPlanning(newPlanning);
      setLastUpdate(new Date());
    }
  };

  const handleDeleteHobby = (id) => {
    const updated = hobbies.filter(h => h.id !== id);
    setHobbies(updated);
    StorageManager.saveHobbies(updated);
    
    // Régénérer planning
    const newPlanning = SmartPlanner.autoGenerate();
    setWeekPlanning(newPlanning);
    setLastUpdate(new Date());
  };

  const handleManualRefresh = () => {
    const newPlanning = SmartPlanner.autoGenerate();
    setWeekPlanning(newPlanning);
    setLastUpdate(new Date());
  };

  const getColorClass = (item) => {
    if (item.type === 'study') {
      if (item.needsReview) return 'bg-red-200 border-l-4 border-red-600';
      if (item.urgent) return 'bg-orange-100 border-l-4 border-orange-500';
      return item.priority <= 2 ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-blue-100 border-l-4 border-blue-500';
    }
    return 'bg-green-100 border-l-4 border-green-500';
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000 / 60);
    if (diff < 1) return 'À l\'instant';
    if (diff === 1) return 'Il y a 1 minute';
    if (diff < 60) return `Il y a ${diff} minutes`;
    return lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const dayData = weekPlanning ? weekPlanning[selectedDay] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navigation currentPage="planning" />
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🤖 Planning Intelligent Auto</h1>
            <p className="text-indigo-100 mb-4">Mis à jour automatiquement selon vos cours, matières et hobbies</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <label className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/30 transition-all">
                <input type="checkbox" checked={autoRefresh} 
                  onChange={(e) => setAutoRefresh(e.target.checked)} 
                  className="w-4 h-4" />
                <span>Actualisation auto (5min)</span>
              </label>
              <button onClick={handleManualRefresh} 
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2">
                <div className="icon-refresh-cw"></div>
                Rafraîchir maintenant
              </button>
              {lastUpdate && (
                <span className="text-sm text-indigo-200">
                  Dernière mise à jour : {formatLastUpdate()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* HOBBIES */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="icon-heart text-red-500"></div>
              Mes Hobbies
            </h2>
            <button onClick={() => setShowHobbyForm(!showHobbyForm)} className="btn-primary">
              <div className="flex items-center gap-2">
                <div className="icon-plus"></div>
                <span>Ajouter</span>
              </div>
            </button>
          </div>

          {showHobbyForm && (
            <form onSubmit={handleAddHobby} className="mb-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Ex: Sport, Lecture, Gaming..." 
                  className="input-field flex-1" value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)} />
                <button type="submit" className="btn-primary">Ajouter</button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {hobbies.map(hobby => (
              <div key={hobby.id} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <span>{hobby.name}</span>
                <button onClick={() => handleDeleteHobby(hobby.id)} className="hover:text-red-600">
                  <div className="icon-x text-sm"></div>
                </button>
              </div>
            ))}
            {hobbies.length === 0 && (
              <p className="text-gray-500">Ajoutez vos activités pour un planning équilibré (90 min/jour intégrées automatiquement)</p>
            )}
          </div>
        </div>

        {/* PLANNING */}
        {weekPlanning && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {days.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedDay === day ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white hover:bg-gray-50'
                  }`}>
                  {day}
                </button>
              ))}
            </div>

            {dayData && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-indigo-600">{dayData.stats.studySessions}</div>
                    <div className="text-sm text-gray-600">Sessions étude</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-blue-600">{dayData.stats.totalStudyTime} min</div>
                    <div className="text-sm text-gray-600">Temps révision</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-green-600">{dayData.stats.totalHobbyTime} min</div>
                    <div className="text-sm text-gray-600">Temps hobbies</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-red-600">{dayData.stats.urgentSessions}</div>
                    <div className="text-sm text-gray-600">Révisions urgentes</div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-2xl font-bold mb-4">Planning {selectedDay}</h3>
                  <div className="space-y-3">
                    {dayData.courses.map((course, idx) => (
                      <div key={idx} className="p-4 bg-purple-100 border-l-4 border-purple-500 rounded-lg">
                        <div className="font-bold text-lg flex items-center gap-2">
                          <div className="icon-book-open"></div>
                          {course.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course.startTime} - {course.endTime} • Cours fixe
                        </div>
                      </div>
                    ))}

                    {dayData.schedule.map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${getColorClass(item)}`}>
                        <div className="font-bold text-lg flex items-center gap-2 flex-wrap">
                          {item.type === 'study' ? (
                            <>
                              <div className="icon-brain"></div>
                              {item.name}
                              {item.needsReview && (
                                <span className="text-xs bg-red-600 text-white px-3 py-1 rounded font-bold animate-pulse">
                                  ⚠️ À REVOIR (Pomodoro raté)
                                </span>
                              )}
                              {item.urgent && !item.needsReview && (
                                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">URGENT</span>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="icon-heart"></div>
                              {item.name}
                              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">HOBBY</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {SmartPlanner.formatTimeSlot(item)} • {item.duration} min
                          {item.type === 'study' && <span className="ml-2">• Priorité {item.priority}</span>}
                          {item.daysOverdue > 0 && (
                            <span className="ml-2 text-red-600 font-medium">
                              • {item.daysOverdue}j de retard
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {dayData.courses.length === 0 && dayData.schedule.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <div className="icon-calendar-off text-6xl mb-4"></div>
                        <p className="text-xl">Aucune activité planifiée ce jour</p>
                        <p className="text-sm mt-2">Ajoutez des cours ou des matières pour générer le planning</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {!weekPlanning && (
          <div className="card text-center py-12">
            <div className="icon-loader animate-spin text-6xl text-indigo-600 mb-4 mx-auto"></div>
            <p className="text-xl">Génération du planning en cours...</p>
          </div>
        )}

        {/* AIDE */}
        <div className="card mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-lg">
            <div className="icon-lightbulb text-green-600 text-xl"></div>
            Intelligence automatique
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-2">✅ Génération automatique</p>
              <ul className="space-y-1 ml-4">
                <li>• Planning créé au chargement (0 clic)</li>
                <li>• Actualisation toutes les 5 min</li>
                <li>• Détection créneaux libres</li>
                <li>• Placement optimal des révisions</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">🔴 Réinsertion intelligente</p>
              <ul className="space-y-1 ml-4">
                <li>• Note Pomodoro &lt; 3 → matière replacée</li>
                <li>• +100 points de priorité</li>
                <li>• Badge rouge "À REVOIR"</li>
                <li>• Révision prioritaire dès demain</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">💚 Équilibre garanti</p>
              <ul className="space-y-1 ml-4">
                <li>• 90 min hobbies/jour intégrés</li>
                <li>• Max 6h d'étude/jour</li>
                <li>• Pauses auto 10 min</li>
                <li>• Alternance 2 études → 1 hobby</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">🧠 Algorithme SM-2</p>
              <ul className="space-y-1 ml-4">
                <li>• Répétition espacée optimale</li>
                <li>• Priorisation par urgence</li>
                <li>• Adaptation à la difficulté</li>
                <li>• Mémorisation maximale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PlanningApp />);
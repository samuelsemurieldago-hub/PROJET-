function PomodoroApp() {
  try {
    const [subjects, setSubjects] = React.useState([]);
    const [selectedSubject, setSelectedSubject] = React.useState(null);
    const [duration, setDuration] = React.useState(25);
    const [timeLeft, setTimeLeft] = React.useState(duration * 60);
    const [isRunning, setIsRunning] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);

    React.useEffect(() => {
      setSubjects(StorageManager.getSubjects());
    }, []);

    React.useEffect(() => {
      setTimeLeft(duration * 60);
    }, [duration]);

    React.useEffect(() => {
      let interval = null;
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(time => {
            if (time <= 1) {
              setIsRunning(false);
              setIsComplete(true);
              return 0;
            }
            return time - 1;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
      if (!selectedSubject) {
        alert('⚠️ Veuillez sélectionner une matière avant de démarrer');
        return;
      }
      setIsRunning(true);
    };

    const handleQualitySubmit = (quality) => {
      const subject = subjects.find(s => s.id === selectedSubject);
      
      // Mettre à jour avec SM-2
      const updatedSubject = SM2Algorithm.updateSubjectAfterSession(subject, quality);
      
      // NOUVEAU : Si mauvaise note (< 3), marquer needsReview = true
      if (quality < 3) {
        updatedSubject.needsReview = true;
        
        // Notification visuelle
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="icon-alert-circle text-2xl"></div>
            <div>
              <p class="font-bold">Matière replacée dans le planning !</p>
              <p class="text-sm">"${subject.name}" sera prioritaire demain</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
      } else {
        updatedSubject.needsReview = false;
      }
      
      const updatedSubjects = subjects.map(s => s.id === selectedSubject ? updatedSubject : s);
      StorageManager.saveSubjects(updatedSubjects);
      
      // Sauvegarder session
      StorageManager.addSession({
        subjectId: selectedSubject,
        subjectName: subject.name,
        duration: duration,
        quality: quality,
        timestamp: new Date().toISOString()
      });
      
      // NOUVEAU : Marquer planning à mettre à jour
      StorageManager.setNeedsUpdate(true);
      
      // Reset
      setIsComplete(false);
      setTimeLeft(duration * 60);
      setSelectedSubject(null);
      setSubjects(updatedSubjects);
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    // Compter matières à revoir
    const needsReviewCount = subjects.filter(s => s.needsReview).length;

    return (
      <div className="min-h-screen" data-name="pomodoro-app" data-file="pomodoro-app.js">
        <Navigation currentPage="pomodoro" />
        
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-2">⏱️ Session Pomodoro</h1>
            <p className="text-purple-100">Étudiez avec concentration • Notez votre compréhension</p>
            {needsReviewCount > 0 && (
              <div className="mt-4 inline-block bg-red-500 px-6 py-2 rounded-lg font-bold animate-pulse">
                ⚠️ {needsReviewCount} matière{needsReviewCount > 1 ? 's' : ''} à revoir prioritairement
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {!isComplete ? (
            <div className="card text-center">
              <div className="mb-6">
                <label className="block text-left font-bold mb-2 text-lg">Choisir une matière</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 text-lg font-medium"
                  style={{borderColor: 'var(--border-color)'}}
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={isRunning}
                >
                  <option value="">📚 Sélectionner une matière...</option>
                  {subjects
                    .sort((a, b) => (b.needsReview ? 1 : 0) - (a.needsReview ? 1 : 0))
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.needsReview ? '🔴 ' : ''}{s.name} 
                        {s.needsReview ? ' (À REVOIR PRIORITÉ)' : ''}
                      </option>
                    ))
                  }
                </select>
                {subjects.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    ⚠️ Aucune matière disponible. Ajoutez-en dans la section "Matières".
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-bold text-lg">Durée de la session</label>
                <div className="flex justify-center space-x-4">
                  {[25, 35, 50].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      disabled={isRunning}
                      className={`px-8 py-4 rounded-xl text-lg font-bold transition-all ${
                        duration === d 
                          ? 'btn-primary shadow-lg scale-110' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-12">
                <div className="text-7xl font-bold mb-6" style={{color: 'var(--primary-color)'}}>
                  {formatTime(timeLeft)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-all duration-1000"
                    style={{
                      backgroundColor: 'var(--primary-color)', 
                      width: `${progress}%`
                    }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  {isRunning ? 'Session en cours...' : 'Prêt à démarrer'}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {!isRunning ? (
                  <button onClick={handleStart} disabled={!selectedSubject} 
                    className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="flex items-center space-x-2">
                      <div className="icon-play text-xl"></div>
                      <span>Démarrer</span>
                    </div>
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsRunning(false)} 
                      className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-600">
                      <div className="flex items-center space-x-2">
                        <div className="icon-pause text-xl"></div>
                        <span>Pause</span>
                      </div>
                    </button>
                    <button onClick={() => {
                      setIsRunning(false);
                      setTimeLeft(duration * 60);
                    }} 
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-red-600">
                      <div className="flex items-center space-x-2">
                        <div className="icon-square text-xl"></div>
                        <span>Arrêter</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div className="icon-check-circle text-7xl mb-4 mx-auto text-green-500"></div>
              <h2 className="text-3xl font-bold mb-4">Session terminée ! 🎉</h2>
              <p className="text-xl mb-8" style={{color: 'var(--text-secondary)'}}>
                Comment avez-vous trouvé cette session ?
              </p>
              
              <div className="flex justify-center space-x-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map(q => (
                  <button
                    key={q}
                    onClick={() => handleQualitySubmit(q)}
                    className={`w-16 h-16 rounded-xl border-2 font-bold text-xl transition-all transform hover:scale-110 ${
                      q < 3 
                        ? 'hover:bg-red-100 hover:border-red-500 border-red-300' 
                        : 'hover:bg-green-100 hover:border-green-500 border-green-300'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 text-left">
                <p className="font-bold text-lg mb-3 flex items-center gap-2">
                  <div className="icon-info text-yellow-600"></div>
                  Guide de notation
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap">0-2</div>
                    <div>
                      <p className="font-bold text-red-700">Très difficile, pas compris</p>
                      <p className="text-sm text-gray-700">
                        → La matière sera <strong>replacée automatiquement</strong> dans votre planning avec <strong>priorité maximale</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap">3-5</div>
                    <div>
                      <p className="font-bold text-green-700">Compris, progression normale</p>
                      <p className="text-sm text-gray-700">
                        → Prochaine révision calculée selon l'algorithme SM-2 (répétition espacée)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('PomodoroApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PomodoroApp />);
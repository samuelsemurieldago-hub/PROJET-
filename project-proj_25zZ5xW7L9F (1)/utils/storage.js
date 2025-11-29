// ==================== STORAGE MANAGER AMÉLIORÉ ====================
const StorageManager = {
  // Cours
  getCourses: () => {
    try {
      return JSON.parse(localStorage.getItem('courses') || '[]');
    } catch (e) {
      console.error('Error loading courses:', e);
      return [];
    }
  },
  saveCourses: (courses) => {
    localStorage.setItem('courses', JSON.stringify(courses));
    StorageManager.setNeedsUpdate(true);
  },

  // Matières
  getSubjects: () => {
    try {
      return JSON.parse(localStorage.getItem('subjects') || '[]');
    } catch (e) {
      console.error('Error loading subjects:', e);
      return [];
    }
  },
  saveSubjects: (subjects) => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    StorageManager.setNeedsUpdate(true);
  },

  // Hobbies
  getHobbies: () => {
    try {
      return JSON.parse(localStorage.getItem('hobbies') || '[]');
    } catch (e) {
      console.error('Error loading hobbies:', e);
      return [];
    }
  },
  saveHobbies: (hobbies) => {
    localStorage.setItem('hobbies', JSON.stringify(hobbies));
    StorageManager.setNeedsUpdate(true);
  },

  // Sessions Pomodoro
  getSessions: () => {
    try {
      return JSON.parse(localStorage.getItem('sessions') || '[]');
    } catch (e) {
      console.error('Error loading sessions:', e);
      return [];
    }
  },
  addSession: (session) => {
    const sessions = StorageManager.getSessions();
    const newSession = {
      ...session,
      id: Date.now().toString(),
      timestamp: session.timestamp || new Date().toISOString()
    };
    sessions.push(newSession);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  },

  // Planning généré
  savePlanning: (planning) => {
    localStorage.setItem('autoPlanning', JSON.stringify({
      planning: planning,
      generatedAt: new Date().toISOString()
    }));
  },
  getPlanning: () => {
    try {
      const data = localStorage.getItem('autoPlanning');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading planning:', e);
      return null;
    }
  },

  // Flag de mise à jour
  needsUpdate: () => {
    return localStorage.getItem('planningNeedsUpdate') === 'true';
  },
  setNeedsUpdate: (value) => {
    localStorage.setItem('planningNeedsUpdate', value.toString());
  },

  // Bibliothèque
  getLibrary: () => {
    try {
      return JSON.parse(localStorage.getItem('library') || '[]');
    } catch (e) {
      console.error('Error loading library:', e);
      return [];
    }
  },
  saveLibrary: (library) => {
    localStorage.setItem('library', JSON.stringify(library));
  }
};
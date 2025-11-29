function Navigation({ currentPage }) {
  try {
    const navItems = [
      { id: 'planning', label: '📅 Planning', icon: 'calendar', page: 'planning.html' },
      { id: 'courses', label: 'Cours', icon: 'book-open', page: 'courses.html' },
      { id: 'subjects', label: 'Matières', icon: 'library', page: 'subjects.html' },
      { id: 'pomodoro', label: 'Pomodoro', icon: 'timer', page: 'pomodoro.html' },
      { id: 'library', label: 'Bibliothèque', icon: 'folder', page: 'library.html' },
      { id: 'history', label: 'Stats', icon: 'chart-bar', page: 'history.html' }
    ];

    const handleNavigate = (page) => {
      window.location.href = page;
    };

    return (
      <nav className="bg-white border-b shadow-sm" style={{borderColor: 'var(--border-color)'}} data-name="navigation" data-file="components/Navigation.js">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = 'index.html'}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
                <div className="icon-zap text-xl text-white"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyPlanner</span>
            </div>
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    currentPage === item.id 
                      ? 'text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  style={currentPage === item.id ? {backgroundColor: 'var(--primary-color)'} : {color: 'var(--text-secondary)'}}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`icon-${item.icon} text-lg`}></div>
                    <span className="hidden md:inline">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}
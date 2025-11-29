// ==================== ALGORITHME SM-2 AMÉLIORÉ ====================
const SM2Algorithm = {
  /**
   * Met à jour une matière après une session Pomodoro
   * @param {Object} subject - La matière à mettre à jour
   * @param {Number} quality - Note de 0 à 5 (0 = très difficile, 5 = très facile)
   * @returns {Object} - Matière mise à jour
   */
  updateSubjectAfterSession(subject, quality) {
    let { repetitions = 0, easeFactor = 2.5, interval = 0 } = subject;

    if (quality >= 3) {
      // Bonne compréhension : progression normale
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
      
      // Ajustement du facteur de facilité
      easeFactor = Math.max(
        1.3, 
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      );
    } else {
      // Mauvaise compréhension : réinitialisation
      repetitions = 0;
      interval = 1; // Réviser demain
    }

    // Calcul de la prochaine date de révision
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      ...subject,
      repetitions,
      easeFactor: parseFloat(easeFactor.toFixed(2)),
      interval,
      nextReview: nextReview.toISOString(),
      lastReview: new Date().toISOString(),
      // NOUVEAU : Marquer comme prioritaire si mauvaise note
      needsReview: quality < 3
    };
  },

  /**
   * Calcule le score de priorité d'une matière
   * @param {Object} subject - La matière
   * @returns {Number} - Score de priorité (plus élevé = plus urgent)
   */
  calculatePriority(subject) {
    const today = new Date();
    const nextReview = subject.nextReview ? new Date(subject.nextReview) : today;
    const daysOverdue = Math.max(0, Math.ceil((today - nextReview) / (1000 * 60 * 60 * 24)));
    
    // Score de base selon priorité utilisateur (1 = urgent = 50 points, 5 = bas = 10 points)
    const priorityScore = (6 - subject.priority) * 10;
    
    // Score d'urgence SM-2 (5 points par jour de retard)
    const urgencyScore = daysOverdue * 5;
    
    // BOOST ÉNORME si needsReview = true (100 points supplémentaires)
    const needsReviewBonus = subject.needsReview ? 100 : 0;
    
    return priorityScore + urgencyScore + needsReviewBonus;
  },

  /**
   * Vérifie si une matière doit être révisée aujourd'hui
   * @param {Object} subject - La matière
   * @returns {Boolean}
   */
  shouldReviewToday(subject) {
    if (subject.needsReview) return true;
    
    const today = new Date();
    const nextReview = subject.nextReview ? new Date(subject.nextReview) : today;
    return nextReview <= today;
  }
};
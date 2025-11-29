// ==================== ALGORITHME DE GÉNÉRATION AUTOMATIQUE ====================
const PlanningGenerator = {
  config: {
    startHour: 7,
    endHour: 22,
    minSessionTime: 25,
    breakTime: 10,
    hobbyTimePerDay: 90
  },

  generateWeekPlanning(courses, subjects, hobbies) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const weekPlanning = {};

    days.forEach(day => {
      const dayCourses = courses.filter(c => c.day === day);
      const freeSlots = this.findFreeSlots(day, dayCourses);
      const prioritizedSubjects = this.prioritizeSubjects(subjects);
      const schedule = this.fillSchedule(freeSlots, prioritizedSubjects, hobbies, day);
      
      weekPlanning[day] = {
        courses: dayCourses,
        schedule: schedule,
        stats: this.calculateDayStats(schedule)
      };
    });

    return weekPlanning;
  },

  findFreeSlots(day, courses) {
    const slots = [];
    const dayMinutes = [];

    for (let h = this.config.startHour; h < this.config.endHour; h++) {
      for (let m = 0; m < 60; m++) {
        dayMinutes.push({ hour: h, minute: m, occupied: false });
      }
    }

    courses.forEach(course => {
      const [startH, startM] = course.startTime.split(':').map(Number);
      const [endH, endM] = course.endTime.split(':').map(Number);
      const startIdx = (startH - this.config.startHour) * 60 + startM;
      const endIdx = (endH - this.config.startHour) * 60 + endM;
      
      for (let i = startIdx; i < endIdx && i < dayMinutes.length; i++) {
        if (dayMinutes[i]) dayMinutes[i].occupied = true;
      }
    });

    let currentSlot = null;
    dayMinutes.forEach((minute) => {
      if (!minute.occupied) {
        if (!currentSlot) {
          currentSlot = { startHour: minute.hour, startMinute: minute.minute, duration: 1 };
        } else {
          currentSlot.duration++;
        }
      } else {
        if (currentSlot && currentSlot.duration >= this.config.minSessionTime) {
          slots.push(currentSlot);
        }
        currentSlot = null;
      }
    });

    if (currentSlot && currentSlot.duration >= this.config.minSessionTime) {
      slots.push(currentSlot);
    }

    return slots;
  },

  prioritizeSubjects(subjects) {
    const today = new Date();
    return subjects.map(subject => {
      const nextReview = subject.nextReview ? new Date(subject.nextReview) : today;
      const daysOverdue = Math.max(0, Math.ceil((today - nextReview) / (1000 * 60 * 60 * 24)));
      const priorityScore = (6 - subject.priority) * 10;
      const urgencyScore = daysOverdue * 5;
      
      return {
        ...subject,
        score: priorityScore + urgencyScore,
        daysOverdue: daysOverdue,
        urgent: daysOverdue > 0
      };
    }).sort((a, b) => b.score - a.score);
  },

  fillSchedule(freeSlots, prioritizedSubjects, hobbies, day) {
    const schedule = [];
    let remainingHobbyTime = this.config.hobbyTimePerDay;
    let subjectIndex = 0;

    freeSlots.forEach(slot => {
      let slotTimeUsed = 0;

      while (slotTimeUsed + this.config.minSessionTime <= slot.duration) {
        const studyCount = schedule.filter(s => s.type === 'study').length;
        const shouldPlaceHobby = studyCount > 0 && studyCount % 2 === 0 && 
                                 remainingHobbyTime >= 30 && hobbies.length > 0;

        if (shouldPlaceHobby) {
          const hobbyTime = Math.min(60, remainingHobbyTime, slot.duration - slotTimeUsed);
          const hobby = hobbies[studyCount % hobbies.length];
          
          schedule.push({
            type: 'hobby',
            name: hobby.name,
            startHour: slot.startHour,
            startMinute: slot.startMinute + slotTimeUsed,
            duration: hobbyTime,
            day: day
          });

          slotTimeUsed += hobbyTime + this.config.breakTime;
          remainingHobbyTime -= hobbyTime;

        } else if (subjectIndex < prioritizedSubjects.length) {
          const subject = prioritizedSubjects[subjectIndex];
          const sessionTime = Math.min(
            subject.estimatedTime || 50,
            slot.duration - slotTimeUsed - this.config.breakTime
          );

          if (sessionTime >= this.config.minSessionTime) {
            schedule.push({
              type: 'study',
              subjectId: subject.id,
              name: subject.name,
              startHour: slot.startHour,
              startMinute: slot.startMinute + slotTimeUsed,
              duration: sessionTime,
              priority: subject.priority,
              urgent: subject.urgent,
              daysOverdue: subject.daysOverdue,
              day: day
            });

            slotTimeUsed += sessionTime + this.config.breakTime;
          }
          subjectIndex++;
        } else {
          break;
        }
      }
    });

    return schedule;
  },

  calculateDayStats(schedule) {
    return {
      totalStudyTime: schedule.filter(s => s.type === 'study').reduce((sum, s) => sum + s.duration, 0),
      totalHobbyTime: schedule.filter(s => s.type === 'hobby').reduce((sum, s) => sum + s.duration, 0),
      studySessions: schedule.filter(s => s.type === 'study').length,
      urgentSessions: schedule.filter(s => s.type === 'study' && s.urgent).length
    };
  },

  formatTime(hour, minute) {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  formatTimeSlot(item) {
    const endMinutes = item.startMinute + item.duration;
    const endH = item.startHour + Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    return `${this.formatTime(item.startHour, item.startMinute)} - ${this.formatTime(endH, endM)}`;
  }
};
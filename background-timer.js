// Background Timer System - Works across all pages
// This script should be included in all HTML pages

class BackgroundTimer {
    constructor() {
        this.timerKey = 'MindEase_background_timer';
        this.isRunning = false;
        this.startTime = null;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.isStudyMode = true;
        this.studyTime = 25 * 60; // 25 minutes
        this.breakTime = 5 * 60;  // 5 minutes
        this.intervalId = null;
        this.lastUpdateTime = Date.now();
        
        this.init();
    }

    init() {
        // Load saved timer state
        this.loadTimerState();
        
        // Start background timer if it was running
        if (this.isRunning && this.remainingTime > 0) {
            this.startBackgroundTimer();
            console.log('Background timer started on page load:', this.remainingTime, 'seconds remaining');
        }
        
        // Update timer every second
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Save state when page is about to unload
        window.addEventListener('beforeunload', () => {
            this.saveTimerState();
        });
        
        // Note: Removed visibility change handler to allow timer to continue running
        // when navigating between pages. Timer will only pause when browser tab is closed.
    }

    loadTimerState() {
        try {
            const saved = localStorage.getItem(this.timerKey);
            if (saved) {
                const state = JSON.parse(saved);
                this.isRunning = state.isRunning || false;
                this.startTime = state.startTime ? new Date(state.startTime) : null;
                this.remainingTime = state.remainingTime || 0;
                this.totalTime = state.totalTime || 0;
                this.isStudyMode = state.isStudyMode !== undefined ? state.isStudyMode : true;
                this.studyTime = state.studyTime || (25 * 60);
                this.breakTime = state.breakTime || (5 * 60);
                this.lastUpdateTime = state.lastUpdateTime || Date.now();
                
                // If timer was running, calculate elapsed time
                if (this.isRunning && this.startTime) {
                    const now = Date.now();
                    const elapsed = Math.floor((now - this.lastUpdateTime) / 1000);
                    this.remainingTime = Math.max(0, this.remainingTime - elapsed);
                    this.lastUpdateTime = now;
                }
            }
        } catch (error) {
            console.log('Error loading timer state:', error);
        }
    }

    saveTimerState() {
        try {
            const state = {
                isRunning: this.isRunning,
                startTime: this.startTime ? this.startTime.getTime() : null,
                remainingTime: this.remainingTime,
                totalTime: this.totalTime,
                isStudyMode: this.isStudyMode,
                studyTime: this.studyTime,
                breakTime: this.breakTime,
                lastUpdateTime: Date.now()
            };
            localStorage.setItem(this.timerKey, JSON.stringify(state));
        } catch (error) {
            console.log('Error saving timer state:', error);
        }
    }

    startTimer(studyTime, breakTime) {
        this.studyTime = studyTime;
        this.breakTime = breakTime;
        this.isStudyMode = true;
        this.totalTime = studyTime;
        this.remainingTime = studyTime;
        this.isRunning = true;
        this.startTime = new Date();
        this.lastUpdateTime = Date.now();
        
        this.startBackgroundTimer();
        this.saveTimerState();
        this.updateNavbarIndicator();
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.saveTimerState();
            this.updateNavbarIndicator();
        }
    }

    resumeTimer() {
        if (!this.isRunning && this.remainingTime > 0) {
            this.isRunning = true;
            this.startTime = new Date();
            this.lastUpdateTime = Date.now();
            this.startBackgroundTimer();
            this.saveTimerState();
            this.updateNavbarIndicator();
            console.log('Timer resumed:', this.remainingTime, 'seconds remaining');
        }
    }

    stopTimer() {
        this.isRunning = false;
        this.startTime = null;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.saveTimerState();
        this.updateNavbarIndicator();
    }

    resetTimer() {
        this.isRunning = false;
        this.remainingTime = this.isStudyMode ? this.studyTime : this.breakTime;
        this.totalTime = this.remainingTime;
        this.startTime = null;
        this.saveTimerState();
        this.updateNavbarIndicator();
    }

    startBackgroundTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (!this.isRunning || this.remainingTime <= 0) {
            return;
        }

        this.remainingTime--;
        this.lastUpdateTime = Date.now();
        
        // Update navbar indicator
        this.updateNavbarIndicator();
        
        // Check if timer completed
        if (this.remainingTime <= 0) {
            this.onTimerComplete();
        }
        
        this.saveTimerState();
    }

    onTimerComplete() {
        this.isRunning = false;
        
        // Show alert and play sound
        this.showTimerAlert();
        
        // Switch mode
        if (this.isStudyMode) {
            this.isStudyMode = false;
            this.totalTime = this.breakTime;
            this.remainingTime = this.breakTime;
        } else {
            this.isStudyMode = true;
            this.totalTime = this.studyTime;
            this.remainingTime = this.studyTime;
        }
        
        this.saveTimerState();
        this.updateNavbarIndicator();
    }

    showTimerAlert() {
        const modeText = this.isStudyMode ? 'Study' : 'Break';
        const message = `${modeText} time completed! Time for a ${this.isStudyMode ? 'break' : 'study'} session.`;
        
        // Show alert
        alert(message);
    }

    // Audio system removed - only showing alert message

    updateNavbarIndicator() {
        // Update navbar timer indicator
        const timerIndicator = document.getElementById('timerIndicator');
        if (timerIndicator) {
            if (this.isRunning && this.remainingTime > 0) {
                const minutes = Math.floor(this.remainingTime / 60);
                const seconds = this.remainingTime % 60;
                const mode = this.isStudyMode ? 'Study' : 'Break';
                timerIndicator.textContent = `${mode}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                timerIndicator.style.display = 'block';
                
                // Update styling based on mode
                if (this.isStudyMode) {
                    timerIndicator.classList.remove('break-mode');
                } else {
                    timerIndicator.classList.add('break-mode');
                }
            } else {
                timerIndicator.style.display = 'none';
            }
        }
    }

    getTimerState() {
        return {
            isRunning: this.isRunning,
            remainingTime: this.remainingTime,
            totalTime: this.totalTime,
            isStudyMode: this.isStudyMode,
            studyTime: this.studyTime,
            breakTime: this.breakTime
        };
    }
}

// Initialize background timer
window.backgroundTimer = new BackgroundTimer();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundTimer;
}

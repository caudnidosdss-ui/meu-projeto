/**
 * Service for audio feedback during scanning
 * Provides success and error sounds
 */

class AudioService {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  /**
   * Initialize AudioContext (must be called after user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  /**
   * Play a beep sound
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in milliseconds
   * @param {number} volume - Volume (0-1)
   */
  playBeep(frequency = 1000, duration = 200, volume = 0.7) {
    if (!this.audioContext) {
      this.init();
    }

    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.02,
        this.audioContext.currentTime + duration / 1000
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  /**
   * Play success sound as a loud "concluído" tone
   */
  playSuccess() {
    this.playBeep(1400, 180, 0.85);
    setTimeout(() => {
      this.playBeep(1900, 150, 0.8);
    }, 180);
    setTimeout(() => {
      this.playBeep(2300, 120, 0.75);
    }, 330);
  }

  /**
   * Play wrong sound as 3 low-tone beeps
   */
  playError() {
    this.playBeep(120, 150, 0.75);
    setTimeout(() => {
      this.playBeep(140, 150, 0.75);
    }, 180);
    setTimeout(() => {
      this.playBeep(160, 150, 0.75);
    }, 360);
  }

  /**
   * Play duplicate code sound
   */
  playDuplicate() {
    this.playBeep(600, 160, 0.45);
    setTimeout(() => {
      this.playBeep(480, 200, 0.45);
    }, 170);
  }

  /**
   * Play finalization sound for conference completion
   */
  playFinalizado() {
    this.playBeep(1200, 220, 0.8);
    setTimeout(() => {
      this.playBeep(1700, 180, 0.75);
    }, 220);
    setTimeout(() => {
      this.playBeep(2200, 140, 0.7);
    }, 420);
  }

  /**
   * Play double beep for special events
   */
  playDoubleBeep() {
    this.playBeep(1000, 100, 0.3);
    setTimeout(() => {
      this.playBeep(1200, 100, 0.3);
    }, 150);
  }
}

// Export singleton instance
export const audioService = new AudioService();

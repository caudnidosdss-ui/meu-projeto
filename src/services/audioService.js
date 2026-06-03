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
  playBeep(frequency = 1000, duration = 200, volume = 0.3) {
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
        0.01,
        this.audioContext.currentTime + duration / 1000
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  /**
   * Play success sound (high pitch, short)
   */
  playSuccess() {
    this.playBeep(1200, 150, 0.3);
  }

  /**
   * Play error sound (low pitch, longer)
   */
  playError() {
    this.playBeep(300, 400, 0.4);
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

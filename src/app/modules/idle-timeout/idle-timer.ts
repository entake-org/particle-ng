export class IdleTimer {
  private interval: any;
  private timeoutTracker: any;
  private readonly eventHandler: any;
  private readonly timeout: number;
  private readonly onTimeout: any;

  constructor(timeout: number, onTimeout: any) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;
    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  private startInterval(): void {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      if (this.isTimerExpired() && this.onTimeout) {
        this.onTimeout();
        this.cleanUp();
      }
    }, 1000);
  }

  private updateExpiredTime(): void {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem('_expiredTime', (Date.now() + this.timeout * 1000) + '');
    }, 300);
  }

  private tracker(): void {
    localStorage.removeItem('_expiredTime');
    window.addEventListener('mousemove', this.eventHandler);
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('keydown', this.eventHandler);
    window.addEventListener('resize', this.eventHandler);
    document.addEventListener('click', this.eventHandler);
    document.addEventListener('mousedown', this.eventHandler);
    document.addEventListener('DOMMouseScroll', this.eventHandler);
    document.addEventListener('mousewheel', this.eventHandler);
    document.addEventListener('touchmove', this.eventHandler);
    document.addEventListener('MSPointerMove', this.eventHandler);
  }

  cleanUp(): void {
    clearInterval(this.interval);
    window.removeEventListener('mousemove', this.eventHandler);
    window.removeEventListener('scroll', this.eventHandler);
    window.removeEventListener('keydown', this.eventHandler);
    window.removeEventListener('resize', this.eventHandler);
    document.removeEventListener('click', this.eventHandler);
    document.removeEventListener('mousedown', this.eventHandler);
    document.removeEventListener('DOMMouseScroll', this.eventHandler);
    document.removeEventListener('mousewheel', this.eventHandler);
    document.removeEventListener('touchmove', this.eventHandler);
    document.removeEventListener('MSPointerMove', this.eventHandler);
  }

  resetTimer(): void {
    this.tracker();
    this.startInterval();
  }

  isTimerExpired(): boolean {
    const expiredTime = parseInt(localStorage.getItem('_expiredTime') as string, 10);
    return expiredTime < Date.now();
  }
}

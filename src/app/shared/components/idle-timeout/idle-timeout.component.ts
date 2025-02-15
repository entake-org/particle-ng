import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogComponent} from '../dialog/dialog.component';
import {IdleTimeoutText} from '../../models/particle-component-text.model';
import {IdleTimer} from '../../services/idle-timer';

@Component({
    selector: 'particle-idle-timeout',
    templateUrl: './idle-timeout.component.html',
    standalone: true,
    imports: [DialogComponent]
})
export class IdleTimeoutComponent implements OnInit {

  @Input()
  borderRadius: string = '0px';

  @Input()
  timeoutInSeconds = 600;

  @Input()
  text = {
    sessionExpiring: 'Your Session is Expiring',
    second: 'second',
    seconds: 'seconds',
    stayLoggedIn: 'Click to stay logged in'
  } as IdleTimeoutText;

  @Output()
  timerEnd: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Timeout Dialog - shows when the inactivity timer has 1 minute left, giving the user the ability to confirm they're still active.
   */
  @ViewChild('timeoutDialog')
  timeoutDialog: DialogComponent = null as any;

  /**
   * Used for the countdown to user auto-logout
   */
  count = 0;

  /**
   * Controls showing the dialog
   */
  showDialog: any;

  idleTimer: IdleTimer = null as any;

  private readonly COUNTDOWN_LENGTH = 60;

  private finalCountdown: any;

  private timerReset = false;

  ngOnInit(): void {
    this.idleTimer = new IdleTimer(this.timeoutInSeconds - 60, () => {this.openDialog()});
  }

  openDialog(): void {
    this.showDialog = {};
    this.timerReset = false;
    this.setupFinalCountdown();
  }

  private setupFinalCountdown(): void {
    this.count = this.COUNTDOWN_LENGTH;
    this.finalCountdown = setInterval(() => {
      this.count--;
      if (this.count === 0 || !this.idleTimer.isTimerExpired()) {
        this.handleTimerEnd();
      }
    }, 1000);
  }

  private handleTimerEnd(): void {
    clearInterval(this.finalCountdown);
    this.showDialog = null;
    this.timeoutDialog.close();

    if (this.idleTimer.isTimerExpired()) {
      this.timerEnd.emit();
    }
  }

  resetTimer(): void {
    if (!this.timerReset) {
      this.timerReset = true;
      clearInterval(this.finalCountdown);
      this.idleTimer.resetTimer();
      this.showDialog = null;
    }
  }

}

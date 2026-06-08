import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {DialogComponent} from '../dialog/dialog.component';
import {IdleTimeoutText} from '../../models/particle-component-text.model';
import {IdleTimer} from '../../services/idle-timer';

@Component({
    selector: 'particle-idle-timeout',
    templateUrl: './idle-timeout.component.html',
    imports: [DialogComponent]
})
export class IdleTimeoutComponent implements OnInit, OnDestroy {
  private cd = inject(ChangeDetectorRef);

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

  @ViewChild('timeoutDialog')
  timeoutDialog: DialogComponent = null as any;

  count = 0;
  showDialog: any;
  idleTimer: IdleTimer = null as any;

  private readonly COUNTDOWN_LENGTH = 60;
  private finalCountdown: any;
  private timerReset = false;
  private targetTime: number = 0;
  private channel: BroadcastChannel = null as any;

  ngOnInit(): void {
    this.channel = new BroadcastChannel('particle_idle_sync');

    // Listen for the external event and explicitly mark for check
    this.channel.onmessage = (event) => {
      if (event.data === 'RESET') {
        this.localReset();
      } else if (event.data === 'LOGOUT') {
        this.localTimerEnd();
      }

      // Tell zoneless Angular that the state has mutated
      this.cd.detectChanges();
    };

    this.idleTimer = new IdleTimer(this.timeoutInSeconds - 60, () => {this.openDialog()});
  }

  ngOnDestroy(): void {
    if (this.finalCountdown) {
      clearInterval(this.finalCountdown);
    }
    if (this.channel) {
      this.channel.close();
    }
  }

  openDialog(): void {
    this.showDialog = {};
    this.timerReset = false;
    this.setupFinalCountdown();
    this.cd.detectChanges();
  }

  private setupFinalCountdown(): void {
    if (this.finalCountdown) {
      clearInterval(this.finalCountdown);
    }

    this.targetTime = Date.now() + (this.COUNTDOWN_LENGTH * 1000);

    this.finalCountdown = setInterval(() => {
      if (!this.idleTimer.isTimerExpired()) {
        this.resetTimer();
        return;
      }

      const remainingMillis = this.targetTime - Date.now();
      this.count = Math.max(0, Math.ceil(remainingMillis / 1000));

      this.cd.detectChanges();

      if (this.count <= 0) {
        this.handleTimerEnd();
      }
    }, 1000);
  }

  private handleTimerEnd(): void {
    this.channel.postMessage('LOGOUT');
    this.localTimerEnd();
  }

  private localTimerEnd(): void {
    if (this.finalCountdown) {
      clearInterval(this.finalCountdown);
    }
    this.showDialog = null;

    if (this.timeoutDialog) {
      this.timeoutDialog.close();
    }

    this.timerEnd.emit();
  }

  resetTimer(): void {
    if (!this.timerReset) {
      this.channel.postMessage('RESET');
      this.localReset();
    }
  }

  private localReset(): void {
    this.timerReset = true;
    if (this.finalCountdown) {
      clearInterval(this.finalCountdown);
    }
    this.idleTimer.resetTimer();
    this.showDialog = null;

    if (this.timeoutDialog) {
      this.timeoutDialog.close();
    }
  }

}

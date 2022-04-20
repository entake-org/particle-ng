import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import {ParticleButtonModule} from "../button/button.module";

@NgModule({
  declarations: [NotificationComponent],
    imports: [CommonModule, ParticleButtonModule],
  exports: [NotificationComponent]
})
export class ParticleNotificationModule { }

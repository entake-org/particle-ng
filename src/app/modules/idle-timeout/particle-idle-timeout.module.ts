import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdleTimeoutComponent } from './idle-timeout.component';
import {ParticleDialogModule} from "../dialog/dialog.module";

@NgModule({
  declarations: [
    IdleTimeoutComponent
  ],
  exports: [
    IdleTimeoutComponent
  ],
  imports: [
    CommonModule,
    ParticleDialogModule
  ]
})
export class ParticleIdleTimeoutModule { }

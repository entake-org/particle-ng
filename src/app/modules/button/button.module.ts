import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticleButtonComponent } from './particle-button.component';

@NgModule({
  declarations: [
    ParticleButtonComponent
  ],
  exports: [
    ParticleButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ParticleButtonModule { }

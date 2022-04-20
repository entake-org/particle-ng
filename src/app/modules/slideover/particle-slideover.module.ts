import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SlideoverComponent } from './slideover.component';
import {ParticleButtonModule} from "../button/button.module";

@NgModule({
  declarations: [
    SlideoverComponent
  ],
  exports: [
    SlideoverComponent
  ],
  imports: [
    CommonModule,
    ParticleButtonModule
  ]
})
export class ParticleSlideoverModule {
}

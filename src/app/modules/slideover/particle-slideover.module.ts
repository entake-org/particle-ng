import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SlideoverComponent } from './slideover.component';

@NgModule({
  declarations: [
    SlideoverComponent
  ],
  exports: [
    SlideoverComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ParticleSlideoverModule {
}

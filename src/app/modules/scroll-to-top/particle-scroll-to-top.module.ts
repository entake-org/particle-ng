import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollToTopComponent} from './scroll-to-top.component';

@NgModule({
  declarations: [
    ScrollToTopComponent
  ],
  exports: [
    ScrollToTopComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class ParticleScrollToTopModule {
}

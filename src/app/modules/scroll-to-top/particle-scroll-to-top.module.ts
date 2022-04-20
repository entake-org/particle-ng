import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from './scroll-to-top.component';
import {ParticleButtonModule} from "../button/button.module";



@NgModule({
  declarations: [
    ScrollToTopComponent
  ],
  exports: [
    ScrollToTopComponent
  ],
    imports: [
        CommonModule,
        ParticleButtonModule
    ]
})
export class ParticleScrollToTopModule { }

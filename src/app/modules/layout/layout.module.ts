import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutFullwidthSidebarComponent } from './components/layout-fullwidth-sidebar/layout-fullwidth-sidebar.component';
import { LayoutFullFramingComponent } from './components/layout-full-framing/layout-full-framing.component';
import {ParticleSlideoverModule} from '../slideover/particle-slideover.module';

@NgModule({
  declarations: [
    LayoutFullwidthSidebarComponent,
    LayoutFullFramingComponent
  ],
  exports: [
    LayoutFullwidthSidebarComponent,
    LayoutFullFramingComponent
  ],
    imports: [
        CommonModule,
        ParticleSlideoverModule
    ]
})
export class ParticleLayoutModule { }

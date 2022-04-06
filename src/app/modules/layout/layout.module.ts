import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutFullwidthSidebarComponent } from './components/layout-fullwidth-sidebar/layout-fullwidth-sidebar.component';



@NgModule({
  declarations: [
    LayoutFullwidthSidebarComponent
  ],
  exports: [
    LayoutFullwidthSidebarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ParticleLayoutModule { }

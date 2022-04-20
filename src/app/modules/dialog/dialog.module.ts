import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from './dialog.component';
import {A11yModule} from '@angular/cdk/a11y';
import {ParticleButtonModule} from "../button/button.module";

@NgModule({
  declarations: [
    DialogComponent
  ],
    imports: [
        CommonModule,
        A11yModule,
        ParticleButtonModule
    ],
  exports: [
    DialogComponent
  ]
})
export class ParticleDialogModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    CheckboxComponent
  ],
  exports: [
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ParticleCheckboxModule { }

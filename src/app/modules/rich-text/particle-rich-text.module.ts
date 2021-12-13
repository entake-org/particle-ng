import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    RichTextComponent
  ],
    imports: [
        CommonModule,
        ParticleTooltipModule
    ],
  exports: [
    RichTextComponent
  ]
})
export class ParticleRichTextModule { }

import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticleOrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import { ParticlePopoverModule } from '../popover/popover.module';
import { WeekPickerComponent } from './week-picker.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [WeekPickerComponent],
    imports: [
        CommonModule,
        ParticleOrdinalNumberPipeModule,
        FormsModule,
        A11yModule,
        ParticlePopoverModule,
        ParticleTooltipModule
    ],
  exports: [WeekPickerComponent]
})
export class ParticleWeekPickerModule { }

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DatePickerComponent } from './date-picker.component';
import { OrdinalNumberPipe } from '../ordinal-number-pipe/ordinal-number.pipe';
import { ParticleOrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import {ParticleButtonModule} from "../button/button.module";
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    CalendarComponent,
    DateRangePickerComponent
  ],
  imports: [
    A11yModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ParticleOrdinalNumberPipeModule,
    ParticleButtonModule
  ],
  exports: [
    DatePickerComponent,
    CalendarComponent,
    DateRangePickerComponent
  ],
  providers: [OrdinalNumberPipe]
})
export class ParticleDatePickerModule { }

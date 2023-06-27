import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemingComponent} from './components/theming.component';
import {ThemingService} from './services/theming.service';
import {ThemeChangeDetectionService} from './services/theme-change-detection.service';
import {LocalStorageService} from '../../shared/services/local-storage.service';
import {ParticleDropdownModule} from '../dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ParticleDropdownModule
  ],
  declarations: [
    ThemingComponent
  ],
  providers: [
    ThemingService,
    ThemeChangeDetectionService,
    LocalStorageService
  ],
  exports: [
    ThemingComponent
  ]
})
export class ParticleThemingModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ParticleColorPickerModule} from './modules/color-picker/color-picker.module';
import {ParticleKeyfilterModule} from './modules/keyfilter/keyfilter.module';
import {ParticleMultiSelectModule} from './modules/multi-select/multi-select.module';
import {ParticleOrdinalNumberPipeModule} from './modules/ordinal-number-pipe/ordinal-number-pipe.module';
import {ParticleProfilePicModule} from './modules/profile-pic/particle-profile-pic.module';
import {ParticlePaginatorModule} from './modules/paginator/particle-paginator.module';
import {ParticlePushContainerModule} from './modules/push-container/particle-push-container.module';
import {ParticleRichTextModule} from './modules/rich-text/particle-rich-text.module';
import {ParticleIconsModule} from './modules/icons/particle-icons.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ParticleEndpointStateModule} from './modules/endpoint-state/endpoint-state.module';
import {ParticleDialogModule} from './modules/dialog/dialog.module';
import {ParticleDatePickerModule} from './modules/date-picker/date-picker.module';
import {ParticleSliderModule} from './modules/slider/slider.module';
import {ParticleWeekPickerModule} from './modules/week-picker/week-picker.module';
import {ParticleDropdownModule} from './modules/dropdown/dropdown.module';
import {ParticleTooltipModule} from './modules/tooltip/tooltip.module';
import {ParticleNotificationModule} from './modules/notification/notification.module';
import {ParticlePopoverModule} from './modules/popover/popover.module';
import {ParticleAccordionModule} from './modules/accordion/accordion.module';
import {ParticleThemingModule} from './modules/theming/theming.module';
import {ParticleSlideoverModule} from "./modules/slideover/particle-slideover.module";
import {ParticleIdleTimeoutModule} from "./modules/idle-timeout/particle-idle-timeout.module";
import {ParticleScrollToTopModule} from "./modules/scroll-to-top/particle-scroll-to-top.module";
import {ParticleLayoutModule} from "./modules/layout/layout.module";
import {ParticleToggleSwitchModule} from "./modules/toggle-switch/toggle-switch.module";
import {ParticleButtonModule} from "./modules/button/button.module";
import {ParticleBackgroundCarouselModule} from "./modules/background-carousel/particle-background-carousel.module";
import {ParticleCheckboxModule} from './modules/checkbox/checkbox.module';
import {ParticleProgressBarModule} from './modules/progress-bar/progress-bar.module';
import {FormComponent} from './form.component';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'form', component: FormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    HomeComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ParticleTooltipModule,
    ParticleDialogModule,
    ParticleProfilePicModule,
    ParticlePaginatorModule,
    ParticlePushContainerModule,
    ParticleRichTextModule,
    ParticleIconsModule,
    ParticleEndpointStateModule,
    ParticleDatePickerModule,
    ParticleWeekPickerModule,
    ParticleDropdownModule,
    ParticleNotificationModule,
    ParticlePopoverModule,
    ParticleMultiSelectModule,
    ParticleKeyfilterModule,
    ParticleColorPickerModule,
    ParticleSliderModule,
    ParticleOrdinalNumberPipeModule,
    ParticleAccordionModule,
    ParticleThemingModule,
    ParticleSlideoverModule,
    ParticleIdleTimeoutModule,
    ParticleScrollToTopModule,
    ParticleLayoutModule,
    ParticleToggleSwitchModule,
    ParticleButtonModule,
    ParticleBackgroundCarouselModule,
    ParticleCheckboxModule,
    ParticleProgressBarModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

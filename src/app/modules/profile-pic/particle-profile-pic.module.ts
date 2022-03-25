import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfilePicComponent} from './profile-pic.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    ProfilePicComponent
  ],
    imports: [
        CommonModule,
        ParticleTooltipModule
    ],
  exports: [
    ProfilePicComponent
  ]
})
export class ParticleProfilePicModule {
}

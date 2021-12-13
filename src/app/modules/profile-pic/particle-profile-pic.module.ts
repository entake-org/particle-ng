import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ParticleSafePipesModule} from '../safe-pipes/particle-safe-pipes.module';
import {ProfilePicComponent} from './profile-pic.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    ProfilePicComponent
  ],
    imports: [
        CommonModule,
        ParticleSafePipesModule,
        ParticleTooltipModule
    ],
  exports: [
    ProfilePicComponent
  ]
})
export class ParticleProfilePicModule {
}

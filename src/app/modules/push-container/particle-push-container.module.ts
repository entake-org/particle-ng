import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PushContainerComponent} from './push-container.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [PushContainerComponent],
    imports: [
        CommonModule,
        ParticleTooltipModule
    ],
  exports: [
    PushContainerComponent
  ]
})
export class ParticlePushContainerModule {
}

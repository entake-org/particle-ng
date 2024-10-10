import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';
import {ParticleIconsRegular} from './models/particle-icons-regular.model';
import {ParticleIconsBrand} from './models/particle-icons-brands.model';
import {ParticleIconsSolid} from './models/particle-icons-solid.model';
import {IconSelectComponent} from './components/icon-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ParticleDialogModule} from '../dialog/dialog.module';
import {IconsService} from './services/icons.service';
import {ParticleEndpointStateModule} from '../endpoint-state/endpoint-state.module';

/**
 * Reference to the Font Awesome variable to add icons
 */
const FontAwesome = window['FontAwesome' as any] as any;

@NgModule({
  declarations: [
    IconSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParticleTooltipModule,
    ParticleDialogModule,
    ParticleEndpointStateModule
  ],
  exports: [
    IconSelectComponent
  ],
  providers: [IconsService]
})
export class ParticleIconsModule {

  constructor() {
    if (!FontAwesome) {
      return;
    }

    for (const icon of ParticleIconsBrand.icons) {
      FontAwesome.library.add(icon);
    }

    for (const icon of ParticleIconsRegular.icons) {
      FontAwesome.library.add(icon);
    }

    for (const icon of ParticleIconsSolid.icons) {
      FontAwesome.library.add(icon);
    }
  }

}

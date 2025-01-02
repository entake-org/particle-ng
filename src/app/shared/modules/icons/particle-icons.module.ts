import {NgModule} from '@angular/core';
import {ParticleIconsBrand} from '../../models/particle-icons-brands.model';
import {ParticleIconsRegular} from '../../models/particle-icons-regular.model';
import {ParticleIconsSolid} from '../../models/particle-icons-solid.model';


/**
 * Reference to the Font Awesome variable to add icons
 */
const FontAwesome = window['FontAwesome' as any] as any;

@NgModule()
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

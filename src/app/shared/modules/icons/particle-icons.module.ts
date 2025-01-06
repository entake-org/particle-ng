import {NgModule} from '@angular/core';
import {ParticleIconsBrand} from '../../models/particle-icons-brands.model';
import {ParticleIconsRegular} from '../../models/particle-icons-regular.model';
import {ParticleIconsSolid} from '../../models/particle-icons-solid.model';

@NgModule()
export class ParticleIconsModule {

  constructor() {
    const FontAwesome = (window as any).FontAwesome;
    FontAwesome.library.add(
      ...ParticleIconsBrand.icons,
      ...ParticleIconsRegular.icons,
      ...ParticleIconsSolid.icons
    );
  }

}

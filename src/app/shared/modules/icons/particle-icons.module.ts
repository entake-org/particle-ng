import {Inject, NgModule, PLATFORM_ID} from '@angular/core';
import {ParticleIconsBrand} from '../../models/particle-icons-brands.model';
import {ParticleIconsRegular} from '../../models/particle-icons-regular.model';
import {ParticleIconsSolid} from '../../models/particle-icons-solid.model';
import {isPlatformBrowser} from "@angular/common";

@NgModule()
export class ParticleIconsModule {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const FontAwesome = (window as any).FontAwesome;
      if (FontAwesome?.library) {
        FontAwesome.library.add(
          ...ParticleIconsBrand.icons,
          ...ParticleIconsRegular.icons,
          ...ParticleIconsSolid.icons
        );
      }
    }
  }

}

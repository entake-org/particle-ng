import {NgModule} from '@angular/core';
import {UserIdleConfig} from './models/user-idle-config.model';

@NgModule({
  imports: []
})
export class ParticleUserIdleModule {
  static forRoot(config: UserIdleConfig) {
    return {
      ngModule: ParticleUserIdleModule,
      providers: [
        { provide: UserIdleConfig, useValue: config }
      ]
    };
  }
}

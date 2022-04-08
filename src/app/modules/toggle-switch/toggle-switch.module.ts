import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from './toggle-switch.component';



@NgModule({
    declarations: [
        ToggleSwitchComponent
    ],
    exports: [
        ToggleSwitchComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ParticleToggleSwitchModule { }

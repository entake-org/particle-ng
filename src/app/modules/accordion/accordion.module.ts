import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion.component';
import { AccordionItemDirective } from './directives/accordion-item.directive';
import { AccordionContentDirective } from './directives/accordion-content.directive';

@NgModule({
  declarations: [
    AccordionComponent,
    AccordionItemDirective,
    AccordionContentDirective
  ],
  imports: [CommonModule],
  exports: [
    AccordionComponent,
    AccordionItemDirective,
    AccordionContentDirective
  ]
})
export class ParticleAccordionModule {}

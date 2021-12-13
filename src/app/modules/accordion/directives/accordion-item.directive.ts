import { ContentChild, Directive, Input } from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';

@Directive({
  selector: 'particle-accordion-item'
})
export class AccordionItemDirective {
  @Input() header = '';
  @Input() disabled = false;
  @ContentChild(AccordionContentDirective) content: AccordionContentDirective;
}

import { ContentChild, Directive, Input } from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';

@Directive({
  selector: 'particle-accordion-item'
})
export class AccordionItemDirective {

  @Input()
  header: string = null as any;

  @Input()
  disabled = false;

  customHeader: any = null;

  @ContentChild(AccordionContentDirective)
  content: AccordionContentDirective = null as any;
}

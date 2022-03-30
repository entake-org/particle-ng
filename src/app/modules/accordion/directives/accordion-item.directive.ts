import {ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';
import {AccordionHeaderDirective} from "./accordion-header.directive";

@Directive({
  selector: 'particle-accordion-item'
})
export class AccordionItemDirective {

  @Input()
  header: string = null as any;

  @Input()
  disabled = false;

  @Input()
  open = false;

  @ContentChild(AccordionHeaderDirective)
  headerTemplate: AccordionHeaderDirective = null as any;

  @ContentChild(AccordionContentDirective)
  content: AccordionContentDirective = null as any;
}

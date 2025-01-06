import {ContentChild, Directive, Input} from '@angular/core';
import {AccordionContentDirective} from './accordion-content.directive';
import {AccordionHeaderDirective} from './accordion-header.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'particle-accordion-item',
    standalone: true
})
export class AccordionItemDirective {

  @Input()
  header: string = null as any;

  @Input()
  disabled = false;

  @Input()
  open = false;

  @Input()
  headerClass: string = null as any;

  @ContentChild(AccordionHeaderDirective)
  headerTemplate: AccordionHeaderDirective = null as any;

  @ContentChild(AccordionContentDirective)
  content: AccordionContentDirective = null as any;
}

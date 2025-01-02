import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[particleAccordionHeader]',
    standalone: true
})
export class AccordionHeaderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

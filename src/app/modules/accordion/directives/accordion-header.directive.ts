import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[particleAccordionHeader]'
})
export class AccordionHeaderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

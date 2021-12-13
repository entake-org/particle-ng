import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[particleAccordionContent]'
})
export class AccordionContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

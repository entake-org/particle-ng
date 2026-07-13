import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
    selector: '[particleAccordionHeader]',
})
export class AccordionHeaderDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);

}

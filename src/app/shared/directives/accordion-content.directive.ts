import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
    selector: '[particleAccordionContent]',
})
export class AccordionContentDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);

}

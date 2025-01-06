import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
    selector: '[particleAccordionContent]',
    standalone: true
})
export class AccordionContentDirective {  templateRef = inject<TemplateRef<any>>(TemplateRef);

}

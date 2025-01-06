import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
    selector: '[particleAccordionHeader]',
    standalone: true
})
export class AccordionHeaderDirective {  templateRef = inject<TemplateRef<any>>(TemplateRef);

}

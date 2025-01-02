import {Component, Input} from '@angular/core';
import {DOMPURIFY_CONFIG, NgDompurifyModule} from '@tinkoff/ng-dompurify';

export const DOM_PURIFY_PROVIDER = {
  provide: DOMPURIFY_CONFIG,
  useValue: {ADD_ATTR: ['target']}
};

@Component({
    selector: 'particle-render-rich-text',
    template: `<div class="ent_r2l_txt" [innerHTML]="html | dompurify"></div>`,
    standalone: true,
    imports: [NgDompurifyModule],
    providers: [DOM_PURIFY_PROVIDER]
})
export class RenderRichTextComponent {

  @Input()
  html = '';

}

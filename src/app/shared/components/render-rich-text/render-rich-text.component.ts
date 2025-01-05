import {Component, Input, SecurityContext} from '@angular/core';
import {NgDompurifyPipe} from '@taiga-ui/dompurify';

@Component({
    selector: 'particle-render-rich-text',
    template: `<div class="ent_r2l_txt" [innerHTML]="html | dompurify: SecurityContext.HTML:{ADD_ATTR: ['target']}"></div>`,
    standalone: true,
    imports: [NgDompurifyPipe]
})
export class RenderRichTextComponent {

  @Input()
  html = '';

  protected readonly SecurityContext = SecurityContext;
}

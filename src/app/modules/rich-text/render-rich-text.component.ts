import {Component, Input} from '@angular/core';

@Component({
  selector: 'particle-render-rich-text',
  template: `<div class="ent_r2l_txt" [innerHTML]="html | dompurify"></div>`
})
export class RenderRichTextComponent {

  @Input()
  html = '';

}

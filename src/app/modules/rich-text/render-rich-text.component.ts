import {Component, Input} from "@angular/core";

@Component({
  selector: 'particle-render-rich-text',
  template: `<div [innerHTML]="html | dompurify"></div>`
})
export class RenderRichTextComponent {

  @Input()
  html = '';

}

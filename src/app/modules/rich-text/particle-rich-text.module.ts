import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {ParticleTooltipModule} from '../tooltip/tooltip.module';
import {NgxTiptapModule} from "ngx-tiptap";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RenderRichTextComponent} from "./render-rich-text.component";
import {NgDompurifyModule} from "@tinkoff/ng-dompurify";

@NgModule({
  declarations: [
    RichTextComponent,
    RenderRichTextComponent
  ],
  imports: [
    CommonModule,
    ParticleTooltipModule,
    NgxTiptapModule,
    FormsModule,
    BrowserModule,
    NgDompurifyModule
  ],
  exports: [
    RichTextComponent,
    RenderRichTextComponent
  ]
})
export class ParticleRichTextModule {
}

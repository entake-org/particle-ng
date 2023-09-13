import {AfterViewInit, Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {Editor} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {RichTextEditorText} from '../../shared/models/particle-component-text.model';
import {RichTextCapabilities} from './rich-text-capabilities.model';
import {ThemingService} from '../theming/services/theming.service';

export const RICH_TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextComponent),
  multi: true
};

@Component({
  selector: 'particle-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css'],
  providers: [RICH_TEXT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None

})
export class RichTextComponent implements ControlValueAccessor, AfterViewInit {

  @Input()
  placeholder = '';

  @Input()
  hideControls = false;

  @Input()
  height = '100px';

  @Input()
  get readonly(): boolean {
    return this._editable;
  }

  set readonly(readonly: boolean) {
    this._editable = !readonly;
    this.editor.setEditable(this._editable);
  }

  @Input()
  text: RichTextEditorText = {
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    bold: 'Bold',
    italic: 'Italic',
    strike: 'Strike',
    bulletedList: 'Bulleted List',
    orderedList: 'Ordered List',
    leftAlign: 'Left Align',
    centerAlign: 'Center Align',
    rightAlign: 'Right Align',
    justifyAlign: 'Justify Align',
    setLink: 'Set Link',
    removeLink: 'Remove Link',
    clearFormat: 'Clear Format',
    modifyLink: 'Modify Link',
    cancel: 'Cancel',
    update: 'Update',
    url: 'URL'
  } as RichTextEditorText;

  @Input()
  capabilities = {
    heading: true,
    textDecoration: true,
    list: true,
    alignment: true,
    link: true
  } as RichTextCapabilities;

  @Input()
  borderRadius = '0px';

  @Output()
  textChanged = new EventEmitter<{
    htmlValue: string,
    textValue: string
  }>();

  showDialog: any = null;
  dialogLink: string = null as any;

  /**
   * Function called on change
   */
  onChange: ((value: string) => void) | undefined;

  /**
   * Function called on touch
   */
  onTouched: (() => void) | undefined;

  private _value: string = null as any;
  private _editable = true;

  protected readonly window = window;

  editor = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-link',
          target: '_blank'
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],

      }),
      Placeholder.configure({
        placeholder: () => this.placeholder
      })
    ],
    editorProps: {
      attributes: {
        class: '',
        spellcheck: 'true',
      },
    },
    enablePasteRules: [Link, StarterKit, TextAlign]
  });

  get value(): any {
    return this._value;
  }

  set value(value: string) {
    if (value === '<p></p>') {
      return;
    }

    if (value !== this._value) {
      this._value = value;
      if (this.onChange) {
        this.onChange(value);
      }
    }
  }

  ngAfterViewInit(): void {
    this.editor.setEditable(this._editable);

    this.editor.on('update', ({editor}) => {
      this.textChanged.emit({
        textValue: editor.getText(),
        htmlValue: this._value
      });
    });
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.editor.setEditable(isDisabled);
  }

  openLinkDialog(): void {
    const previousUrl = this.editor.getAttributes('link').href;
    this.showDialog = {};
    this.dialogLink = previousUrl;
  }

  changeEditorLink(action: string): void {
    switch (action) {
      case 'remove':
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
        break;
      case 'save':
        this.editor.chain().focus().extendMarkRange('link').setLink({ href: this.dialogLink, target: '_blank' }).run();
        break;
      default:
        console.log(action);
    }

    this.dialogLink = null as any;
    this.showDialog = null as any;
  }

  focus(position?: any): void {
    if (!position) {
      position = 'start';
    }

    this.editor.commands.focus(position);
  }

}

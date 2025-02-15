import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {AccordionText} from '../../models/particle-component-text.model';
import {AccordionItemDirective} from '../../directives/accordion-item.directive';

@Component({
  selector: 'particle-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, AccordionItemDirective]
})
export class AccordionComponent implements AfterContentInit, AfterViewInit {
  expanded = new Set<number>();

  @Input()
  multiple = false;

  @Input()
  height = '40px';

  @Input()
  headerClass = 'bg_overlay brdr border_bottom';

  @Input()
  textClass = 'md bolder';

  @Input()
  iconCollapsed = 'fas fa-caret-right';

  @Input()
  iconExpanded = 'fas fa-caret-down';

  @Input()
  showIcon = true;

  @Input()
  text = {
    expand: 'Expand',
    collapse: 'Collapse'
  } as AccordionText;

  @ContentChildren(AccordionItemDirective)
  items: QueryList<AccordionItemDirective> = null as any;

  @ViewChildren('ref')
  contentDivs: QueryList<any> = null as any;

  ngAfterContentInit(): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items.get(i) as AccordionItemDirective;
      if (item.open && !item.disabled) {
        this.expanded.add(i);
        if (!this.multiple) {
          break;
        }
      }
    }
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.contentDivs.length; i++) {
      const el = this.contentDivs.get(i).nativeElement as HTMLDivElement;
      const item = this.items.get(i) as AccordionItemDirective;
      if (el) {
        if (item && item.open && !item.disabled) {
          el.style.maxHeight = el.scrollHeight + 'px';
          el.ariaHidden = 'false';
        } else {
          el.style.maxHeight = '0';
          el.ariaHidden = 'true';
        }
      }
    }
  }

  /**
   * @param index - index of the accordion item
   */
  getToggleState = (index: number): any => {
    return this.toggleState.bind(this, index);
  };

  toggleState = (index: number): void => {
    if (this.expanded.has(index)) {
      this.expanded.delete(index);
      this.contentDivs.get(index).nativeElement.style.maxHeight = '0';
      this.contentDivs.get(index).nativeElement.ariaHidden = 'true';
    } else {
      if (!this.multiple) {
        this.expanded.clear();
        for (let i = 0; i < this.contentDivs.length; i++) {
          this.contentDivs.get(i).nativeElement.style.maxHeight = '0';
          this.contentDivs.get(i).nativeElement.ariaHidden = 'true';
        }
      }

      this.expanded.add(index);
      this.contentDivs.get(index).nativeElement.style.maxHeight = `${this.contentDivs.get(index).nativeElement.scrollHeight}px`;
      this.contentDivs.get(index).nativeElement.ariaHidden = 'false';
    }
  };

}

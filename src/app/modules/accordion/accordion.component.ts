import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';
import { AccordionItemDirective } from './directives/accordion-item.directive';

@Component({
  selector: 'particle-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent implements AfterContentInit {
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

  @ContentChildren(AccordionItemDirective)
  items: QueryList<AccordionItemDirective> = null as any;

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

  /**
   * @param index - index of the accordion item
   */
  getToggleState = (index: number): any => {
    return this.toggleState.bind(this, index);
  }

  toggleState = (index: number): void => {
    if (this.expanded.has(index)) {
      this.expanded.delete(index);
    } else {
      if (!this.multiple) {
        this.expanded.clear();
      }
      this.expanded.add(index);
    }
  }

  handleClick(item: AccordionItemDirective, element: HTMLDivElement, index: number): void {
    if (!item.disabled) {
      this.toggleState(index);

      if (!this.expanded.has(index)) {
        element.style.maxHeight = '0';
      } else {
        element.style.maxHeight = `${element.scrollHeight}px`;
      }
    }
  }
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contentExpansion', [
      state('expanded', style({height: '*', opacity: 1, visibility: 'visible'})),
      state('collapsed', style({height: '0px', opacity: 0, visibility: 'hidden'})),
      transition('expanded <=> collapsed',
        animate('200ms cubic-bezier(.37,1.04,.68,.98)')),
    ])
  ]
})
export class AccordionComponent implements AfterContentInit {
  expanded = new Set<number>();

  @Input()
  multiple = false;

  @Input()
  height = '40px';

  @Input()
  headerClass = 'border_bottom';

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
}

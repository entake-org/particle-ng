import { trigger, state, style, transition, animate } from '@angular/animations';
import {
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
export class AccordionComponent {
  expanded = new Set<number>();
  /**
   * When collapsing, it will display 1 tab at a time
   * When not collapsing, it can display multiple tabs at once
   */
  @Input()
  collapsing = false;

  @ContentChildren(AccordionItemDirective)
  items: QueryList<AccordionItemDirective> = null as any;

  /**
   * @param index - index of the accordion item
   */
  getToggleState = (index: number) => {
    return this.toggleState.bind(this, index);
  }

  toggleState = (index: number) => {
    if (this.expanded.has(index)) {
      this.expanded.delete(index);
    } else {
      if (this.collapsing) {
        this.expanded.clear();
      }
      this.expanded.add(index);
    }
  }
}

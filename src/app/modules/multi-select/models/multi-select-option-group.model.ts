import {MultiSelectOption} from './multi-select-option.model';

/**
 * Interface representing an array of multi-select options
 * grouped under a label
 */
export interface MultiSelectOptionGroup {

  type?: 'group';

  /**
   * The option group label
   */
  groupLabel: string;

  /**
   * The group options
   */
  options: Array<MultiSelectOption>;

}

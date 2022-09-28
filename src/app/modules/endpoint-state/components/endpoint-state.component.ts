import {Component, Input} from '@angular/core';
import {EndpointStateText} from '../../../shared/models/particle-component-text.model';

/**
 * Component to display different endpoint states
 */
@Component({
  selector: 'particle-endpoint-state',
  templateUrl: './endpoint-state.component.html',
  styleUrls: ['./endpoint-state.component.css']
})
export class EndpointStateComponent {

  /**
   * Flag to determine if in loading state
   */
  @Input()
  loading: boolean = false;

  /**
   * Icon for loading state
   */
  @Input()
  loadingIcon: 'double_helix' | string = 'double_helix';

  /**
   * Flag to determine if in empty state
   */
  @Input()
  empty: boolean = false;

  /**
   * Icon for empty state
   */
  @Input()
  emptyIcon = 'fas fa-folder-open fa-fw fa-3x';

  /**
   * Flag to determine if in error state
   */
  @Input()
  error: boolean = false;

  /**
   * Icon for error state
   */
  @Input()
  errorIcon = 'fas fa-bomb fa-fw fa-3x';

  /**
   * Flag to determine if overlay spinner
   */
  @Input()
  loadingOverlay: boolean = false;

  /**
   * The icon on the overlay spinner
   */
  @Input()
  loadingOverlayIcon = 'fas fa-spinner fa-spin';

  @Input()
  text: EndpointStateText = {
    loadingText: 'Loading',
    emptyText: 'There\'s nothing here yet.',
    errorText: 'An error has occurred',
    errorSubtext: 'Please try again'
  } as EndpointStateText;

  /**
   * Component constructor
   */
  constructor() { }

}

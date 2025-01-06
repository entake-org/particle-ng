/**
 * Carousel Options for the Background Carousel Directive
 */
export interface CarouselOptions {
  /**
   * Image locations to loop through
   */
  images: string[];

  /**
   * Transition Time (in seconds)
   */
  transitionTime: number;

  /**
   * Length of Time to display each background (in seconds)
   */
  viewTime: number;

  /**
   * Whether to reset the interval on init.
   */
  resetInterval: boolean;

}

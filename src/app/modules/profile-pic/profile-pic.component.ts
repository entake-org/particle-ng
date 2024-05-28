import {Component, Input} from '@angular/core';
import {Md5} from 'md5-typescript';

/**
 * Profile Pic display shortcut
 */
@Component({
  selector: 'particle-profile-pic',
  styleUrls: ['./profile-pic.component.css'],
  template: `
    <div class="ptl_profile_pic"
         [style.height]="size"
         [style.width]="size"
         [style.margin]="margin"
         [style.background-image]="url"
         [particleTooltip]="toolTip"
         [tooltipDisabled]="tooltipDisabled"
         tooltipPosition="top">
    </div>`
})
export class ProfilePicComponent {

  /**
   * Size of the profile pic circle (default to 50px)
   */
  @Input()
  size = '50px';

  /**
   * Configurable CSS Margin
   */
  @Input()
  margin = '0';

  /**
   * Tooltip to explain what the picture is
   */
  @Input()
  toolTip: string = null as any;

  /**
   * Disable the tooltip
   */
  @Input()
  tooltipDisabled: boolean = false;

  /**
   * Use gravatar instead of a custom image
   */
  @Input()
  set gravatarEmail(gravatarEmail: string) {
    this.url = `url(https://www.gravatar.com/avatar/${Md5.init(gravatarEmail.trim().toLowerCase())}?d=retro&s=${this.size.substring(0, this.size.length - 2)})`;
  }

  /**
   * Image URL of the profile pic
   */
  @Input()
  set imageUrl(imageUrl: string) {
    this.url = `url(${imageUrl})`;
  }

  url: string = null as any;

}

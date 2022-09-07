import {Component, Input} from '@angular/core';
import {Md5} from 'md5-typescript';

/**
 * Profile Pic display shortcut
 */
@Component({
  selector: 'particle-profile-pic',
  styleUrls: ['./profile-pic.component.css'],
  template: `
    <div class="wac_photo_id_round"
         [style.height]="size"
         [style.width]="size"
         [style.margin]="margin"
         [style.backgroundImage]="getUrl()"
         [particleTooltip]="toolTip"
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
   * Image URL of the profile pic
   */
  @Input()
  imageUrl: string = null as any;

  /**
   * Tooltip to explain what the picture is
   */
  @Input()
  toolTip: string = null as any;

  /**
   * Use gravatar instead of a custom image
   */
  @Input()
  gravatarEmail: string = null as any;

  /**
   * Returns a CSS URL of the Image URL.
   */
  getUrl(): string {
    if (this.gravatarEmail) {
       return `url(https://www.gravatar.com/avatar/${Md5.init(this.gravatarEmail.trim().toLowerCase())}?d=retro&s=${this.size.substring(0, this.size.length - 2)})`;
    }

    if (this.imageUrl) {
      return `url(${this.imageUrl})`;
    }

    return null as any;
  }

}

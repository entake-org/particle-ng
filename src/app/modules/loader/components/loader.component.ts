import {Component, Input} from '@angular/core';
import {LoaderText} from '../../../shared/models/particle-component-text.model';

@Component({
  selector: 'particle-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  @Input()
  text: LoaderText = {
    loadingText: 'Loading',
  } as LoaderText;

  @Input()
  disableText: boolean = false;

  protected backgroundStyle: string | undefined;

  private _colors: Array<string> | undefined;

  @Input()
  set colors(colors: Array<string>) {
    if (colors.length === 3) {
      this._colors = colors;
      this.backgroundStyle = 'linear-gradient(to right, rgba(0,0,0,0) 0%, ' + colors[0] + ' 33%, ' + colors[1] + ' 50% , ' + colors[2] + ' 66%, rgba(0,0,0,0) 100%)';
    }
  }

}

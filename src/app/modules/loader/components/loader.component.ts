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

}

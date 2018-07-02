import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Square } from './model/model.square';
@Component({
  selector: '[app-square]',
  template: `
  <svg>
     <path attr.stroke-width = "{{square.getStrokeWidth()}}"
       attr.fill="{{square.color}}" attr.stroke="{{square.color}}" attr.opacity="{{square.opacity}}"
       attr.d="{{square.path}}"></path>
  </svg>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquareComponent implements OnChanges, OnInit{
  @Input() square: Square;
  constructor() {
  }
  ngOnInit() {
    console.log(this.square.getX())
  }
  ngOnChanges(e){
    console.log('change detected')
  }
}

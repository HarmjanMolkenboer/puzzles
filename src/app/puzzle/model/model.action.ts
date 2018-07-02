import {Square} from './model.square';

export class Action {
  x: number;
  y: number;
  oldValue: number;
  oldColor: string;
  newValue: number;
  newColor: string;
  constructor(x: number, y: number, oldValue: number, oldColor: string, newValue: number, newColor: string) {
    this.x = x;
    this.y = y;
    this.oldValue = oldValue;
    this.oldColor = oldColor;
    this.newValue = newValue;
    this.newColor = newColor;
  }
}

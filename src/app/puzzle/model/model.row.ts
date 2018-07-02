export class Row {
  private borderValues: BorderValue[];
  private numberOfBorderValues: number;
  constructor(numberOfBorderValues: number, horizontal: boolean, x: number, y: number) {
    this.numberOfBorderValues = numberOfBorderValues;
    this.borderValues = [];
    for (let i = 0; i < numberOfBorderValues; i++) {
      if (horizontal) {
        this.borderValues.push(new BorderValue(x + 75 * i, y));
      } else {
        this.borderValues.push(new BorderValue(x, y + 75 * i));
      }
    }
  }
  getColor(index: number): string {
    return this.borderValues[index].color;
  }
  public raiseValue(index: number): void {
    this.borderValues[index].raiseValue();
  }
  public lowerValue(index: number): void {
    this.borderValues[index].lowerValue();
  }
  public raiseSolutionValue(index: number): void {
    this.borderValues[index].solutionValue++;
  }
  public setText(): void {
    for (const bv of this.borderValues) {
      bv.setText();
    }
  }
  public getSolutionValue(index: number): number {
    return this.borderValues[index].solutionValue;
  }
  public getCurrentValue(index: number): number {
    return this.borderValues[index].currentValue;
  }
  public isCorrect() {
    return !this.borderValues.some(bv => bv.color !== 'gray');
  }
  public getBorderValues() {
    return this.borderValues;
  }
}
class BorderValue {
  x: number;
  y: number;
  currentValue: number;
  solutionValue: number;
  color: string;
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.solutionValue = 0;
    this.currentValue = 0;
    this.color = 'black';
  }
  raiseValue() {
    this.currentValue++;
    if (this.currentValue === this.solutionValue) {
      this.color = 'gray';
    } else if (this.currentValue === this.solutionValue + 1) {
      this.color = 'red';
    }
  }
  lowerValue(): void {
    this.currentValue--;
    if (this.currentValue === this.solutionValue) {
      this.color = 'gray';
    } else if (this.currentValue === this.solutionValue - 1) {
      this.color = 'black';
    }
  }
  setText() {
    this.color = this.currentValue === this.solutionValue ? 'gray' : 'black';
  }
}

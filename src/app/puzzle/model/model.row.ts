export class Row {
  // private borderValues: BordervalueComponent[];
  private numberOfBorderValues: number;
  private solutionValues =[0,0,0,0,0];
  private currentValues = [0,0,0,0,0];
  private borderValues: SVGTextElement[];
  x: number;
  y: number;
  horizontal: boolean;
  constructor(numberOfBorderValues: number, x: number, y: number, horizontal: boolean) {
    this.numberOfBorderValues = numberOfBorderValues;
    this.borderValues = [];
    this.x = x;
    this.y = y;
    this.horizontal = horizontal;
    x = 100 * x + 50;
    y = 100 * y + 50;
    // for (let i = 0; i < numberOfBorderValues; i++) {
    //   if (horizontal) {
    //     this.borderValues.push(new BorderValue(x + 75 * i, y));
    //   } else {
    //     this.borderValues.push(new BorderValue(x, y + 75 * i));
    //   }
    // }
  }
  getBorderValueX(index: number): number {
      return 50 + 100 * this.x + (this.horizontal ? 75 * index : 0);
  }
  getBorderValueY(index: number): number {
      return 50 + 100 * this.y + (this.horizontal ? 0 : 75 * index);
  }

  getColor(index: number): string {
    return this.borderValues[index].getAttribute('fill');
  }
  public raiseValue(index: number): void {
    if (this.numberOfBorderValues === 0) {
      return;
    }
    this.currentValues[index]++;
    if (this.currentValues[index] === this.solutionValues[index]) {
      this.borderValues[index].setAttribute('fill', 'gray');
    } else if (this.currentValues[index] === this.solutionValues[index] + 1) {
      this.borderValues[index].setAttribute('fill', 'red');
    }
  }
  public lowerValue(index: number): void {
    if (this.numberOfBorderValues === 0) {
      return;
    }
    this.currentValues[index]--;
    if (this.currentValues[index] === this.solutionValues[index]) {
      this.borderValues[index].setAttribute('fill', 'gray');
    } else if (this.currentValues[index] === this.solutionValues[index] - 1) {
      this.borderValues[index].setAttribute('fill', 'black');
    }
  }
  public raiseSolutionValue(index: number): void {
      this.solutionValues[index]++;
  }
  public getSolutionValue(index: number): number {
    return this.solutionValues[index];
  }
  public getCurrentValue(index: number): number {
    return this.currentValues[index];
  }
  public isCorrect() {
    return !this.borderValues.some(bv => bv.getAttribute('fill') !== 'gray');
  }
  public getBorderValuesInit() {
    return new Array(this.numberOfBorderValues);
  }
  public getBorderValues() {
    return this.borderValues;
  }
  public addBordervalue(bv: SVGTextElement): void {
    this.borderValues.push(bv);
  }
  public setColors() {
    this.borderValues.forEach((bv, index) => {
      if (this.currentValues[index] === this.solutionValues[index]) {
        bv.setAttribute('fill', 'gray');
      } else {
        bv.setAttribute('fill', 'black');
      }
    })
  }
}
// class BorderValue {
//   x: number;
//   y: number;
//   currentValue: number;
//   solutionValue: number;
//   color: string;
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.solutionValue = 0;
//     this.currentValue = 0;
//     this.color = 'black';
//   }
//   raiseValue() {
//     this.currentValue++;
//     if (this.currentValue === this.solutionValue) {
//       this.color = 'gray';
//     } else if (this.currentValue === this.solutionValue + 1) {
//       this.color = 'red';
//     }
//   }
//   lowerValue(): void {
//     this.currentValue--;
//     if (this.currentValue === this.solutionValue) {
//       this.color = 'gray';
//     } else if (this.currentValue === this.solutionValue - 1) {
//       this.color = 'black';
//     }
//   }
//   setText() {
//     this.color = this.currentValue === this.solutionValue ? 'gray' : 'black';
//     // console.log(this.color);
//   }
// }

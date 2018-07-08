import { Row } from './model.row';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
// import { ChangeDetectorRef } from '@angular/core';
export class Square {
  private y: number;
  private x: number;
  isClue: boolean;
  private path: string;
  private numbers: boolean;
  private otherLeft: boolean;
  private value: number;
  private solutionValue: number;
  private color: string;
  private opacity: number;
  private storedColor: string;
  private numberOfErrors = [0, 0, 0, 0, 0];
  private otherSquare: Square;
  private overriddenColor = [];
  // private drawings: SVGPathElement[] = [];
  private rows = [];
  // private extraValue: number;
  private highlighted = false;
  private selected = false;
  private hasError = false;
  private rightWall: boolean;
  private downWall: boolean;
  private rightLink = false;
  private downLink = false;
  private rightLinkColor: string;
  private downLinkColor: string;
  private puzzleService: PuzzleService;
  private strokeWidth: number;
  private hl: SVGRectElement;
  private wr: SVGPathElement;
  private wd: SVGPathElement;
  private lr: SVGPathElement;
  private ld: SVGPathElement;
  private drawing: SVGPathElement;
  private error: SVGRectElement;
  private select: SVGRectElement;
  private bigNumber: SVGTextElement;
  private smallNumbers: SVGTextElement[];
  constructor(x:number,
    y:number,
    numbers: boolean,
    solutionValue: number,
    isClue: boolean,
    rightWall: boolean,
    downWall: boolean,
    otherLeft: boolean,
    puzzleService: PuzzleService) {
    this.x = x;
    this.y = y;
    this.numbers = numbers;
    this.isClue = isClue;
    this.rightWall = rightWall;
    this.downWall = downWall;
    this.otherLeft = otherLeft;
    this.value = 0;
    // this.extraValue = 0;
    this.solutionValue = solutionValue;
    this.puzzleService = puzzleService;
    this.smallNumbers = [];
  }
  public setHighligth(hl: SVGRectElement) {
    this.hl = hl;
  }
  public setDrawing(drawing: SVGPathElement) {
    this.drawing = drawing;
  }
  public setErrorElement(error: SVGRectElement) {
    this.error = error;
  }
  public setSelectElement(select: SVGRectElement) {
    this.select = select;
  }
  public setRightWallElement(wr: SVGPathElement) {
    this.wr = wr;
  }
  public setDownLinkElement(ld: SVGPathElement) {
    this.ld = ld;
  }
  public setDownWallElement(wd: SVGPathElement) {
    this.wd = wd;
  }
  public setRightLinkElement(lr: SVGPathElement) {
    this.lr = lr;
  }
  public setBigNumber(n: SVGTextElement) {
    this.bigNumber = n;
  }
  public addSmallNumber(n: SVGTextElement) {
    this.smallNumbers.push(n);
  }
  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public setOpacity(opacity: number) {
    this.drawing.setAttribute('opacity', ''+opacity);
    this.opacity = opacity;
  }
  public getValue(): number {
    return this.value;
  }
  public setPath(path: string) {
    if(this.path === path) {
      return;
    }
    this.path = path;
    if (path===''){
      this.drawing.setAttribute('display', 'none');
    } else {
      this.drawing.removeAttribute('display');
      this.drawing.setAttribute('d', path);
    }
  }
  public getPath() {
    return this.path;
  }
  public getNumber(): number {
    let found=false;
    let number = -1;
    for (let i = 0; i <= 9; i++) {
      if ((this.value & (1 << i)) !== 0) {
        if (found) {
          return -1;
        }
        found=true;
        number = i;
      }
    }
    return number;
  }
  public getNumbers(): number[] {
    let numbers = [];
    for (let i = 0; i <= 9; i++) {
      if ((this.value & (1 << i)) !== 0) {
        numbers.push(i);
      }
    }
    return numbers;
  }
  public setValue(newValue: number) {
    this.value = newValue;
    if (this.drawing === undefined) {
      this.showNumbers();
    }
  }
  public showNumbers(): void {
    if (this.getNumber() !== -1) {
      for (let i = 0; i <= 9; i++) {
        this.smallNumbers[i].setAttribute('display', 'none');
      }
      this.bigNumber.removeAttribute('display');
      this.bigNumber.innerHTML=''+this.getNumber();
    } else {
      this.bigNumber.setAttribute('display', 'none');
      for (let i = 0; i <= 9; i++) {
        if ((this.value & (1 << i)) !== 0) {
          this.smallNumbers[i].removeAttribute('display');
        } else {
          this.smallNumbers[i].setAttribute('display', 'none');
        }
      }
    }
  }
  public setColor(color: string) {
    if (this.drawing!==undefined) {
      this.drawing.setAttribute('fill', color);
      this.drawing.setAttribute('stroke', color);
    } else {
      this.bigNumber.setAttribute('fill', color);
      this.smallNumbers.forEach(sn=>sn.setAttribute('fill', color));
    }
    this.color = color;
  }
  public getColor(): string {
    return this.color;
  }
  public storeColor(): void {
    this.storedColor = this.color;
  }
  public restoreColor(): void {
    this.color = this.storedColor;
  }
  public raiseNumberOfErrors(index: number) {
    this.numberOfErrors[index]++;
  }
  public lowerNumberOfErrors(index: number) {
    this.numberOfErrors[index]--;
  }
  public isError(index: number): boolean {
    return this.numberOfErrors[index] > 0;
  }
  public resetIsError(): void {
    this.numberOfErrors = [0, 0, 0, 0, 0];
  }
  public setSolutionValue(value: number) {
    this.solutionValue = value;
  }
  public getSolutionValue(): number {
    return this.solutionValue;
  }
  public addRow(row: Row): void {
    this.rows.push(row);
  }
  public getRows(): Row[] {
    return this.rows;
  }
  public showHighlight(show: boolean): void {
    // this.hl.visible=show;
    this.highlighted = show;
    if(show) {
      // alert(this.x);
      this.hl.removeAttribute('display');
    } else {
      this.hl.setAttribute('display', 'none');
    }
  }
  public showSelectDrawing(show: boolean): void {
    this.selected = show;
    if(show) {
      this.select.removeAttribute('display');
    } else {
      this.select.setAttribute('display', 'none');
    }

  }
  public showError(show: boolean): void {
    this.hasError = show;
    if(show) {
      this.error.removeAttribute('display');
    } else {
      this.error.setAttribute('display', 'none');
    }
  }
  public setStrokeWidth(n: number): void {
    this.drawing.setAttribute('stroke-width', ''+n)
    this.strokeWidth = n;
  }
  // public addDrawing(drawing: SVGPathElement) {
  //   this.drawings.push(drawing);
  // }
  // public getDrawing(index: number): SVGPathElement {
  //   return this.drawings[index];
  // }
  // public getDrawings(): SVGPathElement[] {
  //   return this.drawings;
  // }
  // public showDrawing(index: number, show: boolean): void {
  //   this.drawings[index].setAttribute('visibility', show ? 'visible' : 'hidden');
  // }
  // public setDrawing(drawing: SVGPathElement, index: number): void {
  //   this.drawings[index] = drawing;
  // }
  public setOtherSquare(sq: Square) {
    this.otherSquare = sq;
  }
  public getOtherSquare(): Square {
    if (this.otherSquare === undefined) {
      if (!this.rightWall) {
        this.otherSquare = this.puzzleService.getController().getSquare(this.x + 1, this.y);
      } else if (!this.downWall) {
        this.otherSquare = this.puzzleService.getController().getSquare(this.x, this.y + 1);
      } else if (this.otherLeft) {
        this.otherSquare = this.puzzleService.getController().getSquare(this.x - 1, this.y);
      } else {
        this.otherSquare = this.puzzleService.getController().getSquare(this.x, this.y - 1);
      }
    }
    return this.otherSquare;
  }
  public getOverridenColor(): any {
    return this.overriddenColor[this.overriddenColor.length  -1];
  }
  public setOverridenColor(color: string) {
    this.overriddenColor.push({color: color, value: this.getValue()});
  }
  public removeOverridenColor(): void {
    this.overriddenColor.pop();
  }
  // public getExtraValue(): number {
  //   return this.extraValue;
  // }
  // public setExtraValue(value: number): void {
  //   this.extraValue = value;
  // }
  public isNumber() {
    return this.value;
  }
  public hasRightWall(): boolean {
    return this.rightWall;
  }
  public hasDownWall(): boolean {
    return this.downWall;
  }
  public hasRightLink(): boolean {
    return this.rightLink;
  }
  public hasDownLink(): boolean {
    return this.downLink;
  }
  public setRightWall(b: boolean): void {
    this.rightWall = b;
  }
  public setDownWall(b: boolean): void {
    this.downWall = b;
  }
  public setRightLink(b: boolean, color: string): void {
    this.rightLink = b;
    this.rightLinkColor  = color;
  }
  public setDownLink(b: boolean, color: string): void {
    this.downLink = b;
    this.downLinkColor = color;
  }
}

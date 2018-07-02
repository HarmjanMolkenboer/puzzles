import { Row } from './model.row';

import { ChangeDetectorRef } from '@angular/core';
export class Square {
  private y: number;
  private x: number;
  private value: number;
  private solutionValue: number;
  private color: string;
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
  private rightWall = false;
  private downWall = false;
  private rightLink = false;
  private downLink = false;
  private rightLinkColor: string;
  private downLinkColor: string;
  private strokeWidth = 0;
  private path = '';
  private opacity = 1;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.value = 0;
    // this.extraValue = 0;
    this.solutionValue = -1;
  }
  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public getValue(): number {
    return this.value;
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
  public getStrokeWidth() {
    return this.strokeWidth;
  }
  public setStrokeWidth(n: number) {
    this.strokeWidth = n;
  }
  public getPath(): string {
    console.log('getpath')
    return this.path;
  }
  public setPath(d: string) {
    // alert(this.numberOfErrors)
    // alert('change '+d)
    // ChangeDetectorRef.markForCheck();
    this.path = d;
  }
  public getOpacity() {
    return this.opacity;
  }
  public setOpacity(n: number) {
    this.opacity = n;
  }
  public setValue(newValue: number) {
    return this.value = newValue;
  }
  public setColor(color: string) {
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
  public getIsElement(): boolean {
    return false;
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
    this.highlighted = show;
  }
  public showSelectDrawing(show: boolean): void {
    this.selected = show;
  }
  public showError(show: boolean): void {
    this.hasError = show;
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

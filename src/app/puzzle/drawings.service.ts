import { Injectable, ElementRef } from '@angular/core';
@Injectable()
export class DrawingsService {
  private offsetX: number;
  private offsetY: number;
  constructor() { }
  getMagnetBorder(dir: number) {
    const drawing = this.getEmptyPath();
    if (dir === 0) {
      drawing.setAttribute('d', 'M3,3 L197,3 L197,97 L3,97 Z');
    } else {
      drawing.setAttribute('d', 'M3,3 L97,3 L97,197 L3,197 Z');
    }
    drawing.setAttribute('fill', 'transparent');
    drawing.setAttribute('stroke-width', '6');
    drawing.setAttribute('stroke', 'black');
    return drawing;
  }
  getSquarePath() {
    return 'M10 10 L90 10 L90 90 L10 90 Z';
  }
  getCirclePath() {
    return 'M50 90 A40 40 0 1 0 50 10 A40 40 0 1 0 50,90';
  }
  getDotPath() {
    return 'M50 60 A10 10 0 1 0 50 40 A10 10 0 1 0 50 60';
  }
  getPlusPath() {
    return 'M45 10 L55 10 L55 45 L90 45 L90 45 L90 55 L55 55 L55 90 L45 90 L45 55 L10 55 L10 45 L45 45 Z';
  }
  getMinusPath() {
    return 'M10 45 L90 45 L90 55 L10 55 Z';
  }
  getCrossPath(dir: number): string {
    if (dir === 0) {
      return 'M8 8 L192 92 M8 92 L192 8';
    } else {
      return 'M8 8 L92 192 M92 8 L8 192';
    }
  }
  getShipPartPath(dir: number, next: number) {
    if (dir === 0) {
      if (next === 0) {
        return 'M50 90 A40 40 0 1 0 50 10 L10 10 L10 90 Z'; // links open
      } else {
        return 'M50 10 A40 40 0 1 0 50 90 L90 90 L90 10 Z'; // rechts open
      }
    } else {
      if (next === 0) {
        return 'M10 50 A40 40 0 1 0 90 50 L90 10 L10 10 Z'; // boven open
      } else {
        return 'M90 50 A40 40 0 1 0 10 50 L10 90 L90 90 Z'; // onder open
      }
    }
  }
  getWaterPath() {
    return 'M10 20 A12 12 0 0 1 26 20 A12 12 0 0 0 42 20 A12 12 0 0 1 58 20 A12 12 0 0 0 74 20 A12 12 0 0 1 90 20' +
           'M10 40 A12 12 0 0 1 26 40 A12 12 0 0 0 42 40 A12 12 0 0 1 58 40 A12 12 0 0 0 74 40 A12 12 0 0 1 90 40' +
           'M10,60 A12 12 0 0 1 26 60 A12 12 0 0 0 42 60 A12 12 0 0 1 58 60 A12 12 0 0 0 74 60 A12 12 0 0 1 90 60' +
           'M10,80 A12 12 0 0 1 26 80 A12 12 0 0 0 42 80 A12 12 0 0 1 58 80 A12 12 0 0 0 74 80 A12 12 0 0 1 90 80';
  }
  getTreePath() {
    return 'M40, 87 L60, 87 L60 75 A13 13 0 0 0 77 37 A13 13 0 0 0 22 37 A13 13 0 0 0 40 75 L40 75 Z';
  }
  // drawTree(drawing: SVGPathElement): void {
  //   drawing.setAttribute('d', 'M40, 87 L60, 87 L60, 75 A13, 13 0 0, 0 77, 37 A13 13 0 0, 0 22, 37 A13, 13 0 0, 0 40, 75 L40, 75 Z');
  //   drawing.setAttribute('stroke-width', '0');
  // }
  getGrassPath() {
    const nX = 8, nY = 6;
    let d = '';
    for (let x = 1; x < nX - 1; x++) {
      for (let y = 1; y < nY - 1; y++) {
        d = d + 'M' + (100 * x / nX + 50 / nX) + ' ' + (100 * y / nY + 50 / nY + 6);
        d = d + ' L' + (100 * x / nX  + 50 / nX) + ' ' + (100 * y / nY + 50 / nY) + ' ';
        d = d + ' L' + (100 * x / nX + 50 / nX + 5) + ' ' + (100 * y / nY + 50 / nY - 5) + ' ';
      }
    }
    return d;
  }
  getTentPath() {
    return 'M20 80 L50 20 L80 80 Z';
  }
  drawHouse(drawing: SVGPathElement): void {
    drawing.setAttribute('d', 'M20, 90 L20, 50 L50,10 L80, 50 L80,90 Z');
    drawing.setAttribute('stroke-width', '0');
  }
  getCarPath() {
    return 'M25 30 A30 35 0 1 0 75 30 Z'
  }
  drawEmptyDrawing(drawing: SVGPathElement): void {
    drawing.setAttribute('d', '');
  }
  public getShip(length: number): SVGPathElement {
    const drawing: SVGPathElement = this.getEmptyPath();
    drawing.setAttribute('stroke-width', '0');
    if (length === 1) {
      drawing.setAttribute('d', 'M50,95 A45,45 0 1, 0 50,5 A45,45 0 1,0 50,95');
    } else {
      drawing.setAttribute('d', 'M50,5 A45,45 0 1,0 50,95 L95,95 L95,5 Z'); // rechts open
      let i = 1;
      for (; i < length - 1; i++) {
        drawing.setAttribute('d', drawing.getAttribute('d') + ' M' + i + '05,5 L' + i + '95,5 L' + i + '95,95 L' + i + '05,95 Z');
      }
      drawing.setAttribute('d', drawing.getAttribute('d') + 'M' + i + '50,95 A45,45 0 1,0 ' + i + '50,5 L' + i + '05,5 L' + i + '05,95 Z');
    }
    drawing.setAttribute('stroke-width', '0');
    return drawing;
  }
  public getPenta(ar: number[][]): SVGPathElement {
    const drawing: SVGPathElement = this.getEmptyPath();
    let d = '';
    for (const c of ar) {
      const x = 100 * c[0] + 5;
      const y = 100 * c[1] + 5;
      d = d + ' M' + x + ', ' + y + ' L' + (x + 90) + ', ' + y + ' L' + (x + 90) + ', ' + (y + 90) + ' L' + x + ', ' + (y + 90) + 'Z';
    }
    drawing.setAttribute('d', d);
    drawing.setAttribute('stroke-width', '0');
    drawing.setAttribute('fill', 'black');
    return drawing;
  }
  public createSVGElement(kind: string): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', kind);
  }
  public getEmptyPath(): SVGPathElement {
    return document.createElementNS('http://www.w3.org/2000/svg', 'path');
  }
  public translate(element: SVGElement, x: number, y: number) {
    element.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
  }
  public translateToSquare(element: SVGElement, x: number, y: number, offx: number, offy: number) {
    this.translate(element, x * 100 + this.offsetX + offx, y * 100 + this.offsetY + offy);
  }
  public setOffsetX(x: number) {
    this.offsetX = x;
  }
  public setOffsetY(y: number) {
    this.offsetY = y;
  }
}

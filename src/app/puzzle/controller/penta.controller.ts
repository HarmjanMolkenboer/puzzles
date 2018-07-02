// bugs: onderaan trekt ie het niet
// niet overal gaat t goed

import { SymbolsPuzzleController } from './abstract/symbols-puzzle.controller';
import { Square } from '../model/model.square';
// import {PuzzleComponent} from '../puzzle.component';
import { Row } from '../model/model.row';
import { DrawingsService } from '../drawings.service';
import { PuzzleService } from '../../puzzles-home/puzzle.service';

export class PentaController extends SymbolsPuzzleController {
  private elements = [];
  private elcoords = [];
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }

  // constructor(puzzle: PuzzleComponent, width: number, height: number) {
  //   super(puzzle, 'grid', width, height, 1);
  //   this.elements = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  //   // stick
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 2, false));
  //   // weird
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [1, 1], [1, 2], [2, 1]], 4, true));
  //   // S
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], 2, true));
  //   // u
  //   this.elcoords.push(this.getRotations([[0, 0], [0, 1], [1, 1], [2, 0], [2, 1]], 4, false));
  //   // small t
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [2, 0], [2, 1], [3, 0]], 4, true));
  //   // big t
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [1, 1], [1, 2], [2, 0]], 4, false));
  //   // zigzag
  //   this.elcoords.push(this.getRotations([[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], 4, true));
  //   // hockey stick
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], 4, true));
  //   // b
  //   this.elcoords.push(this.getRotations([[0, 0], [0, 1], [1, 0], [1, 1], [2, 1]], 4, true));
  //   // L
  //   this.elcoords.push(this.getRotations([[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], 4, true));
  //   // ss
  //   this.elcoords.push(this.getRotations([[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]], 4, true));
  //   // cross
  //   this.elcoords.push(this.getRotations([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], 1, false));
  //   // this.drawElements();
  // }
  public initSquaresAndRows(): void {
    super.initSquaresAndRows();
    this.drawElements();
  }
  private getRotations(ar: number[][], rot: number, mirror: boolean): number[][][] {
    const rotations = [ar];
    if (mirror) {
      rotations.push(this.mirror(ar));
    }
    for (let r = 1; r < rot; r++) {
      const ar2 = [];
      for (let i = 0; i < ar.length; i++) {
        ar2.push(this.rotate(ar[i]));
      }
      rotations.push(this.normalize(ar2));
      if (mirror) {
        rotations.push(this.mirror(ar2));
      }
      ar = ar2;
    }
    return rotations;
  }
  private rotate(coord: number[]): number[] {
    return [coord[1], -coord[0]];
  }
  private mirror(ar: number[][]): number[][] {
    const ar2 = [];
    for (const c of ar) {
      ar2.push([-c[0], c[1]]);
    }
    return this.normalize(ar2);
  }
  private normalize(ar: number[][]): number[][] {
    let minx = 100;
    let miny = 100;
    for (const coord of ar) {
      if (coord[0] < minx) {
        minx = coord[0];
      }
      if (coord[1] < miny) {
        miny = coord[1];
      }
    }
    for (const coord of ar) {
      coord[0] -= minx;
      coord[1] -= miny;
    }
    return ar.sort((c1, c2) => 10 * c1[0] + c1[1] - 10 * c2[0] - c2[1]);
  }
  private drawElements(): void {
//     const elementsDrawing = this.getPuzzleComponent().getElementsSVG();
//     const scale = 0.28;
//     // elementsDrawing.setAttribute('transform', 'translate(' + (100 * this.getWidth() + 120) + ', 600) scale(' + scale + ')');
//     const drawingService = this.getPuzzleComponent().getDrawingsService();
//     let y = 0;
//     let x = 0;
//     y = 440 + scale * 100;
//     const xcoords = [1.5, 8, 0, 3.5, 7, 0, 3.5, 7, 1.75, 0, 3.5, 8];
//     const ycoords = [0, 0, 0.5, 1.5, 2.5, 3, 4, 5, 5.75, 6.5, 7.5, 6.5];
//     const rot =     [0, 3, 3, 0, 4, 1, 4, 1, 0, 0 ,5 ,0];
//     for (let index = 0; index < this.elements.length; index++) {
//       // x = 550 * (index % 2) * scale;
// //      for (let j = 0; j < this.elements[index]; j++) {
//         const drawing: SVGPathElement = drawingService.getPenta(this.elcoords[index][rot[index]]);
//         x = 100 * scale * xcoords[index];
//         y = 100 * scale * ycoords[index];
//         drawing.setAttribute('transform', 'translate(' + x + ', ' + y + ') scale(' + scale + ')');
//         elementsDrawing.appendChild(drawing);
// //      }
//       // if (index % 2 === 1) {
//       //   y = y - 350 * scale;
//       // }
//     }
  }
  public setClue(sq: Square, value: number, key: number) {
    super.setClue(sq, value, key);
    if (this.getKey() === 3) {
      sq.setOpacity(0);
    }
  }
  public initRows(decripted: number[]) {
    super.initRows(decripted);
    if (this.getKey() === 3) { // Minesweeper
      for (let index = 0; index < decripted.length; index++) {
        if (decripted[index] === 2) {
          this.addMinesweeperRow(this.getSquare(index % this.getWidth(), Math.floor(index / this.getWidth())));
        }
      }
    }
  }
  public drawSquare(sq: Square, value: number): void {
    const drawingService = this.getDrawingsService();
    if (value === 0) {
      sq.setPath('');
      sq.showError(false);
    } else if (value === 1) {
      sq.setStrokeWidth(6);
      sq.setPath(drawingService.getWaterPath());
      sq.showError(false);
  } else {
      sq.setStrokeWidth(0);
      sq.setPath(drawingService.getSquarePath());
    }
  }
  public valueChanged(sq: Square, oldValue: number): void {
    this.drawSquare(sq, sq.getValue());
  }
  public checkErrorsAndElements(): void {
    let isSolved = true;
    for (let i = 0; i < this.elements.length; i++) {
      // this.getPuzzleComponent().getElementsSVG().children[i].setAttribute('fill', 'black');
    }
    const squares = this.getSquares().filter(s => s.getValue() === 2);
    while (squares.length > 0) {
      const sq = squares[0];
      const sqs = this.getConnectedSquares(sq, s => s.getValue() === 2);
      sqs.forEach(s => {
        s.showError(false);
        squares.splice(squares.indexOf(s), 1);
      });
      if (sqs.length > 5) {
        sqs.forEach(s => s.showError(true));
      } else if (sqs.length >= 4) {
        if (sqs.some(s => this.getDiagonalNeighbors(s).some(squ => squ.getValue() === 2 && !sqs.includes(squ)))) {
          sqs.forEach(s => s.showError(true));
        } else if (sqs.length === 5) {
          const ar = [];
          sqs.forEach(s => ar.push([s.getX(), s.getY()]));
          const sortedAr = this.normalize(ar);
          if (!this.findElement(sortedAr)) {
            sqs.forEach(s => s.showError(true));
            isSolved = false;
          }
        } else if (this.isEnclosed(sqs)) {
          sqs.forEach(s => s.showError(true));
          isSolved = false;
        }
      } else if (this.isEnclosed(sqs)) {
          sqs.forEach(s => s.showError(true));
          isSolved = false;
      }
    }
    if (isSolved) {
      for (let i = 0; i < this.elements.length; i++) {
        // if (this.getPuzzleComponent().getElementsSVG().children[i].getAttribute('fill') !== 'gray'){
        //   return;
        // }
      }
      if (this.areAllRowsCorrect()) {
        this.puzzleSolved();
      }
    }
  }
  private findElement(ar: number[][]) {
    for (let i = 0; i < this.elcoords.length; i++) {
      for (let j = 0; j < this.elcoords[i].length; j++) {
        if (this.isElement(ar, this.elcoords[i][j])) {
          // const drawing = this.getPuzzleComponent().getElementsSVG().children[i];
          // drawing.setAttribute('fill', drawing.getAttribute('fill') === 'black' ? 'gray' : 'red');
          return true;
        }
      }
    }
  }
  private isElement(ar: number[][], element: number[][]): boolean {
    for (let k = 0; k < ar.length; k++) {
      if (ar[k][0] !== element[k][0] || ar[k][1] !== element[k][1]) {
        return false;
      }
    }
    return true;
  }
  private isEnclosed(sqs: Square[]): boolean {
    return !sqs.some(s => this.getAdjacentNeighbors(s).some(sq => sq.getValue() === 0));
  }
 // private checkDiagonals(sqs: Square[]): boolean {
 //
 // }
}

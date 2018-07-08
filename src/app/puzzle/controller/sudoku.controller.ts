import {NumbersPuzzleController} from './abstract/numbers-puzzle.controller';
import {Square} from '../model/model.square';
import {Row} from '../model/model.row';
import { DrawingsService } from '../drawings.service';
import { PuzzleService } from '../../puzzles-home/puzzle.service';
export class SudokuController extends NumbersPuzzleController {
  // TODO undo en kleuren werkt nog niet goed...
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
    this.minNumber = 1;
    this.maxNumber = this.getWidth();
  }
  public addButtons(): void {
    // for (let i = 0; i < this.getWidth(); i++) {
    //   this.getPuzzleComponent().controlPanel.numberlist.push(i+1);
    // }
    // this.getPuzzleComponent().controlPanel.numberlist.push('C');
  }
  public initSquaresAndRows(): void {
    super.initSquaresAndRows();
    // this.drawElements();
    if (this.getPuzzle().code === 'sudoku') {
      for(let y = 0; y < 3; y++) {
				for(let x = 0; x < this.getWidth() / 3; x++) {
					const row:Row = new Row(0, undefined, undefined, true);
          this.getAllRows().push(row);
					for (let y1 = y * this.getWidth() / 3; y1 < (y + 1) * this.getWidth() / 3; y1++){
						for (let x1 = 3 * x; x1 < 3 * x + 3; x1++){
							this.getSquare(x1, y1).addRow(row);
						}
					}
				}
			}
      // this.getSquares().filter(sq=>sq.getX() % 3 === 2).forEach(s => s.setRightWall(true));
      // this.getSquares().filter(sq=>sq.getY() % (this.getWidth() / 3) === this.getWidth() / 3 - 1).forEach(s=>s.setDownWall(true));
    } else if (this.getPuzzle().code === 'sudoku_chaos') {
      do {
        const square = this.getSquares().find(sq => sq.getRows().length === 2);
        if (square === undefined) {
          break;
        }
        const row:Row = new Row(0, undefined, undefined, true);
        this.getAllRows().push(row);
        this.getChaosRow(square).forEach(s=>s.addRow(row));
      } while(true);
    }
  }
  public hasRightWall(value: number, index: number): boolean {
    switch(this.getPuzzleService().getPuzzle().code) {
    case 'sudoku':
      return index % 3 === 2;
    case 'sudoku_chaos':
      return ((value & 2) === 2);
    }
    return false;
  }
  public hasDownWall(value: number, index: number): boolean {
    switch(this.getPuzzleService().getPuzzle().code) {
    case 'sudoku':
      return (this.getY(index) + 1) % (this.getWidth() / 3) === 0;
    case 'sudoku_chaos':
      return ((value & 1) === 1);
    }
    return false;
  }
  public getKey() {
    if (this.getPuzzle().code === 'sudoku') {
      return super.getKey();
    }
    return super.getKey() * 4;
  }
  public getChaosRow(sq: Square): Square[] {
    return this.connectRow([sq], sq);
  }
  private connectRow(squares: Square[], addedSquare): Square[] {
    for (let dir = 0; dir < 2; dir++) {
      const preNeigh = this.getNeighbor(addedSquare, dir, 0);
      if (preNeigh !== undefined && !squares.includes(preNeigh)) {
        if ((dir === 0 && !preNeigh.hasRightWall()) || (dir === 1 && !preNeigh.hasDownWall())) {
          squares.push(preNeigh);
          squares = this.connectRow(squares, preNeigh);
        }
      }
      if ((dir === 0 && !addedSquare.hasRightWall()) || (dir === 1 && !addedSquare.hasDownWall())) {
        const nextNeigh = this.getNeighbor(addedSquare, dir, 1);
        if (nextNeigh === undefined) {
          continue;
        }
        squares.push(nextNeigh);
        squares = this.connectRow(squares, nextNeigh);
      }
    }
    return squares;
  }
  public getSolutionValue(value: number) {
    switch (this.getPuzzle().code) {
      case 'sudoku_chaos':
        return value % 18;
      default:
        return 1 << (value % this.getWidth()) + 1;
    }
  }
  isError(sq: Square): boolean {
    return false;
  }
  isElement(sq: Square): boolean {
    return false;
  }
  public valueChanged(sq: Square, oldValue: number): void {
    if (sq.getOverridenColor() !== undefined) {
      if (sq.getValue() === sq.getOverridenColor().value) {
        sq.removeOverridenColor();
      }
    }
    this.drawSquare(sq, sq.getValue());
  }
  // getCoord(sqId: number, coord: number): number {
  //   return(this.getPuzzleComponent().getScale() * (40 * sqId + coord));
  // }
  public changeValueOfSquare(sq: Square, newValue: number, newColor: string) {
    sq.setValue(newValue);
    sq.setColor(newColor);
  }
  public getMaxValue(): number {
    return this.getWidth();
  }
  public checkErrorsAndElements(): void {
    let solved = true;
    this.getSquares().forEach(sq => sq.showError(false));
    for (const row of this.getAllRows()) {
      const sqs = this.getSquares().filter(sq => sq.getRows().includes(row)).filter(sq => this.getNumbers(sq.getValue()).length === 1);
      for (let i = 0; i < sqs.length - 1; i++) {
        for (let j = i + 1; j < sqs.length; j++) {
          if (sqs[i].getValue() === sqs[j].getValue()) {
            sqs[i].showError(true);
            sqs[j].showError(true);
            solved = false;
          }
        }
      }
    }
    if (solved) {
      for (const sq of this.getSquares()) {
        if (this.getNumbers(sq.getValue()).length != 1) {
          solved = false;
          break;
        }
      }
      if (solved) {
        this.puzzleSolved();
      }
    }
  }
}

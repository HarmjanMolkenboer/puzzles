import {PuzzleController} from './puzzle.controller';
import {Square} from '../../model/model.square';
import {Row} from '../../model/model.row';
import { DrawingsService } from '../../drawings.service';
import { PuzzleService } from '../../../puzzles-home/puzzle.service';

export abstract class NumbersPuzzleController extends PuzzleController {
  minNumber: number;
  maxNumber: number;
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
    this.gridType='grid';
  }
  public isNumbersPuzzle() {
    return true;
  }
  public getNumberList(): any[] {
    const n = [];
    for (let i=this.minNumber; i <= this.maxNumber; i++) {
      n.push(i);
    }
    n.push('C');
    return n;
    // return Array.from(Array(this.maxNumber + 1 - this.minNumber),(x,i)=>i + this.minNumber).push('C');
    // return this.getPuzzleService().getRange(this.minNumber, this.maxNumber + 1);
  }
  // constructor(puzzleComponent: PuzzleComponent, gridType: string, height: number, width: number, numberofBorderValues: number, minNumber: number, maxNumber: number) {
  //   super(puzzleComponent, gridType, height, width, numberofBorderValues);
  //   this.minNumber = minNumber;
  //   this.maxNumber = maxNumber;
  // }
  public changeValueOfSquare(sq: Square, newValue: number, newColor: string) {
    const oldNumbers = this.getNumbers(sq.getValue());
    const newNumbers = this.getNumbers(newValue);
    if (newNumbers.length === 1  && newNumbers[0] >= 1) {
      for (const row of sq.getRows()){
        row.raiseValue(newNumbers[0] - 1);
      }
    }
    if (oldNumbers.length === 1  && oldNumbers[0] >= 1) {
      for (const row of sq.getRows()){
        row.lowerValue(oldNumbers[0] - 1);
      }
    }
    sq.setValue(newValue);
    sq.setColor(newColor);
  }
  public drawSquare(sq: Square, val: number) {
  }
  protected getNumbers(val: number): number[] {
    let numbers = [];
    for (let i = 0; i <= this.maxNumber; i++) {
      if ((val & (1 << i)) !== 0) {
        numbers.push(i);
      }
    }
    return numbers;
  }
  public numberClicked(n: number) {
    if(!this.getPuzzleService().activated) return;
    const val: number = (1 << n);
    const sq = this.getSelectedSquare();
    if (sq !== undefined) {
      this.getPuzzleService().setValue(sq, sq.getValue() ^ val, false, true, this.getPuzzleService().getPuzzle().color);
      this.getPuzzleService().endMove();
    }
  }
  public keyPressed(event: KeyboardEvent): void {
    if (this.getSelectedSquare() === undefined) {
      return;
    }
    const key: string = event.key;
    const sq: Square = this.getSelectedSquare();
    const n: number = key === 'x' ? 0 : Number(key);
    if (!isNaN(n) && n >= this.minNumber && n <= this.maxNumber) { // number pressed
      const val: number = (1 << n);
      this.getPuzzleService().setValue(sq, sq.getValue() ^ val, false, true, this.getPuzzle().color);
      this.getPuzzleService().endMove();
    } else {
      if (key === 'Backspace' || key === 'Delete' || key === 'c') {
        this.getPuzzleService().setValue(sq, 0, false, true, sq.getColor());
        this.getPuzzleService().endMove();
        // this.drawSquare(sq, sq.getValue());
      }
      else if (key === 'a' || key === 'ArrowLeft') {
        let x: number = sq.getX() - 1;
        if (x === -1) {
          x = this.getWidth() - 1;
        }
        this.selectSquare(this.getSquare(x, sq.getY()));
      } else if (key === 'd' || key === 'ArrowRight') {
        const x: number = (sq.getX() + 1) % this.getWidth();
        this.selectSquare(this.getSquare(x, sq.getY()));
      } else if (key === 'w' || key === 'ArrowUp') {
        let y: number = sq.getY() - 1;
        if (y === -1) {
          y = this.getHeight() - 1;
        }
        this.selectSquare(this.getSquare(sq.getX(), y));
      } else if (key === 's' || key === 'ArrowDown') {
        const y: number = (sq.getY() + 1) % this.getHeight();
        this.selectSquare(this.getSquare(sq.getX(), y));
      }
    }
  }
  public canBeOverridden(sq: Square, newValue: number): boolean {
    if (sq.getColor() === undefined) {
      return true;
    }
    if (sq.getNumbers().length <= 1) {
      return false;
    }
    if (sq.getOverridenColor() === undefined) {
      if ((sq.getValue() & newValue) === newValue) {
        if (sq.getColor() !== this.getPuzzle().color){
          sq.setOverridenColor(sq.getColor());
        }
        return true;
      }
    } else {
      if ((sq.getOverridenColor().value & newValue) === newValue) {
        if (sq.getColor() !== this.getPuzzle().color){
          sq.setOverridenColor(sq.getColor());
        }
        return true;
      }
    }
    return false;
  }
  public getOverridenValue(sq: Square, newValue: number, newColor: string, recalculate: boolean): any {
    const overValue = sq.getOverridenColor().value;
    const overColor = sq.getOverridenColor().color;
    if (overValue === newValue) {
      sq.removeOverridenColor();
      return {value: newValue, color: overColor};
    }
    if ((overValue & newValue) !== newValue) {
      return {value: sq.getValue(), color: overColor};
    }
    if (newValue === 0) {
      sq.removeOverridenColor();
      return {value: overValue, color: overColor};
    }
    // if ((newValue & overValue) !== newValue) {
    //   newValue = sq.getValue();
    // } else if (sq.getColor() !== sq.getOverridenColor().color) {
    //   if (newValue === 0) {
    //     newValue = sq.getOverridenColor().value;
    //     newColor = sq.getOverridenColor().color;
    //   } else{
    //     sq.setOverridenColor(sq.getColor());
    //   }
    // }
    return {value: newValue, color: newColor};
  }

  public getNumberButtons() {
    return this.numberButtons;
  }
  public drag(sq: Square): void {};
  public leftClicked(sq: Square) {
    this.selectSquare(sq);
  }
  public rightClicked(sq: Square) {
    this.getPuzzleService().setValue(sq, 0, false, true, this.getPuzzle().color);
    this.selectSquare(sq);
  }
  // public getMainDrawing(sq: Square): SVGElement {
  //   return sq.getText();
  // }
}

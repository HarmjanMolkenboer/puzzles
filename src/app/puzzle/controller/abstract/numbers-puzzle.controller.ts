import {PuzzleController} from './puzzle.controller';
import {PuzzleComponent} from '../../puzzle.component';
import {Square} from '../../model/model.square';
import {Row} from '../../model/model.row';
import { DrawingsService } from '../../drawings.service';
import { PuzzleService } from '../../../puzzles-home/puzzle.service';

export abstract class NumbersPuzzleController extends PuzzleController {
  private minNumber: number;
  private maxNumber: number;
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
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
    // if(!this.getPuzzleComponent().isActivated()) return;
    // const val: number = (1 << n);
    // const sq = this.getSelectedSquare();
    // if (sq !== undefined) {
    //   this.getPuzzleComponent().setValue(sq, sq.getValue() ^ val, false, true, this.getPuzzleComponent().getColor());
    //   this.getPuzzleComponent().endMove();
    // }
  }
  protected setSolutionValue(sq: Square, value: number){
    const x = sq.getX();
    const y = sq.getY();
    const key = this.getPuzzle().code === 'suc' ? this.getKey() / 4 : this.getKey();
    if (value >= key / 2) {
      this.setClue(sq, value, key);
    } else {
      sq.setSolutionValue(1 << (value + this.minNumber));
      if (value > 0 && this.getNumberOfBorderValues() > 0) {
        sq.getRows().forEach(r => r.raiseSolutionValue(value - 1));
      }
    }
  }
  public setClue(sq: Square, value: number, key: number) {
    // TODO kan beter
    value = value - Math.ceil(key / 2) + this.minNumber;
    // value = 1 << value;
    sq.setSolutionValue(1 << (value));
    if (value > 0 && this.getNumberOfBorderValues() != 0) {
      sq.getRows().forEach(r => r.raiseSolutionValue(value - 1));
    }
    this.getPuzzleService().setValue(sq, 1 << (value), false, false, 'black');
  }
  public drawClue(sq: Square) {

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
    if (this.getNumbers(sq.getValue()).length <= 1) {
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

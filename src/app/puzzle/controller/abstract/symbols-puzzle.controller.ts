import {PuzzleController} from './puzzle.controller';
import {Square} from '../../model/model.square';
import {Row} from '../../model/model.row';
import { DrawingsService } from '../../drawings.service';
import {PuzzleService} from '../../../puzzles-home/puzzle.service';

export abstract class SymbolsPuzzleController extends PuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }
  public isNumbersPuzzle() {
    return false;
  }
  public changeValueOfSquare(sq: Square, newValue: number, newColor: string) {
    if (newValue > 1) {
      for (const row of sq.getRows()){
        row.raiseValue(newValue - 2);
      }
    }
    if (sq.getValue() > 1) {
      for (const row of sq.getRows()){
        row.lowerValue(sq.getValue() - 2);
      }
    }
    sq.setValue(newValue);
    sq.setColor(newColor);
  }

  // public setClue(sq: Square, value: number, key: number) {
  //   // TODO kan beter
  //   value = value + 1 - Math.ceil(key / 2);
  //   sq.setSolutionValue(value);
  //   if (value >= 2) {
  //     sq.getRows().forEach(r => r.raiseSolutionValue(value - 2));
  //   }
  //   this.getPuzzleService().setValue(sq, value, false, false, 'black');
  // }
  public drag(sq: Square): void {
    if (this.getDragSquare() !== undefined) {
     if (this.getPreDragSquare().getY() === sq.getY() && this.getPreDragSquare().getX() - sq.getX() > 1) {
        for (let x = this.getDragSquare().getX() - 1; x > sq.getX(); x--) {
          this.getPuzzleService().setValue(this.getSquare(x, sq.getY()), this.getDragSquare().getValue(), true, true, this.getPuzzle().color);
        }
      } else if (this.getPreDragSquare().getY() === sq.getY() && this.getPreDragSquare().getX() - sq.getX() < -1) {
        for (let x = this.getDragSquare().getX() + 1; x < sq.getX(); x++) {
          this.getPuzzleService().setValue(this.getSquare(x, sq.getY()), this.getDragSquare().getValue(), true, true, this.getPuzzle().color);
        }
      } else if (this.getPreDragSquare().getX() === sq.getX() && this.getPreDragSquare().getY() - sq.getY() < -1) {
        for (let y = this.getDragSquare().getY() + 1; y < sq.getY(); y++) {
          this.getPuzzleService().setValue(this.getSquare(sq.getX(), y), this.getDragSquare().getValue(), true, true, this.getPuzzle().color);
        }
      } else if (this.getPreDragSquare().getX() === sq.getX() && this.getPreDragSquare().getY() - sq.getY() > 1) {
        for (let y = this.getDragSquare().getY() - 1; y > sq.getY(); y--) {
          this.getPuzzleService().setValue(this.getSquare(sq.getX(), y), this.getDragSquare().getValue(), true, true, this.getPuzzle().color);
        }
      }
      this.getPuzzleService().setValue(sq, this.getDragSquare().getValue(), true, true, this.getPuzzle().color);
      this.setPreDragSquare(sq);
    }
  }
  public leftClicked(sq: Square) {
    let v = sq.getValue() + 1;
    if (v === this.getMaxValue()) {
      v = 0;
    }
    this.getPuzzleService().setValue(sq, v, false, true, this.getPuzzle().color);
    this.setDragSquare(sq);
  }
  public rightClicked(sq: Square) {
    let v = sq.getValue() - 1;
    if (v === -1) {
      v = this.getMaxValue() - 1;
    }
    this.getPuzzleService().setValue(sq, v, false, true, this.getPuzzle().color);
    this.setDragSquare(sq);
  }
  public keyPressed(event: KeyboardEvent): void {
  }
}

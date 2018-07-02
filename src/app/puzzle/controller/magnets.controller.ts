import { SymbolsPuzzleController } from './abstract/symbols-puzzle.controller';
import { Square } from '../model/model.square';
import {PuzzleComponent} from '../puzzle.component';
import {Row} from '../model/model.row';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
import { DrawingsService } from '../drawings.service';

export class MagnetsController extends SymbolsPuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }
  public initSquaresAndRows(): void {
    const drawingService = this.getDrawingsService();
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        this.getSquares().push(this.newSquare(x, y));
      }
    }
    // const plus = drawingService.getEmptyPath();
    // drawingService.drawPlus(plus);
    // plus.setAttribute('fill', 'black');
    // drawingService.translateToSquare(plus, this.getHeight(), this.getWidth(), 0, 0);
    // const minus = drawingService.getEmptyPath();
    // drawingService.drawMinus(minus);
    // minus.setAttribute('fill', 'black');
    // drawingService.translateToSquare(minus, this.getHeight() + 1, this.getWidth() + 1, 0, 0);
    // this.getPuzzleComponent().getGridLayer().appendChild(plus);
    // this.getPuzzleComponent().getGridLayer().appendChild(minus);
    const decripted = this.decript(this.getPuzzle().repr);
    // alert(decripted);
    this.initRows(decripted);
    let index = 0;
    for (const sq of this.getSquares()) {
      if(sq.getSolutionValue() !== -1) {
        continue;
      }
      const v = decripted[index++];
      const clue = Math.floor(v / 6);
      const dir = Math.floor((v - 6 * clue) / 3);
      const value = v - 6 * clue - 3 * dir;
      // console.log(sq.getX()+','+sq.getY() + ' dir: '+dir + ' value = '+value);
      const neigh = this.getNeighbor(sq, dir, 1);
      // if (neigh === undefined) {
      // alert(v + "sq: "+sq.getX() + ", "+sq.getY() + " dir "+dir + " v: "+value);
      // }
      sq.setOtherSquare(neigh);
      neigh.setOtherSquare(sq);
      if (dir === 0) {
        sq.setDownWall(true);
        neigh.setDownWall(true);
        neigh.setRightWall(true);
      } else {
        sq.setRightWall(true);
        neigh.setRightWall(true);
        neigh.setDownWall(true);
      }
      this.setSolutionValue(sq, value);
      this.setSolutionValue(neigh, value === 0 ? 0 : 3 - value);
    }
    for (const row of this.getAllRows()) {
      row.setText();
    }
  }
  public getOverridenValue(sq: Square, newValue: number, newColor: string, recalculate: boolean): any {
    if (newColor !== sq.getOverridenColor().color) {
      if (newValue === 1) {
        newValue = 4;
      } else if (newValue === 0) {
        newValue = recalculate ? 2 : 4;
      }
      if (newValue === 4) {
        newColor = sq.getOverridenColor().color;
      }
    }
    return {value: newValue, color: newColor};
  }
  public drag(sq: Square): void {
    if (this.getDragSquare() !== undefined) {
      let v = this.getDragSquare().getValue();
      if (v === 2 || v === 3) {
        if ((this.getDragSquare().getX() + this.getDragSquare().getY() + sq.getX() + sq.getY()) % 2 === 1) {
          v = 5 - v;
        }
      }
      this.getPuzzleService().setValue(sq, v, true, true, this.getPuzzle().color);
    }
  }
  public changeValueOfSquare(sq: Square, newValue: number, newColor: string) {
    if (newValue > 1 && newValue < 4) {
      for (const row of sq.getRows()){
        row.raiseValue(newValue - 2);
      }
    }
    if (sq.getValue() > 1 && sq.getValue() < 4) {
      for (const row of sq.getRows()){
        row.lowerValue(sq.getValue() - 2);
      }
    }
    sq.setValue(newValue);
    sq.setColor(newColor);
  }

  // public changeValueOfSquare(sq: Square, newValue: number, newColor: string) {
  //   if (sq.getOverridenColor() !== undefined && newColor !== sq.getOverridenColor()) {
  //     if (newValue === 0) {
  //       newValue = 3;
  //     } else if (newValue === 4) {
  //       newValue = 2;
  //     }
  //   }
  //   if (newValue > 1) {
  //     for (const row of sq.getRows()){
  //       row.raiseValue(newValue - 2);
  //     }
  //   }
  //   if (sq.getValue() > 1) {
  //     for (const row of sq.getRows()){
  //       row.lowerValue(sq.getValue() - 2);
  //     }
  //   }
  //   sq.setValue(newValue);
  //   sq.setColor(newColor);
  // }
  //
  valueChanged(sq: Square, oldValue: number) {
    if (sq.getValue() === 0 || sq.getValue() === 1 || sq.getValue() === 4) {
      this.changeValueOfSquare(sq.getOtherSquare(), sq.getValue(), sq.getColor());
    } else {
      this.changeValueOfSquare(sq.getOtherSquare(), 5 - sq.getValue(), sq.getColor());
    }
    if (sq.getValue() === 4) {
      if (sq.getOverridenColor() === undefined || sq.getOverridenColor().color !== sq.getColor()) {
        sq.setOverridenColor(sq.getColor());
        sq.getOtherSquare().setOverridenColor(sq.getColor());
      }
    } else if(oldValue === 4 && sq.getOverridenColor() !== undefined && sq.getColor() === sq.getOverridenColor().color) {
      sq.removeOverridenColor();
      sq.getOtherSquare().removeOverridenColor();
    } else if(sq.getValue() === 0) {
      sq.removeOverridenColor();
      sq.getOtherSquare().removeOverridenColor();
    }
    if (oldValue === 2 || oldValue === 3) {
      this.getAdjacentNeighbors(sq).forEach(s => s.lowerNumberOfErrors(oldValue - 2));
      this.getAdjacentNeighbors(sq.getOtherSquare()).forEach(s => s.lowerNumberOfErrors(3 - oldValue));
    }
    if (sq.getValue() === 2 || sq.getValue() === 3) {
      this.getAdjacentNeighbors(sq).forEach(s => s.raiseNumberOfErrors(sq.getValue() - 2));
      this.getAdjacentNeighbors(sq.getOtherSquare()).forEach(s => s.raiseNumberOfErrors(3 - sq.getValue()));
    }
    this.drawSquare(sq.getOtherSquare(), sq.getOtherSquare().getValue());
    this.drawSquare(sq, sq.getValue());
  }

  public drawSquare(sq: Square, value: number) {
    // komt in de buurt
    const drawingService = this.getDrawingsService();
    if (value === 1) {
      const other = sq.getOtherSquare();
      if (sq.getX() === other.getX() - 1){
        sq.setStrokeWidth(6);
        sq.setPath(drawingService.getCrossPath(0));
      } else if (sq.getY() === other.getY() - 1) {
        sq.setStrokeWidth(6);
        sq.setPath(drawingService.getCrossPath(1));
      } else {
        sq.setPath('');
      }
    } else if (value === 2) {
      sq.setStrokeWidth(0);
      sq.setPath(drawingService.getPlusPath());
    } else if (value === 3) {
      sq.setStrokeWidth(0);
      sq.setPath(drawingService.getMinusPath());
    } else if (value === 4) {
      sq.setStrokeWidth(0);
      sq.setPath(drawingService.getDotPath());
    } else {
      sq.setPath('');
    }
  }
  checkErrorsAndElements(): void {
    let isSolved = true;
    this.getSquares().forEach(sq => sq.showError(false));
    this.getSquares().forEach(sq => {
      if (sq.getValue() === 2 || sq.getValue() === 3) {
        if (sq.isError(sq.getValue() - 2)){
          sq.showError(true);
          sq.getOtherSquare().showError(true);
          isSolved = false;
        }
      }
    });
    if (isSolved && this.areAllRowsCorrect()) {
      this.puzzleSolved();
    }
  }
  public getMaxValue(): number {
    return 5;
  }
  public canBeOverridden(sq: Square, newValue: number): boolean {
    return sq.getColor() === undefined || sq.getValue() === 4;
  }

}

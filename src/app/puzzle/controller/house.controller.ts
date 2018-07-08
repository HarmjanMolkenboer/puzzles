import {NumbersPuzzleController} from './abstract/numbers-puzzle.controller';
import {PuzzleComponent} from '../puzzle.component';
import {Square} from '../model/model.square';
import {Row} from '../model/model.row';
import { DrawingsService } from '../drawings.service';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
export class HouseController extends NumbersPuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }
  public initSquaresAndRows() {
    super.initSquaresAndRows();
  }
  public getMaxValue(): number {
    return 4;
  }
  public hasLinks(): boolean {
    return true;
  }
  public addButtons(): void {
    this.numberButtons = [1,2,3,'X','C'];
    // for (let t = 1; t <= 3; t++) {
    //   this.getPuzzleComponent().getControlPanel().buttons.push(
    //     {
    //       text: '' + t,
    //       width: 80,
    //       height: 80,
    //       xh: 90 * t + 1035,
    //       yh: 600,
    //       xv: 700 + 90 * t,
    //       yv: 1035,
    //       active: true
    //     }
    //   );
    // }
    // this.getPuzzleComponent().getControlPanel().buttons.push(
    //   {
    //     text: 'C',
    //     width: 80,
    //     height: 80,
    //     xh: 1035,
    //     yh: 600,
    //     xv: 790,
    //     yv: 1035,
    //     active: true
    //   }
    // );
    // this.getPuzzleComponent().getControlPanel().buttons.push(
    //   {
    //     text: 'X',
    //     width: 80,
    //     height: 80,
    //     xh: 1125,
    //     yh: 600,
    //     xv: 790,
    //     yv: 1125,
    //     active: true
    //   }
    // );
  }

  public valueChanged(sq: Square, oldValue: number): void {
    // TODO adjacentNeighs

    if (sq.getOverridenColor() !== undefined) {
      if (sq.getValue() === sq.getOverridenColor().value) {
        sq.removeOverridenColor();
      }
    }
    const oldNumbers = this.getNumbers(oldValue);
    const newNumbers = this.getNumbers(sq.getValue());
    if (oldNumbers.length === 1 && oldNumbers[0] > 0) {
      this.getAdjacentNeighbors(sq).forEach(s => s.lowerNumberOfErrors(oldNumbers[0]));
      this.getDiagonalNeighbors(sq).forEach(s => s.lowerNumberOfErrors(oldNumbers[0]));
    }
    if (newNumbers.length === 1 && newNumbers[0] > 0) {
      this.getAdjacentNeighbors(sq).forEach(s => s.raiseNumberOfErrors(newNumbers[0]));
      this.getDiagonalNeighbors(sq).forEach(s => s.raiseNumberOfErrors(newNumbers[0]));
    }
    this.drawSquare(sq, sq.getValue());
  }
  public checkErrorsAndElements(): void {
    const tents = [], trees = [], trees2 = [], cars = [];
    let isSolved = true;
    for (const sq of this.getSquares()) {
      const numbers = this.getNumbers(sq.getValue());
      if (numbers.length === 1 && numbers[0] !== 0) {
        // alert('error')
      // if (sq.getValue() >= 2) {
        if (sq.isError(numbers[0])) {
          sq.showError(true);
          isSolved = false;
        } else {
          sq.showError(false);
        }
      } else {
        sq.showError(false);
      }

      if (sq.getValue() === 2) {
        tents.push(sq);
      } else if (sq.getValue() === 4) {
        trees.push(sq);
        trees2.push(sq);
      } else if (sq.getValue() === 8) {
        cars.push(sq);
      }
      sq.setDownLink(false,'');
      sq.setRightLink(false,'');
    }
    // stap 1: elke tent met 1 boom en verder geen opties krijgt een lijn
    // stap 2: elke auto met 1 boom en verder geen opties krijgt een lijn
    // stap 3: elke boom met 1 tent en verder geen opties krijgt een lijn
    // stap 4: elke boom met 1 auto en verder geen opties krijgt een lijn
    // stap 5: herhaal stap 1 t/m 4 zonder tenten en bomen met lijn.
    let done: boolean;
    let index: number;
    do {
      done = true;
      index  = 0;
      while (index < tents.length) {
        const tent  = tents[index];
        const adjTrees = this.getAdjacentNeighbors(tent).filter(neigh => trees.includes(neigh));
        const posTrees = this.getAdjacentNeighbors(tent).filter(neigh => neigh.getValue() === 0 && !neigh.isError(2));
        if (posTrees.length === 0) {
          if (adjTrees.length <= 1) {
            if (adjTrees.length === 0) {
              tent.showError(true);
              isSolved = false;
            } else {
              this.showLine(adjTrees[0], tent);
              trees.splice(trees.indexOf(adjTrees[0]), 1);
            }
            tents.splice(index, 1);
            done = false;
          } else {
            index++;
          }
        } else {
          index++;
        }
      }
      if (done) {
        index  = 0;
        while (index < cars.length) {
          const car = cars[index];
          const adjTrees = this.getAdjacentNeighbors(car).filter(neigh => trees2.includes(neigh));
          const posTrees = this.getAdjacentNeighbors(car).filter(neigh => neigh.getValue() === 0 && !neigh.isError(2));
          if (posTrees.length === 0) {
            if (adjTrees.length <= 1) {
              if (adjTrees.length === 0) {
                car.showError(true);
                isSolved = false;
              } else {
                this.showLine(adjTrees[0], car);
                trees2.splice(trees2.indexOf(adjTrees[0]), 1);
              }
              cars.splice(index, 1);
              done = false;
            } else {
              index++;
            }
          } else {
            index++;
          }
        }
      }
      if (done) {
        index = 0;
        while (index < trees.length) {
          const tree = trees[index];
          const posTents = this.getAdjacentNeighbors(tree).filter(neigh => neigh.getValue() === 0 && !neigh.isError(1));
          const adjTents = this.getAdjacentNeighbors(tree).filter(neigh => tents.includes(neigh));
          if (posTents.length === 0) {
            if (adjTents.length <= 1) {
              if (adjTents.length === 0) {
                tree.showError(true);
                isSolved = false;
              } else {
                this.showLine(tree, adjTents[0]);
                tents.splice(tents.indexOf(adjTents[0]), 1);
              }
              trees.splice(index, 1);
              done = false;
            } else {
              index++;
            }
          } else {
            index++;
          }
        }
      }
      if (done) {
        index = 0;
        while (index < trees2.length) {
          const tree = trees2[index];
          const posCars = this.getAdjacentNeighbors(tree).filter(neigh => neigh.getValue() === 0 && !neigh.isError(3));
          const adjCars = this.getAdjacentNeighbors(tree).filter(neigh => cars.includes(neigh));
          if (posCars.length === 0) {
            if (adjCars.length <= 1) {
              if (adjCars.length === 0) {
                tree.showError(true);
                isSolved = false;
              } else {
                this.showLine(tree, adjCars[0]);
                cars.splice(cars.indexOf(adjCars[0]), 1);
              }
              trees2.splice(index, 1);
              done = false;
            } else {
              index++;
            }
          } else {
            index++;
          }
        }
      }
    } while (!done);

    if (isSolved && trees.length === 0 && trees2.length === 0) {
      if (this.areAllRowsCorrect()) {
        this.puzzleSolved();
      }
    }
  }
  private hasLine(tree: Square): boolean {
    if (tree.hasDownLink() || tree.hasRightLink()) {
      return true;
    }
    const neigh = this.getNeighbor(tree, 0, 0);
    if (tree.getX() !== 0 && this.getNeighbor(tree, 0, 0).hasRightLink()) {
      return true;
    }
    if (tree.getY() !== 0 && this.getNeighbor(tree, 1, 0).hasDownLink()){
      return true;
    }
    return false;
  }
  public drag(sq: Square): void {
    if (this.getSelectedSquare() !== undefined
    && this.getSelectedSquare() !== null
    && this.canBeOverridden(sq, this.getSelectedSquare().getValue())) {
      this.getPuzzleService().setValue(sq, this.getSelectedSquare().getValue(), false, true, this.getPuzzle().color);
    }
  }

  // @Override
  public leftClicked(sq: Square) {
    this.selectSquare(sq);
  }

  // @Override
  public rightClicked(sq: Square) {
    this.getPuzzleService().setValue(sq, 0, false, true, this.getPuzzle().color);
    this.selectSquare(sq);
  }

}

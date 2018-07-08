import {SymbolsPuzzleController} from './abstract/symbols-puzzle.controller';
import {PuzzleComponent} from '../puzzle.component';
import {Square} from '../model/model.square';
import {Row} from '../model/model.row';
import { DrawingsService } from '../drawings.service';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
export class HouseController extends SymbolsPuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }
  public initSquaresAndRows() {
    super.initSquaresAndRows();
    // for (const sq of this.getSquares()) {
    //   let line;
    //   for (let dir = 0; dir < 2; dir++) {
    //     for (let next = 0; next < 2; next++) {
    //       line = this.getPuzzleComponent().getDrawingService().getLine(dir);
    //       this.getPuzzleComponent().getDrawingService().translateToSquare
    //         (line, sq.getX(), sq.getY(), 100 * (1 - dir) * (next - 1), 100 * dir * (next - 1));
    //       line.setAttribute('visibility', 'hidden');
    //       sq.addDrawing(line);
    //       this.getPuzzleComponent().getHighlightLayer().appendChild(line);
    //     }
    //   }
    // }
  }
  public hasLinks(): boolean {
    return true;
  }

  public getMaxValue(): number {
    return 5;
  }
  public valueChanged(sq: Square, oldValue: number) {
    this.drawSquare(sq, sq.getValue());
    if (oldValue >= 2) {
      this.getAdjacentNeighbors(sq).forEach(s => s.lowerNumberOfErrors(oldValue - 2));
      this.getDiagonalNeighbors(sq).forEach(s => s.lowerNumberOfErrors(oldValue - 2));
      sq.showError(false);
    }
    if (sq.getValue() >= 2) {
      this.getAdjacentNeighbors(sq).forEach(s => s.raiseNumberOfErrors(sq.getValue() - 2));
      this.getDiagonalNeighbors(sq).forEach(s => s.raiseNumberOfErrors(sq.getValue() - 2));
    }
  }
  public drawSquare(sq: Square, value: number) {
    const drawingService = this.getDrawingsService();
    if (value === 0) {
      sq.setPath('');
    }else if (value === 1) {
      sq.setStrokeWidth(4);
      sq.setPath(drawingService.getGrassPath());
    } else {
      sq.setStrokeWidth(0);
      if (value === 2) {
        sq.setPath(drawingService.getTentPath());
      } else if (value === 3) {
        sq.setPath(drawingService.getTreePath());
      } else {
        sq.setPath(drawingService.getCarPath());
      }
    }
  }

  public checkErrorsAndElements(): void {
    const tents = [], trees = [], trees2 = [], cars = [];
    let isSolved = true;
    for (const sq of this.getSquares()) {
      sq.setDownLink(false,'');
      sq.setRightLink(false,'');
      if (sq.getValue() >= 2) {
        if (sq.isError(sq.getValue() - 2)) {
          sq.showError(true);
          isSolved = false;
        } else {
          sq.showError(false);
        }
      } else {
        sq.showError(false);
      }
      // sq.showError(sq.isError(0));
      if (sq.getValue() === 2) {
        tents.push(sq);
      } else if (sq.getValue() === 3) {
        trees.push(sq);
        trees2.push(sq);
      } else if (sq.getValue() === 4) {
        cars.push(sq);
      }
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
        const posTrees = this.getAdjacentNeighbors(tent).filter(neigh => neigh.getValue() === 0 && !neigh.isError(1));
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
          const posTrees = this.getAdjacentNeighbors(car).filter(neigh => neigh.getValue() === 0 && !neigh.isError(1));
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
          const posTents = this.getAdjacentNeighbors(tree).filter(neigh => neigh.getValue() === 0 && !neigh.isError(0));
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
          const posCars = this.getAdjacentNeighbors(tree).filter(neigh => neigh.getValue() === 0 && !neigh.isError(2));
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
}

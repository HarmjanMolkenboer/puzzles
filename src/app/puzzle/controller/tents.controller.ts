import {SymbolsPuzzleController} from './abstract/symbols-puzzle.controller';
import {PuzzleComponent} from '../puzzle.component';
import {Square} from '../model/model.square';
import {Row} from '../model/model.row';
import { DrawingsService } from '../drawings.service';
import {PuzzleService} from '../../puzzles-home/puzzle.service';

export class TentsController extends SymbolsPuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
  }
  public getMaxValue(): number {
    return 3;
  }
  public drag(sq: Square): void {
    if (this.getDragSquare() !== undefined) {
      this.getPuzzleService().setValue(sq, Math.min(2, this.getDragSquare().getValue()), true, true, this.getPuzzle().color);
    }
  }
  public setClue(sq: Square, value: number, key: number) {
    sq.setSolutionValue(3);
    sq.setColor('black');
    const drawingService = this.getDrawingsService();
    sq.setStrokeWidth(0);
    sq.setPath(drawingService.getTreePath());
    sq.setValue(3);
  }
  public valueChanged(sq: Square, oldValue: number) {
    this.drawSquare(sq, sq.getValue());
    if (oldValue === 2) {
      this.getAdjacentNeighbors(sq).forEach(s => s.lowerNumberOfErrors(0));
      this.getDiagonalNeighbors(sq).forEach(s => s.lowerNumberOfErrors(0));
      sq.showError(false);
    } else if (sq.getValue() === 2) {
      this.getAdjacentNeighbors(sq).forEach(s => s.raiseNumberOfErrors(0));
      this.getDiagonalNeighbors(sq).forEach(s => s.raiseNumberOfErrors(0));
    }
  }
  public drawSquare(sq: Square, val: number) {
    const drawingService = this.getDrawingsService();
    if (val === 1) {
      sq.setStrokeWidth(4);
      sq.setPath(drawingService.getGrassPath());
    } else if (val === 2) {
      sq.setStrokeWidth(0);
      sq.setPath(drawingService.getTentPath());
    } else {
      sq.setPath('');
    }
  }
  public checkErrorsAndElements(): void {
    this.getSquares().forEach(s => {
      s.setDownLink(false, '');
      s.setRightLink(false, '');
    });

    let solved = true;
    // stap 1: elke tent met 1 boom krijgt een lijn
    // stap 2: elke boom met 1 tent en verder geen opties krijgt een lijn
    // stap 3: herhaal stap 1 en 2 zonder tenten en bomen met lijn.
    const tents = this.getSquares().filter(s => s.getValue() === 2);
    const trees = this.getSquares().filter(s => s.getValue() === 3);
    for (const tent of tents) {
      tent.showError(tent.isError(0));
    }
    for (const tree of trees) {
      tree.showError(false);
    }
    let done: boolean;
    let index: number;
    do {
      done = true;
      index  = 0;
      while (index < tents.length) {
        const tent  = tents[index];
        const adjTrees = this.getAdjacentNeighbors(tent).filter(neigh => trees.includes(neigh));
        if (adjTrees.length <= 1) {
          if (adjTrees.length === 0) {
            tent.showError(true);
            solved = false;
          } else {
            this.showLine(adjTrees[0], tent);
            trees.splice(trees.indexOf(adjTrees[0]), 1);
          }
          tents.splice(index, 1);
          done = false;
        } else {
          index++;
        }
      }
      if (done) {
        index = 0;
        while (index < trees.length) {
          const tree = trees[index];
          const posTents = this.getAdjacentNeighbors(tree).filter(neigh => neigh.getValue() === 0);
          const adjTents = this.getAdjacentNeighbors(tree).filter(neigh => tents.includes(neigh));
          if (posTents.length === 0) {
            if (adjTents.length <= 1) {
              if (adjTents.length === 0) {
                tree.showError(true);
                solved = false;
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
    } while (!done);

    if (solved && trees.length === 0 && this.areAllRowsCorrect()) {
      this.puzzleSolved();
    }
  }
}

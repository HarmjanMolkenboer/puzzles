import { SymbolsPuzzleController } from './abstract/symbols-puzzle.controller';
import { Square } from '../model/model.square';
import {Row} from '../model/model.row';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
import { DrawingsService } from '../drawings.service';

export class BattleshipController extends SymbolsPuzzleController {
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    super(drawingsService, puzzleService);
    this.gridType='grid';
    let elTemp;
    if (this.getWidth() === 7) {
      this.elements = [3, 2, 1];
      elTemp = [[1], [2,3]];
      this.elementScale = 0.2;
    } else if (this.getWidth() === 9) {
      this.elements = [4, 3, 2, 1];
      elTemp = [[1,2],[3,4]];
      this.elementScale = 0.14;
    } else {
      this.elements = [5, 4, 3, 2, 1];
      elTemp = [[1,2],[3],[4,5]];
      this.elementScale = 0.11;
    }
    for (const g of elTemp) {
      this.elementDrawings.unshift([]);
      for (const length of g) {
        this.elementDrawings[0].unshift([]);
      for (let j = 0; j < this.elements[length - 1]; j++) {
        this.elementDrawings[0][0].unshift([]);
        if (length === 1) {
            this.elementDrawings[0][0][0].push(this.getDrawingsService().getCirclePath());
          } else {
            this.elementDrawings[0][0][0].push(this.getDrawingsService().getShipPartPath(0, 1));
            for (let i = 2; i < length; i++) {
              this.elementDrawings[0][0][0].push(this.getDrawingsService().getSquarePath());
            }
            this.elementDrawings[0][0][0].push(this.getDrawingsService().getShipPartPath(0, 0));
          }
        }
      }
    }
  }
  public hasBorderValue(value: number): boolean {
    if (this.isClue(value)) {
      return this.getPuzzleService().getPuzzle().code === 'battleship_minesweeper';
    }
    return false;
  }
  private drawBoatClue(sq: Square, errors:boolean) {
    const drawingService = this.getDrawingsService();
    const neighs = this.getAdjacentNeighbors(sq);
    const waterneighs = neighs.filter(s => s.getSolutionValue() === 1);
    const shipneighs = neighs.filter(s => s.getSolutionValue() === 2);
    let toneigh = null;
    if (waterneighs.length === neighs.length) { // submarine
      sq.setPath(drawingService.getCirclePath());
    }else if (shipneighs.length > 1) {
      sq.setPath(drawingService.getSquarePath());
    }else {
      toneigh = shipneighs[0];
      if (toneigh.getY() === sq.getY()) {
        if (toneigh.getX() === sq.getX() - 1) {
          sq.setPath(drawingService.getShipPartPath(0, 0));
        }else {
          sq.setPath(drawingService.getShipPartPath(0, 1));
        }
      }else {
        if (toneigh.getY() === sq.getY() - 1) {
          sq.setPath(drawingService.getShipPartPath(1, 0));
        }else {
          sq.setPath(drawingService.getShipPartPath(1, 1));
        }
      }
    }
    if (errors && shipneighs.length !== 2) {
      for (const s of neighs) {
        if (s !== toneigh) {
          s.raiseNumberOfErrors(0);
        }
      }
    }
  }
  public drawElements(): void {

    // alert('jo')
    const elementsDrawing = this.getPuzzleService().getControlPanel().getElementsSVG();

    let scale;
    if (this.elements.length === 3) {
      scale = 0.6;
    }else if (this.elements.length === 4) {
      scale = 0.44;
    } else {
      scale = 0.3;
    }
    const dx = 10;
    const dy = 20;
    const drawingService = this.getDrawingsService();
    let y = 0;
    let x = 0;
    y = (scale + 1) * (100 + dy);
    for (let length = 1; length <= this.elements.length; length++) {
      x = 0;
      for (let j = 0; j < this.elements[length - 1]; j++) {
        const drawing: SVGPathElement = drawingService.getShip(length);
        drawing.setAttribute('transform', 'translate(' + x + ', ' + y + ') scale(' + scale + ')');
        elementsDrawing.appendChild(drawing);
        x = x + (100 * length  + dx) * scale;
      }
      y = y - (100 + dy) * scale;
    }
  }

  public valueChanged(sq: Square, oldValue: number): void {
    const newValue = sq.getValue();
    if (oldValue === 2) {
      for (const neigh of this.getDiagonalNeighbors(sq)) {
        neigh.lowerNumberOfErrors(0);
      }
    } else if (newValue === 2) {
      for (const neigh of this.getDiagonalNeighbors(sq)) {
        neigh.raiseNumberOfErrors(0);
      }
    }
    for (const neigh of this.getAdjacentNeighbors(sq)) {
      if (neigh.getColor() === 'black' && neigh.getValue() === 2) {
        if (neigh.isError(0) && !this.boatClueIsError(neigh, sq)) {
          neigh.lowerNumberOfErrors(0);
        } else if (!neigh.isError(0) && this.boatClueIsError(neigh, sq)) {
          neigh.raiseNumberOfErrors(0);
        }
      }
    }
    // alert('newValue' + sq.getColor())

    this.drawSquare(sq, sq.getValue());
    for (const neigh of this.getAdjacentNeighbors(sq)) {
      this.drawSquare(neigh, neigh.getValue());
    }
  }
  private boatClueIsError(clue, changedSquare): boolean {
    if (this.getDiagonalNeighbors(clue).some(s => s.getValue() === 2)) {
      return true;
    }
    const shipneighs = this.getAdjacentNeighbors(clue).filter(s => s.getSolutionValue() === 2);
    if (shipneighs.length === 1) {
      if (shipneighs[0].getValue() === 1) {
        return true;
      }
    } else if (shipneighs.length === 2) {
      const waterneighs = this.getAdjacentNeighbors(clue).filter(s => s.getSolutionValue() === 1);
      if (waterneighs.length === 1) {
        if (waterneighs[0].getValue() === 2 || shipneighs.some(s => s.getValue() === 1)) {
          return true;
        }
      }else {
        if (shipneighs.some(s => s.getValue() === 1) && waterneighs.some(s => s.getValue() === 1)) {
          return true;
        }
        if (shipneighs[0].getValue() !== 0
          && shipneighs[1].getValue() !== 0
          && shipneighs[0].getValue() !== shipneighs[1].getValue()) {
          return true;
        }
        if (waterneighs[0].getValue() !== 0
          && waterneighs[1].getValue() !== 0
          && waterneighs[0].getValue() !== waterneighs[1].getValue()) {
          return true;
        }
      }
    }
    return false;
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
      const neighs = this.getAdjacentNeighbors(sq);
      const waterneighs = neighs.filter(s => s.getValue() === 1);
      const shipneighs = neighs.filter(s => s.getValue() === 2);
      if (waterneighs.length === neighs.length) { // submarine
        sq.setPath(drawingService.getCirclePath());
      }else if (shipneighs.length > 1) {
        sq.setPath(drawingService.getSquarePath());
      }else {
        let toneigh: Square;
        if (waterneighs.length === neighs.length - 1) {
          toneigh = neighs.filter(s => s.getValue() !== 1)[0];
        }else if (shipneighs.length === 1) {
          toneigh = shipneighs[0];
          const x = sq.getX() + (sq.getX() - toneigh.getX());
          const y = sq.getY() + (sq.getY() - toneigh.getY());
          const oppositeneigh = this.getSquare(x, y);
          if (oppositeneigh !== undefined && oppositeneigh.getValue() !== 1) {
              toneigh = undefined;
          }
        }
        if (toneigh === undefined) {
          sq.setPath(drawingService.getSquarePath());
        }else {
          if (toneigh.getY() === sq.getY()) {
            if (toneigh.getX() === sq.getX() - 1) {
              sq.setPath(drawingService.getShipPartPath(0, 0));
            }else {
              sq.setPath(drawingService.getShipPartPath(0, 1));
            }
          }else {
            if (toneigh.getY() === sq.getY() - 1) {
              sq.setPath(drawingService.getShipPartPath(1, 0));
            }else {
              sq.setPath(drawingService.getShipPartPath(1, 1));
            }
          }
        }
      }
    }
  }
  public checkErrorsAndElements(): void {
    // const scale = this.getPuzzleComponent().getScale();
    const placed = new Array(this.elements.length).fill(0);
    let element: Square[];
    // check horizontal elements
    let solved = true;
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        const sq: Square = this.getSquare(x, y);
        if (sq.getValue() === 2) {
          element = [sq];
          let x2 = x + 1;
          while (x2 < this.getWidth() && this.getSquare(x2, y).getValue() === 2) {
            element.push(this.getSquare(x2, y));
            x2++;
          }
          const isError = element.length > this.elements.length || element.some(s => s.isError(0));
          if (!isError) {
            if (element.length === 1) {
              if (this.getAdjacentNeighbors(sq).find(s => s.getValue() !== 1 && !(sq.getColor() === 'black' && s.getSolutionValue() === 1)) === undefined) {
                placed[0]++;
              }
            } else if ((x === 0 || this.getSquare(x - 1, y).getValue() === 1 || this.getSquare(x, y).getColor() === 'black' && this.getSquare(x - 1, y).getSolutionValue() === 1)
                && (x2 === this.getWidth() || this.getSquare(x2, y).getValue() === 1 || this.getSquare(x2 - 1, y).getColor() === 'black' && this.getSquare(x2, y).getSolutionValue() === 1)) {
              placed[element.length - 1]++;
            }
            element.forEach(s =>  s.showError(false));
          } else {
            element.forEach(s => s.showError(true));
            solved = false;
          }
          x = x2;
        }
      }
    }
    // check vertical elements
    for (let x = 0; x < this.getHeight(); x++) {
      for (let y = 0; y < this.getWidth(); y++) {
        const sq: Square = this.getSquare(x, y);
        if (sq.getValue() === 2) {
          element = [sq];
          let y2 = y + 1;
          while (y2 < this.getHeight() && this.getSquare(x, y2).getValue() === 2) {
            element.push(this.getSquare(x, y2));
            y2++;
          }
          if (element.length > 1) {
            const isError = element.length > this.elements.length || element.some(s => s.isError(0));
            if (!isError) {
              if ((y === 0 || this.getSquare(x, y - 1).getValue() === 1 || this.getSquare(x, y).getColor() === 'black' && this.getSquare(x, y - 1).getSolutionValue() === 1)
                  && (y2 === this.getHeight() || this.getSquare(x, y2).getValue() === 1 || this.getSquare(x, y2 - 1).getColor() === 'black' && this.getSquare(x, y2).getSolutionValue() === 1)) {
                placed[element.length - 1]++;
              }
              element.forEach(s =>  s.showError(false));
            } else {
              element.forEach(s =>  s.showError(true));
              solved = false;
            }
          }
          y = y2;
        }
      }
    }
    // test
    // draw Elements
    // const elementsDrawing = this.getPuzzleService().getControlPanel().getElementsSVG();
    const elementsDrawing = document.getElementsByClassName('bootdeel');
    
    let counter = 0;
    for (let index = this.elements.length - 1; index >= 0; index--) {
      for (let i = 0; i < this.elements[index]; i++) {
        for (let j = 0; j <= index; j++) {
          if (placed[index] > this.elements[index]) {
            elementsDrawing[counter].setAttribute('fill', 'red');
            solved = false;
          } else {
            if (placed[index] > i) {
              elementsDrawing[counter].setAttribute('fill', 'gray');
            } else {
              elementsDrawing[counter].setAttribute('fill', 'black');
              solved = false;
            }
          }
          counter++;
        }
      }
    }
    if (solved && this.areAllRowsCorrect()){
      // alert('HOERA')
      this.puzzleSolved();
    }
  }
}

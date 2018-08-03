import {Row} from '../../model/model.row';
import {PuzzleService} from '../../../puzzles-home/puzzle.service';
import { DrawingsService } from '../../drawings.service';
import { Puzzle } from '../../model/model.puzzle';
import { ActivatedRoute, Router } from '@angular/router';
import { Square } from '../../model/model.square';
import {NumbersPuzzleController} from './numbers-puzzle.controller';
export abstract class PuzzleController {
  private height: number;
  private width: number;
  private numberOfBorderValues: number;
  gridType: string;
  // private squares: Square[];
  private rows: Row[];
  private dragSquare: Square;
  private preDragSquare: Square;
  private selectedSquare: Square;
  private hasSeenSolution = false;
  private timePosted = false;
  private scale: number;
  protected numberButtons = [];
  showResults = false;
  private drawingsService: DrawingsService;
  private puzzleService: PuzzleService;
  totWidth: number;
  totHeight: number;
  decripted: number[];
  constructor(drawingsService: DrawingsService, puzzleService: PuzzleService) {
    this.drawingsService = drawingsService;
    this.puzzleService = puzzleService;
    // puzzleComponent.getDrawingService().setOffsetX(this.getOffsetX());
    // puzzleComponent.getDrawingService().setOffsetY(this.getOffsetY());
    const puzzle = this.puzzleService.getPuzzle();
    this.height = puzzle.height;
    this.width = puzzle.width;
    this.numberOfBorderValues = puzzle.numberOfBorderValues;
    this.gridType = puzzle.gridType;
    // this.squares = [];
    this.totWidth = 100 * (puzzle.width + puzzle.numberOfBorderValues) + 2 * this.getOffsetX();
    this.totHeight = 100 * (puzzle.height + puzzle.numberOfBorderValues)+ 2 * this.getOffsetY();
    // this.decripted = this.decript(puzzle.repr);
    // alert(this.totWidth+' '+this.totHeight)
    // this.scale = 740 / Math.max(totWidth, totHeight);
  }
  // hasColor(color: string) {
  //   alert('check '+color)
  //   return this.squares.some(s=>s.getColor() === color);
  // }
  public addButtons(): void {

  }
  public numberClicked(n: number) {

  }
  public decript(repr: string) {
    const key = this.getKey();
    const squaresPerChar = this.getSquaresPerChar();
    const array = [];
    let charIndex = 0;
    let ch: string;
    // const squaresPerChar = Math.floor(32 / key);
    let charCode: number;
    let counter = 0;
    do {
      charCode = repr.charCodeAt(charIndex++);
      charCode -= 100;
      for (let i = squaresPerChar - 1; i >=0; i--) {
        const n = Math.floor(charCode / Math.pow(key, i));
        array.push(n);
        if (array.length === this.width * this.height) {
          break;
        }
        charCode -= n * Math.pow(key, i);
      }
    } while (array.length < this.width * this.height);
    this.decripted = array;
  }
  public getX(index: number) {
    return index % this.getWidth();
  }
  public getY(index: number) {
    return (index - (index % this.getWidth())) / this.getWidth();
  }
  public getSolutionValue(value: number) {
    return value % Math.ceil(this.getKey() / 2) + 1;
  }
  public isClue(value: number): boolean {
    return value >= this.getKey() / 2;
  }
  public hasRightWall(value: number, index: number) {
    return false;
  }
  public hasDownWall(value: number, index: number) {
    return false;
  }
  public getOtherLeft(value: number): boolean {
    return undefined;
  }
  public hasBorderValue(value: number): boolean {
    return false;
  }
  public abstract isNumbersPuzzle();
  public drawElements(): void {

  }
  public initSquaresAndRows(): void {
    // this.drawElements();
    this.decripted.forEach((value, index) => {
      this.getSquares().push(new Square(this.getX(index),
        this.getY(index),
        this.isNumbersPuzzle(),
        this.getSolutionValue(value),
        this.isClue(value),
        this.hasRightWall(value, index),
        this.hasDownWall(value, index),
        this.getOtherLeft(value),
        this.puzzleService));
    });
    // alert(this.getSquares().length)
    // for (let y = 0; y < this.height; y++) {
    //   for (let x = 0; x < this.width; x++) {
    //     this.squares.push(this.newSquare(x, y));
    //   }
    // }
    // this.decripted = this.decript(this.getPuzzle().repr);
    // this.initRows(this.decripted);
    // let index = 0;
    // for (const sq of this.getSquares()) {
    //   this.setSolutionValue(sq, this.decripted[index++]);
    // }
    // if (this.numberOfBorderValues > 0) {
    //   for (const row of this.rows) {
    //     row.setText();
    //   }
    // }
    this.initRows();
  }
  public addRowToSquare(sq: Square, row: Row) {
    sq.addRow(row);
    if (sq.getSolutionValue() >= 2) {
      row.raiseSolutionValue(sq.getSolutionValue() - 2);
      if (sq.isClue) {
        row.raiseValue(sq.getSolutionValue() - 2);
      }
    }
    // console.log(row.getSolutionValue(0))
  }
  public initRows(): void {
    // for (const row of this.rows) {
    // }
  }
  public getCoordX(n: number) {
    return 20 + 30 * ((n - 1) % 3);
  }
  public getCoordY(n: number) {
    return 22 + 30 * Math.floor((n - 1) / 3);
  }
  // public addMinesweeperRow(sq: Square) {
  //   const row: Row = new Row(this.numberOfBorderValues, true, 100 * sq.getX() + 50, 100 * sq.getY() + 50);
  //   for (const s of this.getAllNeighbors(sq)){
  //     s.addRow(row);
  //   }
  //   this.rows.push(row);
  // }
  // newSquare(x, y): Square {
  //   return new Square(x, y);
  // }
  // protected abstract setSolutionValue(sq: Square, value: number);
    // console.log(value);
  // public abstract setClue(sq: Square, value: number, key: number);
  public abstract keyPressed(event: KeyboardEvent): void;
  public abstract drag(sq: Square): void;
  public abstract leftClicked(sq: Square);
  public abstract rightClicked(sq: Square);
  public abstract changeValueOfSquare(sq: Square, newValue: number, newColor: string);
  public getAdjacentNeighbors(sq: Square): Square[] {
    const neighs = [];
    for (let i = -1; i <= 1; i += 2) {
      if (this.getSquare(sq.getX() + i, sq.getY()) !== undefined) {
        neighs.push(this.getSquare(sq.getX() + i, sq.getY()));
      }
      if (this.getSquare(sq.getX(), sq.getY() + i) !== undefined) {
        neighs.push(this.getSquare(sq.getX(), sq.getY() + i));
      }
    }
    return neighs;
  }
  public hasOtherSquare(): boolean {
    return false;
  }
  public getNeighbor(sq: Square, dir: number, next: number): Square {
    return this.getSquare(sq.getX() + (dir === 0 ? 2 * next - 1 : 0), sq.getY() + (dir === 1 ? 2 * next - 1 : 0));
  }
  public hasLinks(): boolean {
    return false;
  }
  public getDiagonalNeighbors(sq: Square): Square[] {
    const neighs = [];
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        if (this.getSquare(sq.getX() + i, sq.getY() + j) !== undefined) {
          neighs.push(this.getSquare(sq.getX() + i, sq.getY() + j));
        }
      }
    }
    return neighs;
  }
  public getAllNeighbors(sq: Square): Square[] {
    return this.getAdjacentNeighbors(sq).concat(this.getDiagonalNeighbors(sq));
  }
  public getConnectedSquares(sq: Square, predicate): Square[] {
    return this.connect([sq], sq, predicate);
  }
  private connect(squares: Square[], addedSquare, predicate): Square[] {
    this.getAdjacentNeighbors(addedSquare).filter(predicate).forEach(square => {
      if (!squares.includes(square)) {
        squares.push(square);
        squares = this.connect(squares, square, predicate);
      }
    });
    return squares;
  }
  public getSquareFromMouseCoords(x: number, x2: number, y: number, y2: number): Square {
    const px = x / (x+x2);
    const py = y / (y+y2);
    const sqx = Math.floor(px * this.width);
    const sqy = Math.floor(py * this.height);
    if (sqy < 0 || sqy >= this.height || sqx < 0 || sqx >= this.width) {
      this.getPuzzleService().endMove();
    }
    return this.getSquare(sqx, sqy);
  }
  public getSquare(x: number, y: number): Square {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return undefined;
    }
    return this.puzzleService.squares[y * this.height + x];
  }
  public getSquares(): Square[] {
    return this.getPuzzleService().squares;
  }
  public getAllRows(): Row[] {
    // alert(this.getSquares().length)
    if (this.rows === undefined) {
      this.rows=[];
      for (let y = 0; y < this.getHeight(); y++) {
        const row = new Row(this.getNumberOfBorderValues(), this.getWidth(), y, true);
        this.getSquares().filter(s=>s.getY() === row.y).forEach(sq => {
          this.addRowToSquare(sq, row);
        });
        this.rows.push(row);
    }
      for (let x = 0; x < this.getWidth(); x++) {
        const row = new Row(this.getNumberOfBorderValues(), x, this.getHeight(), false);
        this.getSquares().filter(s=>s.getX() === row.x).forEach(sq => {
          this.addRowToSquare(sq, row);
        });
        this.rows.push(row);
      }
      if (this.isMinesweeper()) {
        for (let index = 0; index < this.decripted.length; index++) {
          const num = this.decripted[index];
          if (this.isClue(num)) {
            const row = new Row(this.getNumberOfBorderValues(), this.getX(index), this.getY(index), true);
            this.getSquares().filter(s => (s.getX() - row.x) * (s.getX() - row.x) + (s.getY() - row.y) * (s.getY() - row.y) <= 2).forEach(sq => {
               this.addRowToSquare(sq, row);
             });
            this.rows.push(row);
          }
        }
      }
    }
    return this.rows;
  }
  public isMinesweeper(): boolean {
    return this.puzzleService.getPuzzle().code.endsWith('minesweeper');
  }
  public getMaxValue(): number {
    return Math.ceil(this.getKey() / 2) + 1;
  }
  // public getMaxNumber()
  public canBeOverridden(sq: Square, newValue: number): boolean {
    return sq.getColor() === undefined;
  }
  public getOverridenValue(square: Square, newValue: number, newColor: string, recalculate: boolean): any {
    return undefined;
  }
  abstract valueChanged(sq: Square, oldValue: number);
  public abstract drawSquare(sq: Square, value: number): void;
  abstract checkErrorsAndElements(): void;
  public getHeight(): number {
    return this.height;
  }
  public getWidth(): number {
    return this.width;
  }
  public getColumns(): Row[] {
    return this.rows.slice(0, this.getHeight());
  }
  public getRows(): Row[] {
    return this.rows.slice(this.getHeight(), this.getHeight() + this.getWidth());
  }
  public getMinesweeperRows(): Row[] {
    return this.rows.slice(this.getHeight() + this.getWidth());
  }
  public getRow(dir: number, index: number): Row {
    if (dir === 0) {
      return this.getAllRows()[index];
    }
    return this.getAllRows()[this.getHeight() + index];
  }
  public getNumberOfBorderValues(): number {
    return this.numberOfBorderValues;
  }
  public getOffsetX(): number {
    return 10;
  }
  public getOffsetY(): number {
    return 10;
  }
  public setDragSquare(sq: Square): void {
    this.dragSquare = sq;
    this.preDragSquare = sq;
  }
  public getPreDragSquare(): Square {
    return this.preDragSquare;
  }
  public setPreDragSquare(square: Square) {
    this.preDragSquare = square;
  }
  public getDragSquare(): Square {
    return this.dragSquare;
  }

  public getKey() {
    return this.getPuzzle().key;
  }
  protected selectSquare(sq: Square): void {
    if (this.selectedSquare !== undefined) {
      this.selectedSquare.showSelectDrawing(false);
    }
    sq.showSelectDrawing(true);
    this.selectedSquare = sq;
  }
  private getAnimationSquares(): Square[] {
    const r = Math.floor(2 * Math.random());
    switch (r) {
      case 0: return this.getSpiralSquares();
      default: return this.getSquares();
    }
  }
  private getSpiralSquares(): Square[] {
    let sq: Square = this.getSquare(0, 0);
    let x = 0;
    let y = 0;
    let dir = 0;
    let next = 1;
    const sqs = [];
    do {
      sqs.push(sq);
      let neigh = this.getNeighbor(sq, dir, next);
      if (neigh === undefined || sqs.includes(neigh)) {
        if (dir === 1) {
          next = 1 - next;
        }
        dir = 1 - dir;
        neigh = this.getNeighbor(sq, dir, next);
        if (neigh === undefined || sqs.includes(neigh)){
          return sqs;
        }
      }
      sq = neigh;
    } while (true);
  }
  protected async animate() {
    const colors = Object.assign([], this.getPuzzleService().getColorList());
    colors.splice(0, 0, 'black');
    const sqs = this.getAnimationSquares();
    for (const sq of sqs) {
      sq.storeColor();
    }
    for (const color of colors) {
      // console.log(color);
      for (const sq of sqs) {
        if (this.showResults) {
          return;
        }
        if (sq.getValue() !== sq.getSolutionValue()) {
          this.drawSquare(sq, sq.getSolutionValue());
        }
        sq.setColor(color);
        await this.delay(1000 / this.getPuzzleService().squares.length);
      }
    }
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  public puzzleSolved() {

    this.getPuzzleService().puzzleSolved();

    // this.getPuzzleComponent().getRouter().navigate(['/'+this.getPuzzle().name]));
  }
  public getNumberList(): any[]{
    return[];
  }

  public getSquaresPerChar(): number {
    let squaresPerChar = 0;
    for(;Math.pow(this.getKey(), squaresPerChar + 1) < 55196; squaresPerChar++);
    return squaresPerChar;
  }
  public getPuzzle(): Puzzle {
    return this.getPuzzleService().getPuzzle();
  }
  public areAllRowsCorrect(): boolean {
    for (const row of this.getAllRows()) {
      if (!row.isCorrect()){
        return false;
      }
    }
    return true;
  }
  public getSelectedSquare(): Square {
    return this.selectedSquare;
  }
  protected showLine(square: Square, otherSquare: Square) {
    const dir = Math.abs(square.getY() - otherSquare.getY());
    const next = (otherSquare.getX() - square.getX() + otherSquare.getY() - square.getY() + 1) / 2;
    if (dir === 0) {
      if (next === 0) {
        otherSquare.setRightLink(true, otherSquare.getColor());
      } else {
        square.setRightLink(true, otherSquare.getColor());
      }
    } else {
      if (next === 0) {
        otherSquare.setDownLink(true, otherSquare.getColor());
      } else {
        square.setDownLink(true, otherSquare.getColor());
      }
    }
  }
  public getDrawingsService(): DrawingsService {
    return this.drawingsService;
  }
  public getPuzzleService(): PuzzleService {
    return this.puzzleService;
  }
}

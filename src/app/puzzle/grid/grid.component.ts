import { Component, ViewChild, ElementRef, OnInit, HostListener, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import {Square} from '../model/model.square';
import {Move} from '../model/model.move';
import {Action} from '../model/model.action';
import {Puzzle} from '../model/model.puzzle';
import {Row} from '../model/model.row';
import {PuzzleService} from '../../puzzles-home/puzzle.service';
import {PuzzleController} from '../controller/abstract/puzzle.controller';
import {NumbersPuzzleController} from '../controller/abstract/numbers-puzzle.controller';
import {PuzzleStatsService} from '../../db/puzzle-stats.service';

// import {GridType} from './grid/grid-type';
import {DrawingsService} from '../drawings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnChanges {
  // controller: PuzzleController;
  @ViewChild('puzzle') puzzleRef: ElementRef;
  @ViewChild('gridlayer') gridLayerRef: ElementRef;
  @ViewChild('elementsPanel') elementsPanelRef: ElementRef;
  @ViewChild('boundary') boundaryRef: ElementRef;
  constructor(private puzzleService: PuzzleService, private drawingsService: DrawingsService) { }
  ngOnInit() {
    // this.gridLayerRef.nativeElement.addEventListener("mousemove", this.onMousemove, false);
    let puzzle = this.getPuzzleService().getPuzzle();
    if (puzzle.example) {
      alert('shouldnt be here')
      this.puzzleService.getPuzzle().width = 7;
      this.puzzleService.getPuzzle().height = 7;
      this.puzzleService.createController(this, 'battleship_minesweeper');
      this.puzzleService.getController().drawGrid();
    } else {
      this.puzzleRef.nativeElement.oncontextmenu = e => e.preventDefault();
      this.gridLayerRef.nativeElement.onMouseOut = e => this.onMouseOut();
      this.gridLayerRef.nativeElement.onTouchLeave = e => this.onMouseOut();
      if (window.localStorage.getItem('storedpuzzlekey') !== null) {
        // will load state from localStorage
        puzzle = JSON.parse(window.localStorage.getItem(window.localStorage.getItem('storedpuzzlekey')));
        this.puzzleService.setPuzzle(puzzle);
        // alert('stored')
        // this.rescale();
      } else {
        // new puzzle starts
        window.localStorage.setItem('storedpuzzlekey', puzzle.puzzleRef);
        window.localStorage.setItem(puzzle.puzzleRef, JSON.stringify(puzzle));
        puzzle.time = new Date().getTime();
        puzzle.color = this.puzzleService.colorlist[0];
        this.puzzleService.setPuzzle(puzzle);
      }
      this.getPuzzleService().createController(this, this.puzzleService.getPuzzle().code);
      this.puzzleService.getController().drawGrid();
      this.puzzleService.getController().initSquaresAndRows();
      this.puzzleService.getController().checkErrorsAndElements();
      const moveIndex = puzzle.moveIndex;
      puzzle.moveIndex = 0;
      for (let i = 0; i < moveIndex; i++) {
        this.redo();
      }
    }
  }
  public undo(): void {
    this.getPuzzleService().undo();
  }
  public redo(): void {
    this.getPuzzleService().redo();
  }
  public endMove(): void {
    this.getPuzzleService().endMove();
  }
  @HostListener('window:keydown', ['$event'])
  public keyboardInput(event: KeyboardEvent) {
    if (!this.puzzleService.activated) return;
    this.puzzleService.getController().keyPressed(event);
  }
  @HostListener('touchstart', ['$event'])
  onTouchStart(event){
    if (!this.puzzleService.activated) return;
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    const sq: Square = this.getSquareFromMouseCoords(x, y);
    if (sq === undefined) {
      if (this.puzzleService.highlightedSquare !== undefined) {
        this.puzzleService.highlightedSquare.showHighlight(false);
      }
      return;
    }
    event.preventDefault();
    this.puzzleService.highlightedSquare = sq;
    this.puzzleService.getController().leftClicked(sq);
  }
  @HostListener('touchend', ['$event'])
  onTouchEnd(event) {
    if (!this.puzzleService.activated) return;
    // event.preventDefault();
    if (this.puzzleService.highlightedSquare !== undefined) {
      this.puzzleService.highlightedSquare.showHighlight(false);
    }
    this.endMove();
  }
  @HostListener('touchmove', ['$event'])
  onTouchMove(event){
    if (!this.puzzleService.activated) return;
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    const newHighlightedSquare = this.getSquareFromMouseCoords(x, y);
    if (newHighlightedSquare === this.puzzleService.highlightedSquare) {
      return;
    }
    // if (this.highlightedSquare != null) {
    //   this.highlightedSquare.showHighlight(false);
    // }
    this.puzzleService.highlightedSquare = newHighlightedSquare;
    if (newHighlightedSquare !== undefined) {
      // newHighlightedSquare.showHighlight(true);
      this.puzzleService.getController().drag(this.puzzleService.highlightedSquare);
      event.preventDefault();
    }
  }
  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    if (!this.puzzleService.activated) return;
    event.preventDefault();
    const button = this.getMouseButton(event);
    const sq: Square = this.getSquareFromMouseCoords(event.clientX, event.clientY);
    if (sq === undefined) {
      return;
    }
    if (button === 1) {
      this.puzzleService.getController().leftClicked(sq);
    } else if (button === 2) {
      this.puzzleService.getController().rightClicked(sq);
    }
  }
  getSquareFromMouseCoords(clientX:number, clientY: number) {
    const x = clientX - this.boundaryRef.nativeElement.getBoundingClientRect().left;
    const x2 = this.boundaryRef.nativeElement.getBoundingClientRect().right - clientX;
    const y = clientY - this.boundaryRef.nativeElement.getBoundingClientRect().top;
    const y2 = this.boundaryRef.nativeElement.getBoundingClientRect().bottom - clientY;
    return this.puzzleService.getController().getSquareFromMouseCoords(x, x2, y, y2);
  }
  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    if (!this.puzzleService.activated) return;
    const button = this.getMouseButton(event);
    if (button === 0) {
      this.endMove();
    }
  }
  @HostListener('mousemove', ['$event'])
  onMousemove(event) {
    if (!this.puzzleService.activated) return;
    const button = this.getMouseButton(event);
    if (button === 0) {
      this.puzzleService.getController().setDragSquare(undefined);
    }
    const newHighlightedSquare = this.getSquareFromMouseCoords(event.clientX, event.clientY);
    if (newHighlightedSquare === this.puzzleService.highlightedSquare) {
      return;
    }
    if (this.puzzleService.highlightedSquare != null) {
      this.puzzleService.highlightedSquare.showHighlight(false);
    }
    this.puzzleService.highlightedSquare = newHighlightedSquare;
    if (newHighlightedSquare !== undefined) {
      newHighlightedSquare.showHighlight(true);
      if (this.getMouseButton(event) > 0) {
        this.puzzleService.getController().drag(this.puzzleService.highlightedSquare);
      } else {
        this.endMove();
      }
    }
  }
  private getMouseButton(event) {
    let button = 0;
    if ('buttons' in event) {
      button = event.buttons;
    } else if ('which' in event) {
      button = event.which;
    } else {
      button = event.button;
    }
    return button;
  }
  onMouseOut() {
    if (!this.puzzleService.activated) return;
    this.endMove();
  }
  public getRange(beginIn:number, endEx: number): number[] {
    return Array.from(Array(endEx - beginIn),(x,i)=>i + beginIn);
  }
  public getPuzzleService() {
    return this.puzzleService;
  }
  public getDrawingsService(): DrawingsService {
    return this.drawingsService;
  }
  public getElementsSVG(): SVGGElement {
    return null;
  }
  public isNumbersPuzzle() {
    return this.puzzleService.getController() instanceof NumbersPuzzleController;
  }
  ngOnChanges(event) {
    console.log('change detected')
  }
}

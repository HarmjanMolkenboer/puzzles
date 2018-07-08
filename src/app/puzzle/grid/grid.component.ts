import { Component, ViewChild, ElementRef, OnInit, HostListener, ChangeDetectionStrategy, OnChanges, AfterViewInit } from '@angular/core';
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
export class GridComponent implements OnInit, OnChanges, AfterViewInit {
  // controller: PuzzleController;
  @ViewChild('puzzle') puzzleRef: ElementRef;
  @ViewChild('errorlayer') errorLayerRef: ElementRef;
  @ViewChild('boundary') boundaryRef: ElementRef;
  @ViewChild('highlightlayer') highlightLayerRef: ElementRef;
  @ViewChild('puzzlelayer') puzzleLayerRef: ElementRef;
  @ViewChild('gridlayer') gridLayerRef: ElementRef;
  constructor(private puzzleService: PuzzleService, private drawingsService: DrawingsService) { }
  ngOnInit() {
    this.puzzleService.squares = [];
    this.puzzleService.rows = [];
    // this.gridLayerRef.nativeElement.addEventListener("mousemove", this.onMousemove, false);
    let puzzle = this.getPuzzleService().getPuzzle();
    this.puzzleRef.nativeElement.oncontextmenu = e => e.preventDefault();
    // this.puzzleRef.nativeElement.onMouseOut = e => this.onMouseOut();
    // this.puzzleRef.nativeElement.onTouchLeave = e => this.onMouseOut();
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
      // puzzle.color = this.puzzleService.colorlist[0];
      this.puzzleService.setPuzzle(puzzle);
    }
    this.getPuzzleService().createController(this, this.puzzleService.getPuzzle().code);
    this.puzzleService.getController().decript(puzzle.repr);
    this.puzzleService.getController().initSquaresAndRows();
    this.puzzleService.squares.forEach(sq => {
      if (this.puzzleService.getController().isNumbersPuzzle()){
        const text = this.getTextElement(80, 100*sq.getX() + 50, 100*sq.getY() + 50);
        text.setAttribute('display', 'none');
        sq.setBigNumber(text);
        this.puzzleLayerRef.nativeElement.appendChild(text);
        for (let n = 0; n < 10; n++) {
          const text = this.getTextElement(30,
            100*sq.getX() + this.puzzleService.getController().getCoordX(n),
            100*sq.getY() + this.puzzleService.getController().getCoordY(n));
            text.innerHTML=''+(n === 0 ? 'X' : n);
            text.setAttribute('display', 'none');
            sq.addSmallNumber(text);
            this.puzzleLayerRef.nativeElement.appendChild(text);
        }
        const select = this.getSVGRectElement(100*sq.getX(), 100*sq.getY(), 100, 100);
        select.setAttribute('stroke-width', '0');
        select.setAttribute('fill', 'lightblue');
        select.setAttribute('opacity', '0.7');
        select.setAttribute('display', 'none');
        this.errorLayerRef.nativeElement.appendChild(select);
        sq.setSelectElement(select);
      }else{
        const drawing = this.getSVGPathElement(sq);
        drawing.setAttribute('d', sq.getPath());
        drawing.setAttribute('stroke', sq.getColor());
        drawing.setAttribute('fill', sq.getColor());
        this.puzzleLayerRef.nativeElement.appendChild(drawing);
        sq.setDrawing(drawing);
      }
      if (!this.puzzleService.getController().hasOtherSquare()) {
        const hl = this.getSVGRectElement(100*sq.getX()+3, 100*sq.getY()+3, 94, 94);
        hl.setAttribute('stroke', 'gray');
        hl.setAttribute('stroke-width', '6');
        hl.setAttribute('fill', 'transparent');
        hl.setAttribute('display', 'none');
        this.highlightLayerRef.nativeElement.appendChild(hl);
        sq.setHighligth(hl);
      } else {
        if (!sq.hasRightWall()) {
          const hl = this.getSVGRectElement(100*sq.getX()+3, 100*sq.getY()+3, 194, 94);
          hl.setAttribute('stroke', 'black');
          hl.setAttribute('stroke-width', '6');
          hl.setAttribute('fill', 'transparent');
          hl.setAttribute('display', 'none');
          this.highlightLayerRef.nativeElement.appendChild(hl);
          sq.setHighligth(hl);
          sq.getOtherSquare().setHighligth(hl);
        } else if (!sq.hasRightWall()) {
          const hl = this.getSVGRectElement(100*sq.getX()+3, 100*sq.getY()+3, 94, 194);
          hl.setAttribute('stroke', 'black');
          hl.setAttribute('stroke-width', '6');
          hl.setAttribute('fill', 'transparent');
          hl.setAttribute('display', 'none');
          this.highlightLayerRef.nativeElement.appendChild(hl);
          sq.setHighligth(hl);
          sq.getOtherSquare().setHighligth(hl);
        }
      }
      const error = this.getSVGRectElement(100*sq.getX(), 100*sq.getY(), 100, 100);
      error.setAttribute('stroke-width', '0');
      error.setAttribute('fill', 'red');
      error.setAttribute('opacity', '0.7');
      error.setAttribute('display', 'none');
      this.errorLayerRef.nativeElement.appendChild(error);
      sq.setErrorElement(error);
      if (sq.hasRightWall()) {
        const wallRight = this.getSVGPathElement();
        wallRight.setAttribute('transform', `translate(${100 * (sq.getX()+1)}, ${100 * sq.getY()})`);
        wallRight.setAttribute('d', 'M0 0 L0 100');
        wallRight.setAttribute('stroke', 'black');
        wallRight.setAttribute('stroke-width', '8');
        wallRight.setAttribute('stroke-linecap', 'square');
        this.gridLayerRef.nativeElement.appendChild(wallRight);
        sq.setRightWallElement(wallRight);
      }
      if (sq.hasDownWall()) {
        const wallDown = this.getSVGPathElement();
        wallDown.setAttribute('transform', `translate(${100 * sq.getX()}, ${100 * (sq.getY() + 1)})`);
        wallDown.setAttribute('d', 'M0 0 L100 0');
        wallDown.setAttribute('stroke', 'black');
        wallDown.setAttribute('stroke-width', '8');
        wallDown.setAttribute('stroke-linecap', 'square');
        // wallDown.setAttribute('display', 'none');
        this.gridLayerRef.nativeElement.appendChild(wallDown);
        sq.setDownWallElement(wallDown);
      }
      if (this.puzzleService.getController().hasLinks()) {
        const linkRight = this.getSVGPathElement();
        linkRight.setAttribute('transform', `translate(${100 * sq.getX() + 50}, ${100 * sq.getY() + 50})`);
        linkRight.setAttribute('d', 'M0 0 L100 0');
        linkRight.setAttribute('stroke', 'black');
        linkRight.setAttribute('stroke-width', '8');
        linkRight.setAttribute('stroke-linecap', 'square');
        linkRight.setAttribute('display', 'none');
        this.highlightLayerRef.nativeElement.appendChild(linkRight);
        sq.setRightLinkElement(linkRight);
        const linkDown = this.getSVGPathElement();
        linkDown.setAttribute('transform', `translate(${100 * sq.getX() + 50}, ${100 * sq.getY() + 50})`);
        linkDown.setAttribute('d', 'M0 0 L0 100');
        linkDown.setAttribute('stroke', 'black');
        linkDown.setAttribute('stroke-width', '8');
        linkDown.setAttribute('stroke-linecap', 'square');
        linkDown.setAttribute('display', 'none');
        this.highlightLayerRef.nativeElement.appendChild(linkDown);
        sq.setDownLinkElement(linkDown);
      }
      if (sq.isClue) {
        // this.getPuzzleService().setValue(sq, sq.getSolutionValue(), false, false, 'black');
        // alert('clue')
        sq.setValue(sq.getSolutionValue());
        sq.setColor('black');
        // alert(sq.getX() +', '+sq.getY() + ' v: '+sq.getSolutionValue());
        this.getPuzzleService().getController().drawSquare(sq, sq.getSolutionValue());
      }
      // sq.setValue(sq.getValue())
    });
    this.puzzleService.getController().getAllRows().forEach(row => {
      for (let i = 0; i < this.puzzleService.getController().getNumberOfBorderValues(); i++){
        const text = this.getTextElement(80,
        row.getBorderValueX(i),
        row.getBorderValueY(i));
        text.innerHTML=''+row.getSolutionValue(i);
        // text.setAttribute('display', 'none');
        row.addBordervalue(text);
        this.puzzleLayerRef.nativeElement.appendChild(text);
      }
      row.setColors();
    })
  }
  public getSVGElement(kind: string): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', kind);
  }
  public getSVGPathElement(square?: Square): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if(square !== undefined){
      path.setAttribute('transform', `translate(${100 * square.getX()}, ${100 * square.getY()})`);
    }
    // path.setAttribute('x', ''+100*square.getX());
    // path.setAttribute('y', ''+100*square.getY());
    return path;
  }
  public getSVGRectElement(x: number, y:number, width: number, height:number): SVGRectElement {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', ''+x);
    rect.setAttribute('y', ''+y);
    rect.setAttribute('width', ''+width);
    rect.setAttribute('height', ''+height);
    return rect;
  }
  private getTextElement(fontSize: number, x: number, y: number): SVGTextElement {
    const text: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('width', '100px');
    text.setAttribute('height', '100px');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'blue');
    text.setAttribute('stroke-width', '0px');
    text.setAttribute('font-size', ''+fontSize);
    text.setAttribute('transform', `translate(${x}, ${y})`);

    // text.innerHTML = '5';
    return text;
  }

  ngAfterViewInit() {
    let puzzle = this.getPuzzleService().getPuzzle();
    // if (puzzle.example) {
    //   alert('shouldnt be here')
    //   this.puzzleService.getPuzzle().width = 7;
    //   this.puzzleService.getPuzzle().height = 7;
    //   this.puzzleService.createController(this, 'battleship_minesweeper');
    //   this.puzzleService.getController().drawGrid();
    // } else {
      // this.puzzleService.getController().initSquaresAndRows();
      this.puzzleService.getController().checkErrorsAndElements();
      const moveIndex = puzzle.moveIndex;
      puzzle.moveIndex = 0;
      for (let i = 0; i < moveIndex; i++) {
        this.redo();
      }
      if (puzzle.color === 'black') {
        puzzle.color = this.puzzleService.colorlist[0];
      }

    // }
    ['square-background', 'square-links', 'square-highlight', 'square-drawings'].forEach(layer => {
      // document.getElementById(layer)
      Array.from(document.getElementsByClassName(layer)).forEach(e => document.getElementById(layer).appendChild(e));
    });

    // document.getElementById('grid-layer').removeChild(document.getElementById('temp'));
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
    alert('out1')
    if (!this.puzzleService.activated) return;
    alert('out2')
    this.endMove();
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
  ngOnChanges(event) {
    console.log('change detected')
  }
}

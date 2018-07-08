import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import {Square} from './model/model.square';
import {Move} from './model/model.move';
import {Action} from './model/model.action';
import {Puzzle} from './model/model.puzzle';
import {Row} from './model/model.row';
import {PuzzleService} from '../puzzles-home/puzzle.service';
import {PuzzleController} from './controller/abstract/puzzle.controller';
import {NumbersPuzzleController} from './controller/abstract/numbers-puzzle.controller';
import {PuzzleStatsService} from '../db/puzzle-stats.service';

// import {GridType} from './grid/grid-type';
import {DrawingsService} from './drawings.service';
import { Router } from '@angular/router';
import { ControlPanel } from './control-panel';
import { InfoPanel } from './info-panel';
// import { Location } from '@angular/common';

@Component({
  selector: 'app-puzzle-component',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent implements OnInit {
  @ViewChild('puzzle') puzzleRef: ElementRef;
  @ViewChild('gridlayer') gridLayerRef: ElementRef;
  @ViewChild('elementsPanel') elementsPanelRef: ElementRef;
  controller: PuzzleController;
  private scale = 1;
  private move: Move;
  private highlightedSquare: Square;
  controlPanel: ControlPanel;
  private infoPanel: InfoPanel;
  horizontal: boolean;
  showControlPanel: boolean;
  // private congrads: SVGTextElement;
  private activated = true;
  color = 'purple';
  // controlScale: number;
  puzzleScale: number;
  public isActivated() {
    return this.activated;
  }
  constructor(private puzzleService: PuzzleService, private drawingsService: DrawingsService, private router: Router, private puzzleStatsService: PuzzleStatsService) { }
  ngOnInit(): void {
    let puzzle = this.puzzleService.getPuzzle();
    if (puzzle.example) {
      alert('shouldnt be here')
      this.showControlPanel = false;
      this.puzzleService.getPuzzle().width = 7;
      this.puzzleService.getPuzzle().height = 7;
      this.controller = this.puzzleService.createController(this, 'battleship_minesweeper');
      // this.controller.drawGrid();
    } else {
      this.showControlPanel = true;
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
        this.puzzleService.setPuzzle(puzzle);
      }
      this.controller = this.puzzleService.createController(this, this.puzzleService.getPuzzle().code);
      // this.controller.drawGrid();
      this.controlPanel = new ControlPanel();
      this.getController().addButtons();
      this.controlPanel.init();
      this.infoPanel = new InfoPanel(this, this.puzzleStatsService);
      // this.getPuzzleService().getPuzzle().moveIndex = 0;
      this.move = new Move();
      // this.getPuzzleService().getPuzzle().moves = [];

      this.rescale();

    // if (window.localStorage.getItem('storedpuzzlekey') != null) {
        this.controller.initSquaresAndRows();
        this.controller.checkErrorsAndElements();
      const moveIndex = puzzle.moveIndex;
        if (moveIndex === 0) {
          this.color = this.controlPanel.colorButtons[0].color;
          this.getPuzzle().color = this.color;
        }
        puzzle.moveIndex = 0;
        for (let i = 0; i < moveIndex; i++) {
          this.redo();
        }
        this.horizontal = true;
        this.rescale();
        this.color = this.getPuzzle().color;
    // }
    // else{
    //   this.puzzleService.getPuzzleFromDb(1).then((doc) => {
    //     // alert(doc.data().repr);
    //       // console.log(querySnapshot.docs[0].data());
    //     // console.log('jojo '+ querySnapshot.docs.length+ ' hey '+index + ' ... '+Math.floor(4 * Math.random())+ ' -> ' +querySnapshot.docs[index].get('repr'));
    //     puzzle.repr = doc.data().repr;
    //     puzzle.id = doc.id;
    //     puzzle.puzzleRef = puzzle.code + puzzle.size + ''+puzzle.dif + doc.id;
    //     puzzle.moveIndex = 0;
    //     puzzle.time = new Date().getTime();
    //     window.localStorage.setItem('storedpuzzlekey', puzzle.puzzleRef);
    //     window.localStorage.setItem(puzzle.puzzleRef, JSON.stringify(puzzle));
    //     this.controller.initSquaresAndRows();
    //     this.controller.checkErrorsAndElements();
    //     // const puz = JSON.parse(window.localStorage.getItem(puzzle.puzzleRef));
    //     // alert('stored: ' + puz.puzzleRef);
    //     // this.puzzleService.getTimes();
    //   });
    // }
    // this.congrads = this.getDrawingService().getText(35);
    // this.congrads.innerHTML = 'Congratulations';
    // this.congrads.setAttribute('font-size', '60');
    // this.getPlayLayer().appendChild(this.congrads);
    // this.puzzleRef.nativeElement.appendChild(this.resultsPanel);
    // this.getDrawi

    // ngService().translate(this.congrads, 100, 450);
    // const width = 135 * (this.controller.getWidth() + this.controller.getNumberOfBorderValues()) + this.controller.getOffsetX() * 2;
    // const height = 100 * (this.controller.getHeight() + this.controller.getNumberOfBorderValues()) + this.controller.getOffsetY() * 2;
    // this.puzzleRef.nativeElement.style.width = width + 'px';
    // this.puzzleRef.nativeElement.style.height = height + 'px';
    }
  }
  public setAllActive(active) {
    this.activated = active;
    for (const button of this.controlPanel.buttons) {
      button.active = active;
    }
  }
  public setActive(buttonText, active) {
    for (const button of this.controlPanel.buttons) {
      if (button.text === buttonText) {
        button.active = active;
      }
    }
  }
  public buttonClicked(text: string, active) {
    if (!active) return;
    switch(text.toLowerCase()) {
      case 'home':
        if (!this.activated){
          window.localStorage.removeItem('storedpuzzlekey');
        }
        this.router.navigate(['../../home']);
        break;
      case 'show':
        if(confirm('Are you sure you want to see the solution?\nYour score will not be posted.')) {
          this.showSolution();
          this.setAllActive(false);
        }
        break;
      case 'erase color':
        this.eraseColor();
        break;
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case '1': case '2': case '3': case '4': case '5': case '6': case '7':
      case '8': case '9':
        this.numberClicked(Number.parseInt(text));
        break;
      case 'x':
        this.numberClicked(0);
        break;
      case 'c':
        this.setValue(this.getController().getSelectedSquare(), 0, false, true, this.getColor());
        break;
      case 'new puzzle':
        const puzzle = this.getPuzzle();
        window.localStorage.removeItem('storedpuzzlekey');
        puzzle.repr = puzzle.nextRepr;
        puzzle.id = puzzle.nextId;
        puzzle.puzzleRef = puzzle.code + puzzle.size + ''+puzzle.dif + puzzle.id;
        puzzle.moveIndex = 0;
        puzzle.time = new Date().getTime();
        puzzle.color = 'black';
        puzzle.moveIndex = 0;
        puzzle.moves = [];
        window.localStorage.setItem('storedpuzzlekey', puzzle.puzzleRef);
        window.localStorage.setItem(puzzle.puzzleRef, JSON.stringify(puzzle));
        this.getPuzzleService().startPuzzle();
        this.setAllActive(true);
        //TODO lelijk
        window.location.reload();
        break;
      case this.getPuzzle().name + ' home':
        window.localStorage.removeItem('storedpuzzlekey');
        // this.setAllActive(true);
        this.router.navigate(['../../'+this.getPuzzle().name]);
        break;
      case 'continue':
        for (const sq of this.getController().getSquares()) {
          sq.restoreColor();
          this.getController().drawSquare(sq, sq.getValue());
        }
        // this.puzzleComponent.undo();
        // this.puzzleComponent
        this.getPuzzleService().getPuzzle().moves.splice(this.getPuzzleService().getPuzzle().moveIndex, 1);
        this.setAllActive(true);
        this.setActive("UNDO", this.getPuzzleService().getPuzzle().moveIndex !== 0 || !(this.getMove().actions.length === 0));
        this.setActive("REDO", this.getMove().actions.length === 0 && this.getPuzzleService().getPuzzle().moveIndex !== this.getPuzzleService().getPuzzle().moves.length);
        break;

      default: break;
    }
  }
  public numberClicked(n: number) {
    this.getController().numberClicked(n);
  }
  public colorButtonClicked(color) {
    if(!this.isActivated()) return;
    this.color = color;
    this.getPuzzle().color = color;
  }
  public eraseColor(): void {
    for (const sq of this.controller.getSquares()){
      if (sq.getColor() === this.getColor()) {
        this.setValue(sq, 0, false, false, this.getPuzzleService().getPuzzle().color);
        this.controller.drawSquare(sq, sq.getValue());
      }
    }
    this.controller.checkErrorsAndElements();
    window.localStorage.setItem(this.getPuzzleService().getPuzzle().puzzleRef, JSON.stringify(this.getPuzzleService().getPuzzle()));
  }
  public showResultsPanel() {
    this.activated = false;
    this.infoPanel.showResults();
  }
  public showSolution(): void {
    // alert('show')
    this.getController().puzzleSolved();

    // const oldColor = this.getPuzzleService().getPuzzle().color;
    // this.getPuzzleService().getPuzzle().color = 'black';
    // for (const sq of this.controller.getSquares()){
    //
    //   // if (sq.getColor() !== 'black') {
    //     this.setValue(sq, sq.getSolutionValue(), false, false, 'black');
    //     this.controller.drawSquare(sq);
    //   // }
    // }
    // this.controller.checkErrorsAndElements();
    // window.localStorage.setItem(this.getPuzzleService().getPuzzle().puzzleRef, JSON.stringify(this.getPuzzleService().getPuzzle()));
    // this.getPuzzleService().getPuzzle().color = oldColor;
  }

  public undo(): void {
    const move = this.getPuzzleService().getPuzzle().moves[this.getPuzzleService().getPuzzle().moveIndex - 1];
    for (const action of move.actions){
      const sq = this.controller.getSquare(action.x, action.y);
      const oldValue = sq.getValue();
      this.controller.changeValueOfSquare(sq, action.oldValue, action.oldColor);
      this.controller.valueChanged(sq, oldValue);
    }
    this.controller.checkErrorsAndElements();
    this.getPuzzleService().getPuzzle().moveIndex--;
    window.localStorage.setItem(this.getPuzzleService().getPuzzle().puzzleRef, JSON.stringify(this.getPuzzleService().getPuzzle()));
    if (this.getPuzzleService().getPuzzle().moveIndex === 0) {
      this.setActive('UNDO', false);
    }
    this.setActive('REDO', true);
  }
  public redo(): void {
    const move: Move = this.getPuzzleService().getPuzzle().moves[this.getPuzzleService().getPuzzle().moveIndex];
    for (const action of move.actions){
      const sq = this.controller.getSquare(action.x, action.y);
      const oldValue = sq.getValue();
      this.controller.changeValueOfSquare(sq, action.newValue, action.newColor);
      this.controller.valueChanged(sq, oldValue);
    }
    this.controller.checkErrorsAndElements();
    this.getPuzzleService().getPuzzle().moveIndex++;
    window.localStorage.setItem(this.getPuzzleService().getPuzzle().puzzleRef, JSON.stringify(this.getPuzzleService().getPuzzle()));
    this.setActive('UNDO', true);
    if (this.getPuzzleService().getPuzzle().moves.length === this.getPuzzleService().getPuzzle().moveIndex) {
      this.setActive('REDO', false);
    }
  }


  public setValue(sq: Square, newValue: number, isDrag: boolean, recalculate: boolean, newColor: string) {
    if (sq.getValue() === newValue || (sq.getColor() !== newColor && !this.controller.canBeOverridden(sq, newValue))
      || (isDrag && !this.controller.canBeOverridden(sq, newValue) && newValue !== 0)) {
      return;
    }
    if (sq.getOverridenColor() !== undefined) {
      const override = this.getController().getOverridenValue(sq, newValue, newColor, recalculate);
      newValue = override.value;
      newColor = override.color;
    }
    if (sq.getValue() === newValue) {
      return;
    }
    if (newValue === 0) {
      newColor = undefined;
    }
    const puzzle = this.getPuzzleService().getPuzzle();
    // console.log(puzzle.moves.length - 1 + ' vs ' + puzzle.moveIndex)
    const preMove = puzzle.moves[puzzle.moveIndex - 1];
    // const preMove = puzzle.moves[puzzle.moves.length - 1];
    // als de gebruiker meerdere malen achter elkaar hetzelfde vakje heeft gewijzigd...
    const lastChangedSquare = preMove === undefined ? undefined : this.controller.getSquare(preMove.actions[0].x, preMove.actions[0].y);
    if (this.move.actions.length == 0 && preMove !== undefined && preMove.actions.length === 1 && lastChangedSquare === sq
      && ((puzzle.color === preMove.actions[0].oldColor) || puzzle.color === preMove.actions[0].newColor)) {
        // als dit vakje dezelfde waarde heeft als waarmee deze begonnen was, wordt dit als 0 moves gezien.
      if (preMove.actions[0].oldValue === newValue) {
        puzzle.moves.pop();
        this.move = new Move();
        puzzle.moveIndex--;
      // anders wordt dit als 1 move gezien
      }else {
        preMove.actions[0].newValue = newValue;
        preMove.actions[0].newColor = newColor;
        this.move = preMove;
        puzzle.moveIndex--;
      }
    } else if (newColor !== 'black') {
      this.move.actions.push(new Action(sq.getX(), sq.getY(), sq.getValue(), sq.getColor(), newValue, newColor));
    }
    const oldValue = sq.getValue();
    this.controller.changeValueOfSquare(sq, newValue, newColor);
    this.controller.valueChanged(sq, oldValue);
    if (recalculate) {
      this.controller.checkErrorsAndElements();
    }

    this.setActive('UNDO', this.getPuzzleService().getPuzzle().moveIndex !== 0 || !(this.move.actions.length === 0));
    this.setActive('REDO', this.move.actions.length === 0 && this.getPuzzleService().getPuzzle().moveIndex !== this.getPuzzleService().getPuzzle().moves.length);
  }
  public storeCurrentPlayField() {
    for (const sq of this.getController().getSquares()) {
      this.move.actions.push(new Action(sq.getX(), sq.getY(), sq.getValue(), sq.getColor(), sq.getSolutionValue(), 'black'));
    }
    this.endMove();
  }
  public endMove(): void {
    if (this.move.actions.length === 0) {
      return;
    }
    // maak redo onmogelijk:
    this.getPuzzleService().getPuzzle().moves.splice(this.getPuzzleService().getPuzzle().moveIndex);
    // voeg de move to
    this.getPuzzleService().getPuzzle().moves.push(this.move);
    this.move = new Move();
    this.getPuzzleService().getPuzzle().moveIndex++;
    window.localStorage.setItem(this.getPuzzleService().getPuzzle().puzzleRef, JSON.stringify(this.getPuzzleService().getPuzzle()));
  }

  @HostListener('window:keydown', ['$event'])
  public keyboardInput(event: KeyboardEvent) {
    if (!this.activated) return;
    this.controller.keyPressed(event);
  }
  onMouseOut() {
    if (!this.activated) return;
    this.endMove();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event){
    if (!this.activated) return;
    const x = event.changedTouches[0].clientX; - this.gridLayerRef.nativeElement.getBoundingClientRect().left;
    const y = event.changedTouches[0].clientY; - this.gridLayerRef.nativeElement.getBoundingClientRect().top;
    const sq: Square = this.controller.getSquareFromMouseCoords(x, 0, y, 0);
    if (sq === undefined) {
      if (this.highlightedSquare !== undefined) {
        this.highlightedSquare.showHighlight(false);
      }
      return;
    }
    event.preventDefault();
    this.highlightedSquare = sq;
    this.controller.leftClicked(sq);
  }
  @HostListener('touchend', ['$event'])
  onTouchEnd(event) {
    if (!this.activated) return;
    // event.preventDefault();
    if (this.highlightedSquare !== undefined) {
      this.highlightedSquare.showHighlight(false);
    }
    this.endMove();
  }
  @HostListener('touchmove', ['$event'])
  onTouchMove(event){
    if (!this.activated) return;
    const x = event.changedTouches[0].clientX - this.gridLayerRef.nativeElement.getBoundingClientRect().left;
    const y = event.changedTouches[0].clientY - this.gridLayerRef.nativeElement.getBoundingClientRect().top;

    const newHighlightedSquare = this.controller.getSquareFromMouseCoords(x, 0, y, 0);
    if (newHighlightedSquare === this.highlightedSquare) {
      return;
    }
    // if (this.highlightedSquare != null) {
    //   this.highlightedSquare.showHighlight(false);
    // }
    this.highlightedSquare = newHighlightedSquare;
    if (newHighlightedSquare !== undefined) {
      // newHighlightedSquare.showHighlight(true);
      this.controller.drag(this.highlightedSquare);
      event.preventDefault();
    }
  }
  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    if (!this.activated) return;
    event.preventDefault();
    const button = this.getMouseButton(event);
    const x = event.clientX - this.gridLayerRef.nativeElement.getBoundingClientRect().left;
    const y = event.clientY - this.gridLayerRef.nativeElement.getBoundingClientRect().top;
    const sq: Square = this.controller.getSquareFromMouseCoords(x, 0, y, 0);
    if (sq === undefined) {
      return;
    }
    if (button === 1) {
      this.controller.leftClicked(sq);
    } else if (button === 2) {
      this.controller.rightClicked(sq);
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    if (!this.activated) return;
    const button = this.getMouseButton(event);
    if (button === 0) {
      this.endMove();
    }
  }
  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (!this.activated) return;
    const button = this.getMouseButton(event);
    if (button === 0) {
      this.controller.setDragSquare(undefined);
    }
    const x = event.clientX - this.gridLayerRef.nativeElement.getBoundingClientRect().left;
    const y = event.clientY - this.gridLayerRef.nativeElement.getBoundingClientRect().top;
    const newHighlightedSquare = this.controller.getSquareFromMouseCoords(x, 0, y, 0);
    if (newHighlightedSquare === this.highlightedSquare) {
      return;
    }
    if (this.highlightedSquare != null) {
      this.highlightedSquare.showHighlight(false);
    }
    this.highlightedSquare = newHighlightedSquare;
    if (newHighlightedSquare !== undefined) {
      newHighlightedSquare.showHighlight(true);
      if (this.getMouseButton(event) > 0) {
        this.controller.drag(this.highlightedSquare);
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.rescale();
  }
  private rescale() {
    const innerheight = window.innerHeight;
    const innerwidth = window.innerWidth;
    this.horizontal = innerHeight < innerWidth;
    const t = this.controlPanel.h + this.controlPanel.w + 60;
    const t2 = this.controlPanel.h + 30;
    const scale = this.horizontal ? Math.min(innerwidth/t, innerheight/t2) :
                                    Math.min(innerheight/t, innerwidth/t2);
    if (scale !== this.scale) {
      this.scale = scale;
    }
  }
  public getRange(beginIn:number, endEx: number): number[] {
    return Array.from(Array(endEx - beginIn),(x,i)=>i + beginIn);
  }
  public getScale(): number {
    return this.scale;
  }
  public getBorderValueColor(row: boolean, rowindex: number, bvindex: number): string {
    if(row) {
      return this.controller.getRows()[rowindex].getColor(bvindex);
    } else {
      return this.controller.getColumns()[rowindex].getColor(bvindex);
    }
  }
  public isNumbersPuzzle() {
    return this.getController() instanceof NumbersPuzzleController;
  }
  public getGridLayer(): SVGElement {
    return this.gridLayerRef.nativeElement;
  }
  public getElementsSVG(): SVGGElement {
    return this.elementsPanelRef.nativeElement;
  }
  public getColor(): string {
    return this.getPuzzleService().getPuzzle().color;
  }
  public getDrawingsService(): DrawingsService {
    return this.drawingsService;
  }
  public getPuzzleService(): PuzzleService {
    return this.puzzleService;
  }
  public getPuzzle() {
    return this.getPuzzleService().getPuzzle();
  }
  public getRouter(): Router {
    return this.router;
  }
  public getController(): PuzzleController {
    return this.controller;
  }
  // public getCongrads(): SVGTextElement {
  //   return this.congrads;
  // }
  public getColorList() {
    return this.controlPanel.colorlist;
  }
  public getControlPanel() {
    return this.controlPanel;
  }
  public getMove() {
    return this.move;
  }
}

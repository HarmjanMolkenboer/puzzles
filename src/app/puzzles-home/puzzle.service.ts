import { Injectable } from '@angular/core';
import { PuzzleController } from '../puzzle/controller/abstract/puzzle.controller';
import {BattleshipController} from '../puzzle/controller/battleship.controller';
import { PentaController } from '../puzzle/controller/penta.controller';
import { MagnetsController } from '../puzzle/controller/magnets.controller';
import {SudokuController} from '../puzzle/controller/sudoku.controller';
import {TentsController} from '../puzzle/controller/tents.controller';
import {HouseController} from '../puzzle/controller/house.controller';
import { Puzzle } from '../puzzle/model/model.puzzle';
import { PuzzleStatsService } from '../db/puzzle-stats.service';
import { DrawingsService } from '../puzzle/drawings.service';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {Move} from '../puzzle/model/model.move';
import {Action} from '../puzzle/model/model.action';
import { Square } from '../puzzle/model/model.square';
import { Router } from '@angular/router';
import {Row} from '../puzzle/model/model.row';
import { ControlPanelComponent } from '../puzzle/control-panel/control-panel.component'
@Injectable()
export class PuzzleService {
  private puzzle = new Puzzle();
  private move: Move;
  private controlPanel: ControlPanelComponent;
  // private moveIndex: number;
  activated = true;
  highlightedSquare: Square;
  // colorlist = ['gray', 'blue', 'green', 'darkorange', 'deeppink'];
  public controller: PuzzleController;
  squares = [];
  rows = [];
  constructor(private db: AngularFirestore,
    private puzzleStatsService: PuzzleStatsService,
    private drawingsService: DrawingsService,
    private router: Router) { }
  // private getNumpuzzles(doc, numnew, timeFlag): Promise<number> {
  //   if (doc.exists) {
  //     const data = doc.data();
  //     return doc.ref.update({numpuzzles: data.numpuzzles + numnew}).then(() => Promise.resolve(data.numpuzzles));
  //   } else {
  //     return doc.ref.set({numpuzzles: numnew, best: 3600000, bestuser: 'nobody', numsolved: 0, q50: Object.assign({}, timeFlag)
  //       }).then(() => Promise.resolve(0));
  //   }
  // }
  setControlPanel(controlPanel: ControlPanelComponent) {
    this.controlPanel = controlPanel;
  }
  getControlPanel(): ControlPanelComponent {
    return this.controlPanel;
  }
  public getRange(beginIn:number, endEx: number): number[] {
    return Array.from(Array(endEx - beginIn),(x,i)=>i + beginIn);
  }
  public getExplination(puzzleName): string[] {
    let pzs : string[] = [];
    const name = 'sudoku';
    const size = 's-9x9';
    const dif = 'd-10';
    // pzs =['ᙱǭకዜ्૲נશᕤɏڨࣛࣥܶූϝࢳߪᕹ࿶յӁగཛËຽဣ'];
    // const name = 'battleship_minesweeper';
    // const size = 's-12x12';
    // const dif = 'd-10';
    // pzs = ['Ǳᚊᶕऍ㰱ु½Πᨅ⃭㇀mdǑ⣿d'];
    // pzs = ['¾ëᴵ᪏᪪ĤȚd䅅'];
    // pzs = ['hᯫૹ૟wd'];
    // pzs =['ҔѥҤࢥd¤¤','ನ¨¤ფၤdႤ','¥づdd¤°ᒤ'];
    // pzs = ['㒩dɲつ㑫扬ၹٷ♼ҤÔ٧⁼ᱤᙬ¤ѷ໤ɤ'];
    // pzs = ['Øɜ÷șƉȻହௐયஂ૵ைನ౜ನౘఒ૳ౘఔŨ૷ସ૶ನ଻்଻ௐಡఖયொ૵ౘńʩgțƪ¬'];
    // pzs = ['࿻Ƀ఻Ᏸਭϲᕚᐇᅴଧໃۻኝᚩ̺ࠩۮৼ௼Խʡ෩ښએױ௭ဠ','௰ই߇ᛥᎨ॰टΥଳӇᄸĚǹ஦᎛߈к׺༌ߍԚპɄϸਝ௰Ⱦ','तᆵ౾ȅࢩଆ๔ଃᎤ֢àҒ஗Ӻৣ¡ሶᄂ࿫ȂΌ݊ᖑȔ৽Эޥ','ዖਗᓯ፲͎໠ޔมྖᛗझࢋɍᄁʨЊӉٚƜढ़Ҕ૛૱ᅘݦ','ನᎶɵࣃ೰࿡খ̊ᗮᚚȈຓ߈၃ৼ։৒ኑ͓ᘞᏟɇيţՐኒڱ','ȟ૧ԡሠͶʾӐฅభ୯ॅ᎐ࣅ჻ߘᔇ࠴଼ໟခოح౟̱łቄᔵ','ᜊ˃ሟжޅڧ൪଩͹ᑏƕൄ̅Ґ´Ā༻ੜᓐٌّࠗࢲ૥ܮᗖԃ','ۉधჶϜӁðӫؤᎌǫᙛ͏ä቟૱Ᏽ̇࿣חਉˠᘍÄਜᔜ෾ሞ','ᅌోɺĦѥᑑᓋǶሤᒒϲॺȨշ૤Ҏ᛽ģ̈́ࠎӎޚᔶᇦᚐۻʹ','঍࠙բ๡ޮȤ࠼ƌނ௜঄ᘶဪغॠ݃ජ¥ʧЁრᘌ႔Ꮸډᗩ͉'];

    // pzs = ['jdeәҤ¤dʹ൴e´Ҥ','dಥᒨdၶdԫ¤h㒬ၤቤ','ѤdᔧdѤѩᔤhޤdᒤၤ',]
    // pzs = ['ѤdࡸդdƵつ'];
    // pzs = ['ѤdࡸդdƵつ','eĥၦƤgdy','ၥ↵ၤddtŴ'];
    if (pzs.length !== 0) {
      // TODO maak docs aan met numsolved ben er bijna denk ik...
      const codeRef = this.db.firestore.collection('puzzlecodes').doc(name);
      const sizeDifRef = codeRef.collection('sizedifs').doc(`${size}-${dif}`);
      // const difRef = sizeRef.collection('difs').doc(dif);
      codeRef.get().then(doc => {
        let index = 0;
        if (doc.exists) {
          let data = doc.data();
          if (data[size] === undefined) {
            // alert('oeps: '+JSON.stringify(data))
            data[size] = {numsolved: 0, [dif]: {numpuzzles: pzs.length, numsolved: 0, best: 0, q50: {t:0, c:0}}};
            codeRef.set(data);
          }
          else if (data[size][dif] === undefined) {
            data[size][dif] = {numpuzzles: pzs.length, numsolved: 0, best: 0, q50: {t:0, c:0}};
            codeRef.set(data);
          } else {
            data[size][dif].numpuzzles += pzs.length;
            codeRef.set(data);
          }
        } else {
          const data ={numsolved: 0, [size]: {numsolved: 0, [dif]: {numpuzzles: pzs.length, numsolved: 0, best: 0, bestuser: 'nobody', q50: {t:0, c:0}}}};
          codeRef.set(data);
        }
        for (const repr of pzs) {
          const id = this.puzzleStatsService.convertNumberToString(index++);
          sizeDifRef.collection('puzzles').doc(id).set({
            repr: repr,
            best: 3600000,
            bestuser: 'nobody',
            numsolved: 0,
            q05: {t: 0, c: 0},
            q10: {t: 0, c: 0},
            q25: {t: 0, c: 0},
            q50: {t: 0, c: 0},
            q75: {t: 0, c: 0},
          });
        }
      });
    }

    switch (puzzleName) {
      case 'sudoku':
        return ['Regular Sudoku.'];
      case 'sudoku_chaos':
        return ['Chaos Sudoku.'];
      case 'battleship':
        return ['Place all the ships in the grid to solve the puzzle.',
        'Ships can be placed horizontally or vertically.',
        'Ships do not touch each other, not even diagonally.',
        'The numbers beside each row and column indicate how many of their squares are occupied by ship parts.'];
      case 'battleship_minesweeper':
        return ['Place all the ships in the grid to solve the puzzle.',
        'Ships can be placed horizontally or vertically.',
        'Ships do not touch each other, not even diagonally.',
        'The numbers beside each row and column indicate how many of their squares are occupied by ship parts.',
        'The numbers in the grid indicate how many squares surrounding that square (also diagonally) are occupied by ship parts'];
      case 'tents':
        return ['Place one tent next to each tree (not diagonally) to solve the puzzle.',
        'Tents do not touch each other, not even diagonally.',
        'The numbers beside each row and column indicate how many of their squares are occupied by tents.'
        ];
      case 'one-two-three':
        return ['Place the numbers 1, 2 and 3 so that every 2 is connected to a 1 and a 3.',
        'Same numbers do not touch each other, not even diagonally.',
        'The numbers next to each row and column indicate how many squares are occupied by 1\'s, 2\'s and 3\'s'];
      case 'penta':
        return ['Place the 12 penta\'s. They cannot touch each other.'];
      case 'penta minesweeper':
        return ['Place the 12 penta\'s. They cannot touch each other.'];
      case 'penta two clues':
        return ['Place the 12 penta\'s. They cannot touch each other.'];
      case 'magnets':
        return ['Place magnets'];
      default:
        return ['undefined'];
    }
  }
  public createController(puzzleComponent: any, puzzleName: string): PuzzleController {
    const puzzle = this.puzzle;
    this.puzzle.code = puzzleName;
    // const loadedPuzzle = localStorage.getItem('loadedPuzzle');
    switch (puzzleName) {
      case 'battleship':
        puzzle.key = 4;
        puzzle.numberOfBorderValues = 1;
        // this.repr = 'Ĕ耈ᰄĄ刄K䀄Řၘ耄';
        this.controller = new BattleshipController(this.drawingsService, this);
        break;
      case 'battleship_minesweeper':
        puzzle.key = 3;
        puzzle.numberOfBorderValues = 1;
        // this.repr = 'Ĕ耈ᰄĄ刄K䀄Řၘ耄';
        this.controller = new BattleshipController(this.drawingsService, this);
        break;
      case 'tents':
        // this.repr = '坥ꯒ耷䞺ᦫ駚襃£롂7';
        puzzle.key = 3;
        puzzle.numberOfBorderValues = 1;
        this.controller = new TentsController(this.drawingsService, this);
        break;
      case 'one-two-three':
        puzzle.key = 8;
        puzzle.numberOfBorderValues = 3;
        this.controller = new HouseController(this.drawingsService, this);
        break;
        case 'sudoku':
        case 'sudoku_chaos':
          // this.repr = 'hallotest';
          puzzle.key = puzzle.width * 2;
          puzzle.numberOfBorderValues = 0;
          this.controller = new SudokuController(this.drawingsService, this);
          break;
      case 'penta':
      case 'penta_two_clues':
        puzzle.key = 4;
        puzzle.numberOfBorderValues = 1;
        this.controller = new PentaController(this.drawingsService, this);
        break;
        // this.repr = '䜂쀒䀶ఱÁഒకう㔅Á䌁Ă䜒簂ఴ䇆쀕';
        // this.repr = 'Յ䅇぀䄗àIЉጄĐ쁇섔ᰄැĄᕀKŅ큄䀐';
      case 'penta_minesweeper':
        puzzle.key = 3;
        puzzle.numberOfBorderValues = 1;
        // return new PentaController(puzzle, 13, 13, '⥶Ձ֦倂ĉ롱 䃁Á呖čЁ倁̦⌡숈䓖儤y]', 4);
        // return new PentaController(puzzle, 13, 13, '桸丫΅᧘ᔊ俇ᳵᏁ⋙㥥岀Έ繶㐿౦瘆', 3);
        this.controller = new PentaController(this.drawingsService, this);
        break;
      case 'magnets':
        puzzle.key = 12;
        puzzle.numberOfBorderValues = 2;
        this.controller = new MagnetsController(this.drawingsService, this);
        break;
      default: break;
    }
    return this.controller;
  }
  public startPuzzle() {
    const size = this.puzzle.size;
    const dif = this.puzzle.dif;
    const user = firebase.auth().currentUser;
    this.squares = [];
    this.rows = [];
    if (user !== null) {
      const docRef = this.db.collection('puzzlecodes').doc(this.puzzle.code)
        .collection('userstats').doc(user.uid).ref;
      docRef.get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data[size] !== undefined && data[size][dif] !== undefined) {
            const temp = data[size][dif];
            temp.q50.c -= 10;
            docRef.update({
              [`${size}.${dif}.unsolved`]: temp.unsolved + 1,
              [`${size}.${dif}.q50.c`]: temp.q50.c,
              [`${size}.${dif}.lid`]: this.puzzle.id});
            }
        }
      });
    }
  }
  public postTime(): Promise<any> {
    const user = firebase.auth().currentUser;
    const puzzle = this.puzzle;
    puzzle.nextId = this.puzzleStatsService.convertNumberToString((puzzle.userNum + Number.parseInt(puzzle.id, 10)) % puzzle.numPuzzles);
    if (user === null) {
      alert('Time is not posted, since you are not logged in');
      return Promise.resolve('Time is not posted, since you are not logged in');
    }
    if (puzzle.time === 0) {
      alert('Time is not posted, since you have used erase errors');
      return Promise.resolve('Time is not posted, since you have used erase errors');
    }
    // alert(puzzle.userNum + ' '+ puzzle.numPuzzles)
    // const docId = puzzle.code + puzzle.size +''+puzzle.dif;
    const newTimeInSeconds = (new Date().getTime() - puzzle.time) / 1000;

    console.log('time: '+ newTimeInSeconds + ', user: '+user.displayName + ', puzzleid: '+ puzzle.id + ' code: '+puzzle.code);
    // if(newTimeInSeconds > 3600) {
    //   return Promise.resolve('Time is not posted, since you exceded the time limit of 1 hour.');
    // }

    const docRef = this.db.firestore.collection('puzzlecodes').doc(puzzle.code);
    const start = new Date().getTime();

    return this.puzzleStatsService.submitTime(user, puzzle, newTimeInSeconds).then(any => {
      console.log('submitted in: ' + (new Date().getTime() - start));
      console.log('GlobalStats: ' + this.puzzleStatsService.globalData);
      console.log('UserStats: ' + this.puzzleStatsService.userData);
      console.log('PuzzleStats: ' + this.puzzleStatsService.puzzleData);
    });
    // return this.puzzleStatsService.submitTime(user.uid, docId, puzzle.id, newTimeInSeconds);
  }
  public puzzleSolved(): void {
    // alert('puzzleService.puzzleSolved()')
    // this.puzzleComponent.setAllActive(false);
    // // this.getPuzzleComponent().storeCurrentPlayField();
    // if (this.showResults) {
    //   this.getPuzzleComponent().showResultsPanel();
    //   return;
    // }
    // this.animate();
    // // this.getPuzzleComponent().getCongrads().setAttribute('visibility', 'visible');
    // // this.getPuzzleComponent().getCongrads().classList.add('congrads');
    // // this.animateText(congrads);
    // // this.getPuzzleComponent().getResultsPanelSVG().setAttribute('visibility', 'visible');
    // const keys: string[] = JSON.parse(window.localStorage.getItem('storedpuzzlekeys'));
    // const key: string = this.puzzleComponent.getPuzzle().puzzleRef;
    //
    // if (keys !== null && keys.includes(key)){
    //   keys.splice(keys.indexOf(key), 1);
    //   window.localStorage.setItem('storedpuzzlekeys', JSON.stringify(keys));
    //   window.localStorage.removeItem(key);
    // }
    // this.getPuzzleComponent().getPuzzleService().postTime().then(puzzleData => {
    //   this.showResults = true;
    //   this.getPuzzleComponent().showResultsPanel();
    // }
    //   // this.getPuzzleComponent().getRouter().navigate(['/'+this.getPuzzle().name])
    // ).catch(e => {
    //   this.showResults = true;
    //   this.getPuzzleComponent().showResultsPanel();
    // });
  }
  public setValue(sq: Square, newValue: number, isDrag: boolean, recalculate: boolean, newColor: string): boolean {
    if (this.move === undefined) {
      this.move = new Move();
    }
    if (sq.getValue() === newValue || (sq.getColor() !== newColor && !this.controller.canBeOverridden(sq, newValue))
      || (isDrag && !this.getController().canBeOverridden(sq, newValue) && newValue !== 0)) {
      return false;
    }
    if (sq.getOverridenColor() !== undefined) {
      const override = this.getController().getOverridenValue(sq, newValue, newColor, recalculate);
      newValue = override.value;
      newColor = override.color;
    }
    if (sq.getValue() === newValue) {
      return false;
    }
    if (newValue === 0) {
      newColor = undefined;
    }
    const puzzle = this.getPuzzle();
    const preMove = puzzle.moves[puzzle.moveIndex - 1];
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
    this.getController().changeValueOfSquare(sq, newValue, newColor);
    this.getController().valueChanged(sq, oldValue);
    if (recalculate) {
      this.getController().checkErrorsAndElements();
    }
    return true;
  }
  public undo(): void {
    if(this.getPuzzle().moveIndex === 0) {
      return;
    }
    const move = this.getPuzzle().moves[this.getPuzzle().moveIndex - 1];
    for (const action of move.actions){
      const sq = this.controller.getSquare(action.x, action.y);
      const oldValue = sq.getValue();
      this.getController().changeValueOfSquare(sq, action.oldValue, action.oldColor);
      this.getController().valueChanged(sq, oldValue);
    }
    this.getController().checkErrorsAndElements();
    this.getPuzzle().numberOfMoves += move.actions.length;
    this.getPuzzle().moveIndex--;
    window.localStorage.setItem(this.getPuzzle().puzzleRef, JSON.stringify(this.getPuzzle()));
  }
  public redo(): void {
    if (this.getPuzzle().moveIndex === this.getPuzzle().moves.length) {
      return;
    }
    const move: Move = this.getPuzzle().moves[this.getPuzzle().moveIndex];
    for (const action of move.actions){
      const sq = this.getController().getSquare(action.x, action.y);
      const oldValue = sq.getValue();
      this.getController().changeValueOfSquare(sq, action.newValue, action.newColor);
      this.getController().valueChanged(sq, oldValue);
    }
    this.controller.checkErrorsAndElements();
    this.getPuzzle().moveIndex++;
    window.localStorage.setItem(this.getPuzzle().puzzleRef, JSON.stringify(this.getPuzzle()));
  }

  public endMove(): void {
    if (this.move === undefined || this.move.actions.length === 0) {
      return;
    }
    // maak redo onmogelijk:
    this.getPuzzle().moves.splice(this.getPuzzle().moveIndex);
    // voeg de move to
    this.getPuzzle().numberOfMoves += this.move.actions.length;
    this.getPuzzle().moves.push(this.move);
    this.move = new Move();
    this.getPuzzle().moveIndex++;
    window.localStorage.setItem(this.getPuzzle().puzzleRef, JSON.stringify(this.getPuzzle()));
    this.getControlPanel().detectChanges();
  }
  public getColorList() {
    return this.controlPanel.colorlist;
  }
  public getPuzzle() {
    return this.puzzle;
  }
  public setPuzzle(puzzle) {
    this.puzzle = puzzle;
  }
  public getController(){
    return this.controller;
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
  public eraseColor(): void {
    for (const sq of this.controller.getSquares()) {
      if (sq.getColor() === this.getPuzzle().color) {
        this.setValue(sq, 0, false, false, this.getPuzzle().color);
        this.controller.drawSquare(sq, sq.getValue());
      }
    }
    this.endMove();
    this.controller.checkErrorsAndElements();
    window.localStorage.setItem(this.getPuzzle().puzzleRef, JSON.stringify(this.getPuzzle()));
  }
  public eraseErrors(): void {
    for (const sq of this.controller.getSquares()) {
      while (sq.getValue() !== 0 && (sq.getSolutionValue() & sq.getValue()) === 0) { 
        this.clearValue(sq, sq.getColor());
      }
    }
    this.endMove();
    this.controller.checkErrorsAndElements();
    this.puzzle.time = 0;
    window.localStorage.setItem(this.getPuzzle().puzzleRef, JSON.stringify(this.getPuzzle()));
  }
  public restart(): void {
    for (const sq of this.controller.getSquares()) {
      if (sq.getValue() !== 0 && sq.getColor() !== 'black') { 
        do {
          this.clearValue(sq, sq.getColor());
        } while (sq.getValue() !== 0);
      }
    }
    this.endMove();
  }
  private setAllActive(active) {
    this.activated = active;
  }
  public numberButtonClicked(text: string) {
    switch (text.toLowerCase()) {
      case '1': case '2': case '3': case '4': case '5': case '6': case '7':
      case '8': case '9':
        this.getController().numberClicked(Number.parseInt(text));
        break;
      case 'x':
        this.getController().numberClicked(0);
        break;
      case 'c':
        this.clearValue(this.getController().getSelectedSquare(), this.getPuzzle().color);
        break;
      default:
        alert('oeps iets anders geklikt: '+text)
    }
  }
  private clearValue(sq:Square, color: string) {
    this.setValue(sq, 0, false, true, color);
  }
  public buttonClicked(text: string) {
    switch(text.toLowerCase()) {
      case 'home': case 'exit':
        if (!this.activated){
          window.localStorage.removeItem('storedpuzzlekey');
        }
        this.router.navigate(['../../home']);
        break;
      case 'new puzzle':
        const puzzle = this.getPuzzle();
        window.localStorage.removeItem('storedpuzzlekey');
        puzzle.repr = puzzle.nextRepr;
        puzzle.id = puzzle.nextId;
        puzzle.puzzleRef = puzzle.code + puzzle.size + ''+puzzle.dif + puzzle.id;
        puzzle.moveIndex = 0;
        puzzle.time = new Date().getTime();
        puzzle.color = 'gray';
        puzzle.moveIndex = 0;
        puzzle.moves = [];
        window.localStorage.setItem('storedpuzzlekey', puzzle.puzzleRef);
        window.localStorage.setItem(puzzle.puzzleRef, JSON.stringify(puzzle));
        this.startPuzzle();
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
        this.getPuzzle().moves.splice(this.getPuzzle().moveIndex, 1);
        this.setAllActive(true);
        break;

      default: break;
    }

  }
  public getRouter(): Router {
    return this.router;
  }
  // public getController() {
  //   return this.controller;
  // }
}

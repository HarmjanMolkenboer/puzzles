import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PuzzleService } from '../../puzzles-home/puzzle.service';
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ControlPanelComponent implements OnInit {
  @ViewChild('elementsPanel') elementsRef: ElementRef;
  h = 720;
  w = 340;
  d = 15;
  buttonw: number;
  buttonh: number;
  buttons = [
    {
      text: 'home',
      xh: 0, yh:0, xv:0, yv:0
    },
    {
      text: 'show',
      xh: 0, yh:0, xv:0, yv:0
    },
    {
      text: 'undo',
      xh: 0, yh:0, xv:0, yv:0
    },
    {
      text: 'redo',
      xh: 0, yh:0, xv:0, yv:0
    }
  ];
  eraseButton = {
    text: 'erase color',
    x: 0, y:0
  };
  colorlist = ['gray', 'blue', 'green', 'darkorange', 'deeppink'];
  colorButtons = [];
  color: string;
  numberButtons = [];
  numberlist = [];
  horizontal = true;
  activated = true;
  constructor(private puzzleService: PuzzleService, private changeDetector: ChangeDetectorRef){}
  ngOnInit() {
    this.puzzleService.setControlPanel(this);
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.horizontal = w > h;
    window.onresize = (event => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      if (this.horizontal !== w > h) {
        this.horizontal = (w > h);
        this.detectChanges();
      }
    });
    // alert(window.orientation)
    this.buttonw = (this.w - this.d) / 2;
    this.buttonh = this.buttonw * 0.33;
    for(let x = 0; x < 2; x++) {
      for(let y = 0; y < 2; y++) {
        this.buttons[x + 2 * y].xh = x * (this.buttonw + this.d);
        this.buttons[x + 2 * y].yh = 4.7 * y * (this.buttonh + this.d);
        this.buttons[x + 2 * y].xv = x * (this.buttonw + this.d);
        this.buttons[x + 2 * y].yv = 3.5 * y * (this.buttonh + this.d);
      }
    }
    this.colorlist.forEach((clr, i) => {
      this.colorButtons.push({
        color: clr,
        cxh: (i + 1) * this.w / 8,
        cxv: (i + 0.5) * this.w / 4,
        cyh: (this.w - this.d) / 8 * (2 * (i % 2) + 1) + this.d / 2,
        cyv: (this.w - this.d) / 8,
      });
    });
    this.puzzleService.getController().getNumberList().forEach((num, i) => {
      this.numberButtons.push({
        number: num,
        xh: (i % 3) * (this.w + this.d) / 3,
        xv: (i % 2) * (this.w + this.d) / 3,
        // cxv: (this.w - this.d) / 8 * 2 * i + this.d / 2,
        yh: (i - (i % 3)) / 3 * (this.buttonh + this.d),
        yv: (i - (i % 2)) / 2 * (this.buttonh + this.d),
      });
    });
    this.puzzleService.getController().drawElements();
    this.color = this.puzzleService.getPuzzle().color;
    if (this.color === 'black') {
      this.color = 'gray';
      this.puzzleService.getPuzzle().color = 'gray';
    }
  }
  colorButtonClicked(color: string){
    this.puzzleService.getPuzzle().color = color;
    this.color = color;
  }
  public buttonClicked(text: string) {
    this.puzzleService.buttonClicked(text);
    this.detectChanges();
  }
  public exit() {
    alert('exit');
  }
  public eraseErrors() {
    alert('erase errors');
  }
  public showHelp() {
    alert('showhelp')
  }
  public get width() {
    // alert('getW')
    return this.w;
  }
  public getElementsSVG(): SVGElement {
    // alert('hey'+(this.elementsRef === undefined))
    return this.elementsRef.nativeElement;
  }
  public detectChanges(): void {
    this.changeDetector.detectChanges();
  }
}

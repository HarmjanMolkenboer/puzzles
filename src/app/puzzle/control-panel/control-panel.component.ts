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
  public showMenu=false;
  colorlist = ['gray', 'blue', 'green', 'darkorange', 'deeppink'];
  numberButtons = [];
  horizontal = true;
  activated = true;
  constructor(public puzzleService: PuzzleService, private changeDetector: ChangeDetectorRef){}
  ngOnInit() {
    // alert('hoi')
    this.puzzleService.setControlPanel(this);
    this.puzzleService.getController().getNumberList().forEach((num, i) => {
      this.numberButtons.push({
        number: num,
      });
    });
    this.puzzleService.getController().drawElements();
  }
  colorButtonClicked(color: string){
    this.puzzleService.getPuzzle().color = color;
  }
  public numberButtonClicked (num: string) {
    this.puzzleService.numberButtonClicked(num);
  }
  public exit() {
    if (confirm("are you sure?")) {
      this.puzzleService.buttonClicked('exit');
      this.showMenu = false;
    }
  }
  public undo() {
    this.puzzleService.undo();
  }
  public redo() {
    this.puzzleService.redo();
  }
  public eraseColor() {
    this.puzzleService.eraseColor();
    this.showMenu = false;
  }
  public eraseErrors() {
    if (confirm('Are you sure you want to see the solution?\nYour score will not be posted.')) {
      this.puzzleService.eraseErrors();
    }
    this.showMenu = false;
  }
  public showHelp() {
    alert('showhelp')
    this.showMenu = false;
  }
  public restart(){
    this.puzzleService.restart();
    // alert('restart');
  }
  public getElementsSVG(): SVGElement {
    return this.elementsRef.nativeElement;
  }
  public detectChanges(): void {
    this.changeDetector.detectChanges();
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.changeDetector.detectChanges();
  }
  hideMenu() {
    this.showMenu = false;
    this.changeDetector.detectChanges();
  }
}

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
  colorButtons = [];
  // color: string;
  numberButtons = [];
  numberlist = [];
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
  public buttonClicked(text: string) {
    this.puzzleService.buttonClicked(text);
    this.showMenu = false;
    this.detectChanges();
  }
  public exit() {
    if (confirm("are you sure?")) {
      this.puzzleService.buttonClicked('exit');
      this.showMenu = false;
    }
  }
  public eraseErrors() {
    alert('erase errors');
    this.showMenu = false;
  }
  public showHelp() {
    alert('showhelp')
    this.showMenu = false;
  }
  public restart(){
    alert('restart');
  }
  public getElementsSVG(): SVGElement {

    // alert('hey'+(this.elementsRef === undefined))
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

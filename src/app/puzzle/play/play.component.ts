import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ControlPanelComponent } from '../control-panel/control-panel.component';
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  @ViewChild('controlPanel') controlPanelComponent: ControlPanelComponent;
  constructor() { }

  ngOnInit() {
  }
  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    if (event.target.matches('.dropdown-button')) {
     this.controlPanelComponent.toggleMenu();
    }else if (!event.target.closest('.dropdown-content')){
      this.controlPanelComponent.hideMenu();
   }
  }
}

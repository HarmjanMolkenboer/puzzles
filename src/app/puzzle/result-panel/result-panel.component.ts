import { Component, OnInit } from '@angular/core';
import { PuzzleComponent } from '../puzzle.component';
import { PuzzleStatsService } from '../../db/puzzle-stats.service';

@Component({
  selector: 'app-result-panel',
  templateUrl: './result-panel.component.html',
  styleUrls: ['./result-panel.component.css']
})
export class ResultPanelComponent implements OnInit {
  private puzzleComponent: PuzzleComponent;
  private puzzleStatsService: PuzzleStatsService;
  buttons;
  texts;
  times = [];
  dx = 200;

  constructor(puzzleComponent: PuzzleComponent, puzzleStatsService: PuzzleStatsService) {
    // this.podium = podium;
    this.puzzleComponent = puzzleComponent;
    this.puzzleStatsService = puzzleStatsService;
  }

  ngOnInit() {
    this.buttons = [
      {
        text: 'New puzzle',
        width: 300,
        height: 60,
        xh: 350,
        yh: 600,
        xv: 350,
        yv: 600,
        active: true
      },
      {
        text: '' + this.puzzleComponent.getPuzzle().name + ' home',
        width: 300,
        height: 60,
        xh: 350,
        yh: 670,
        xv: 350,
        yv: 670,
        active: true
      },
      {
        text: 'Continue',
        width: 300,
        height: 60,
        xh: 50,
        yh: 600,
        xv: 50,
        yv: 600,
        active: true
      },
      {
        text: 'Home',
        width: 300,
        height: 60,
        xh: 50,
        yh: 670,
        xv: 50,
        yv: 670,
        active: true
      }
    ];
  }
  public showResults(): void {
    const puzzleData = this.puzzleStatsService.puzzleData;
    const time = this.puzzleStatsService.time;
    const best = puzzleData.best;
    const num = puzzleData.numsolved;
    if (num === 1) {
      this.times = [{
          time: puzzleData.q50.t,
          medal: 'gold'
      }];
    } else if (num === 2) {
      if (time > best) {
        this.times = [{
            time: time,
            medal: 'silver'
          },{
            time: best,
            medal: 'gold'
        }];
      } else {
        this.times = [{
            time: puzzleData.q50.t,
            medal: 'silver'
          }, {
            time: best,
            medal: 'gold'
        }];
      }
    } else {
      this.times = [{
          time: puzzleData.q75.t,
          medal: 'bronze'
        }, {
          time: puzzleData.q50.t,
          medal: 'silver'
        }, {
          time: puzzleData.q25.t,
          medal: 'gold'
      }];
      if (num > 10) {
        this.times.push({
          time: puzzleData.q10.t,
          medal: 'platinum'
      });
      }
      if (num > 20) {
        this.times.push({
          time: puzzleData.q05.t,
          medal: 'diamond'
        });
      }
    }
  }

}

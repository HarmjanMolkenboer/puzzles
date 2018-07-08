import { PuzzleStatsService } from '../db/puzzle-stats.service';
import { PuzzleService } from '../puzzles-home/puzzle.service';
export class InfoPanel {
  buttons;
  texts;
  times = [];
  dx = 200;
  constructor(private puzzleService: PuzzleService, private puzzleStatsService: PuzzleStatsService) {
    // this.podium = podium;
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
        text: '' + this.puzzleService.getPuzzle().name + ' home',
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
          medal: 4
      }];
    } else if (num === 2) {
      if (time > best) {
        this.times = [{
            time: time,
            medal: 3
          },{
            time: best,
            medal: 4
        }];
      } else {
        this.times = [{
            time: puzzleData.q50.t,
            medal: 3
          }, {
            time: best,
            medal: 4
        }];
      }
    } else {
      this.times = [{
          time: puzzleData.q75.t,
          medal: 2
        }, {
          time: puzzleData.q50.t,
          medal: 3
        }, {
          time: puzzleData.q25.t,
          medal: 4
      }];
      if (num > 10) {
        this.times.push({
          time: puzzleData.q10.t,
          medal: 5
      });
      }
      if (num > 20) {
        this.times.push({
          time: puzzleData.q05.t,
          medal: 6
        });
      }
    }
  }
}

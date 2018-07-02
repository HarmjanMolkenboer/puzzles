import {Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { PuzzleService } from '../puzzles-home/puzzle.service';
import { Puzzle } from '../puzzle/model/model.puzzle';
import * as puzzles from './../app.component';
import { UserService } from '../db/user.service';
import { PuzzleStatsService } from '../db/puzzle-stats.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {
  // @ViewChild('sizesDropdown') sizesDropdown: HTMLSelectElement;
  // @ViewChild('difsDropdown') difsDropdown: HTMLSelectElement;
  difstrings= ['easy', 'normal', 'hard', 'very hard', 'expert', 'extreme', 'terror'];
  puzzletypes = ['All puzzles'];
  // showNav = true;
  title = 'Rankings';
  puzzleName: string;
  size: string;
  sizes = [];
  dif: string;
  difs = [];
  list: firebase.firestore.DocumentData[] = [];
  users = [];
  stats = [];
  lastSorted = {type: undefined, asc: false};
  puzzleData: firebase.firestore.DocumentData = undefined;
  private puzzle: Puzzle;
  constructor(private db: AngularFirestore, private router: Router, private puzzleService: PuzzleService, private userService: UserService, private puzzleStatsService: PuzzleStatsService) {
    puzzles.puzzletypes.forEach(p => this.puzzletypes.push(p));
  }
  ngOnInit() {
    this.db.firestore.collection('userstats').get().then(qs => {
      let i = 0;
      qs.docs.forEach(doc => {
        this.users[doc.ref.id] = doc.data().username;
      });
    });
  }
  private getUserStats(ordering: string) {
    this.list = [];
    const data = [];
    if (this.size === undefined) {
      this.stats.forEach(userdata => {
        const obj = {};
        Object.keys(userdata).filter(k => !k.startsWith('s-')).forEach(key => {
          obj[key] = userdata[key];
        });
        if (Object.length !== 0) {
          const m = Math.floor(userdata.avgm);
          obj['avgMedal'] = this.puzzleStatsService.medals[m-1];
          for (let i = 0.25; i < userdata.avgm - m; i += 0.25) {
            obj['avgMedal'] += '+';
          }
          obj[`q50`] = {t: 0};
          obj[`best`] = 0;
          this.list.push(obj);
        }
      })
    } else if (this.dif === undefined){
      this.stats.forEach(userdata => {
        const data = userdata[`s-${this.size}`];
        if (data.length !== 0) {
          const obj = {};
          Object.keys(data).filter(k => !k.startsWith('d-')).forEach(key => {
            obj[key] = data[key];
          });
          const m = Math.floor(userdata.avgm);
          obj['avgMedal'] = this.puzzleStatsService.medals[m - 1];
          for (let i = 0.25; i < userdata.avgm - m; i += 0.25) {
            obj['avgMedal'] += '+';
          }
          // obj['name'] = this.users[userdata.ref.id];
          obj[`q50`] = {t: 0};
          obj[`best`] = 0;
          this.list.push(obj);
        }
      })
    } else {
      this.stats.forEach(userdata => {
        const obj = userdata[`s-${this.size}`][`d-${this.dif}`];
        if (obj.length !== 0) {
          const m = Math.floor(userdata.avgm);
          obj['avgMedal'] = this.puzzleStatsService.medals[m-1];
          for (let i = 0.25; i < userdata.avgm - m; i += 0.25) {
            obj['avgMedal'] += '+';
          }
          this.list.push(obj);
        }
      })
    }
  }
  public showRankings(ordering: string) {
    this.getUserStats(ordering);
  }
  sortBy(type: string) {
    const asc = this.lastSorted.type !== type || !this.lastSorted.asc;
    this.lastSorted.type = type;
    this.lastSorted.asc = asc;
    this.list.sort((d1, d2) => d1[type] < d2[type] ? asc ? 1 : -1 : asc ? -1 : 1);
    for(let i = 0; i < this.list.length; i++) {
      const d = this.list[i];
      d.index = asc ? i + 1 : this.list.length - i;
    }
  }
  changePuzzle(puz):void {
    if (puz !== "All puzzles") {
      this.puzzleName = puz;
      const doc = this.db.firestore.collection('puzzlecodes').doc(puz);
      this.sizes = ['All sizes'];
      this.difs = [];
      doc.get().then(d => {
        if(d.exists) {
          this.puzzleData = d.data();
          Object.keys(this.puzzleData).filter(k => k.startsWith('s-')).forEach(k => {
            this.sizes.push(k.substring(2));
          });
        }else {
          console.log(`puzzleDoc doesn't exist: ${puz}`);
        }
      })
      doc.collection('userstats').get().then(qs => {
        this.stats = [];
        qs.forEach(q => {
          const data = q.data();
          data.name = this.users[q.ref.id];
          this.stats.push(data);
        })
      })
    }
    else {
      this.puzzleName = undefined;
    }
    // this.puzzle = this.puzzleService.getPuzzleTypes(puz);
    // this.sizes = this.puzzle.sizestrings.length > 1 ? ['All sizes'] : [];
    // this.puzzle.sizestrings.forEach(s => this.sizes.push(s));
    // const sd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('sizesDropdown');
    // if (sd !== null && this.puzzle.sizestrings.length > 1) {
    //   sd.value = "All sizes";
    // }
    this.size = undefined;
        // this.sizesDropdown.options[0].selected = true;
    // this.sizesDropdown.value = 'All sizes';
  }
  changeSize(size):void {
    this.difs = ['All difficulties'];
    if (size === 'All sizes') {
      this.size = undefined;
    } else {
      this.size = size;
      const data = this.puzzleData[`s-${size}`];
      Object.keys(data).filter(k=>k.startsWith('d-')).forEach(k => {
        this.difs.push(k.substring(2));
      });
    }
    // for (let i = 0; i < this.puzzle.difs[this.sizes.indexOf(size) - 1]; i++) {
    //   this.difs.push(this.puzzleService.difstrings[i]);
    // }
    const dd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('difsDropdown');
    if (dd !== null) {
      dd.value = "All difficulties";
    }
    this.dif = undefined;
    // this.difsDropdown.getElementsByTagName('option')[0].selected = true;
  }
  changeDif(dif):void {
    this.dif = dif === "All difficulties" ? undefined : dif;
  }
  goToPuzzle() {
    const puzzle = this.puzzleService.getPuzzle();
    if (this.size !== undefined) {
      // puzzle.size = this.sizes.indexOf(this.size);
      if (this.dif !== undefined) {
        puzzle.dif = this.dif;
      } else {
        puzzle.dif = '0';
      }
    } else {
      // puzzle.size = 0;
      puzzle.dif = '0';
    }
    this.router.navigate(['../../'+this.puzzleName]);
  }
}

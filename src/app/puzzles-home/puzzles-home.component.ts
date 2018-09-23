import {Input, OnInit, Component, ViewChild, ElementRef} from '@angular/core';
import {PuzzleStatsService } from '../db/puzzle-stats.service';
// import {PuzzleStats} from '../db/puzzle-stats';
import { PuzzleService } from './puzzle.service';
import { Puzzle } from '../puzzle/model/model.puzzle';
import { ActivatedRoute, Router } from '@angular/router';
// import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzles-home.component.html',
  styleUrls: ['./puzzles-home.component.css'],
})
export class PuzzlesHomeComponent implements OnInit {
  @ViewChild('play') playButton: ElementRef;
  constructor(public puzzleStatsService: PuzzleStatsService,
    public puzzleService: PuzzleService,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) { }
  globalData: firebase.firestore.DocumentData;
  userData: firebase.firestore.DocumentData;
  globalBest = 'fetching...';
  globalMedian = 'fetching...';
  userBest = 'fetching...';
  userMedian = 'fetching...';
  maxSize = 0;
  maxDif = 0;
  title: string;
  id: number;
  size = 'x';
  sizeIndex = 0;
  difIndex = 0;
  dif = '0';
  sizestrings = ['x'];
  dbdifs = ['0'];
  name: string;
  showrankings = false;
  showresults = false;
  users: string[];
  stats = [];
  list: firebase.firestore.DocumentData[];
  lastSorted = {type: undefined, asc: false};
  ngOnInit(): void {
    this.puzzleService.getPuzzle().example = true;
    const user = firebase.auth().currentUser;
    this.name = this.route.snapshot.paramMap.get('puzzle-name');
    this.puzzleStatsService.getPuzzleDoc(this.name).then(data => {
      this.globalData = data;
      this.sizestrings = Object.keys(data).filter(k=>k.startsWith('s-'))
        .sort((s1,s2) => {
          const index1 = s1.indexOf('x');
          const index2 = s2.indexOf('x');
          const t1 = 10 * Number.parseInt(s1.substring(2,index1)) + Number.parseInt(s1.substring(index1 + 1));
          const t2 = 10 * Number.parseInt(s2.substring(2,index2)) + Number.parseInt(s2.substring(index2+ 1));
          return t1 - t2;
        });
      this.size = this.sizestrings[this.sizeIndex];
      this.maxSize = this.sizestrings.length - 1;
      this.dbdifs = Object.keys(this.globalData[this.size])
        .filter(k=>k.startsWith('d-'))
        .sort((k1, k2) => Number.parseInt(k1.substring(2)) - Number.parseInt(k2.substring(2)));
      this.maxDif = this.dbdifs.length - 1;
      this.dif = this.dbdifs[this.difIndex];
    }).catch((e) => {
      alert(e.message)
    }).then(() => {
      const user = firebase.auth().currentUser;
      if (user === null) {
        this.userBest = 'please log in or register to compete';
        this.userMedian = 'please log in or register to compete';
        this.reloadStats();
      } else {
        this.puzzleStatsService.getUserDoc(this.name, firebase.auth().currentUser).then(data => {
          this.userData = data;
          this.reloadStats();
        }).catch(() => {
          this.userBest = 'no time set';
          this.userMedian = 'no time set';
          this.reloadStats();
        });
      }
    });
  }
  changeSize(sizeIndex) {
    this.sizeIndex = sizeIndex;
    this.size = this.sizestrings[this.sizeIndex];
    this.dbdifs = Object.keys(this.globalData[this.size])
      .filter(k=>k.startsWith('d-'))
      .sort((k1, k2) => Number.parseInt(k1.substring(2)) - Number.parseInt(k2.substring(2)));
    this.maxDif = this.dbdifs.length - 1;
    if (this.difIndex > this.maxDif) {
      this.difIndex = this.maxDif;
    }
    this.dif = this.dbdifs[this.difIndex];
    this.reloadStats();
  }
  changeDifficulty(difIndex) {
    this.difIndex = difIndex;
    this.dif = this.dbdifs[difIndex];
    this.reloadStats();
  }
  reloadStats() {
    this.globalBest = this.globalData[this.size][this.dif].best;
    this.globalMedian = this.globalData[this.size][this.dif].q50.t;
    if (this.userData !== undefined && this.userData[this.size] !== undefined && this.userData[this.size][this.dif] !== undefined) {
      this.userBest = this.userData[this.size][this.dif].best;
      this.userMedian = this.userData[this.size][this.dif].q50.t;
    } else if (firebase.auth().currentUser !== null) {
        this.userBest = 'no time set';
        this.userMedian = 'no time set';
    }
    this.playButton.nativeElement.disabled = true;
    this.playButton.nativeElement.innerHTML = 'loading...';
    this.puzzleService.getPuzzle().dif = this.dif;
    this.puzzleService.getPuzzle().size = this.size;
    this.puzzleService.getPuzzle().code = this.name;

    this.puzzleStatsService.getPuzzleStats(this.puzzleService.getPuzzle(), 0).then(() => {
      console.log('data arrived');
      this.playButton.nativeElement.disabled = false;
      this.playButton.nativeElement.innerHTML = 'PLAY';
    });
  }
  getWidth() {
    const dims = this.size.substring(2).split('x');
    return Number.parseInt(dims[0]);
  }
  getHeight() {
    const dims = this.size.substring(2).split('x');
    return Number.parseInt(dims[1]);
  }
  loadPuzzle() {
    const puzzle = this.puzzleService.getPuzzle();
    puzzle.example = false;
    puzzle.name = this.name;
    puzzle.code = this.name;
    puzzle.width = this.getWidth();
    puzzle.height = this.getHeight();
    puzzle.dif = this.dif;
    if (window.localStorage.getItem('storedpuzzlekey') !== null) {
      const key = window.localStorage.getItem('storedpuzzlekey');
      if (key !== null) {
        let keys = JSON.parse(localStorage.getItem('storedpuzzlekeys'));
        if (keys == null){
          keys = [];
        }
        keys.push(key);
        // alert(key);
        window.localStorage.setItem('storedpuzzlekeys', JSON.stringify(keys));
        window.localStorage.setItem(key, JSON.stringify(puzzle));
      }
      window.localStorage.removeItem('storedpuzzlekey');
    }
    puzzle.repr = this.puzzleStatsService.puzzleData.repr;
    puzzle.puzzleRef = puzzle.code + puzzle.size + ''+puzzle.dif + puzzle.id;
    puzzle.moveIndex = 0;
    puzzle.color = 'gray';
    puzzle.moveIndex = 0;
    puzzle.moves = [];
    this.puzzleService.startPuzzle();

    this.router.navigate(['/play']);
  }
  //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //
  //  -------------------RANKINGS----------------------------- //
  //  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv //
  toggleRankings(): void {
    if (this.users === undefined) {
      this.users =[];
      const doc = this.db.firestore.collection('puzzlecodes').doc(this.name);
      this.db.firestore.collection('userstats').get().then(qs => {
        let i = 0;
        qs.docs.forEach(doc => {
          this.users[doc.ref.id] = doc.data().username;
        });
      }).then(() => {
        doc.collection('userstats').get().then(qs => {
          this.stats = [];
          qs.forEach(q => {
            const data = q.data();
            data.name = this.users[q.ref.id];
            this.stats.push(data);
          })
        }).then(() => {
          this.list = [];
          const data = [];
          this.stats.forEach(userdata => {
            const obj = userdata[this.size][this.dif];
            if (obj.length !== 0) {
              obj.name = userdata.name;
              this.list.push(obj);
            }
          })
        }).then(() => {
          this.sortBy('score');
          this.showrankings = !this.showrankings;
        });
      });
    } else {
      this.showrankings = !this.showrankings;
    }
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

}

import {Component, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { PuzzleService } from '../puzzles-home/puzzle.service';
import * as puzzles from './../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  puzzletypes = puzzles.puzzletypes;
  // puzzletypes = ['Tents', 'Battleship', 'BattleshipMinesweeper', 'Penta', 'PentaMinesweeper', 'PentaTwoClues', 'Magnets'];
  storedpuzzlekeys: string[];
  // showNav = true;
  title = 'Home';
  constructor(private db: AngularFirestore, private router: Router, private puzzleService: PuzzleService) {

  }

  ngOnInit() {
    // window.localStorage.clear();
    // localStorage.clear();
    this.storedpuzzlekeys = JSON.parse(window.localStorage.getItem('storedpuzzlekeys'));
  }
  public loadStoredPuzzle(key) {
    if (window.localStorage.getItem('storedpuzzlekey') !== null) {
      const key = window.localStorage.getItem('storedpuzzlekey');
      let keys: string[] = JSON.parse(window.localStorage.getItem('storedpuzzlekeys'));
      if (keys == null){
        keys = [];
      } else if (!keys.includes(key)){
        keys.push(key);
      }
      window.localStorage.setItem('storedpuzzlekeys', JSON.stringify(keys));
    }
    window.localStorage.setItem('storedpuzzlekey', key);
    this.puzzleService.setPuzzle(JSON.parse(window.localStorage.getItem(key)));
    this.router.navigate(['/play']);
  }
  public go(puzzle: string) {
    alert(puzzle);
  }
  goToPuzzle(puzzletype: string) {
    this.puzzleService.getPuzzle().size = undefined;
    this.puzzleService.getPuzzle().dif = undefined;
    this.router.navigate(['/' + puzzletype]);
  }
}

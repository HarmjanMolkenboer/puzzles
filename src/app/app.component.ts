import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = true;
  // login = 'Login';
  // puzzles = ['Tents', 'Battleship', 'Battleship Minesweeper'];
  // puzzletypes = ['Tents', 'Battleship', 'BattleshipMinesweeper'];
  constructor(private router: Router){
    // this.login = firebase.auth().currentUser == null ? 'Login' : 'My Account';

  }
  showNavBar() {
    return this.router.url !== '/play';
  }
  isPuzzleActive() {
    return window.localStorage.getItem('activePuzzle') !== null;
  }

  // public setLogin(b: boolean) {
  //   this.login = b ? 'My Account' : 'Login';
  // }
  // ngOnInit() {
  //   firebase.auth().onAuthStateChanged(user => {
  //     alert('change')
  //     if (user == null) {
  //       this.login = 'Login';
  //     } else {
  //       this.login = 'My Account';
  //     }
  //   });
  // }
}
export const puzzletypes = [
  'sudoku',
  'sudoku_chaos',
  'battleship',
  'battleship_minesweeper',
  'tents',
  // 'OneTwoThree',
  'magnets',
  // 'Penta',
  // 'PentaMinesweeper',
  // 'PentaTwoClues',
];

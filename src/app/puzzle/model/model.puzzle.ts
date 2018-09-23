import { Move } from './model.move';
export class Puzzle {
  time: number;
  name: string;
  code: string;
  size: string;
  width: number;
  height: number;
  dif: string;
  id: string;
  numPuzzles: number;
  userNum: number;
  puzzleRef: string;
  repr: string;
  nextRepr: string;
  nextId: string;
  key: number;
  color: string;
  moveIndex: number;
  globalkindbest: string;
  globalkindnum: string;
  globalkindcum: string;
  personalkindbest: string;
  personalkindnum: string;
  personalkindcum: string;
  example: boolean;
  numberOfBorderValues: number;
  gridType: string;
  numberOfMoves = 0;

  // times: any;
  moves: Move[];
  constructor(){}  // constructor() {
  //   this.kind = kind;
  //   this.size = size;
  //   this.repr = '';
  //   this.color = 'black';
  //   this.moves = [];
  //   this.moveIndex = 0;
  // }
}

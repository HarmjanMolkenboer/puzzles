import { Component, OnInit } from '@angular/core';
import { PuzzleService } from '../../puzzles-home/puzzle.service';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit {

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit() {
  }

}

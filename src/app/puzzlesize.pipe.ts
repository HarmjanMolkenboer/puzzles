import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'puzzlesize'
})
export class PuzzlesizePipe implements PipeTransform {

  transform(dbsize: string): string {
    return dbsize.substring(2).replace('x',' X ');
  }

}

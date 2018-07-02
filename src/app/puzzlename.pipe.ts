import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'puzzlename'
})
export class PuzzlenamePipe implements PipeTransform {

  transform(name: string): string {
    return name.replace('_', ' ');
  }

}

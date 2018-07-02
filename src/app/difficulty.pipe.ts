import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficulty'
})
export class DifficultyPipe implements PipeTransform {

  difstrings= ['easy', 'normal', 'hard', 'very hard', 'expert', 'extreme', 'terror'];

  transform(index: number, length: number): string {
    return this.difstrings[index];
  }

}

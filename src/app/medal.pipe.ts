import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'medal'
})
export class MedalPipe implements PipeTransform {
  medals = ['Wood', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  transform(multiplier: number): string {
    const m = Math.floor(multiplier);
    let medal = this.medals[m - 1];
    for (let i = 0.25; i < multiplier - m; i += 0.25) {
      medal += '+';
    }
    return medal;
  }

}

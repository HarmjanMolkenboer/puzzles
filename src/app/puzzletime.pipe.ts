import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'puzzletime'
})
export class PuzzletimePipe implements PipeTransform {

  transform(timeinsec: any, withText: boolean): string {
    // alert(Number.parseInt(timeinsec))

    if(typeof(timeinsec) === typeof('')) {
      // alert(timeinsec)
      return timeinsec;
    }
    if (timeinsec === 0) {
      return 'no time set';
    }
    const minutes = Math.floor(timeinsec / 60);
    const seconds = Math.floor(timeinsec) - 60 * minutes;
    // const hundreds = Math.floor((timeinsec - 60 * minutes - seconds) / 10);
    const hundreds = Math.floor((timeinsec - Math.floor(timeinsec)) * 100);
    let string = '';
    if (minutes > 0) {
      string = '' + minutes + (withText ? ' min, ' : ':');
    }
    if (minutes > 0 && seconds < 10) {
      string += '0'+seconds;
    } else {
      string += seconds;
    }
    if (hundreds < 10) {
      string += '.0' + hundreds;
    } else {
      string += '.' + hundreds;
    }
    if (withText) {
      string += ' sec';
    }
    return string;
  }

}

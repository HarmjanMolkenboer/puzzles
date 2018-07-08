import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Puzzle } from '../puzzle/model/model.puzzle';
@Injectable()
export class PuzzleStatsService {
  // puzzleStats: PuzzleStats = new PuzzleStats();
  // globalStats: GlobalStats = new GlobalStats();
  // userStats: UserStats = new UserStats();
  puzzleData: firebase.firestore.DocumentData;
  globalData: firebase.firestore.DocumentData;
  userData: firebase.firestore.DocumentData;
  puzzleId: number;
  puzzleIdString: string;
  score: number;
  multiplier: number;
  prebestuser: string;
  bestuser: string;
  user: firebase.User;
  weight: number;
  time: number;
  best: number;
  puzzle: Puzzle;
  medal: string;
  medals = ['wood', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
  constructor(private db: AngularFirestore) {
    this.globalData = {best: 'loading...', q50: {t: 'loading...'}};
    this.userData = {best: 'loading...', q50: {t: 'loading...'}};
  }
  public getPuzzleDoc(puzzleName: string): Promise<firebase.firestore.DocumentData> {
    const puzzleDoc = this.db.firestore.collection('puzzlecodes').doc(puzzleName);
    return puzzleDoc.get().then(doc => {
      if (doc.exists) {
        return Promise.resolve(doc.data());
      } else {
        return Promise.reject('no puzzle doc');
      }
    });
  }
  public getUserDoc(puzzleName: string, user: firebase.User): Promise<firebase.firestore.DocumentData> {
    const puzzleDoc = this.db.firestore.collection('puzzlecodes').doc(puzzleName);
    return puzzleDoc.collection('userstats').doc(user.uid).get().then(doc => {
      if (doc.exists) {
        return doc.data();
      } else {
        return Promise.reject('no user doc');
      }
    });
  }
  public getPuzzleStats(puzzle: Puzzle, puzzleId: number): Promise<firebase.firestore.DocumentData> {
    const codeDocRef = this.db.firestore.collection('puzzlecodes').doc(puzzle.code);
    puzzle.id = this.convertNumberToString(puzzleId);
    return codeDocRef.collection('sizedifs')
        .doc(`${puzzle.size}-${puzzle.dif}`)
          .collection('puzzles').doc(puzzle.id).get().then(doc => {
      if (doc.exists) {
        this.puzzleData = doc.data();
        return Promise.resolve(doc.data());
      } else {
        console.log('puzzle doc doesnt exist' + puzzle.code + `s${puzzle.size}-d${puzzle.dif}` + ' '+puzzle.id);
        return Promise.reject('no puzzle doc');
      }
    });

  }
  public submitTime(user: firebase.User, puzzle: Puzzle, time: number): Promise<any> {
    this.user = user;
    this.time = time;
    this.puzzle = puzzle;
    const codeDocRef = this.db.collection('puzzlecodes').doc(puzzle.code).ref;
    const userCodeDocRef = codeDocRef.collection('userstats').doc(user.uid);
    const difDocRef = codeDocRef.collection('sizedifs').doc(puzzle.size +'-'+puzzle.dif);
    const puzzleDocRef = difDocRef.collection('puzzles').doc(puzzle.id);
    const nextPuzzleDocRef = difDocRef.collection('puzzles').doc(puzzle.nextId);
    const timesDoc = difDocRef.collection('times').doc();
    console.log(puzzle.id + user.uid + ' next: '+puzzle.nextId);
    // first update puzzleDocRef (to get medal and prebestuser) and update difDocRef (to get score (needs median time))
    // then update (prebest)userDifDocRef (q..) and (prebest)userSizeDocRef and (prebest)userDocRef (medals and numbest) and update sizeDocRef (numsolved) en codeDocRef(numsolved)

    // eerste tijd altijd zilver, tweede is zilver of brons, goud mogelijk bij 4e tijd, platinum bij 10e tijd, diamand bij 20e tijd.

    return Promise.all([
      nextPuzzleDocRef.get().then(doc => {
        puzzle.nextRepr = doc.data().repr;
        console.log('next: '+puzzle.nextRepr);
      }).catch(e=>console.log('next puzzle is undefined')),
      this.updatePuzzle(puzzleDocRef, difDocRef.collection('times').where('puzzleid', '==', puzzle.id)).catch(e=>console.log('oops'+e.message)),
      timesDoc.set({userid: user.uid, puzzleid: puzzle.id, time: time, timestamp: firebase.firestore.FieldValue.serverTimestamp()}).catch(e=>console.log('oops2'+e.message)),
      this.updateGlobalStats(codeDocRef, difDocRef.collection('times')).catch(e=>console.log('oops3'+e.message))])
      .then(() => {
        console.log('mult: '+this.multiplier+' weight: '+this.weight +' bestuser: '+this.bestuser+' prebestuser: '+ this.prebestuser);
        this.score = Math.round(this.multiplier * this.weight);
        if (this.bestuser !== this.prebestuser && this.prebestuser !== 'nobody') {
          this.lowernumbest(codeDocRef.collection('userstats').doc(this.prebestuser));
        }
        console.log('medal: '+this.medals[this.multiplier - 1] + ' score: '+this.score);
        return this.updateUserStats(userCodeDocRef, difDocRef.collection('times').where('userid', '==', user.uid));
    }).catch(e=>console.log('globalstatserror: ' + e.message));
  }
  private addNumsolved(docRef: firebase.firestore.DocumentReference): Promise<any> {
    return this.db.firestore.runTransaction(transaction => 
      transaction.get(docRef).then(doc => {
        const data = doc.data();
        transaction.update(docRef, {numsolved: data.numsolved + 1});
      }));
  }
  private lowernumbest(docRef:  firebase.firestore.DocumentReference){
    console.log('lowernumbest');
    return this.db.firestore.runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
        const data = doc.data();
        const size = this.puzzle.size;
        const dif = this.puzzle.dif;
        // const dataAllDifs = data[size];
        return transaction.update(docRef, {numbest: data.numbest -1,
        [`${size}.numbest`]: data[size].numbest - 1,
        [`${size}.${dif}.numbest`]: data[size][dif].numbest - 1});
      })
    });
  }
  private updatePuzzle(docRef: firebase.firestore.DocumentReference, query: firebase.firestore.Query): Promise<any> {
    console.log('update puzzle');
    const puzzle = this.puzzle;
    const time = this.time;
    return this.db.firestore.runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
        const data = doc.data();
        data.numsolved++;
        const num = data.numsolved;
        this.prebestuser = data.bestuser;
        data.bestuser = time <= data.best ? this.user.uid : data.bestuser;
        data.best = Math.min(time, data.best);
        this.best = data.best;
        this.bestuser = data.bestuser;
        data.q50.c += time < data.q50.t ? 10 : (time === data.q50.t ? 0 : -10);
        data.q75.c += time < data.q75.t ? 5 : (time === data.q75.t ? 0 : -15);
        data.q25.c += time < data.q25.t ? 15 : (time === data.q25.t ? 0 : -5);
        data.q10.c += time < data.q10.t ? 18 : (time === data.q10.t ? 0 : -2);
        data.q05.c += time < data.q05.t ? 19 : (time === data.q05.t ? 0 : -1);
        return Promise.all([
          this.updateTimeFlag(num, time, query, data.q05, false, true, 5),
          this.updateTimeFlag(num, time, query, data.q10, false, true, 10),
          this.updateTimeFlag(num, time, query, data.q25, false, true, 25),
          this.updateTimeFlag(num, time, query, data.q50, false, false, 50),
          this.updateTimeFlag(num, time, query, data.q75, true, false, 75)
        ]).then((p) => {
          console.log('timeflags have been updated. Numsolved: '+ data.numsolved);
          if (num >= 20 && time <= data.q05.t) {
            this.multiplier = 6;
          } else if (num >= 10 && time <= data.q10.t) {
            this.multiplier = 5;
          } else if (num === 1 || (num === 2 && time <= data.q50.t) || (num >= 3 && time <= data.q25.t)) {
            this.multiplier = 4;
          } else if (num < 4 || time <= data.q50.t) {
            this.multiplier = 3;
          } else if (time <= data.q75.t) {
            this.multiplier = 2;
          } else {
            this.multiplier = 1;
          }
          this.puzzleData = data;
          return transaction.update(docRef, data);
        }).catch(e=>console.log(e.message));
      });
    });
  }
  private updateGlobalStats(docRef: firebase.firestore.DocumentReference, query: firebase.firestore.Query): Promise<any> {
    console.log('update global stats: '+docRef);
    const time = this.time;
    const size = this.puzzle.size;
    const dif = this.puzzle.dif;
    return this.db.firestore.runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
          console.log('may run mult')
          const data = doc.data();
          data.numsolved++;
          data[size].numsolved++;
          data[size][dif].numsolved++;
          if (data[size][dif].best === 0 || time <= data[size][dif].best) {
            data[size][dif].bestuser = this.user.uid;
            data[size][dif].best = time;
          }
          const q50 = data[size][dif].q50;
          q50.c += time < q50.t ? 10 : (time === q50.t ? 0 : -10);
          return this.updateTimeFlag(data[size][dif].numsolved, time, query, q50, false, false, 50).then(() => {
            data[size][dif].q50 = q50;
            this.weight = q50.t;
            console.log('weight: '+this.weight);
            console.log(JSON.stringify(data));
            return transaction.update(docRef, data);
          }).catch(e=>console.log('oeps4: '+e.message));
        });
      });
  }
  private updateUserStats(docRef: firebase.firestore.DocumentReference, query: firebase.firestore.Query): Promise<void> {
    console.log('update userstats: '+docRef.path);
    const time = this.time;
    const timeFlag = {t:time, c: 0};
    const m = this.multiplier;
    const dif = this.puzzle.dif;
    const size = this.puzzle.size;
    const isBest = this.best === time && this.prebestuser !== this.user.uid;
    return docRef.get().then(doc => {
      if (doc.exists) {
        console.log('updating your puzzlestats');
        let data = doc.data();
        if (data[size] === undefined) {
          console.log('your first score for this size');
          data[size] = {numbest: this.best === time ? 1 : 0,
            numsolved: 1, score: this.score, avgm: m,
            diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
            silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0,
            [dif]: {unsolved: 0, best: time, numbest: isBest ? 1 : 0,
              numsolved: 1, score: this.score, avgm: m, q50: timeFlag, lid: this.puzzle.id,
              diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
              silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0}};
        } else {
          console.log('updating your alldifs stats');
          const temp = data[size];
          const num = temp.numsolved + 1;
          temp.numsolved = num;
          temp.score = temp.score + this.score;
          temp.avgm = (temp.avgm * (num - 1) + m) / num;
          temp.numbest = temp.numbest + (isBest ? 1 : 0);
          temp[this.medals[m - 1]] += 1;
          data[size] = temp;
          if (data[size][dif] === undefined) {
            console.log('your first score for this difficulty');
            data[size][dif] = {unsolved: 0, best: time, numbest: isBest ? 1 : 0,
              numsolved: 1, score: this.score, avgm: m, q50: timeFlag, lid: this.puzzle.id,
              diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
              silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0};
          } else {
            console.log('updating your difficulty stats');
            const temp = data[size][dif];
            const num = temp.numsolved + 1;
            temp.numsolved = num;
            temp.best = time <= temp.best ? time : temp.best;
            temp.q50.c += (time < temp.q50.t ? 20 : (time === temp.q50.t ? 10 : 0));
            temp.score = temp.score + this.score;
            temp.unsolved--;
            temp.avgm = (temp.avgm * (num - 1) + m) / num;
            temp.numbest = temp.numbest + (isBest ? 1 : 0);
            temp[this.medals[m - 1]] += 1;
            data[size][dif] = temp;
          }
        }
        const temp = data;
        temp.numsolved++;
        const num = temp.numsolved;
        temp.score += this.score;
        temp.numbest += isBest ? 1 : 0;
        temp.avgm = (temp.avgm * (num - 1) + m) / num;
        temp[this.medals[m - 1]] += 1;
        data = temp;
        console.log(temp);
        return this.updateTimeFlag(data[size][dif].numsolved, time, query, data[size][dif].q50, false, false, 50).then(() => {
          console.log('personal timeflag updated');
          return docRef.update(data);
        });
      } else { // first time for this kind.
        console.log('create userstats: '+docRef.path+' m: '+m+' time: '+time + 'score:' +this.score);
        const dataSizeDif = {unsolved: 0, best: time, numbest: isBest ? 1 : 0,
          numsolved: 1, score: this.score, avgm: m,
          q50: timeFlag, lid: this.puzzle.id,
          diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
          silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0};
        const superData = {numbest: this.best === time ? 1 : 0,
          numsolved: 1, score: this.score, avgm: m,
          diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
          silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0, [size]: {numbest: this.best === time ? 1 : 0,
            numsolved: 1, score: this.score, avgm: m,
            diamond: m === 6 ? 1 : 0, platinum: m === 5 ? 1 : 0, gold: m === 4 ? 1 : 0,
            silver: m === 3 ? 1 : 0, bronze: m === 2 ? 1 : 0, wood: m === 1 ? 1 : 0, [dif]: dataSizeDif}};
        return docRef.set(superData);
      }
    });
  }
  private updateTimeFlag(num: number, time: number, query: firebase.firestore.Query, q: TimeFlag, goForwardWhenBelow0: boolean, goBackWhenAbove0: boolean, n: number): Promise<void> {
    console.log('updateTimeFlag '+ n);
    if (n === 75) {
      if (num < 3) {
        return Promise.resolve();
      }
      if (num === 3) {
        return query.orderBy('time', 'desc').limit(1).get().then(qs => qs.docs[0]).then(newmeddoc => {
          if (newmeddoc !== undefined) {
            q.t = newmeddoc.data().time;
            q.c = 0;
            console.log('worst time is set: ' +q.t);
          } else {
            console.log('this cannot be new med undefined');
          }
          return Promise.resolve();
        });
      }
    } else if (num < 100 / n) {
      q.t = this.best;
      q.c = 0;
      console.log('timeflag set by best time')
      return Promise.resolve();
    }
    if (q.c <= -20 || (goForwardWhenBelow0 && q.c < 0)) {
      const n = goForwardWhenBelow0 ? -Math.floor(q.c / 20) : Math.floor(Math.abs(q.c / 20));
      const newQuery = query.orderBy('time');
      return newQuery.startAfter(q.t).limit(n).get().then(qs => qs.docs[n - 1]).then(newmeddoc => {
        if (newmeddoc !== undefined) {
          q.t = newmeddoc.data().time;
          q.c = q.c + 20 * n;
        } else {
          console.log('new med undefined');
        }
        console.log('q forward');
        return Promise.resolve();
      });
    } else if (q.c >= 20 || (goBackWhenAbove0 && q.c > 0)) {
      const n = goBackWhenAbove0 ? Math.ceil(q.c / 20) : Math.floor(q.c / 20);
      const newQuery = query.orderBy('time', 'desc');
      return newQuery.startAfter(q.t).limit(n).get().then(qs => qs.docs[n - 1]).then(newmeddoc => {
        if (newmeddoc !== undefined) {
          q.t = newmeddoc.data().time;
          q.c = q.c - 20 * n;
        } else {
          console.log('new med undefined');
        }
        console.log('q backward');
        return Promise.resolve();
      });
    } else {
      console.log('nothing changed');
      return Promise.resolve();
    }
  }
  public convertNumberToString(num: number): string {
    let string: string;
    if (num < 10) {
      string = '000'+num;
    } else if(num < 100){
      string = '00'+num;
    } else if(num < 1000){
      string = '0'+num;
    } else {
      string = ''+num;
    }
    return string;
  }

  public getPuzzleData() {
    return this.puzzleData;
  }
}
export class TimeFlag {
  t: any;
  c: any;
  constructor(t, c) {
    this.t = t;
    this.c = c;
  }
  public toString() {
    return 't: ' + this.t + ', c: '+this.c;
  }
}

import { Injectable } from '@angular/core';
// import { Stats, PuzzleStats, UserStats, GlobalStats, TimeFlag } from './puzzle-stats';
// import { RankingService } from './ranking.service';
// import { PuzzleService } from '../puzzles-home/puzzle.service';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
@Injectable()
export class UserService {
  constructor(private db: AngularFirestore) {}
  public isUsernameAvailable(name:string): Promise<boolean> {
    return this.db.firestore.collection('userstats').where("username", "==", name).get().then(qs => qs.empty);
  }
  public getUserName(uid: string, email: string): Promise<string> {
    return this.db.collection('userstats').doc(uid).ref.get().then(doc => {
      if (doc.exists) {
        return Promise.resolve(doc.data().username);
      } else {
        // let emailSplit = email.split('@');
        // emailSplit[0] = emailSplit[0].replace('.', '');
        // email = emailSplit[0] + '@' + emailSplit[1];

        // return this.db.firestore.collection('userstats').where('email', '==', email).get().then(qs => {
        //   if (!qs.empty) {
        //     return Promise.reject('link accounts');
        //   } else {
            return this.db.collection('userstats').doc(uid).set({username: email, email: email}).then(() => Promise.resolve(email));
          // }
        // })
      }
    })
  }
  public setUserName(uid: string, name: string): Promise<any> {
    return this.db.firestore.collection('userstats').where('username', '==', name).get().then(ds => {
      if (ds.empty) {
        return this.db.collection('userstats').doc(uid).ref.update({username: name}).catch(e => {
          return this.db.collection('userstats').doc(uid).ref.set({username: name});
        });
      } else {
        return Promise.reject('taken');
      }
    })
  }
}

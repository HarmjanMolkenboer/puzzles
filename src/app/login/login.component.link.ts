// import {Component, OnInit, ViewChild} from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
// import { Observable } from 'rxjs';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import * as firebase from 'firebase/app';
// import { UserService } from '../db/user.service';
//
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   // title = 'Home';
//   provider;
//   email: string;
//   password: string;
//   confirmedpassword: string;
//   loggedIn: boolean;
//   verified: boolean;
//   create: boolean;
//   username: string;
//   newusername: string;
//   changeUserName: boolean;
//   changeNameString: string;
//   createstring: string;
//   link: boolean;
//   @ViewChild('signinbutton') signInButton: HTMLButtonElement;
//   @ViewChild('signupbutton') signUpButton: HTMLButtonElement;
//   @ViewChild('verifyemailbutton') verifyEmailButton: HTMLButtonElement;
//   @ViewChild('passwordresetbutton') passwordResetButton: HTMLButtonElement;
//   constructor(private db: AngularFirestore, private userService: UserService) {
//
//   }
//   ngOnInit() {
//     this.createstring = 'Create new account';
//     this.loggedIn = firebase.auth().currentUser !== null;
//     this.create = false;
//     this.link = false;
//     this.changeUserName = false;
//     firebase.auth().getRedirectResult().then(function(result) {
//       if (this.link && result.credential) {
//         // Accounts successfully linked.
//         alert('Your accounts have been linked.');
//         var credential = result.credential;
//         var user = result.user;
//         this.loggedIn = true;
//         // ...
//       }
//     }).catch(function(error) {
//       // Handle Errors here.
//       // ...
//     });
//     firebase.auth().onAuthStateChanged(user => {
//       if (user !== null) {
//         document.getElementById('loginLink').innerHTML = 'My Account';
//         this.userService.getUserName(user.uid, user.email).then(name => this.username = name).catch(e => {
//           alert('You already hava an account with this email address, '
//             + 'please enter the password of that account to link both accounts');
//           this.link = true;
//           this.email = user.email;
//           this.createstring = 'Submit';
//           this.loggedIn = false;
//           return;
//         });
//         if (user.emailVerified) {
//           this.loggedIn = true;
//         }
//         else {
//             user.sendEmailVerification();
//             this.loggedIn = true;
//             alert("Please check your email to verify your account.");
//         }
//       } else {
//         document.getElementById('loginLink').innerHTML = 'Login';
//         this.loggedIn = false;
//         // alert('signed out');
//       }
//     });
//   }
//   changeName() {
//     if (this.changeUserName) {
//       if (this.newusername.includes('@')) {
//         alert('Your new username cannot contain an @');
//         return;
//       } else if (this.newusername.length < 4) {
//         alert('Please enter a new username of more then three characters');
//         return;
//       } else if (this.newusername == this.username) {
//         alert('Your username already is: ' + this.username);
//         return;
//       } else {
//         this.userService.setUserName(firebase.auth().currentUser.uid, this.newusername).then(e => {
//           this.changeUserName = false;
//           this.username = this.newusername;
//           this.newusername = '';
//           document.getElementById('changeNameButton').innerHTML='Change username';
//         }).catch(e => {
//           alert('Username is already taken, please choose another one');
//         });
//       }
//     }else {
//       this.changeUserName = true;
//       document.getElementById('changeNameButton').innerHTML='Submit';
//     }
//   }
//   verifyUserName() {
//
//   }
//   toggleSignIn() {
//     if (firebase.auth().currentUser) {
//       // [START signout]
//       firebase.auth().signOut();
//       // [END signout]
//     } else {
//       let email = this.email;
//       let emailSplit = email.split('@');
//       emailSplit[0] = emailSplit[0].replace('.', '');
//       email = emailSplit[0] + '@' + emailSplit[1];
//
//       const password = this.password;
//       if (email.length < 4) {
//         alert('Please enter an email address.');
//         return;
//       }
//       if (password.length < 4) {
//         alert('Please enter a password.');
//         return;
//       }
//       // Sign in with email and pass.
//       // [START authwithemail]
//       firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // [START_EXCLUDE]
//         if (errorCode === 'auth/wrong-password') {
//           alert('Wrong password.');
//         } else {
//           alert(errorMessage);
//         }
//         console.log(error.code);
//         this.signInButton.disabled = false;
//         // [END_EXCLUDE]
//       });
//       // [END authwithemail]
//     }
//     // this.signInButton.disabled = true;
//   }
//   /**
//    * Handles the sign up button press.
//    */
//   handleSignUp() {
//     let email = this.email;
//     let emailSplit = email.split('@');
//     emailSplit[0] = emailSplit[0].replace('.', '');
//     email = emailSplit[0] + '@' + emailSplit[1];
//     if (this.link) {
//       const provider = new firebase.auth.GoogleAuthProvider();
//       firebase.auth().signInWithEmailAndPassword(email, this.password).catch(error => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // [START_EXCLUDE]
//         if (errorCode === 'auth/wrong-password') {
//           alert('Wrong password.');
//         } else {
//           alert(errorMessage);
//         }
//         console.log(error.code);
//         this.signInButton.disabled = false;
//         // [END_EXCLUDE]
//       }).then(() => firebase.auth().currentUser.linkWithRedirect(provider).catch(error => {
//               alert(error.message);
//             }).then(() => this.link = false)
//       );
//     }
//     else if (this.create) {
//       if (this.password !== this.confirmedpassword) {
//         alert('The passwords don\'t match');
//         return;
//       }
//       const password = this.password;
//       if (email.length < 4) {
//         alert('Please enter an email address.');
//         return;
//       }
//       if (password.length < 4) {
//         alert('Please enter a password.');
//         return;
//       }
//       // Sign in with email and pass.
//       // [START createwithemail]
//       firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
//         this.create = false;
//         this.createstring = "Submit";
//       }).catch(error => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // [START_EXCLUDE]
//         if (errorCode === 'auth/weak-password') {
//           alert('The password is too weak.');
//         } else {
//           alert(errorMessage);
//         }
//         console.log(error);
//         return;
//       // [END_EXCLUDE]
//     });
//     } else {
//       this.create = true;
//       this.createstring = "Submit";
//     }
//   }
//   /**
//    * Sends an email verification to the user.
//    */
//   sendEmailVerification():Promise<any> {
//     console.log('denes')
//     // [START sendemailverification]
//     return firebase.auth().currentUser.sendEmailVerification().catch(error => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // [START_EXCLUDE]
//       if (errorCode === 'auth/invalid-email') {
//         alert(errorMessage);
//       }
//       console.log(error);
//       return Promise.reject;
//     });
//     // [END sendemailverification]
//   }
//   sendPasswordReset() {
//     // var email = document.getElementById('email').value;
//     // [START sendpasswordemail]
//     firebase.auth().sendPasswordResetEmail(this.email).then(function() {
//       // Password Reset Email Sent!
//       // [START_EXCLUDE]
//       alert('Password Reset Email Sent!');
//       // [END_EXCLUDE]
//     }).catch(function(error) {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // [START_EXCLUDE]
//       if (errorCode === 'auth/invalid-email') {
//         alert(errorMessage);
//       } else if (errorCode === 'auth/user-not-found') {
//         alert(errorMessage);
//       }
//       console.log(error);
//       // [END_EXCLUDE]
//     });
//     // [END sendpasswordemail];
//   }
//   /**
//    * initApp handles setting up UI event listeners and registering Firebase auth listeners:
//    *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
//    *    out, and that is where we update the UI.
//    */
//    signInWithGoogle() {
//     this.provider = new firebase.auth.GoogleAuthProvider();
//     this.provider.setCustomParameters({
//      'login_hint': 'user@example.com'
//     });
//     firebase.auth().signInWithRedirect(this.provider);
//     firebase.auth().getRedirectResult().then(result => {
//       if (result.credential) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         const token = result.credential.accessToken;
//         // ...
//       }
//       // The signed-in user info.
//       const user = result.user;
//     }).catch(function(error) {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       const credential = error.credential;
//       // ...
//       console.log(error.message);
//     });
//   }
//   signOut() {
//     return firebase.auth().signOut();
//   }
//     // firebase.auth().onIdTokenChanged
//     // Listening for auth state changes.
//     // [START authstatelistener]
//     // firebase.auth().onAuthStateChanged(user => {
//     //   // [START_EXCLUDE silent]
//     //   this.verifyEmailButton.disabled = true;
//     //   // [END_EXCLUDE]
//     //   if (user) {
//     //     // User is signed in.
//     //     const displayName = user.displayName;
//     //     const email = user.email;
//     //     const emailVerified = user.emailVerified;
//     //     const photoURL = user.photoURL;
//     //     const isAnonymous = user.isAnonymous;
//     //     const uid = user.uid;
//     //     const providerData = user.providerData;
//     //     // [START_EXCLUDE]
//     //     document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//     //     document.getElementById('quickstart-sign-in').textContent = 'Sign out';
//     //     document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
//     //     if (!emailVerified) {
//     //       this.verifyEmailButton.disabled = false;
//     //     }
//     //     // [END_EXCLUDE]
//     //   } else {
//     //     // User is signed out.
//     //     // [START_EXCLUDE]
//     //     document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//     //     document.getElementById('quickstart-sign-in').textContent = 'Sign in';
//     //     document.getElementById('quickstart-account-details').textContent = 'null';
//     //     // [END_EXCLUDE]
//     //   }
//     //   // [START_EXCLUDE silent]
//     //   this.signInButton.disabled = false;
//     //   // [END_EXCLUDE]
//     // });
//     // [END authstatelistener]
//     // document.getElementById('quickstart-sign-in').addEventListener('click', this.toggleSignIn, false);
//     // document.getElementById('quickstart-sign-up').addEventListener('click', this.handleSignUp, false);
//     // document.getElementById('quickstart-verify-email').addEventListener('click', this.sendEmailVerification, false);
//     // document.getElementById('quickstart-password-reset').addEventListener('click', this.sendPasswordReset, false);
// }

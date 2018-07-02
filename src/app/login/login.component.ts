import {Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserService } from '../db/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // @ViewChild('usernameTextField') usernameTF: HTMLElement;
  // @ViewChild('usernameDanger') usernameDanger: HTMLElement;
  //
  // title = 'Home';
  provider;
  email = "";
  password = "";
  confirmpassword = "";
  username = "";
  name = "";
  submitted = false;
  loggedIn: boolean;
  verify: boolean;
  create: boolean;
  // @ViewChild('signinbutton') signInButton: HTMLButtonElement;
  // @ViewChild('signupbutton') signUpButton: HTMLButtonElement;
  // @ViewChild('verifyemailbutton') verifyEmailButton: HTMLButtonElement;
  // @ViewChild('passwordresetbutton') passwordResetButton: HTMLButtonElement;
  constructor(private db: AngularFirestore, private userService: UserService) {}
  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
   ngOnInit() {
    //  this.usernameTF.style.display = 'none';
    //  this.usernameDanger.style.display = 'none';
     firebase.auth().getRedirectResult().then(function(result) {
       if (this.verify && result.credential) {
         // Accounts successfully linked.
         alert('Your account has been activated.');
         var credential = result.credential;
         var user = result.user;
         this.loggedIn = true;
         // ...
       }
     }).catch(function(error) {
       // Handle Errors here.
       // ...
     });
     firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
         document.getElementById('loginLink').innerHTML = 'My Account';
         this.userService.getUserName(user.uid, user.email).then(name => this.username = name).catch(e => {
          //  alert('You already hava an account with this email address, '
          //    + 'please enter the password of that account to link both accounts');
           this.email = user.email;
           this.loggedIn = false;
           return;
         });
         if (user.emailVerified) {
           this.loggedIn = true;
         }
         else {
             user.sendEmailVerification();
             this.loggedIn = true;
             this.verify = true;
             alert("Please check your email to verify your account.");
         }
           if (user.emailVerified) {
             alert('You have successfully logged in.');
           }
           else {
               user.sendEmailVerification();
               alert("Please check your email to verify your account.");
           }
       } else {
          //  alert('signed out');
       }
     });
   }
   onSubmit() {
     if (!this.create) {
       const email = this.email;
       const password = this.password;
       if (email.length < 4) {
         alert('Please enter an email address.');
         return;
       }
       if (password.length < 4) {
         alert('Please enter a password.');
         return;
       }
       // Sign in with email and pass.
       // [START authwithemail]
       firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
         // Handle Errors here.
         const errorCode = error.code;
         const errorMessage = error.message;
         // [START_EXCLUDE]
         if (errorCode === 'auth/wrong-password') {
           alert('Wrong password.');
         } else {
           alert(errorMessage);
         }
         console.log(error.code);
         this.signInButton.disabled = false;
         // [END_EXCLUDE]
       });
     } else {
       const username = this.username;
       const email = this.email;
       const password = this.password;
       const confirmpassword = this.confirmpassword;
       if (password != confirmpassword) {
         alert('Passwords don\'t match');
         return;
       }
       this.userService.isUsernameAvailable(username).then(availabe => {
         if(!availabe) {
           alert('Username already in use');
         } else {
           firebase.auth().createUserWithEmailAndPassword(email, password)
             .then(() => {
               this.userService.setUserName(firebase.auth().currentUser.uid, this.username).then(e => {
             })
           })
           .catch(function(error) {
             // Handle Errors here.
             const errorCode = error.code;
             const errorMessage = error.message;
             // [START_EXCLUDE]
             if (errorCode === 'auth/weak-password') {
               alert('The password is too weak.');
             } else {
               alert(errorMessage);
             }
             console.log(error);
             // [END_EXCLUDE]
           });
         }
       });
     }
   }

  /**
   * Handles the sign up button press.
   */
  handleSignUp() {
    this.create=true;
  }
  cancelSignUp() {
    this.create = false;
  }
  sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }
  sendPasswordReset() {
    // var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(this.email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode === 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
   signInWithGoogle() {
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.setCustomParameters({
     'login_hint': 'user@example.com'
    });
    firebase.auth().signInWithRedirect(this.provider);
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      const user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }
  signOut() {
    return firebase.auth().signOut().then(() => {
        alert('You have successfully signed out');
        this.loggedIn = false;
      });
  }

  changeName() {
    const name = this.name;
    if (name.includes('@')) {
      alert('Your new username cannot contain an @');
      return;
    } else if (name.length < 4) {
      alert('Please enter a username of more then three characters');
      return;
    } else if (name == this.username) {
      alert('Your username already is: ' + this.username);
      return;
    } else {
      this.userService.setUserName(firebase.auth().currentUser.uid, name).then(e => {
        this.username = name;
        document.getElementById('changeNameButton').innerHTML='Change username';
      }).catch(e => {
        alert('Username is already taken, please choose another one');
      });
    }
  }
}

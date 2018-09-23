// import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule} from '@angular/forms';

import { AngularFireModule} from 'angularfire2';
import { AngularFirestoreModule} from 'angularfire2/firestore';
import { environment} from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { PuzzleStatsService } from './db/puzzle-stats.service';
import { UserService } from './db/user.service';
// import { RankingService } from './db/ranking.service';
import { PuzzleService } from './puzzles-home/puzzle.service';
import { DrawingsService } from './puzzle/drawings.service';
// import { Puzzle } from './puzzle/model/model.puzzle';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RankingsComponent } from './rankings/rankings.component';
import { LoginComponent } from './login/login.component';
import { PuzzlesHomeComponent } from './puzzles-home/puzzles-home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { PuzzletimePipe } from './puzzletime.pipe';
import { DifficultyPipe } from './difficulty.pipe';
import { PuzzlesizePipe } from './puzzlesize.pipe';
import { MedalPipe } from './medal.pipe';
import { PuzzlenamePipe } from './puzzlename.pipe';
import { PlayComponent } from './puzzle/play/play.component';
import { ControlPanelComponent } from './puzzle/control-panel/control-panel.component';
// import { ResultPanelComponent } from './puzzle/result-panel/result-panel.component';
import { GridComponent } from './puzzle/grid/grid.component';
// const puzzles=['battleship', 'tents'];
const appRoutes: Routes = [
  { path: 'play', component: PlayComponent},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: ':puzzle-name', component: PuzzlesHomeComponent},
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RankingsComponent,
    LoginComponent,
    PageNotFoundComponent,
    PuzzlesHomeComponent,
    PuzzletimePipe,
    DifficultyPipe,
    PuzzlesizePipe,
    MedalPipe,
    PuzzlenamePipe,
    PlayComponent,
    ControlPanelComponent,
    // ResultPanelComponent,
    GridComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes, {useHash: false}
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    // ServiceWorkerModule.register('/ngsw-worker.js', {
    //   enabled: environment.production
    // }),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    AngularFireAuthModule
  ],
  exports: [ RouterModule],
  providers: [PuzzleStatsService, PuzzleService, DrawingsService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

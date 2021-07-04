import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightsComponent } from './flights/flights.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TripsComponent } from './trips/trips.component';
import { UserDetailsComponent } from './users/user-details.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserDetailsComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trips/:id', component: TripsComponent }, //Get User Trips [ADMIN]
  { path: 'trips/:id/flights', component: FlightsComponent },
  { path: 'flights', component: FlightsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

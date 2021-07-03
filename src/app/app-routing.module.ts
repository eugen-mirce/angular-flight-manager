import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { FlightsComponent } from './flights/flights.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TripsComponent } from './trips/trips.component';
import { UserDetailsComponent } from './users/user-details.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserDetailsComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trips/:id', component: TripsComponent }, //Get User Trips [ADMIN]
  { path: 'trips/:id/flights', component: FlightsComponent },
  { path: 'flights', component: FlightsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

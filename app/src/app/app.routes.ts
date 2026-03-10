import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { HomeComponent } from './home';
import { LoginComponent } from './login';

export const routes: Routes = [

    {
        path: '',
        pathMatch: "full",
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }

];

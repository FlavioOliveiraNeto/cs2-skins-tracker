import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    {
        path: 'home',
        component: LayoutComponent,
    },
    /*{
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },*/
    {
        path: '**',
        component: LoginComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

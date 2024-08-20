import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SkinComponent } from './components/skin/skin.component';

export const routes: Routes = [
    /*{
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },*/
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'home',
        component: LayoutComponent,
    },
    {
        path: 'skin/:skin_id',
        component: SkinComponent,
    },
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

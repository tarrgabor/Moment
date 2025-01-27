import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PostComponent } from './components/post/post.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RestorePasswordComponent } from './components/restore-password/restore-password.component';

export const routes: Routes = [
    {
        path: "login", component: LoginComponent
    },
    {
        path: "registration", component: RegistrationComponent
    },
    {
        path: "posts", component: PostComponent
    },
    {
        path: "forgot", component: ForgotPasswordComponent
    },
    {
        path: "restore", component: RestorePasswordComponent
    },
    {
        path: "", redirectTo: "login", pathMatch: "full"
    },
    {
        path: "**", component: PageNotFoundComponent
    }
];

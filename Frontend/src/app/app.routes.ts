import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RestorePasswordComponent } from './components/restore-password/restore-password.component';
import { UserAuthGuard } from './guards/user-auth-guard';
import { MainPageComponent } from './components/main-page/main-page.component';
import { OpenPostComponent } from './components/open-post/open-post.component';
import { UploadPostComponent } from './components/upload-post/upload-post.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // Possible pages to visit before logging in
    {
        path: "login", component: LoginComponent, canActivate: [LoginGuard]
    },
    {
        path: "registration", component: RegistrationComponent, canActivate: [LoginGuard]
    },
    {
        path: "forgot", component: ForgotPasswordComponent, canActivate: [LoginGuard]
    },
    {
        path: "restore", component: RestorePasswordComponent, canActivate: [LoginGuard]
    },
    {
        path: "postupload", component: UploadPostComponent, canActivate: [UserAuthGuard]
    },
    {
        path: "admin", component: AdminPageComponent, canActivate: [UserAuthGuard, AdminGuard]
    },

    // Possible pages to visit after logging in
    {
        path: "", component: MainPageComponent, canActivate: [UserAuthGuard]
    },
    {
        path: "post/:id", component: OpenPostComponent, canActivate: [UserAuthGuard]
    },
    {
        path: "post/:id/:postTitle", component: OpenPostComponent, canActivate: [UserAuthGuard]
    },
    {
        path: "user/:username", component: ProfileComponent, canActivate: [UserAuthGuard]
    },

    // Not valid page entered
    {
        path: "**", component: PageNotFoundComponent
    }
];

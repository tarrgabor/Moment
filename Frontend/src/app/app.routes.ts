import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RestorePasswordComponent } from './components/restore-password/restore-password.component';
import { UserAuthGuard } from './guards/user-auth-guard';
import { MainPageComponent } from './components/main-page/main-page.component';
import { VerificationCodeComponent } from './components/verification-code/verification-code.component';
import { OpenPostComponent } from './components/open-post/open-post.component';

export const routes: Routes = [
    // Possible pages to visit before logging in
    {
        path: "login", component: LoginComponent
    },
    {
        path: "registration", component: RegistrationComponent
    },
    {
        path: "forgot", component: ForgotPasswordComponent
    },
    {
        path: "restore", component: RestorePasswordComponent
    },
    {
        path: "verification", component: VerificationCodeComponent
    },

    {
        path: "postpage", component: OpenPostComponent
    },
    
    // Possible pages to visit after logging in
    {
        path: "", component: MainPageComponent, canActivate: [UserAuthGuard]
    },

    // Not valid page entered
    {
        path: "**", component: PageNotFoundComponent
    }
];

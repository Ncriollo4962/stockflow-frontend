import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const authroutes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{
				path: 'login',
				loadComponent: () =>
					import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
			},
			{
				path: 'register',
				loadComponent: () =>
					import('./pages/register-page/register-page.component').then(
						(m) => m.RegisterPageComponent
					),
			},
			{
				path: '**',
				redirectTo: 'login',
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];

export default authroutes;

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard-page/dashboard-page.component'),
        children: [
            {
                path: 'search',
                loadComponent: () => import('./pages/search-page/search-page.component')
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    }
];

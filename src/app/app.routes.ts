import { Routes } from '@angular/router';
// import { AboutComponent } from './components/pages/about/about.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { Login } from './components/pages/login/login';
import { Index } from './components/pages/index';
import { Calculator } from './components/pages/calculator/calculator';

export const routes: Routes = [
  // { path: '', component: Index }, // 🎯 หน้าแรก (localhost:4200)
  // { path: 'about', component: AboutComponent }, // 🎯 /home
  { path: 'login', component: Login }, // 🎯 /home
  { path: 'index2', component: Index }, // 🎯 /home
  { path: 'calculator', component: Calculator }, // 🎯 /home
  { path: '**', redirectTo: '' }, // 🎯 หน้าอื่นๆ redirect มาหน้าแรก
];

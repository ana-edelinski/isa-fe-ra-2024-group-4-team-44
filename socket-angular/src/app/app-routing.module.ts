import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocketComponent } from './components/socket/socket.component';
import { LocationMessageComponent } from './location-message/location-message.component';

const routes: Routes = [
  { path: '', component: SocketComponent, pathMatch: 'full' },
  { path: 'location', component: LocationMessageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

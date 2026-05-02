import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [Header, RouterOutlet, Footer],
  // imports : [RouterModule.forRoot(routes, { useHash: true })]
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('world-watches');
  
}

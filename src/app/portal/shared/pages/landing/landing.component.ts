import { Component } from '@angular/core'
import { LandingHeroComponent } from './sections/landing-hero/landing-hero.component'

@Component({
  selector: 'gow-landing-page',
  imports: [LandingHeroComponent],
  templateUrl: './landing.component.html'
})
export class LandingPageComponent {}

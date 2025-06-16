import { Component } from '@angular/core'

import { LandingHeroComponent } from './ui/landing-hero/landing-hero.component'

@Component({
  selector: 'gow-landing-page',
  imports: [LandingHeroComponent],
  templateUrl: './landing.component.html'
})
export class LandingPageComponent {}

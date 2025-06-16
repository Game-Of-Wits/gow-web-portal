import { Component } from '@angular/core'

import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'gow-landing-hero',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './landing-hero.component.html'
})
export class LandingHeroComponent {}

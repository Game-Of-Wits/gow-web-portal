import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'

import { LucideAngularModule, User } from 'lucide-angular';

@Component({
  selector: 'gow-landing-hero',
  imports: [ButtonModule, RippleModule, RouterLink, LucideAngularModule],
  templateUrl: './landing-hero.component.html',
})
export class LandingHeroComponent {
  public readonly SignInIcon = User
}

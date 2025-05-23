import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ButtonModule } from "primeng/button";

import { LucideAngularModule, User } from 'lucide-angular'

@Component({
  imports: [ButtonModule, RouterLink, LucideAngularModule],
  selector: 'gow-landing-header',
  templateUrl: './landing-header.component.html'
})
export class LandingHeaderComponent {
  public readonly SignInIcon = User
}

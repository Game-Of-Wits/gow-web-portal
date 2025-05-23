import { Component } from "@angular/core";

import { CardModule } from "primeng/card";

import { LucideAngularModule, SquareCheckBig } from "lucide-angular";

@Component({
  selector: 'gow-landing-showcase',
  imports: [CardModule, LucideAngularModule],
  templateUrl: './landing-showcase.component.html'
})
export class LandingShowcaseComponent {
  public readonly CheckIcon = SquareCheckBig
}

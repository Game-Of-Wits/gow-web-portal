import { Component } from "@angular/core";

import { LandingFeaturesComponent } from "./ui/landing-features/landing-features.component";
import { LandingFooterComponent } from "./ui/landing-footer/landing-footer.component";
import { LandingHeaderComponent } from "./ui/landing-header/landing-header.component";
import { LandingHeroComponent } from "./ui/landing-hero/landing-hero.component";
import { LandingShowcaseComponent } from "./ui/landing-showcase/landing-showcase.component";

@Component({
	selector: "gow-landing-page",
	imports: [
		LandingHeaderComponent,
		LandingHeroComponent,
		LandingFeaturesComponent,
		LandingShowcaseComponent,
		LandingFooterComponent,
	],
	templateUrl: "./landing-page.component.html",
})
export class LandingPageComponent {}

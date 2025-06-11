import { Component } from "@angular/core";

import { LucideAngularModule } from "lucide-angular";

@Component({
	selector: "gow-landing-footer",
	imports: [LucideAngularModule],
	templateUrl: "./landing-footer.component.html",
})
export class LandingFooterComponent {
	public currentYear = new Date().getFullYear();
}

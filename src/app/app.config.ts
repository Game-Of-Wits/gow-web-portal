import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import {
	ScreenTrackingService,
	UserTrackingService,
	getAnalytics,
	provideAnalytics,
} from "@angular/fire/analytics";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { getFunctions, provideFunctions } from "@angular/fire/functions";
import { getMessaging, provideMessaging } from "@angular/fire/messaging";
import { getStorage, provideStorage } from "@angular/fire/storage";

import { providePrimeNG } from "primeng/config";

import { routes } from "./app.routes";

import { environment } from "../environments/environment";

import { GowTheme } from "./theme/theme";

export const appConfig: ApplicationConfig = {
	providers: [
		// Angular
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimationsAsync(),
		provideHttpClient(withFetch()),

		// PrimeNG
		providePrimeNG({
			theme: {
				preset: GowTheme,
				options: {
					prefix: "p",
					darkModeSelector: false,
					cssLayer: {
						name: "primeng",
						order: "theme, base, primeng",
					},
				},
			},
		}),

		// Firebase
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideAnalytics(() => getAnalytics()),
		ScreenTrackingService,
		UserTrackingService,
		provideFirestore(() => getFirestore()),
		provideDatabase(() => getDatabase()),
		provideFunctions(() => getFunctions()),
		provideMessaging(() => getMessaging()),
		provideStorage(() => getStorage()),
	],
};

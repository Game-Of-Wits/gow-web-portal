import { provideHttpClient, withFetch } from '@angular/common/http'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { getDatabase, provideDatabase } from '@angular/fire/database'
import { provideFirestore } from '@angular/fire/firestore'
import { getFunctions, provideFunctions } from '@angular/fire/functions'
import { getMessaging, provideMessaging } from '@angular/fire/messaging'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { initializeFirestore } from '@firebase/firestore'
import { provideStore } from '@ngrx/store'
import { providePrimeNG } from 'primeng/config'
import { GoWTheme } from '~/shared/theme'
import { environment } from '../environments/environment'
import { routes } from './app.routes'

const app = initializeApp({
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  measurementId: environment.firebase.measurementId
})

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore(),
    providePrimeNG({
      theme: {
        preset: GoWTheme,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    provideFirebaseApp(() => app),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => initializeFirestore(app, {})),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions(app, 'us-central1')),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage())
  ]
}

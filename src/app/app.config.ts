import { provideHttpClient, withFetch } from '@angular/common/http'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaV3Provider
} from '@angular/fire/app-check'
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
import { setLogLevel } from 'firebase/app'
import { providePrimeNG } from 'primeng/config'
import { GoWTheme } from '~/shared/theme'
import { environment } from '../environments/environment'
import { routes } from './app.routes'

if (!environment.production) {
  setLogLevel('debug')
}

const app = initializeApp(environment.firebase)

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
    provideFirestore(() => {
      const app = initializeApp(environment.firebase)
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true
      })
    }),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    provideAppCheck(() => {
      const appCheck = initializeAppCheck(undefined, {
        provider: new ReCaptchaV3Provider(environment.reCAPTCHAKey),
        isTokenAutoRefreshEnabled: true
      })

      if (!environment.production)
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true

      return appCheck
    })
  ]
}

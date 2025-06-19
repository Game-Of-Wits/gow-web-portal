import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public getValue(key: string): string | null {
    return window.localStorage.getItem(key)
  }

  public setValue(key: string, value: string): void {
    window.localStorage.setItem(key, value)
  }

  public removeValue(key: string): void {
    window.localStorage.removeItem(key)
  }
}

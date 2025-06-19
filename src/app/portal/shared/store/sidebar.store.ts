import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'

type SidebarState = {
  isOpen: boolean
}

const initialState: SidebarState = {
  isOpen: window.localStorage.getItem('open-sidebar') === 'true'
}

export const SidebarStateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    toggle(): void {
      patchState(store, ({ isOpen }) => ({ isOpen: !isOpen }))
    }
  }))
)

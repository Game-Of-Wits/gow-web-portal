import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'

type SidebarState = {
  isClose: boolean
}

const initialState: SidebarState = {
  isClose: window.localStorage.getItem('close-sidebar') === null
}

export const SidebarStateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    toggle(): void {
      patchState(store, ({ isClose: isClose }) => ({ isClose: !isClose }))
    }
  }))
)

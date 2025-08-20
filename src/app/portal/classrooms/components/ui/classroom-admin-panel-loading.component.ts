import { Component } from '@angular/core'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'gow-classroom-admin-panel-loading',
  template: `
  <section class="flex justify-center mt-[280px]">
    <div class="flex flex-col items-center gap-3">
      <p-progress-spinner
        ariaLabel="loading"
        strokeWidth="5"
        [style]="{ width: '42px', height: '42px' }"
      ></p-progress-spinner>
      <p class="text-lg text-gray-500">Cargando...</p>
    </div>
  </section>
  `,
  imports: [ProgressSpinnerModule]
})
export class ClassroomAdminPanelLoadingComponent {}

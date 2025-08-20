import { Component, input } from '@angular/core'

@Component({
  selector: 'gow-section-title',
  imports: [],
  template: `
    <div class="flex flex-col gap-[6px]">
      <div class="flex gap-3 items-center">
        <h2 class="text-2xl leading-none font-bold {{ colors[color()].title }}">
          <ng-content></ng-content>
        </h2>

        <ng-content select="[actions]" />
      </div>

      <div class="content-[''] h-1 rounded-2xl {{ colors[color()].underline }}"></div>
    </div>
  `
})
export class SectionTitleComponent {
  readonly colors: { [color: string]: { title: string; underline: string } } = {
    primary: {
      title: 'text-primary-500',
      underline: 'bg-primary-100'
    },
    danger: {
      title: 'text-danger-500',
      underline: 'bg-primary-100'
    }
  }

  public color = input<string>('primary', { alias: 'color' })
}

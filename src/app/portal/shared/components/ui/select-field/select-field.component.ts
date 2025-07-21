import { Component, forwardRef, input, signal } from '@angular/core'
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { SelectChangeEvent, SelectModule } from 'primeng/select'
import { gowThemeConfig } from '~/shared/theme'
import { InputFocusColor } from '~/shared/types/InputFocusColor'
import type { SelectOption } from '~/shared/types/SelectOption'

@Component({
  selector: 'gow-select-field',
  templateUrl: './select-field.component.html',
  styles: `
    .p-focus {
      border-color: var(--focus-color);
      box-shadow: var(--p-select-focus-ring-shadow);
      outline: var(--p-select-focus-ring-width) var(--p-select-focus-ring-style) var(--p-select-focus-ring-color);
      outline-offset: var(--p-select-focus-ring-offset);
    }
  `,
  imports: [SelectModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true
    }
  ]
})
export class SelectFieldComponent implements ControlValueAccessor {
  public readonly focusColorMap: Record<InputFocusColor, string> = {
    danger: gowThemeConfig.semantic.danger[500],
    primary: gowThemeConfig.semantic.primary[500],
    success: gowThemeConfig.semantic.success[500],
    info: gowThemeConfig.semantic.info[500],
    warning: gowThemeConfig.semantic.warning[500]
  }

  public selectOptions = input.required<SelectOption[]>({ alias: 'options' })
  public selectLabel = input.required<string>({
    alias: 'label'
  })
  public selectPlaceholder = input.required<string>({
    alias: 'placeholder'
  })
  public focusColor = input<InputFocusColor>('primary', {
    alias: 'focusColor'
  })
  public selectDisabled = input<boolean>(false, {
    alias: 'disabled'
  })
  public enableClearButton = input<boolean>(true, {
    alias: 'enableClear'
  })
  public emptyMessage = input<string>('Vacio', {
    alias: 'emptyMessage'
  })
  public selectVirtualScroll = input<boolean>(false, {
    alias: 'virtualScroll'
  })
  public selectVirtualScrollItemSize = input<number>(0, {
    alias: 'virtualScrollItemSize'
  })
  public selectScrollHeight = input<number>(100, {
    alias: 'scrollHeight'
  })
  public isLoading = input<boolean>(false, { alias: 'isLoading' })

  public value = signal<SelectOption | null>(null)

  onChange: (value: string) => void = () => {}
  onTouched: () => void = () => {}

  public writeValue(code: string): void {
    const selected = this.selectOptions().find(opt => opt.code === code) || null
    this.value.set(selected)
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  public handleSelectChange(event: SelectChangeEvent) {
    const selected: SelectOption = event.value
    this.value.set(selected)
    this.onChange(selected?.code ?? '')
    this.onTouched()
  }
}

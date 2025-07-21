import { Component, forwardRef, input, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { KeyFilterModule } from 'primeng/keyfilter'
import { InputFocusColor } from '~/shared/types/InputFocusColor'

type NumberFieldType = 'int' | 'num' | 'money' | 'hex' | 'alpha' | 'alphanum'

@Component({
  selector: 'gow-number-field',
  templateUrl: './number-field.component.html',
  imports: [InputTextModule, KeyFilterModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true
    }
  ]
})
export class NumberFieldComponent implements ControlValueAccessor {
  public readonly focusColorMap: Record<InputFocusColor, string> = {
    danger: 'focus:border-danger-500',
    primary: 'focus:border-primary-500',
    success: 'focus:border-success-500',
    info: 'focus:border-info-500',
    warning: 'focus:border-warning-500'
  }

  public inputType = input<NumberFieldType>('int', {
    alias: 'type'
  })
  public inputFocusColor = input<InputFocusColor>('primary', {
    alias: 'focusColor'
  })
  public inputLabel = input<string>('', {
    alias: 'label'
  })
  public inputPlaceholder = input<string>('', {
    alias: 'placeholder'
  })
  public inputDisabled = input<boolean>(false, {
    alias: 'disabled'
  })

  value = signal<number>(0)

  onChange = (_value: number) => {}
  onTouched = () => {}

  writeValue(value: number): void {
    this.value.set(value)
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  handleInput(event: Event) {
    const newValue = Number((event.target as HTMLInputElement).value)
    this.value.set(newValue)
    this.onChange(newValue)
    this.onTouched()
  }
}

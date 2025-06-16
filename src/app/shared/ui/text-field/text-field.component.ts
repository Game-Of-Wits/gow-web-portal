import { Component, forwardRef, input, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'

import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'gow-text-field',
  imports: [InputTextModule, LucideAngularModule, ButtonModule],
  templateUrl: './text-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ]
})
export class TextFieldComponent implements ControlValueAccessor {
  public visiblePasswordIcon = Eye
  public passwordIconNotVisible = EyeOff

  public inputId = input.required<string>({
    alias: 'id'
  })
  public inputType = input<'text' | 'password' | 'email'>('text', {
    alias: 'type'
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

  value = signal<string>('')
  passwordVisible = false

  onChange = (_value: string) => {}
  onTouched = () => {}

  showPasswordToggle = () => {
    this.passwordVisible = !this.passwordVisible
  }

  writeValue(value: string): void {
    this.value.set(value || '')
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  handleInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value
    this.value.set(newValue)
    this.onChange(newValue)
    this.onTouched()
  }
}

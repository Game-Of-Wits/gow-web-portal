import { Component, forwardRef, input, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { InputFocusColor } from '~/shared/types/InputFocusColor'

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
  public readonly visiblePasswordIcon = Eye
  public readonly passwordIconNotVisible = EyeOff
  public readonly focusColorMap: Record<InputFocusColor, string> = {
    danger: 'focus:border-danger-500',
    primary: 'focus:border-primary-500',
    success: 'focus:border-success-500',
    info: 'focus:border-info-500',
    warning: 'focus:border-warning-500'
  }

  public focusColor = input<InputFocusColor>('primary', {
    alias: 'focusColor'
  })
  public inputType = input<'text' | 'password' | 'email'>('text', {
    alias: 'type'
  })
  public inputMaxLength = input<number | null>(null, {
    alias: 'maxLength'
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

  public showPasswordToggle = () => {
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

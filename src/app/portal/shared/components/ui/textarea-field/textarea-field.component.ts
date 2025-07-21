import { Component, forwardRef, input, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { LucideAngularModule } from 'lucide-angular'
import { TextareaModule } from 'primeng/textarea'
import { InputFocusColor } from '~/shared/types/InputFocusColor'

@Component({
  selector: 'gow-textarea-field',
  templateUrl: './textarea-field.component.html',
  imports: [TextareaModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFieldComponent),
      multi: true
    }
  ]
})
export class TextareaFieldComponent implements ControlValueAccessor {
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
  public textareaLabel = input<string>('', {
    alias: 'label'
  })
  public textareaRows = input<number>(3, {
    alias: 'rows'
  })
  public textareaPlaceholder = input<string>('', {
    alias: 'placeholder'
  })
  public textareaDisabled = input<boolean>(false, {
    alias: 'disabled'
  })
  public enableAutoResize = input<boolean>(false, {
    alias: 'autoResize'
  })

  value = signal<string>('')

  onChange = (_value: string) => {}
  onTouched = () => {}

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

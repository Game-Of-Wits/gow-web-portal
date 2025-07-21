import { Component, effect, forwardRef, input, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { LucideAngularModule, Palette } from 'lucide-angular'
import { getContrastColor } from '~/shared/utils/getContrastColor'

@Component({
  selector: 'gow-level-primary-color-picker',
  templateUrl: './level-primary-color-picker.component.html',
  imports: [LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LevelPrimaryColorPickerComponent),
      multi: true
    }
  ]
})
export class LevelPrimaryColorPickerComponent implements ControlValueAccessor {
  public readonly paletteIcon = Palette

  public size = input<number>(140, { alias: 'size' })
  public inputDisabled = input<boolean>(false, {
    alias: 'disabled'
  })

  value = signal<string>('#ffffff')
  contrastColorText = signal<string>('#000000')

  constructor() {
    effect(() => {
      this.contrastColorText.set(getContrastColor(this.value()))
    })
  }

  onChange = (_value: string) => {}
  onTouched = () => {}

  writeValue(value: string): void {
    this.value.set(value)
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

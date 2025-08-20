import { Component, forwardRef, input, OnDestroy, signal } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Image, LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'gow-image-preview-field',
  templateUrl: './image-preview-field.component.html',
  imports: [LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePreviewFieldComponent),
      multi: true
    }
  ],
  standalone: true
})
export class ImagePreviewFieldComponent
  implements ControlValueAccessor, OnDestroy
{
  public readonly imageIcon = Image

  previewImage = signal<string>('')

  public inputLabel = input<string>('Seleccionar imagen', { alias: 'label' })
  public inputDisabled = input<boolean>(false, { alias: 'disabled' })

  public value: File | null = null
  private objectUrl: string | null = null

  onChange = (_value: File | null) => {}
  onTouched = () => {}

  writeValue(value: string | null): void {
    this.revokeObjectUrl()
    if (value) {
      this.previewImage.set(value)
    } else {
      this.previewImage.set('')
    }
    this.value = null
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const file = input.files[0]
    if (!file.type.match(/image\/(png|jpeg)/)) {
      alert('Solo se permiten imágenes PNG o JPEG')
      return
    }

    this.value = file
    this.revokeObjectUrl()
    this.objectUrl = URL.createObjectURL(file)

    this.previewImage.set(this.objectUrl)
    this.onChange(file)
    this.onTouched()

    input.value = ''
  }

  private revokeObjectUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl)
      this.objectUrl = null
    }
  }

  ngOnDestroy() {
    this.revokeObjectUrl()
  }
}

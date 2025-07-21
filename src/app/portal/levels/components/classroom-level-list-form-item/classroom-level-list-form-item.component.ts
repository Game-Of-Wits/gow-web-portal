import { Component, Input, input, OnInit, output, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Sparkle, Trash2 } from 'lucide-angular'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { getContrastColor } from '~/shared/utils/getContrastColor'

@Component({
  selector: 'gow-classroom-level-list-form-item',
  templateUrl: './classroom-level-list-form-item.component.html',
  imports: [LucideAngularModule]
})
export class ClassroomLevelListFormItemComponent implements OnInit {
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2
  public readonly levelIcon = Sparkle

  @Input() levelForm!: FormGroup<LevelForm>
  public levelPosition = input.required<number>({ alias: 'position' })

  public contrastColor = signal('#ffffff')

  ngOnInit(): void {
    this.contrastColor.set(
      getContrastColor(this.levelForm.getRawValue().primaryColor)
    )
  }

  public onDelete = output<number>({ alias: 'delete' })

  public onDeleteForm() {
    this.onDelete.emit(this.levelPosition())
  }
}

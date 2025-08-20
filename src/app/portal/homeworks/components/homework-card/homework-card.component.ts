import { NgOptimizedImage } from '@angular/common'
import { Component, input } from '@angular/core'
import { CardModule } from 'primeng/card'
import { HomeworkModel } from '~/homeworks/models/Homework.model'

@Component({
  selector: 'gow-homework-card',
  templateUrl: './homework-card.component.html',
  imports: [CardModule, NgOptimizedImage]
})
export class HomeworkCardComponent {
  public homework = input.required<HomeworkModel>({ alias: 'homework' })
}

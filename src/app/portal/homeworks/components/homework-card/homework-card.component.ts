import { Component, inject, input, OnInit, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CardModule } from 'primeng/card'
import { homeworkCategoryFormats } from '~/homeworks/data/formats/homeworkCategoryFormats'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { StorageService } from '~/shared/services/storage.service'

@Component({
  selector: 'gow-homework-card',
  templateUrl: './homework-card.component.html',
  imports: [CardModule]
})
export class HomeworkCardComponent implements OnInit {
  private readonly storageService = inject(StorageService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)

  public readonly homeworkCategoryFormats = homeworkCategoryFormats

  public homework = input.required<HomeworkModel>({ alias: 'homework' })

  public imageUrl = signal<string>('')

  async ngOnInit() {
    const path = this.homework().image
    const imageUrl = await this.storageService.downloadUrl(path)
    this.imageUrl.set(imageUrl)
  }

  public onGoHomeworkDetails() {
    this.router.navigate([`h/${this.homework().id}`], {
      relativeTo: this.activatedRoute
    })
  }
}

import { Injectable, inject } from '@angular/core'
import { StorageService } from '~/shared/services/storage.service'

@Injectable({ providedIn: 'root' })
export class StorageHomeworkService {
  private readonly storageService = inject(StorageService)

  public async uploadHomeworkProblem(
    homeworkId: string,
    image: Blob
  ): Promise<string> {
    return await this.storageService.upload(
      `homeworks/${homeworkId}/${crypto.randomUUID()}`,
      image,
      { contentType: image.type }
    )
  }
}

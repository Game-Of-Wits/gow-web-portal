import { Injectable, inject } from '@angular/core'
import { deleteObject, ref, Storage, uploadBytes } from '@angular/fire/storage'

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage)

  public async upload(
    path: string,
    file: Blob | Uint8Array | ArrayBuffer,
    metadata?: { [key: string]: string }
  ): Promise<string> {
    const r = ref(this.storage, path)
    await uploadBytes(r, file, metadata)
    return path
  }

  public async delete(path: string): Promise<void> {
    await deleteObject(ref(this.storage, path))
  }
}

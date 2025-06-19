import { Component } from '@angular/core'

import type { MenuItem } from 'primeng/api'
import { Menu } from 'primeng/menu'

import { LucideAngularModule, User } from 'lucide-angular'

@Component({
  selector: 'gow-profile-menu-button',
  templateUrl: './profile-menu-button.component.html',
  imports: [Menu, LucideAngularModule]
})
export class ProfileMenuButtonComponent {
  public profileMenuOptions: MenuItem[] = [
    {
      separator: true
    },
    {
      label: 'Cerrar sesión'
    }
  ]

  public defaultAvatar = User
}

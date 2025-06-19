import { Component } from '@angular/core'

import { NgOptimizedImage } from '@angular/common'

import { RouterLink, RouterOutlet } from '@angular/router'

@Component({
  selector: 'gow-auth-layout',
  imports: [RouterOutlet, RouterLink, NgOptimizedImage],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {}

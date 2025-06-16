import { Component } from '@angular/core'

import { NgOptimizedImage } from '@angular/common'

import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'gow-auth-layout',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {}

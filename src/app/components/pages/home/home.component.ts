import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
  branchCode: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

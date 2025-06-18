import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register-form',
  imports: [PasswordModule, FormsModule, InputTextModule, IftaLabelModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  public credentials = computed(() => {
    return {
      username: this.username(),
      password: this.password(),
    };
  });

  protected username = signal('');
  protected password = signal('');
}

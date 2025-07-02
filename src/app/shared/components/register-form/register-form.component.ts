import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ConnectionOptions } from 'src/app/core/connection/connection.component';

@Component({
  selector: 'app-register-form',
  imports: [
    PasswordModule,
    FormsModule,
    InputTextModule,
    IftaLabelModule,
    DialogModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  public kind = input<ConnectionOptions>();

  public credentials = computed(() => {
    return {
      username: this.username(),
      password: this.password(),
    };
  });
  public stravaToken = signal('');

  protected username = signal('');
  protected password = signal('');
}

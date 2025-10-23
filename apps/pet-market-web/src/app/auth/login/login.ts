import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = "";
  password = "";
  loginerror: string = "";

  async onSubmit() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(["/"]);
    } catch (error: any) {
      this.loginerror = this.getErrorMessage(error);
      console.error("Login error:", error);
    }
  }

  private getErrorMessage(error: any): string {
    const errorCode = error?.code;

    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'Login failed. Please try again.';
    }
  }

  async loginWithGoogle() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Google login error:", error);
    }
  }
}

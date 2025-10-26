import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth";


@Component({
  selector: "app-signup",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss",
})
export class Signup {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = "";
  password = "";
  signupError: string | null = null;

  async onSubmit() {
    this.signupError = null;
    try {
      await this.auth.signup(this.email, this.password);
      this.router.navigate(["/"]);
    } catch (error: any) {
      this.signupError = this.getErrorMessage(error);
      console.error("Signup error:", error);
    }
  }

  private getErrorMessage(error: any): string {
    const errorCode = error?.code;

    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please login or use a different email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Signup failed. Please try again.';
    }
  }

  async signupWithGoogle() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(["/"]);
    } catch (error) {
      console.error("Google signup error:", error);
    }
  }
}

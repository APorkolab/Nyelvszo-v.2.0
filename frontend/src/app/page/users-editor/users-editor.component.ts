import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-users-editor',
  templateUrl: './users-editor.component.html',
  styleUrls: ['./users-editor.component.scss']
})
export class UsersEditorComponent implements OnInit {
  user$!: Observable<User>;
  user: User = new User();
  entity = 'User';
  isEditMode = false;

  namePattern = "^[a-űA-Űa-zA-Z \\-\\.,!()']{3,60}$";
  passwordPattern = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{7,}$';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.user$ = this.route.params.pipe(
      switchMap((param) => {
        if (param['id'] === '0') {
          return of(new User());
        }
        this.isEditMode = true;
        return this.userService.getOne(param['id']);
      })
    );

    this.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  onUpdate(user: User): void {
    this.userService.update(user).subscribe({
      next: () => this.router.navigate(['/', 'users']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessEdit(),
    });
  }

  onCreate(user: User): void {
    this.userService.create(user).subscribe({
      next: () => this.router.navigate(['/', 'users']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessCreate(),
    });
  }

  showSuccessEdit(): void {
    this.notifyService.showSuccess(
      `${this.entity} edited successfully!`,
      'NyelvSzó v.2.0.0'
    );
  }

  showSuccessCreate(): void {
    this.notifyService.showSuccess(
      `${this.entity} created successfully!`,
      'NyelvSzó v.2.0.0'
    );
  }

  showError(err: any): void {
    let errorMessage = 'Something went wrong.';

    if (err) {
      if (err.error && typeof err.error === 'string') {
        errorMessage = err.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'object') {
        errorMessage = JSON.stringify(err);
      } else {
        errorMessage = err.toString();
      }
    }

    this.notifyService.showError(
      'Error: ' + errorMessage,
      'NyelvSzó v.2.0.0'
    );
  }
}
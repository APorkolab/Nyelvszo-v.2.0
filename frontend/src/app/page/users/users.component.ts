import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { ConfigService } from 'src/app/service/config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  columns: any;
  list$!: Observable<User[]>;
  entity = 'User';

  constructor(
    private config: ConfigService,
    private userService: UserService,
    private router: Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.columns = this.config.usersTableColumns;
    this.list$ = this.userService.getAll();
  }

  showSuccessDelete(): void {
    this.notifyService.showSuccess(
      `${this.entity} deleted successfully!`,
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

  onSelectOne(user: User): void {
    this.router.navigate(['/', 'users', 'edit', user.id]);
  }

  onDeleteOne(user: User): void {
    this.userService.delete(user).subscribe({
      next: () => {
        this.userService.list$.pipe(
          tap(entries => {
            const updatedEntries = entries.filter(e => e.id !== user.id);
            this.userService.list$.next(updatedEntries);
          })
        ).subscribe();

        this.showSuccessDelete();
      },
      error: (err) => this.showError(err),
    });
  }
}
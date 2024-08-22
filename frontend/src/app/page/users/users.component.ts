import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  list$!: Observable<User[]>; // !-gal jelezzük, hogy később inicializálva lesz
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

  showError(err: string): void {
    this.notifyService.showError(
      'Something went wrong. Details: ' + err,
      'NyelvSzó v.2.0.0'
    );
  }

  onSelectOne(user: User): void {
    this.router.navigate(['/', 'users', 'edit', user._id]);
  }

  onDeleteOne(user: User): void {
    this.userService.delete(user).subscribe({
      next: () => {
        this.list$ = this.userService.getAll();
        this.showSuccessDelete();
      },
      error: (err) => this.showError(err),
    });
  }
}

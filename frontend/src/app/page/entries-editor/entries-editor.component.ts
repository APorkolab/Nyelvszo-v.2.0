import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Entry } from 'src/app/model/entry';
import { EntryService } from 'src/app/service/entry.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-entries-editor',
  templateUrl: './entries-editor.component.html',
  styleUrls: ['./entries-editor.component.scss']
})
export class EntriesEditorComponent implements OnInit {
  entry: Entry = new Entry();
  entity = 'Entry';

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        if (params['id'] === '0') {
          return of(new Entry());
        }
        return this.entryService.getOne(params['id']);
      })
    ).subscribe({
      next: (entry) => {
        this.entry = entry;
      },
    });
  }

  onUpdate(entry: Entry): void {
    this.entryService.update(entry).subscribe({
      next: () => this.router.navigate(['/', 'entries']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessEdit(),
    });
  }

  onCreate(entry: Entry): void {
    this.entryService.create(entry).subscribe({
      next: () => this.router.navigate(['/', 'entries']),
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
      `Error: ${errorMessage}`,
      'NyelvSzó v.2.0.0'
    );
  }

}
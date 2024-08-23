import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entry } from 'src/app/model/entry';
import { ConfigService } from 'src/app/service/config.service';
import { EntryService } from 'src/app/service/entry.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  columns: any;
  list$!: Observable<Entry[]>;
  entity = 'Entry';

  constructor(
    private config: ConfigService,
    private entryService: EntryService,
    private router: Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.columns = this.config.entriesTableColumns;
    this.list$ = this.entryService.list$;
    this.entryService.getAll().subscribe();
  }

  showSuccessDelete() {
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
      `Error: ${errorMessage}`,
      'NyelvSzó v.2.0.0'
    );
  }

  onSelectOne(entry: Entry): void {
    this.router.navigate(['/', 'entries', 'edit', entry._id]);
  }

  onDeleteOne(entry: Entry): void {
    this.entryService.delete(entry).subscribe({
      next: () => {
        // Instead of reassigning `this.list$`, use `tap` to update the list.
        this.entryService.list$.pipe(
          tap(entries => {
            const updatedEntries = entries.filter(e => e._id !== entry._id);
            this.entryService.list$.next(updatedEntries);
          })
        ).subscribe();

        this.showSuccessDelete();
      },
      error: (err) => this.showError(err),
    });
  }
}
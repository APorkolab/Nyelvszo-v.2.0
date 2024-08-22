import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entry } from 'src/app/model/entry';
import { ConfigService } from 'src/app/service/config.service';
import { EntryService } from 'src/app/service/entry.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  columns: any;
  list$: Observable<Entry[]> = of([]);
  entity = 'Entry';

  constructor(
    private config: ConfigService,
    private entryService: EntryService,
    private router: Router,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.columns = this.config.entriesTableColumns;
    this.list$ = this.entryService.getAll();
  }

  showSuccessDelete() {
    this.notifyService.showSuccess(
      `${this.entity} deleted successfully!`,
      'NyelvSzó v.2.0.0'
    );
  }

  showError(err: string) {
    this.notifyService.showError(
      'Something went wrong. Details: ' + err,
      'NyelvSzó v.2.0.0'
    );
  }

  onSelectOne(entry: Entry): void {
    this.router.navigate(['/', 'entries', 'edit', entry._id]);
  }

  onDeleteOne(entry: Entry): void {
    this.entryService.delete(entry).subscribe({
      next: () => {
        this.list$ = this.entryService.getAll();
        this.showSuccessDelete();
      },
      error: (err) => this.showError(err),
    });
  }
}

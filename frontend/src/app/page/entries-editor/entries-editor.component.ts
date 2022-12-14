import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Entry } from 'src/app/model/entry';
import { EntryService } from 'src/app/service/entry.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-entries-editor',
  templateUrl: './entries-editor.component.html',
  styleUrls: ['./entries-editor.component.scss']
})
export class EntriesEditorComponent implements OnInit {
entry$!: Observable<Entry>;
  entry: Entry = new Entry();
  entity = 'Entry';

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        if (param['id'] == '0') {
          return of(new Entry());
        }
        this.entry$ = this.entryService.getOne(param['id']);
        return this.entryService.getOne(param['id']);
      },
    });
    this.entry$.subscribe({
      next: (entry) => (this.entry = entry ? entry : this.entry),
    });
  }

  onUpdate(entry: Entry) {
    this.entryService.update(entry).subscribe({
      next: (category) => this.router.navigate(['/', 'entries']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessEdit(),
    });
  }

  onCreate(entry: Entry) {
    this.entryService.create(entry).subscribe({
      next: (category) => this.router.navigate(['/', 'entries']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessCreate(),
    });
  }

  showSuccessEdit() {
    this.notifyService.showSuccess(
      `${this.entity} edited successfully!`,
      'NyelvSzó v.2.0.0'
    );
  }

  showSuccessCreate() {
    this.notifyService.showSuccess(
      `${this.entity} created successfully!`,
      'NyelvSzó v.2.0.0'
    );
  }

  showError(err: String) {
    this.notifyService.showError(
      'Something went wrong. Details:' + err,
      'NyelvSzó v.2.0.0'
    );
  }
}
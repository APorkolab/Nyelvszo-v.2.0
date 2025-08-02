import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Entry } from 'src/app/model/entry';
import { ConfigService } from 'src/app/service/config.service';
import { EntryService } from 'src/app/service/entry.service';
import { NotificationService } from 'src/app/service/notification.service';
import { EntriesComponent } from './entries.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EntriesComponent', () => {
  let component: EntriesComponent;
  let fixture: ComponentFixture<EntriesComponent>;
  let entryService: jasmine.SpyObj<EntryService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockEntry: Entry = { id: 1, hungarian: 'szék', english: 'chair', fieldOfExpertise: 'bútor', wordType: 'főnév' };

  beforeEach(async () => {
    const entryServiceSpy = jasmine.createSpyObj('EntryService', ['delete', 'getAll']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EntriesComponent],
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [
        { provide: EntryService, useValue: entryServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        // Providing a basic mock for ConfigService
        { provide: ConfigService, useValue: { entriesTableColumns: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntriesComponent);
    component = fixture.componentInstance;
    entryService = TestBed.inject(EntryService) as jasmine.SpyObj<EntryService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock getAll to return an empty observable for ngOnInit
    entryService.getAll.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('onDeleteOne', () => {
    it('should call entryService.delete and show success notification on success', () => {
      entryService.delete.and.returnValue(of(mockEntry));

      fixture.detectChanges();
      component.onDeleteOne(mockEntry);

      expect(entryService.delete).toHaveBeenCalledWith(mockEntry);
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Entry deleted successfully!',
        'NyelvSzó v.2.0.0'
      );
      expect(notificationService.showError).not.toHaveBeenCalled();
    });

    it('should call entryService.delete and show error notification on failure', () => {
      const errorResponse = { error: 'Test error' };
      entryService.delete.and.returnValue(throwError(() => errorResponse));

      fixture.detectChanges();
      component.onDeleteOne(mockEntry);

      expect(entryService.delete).toHaveBeenCalledWith(mockEntry);
      expect(notificationService.showError).toHaveBeenCalled();
      expect(notificationService.showSuccess).not.toHaveBeenCalled();
    });
  });

  describe('onSelectOne', () => {
    it('should navigate to the edit page for the selected entry', () => {
      fixture.detectChanges();
      component.onSelectOne(mockEntry);

      expect(router.navigate).toHaveBeenCalledWith(['/', 'entries', 'edit', mockEntry.id]);
    });
  });
});

import { Injectable } from '@angular/core';
import { INgxTableColumn } from './../data-table/ngx-data-table/ngx-data-table.component';

export interface IMenuItem {
  link: string;
  title: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  readonly sidebarMenu: IMenuItem[] = [
    { link: '/', title: 'Dashboard', icon: 'home' },
    { link: '/movies', title: 'Planned Films', icon: 'calendar' },
    { link: '/watched-movies', title: 'Watched Films', icon: 'Youtube' },
    { link: '/directors', title: 'Directors', icon: 'video' },
    { link: '/main-actors', title: 'Main Actors', icon: 'film' },
    { link: '/family-members', title: 'Family Members', icon: 'users' },
  ];

  readonly entriesTableColumns: INgxTableColumn[] = [
    { key: '_id', title: 'ID' },
    { key: 'hungarian', title: 'Hungarian Version' },
    { key: 'fieldOfExpertise', title: 'Field Of Expertise' },
    { key: 'wordType', title: 'Word Type' },
    { key: 'english', title: 'English Version' },
  ];

  readonly usersTableColumns: INgxTableColumn[] = [
    { key: '_id', title: 'ID' },
    { key: 'firstName', title: 'First Name' },
    { key: 'lastName', title: 'Last Name' },
    { key: 'email', title: 'E-mail' },
    { key: 'role', title: 'Role' },
    { key: 'password', title: 'Encrypted Password' },
  ];

  constructor() { }
}

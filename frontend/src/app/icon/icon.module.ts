import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import {
  Home,
  BookOpen,
  Calendar,
  CornerDownLeft,
  CornerDownRight,
  FileMinus,
  FilePlus,
  FileText,
  Filter,
  LogIn,
  LogOut,
  MessageCircle,
  Settings,
  Shuffle,
  Trash2,
  User,
  UserPlus,
  Users,
} from 'angular-feather/icons';

const icons = {
  Home,
  BookOpen,
  Calendar,
  CornerDownLeft,
  CornerDownRight,
  FileMinus,
  FilePlus,
  FileText,
  Filter,
  LogIn,
  LogOut,
  MessageCircle,
  Settings,
  Shuffle,
  Trash2,
  User,
  UserPlus,
  Users,
};

@NgModule({
  imports: [CommonModule, FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconModule { }
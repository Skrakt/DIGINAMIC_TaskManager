import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@/app.config';
import { AppShellComponent } from '@/app';

bootstrapApplication(AppShellComponent, appConfig).catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { getAppConfig } from './app/app.config';
import './routeTree.gen';

bootstrapApplication(AppComponent, getAppConfig());

import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { getAppConfig } from './app.config';

export const getServerConfig = (): ApplicationConfig =>
  mergeApplicationConfig(getAppConfig(), {
    providers: [provideServerRendering()],
  });

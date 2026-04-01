import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import {
  QueryClient,
  provideTanStackQuery,
} from '@benjavicente/angular-query-experimental';
import { withNavigationErrorHandler } from '@angular/router';

export const getAppConfig = (): ApplicationConfig => ({
  providers: [
    provideFileRouter(withNavigationErrorHandler(console.error)),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor]),
    ),
    provideTanStackQuery(new QueryClient()),
  ],
});

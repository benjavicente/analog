import 'zone.js/node';
import '@angular/platform-server/init';

import { AppComponent } from './app/app.component';
import type { ServerContext } from '@analogjs/router/tokens';
import { getServerConfig } from './app/app.config.server';
import { render } from '@analogjs/router/server';

export default function renderApp(
  url: string,
  document: string,
  ctx: ServerContext,
) {
  // Create the config per request to avoid leaking state between requests
  return render(AppComponent, getServerConfig())(url, document, ctx);
}

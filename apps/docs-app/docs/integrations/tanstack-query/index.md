---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TanStack Query Integration with Analog

Analog works well with [TanStack Query](https://tanstack.com/query/latest/docs/framework/angular/overview) when you use the Angular integration directly and call Analog server routes from typed query functions.

Use route `load` functions when data should be resolved before the page component is created and the result is tied to navigation. Use TanStack Query when you need client-managed server state with query-key caching, invalidation, retries, or background refetching.

## Step 1: Install TanStack Query

<Tabs groupId="package-manager">
  <TabItem value="npm">

```shell
npm install @benjavicente/angular-query-experimental
```

  </TabItem>

  <TabItem label="yarn" value="yarn">

```shell
yarn add @benjavicente/angular-query-experimental
```

  </TabItem>

  <TabItem value="pnpm">

```shell
pnpm add @benjavicente/angular-query-experimental
```

  </TabItem>
</Tabs>

## Step 2: Configure the Client Provider

Add TanStack Query to your application config. Create the `QueryClient` per request so SSR does not share cache state across users or requests.

```ts
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { requestContextInterceptor } from '@analogjs/router';
import {
  QueryClient,
  provideTanStackQuery,
} from '@benjavicente/angular-query-experimental';

export const appConfig: ApplicationConfig = {
export const getAppConfig = (): ApplicationConfig => ({
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor]),
    ),
    provideTanStackQuery(new QueryClient()),
  ],
});
```

## Step 3: Configure the Server Provider

Keep your normal Analog server rendering config. The query library handles hydration itself.

```ts
import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { getAppConfig } from './app.config';

export const getServerConfig = (): ApplicationConfig =>
  mergeApplicationConfig(getAppConfig(), {
    providers: [provideServerRendering()],
  });
```

## Step 4: Query Server Routes

Use `injectQuery` and `injectMutation` from TanStack Query against Analog server routes in your components.

```ts
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { injectQuery } from '@benjavicente/angular-query-experimental';

@Component({
  template: `
    @if (query.isPending()) {
      Loading...
    } @else if (query.data(); as data) {
      <p>{{ data.message }}</p>
    }
  `,
})
export default class QueryPageComponent {
  private readonly http = inject(HttpClient);

  readonly query = injectQuery(() => ({
    queryKey: ['echo'],
    queryFn: () =>
      lastValueFrom(this.http.get<{ message: string }>('/api/v1/echo')),
  }));
}
```

## Typed Server Routes

Use `injectServerAction` from `@analogjs/router/server/actions` to get end-to-end type safety between server routes and client queries while still configuring TanStack Query with its own options helpers.

```ts
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  injectQuery,
  queryOptions,
} from '@benjavicente/angular-query-experimental';
import { injectServerAction } from '@analogjs/router/server/actions';
import type { route } from '../../server/routes/api/v1/todos.get';

@Component({
  template: `
    @if (todosQuery.data(); as todos) {
      @for (todo of todos; track todo.id) {
        <p>{{ todo.title }}</p>
      }
    }
  `,
})
export default class TodosComponent {
  private readonly fetchTodos =
    injectServerAction<typeof route>('/api/v1/todos');

  readonly todosQuery = injectQuery(() =>
    queryOptions({
      queryKey: ['todos'],
      queryFn: () => this.fetchTodos(),
    }),
  );
}
```

`injectServerAction` injects `HttpClient` internally and returns a function that accepts an optional `{ params, body }` object. Query params, request bodies, and response shapes are all inferred from the server route definition with no manual type duplication.

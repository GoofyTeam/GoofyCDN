# [STARTER PACK] Front - Vite + Tailwind + TanStack Router

This repo use :

- React 19.0.0
- Tailwind 4.0.3
- TanStack Router 1.99.6

```
cd Starter-Pack
npm install
```

## For TanStack DevTools :

It's activated in Index.tsx, you can remove it if you want.
In Page2 it doesn't appear, copy/paste the file route if you want to disable DevTools.

For CSS, it's centered by default, can be removed in index.css (body)

## How to use TanStack Router :

Create a **tsx** file in folder **route**, then copy/paste this code and replace **Page**, **YourPage** and **YourUrl** by your page and url :

```
import Page from "@/pages/YourPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/YourUrl")({
  component: Page,
});
```

## How to install Shadcn UI Component :

```
cd Starter-Pack
npx shadcn@latest add [name of component]
```

List of components can be find [here](https://ui.shadcn.com/docs/components/accordion).

Also compatible with other libraries.

Lucide Icons already installed.

The component will be in the folder components/ui

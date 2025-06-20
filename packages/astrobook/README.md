<div align="center">
<h1>Astrobook</h1>
<p><strong>The minimal UI component playground</strong></p>
</div>

![astrobook](https://github.com/user-attachments/assets/02289aa9-df34-48f8-8aa5-42015c172443)

Astrobook is a UI component playground that supports multiple frameworks including **React**, **Vue**, **Preact**, **Svelte**, **Solid**, **Lit**, and **Astro**. It offers a unified environment to develop, test, and showcase components.

## Fork Changes

This repo was primarily forked to allow for importing types into the `.stories.ts` files. This required a different parser.

### Other new features

- `production` config option default: `false` so that the storybook pages can be used for development only
- `layout` config option that allows you to define a custom layout to wrap your components
- `collapsed` config option default: `false` collapses the sidebar components

#### Slots

If you're using named slots, define them in the default export. If you're only using an unamed `<slot />` in your component, then you don't need to define it in the default export.

```ts
// src/components/Button.stories.ts
import { Button } from './Button.astro'
import type { ComponentProps } from 'astro/types'

const slots = ['message'] as const

type Props = {
  args: ComponentProps<typeof Button>
  slots: Partial<Record<'default' | (typeof slots)[number], string>>
}

export default {
  component: Button,
  slots,
}

export const PrimaryButton: Props = {
  args: {
    variant: 'primary',
  },
  slots: {
    default: '<span>Hello</span>',
    message: '<span>World</span>',
  },
}
```

## Try it Online

- An example of using multiple UI rendering frameworks (React, Preact, Vue, Svelte, Solid, Lit, Astro) with Astrobook.

  Online demo: [astrobook.pages.dev](https://astrobook.pages.dev/)

  [![Open in StackBlitz][stackblitz_badge]][example_playground]

- An example of using custom `<head>` tags with Astrobook.

  [![Open in StackBlitz][stackblitz_badge]][example_custom_head]

- An example that shows how to add Astrobook into an existing Astro project.

  [![Open in StackBlitz][stackblitz_badge]][example_mixed]

- An example of using TailwindCSS with Astrobook.

  [![Open in StackBlitz][stackblitz_badge]][example_tailwindcss]

- An example of using UnoCSS with Astrobook.

  [![Open in StackBlitz][stackblitz_badge]][example_unocss]

## Quick start

> [!NOTE]
> Astrobook supports various frameworks. We use React as an example here. Check the [Astro docs](https://docs.astro.build/en/guides/integrations-guide/#official-integrations) for other integrations.

1. Install the packages

   ```bash
   npm install astro @astrojs/react astrobook
   ```

2. Create `astro.config.mjs` and add the `astrobook` integration

   ```js
   // astro.config.mjs
   import { defineConfig } from 'astro/config'
   import react from '@astrojs/react'
   import astrobook from '@northstarthemes/astrobook'

   // https://astro.build/config
   export default defineConfig({
     integrations: [react(), astrobook()],
   })
   ```

3. Add scripts to your `package.json`

   ```json
   "scripts": {
     "dev": "astro dev",
     "build": "astro build"
   }
   ```

4. Write stories. Astrobook scans all `.stories.{ts,tsx,js,jsx,mts,mtsx,mjs,mjsx}` files. It's compatible with Storybook's [Component Story Format v3](https://storybook.js.org/docs/api/csf).

   ```ts
   // src/components/Button.stories.ts
   import { Button, type ButtonProps } from './Button.tsx'

   export default {
     component: Button,
   }

   export const PrimaryButton = {
     args: {
       variant: 'primary',
     } satisfies ButtonProps,
   }

   export const SecondaryButton = {
     args: {
       variant: 'secondary',
     } satisfies ButtonProps,
   }
   ```

5. Run `npm run dev` and open `http://localhost:4321` to see your stories.

## Options

### `directory`

You can use the `directory` option to specify the directory to scan for stories. The default directory is current working directory.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  integrations: [
    astrobook({
      directory: 'src/components',
    }),
    /* ...other integrations */
  ],
})
```

### `subpath`

You can run Astrobook as a standalone app. You can also add it to your existing Astro project. In the latter case, you can use the `subpath` option to specify the subpath of Astrobook.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  integrations: [
    astrobook({
      subpath: '/docs/components',
    }),
  ],
})
```

In the example above, Astrobook will be available at `http://localhost:4321/docs/components`.

Notice that the `subpath` option is relative to the [base URL](https://docs.astro.build/en/reference/configuration-reference/#base) of your Astro project. For example, if you configure both Astro's `base` and `astrobook`'s `subpath`, like so:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  base: '/base',
  integrations: [
    astrobook({
      subpath: '/docs/components',
    }),
  ],
})
```

You Astro project will be available at `http://localhost:4321/base` and Astrobook will be available at `http://localhost:4321/base/docs/components`.

### `css`

You can customize the styles by using the `css` option to specify the CSS files to be imported into your Astrobook site.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  integrations: [
    astrobook({
      css: [
        // Relative path to your custom CSS file
        './src/styles/custom.css',
      ],
    }),
  ],
})
```

### `head`

You can further customize your Astrobook project by providing a custom `head` options. It's a path to an Astro component that includes custom tags to the `<head>` of your Astrobook site. It should only include [elements permitted inside `<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#see_also), like `<link>`, `<style>`, `<script>`, etc.

Below is an example of a custom head component that configures the global styles and fonts.

```astro
<!-- Load custom fonts -->
<link rel="preconnect" href="https://rsms.me/" />
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

<!-- Apply global styles -->
<style is:global>
  html {
    font-family: 'Inter', sans-serif;
  }
</style>
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  integrations: [
    astrobook({
      // Relative path to your custom head component
      head: './src/components/CustomHead.astro',
    }),
  ],
})
```

### `title`

You can set the title for your website.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astrobook from '@northstarthemes/astrobook'

export default defineConfig({
  integrations: [
    astrobook({
      title: 'My Components Playground',
    }),
  ],
})
```

## Advanced

### Toggle theme via message

If you're running Astrobook in an iframe, you can toggle the theme via a message.

```js
const theme = 'light' // or "dark"
iframe.contentWindow.postMessage({ type: 'astrobook:set-theme', theme }, '*')
```

## Who's using Astrobook?

- [ProseKit](https://prosekit.dev/astrobook)

_[Add your project](https://github.com/ocavue/astrobook/edit/master/packages/astrobook/README.md)_

## License

MIT

[stackblitz_badge]: https://developer.stackblitz.com/img/open_in_stackblitz.svg
[example_playground]: https://stackblitz.com/github/ocavue/astrobook/tree/master/examples/playground
[example_unocss]: https://stackblitz.com/github/ocavue/astrobook/tree/master/examples/unocss
[example_tailwindcss]: https://stackblitz.com/github/ocavue/astrobook/tree/master/examples/tailwindcss
[example_custom_head]: https://stackblitz.com/github/ocavue/astrobook/tree/master/examples/custom-head
[example_mixed]: https://stackblitz.com/github/ocavue/astrobook/tree/master/examples/mixed

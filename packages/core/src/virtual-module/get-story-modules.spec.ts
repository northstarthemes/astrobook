import { expect, test } from 'vitest'

import { convertStoryFileToModule } from './get-story-modules'

test('convertStoryFileToModule', () => {
  expect(
    convertStoryFileToModule('/my-project', {
      filePath: '/my-project/path/to/Button.stories.js',
      defaultExport: true,
      namedExports: ['PrimaryButton', 'SecondaryButton'],
      slots: ['test'],
    }),
  ).toMatchInlineSnapshot(`
    {
      "directory": "path/to",
      "id": "path/to/button",
      "importPath": "/my-project/path/to/Button.stories.js",
      "name": "Button",
      "slots": [
        "test",
      ],
      "stories": [
        {
          "id": "path/to/button/primary-button",
          "name": "PrimaryButton",
        },
        {
          "id": "path/to/button/secondary-button",
          "name": "SecondaryButton",
        },
      ],
    }
  `)
})

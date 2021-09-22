# Typescript Builders Generator
This project allows you to generate definitely typed builders based on typescript `interface` and `type`.

## Usage
You can use this package either via CLI or by using the `generateBuilders` function.

> Generating builders via CLI:
```bash
npx @wix/typescript-builders-generator <full-path-to-ts-file> <full-path-to-output-directory>
```

> Generating builders via `package.json` script:
```json
"generate": "generate-builders <full-or-relative-path-to-ts-file> <full-or-relative-path-to-output-directory>"
```

> Generating builders from code:
```typescript
import {generateBuilders} from '@wix/typescript-builders-generator'

// returns a promise that's resolved when task is finished
generateBuilders(fullOrRelativePathToTsFile, fullOrRelativePathToOutputDirectory);
```

# Klang Theme Markdown Sample

This file exercises **bold**, *italic*, ~~strikethrough~~, `inline code`, links, lists, tables, blockquotes, and fenced code blocks.

> A blockquote with punctuation, numbers like `42`, and a URL: https://example.com/theme-preview

## Checklist

- [x] Comments and prose
- [x] Inline punctuation: `{ } [ ] ( ) < > = + - * / % ! ?`
- [ ] Images, tables, and nested lists

## Table

| Scope | Example | Color Intent |
| --- | ---: | --- |
| `entity.name.function` | `renderPreview()` | Cyan or accent |
| `keyword.control` | `if`, `return`, `match` | Pink |
| `constant.numeric` | `123.45` | Green or yellow |

```ts
export function renderPreview(themeName: string): string {
  return `Previewing ${themeName}`;
}
```

```json
{
  "accent": "#ff55c8",
  "enabled": true,
  "samples": ["markdown", "typescript", "json"]
}
```

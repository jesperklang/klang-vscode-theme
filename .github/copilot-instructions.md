# Klang Theme — VS Code Theme Extension

## What This Project Is

This repository is a **VS Code color theme extension** called **Klang Theme**. It is a high-contrast dark theme (`hc-black`) with neon pink (`#ff55c8`) as the primary accent color, cyan (`#00f0ff`).

## Repository Structure

- `package.json` — Extension manifest. Declares the theme with `"uiTheme": "hc-black"` and points to `./themes/klang-theme.json`.
- `themes/klang-theme.json` — The theme definition file containing `"colors"` (workbench UI colors) and `"tokenColors"` (syntax highlighting via TextMate scopes).
- `.vscode/settings.json` — Local workspace settings used for live-previewing color changes during development. The `workbench.colorCustomizations` and `editor.tokenColorCustomizations` here mirror the theme file and serve as a scratchpad.
- `README.md` — User-facing documentation for the extension.
- `CHANGELOG.md` — Release notes.

## Key Guidelines for Agents

### Theme development rules
- This is a **theme-only extension**. There is no runnable code, no tests, no build step, and no dependencies. Do not suggest installing npm packages, running builds, or adding test frameworks.
- The authoritative theme definition lives in **`themes/klang-theme.json`**. When making color changes, update that file. Optionally keep `.vscode/settings.json` in sync for live preview, but the theme file is the source of truth.
- All color values must be valid CSS hex colors (e.g. `#ff55c8`, `#ff55c880` for transparency). No named colors, no `rgb()`.
- The `"type"` field in the theme JSON must remain `"hcDark"` and `"uiTheme"` in `package.json` must remain `"hc-black"`.

### Color palette
| Role | Color |
| Primary accent (borders, icons, UI text) | `#ff55c8` |
| Primary accent 50% | `#ff55c880` |
| Primary accent 10% | `#ff55c81a` |
| Background | `#000` / `#000000` |
| Foreground (editor text) | `#FFF` |
| Cyan (links, info, types) | `#00f0ff` |
| Green (added, success, variables) | `#05ffa1` |
| Purple (modified, AI/chat) | `#f03fff` |
| Red (errors, deleted) | `#ff2e63` |
| Dark red (removed lines/text) | `#ff0044` |
| Yellow (warnings) | `#ffcc00` |
| Dark green (constants) | `#08b071` |

### When asked to change colors
1. Identify which UI elements or token scopes are affected.
2. Edit `themes/klang-theme.json` — update the `"colors"` object for UI changes, or the `"tokenColors"` array for syntax changes.
3. Optionally update `.vscode/settings.json` to match, so the live preview reflects the change.
4. Reference the VS Code theme color docs when needed: https://code.visualstudio.com/api/references/theme-color

### When asked to add new token scopes
- Add entries to the `"tokenColors"` array in `themes/klang-theme.json`.
- Use specific TextMate scopes (e.g. `keyword.control`, `entity.name.function`) rather than broad ones when possible.
- Follow the existing color palette unless the user explicitly requests a new color.

### Validation
- Both `themes/klang-theme.json` and `.vscode/settings.json` must always be valid JSON (no trailing commas in the theme file; the settings file allows VS Code's JSONC format with comments).
- The theme file must not contain comments — it is strict JSON.
- After edits, confirm the JSON is well-formed.

### Official documentation references
- **Theme color reference** (all workbench UI color IDs): https://code.visualstudio.com/api/references/theme-color
- **Color theme guide** (how VS Code themes work): https://code.visualstudio.com/api/extension-guides/color-theme
- **TextMate grammars / token colors**: https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
- **Extension manifest (package.json)**: https://code.visualstudio.com/api/references/extension-manifest
- **Publishing extensions**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
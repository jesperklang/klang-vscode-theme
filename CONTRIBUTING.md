# Contributing to the theme

> Thank you for contributing! Just follow the steps below to get set up and start making changes. If you have any questions or need help, feel free to open an issue or reach out. - Jesper

## Before You Start

Make sure you have installed:
- **VS Code Insider**. *VS Code Insider is recommended for testing the latest features, but the regular stable release works too.*
- **Node.js v23.6.0 or higher**.
Use below command to check your Node.js version:
```sh
node -v
```

## Development Workflow

### 1. Clone the repository and install dependencies: 

```sh
cd your/directory
git clone https://github.com/jesperklang/klang-vscode-theme.git
cd your/directory/klang-vscode-theme
git remote add upstream https://github.com/jesperklang/klang-vscode-theme.git
npm install
```

### 2. Create a new branch for your change:

```sh
git checkout -b your-feature
```

### 3. Make your changes

You will mainly be editing [`themes/klang-theme.json`](themes/klang-theme.json) to adjust theme colors. This file is used to generate the packaged file.

Check the [VS Code Theme Color reference](https://code.visualstudio.com/api/references/theme-color) to find the correct color tokens to update.

### 4a. Preview changes using script and reload (my preferred method)

1. Run the local install script to copy the current state of the repository into your VS Code extensions folder:
```sh
npm run install-locally # for stable VS Code
npm run install-locally:insider # for VS Code Insider
```
2. Run VS Code action to reload the window:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac).
- Type `Reload Window` and select `Developer: Reload Window`.

> :bulb: Tip: Use the code samples in `code-samples/` to quickly test specific UI elements on popular languages.

### 4b. Preview changes using Extension Development Host

Use the existing launch configuration:
1. Open the repository in VS Code.
2. Press `F5`.
3. In the Extension Development Host window, select **Klang Theme**.
4. Exercise the parts of the UI your change affects.

> :bulb: Tip: Use the code samples in `code-samples/` to quickly test specific UI elements on popular languages.

### 5. Prepare for Pull Request
1. Make sure your branch is up to date with the latest changes from `main`.
2. Build a VSIX package and make sure there are no errors by running:
```sh
npm run vsix
```
- Add your changes to the [Unreleased] section in [`CHANGELOG.md`](CHANGELOG.md) with a clear description. Consider giving yourself credit for the contribution by adding your GitHub username in parentheses after the description, e.g. `- Improved color contrast for comments (by jesperklang)`.

> :bulb: Tip: Bonus points if you can check for color blindness. You can do this using the built-in Developer Tools in VS Code. Open Developer Tools (`Help > Toggle Developer Tools`), then open the More tools menu (three-dot icon in the DevTools toolbar) > Select Rendering > Scroll to the Emulate vision deficiencies dropdown and select the desired condition.

### 6. Commit and open a Pull Request
1. Commit your changes with a descriptive message. If you do many changes in one branch, consider breaking them into multiple commits with clear messages.
2. Push your branch to your fork.
3. Open a Pull Request against the `main` branch of the original repository, fill in the required information from the template, and submit it.

## Theme Colors

Klang Theme is intentionally opinionated. Keep changes aligned with the existing main colors:
- `#000000` Pure black backgrounds
- `#FFFFFF` White, high contrast foreground text
- `#FF55C8` Neon pink as the primary accent
- `#00F0FF` Cyan for links, informational states, and type-adjacent highlights
- `#05FFA1` Green for success and additions
- `#F44747` Red for errors and deletions
- `#CD9731` Yellow for warnings
- `#6796E6` Blue for informational states and highlights

When adding or adjusting colors:

- Always prefer existing palette values over inventing near-duplicates.
- Use specific token scopes when adjusting syntax colors instead of broad catch-all scopes.
- Keep contrast strong enough that structure is readable at a glance.
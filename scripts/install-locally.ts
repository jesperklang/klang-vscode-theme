/// <reference types="node" />

/**
 * This script installs the extension locally by copying the repository files to the VS Code extensions directory.
 * It reads the extension's name, publisher, and version from package.json to determine the destination folder name.
 * The script can target either the stable or insider edition of VS Code based on a command-line flag or environment variable.
 * Run `npm run install-locally` to install to VS Code (stable), or `npm run install-locally:insider` to install to VS Code Insider.
*/

import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import type { Dirent } from "node:fs";
import { homedir, platform } from "node:os";
import { basename, join, resolve } from "node:path";

type PackageManifest = {
  name?: unknown;
  publisher?: unknown;
  version?: unknown;
};

const repositoryRoot = resolve(import.meta.dirname, "..");
const installTarget = getInstallTarget();
const extensionsRoot = getExtensionsRoot(installTarget);

async function main() {
  const manifest = await readManifest();
  const packageName = readStringField(manifest, "name");
  const packagePublisher = readStringField(manifest, "publisher");
  const packageVersion = readStringField(manifest, "version");
  const packageFolderPrefix = `${packagePublisher}.${packageName}`;
  const destination = join(extensionsRoot, `${packageFolderPrefix}-${packageVersion}`);

  await mkdir(extensionsRoot, { recursive: true });
  await removeExistingPackageFolders(packageFolderPrefix);
  await cp(repositoryRoot, destination, {
    recursive: true,
    filter: (source: string) => !shouldExclude(source),
  });

  console.log(`Installed ${packageName} ${packageVersion}`);
  console.log(`Target: ${installTarget}`);
  console.log(`Source: ${repositoryRoot}`);
  console.log(`Destination: ${destination}`);
  console.log("Reload or restart VS Code to pick up the local extension.");
}

function getInstallTarget() {
  const npmInsiderConfig = process.env.npm_config_insider;
  const hasInsiderFlag =
    process.argv.includes("--insider") || (npmInsiderConfig !== undefined && npmInsiderConfig !== "false");

  return hasInsiderFlag ? "insider" : "stable";
}

function getExtensionsRoot(target: "stable" | "insider") {
  const vscodeDirectory = target === "insider" ? ".vscode-insiders" : ".vscode";

  switch (platform()) {
    case "win32":
    case "darwin":
    case "linux":
      return join(homedir(), vscodeDirectory, "extensions");
    default:
      throw new Error(`Unsupported operating system: ${platform()}`);
  }
}

async function readManifest(): Promise<PackageManifest> {
  const manifestPath = join(repositoryRoot, "package.json");
  const manifestText = await readFile(manifestPath, "utf8");
  return JSON.parse(manifestText) as PackageManifest;
}

function readStringField(manifest: PackageManifest, fieldName: keyof PackageManifest): string {
  const value = manifest[fieldName];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`package.json must contain a non-empty string \"${fieldName}\" field.`);
  }

  return value;
}

async function removeExistingPackageFolders(packageFolderPrefix: string) {
  const entries = await readdir(extensionsRoot, { withFileTypes: true });
  const matchingFolders = entries.filter(
    (entry: Dirent) => entry.isDirectory() && entry.name.startsWith(packageFolderPrefix),
  );

  for (const folder of matchingFolders) {
    const folderPath = join(extensionsRoot, folder.name);
    console.log(`Removing existing folder: ${folderPath}`);
    await rm(folderPath, { recursive: true, force: true });
  }
}

function shouldExclude(source: string) {
  const entryName = basename(source);
  const excludedNames = new Set([".git", ".vscode", ".vscode-test", "node_modules", "package-lock.json"]);

  return excludedNames.has(entryName) || entryName.endsWith(".vsix") || pathsAreEqual(source, extensionsRoot);
}

function pathsAreEqual(left: string, right: string) {
  const normalizedLeft = resolve(left);
  const normalizedRight = resolve(right);

  if (platform() === "win32") {
    return normalizedLeft.toLowerCase() === normalizedRight.toLowerCase();
  }

  return normalizedLeft === normalizedRight;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to install local extension: ${message}`);
  process.exitCode = 1;
});
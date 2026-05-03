#!/usr/bin/env bash
# Bash sample: options, arrays, functions, conditionals, regex, and process substitution
set -euo pipefail

readonly ACCENT="#ff55c8"
readonly SAMPLE_DIR="${1:-./code-samples}"
languages=(typescript python javascript css html json java csharp go rust cpp php ruby sql)

log() {
  local level="$1"
  shift
  printf '[%s] %s\n' "${level^^}" "$*"
}

for language in "${languages[@]}"; do
  if [[ "$language" =~ ^(type|java|python) ]]; then
    log info "checking $language with accent $ACCENT"
  fi
done

while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  case "$file" in
    *.json) log warn "validate JSON: $file" ;;
    *.md) log info "markdown: $file" ;;
    *) log debug "sample: $file" ;;
  esac
done < <(find "$SAMPLE_DIR" -maxdepth 1 -type f | sort)

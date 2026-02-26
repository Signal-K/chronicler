#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$ROOT_DIR"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEFAULT_OUT="/tmp/bee-garden-full-run-${TIMESTAMP}"
OUT_DIR="${1:-$DEFAULT_OUT}"
LOG_DIR="${OUT_DIR}/logs"
EXPORT_DIR="${OUT_DIR}/exports"
mkdir -p "$LOG_DIR" "$EXPORT_DIR"

GODOT_BIN="${GODOT_EDITOR:-/Applications/Godot4.5.app/Contents/MacOS/Godot}"

if [[ ! -x "$GODOT_BIN" ]]; then
  echo "ERROR: Godot binary not found or not executable: $GODOT_BIN"
  echo "Set GODOT_EDITOR to a valid Godot 4.5 editor binary."
  exit 1
fi

run_step() {
  local name="$1"
  shift
  local log_file="${LOG_DIR}/${name}.log"
  echo
  echo "==> ${name}"
  echo "CMD: $*"
  "$@" >"$log_file" 2>&1
  echo "OK: ${name} (log: ${log_file})"
}

echo "Running full validation + build + export pipeline"
echo "Output dir: ${OUT_DIR}"
echo "Godot bin: ${GODOT_BIN}"

run_step lint yarn lint
run_step typecheck yarn exec tsc --noEmit
run_step web_build yarn build
run_step godot_import env HOME=/tmp GODOT_USER_DIR=/tmp/godot "$GODOT_BIN" --headless --path scene --import
run_step godot_smoke yarn run test:godot:smoke
run_step export_ios ./export_godot.sh --target "$EXPORT_DIR" --project ./scene --name BeeGarden --preset iOS --platform ios
run_step export_android ./export_godot.sh --target "$EXPORT_DIR" --project ./scene --name BeeGarden --preset Android --platform android

echo
echo "Pipeline complete."
echo "Artifacts:"
echo "  iOS pack: ${EXPORT_DIR}/ios/BeeGarden.pck"
echo "  Android assets: ${EXPORT_DIR}/android/app/src/main/assets/BeeGarden"
echo "  Logs: ${LOG_DIR}"

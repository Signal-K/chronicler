#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd -P)"
cd "$ROOT_DIR"

PORT="3000"
SURVEY="farm_mechanics_quick"
NO_OPEN=0

VALID_SURVEYS=(
  "farm_mechanics_quick"
  "classification_quick"
  "hive_orders_quick"
  "basics_nps"
)

usage() {
  cat <<USAGE
Usage: $0 [--survey <id|all>] [--port <port>] [--no-open]

Defaults:
  --survey farm_mechanics_quick
  --port 3000

Survey IDs:
  farm_mechanics_quick
  classification_quick
  hive_orders_quick
  basics_nps
USAGE
}

contains_survey() {
  local needle="$1"
  for survey in "${VALID_SURVEYS[@]}"; do
    if [[ "$survey" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --survey)
      SURVEY="$2"
      shift 2
      ;;
    --survey=*)
      SURVEY="${1#*=}"
      shift
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --no-open)
      NO_OPEN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$SURVEY" != "all" ]] && ! contains_survey "$SURVEY"; then
  echo "Invalid --survey value: $SURVEY" >&2
  usage
  exit 1
fi

BASE_URL="http://localhost:${PORT}"
LOG_FILE="/tmp/bee-garden-survey-preview-web-${PORT}.log"

is_server_up() {
  curl -fsS "${BASE_URL}/home" >/dev/null 2>&1
}

if ! is_server_up; then
  echo "Starting web server on port ${PORT}..."
  npm run web -- --port "${PORT}" --clear >"${LOG_FILE}" 2>&1 &
  SERVER_PID=$!
  echo "Server PID: ${SERVER_PID}"
  echo "Server log: ${LOG_FILE}"

  for _ in $(seq 1 90); do
    if is_server_up; then
      break
    fi
    sleep 1
  done
fi

if ! is_server_up; then
  echo "Failed to start web server on ${BASE_URL}. Check ${LOG_FILE}." >&2
  exit 1
fi

URLS=()
if [[ "$SURVEY" == "all" ]]; then
  for survey in "${VALID_SURVEYS[@]}"; do
    URLS+=("${BASE_URL}/home?survey_preview=${survey}")
  done
else
  URLS+=("${BASE_URL}/home?survey_preview=${SURVEY}")
fi

echo "Survey preview URL(s):"
for url in "${URLS[@]}"; do
  echo "  ${url}"
done

if [[ "$NO_OPEN" -eq 1 ]]; then
  exit 0
fi

for url in "${URLS[@]}"; do
  if command -v open >/dev/null 2>&1; then
    open "${url}" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${url}" >/dev/null 2>&1 || true
  fi
done

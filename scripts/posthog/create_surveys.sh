#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd -P)"
cd "$ROOT_DIR"

usage() {
  cat <<USAGE
Usage: $0 [--apply] [--env-file <path>] [--host <https://us.posthog.com>] [--project-id <id>]

Defaults:
  --env-file private/project-env/client.env
  --host from env or https://us.posthog.com

Required env values (from env file or shell):
  POSTHOG_PERSONAL_API_KEY (or Posthog_Personal_API)
  POSTHOG_PROJECT_ID (or Posthog_Project_Id)
USAGE
}

APPLY=0
ENV_FILE="private/project-env/client.env"
HOST_OVERRIDE=""
PROJECT_ID_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      APPLY=1
      shift
      ;;
    --env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    --host)
      HOST_OVERRIDE="$2"
      shift 2
      ;;
    --project-id)
      PROJECT_ID_OVERRIDE="$2"
      shift 2
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

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

POSTHOG_API_KEY="${POSTHOG_PERSONAL_API_KEY:-${Posthog_Personal_API:-}}"
PROJECT_ID="${PROJECT_ID_OVERRIDE:-${POSTHOG_PROJECT_ID:-${Posthog_Project_Id:-}}}"
POSTHOG_HOST="${HOST_OVERRIDE:-${POSTHOG_HOST:-https://us.posthog.com}}"
POSTHOG_HOST="${POSTHOG_HOST%/}"

if [[ "$APPLY" -eq 1 && ( -z "$POSTHOG_API_KEY" || -z "$PROJECT_ID" ) ]]; then
  echo "Missing PostHog credentials. Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID (or screenshot-style variants)." >&2
  exit 1
fi

if [[ "$APPLY" -eq 0 && ( -z "$POSTHOG_API_KEY" || -z "$PROJECT_ID" ) ]]; then
  echo "[DRY RUN] Credentials not set; printing payloads only."
fi

create_survey() {
  local payload="$1"
  local label="$2"

  if [[ "$APPLY" -eq 0 ]]; then
    echo "[DRY RUN] Would create survey: ${label}"
    echo "$payload" | sed -n '1,200p'
    return 0
  fi

  local endpoint="${POSTHOG_HOST}/api/projects/${PROJECT_ID}/surveys/"
  local response
  response="$(
    curl -sS -X POST "$endpoint" \
      -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
      -H "Content-Type: application/json" \
      --data "$payload"
  )"

  echo "Created/updated survey: ${label}"
  echo "$response" | sed -n '1,60p'
}

read -r -d '' MECHANICS_SURVEY <<'JSON' || true
{
  "name": "Quick Feedback: Core Farming",
  "description": "2-question mechanics pulse after till/plant/water/harvest basics.",
  "type": "popover",
  "questions": [
    {
      "type": "single_choice",
      "question": "How clear were till/plant/water/harvest mechanics?",
      "choices": ["Very unclear", "Unclear", "Okay", "Clear", "Very clear"]
    },
    {
      "type": "single_choice",
      "question": "How does early farming pace feel?",
      "choices": ["Too slow", "About right", "Too fast"]
    }
  ]
}
JSON

read -r -d '' CLASSIFICATION_SURVEY <<'JSON' || true
{
  "name": "Quick Feedback: Classification",
  "description": "2-question pulse after the first completed classification.",
  "type": "popover",
  "questions": [
    {
      "type": "single_choice",
      "question": "How confident did you feel during classification?",
      "choices": ["Not confident", "Slightly confident", "Neutral", "Confident", "Very confident"]
    },
    {
      "type": "single_choice",
      "question": "What caused the most friction?",
      "choices": ["Image clarity", "Bee options", "Flow speed", "No major friction"]
    }
  ]
}
JSON

read -r -d '' HIVE_ORDER_SURVEY <<'JSON' || true
{
  "name": "Quick Feedback: Hives and Orders",
  "description": "2-question pulse after bottling and fulfillment basics.",
  "type": "popover",
  "questions": [
    {
      "type": "single_choice",
      "question": "How understandable was bottling and order fulfillment?",
      "choices": ["Very confusing", "Confusing", "Okay", "Clear", "Very clear"]
    },
    {
      "type": "single_choice",
      "question": "How rewarding does order completion feel?",
      "choices": ["Not rewarding", "Somewhat rewarding", "Rewarding", "Very rewarding"]
    }
  ]
}
JSON

read -r -d '' BASICS_NPS_SURVEY <<'JSON' || true
{
  "name": "Basics Completion NPS",
  "description": "NPS-style survey shown after core onboarding and mechanic milestones.",
  "type": "popover",
  "questions": [
    {
      "type": "rating",
      "question": "How likely are you to recommend Bee Garden to a friend?",
      "scale": 10,
      "lower_bound_label": "Not likely",
      "upper_bound_label": "Very likely"
    },
    {
      "type": "single_choice",
      "question": "Which area most needs improvement?",
      "choices": ["Farming", "Classification", "Hives/Orders", "Tutorial/Onboarding"]
    },
    {
      "type": "open",
      "question": "What is the main reason for your score?"
    }
  ]
}
JSON

create_survey "$MECHANICS_SURVEY" "Quick Feedback: Core Farming"
create_survey "$CLASSIFICATION_SURVEY" "Quick Feedback: Classification"
create_survey "$HIVE_ORDER_SURVEY" "Quick Feedback: Hives and Orders"
create_survey "$BASICS_NPS_SURVEY" "Basics Completion NPS"

echo "Done."

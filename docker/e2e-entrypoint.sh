#!/usr/bin/env bash
set -euo pipefail

# Output dirs (mapped to host via -v if desired)
GODOT_USER_DIR="${HOME}/.local/share/godot/app_userdata/bee-garden"
REPORT_PATH="${GODOT_USER_DIR}/e2e_report.md"
SCREENSHOTS_DIR="${GODOT_USER_DIR}/e2e_screenshots"
GODOT_LOG="/tmp/godot_e2e.log"

mkdir -p "${GODOT_USER_DIR}"

echo "═══════════════════════════════════════════"
echo "  Bee Garden — E2E Tour"
echo "  Godot $(godot --version 2>&1 | head -1)"
echo "═══════════════════════════════════════════"

# Run Godot with a virtual display (needed even in headless for rendering/screenshots)
# Xvfb provides a framebuffer so get_viewport().get_texture() works
Xvfb :99 -screen 0 1280x720x24 &
XVFB_PID=$!
export DISPLAY=:99
sleep 1

# Tee stdout+stderr so we capture all Godot output (errors, prints, script errors)
set +e
godot --path /game res://scenes/e2e_tour.tscn 2>&1 | tee "${GODOT_LOG}"
EXIT_CODE=${PIPESTATUS[0]}
set -e

kill "${XVFB_PID}" 2>/dev/null || true

echo ""
echo "═══════════════════════════════════════════"

if [ "${EXIT_CODE}" -eq 0 ]; then
    echo "✅  E2E tour PASSED — no report generated"
    # Screenshots were deleted by the tour script on clean run
    exit 0
else
    echo "❌  E2E tour FAILED — see report below"
    echo ""

    # Append raw Godot log (script errors, warnings) to the report
    if [ -f "${REPORT_PATH}" ]; then
        {
            echo ""
            echo "## Raw Godot Output (errors & warnings)"
            echo ""
            echo '```'
            grep -E "(ERROR|SCRIPT ERROR|WARNING|FAIL)" "${GODOT_LOG}" || echo "(none)"
            echo '```'
        } >> "${REPORT_PATH}"

        echo "── Report ──────────────────────────────────"
        cat "${REPORT_PATH}"
        echo "────────────────────────────────────────────"
        echo ""
        echo "Screenshots saved to: ${SCREENSHOTS_DIR}"
        echo "Report saved to:      ${REPORT_PATH}"
    else
        echo "No report file found. Raw log:"
        cat "${GODOT_LOG}"
    fi

    exit 1
fi

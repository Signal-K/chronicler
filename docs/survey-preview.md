# Survey Preview Command

Use this to open the web app directly into survey previews without performing gameplay steps.

This mode is dev-only and driven by the `survey_preview` query parameter.

## Commands

Open one survey preview (default: `farm_mechanics_quick`):

```bash
npm run survey:preview
```

Open a specific survey preview:

```bash
npm run survey:preview:one -- --survey=classification_quick
```

Open all survey previews:

```bash
npm run survey:preview -- --survey=all
```

Print preview URLs only (do not open browser tabs):

```bash
npm run survey:preview -- --no-open
```

Use a custom port:

```bash
npm run survey:preview -- --port=3001
```

## Supported Survey IDs

- `farm_mechanics_quick`
- `classification_quick`
- `hive_orders_quick`
- `basics_nps`

## Notes

- URL format: `http://localhost:<port>/home?survey_preview=<survey_id>`
- Forced preview mode does not mark the survey as permanently shown.
- Production behavior is unchanged; force preview is ignored outside development mode.

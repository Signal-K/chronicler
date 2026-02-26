# PostHog Survey Scripts

Use `create_surveys.sh` to create the feedback surveys used by the app.

## Required env vars

Set these in a local, git-ignored file such as `private/project-env/client.env`:

- `POSTHOG_PERSONAL_API_KEY` (or `Posthog_Personal_API`)
- `POSTHOG_PROJECT_ID` (or `Posthog_Project_Id`)
- Optional: `POSTHOG_HOST` (default `https://us.posthog.com`)
- Optional for app capture: `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`

## Commands

Dry run (default):

```bash
./scripts/posthog/create_surveys.sh
```

Apply to PostHog:

```bash
./scripts/posthog/create_surveys.sh --apply
```

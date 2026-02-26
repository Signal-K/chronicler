import AsyncStorage from '@react-native-async-storage/async-storage';

const DISTINCT_ID_KEY = 'posthog_distinct_id';
const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = (process.env.EXPO_PUBLIC_POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/+$/, '');

function makeDistinctId(): string {
  return `bg_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

async function getDistinctId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DISTINCT_ID_KEY);
  if (existing) return existing;
  const created = makeDistinctId();
  await AsyncStorage.setItem(DISTINCT_ID_KEY, created);
  return created;
}

export async function capturePosthogEvent(event: string, properties: Record<string, unknown> = {}): Promise<void> {
  if (!POSTHOG_KEY) return;

  try {
    const distinctId = await getDistinctId();
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: 'bee-garden-custom',
          $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
        },
      }),
    });
  } catch {
    // Keep gameplay resilient if analytics is unavailable.
  }
}

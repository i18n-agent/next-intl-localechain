type Messages = Record<string, any>

export function deepMerge(target: Messages, source: Messages): Messages {
  const result = { ...target }

  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] !== null &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key] as Messages, source[key] as Messages)
    } else {
      result[key] = source[key]
    }
  }

  return result
}

interface ResolveOptions {
  locale: string
  chain: string[]
  defaultLocale: string
  loadMessages: (locale: string) => Messages | Promise<Messages>
}

export async function resolveMessages({
  locale,
  chain,
  defaultLocale,
  loadMessages,
}: ResolveOptions): Promise<Messages> {
  // Build loading order: defaultLocale (base) -> chain (low to high priority) -> locale (highest)
  // Deduplicate to avoid loading the same locale twice
  const seen = new Set<string>()
  const loadOrder: string[] = []

  for (const l of [defaultLocale, ...chain.slice().reverse(), locale]) {
    if (!seen.has(l)) {
      seen.add(l)
      loadOrder.push(l)
    }
  }

  // Load all messages, silently skipping failures
  let result: Messages = {}

  for (const l of loadOrder) {
    try {
      const messages = await loadMessages(l)
      result = deepMerge(result, messages)
    } catch {
      // Silent skip — this is a fallback chain, missing locales are expected
    }
  }

  return result
}

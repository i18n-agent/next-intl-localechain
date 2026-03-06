import {
  defaultFallbacks,
  mergeFallbacks,
  type FallbackMap,
} from './fallback-map'
import { resolveMessages } from './message-resolver'

export { defaultFallbacks, mergeFallbacks, type FallbackMap }
export { deepMerge } from './message-resolver'

type Messages = Record<string, any>

export interface LocaleChainConfig {
  loadMessages: (locale: string) => Messages | Promise<Messages>
  defaultLocale: string
  overrides?: FallbackMap
  fallbacks?: FallbackMap
  mergeDefaults?: boolean
}

interface RequestConfigParams {
  requestLocale: Promise<string | undefined>
}

interface RequestConfigResult {
  locale: string
  messages: Messages
}

export function withLocaleChain(
  config: LocaleChainConfig
): (params: RequestConfigParams) => Promise<RequestConfigResult> {
  const { loadMessages, defaultLocale } = config

  // Resolve the effective fallback map
  let effectiveFallbacks: FallbackMap

  if (config.fallbacks) {
    effectiveFallbacks =
      config.mergeDefaults === false
        ? config.fallbacks
        : mergeFallbacks(defaultFallbacks, config.fallbacks)
  } else if (config.overrides) {
    effectiveFallbacks = mergeFallbacks(defaultFallbacks, config.overrides)
  } else {
    effectiveFallbacks = defaultFallbacks
  }

  return async ({ requestLocale }) => {
    const locale = (await requestLocale) || defaultLocale
    const chain = effectiveFallbacks[locale] || []

    const messages = await resolveMessages({
      locale,
      chain,
      defaultLocale,
      loadMessages,
    })

    return { locale, messages }
  }
}

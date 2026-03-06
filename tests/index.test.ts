import { describe, it, expect, vi } from 'vitest'
import { withLocaleChain, defaultFallbacks } from '../src/index'

describe('withLocaleChain', () => {
  const enMessages = {
    common: { save: 'Save', cancel: 'Cancel' },
    profile: { title: 'Profile' },
  }
  const ptMessages = {
    common: { save: 'Guardar' },
  }
  const ptBRMessages = {
    common: { save: 'Salvar' },
  }

  const loadMessages = vi.fn().mockImplementation((locale: string) => {
    if (locale === 'en') return enMessages
    if (locale === 'pt') return ptMessages
    if (locale === 'pt-BR') return ptBRMessages
    throw new Error(`No messages for ${locale}`)
  })

  it('returns an async function', () => {
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
    })
    expect(typeof getRequestConfig).toBe('function')
  })

  it('Mode 1 zero-config defaults - uses default fallback chains (pt-BR -> pt-PT -> pt -> en)', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve('pt-BR'),
    })

    expect(result.locale).toBe('pt-BR')
    // defaultFallbacks for pt-BR is ['pt-PT', 'pt']
    // Load order: en (base) -> pt (chain reversed) -> pt-PT (chain reversed) -> pt-BR (locale)
    // pt-PT will throw (no messages), pt overlays en, pt-BR overlays pt
    expect(result.messages).toEqual({
      common: { save: 'Salvar', cancel: 'Cancel' },
      profile: { title: 'Profile' },
    })
  })

  it('Mode 2 overrides merge with defaults', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
      overrides: {
        'pt-BR': ['pt'], // simpler chain, no pt-PT
      },
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve('pt-BR'),
    })

    expect(result.locale).toBe('pt-BR')
    expect(result.messages).toEqual({
      common: { save: 'Salvar', cancel: 'Cancel' },
      profile: { title: 'Profile' },
    })
  })

  it('Mode 3 full custom fallbacks with mergeDefaults false', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
      fallbacks: {
        'pt-BR': ['pt'],
      },
      mergeDefaults: false,
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve('pt-BR'),
    })

    expect(result.locale).toBe('pt-BR')
    expect(result.messages).toEqual({
      common: { save: 'Salvar', cancel: 'Cancel' },
      profile: { title: 'Profile' },
    })

    // With mergeDefaults: false, only the custom fallbacks are used
    // So fr-CA should have NO chain (empty), just fr-CA + en
    const frResult = await getRequestConfig({
      requestLocale: Promise.resolve('fr-CA'),
    })
    // fr-CA is not in the custom fallbacks, so chain is []
    // Only en is loaded (fr-CA throws)
    expect(frResult.locale).toBe('fr-CA')
    expect(frResult.messages).toEqual(enMessages)
  })

  it('falls back to defaultLocale for unknown locale', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve(undefined),
    })

    expect(result.locale).toBe('en')
    expect(result.messages).toEqual(enMessages)
  })

  it('works when locale equals defaultLocale', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve('en'),
    })

    expect(result.locale).toBe('en')
    expect(result.messages).toEqual(enMessages)
    // en should only be loaded once (not duplicated)
    expect(loadMessages).toHaveBeenCalledTimes(1)
  })

  it('uses explicit locale over requestLocale', async () => {
    loadMessages.mockClear()
    const getRequestConfig = withLocaleChain({
      loadMessages,
      defaultLocale: 'en',
    })

    const result = await getRequestConfig({
      requestLocale: Promise.resolve('pt-BR'),
      locale: 'en',
    })

    expect(result.locale).toBe('en')
    expect(result.messages).toEqual(enMessages)
  })

  it('re-exports defaultFallbacks', () => {
    expect(defaultFallbacks).toBeDefined()
    expect(defaultFallbacks['pt-BR']).toEqual(['pt-PT', 'pt'])
  })
})

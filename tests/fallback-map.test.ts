import { describe, it, expect } from 'vitest'
import { defaultFallbacks, mergeFallbacks, type FallbackMap } from '../src/fallback-map'

describe('defaultFallbacks', () => {
  describe('Portuguese chains', () => {
    it('pt-BR falls back to pt-PT then pt', () => {
      expect(defaultFallbacks['pt-BR']).toEqual(['pt-PT', 'pt'])
    })

    it('pt-PT falls back to pt', () => {
      expect(defaultFallbacks['pt-PT']).toEqual(['pt'])
    })
  })

  describe('Spanish chains', () => {
    it('es-419 falls back to es', () => {
      expect(defaultFallbacks['es-419']).toEqual(['es'])
    })

    it('es-MX falls back to es-419 then es', () => {
      expect(defaultFallbacks['es-MX']).toEqual(['es-419', 'es'])
    })

    it('es-AR falls back to es-419 then es', () => {
      expect(defaultFallbacks['es-AR']).toEqual(['es-419', 'es'])
    })
  })

  describe('French chains', () => {
    it('fr-CA falls back to fr', () => {
      expect(defaultFallbacks['fr-CA']).toEqual(['fr'])
    })

    it('fr-BE falls back to fr', () => {
      expect(defaultFallbacks['fr-BE']).toEqual(['fr'])
    })

    it('fr-CH falls back to fr', () => {
      expect(defaultFallbacks['fr-CH']).toEqual(['fr'])
    })
  })

  describe('German chains', () => {
    it('de-AT falls back to de', () => {
      expect(defaultFallbacks['de-AT']).toEqual(['de'])
    })

    it('de-CH falls back to de', () => {
      expect(defaultFallbacks['de-CH']).toEqual(['de'])
    })
  })

  describe('Other chains', () => {
    it('it-CH falls back to it', () => {
      expect(defaultFallbacks['it-CH']).toEqual(['it'])
    })

    it('nl-BE falls back to nl', () => {
      expect(defaultFallbacks['nl-BE']).toEqual(['nl'])
    })

    it('nb falls back to no', () => {
      expect(defaultFallbacks['nb']).toEqual(['no'])
    })

    it('nn falls back to nb then no', () => {
      expect(defaultFallbacks['nn']).toEqual(['nb', 'no'])
    })
  })

  describe('structural invariants', () => {
    it('all chains are non-empty arrays', () => {
      for (const [locale, chain] of Object.entries(defaultFallbacks)) {
        expect(chain, `chain for ${locale} should be a non-empty array`).toBeInstanceOf(Array)
        expect(chain.length, `chain for ${locale} should not be empty`).toBeGreaterThan(0)
      }
    })

    it('no cyclic fallbacks', () => {
      for (const [locale, chain] of Object.entries(defaultFallbacks)) {
        expect(chain, `chain for ${locale} should not contain itself`).not.toContain(locale)
      }
    })
  })
})

describe('mergeFallbacks', () => {
  it('overrides replace matching keys', () => {
    const defaults: FallbackMap = {
      'pt-BR': ['pt-PT', 'pt'],
      'fr-CA': ['fr'],
    }
    const overrides: FallbackMap = {
      'pt-BR': ['pt'],
    }
    const result = mergeFallbacks(defaults, overrides)
    expect(result['pt-BR']).toEqual(['pt'])
    expect(result['fr-CA']).toEqual(['fr'])
  })

  it('adds new locales from overrides', () => {
    const defaults: FallbackMap = {
      'pt-BR': ['pt-PT', 'pt'],
    }
    const overrides: FallbackMap = {
      'zh-Hant': ['zh-Hans', 'zh'],
    }
    const result = mergeFallbacks(defaults, overrides)
    expect(result['pt-BR']).toEqual(['pt-PT', 'pt'])
    expect(result['zh-Hant']).toEqual(['zh-Hans', 'zh'])
  })

  it('does not mutate original maps', () => {
    const defaults: FallbackMap = {
      'pt-BR': ['pt-PT', 'pt'],
    }
    const overrides: FallbackMap = {
      'pt-BR': ['pt'],
    }
    const defaultsCopy = { ...defaults }
    const overridesCopy = { ...overrides }
    mergeFallbacks(defaults, overrides)
    expect(defaults).toEqual(defaultsCopy)
    expect(overrides).toEqual(overridesCopy)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { deepMerge, resolveMessages } from '../src/message-resolver'

const enMessages = {
  common: { save: 'Save', cancel: 'Cancel', delete: 'Delete' },
  profile: { title: 'Profile', bio: 'Biography' },
}
const ptMessages = {
  common: { save: 'Guardar', cancel: 'Cancelar' },
  profile: { title: 'Perfil' },
}
const ptBRMessages = {
  common: { save: 'Salvar' },
}

describe('deepMerge', () => {
  it('merges flat objects', () => {
    const target = { a: '1', b: '2' }
    const source = { c: '3' }
    expect(deepMerge(target, source)).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('source overrides target for same key', () => {
    const target = { a: '1', b: '2' }
    const source = { b: 'overridden' }
    expect(deepMerge(target, source)).toEqual({ a: '1', b: 'overridden' })
  })

  it('recursively merges nested objects', () => {
    const result = deepMerge(enMessages, ptMessages)
    expect(result).toEqual({
      common: { save: 'Guardar', cancel: 'Cancelar', delete: 'Delete' },
      profile: { title: 'Perfil', bio: 'Biography' },
    })
  })

  it('handles deeply nested objects', () => {
    const target = { a: { b: { c: '1', d: '2' } } }
    const source = { a: { b: { c: 'overridden' } } }
    expect(deepMerge(target, source)).toEqual({
      a: { b: { c: 'overridden', d: '2' } },
    })
  })

  it('does not merge arrays (source wins)', () => {
    const target = { tags: ['a', 'b'] }
    const source = { tags: ['c'] }
    expect(deepMerge(target, source)).toEqual({ tags: ['c'] })
  })

  it('does not mutate inputs', () => {
    const target = { common: { save: 'Save' } }
    const source = { common: { save: 'Guardar' } }
    const targetCopy = JSON.parse(JSON.stringify(target))
    const sourceCopy = JSON.parse(JSON.stringify(source))
    deepMerge(target, source)
    expect(target).toEqual(targetCopy)
    expect(source).toEqual(sourceCopy)
  })
})

describe('resolveMessages', () => {
  it('merges chain messages with correct priority order (pt-BR > pt > en)', async () => {
    const loadMessages = (locale: string) => {
      const map: Record<string, Record<string, any>> = {
        en: enMessages,
        pt: ptMessages,
        'pt-BR': ptBRMessages,
      }
      return map[locale] ?? {}
    }

    const result = await resolveMessages({
      locale: 'pt-BR',
      chain: ['pt'],
      defaultLocale: 'en',
      loadMessages,
    })

    // en is the base, pt overrides, pt-BR overrides pt
    expect(result).toEqual({
      common: { save: 'Salvar', cancel: 'Cancelar', delete: 'Delete' },
      profile: { title: 'Perfil', bio: 'Biography' },
    })
  })

  it('silently skips locales that fail to load', async () => {
    const loadMessages = (locale: string) => {
      if (locale === 'pt') throw new Error('File not found')
      const map: Record<string, Record<string, any>> = {
        en: enMessages,
        'pt-BR': ptBRMessages,
      }
      return map[locale] ?? {}
    }

    const result = await resolveMessages({
      locale: 'pt-BR',
      chain: ['pt'],
      defaultLocale: 'en',
      loadMessages,
    })

    // pt failed, so only en + pt-BR
    expect(result).toEqual({
      common: { save: 'Salvar', cancel: 'Cancel', delete: 'Delete' },
      profile: { title: 'Profile', bio: 'Biography' },
    })
  })

  it('returns only default locale messages when all chain locales fail', async () => {
    const loadMessages = (locale: string) => {
      if (locale === 'pt') throw new Error('File not found')
      if (locale === 'pt-BR') throw new Error('File not found')
      const map: Record<string, Record<string, any>> = {
        en: enMessages,
      }
      return map[locale] ?? {}
    }

    const result = await resolveMessages({
      locale: 'pt-BR',
      chain: ['pt'],
      defaultLocale: 'en',
      loadMessages,
    })

    expect(result).toEqual(enMessages)
  })

  it('handles async loadMessages', async () => {
    const loadMessages = async (locale: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      const map: Record<string, Record<string, any>> = {
        en: enMessages,
        pt: ptMessages,
        'pt-BR': ptBRMessages,
      }
      return map[locale] ?? {}
    }

    const result = await resolveMessages({
      locale: 'pt-BR',
      chain: ['pt'],
      defaultLocale: 'en',
      loadMessages,
    })

    expect(result).toEqual({
      common: { save: 'Salvar', cancel: 'Cancelar', delete: 'Delete' },
      profile: { title: 'Perfil', bio: 'Biography' },
    })
  })

  it('does not duplicate defaultLocale in loading order (call count check)', async () => {
    const loadMessages = vi.fn((locale: string) => {
      const map: Record<string, Record<string, any>> = {
        en: enMessages,
      }
      return map[locale] ?? {}
    })

    await resolveMessages({
      locale: 'en',
      chain: ['en'],
      defaultLocale: 'en',
      loadMessages,
    })

    // en appears as defaultLocale, in chain, and as locale — but should only be loaded once
    expect(loadMessages).toHaveBeenCalledTimes(1)
  })

  it('returns empty object when defaultLocale also fails', async () => {
    const loadMessages = (_locale: string) => {
      throw new Error('All locales fail')
    }

    const result = await resolveMessages({
      locale: 'pt-BR',
      chain: ['pt'],
      defaultLocale: 'en',
      loadMessages,
    })

    expect(result).toEqual({})
  })
})

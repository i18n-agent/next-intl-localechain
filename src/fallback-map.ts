export type FallbackMap = Record<string, string[]>

export const defaultFallbacks: FallbackMap = {
  // Portuguese
  'pt-BR': ['pt-PT', 'pt'],
  'pt-PT': ['pt'],

  // Spanish (Latin America uses es-419 as intermediate)
  'es-419': ['es'],
  'es-MX': ['es-419', 'es'],
  'es-AR': ['es-419', 'es'],
  'es-CO': ['es-419', 'es'],
  'es-CL': ['es-419', 'es'],
  'es-PE': ['es-419', 'es'],
  'es-VE': ['es-419', 'es'],
  'es-EC': ['es-419', 'es'],
  'es-GT': ['es-419', 'es'],
  'es-CU': ['es-419', 'es'],
  'es-BO': ['es-419', 'es'],
  'es-DO': ['es-419', 'es'],
  'es-HN': ['es-419', 'es'],
  'es-PY': ['es-419', 'es'],
  'es-SV': ['es-419', 'es'],
  'es-NI': ['es-419', 'es'],
  'es-CR': ['es-419', 'es'],
  'es-PA': ['es-419', 'es'],
  'es-UY': ['es-419', 'es'],
  'es-PR': ['es-419', 'es'],

  // French
  'fr-CA': ['fr'],
  'fr-BE': ['fr'],
  'fr-CH': ['fr'],
  'fr-LU': ['fr'],
  'fr-MC': ['fr'],
  'fr-SN': ['fr'],
  'fr-CI': ['fr'],
  'fr-ML': ['fr'],
  'fr-CM': ['fr'],
  'fr-MG': ['fr'],
  'fr-CD': ['fr'],

  // German
  'de-AT': ['de'],
  'de-CH': ['de'],
  'de-LU': ['de'],
  'de-LI': ['de'],

  // Italian
  'it-CH': ['it'],

  // Dutch
  'nl-BE': ['nl'],

  // Norwegian
  nb: ['no'],
  nn: ['nb', 'no'],

  // Malay
  'ms-MY': ['ms'],
  'ms-SG': ['ms'],
  'ms-BN': ['ms'],
}

export function mergeFallbacks(
  defaults: FallbackMap,
  overrides: FallbackMap
): FallbackMap {
  return { ...defaults, ...overrides }
}

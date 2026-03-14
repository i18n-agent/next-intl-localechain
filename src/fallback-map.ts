export type FallbackMap = Record<string, string[]>

export const defaultFallbacks: FallbackMap = {
  // Chinese
  'zh-Hant-HK': ['zh-Hant-TW', 'zh-Hant'],
  'zh-Hant-MO': ['zh-Hant-HK', 'zh-Hant-TW', 'zh-Hant'],
  'zh-Hant-TW': ['zh-Hant'],
  'zh-Hans-SG': ['zh-Hans'],
  'zh-Hans-MY': ['zh-Hans'],

  // Portuguese
  'pt-BR': ['pt-PT', 'pt'],
  'pt-PT': ['pt'],
  'pt-AO': ['pt-PT', 'pt'],
  'pt-MZ': ['pt-PT', 'pt'],

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

  // English
  'en-GB': ['en'],
  'en-AU': ['en-GB', 'en'],
  'en-NZ': ['en-AU', 'en-GB', 'en'],
  'en-IN': ['en-GB', 'en'],
  'en-CA': ['en'],
  'en-ZA': ['en-GB', 'en'],
  'en-IE': ['en-GB', 'en'],
  'en-SG': ['en-GB', 'en'],

  // Arabic
  'ar-SA': ['ar'],
  'ar-EG': ['ar'],
  'ar-AE': ['ar'],
  'ar-MA': ['ar'],
  'ar-DZ': ['ar'],
  'ar-IQ': ['ar'],
  'ar-KW': ['ar'],
  'ar-QA': ['ar'],
  'ar-BH': ['ar'],
  'ar-OM': ['ar'],
  'ar-JO': ['ar'],
  'ar-LB': ['ar'],
  'ar-TN': ['ar'],
  'ar-LY': ['ar'],
  'ar-SD': ['ar'],
  'ar-YE': ['ar'],

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

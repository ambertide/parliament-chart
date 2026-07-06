const getSuffixesToPluralRules: (locale: string) => Partial<Record<Intl.LDMLPluralRule, string>> = (locale: string) => {
  switch (locale) {
    case 'tr':
      return {
        'other': '.'
      };
    case 'en':
    default:
      return {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th"};
  }
};

const suffixesWithDefaults: (locale:string) => Record<Intl.LDMLPluralRule, string> = (locale: string) => {
  const overloads = getSuffixesToPluralRules(locale);
  return {
    one: '',
    two: '',
    few: '',
    many: '',
    other: '',
    zero: '',
    ...overloads
  }; 
};

/** Given an ordinal number, return the string variant with that number. */
export const parseOrdinal = (t: number, locale: string = 'en'): string => {
  // TODO: Handle languages here.
  const ordinalityRules = new Intl.PluralRules(locale, {type: "ordinal"});
  const suffix = (
    suffixesWithDefaults(locale)
  )[ordinalityRules.select(t)];
  return `${t}${suffix}`;
};

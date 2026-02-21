
/** Given an ordinal number, return the string variant with that number. */
export const parseOrdinal = (t: number): string => {
  // TODO: Handle languages here.
  const ordinalityRules = new Intl.PluralRules("en", {type: "ordinal"})
  const suffix = ({
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
    // This is empty for english.
    many: "",
    zero: ""
  })[ordinalityRules.select(t)]
  return `${t}${suffix}`
}

import { FC } from "react"

type CommonGovernmentProps = {
  headOfGovernment: string,
  // Ecevit (II) or Yılmaz are valid canonical names
  // This should work until VIII, I may update later
  canonicalName: `${string}` | `${string} (${"I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII"})`,
  supportingParties: string[]
}

// Pre-2016 Priministerial governments
type WestministerialGovernment = {
  // Props for vote of confidence:
  // This may be false for minority governments
  // formed right after elections, such as Ecevit (II)
  hasPassedVoC: boolean,
  // Transitional governments need not to pass
  // votes of confidence like Davutoğlu (II)
  needsToPassVoc: boolean,
  vocVotes: {
    for: number,
    quorum: number
  }
  ministerialBreakdown: Record<string, number>
} & CommonGovernmentProps

type PresidentialGovernment = CommonGovernmentProps

type Government = WestministerialGovernment | PresidentialGovernment

type TermMetadata = {
  term: number,
  governmentsUnderTerm: Government[]
}
type CombinedSelectTypes = {
  terms: TermMetadata[]
}

/** Given an ordinal number, return the string variant with that number. */
const parseOrdinal = (t: number): string => {
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

export const CombinedSelect: FC<CombinedSelectTypes> = ({
  terms
}) => (
  <select
    className={`
        [appearance:base-select]
        [&::picker-icon]:hidden
        [&::picker(select)]:[appearance:base-select] [&::picker(select)]:w-3xs [&::picker(select)]:overflow-auto [&::picker(select)]:border [&::picker(select)]:border-solid [&::picker(select)]:border-background-secondary [&::picker(select)]:bg-background
    `}
  >
    <button>
      {/** @ts-ignore: unclear support for @types/react */}
      <selectedcontent />
    </button>
    {terms.map(({
      term,
      governmentsUnderTerm
    }) => (
      <optgroup
        className={String.raw`
            group
            text-emphasis italic font-normal
            before:absolute before:right-2 before:not-italic before:font-[Material_Symbols_Outlined] before:content-['\E5C6'] data-is-collapsed:before:rotate-180
        `}
        key={term}
        data-is-collapsed={false}
        onClick={e => {
          if (e.target instanceof HTMLOptGroupElement) {
            // Nested option element clicks bubble up to here.
            // so extra check here is nice.
            const { isCollapsed = false } = e.target.dataset;
            if (isCollapsed) {
              delete e.target.dataset.isCollapsed;
            } else {
              e.target.dataset.isCollapsed = "true"
            }
          } else if (e.target instanceof HTMLOptionElement) {
            // Here we need an extra set to set the selectedcontets's innerText
            // to the name of the term, so.
            const selectedContent = e.target.closest('selectedcontent');
            if (selectedContent) {
              selectedContent.textContent = `${parseOrdinal(term)} Term`
            }
          }
        }}
        label={`${parseOrdinal(term)} Term`}
      >
        {governmentsUnderTerm.map(({
          canonicalName
        }) => (
          <option
            key={canonicalName}
            className="text-foreground not-italic group-data-is-collapsed:hidden"
            data-term={term}
          >
            {canonicalName}
          </option>
        )
        )}
      </optgroup>
    ))}
  </select>
)
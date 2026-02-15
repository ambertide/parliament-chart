import { CombinedSelect } from "./CombinedSelect"

export const Menu = () => (
  <menu>
    <CombinedSelect terms={[
      {
        term: 16,
        governmentsUnderTerm: [
          {
            canonicalName: "Ecevit (II)",
            hasPassedVoC: false,
            needsToPassVoc: true,
            vocVotes: {
              for: 217,
              quorum: 448
            },
            ministerialBreakdown: {
              "CHP": 25
            },
            headOfGovernment: "Bülent Ecevit",
            supportingParties: ["CHP"]
          },
          {
            canonicalName: "Demirel (V)",
            hasPassedVoC: true,
            needsToPassVoc: true,
            vocVotes: {
              for: 217,
              quorum: 448
            },
            ministerialBreakdown: {
              "AP": 20,
              "MSP": 8,
              "MHP": 5
            },
            headOfGovernment: "Bülent Ecevit",
            supportingParties: ["AP", "MSP", "MHP"]
          }
        ]
      }
    ]} />
  </menu>
)
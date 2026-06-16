# Parlevent Engine

Changes in the ParliChart is initially stored as events, which are then parsed
by the Parlevent Engine to generate snapshots of the parliament in a certain date:

```ts
type ParleventType = "OFFICE_ASSUMED" | "OFFICE_VACATED" | ...


type Parlevent = {
  action: ParleventType,
  actor: string,
  target: string,
  metadata: {
    ...
  },
  citation: string
}
```

Event types are as follows:

| Type                      | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `OFFICE_ASSUMED`          | Denotes when an MP assumes office for a specific term |
| `OFFICE_VACATED`          | Denotes when an MP leaves office for whatever reason  |
| `TERM_START`              | Denotes the start of a parliamentary term             |
| `GOVERNMENT_FORMED`       | Denotes the creation of a parliamentary term          |
| `MINISTER_ASSUMED_OFFICE` |  Minister assuming ministerial office                 |
| `PARTY_CHANGED`           |  Denotes an MP switching parties                      |

## Notes on Party Changes

Party Changes are not publicly denoted by the Grand National Assembly,
as a result they are sourced either through wikipedia or third party
websites.

Following party change reasons are differentiated:

- `PREMIERSHIP` denotes an MP switching to another party as a result of being elected
  to the position of that party's premier, or co-premier, or in case they leave the premiership
  of their party and return to their "original" party.
- `ALLIANCE` denotes those parties which have joined the elections of the 28th and 27th
  terms of the Assembly as a party of another party's rolls and had been the part of a same
  alliance with that party.
- `RESIGNATION` denote MPs which resign from their party and become independent
- `SUPPLY` denotes an MP switching to a party to supply their electoral group in the
  grand national assembly
- `OTHER` denotes other

## Notes on Offices Being Vacated

Seats may be vacated by the members of parliament, following reasons can be noted in the
metadata for a vacated seat:

- `PASSED` Indicates a member of parliament passing away, thereby causing a vacant seat.
- `RESIGNATION` Members of parliament may resign from their post, as of the 28th parliament
  this event occurs due to constitutional provisions forbiding a member of the legislative
  to simultaniously serve in mayoral duties or as a member of executive (ie: as a minister)
- `TERM_END` Denotes a seat being vacated because the term ended in the Grand National
  Assembly of Turkey
- `MEMBERSHIP_LOSS` Denotes a seat vacated due to a member of parliament losing their
  membership to the Grand National Assembly in accordence with the Article 84 of the
  Constitution

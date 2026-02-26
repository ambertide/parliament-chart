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

| Type | Description
| ===== | ====== |
| `OFFICE_ASSUMED` | Denotes when an MP assumes office for a specific term |
| `OFFICE_VACATED` | Denotes when an MP leaves office for whatever reason |
| `TERM_START` | Denotes the start of a parliamentary term |
| `GOVERNMENT_FORMED` | Denotes the creation of a parliamentary term |
| `MINISTER_ASSUMED_OFFICE` | Minister assuming ministerial office

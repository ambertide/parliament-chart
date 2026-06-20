
export type RepresentativeRecord = {
  partyColor: string;
  party: string;
  name: string;
  province: string;
  endOfTermStatus: string;
  term: number;
};

export type PartyRecord = {
  representativeCount: number;
  partyColor: string;
  partyName: string;
  groupName: string;
  allianceName: string;
};

export type PartySummaryRecord = {
  canonicalShortName: string;
  canonicalLongName: string;
  color: string;
};

export type ProvinceRecord = {
  provinceName: string;
  representativeCount: number;
  partyDistribution: Record<string, number>;
};

type ParleventCommon = {
  date: Date;
  source?: string;
};

type ParleventTermStart = {
  action: "TERM_STARTED";
  actor: string; // Term number,
  target: "Parliament";
  metadata: {
    governmentType: string;
    numberOfRepresentatives: number;
  };
} & ParleventCommon;

type ParleventTermEnded = {
  action: "TERM_ENDED";
  actor: string; // Term number,
  target: "Parliament";
  metadata: Record<string, never>;
} & ParleventCommon;

type ParleventOfficeAssumed = {
  action: "OFFICE_ASSUMED";
  actor: string;
  target: "Parliament";
  metadata: {
    electoralDistrict: string;
    party: string;
  };
} & ParleventCommon;

type ParleventPartyChanged = {
  action: "PARTY_CHANGED";
  actor: string;
  target: string; // Party name
  metadata: {
    reason: "ALLIANCE"; // Why change happened?
    from?: string // Sometimes names collide so we have a from
  };
} & ParleventCommon;

type ParleventOfficeVacated = {
  action: "OFFICE_VACATED";
  actor: string;
  target: "Parliament";
  metadata: {
    reason: "PASSED" | "TERM_END" | "RESIGNED" | "MEMBERSHIP_LOSS";
  };
} & ParleventCommon;

type ParleventAllianceFounded = {
  action: "ALLIANCE_ESTABLISHED";
  actor: string;
  target: "Parliament";
  metadata: Record<string, never>;
} & ParleventCommon;

type ParleventAllianceDisbanded = {
  action: "ALLIANCE_DISBANDED";
  actor: string;
  target: "Parliament";
  metadata: Record<string, never>;
} & ParleventCommon;

type ParleventPartyJoinedAlliance = {
  action: "PARTY_JOINED_ALLIANCE";
  actor: string;
  target: string;
  metadata: Record<string, never>;
} & ParleventCommon;

type ParleventPartyLeftAlliance = {
  action: "PARTY_LEFT_ALLIANCE";
  actor: string;
  target: string;
  metadata: Record<string, never>;
} & ParleventCommon;

export type Parlevent =
  | ParleventOfficeAssumed
  | ParleventTermStart
  | ParleventOfficeVacated
  | ParleventTermEnded
  | ParleventAllianceFounded
  | ParleventAllianceDisbanded
  | ParleventPartyJoinedAlliance
  | ParleventPartyLeftAlliance
  | ParleventPartyChanged;


export type Vacancy = {
  province: string,
  term: number, 
  lastOfficeHolder: RepresentativeRecord,
  officeVacatedEvent: ParleventOfficeVacated
};
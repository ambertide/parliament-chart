import { parties } from "@/assets/partyUtils.json";
export const partyShortName = (partyName: string): string =>
  parties.find(({ canonicalLongName }) => canonicalLongName === partyName)
    ?.canonicalShortName ?? partyName;

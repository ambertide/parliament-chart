import { Party, Representative } from '@/types';
import {MapSvg} from '../../assets/images/MapSvg';
import { FC, useLayoutEffect, useMemo } from 'react';

type ParliamentMapProps = {
  representatives: Representative[],
  parties: Party[]
};

const nameToASCII = (n: string) => (
  n.replaceAll('İ', 'I')
);

export const ParliamentMap: FC<ParliamentMapProps> = ({ representatives }) => {
  useLayoutEffect(() => {
    const maybeProvinces = document.querySelectorAll('.parliament-map g');
    const seatsMap = maybeProvinces
      .values()
      .filter(e => e.id.endsWith('_seats'))
      .reduce((accum, e) => accum.set(e.id.replace('_seats', ''), e
        .querySelectorAll('circle')
        .values()
        .toArray()
        .toSorted(
          (
            {cy: CYa, cx: CXa},
            {cy: CYb, cx: CXb}
          ) => CYb.baseVal.value === CYa.baseVal.value
            ? (CXa.baseVal.value - CXb.baseVal.value)
            : (CYa.baseVal.value - CYb.baseVal.value))
        .toReversed()
      )
      , new Map()
      );
    console.log(seatsMap);
    representatives.forEach(({ province, party }) => {
      if (province) {
        const maybeSeatsOfProvinces: SVGCircleElement[] = seatsMap.get(nameToASCII(province)?.replace(' ', '_').toLowerCase());
        const nextSeatToColor = maybeSeatsOfProvinces?.pop();
        if (nextSeatToColor) {
          nextSeatToColor.style.fill = party.partyColor;
        }
      }
    });
  }, []);
  return (
    <div
      className="my-5 parliament-map"
    >
      <MapSvg />
    </div>
  );
};
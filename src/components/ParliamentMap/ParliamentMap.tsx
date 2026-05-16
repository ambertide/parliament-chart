import { Party, Representative } from '@/types';
import {MapSvg} from '../../assets/images/MapSvg';
import { FC, useCallback, useEffect } from 'react';

type ParliamentMapProps = {
  representatives: Representative[],
  parties: Party[]
};

const nameToASCII = (n: string) => (
  n.replaceAll('İ', 'I')
    .replaceAll('ı', 'i')
    .replaceAll('Ç', 'C')
    .replaceAll('ç', 'c')
    .replaceAll('Ş', 'S')
    .replaceAll('ş', 's')
    .replaceAll('Ü', 'U')
    .replaceAll('ü', 'u')
    .replaceAll('Ö', 'O')
    .replaceAll('ö', 'o')
    .replaceAll('Ğ', 'G')
    .replaceAll('ğ', 'g')
    .replaceAll(' ', '_')
    .replaceAll('(I)', '(i)')
    .replaceAll('(II)', '(ii)')
    .replaceAll('(III)', '(iii)')
    .replaceAll('â', 'a')

);

export const ParliamentMap: FC<ParliamentMapProps> = ({ representatives }) => {
  const onColourSeatsRequests = useCallback(() => {
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
    representatives.forEach(({ province, party }) => {
      if (province) {
        const maybeSeatsOfProvinces: SVGCircleElement[] = seatsMap.get(nameToASCII(province)?.replace(' ', '_').toLowerCase());
        const nextSeatToColor = maybeSeatsOfProvinces?.pop();
        if (nextSeatToColor) {
          nextSeatToColor.style.fill = party.partyColor;
        } else {
          debugger;
        }
      }
    });
  }, [
    representatives
  ]);
  useEffect(() => {
    onColourSeatsRequests();
  }, [onColourSeatsRequests]);
  return (
    <div
      className="my-5 parliament-map"
    >
      <MapSvg />
    </div>
  );
};
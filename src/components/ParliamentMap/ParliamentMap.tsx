import { Party, Representative } from '@/types';
import {MapSvg} from '../../assets/images/MapSvg';
import { FC } from 'react';
import { useFillPaintSeats } from '@/hooks';

type ParliamentMapProps = {
  representatives: Representative[],
  parties: Party[]
};


export const ParliamentMap: FC<ParliamentMapProps> = ({ representatives }) => {
  useFillPaintSeats(representatives);
  return (
    <div
      className="my-5 parliament-map"
    >
      <MapSvg />
    </div>
  );
};
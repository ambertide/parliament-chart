import { Representative } from '@/types';
import {MapSvg} from '../../assets/images/MapSvg';
import { FC } from 'react';
import { useFillPaintSeats } from '@/hooks';
import { Attribution } from './Attribution';

type ParliamentMapProps = {
  representatives: Representative[]
};


export const ParliamentMap: FC<ParliamentMapProps> = ({ representatives }) => {
  useFillPaintSeats(representatives);
  return (
    <div
      className="parliament-map relative flex flex-col items-center w-full"
    >
      <MapSvg />
      <Attribution />
    </div>
  );
};
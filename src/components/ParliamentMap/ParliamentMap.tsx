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
      className="my-5 parliament-map relative flex flex-col items-center"
    >
      <MapSvg />
      <Attribution />
    </div>
  );
};
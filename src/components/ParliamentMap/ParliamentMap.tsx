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
      <svg viewBox="0 0 552 323" fill="none" xmlns="http://www.w3.org/2000/svg">
        <MapSvg />
        {representatives.map(({ mapLocation: { x: cx, y: cy }}, key) => <circle cx={cx} cy={cy} r={0.25} key={key}/>)}
      </svg>
      <Attribution />
    </div>
  );
};
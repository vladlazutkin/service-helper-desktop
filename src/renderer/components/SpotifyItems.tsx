import React from 'react';
import Stack from '@mui/material/Stack';
import { SpotifyTrack } from '../interfaces';
import update from 'immutability-helper';
import SpotifyTrackRow from './SpotifyTrack';

interface SpotifyItemsProps {
  tracks: SpotifyTrack[];
  onTracksUpdate: (tracks: SpotifyTrack[]) => void;
}

const SpotifyItems = ({ tracks, onTracksUpdate }: SpotifyItemsProps) => {
  const moveTrack = (dragIndex: number, hoverIndex: number) => {
    onTracksUpdate(
      update(tracks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, tracks[dragIndex]],
        ],
      })
    );
  };

  return (
    <Stack spacing={2}>
      {tracks.map((track, index) => (
        <SpotifyTrackRow
          key={`${track.id}`}
          index={index}
          track={track}
          moveTrack={moveTrack}
          removeTrack={(id) =>
            onTracksUpdate(tracks.filter((t) => t.id !== id))
          }
        />
      ))}
    </Stack>
  );
};

export default SpotifyItems;

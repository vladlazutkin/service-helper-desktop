import React, { SyntheticEvent, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Identifier, XYCoord } from 'dnd-core';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { SpotifyTrack } from '../interfaces';

interface SpotifyTrackProps {
  track: SpotifyTrack;
  index: number;
  removeTrack: (id: string) => void;
  moveTrack: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const SpotifyTrackRow = ({
  track,
  index,
  removeTrack,
  moveTrack,
}: SpotifyTrackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'track',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTrack(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'track',
    item: () => {
      return { id: track.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handlePlay = (e: SyntheticEvent<HTMLAudioElement>) => {
    const audios = document.getElementsByTagName('audio');
    Array.from(audios).forEach((audio) => {
      if (audio !== e.target) {
        audio.pause();
      }
    });
  };

  return (
    <div
      ref={ref}
      style={{ opacity, cursor: 'pointer' }}
      data-handler-id={handlerId}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">{index + 1}.</Typography>
            <img width="64" height="64" src={track.imageUrl} alt={track.name} />
            <Typography variant="h6">
              {track.artistName} - {track.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <audio
              onPlay={handlePlay}
              draggable
              onDragStart={(event) => event.preventDefault()}
              style={{ height: '40px' }}
              controls
              src={track.previewUrl}
            />
            <DeleteIcon onClick={() => removeTrack(track.id)} />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Link color="#fff" target="_blank" href={track.externalUrl}>
            Listen on spotify
          </Link>
          <DehazeIcon />
        </Stack>
      </Stack>
    </div>
  );
};

export default SpotifyTrackRow;

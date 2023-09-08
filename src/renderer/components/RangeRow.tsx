import React, { ChangeEvent } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { formatTime } from '../helpers/formatTime';
import Button from '@mui/material/Button';
import { Range } from '../interfaces';
import LinearProgressWithLabel from './LinearProgressWithLabel';

interface RangeRowProps {
  range: Range;
  recognizeProgress?: number;
  index: number;
  activeRange: string;
  hasRecognizeResponse: boolean;
  hasSpotifySearchResponse: boolean;
  removeRange: (id: string) => () => void;
  handleChangeRange: (
    index: number
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeActiveRange: (id: string) => () => void;
  handleOpenSpotifyResults: (id: string) => () => void;
  handleOpenRecognizeResults: (id: string) => () => void;
}

const step = 5;

const RangeRow = ({
  range,
  index,
  activeRange,
  removeRange,
  handleChangeRange,
  hasRecognizeResponse,
  hasSpotifySearchResponse,
  recognizeProgress = 0,
  handleChangeActiveRange,
  handleOpenSpotifyResults,
  handleOpenRecognizeResults,
}: RangeRowProps) => {
  return (
    <Stack direction="row" spacing={3} alignItems="center" key={range.id}>
      <TextField
        type="time"
        label="Start"
        variant="filled"
        inputProps={{
          step,
        }}
        onChange={handleChangeRange(index * 2)}
        value={formatTime(range.start, true)}
      />
      <TextField
        type="time"
        label="Stop"
        variant="filled"
        inputProps={{
          step,
        }}
        onChange={handleChangeRange(index * 2 + 1)}
        value={formatTime(range.stop, true)}
      />
      <Button
        variant="contained"
        component="label"
        onClick={removeRange(range.id)}
      >
        Remove fragment
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            checked={activeRange === range.id}
            onChange={handleChangeActiveRange(range.id)}
          />
        }
        label="Active"
      />
      {recognizeProgress > 0 && recognizeProgress < 100 && (
        <LinearProgressWithLabel
          color="info"
          title="Recognize progress"
          value={recognizeProgress}
        />
      )}
      {hasRecognizeResponse && (
        <Button
          variant="contained"
          component="label"
          onClick={handleOpenRecognizeResults(range.id)}
        >
          Open recognize results
        </Button>
      )}
      {hasSpotifySearchResponse && (
        <Button
          variant="contained"
          component="label"
          onClick={handleOpenSpotifyResults(range.id)}
        >
          Open spotify results
        </Button>
      )}
    </Stack>
  );
};

export default RangeRow;

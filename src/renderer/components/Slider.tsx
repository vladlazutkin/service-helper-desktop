import React, { DetailedHTMLProps, HTMLProps, RefCallback } from 'react';
import ReactSlider from 'react-slider';
import styled from '@emotion/styled';
import { formatTime } from '../helpers/formatTime';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number[];
  onChange: (newValue: number[]) => void;
}

interface HTMLPropsWithRefCallback<T> extends HTMLProps<T> {
  ref: RefCallback<T>;
}

const Slider = ({ min, max, step, value, onChange }: SliderProps) => {
  return (
    <StyledContainer>
      <StyledSlider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(value) => onChange(value as number[])}
        renderTrack={Track}
        renderThumb={Thumb}
      />
    </StyledContainer>
  );
};

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 10px;
`;

const StyledThumb = styled.div`
  top: -10px;
  background: #ff1a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 5px;
  color: white;
  cursor: pointer;
`;

function Thumb<T>(
  props: HTMLPropsWithRefCallback<HTMLDivElement>,
  state: { index: number; value: T; valueNow: number }
) {
  return (
    <StyledThumb
      {...(props as DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >)}
    >
      {formatTime(state.valueNow)}
    </StyledThumb>
  );
}

function Track<T>(props: HTMLPropsWithRefCallback<HTMLDivElement>) {
  return (
    <StyledTrack
      {...(props as DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >)}
    />
  );
}

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: #ddd;
  border-radius: 5px;
`;

const StyledContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export default Slider;

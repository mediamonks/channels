import { useRef } from 'react';
import { Analyser } from '@mediamonks/channels/dist/Analyser';
import { useInterval } from '../../hooks/useInterval';

type Props = {
  width: number;
  height: number;
  analyser: Analyser;
};

const draw = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: Float32Array
) => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'white';
  context.beginPath();

  const halfHeight = height * 0.5;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const point = {
      x: (i / data.length) * width,
      y: value * height + halfHeight,
    };
    if (i === 0) {
      context.moveTo(0, halfHeight);
    } else {
      context.lineTo(point.x, point.y);
    }
  }
  context.stroke();
  context.closePath();
};

export const WaveView = ({ width, height, analyser }: Props) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>();

  useInterval(() => {
    if (!contextRef.current) {
      return;
    }
    draw(contextRef.current, width, height, analyser.getWaveData());
  }, 10);

  return (
    <canvas
      style={{ marginTop: 10 }}
      ref={canvas => {
        contextRef.current = canvas?.getContext('2d');
      }}
      width={width}
      height={height}
    />
  );
};

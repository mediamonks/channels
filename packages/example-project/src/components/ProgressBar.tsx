type Props = {
  progress: number;
  backgroundColor?: string;
  foregroundColor: string;
  height: number;
};

export const ProgressBar = ({
  progress,
  foregroundColor,
  backgroundColor,
  height,
}: Props) => {
  return (
    <div style={{ backgroundColor, height }}>
      <div
        style={{
          backgroundColor: foregroundColor,
          color: 'white',
          width: `${progress * 100}%`,
          height,
        }}
      />
    </div>
  );
};

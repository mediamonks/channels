type Props = {
  mute: () => void;
  unmute: () => void;
};

export const MuteButtons = ({ mute, unmute }: Props) => {
  return (
    <div>
      <button onClick={mute}>mute</button>
      <button onClick={unmute}>unmute</button>
    </div>
  );
};

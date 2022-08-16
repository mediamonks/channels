import { PlayingSample, Sample, SoundChannel } from '../types';

type PlaySampleOptions = {
  channel?: SoundChannel;
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export const playSample = (
  context: AudioContext,
  sample: Sample,
  { fadeInTime = 0, loop = false, volume = 1, channel }: PlaySampleOptions
): PlayingSample => {
  if (!sample.audioBuffer) {
    throw new Error(`Sample '${sample.name}' is not loaded`);
  }

  const tester = 1;

  const bufferSourceNode = context.createBufferSource();
  const gainNode = context.createGain();

  gainNode.gain.setValueAtTime(volume, 0);

  gainNode.connect(channel ? channel.gain : context.destination);
  bufferSourceNode.connect(gainNode);
  bufferSourceNode.buffer = sample.audioBuffer;
  bufferSourceNode.loop = loop;

  const playingSample: PlayingSample = {
    context,
    sample,
    bufferSourceNode,
    gainNode,
    channel: channel || undefined,
    // todo: stop method
  };

  // if (fadeInTime) {
  //   gain.gain.setValueAtTime(0, 0);
  //   // fadeGain(gain, 1, fadeInTime);
  //   const volume = {
  //     value: 0,
  //   };
  //   const tween = TweenLite.to(volume, fadeInTime, {
  //     value: 1,
  //     ease: Linear.easeNone,
  //     onUpdate: () => {
  //       gain.gain.setValueAtTime(volume.value, tween.time());
  //     },
  //   });
  // } else {
  //   gain.gain.setValueAtTime(volume, 0);
  // }

  bufferSourceNode.start(0);
  return playingSample;
};

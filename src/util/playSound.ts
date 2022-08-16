import { PlayingSound, Sound, SoundChannel } from '../types';

type PlaySoundOptions = {
  channel?: SoundChannel;
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export const playSound = (
  context: AudioContext,
  sound: Sound,
  { loop = false, volume = 1, channel }: PlaySoundOptions
): PlayingSound => {
  if (!sound.audioBuffer) {
    throw new Error(`Sound '${sound.name}' is not loaded`);
  }

  // create buffer source
  const bufferSourceNode = context.createBufferSource();
  bufferSourceNode.buffer = sound.audioBuffer;
  bufferSourceNode.loop = loop;

  // create gain
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(volume, 0);

  // connect nodes
  gainNode.connect(channel ? channel.gain : context.destination);
  bufferSourceNode.connect(gainNode);

  const playingSound: PlayingSound = {
    context,
    sound,
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
  return playingSound;
};

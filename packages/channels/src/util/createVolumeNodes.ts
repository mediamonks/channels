import { AudioContext } from './audioContext';
import { VolumeControls } from '../types';

/**
 * Creates an effects chain with 2 gain nodes: one for volume, one for muting.
 * Having a separate gain for mute allows us to get back to the original volume
 * value when muting and then unmuting.
 * @param audioContext
 */
export const createVolumeNodes = (
  audioContext: AudioContext
): VolumeControls => {
  const volume = audioContext.createGain();
  const mute = audioContext.createGain();

  volume.connect(mute);

  return {
    input: volume,
    output: mute,
    volume,
    mute,
  };
};

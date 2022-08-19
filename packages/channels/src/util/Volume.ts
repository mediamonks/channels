import { AudioContext } from './audioContext';

export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

export class Volume {
  public readonly volumeGainNode: GainNode;
  public readonly muteGainNode: GainNode;
  public readonly input: GainNode;
  public readonly output: GainNode;

  constructor(
    audioContext: AudioContext,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {}
  ) {
    this.volumeGainNode = audioContext.createGain();
    this.muteGainNode = audioContext.createGain();

    this.volume = initialVolume;
    this.isMuted = initialMuted;

    this.input = this.volumeGainNode;
    this.output = this.muteGainNode;

    this.input.connect(this.output);
  }

  public get volume(): number {
    return this.volumeGainNode.gain.value;
  }

  public set volume(value: number) {
    this.volumeGainNode.gain.setValueAtTime(value, 0);
  }

  public get isMuted(): boolean {
    return this.muteGainNode.gain.value === 0;
  }

  public set isMuted(muted: boolean) {
    this.muteGainNode.gain.setValueAtTime(muted ? 0 : 1, 0);
  }
}

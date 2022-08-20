export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

export class Volume {
  public readonly volumeGainNode: GainNode;
  public readonly fadeGainNode: GainNode;
  public readonly muteGainNode: GainNode;
  public readonly input: GainNode;
  public readonly output: GainNode;

  constructor(
    private readonly audioContext: AudioContext,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {}
  ) {
    this.volumeGainNode = audioContext.createGain();
    this.muteGainNode = audioContext.createGain();
    this.fadeGainNode = audioContext.createGain();

    this.volume = initialVolume;
    this.isMuted = initialMuted;

    // set up the graph: volume -> fade -> mute
    this.volumeGainNode.connect(this.fadeGainNode);
    this.fadeGainNode.connect(this.muteGainNode);

    // define input and output
    this.input = this.volumeGainNode;
    this.output = this.muteGainNode;
  }

  public fadeOut(time: number) {
    this.fadeGainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + time
    );
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

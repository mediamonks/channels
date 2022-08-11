
type SoundChannelType = 'monophonic' | 'polyphonic';

type BaseSoundChannel = {
    name: string;
    gain: GainNode;
    // playingSamples: PlayingSample[];
    type: SoundChannelType;
    initialVolume: number;
}

export type PolyphonicSoundChannel = BaseSoundChannel & {
    type: 'polyphonic';
}

export type MonophonicSoundChannel = BaseSoundChannel & {
    type: 'monophonic';
}

export type SoundChannel = PolyphonicSoundChannel | MonophonicSoundChannel;

export type PlayingSample = {
    context: AudioContext;
    sample: ISample;
    bufferSource: AudioBufferSourceNode;
    gain: GainNode;
    channel?: SoundChannel;
    panner?: PannerNode;
}
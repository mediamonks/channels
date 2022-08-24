import { VolumeNodes } from './VolumeNodes';

// todo: better name? this is exposed to outside as well, when dealing ith volume
export abstract class HasVolumeNodes {
  private _volumeNodes: VolumeNodes | undefined;

  protected setVolumeNodes(volumeNodes: VolumeNodes) {
    this._volumeNodes = volumeNodes;
  }

  public get volumeNodes(): VolumeNodes {
    if (!this._volumeNodes) {
      throw new Error(
        'VolumeNodes not set, use setVolumeNodes before using them'
      );
    }
    return this._volumeNodes;
  }

  public get volume() {
    return this.volumeNodes.volume;
  }

  public set volume(value: number) {
    this.volumeNodes.volume = value;
  }

  public mute = () => {
    this.volumeNodes.mute();
  };

  public unmute = () => {
    this.volumeNodes.unmute();
  };

  public get fadeVolume(): number {
    return this.volumeNodes.fadeVolume;
  }

  public fadeOut(duration: number, onComplete?: () => void) {
    this.volumeNodes.fadeTo(0, duration, onComplete);
  }

  public fadeIn(duration: number, onComplete?: () => void) {
    this.volumeNodes.fadeTo(1, duration, onComplete);
  }
}

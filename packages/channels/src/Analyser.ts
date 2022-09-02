export class Analyser {
  private waveDataArray: Float32Array;
  constructor(
    private readonly analyserNode: AnalyserNode,
    private readonly fftSize = 1024
  ) {
    analyserNode.fftSize = fftSize;
    this.waveDataArray = new Float32Array(analyserNode.fftSize);
  }

  public getWaveData = (windowSize?: number) => {
    if (windowSize && this.waveDataArray.length !== windowSize) {
      this.waveDataArray = new Float32Array(windowSize);
    }
    this.analyserNode.getFloatTimeDomainData(this.waveDataArray);
    return this.waveDataArray;
  };
}

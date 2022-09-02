export class Analyser {
  private readonly waveDataArray: Float32Array;
  constructor(
    private readonly analyserNode: AnalyserNode,
    private readonly fftSize: number
  ) {
    analyserNode.fftSize = fftSize;
    this.waveDataArray = new Float32Array(analyserNode.fftSize);
  }

  public getWaveData = () => {
    this.analyserNode.getFloatTimeDomainData(this.waveDataArray);
    return this.waveDataArray;
  };
}

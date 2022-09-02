export class Analyser {
  private readonly waveDataArray: Float32Array;
  private readonly frequencyDataArray: Float32Array;
  constructor(
    private readonly analyserNode: AnalyserNode,
    private readonly fftSize: number
  ) {
    analyserNode.fftSize = fftSize;
    this.waveDataArray = new Float32Array(analyserNode.fftSize);
    this.frequencyDataArray = new Float32Array(analyserNode.frequencyBinCount);
  }

  public getWaveData = () => {
    this.analyserNode.getFloatTimeDomainData(this.waveDataArray);
    return this.waveDataArray;
  };

  public getFrequencySpectrum = () => {
    this.analyserNode.getFloatFrequencyData(this.frequencyDataArray);
    return this.frequencyDataArray;
  };
}

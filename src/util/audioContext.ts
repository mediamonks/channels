// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

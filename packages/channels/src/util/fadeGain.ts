import gsap from 'gsap';

// todo: rename to more generic audio param changes.
/**
 * Applies gradual changes on a given AudioParam.
 *
 * Note that these changes are done using tweens instead of the
 * actual AudioParam functionality, because of issues with getting
 * this reliably to work on different browsers.
 * @param audioParam
 * @param value
 * @param duration
 * @param onComplete
 */
export const tweenAudioParamToValue = (
  audioParam: AudioParam,
  value: number,
  duration: number,
  onComplete?: () => void
) => {
  gsap.killTweensOf(audioParam);
  gsap.fromTo(
    audioParam,
    { value: audioParam.value },
    {
      value: value,
      duration: duration,
      onComplete,
    }
  );
};

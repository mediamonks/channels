import gsap from 'gsap';

/**
 * Absolutely ridiculous that i have to use this, but i can't get AudioParam's
 * ramps to work on firefox, specifically creating a new ramp while one is already
 * busy. May be doing something wrong but have never successfully implemented those.
 * Ideally, we do not need gsap, although the api is so much nicer than the
 * garbage of setting tween like this up on an AudioParam
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

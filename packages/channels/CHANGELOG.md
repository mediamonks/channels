# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2024-10-03
- Add options to set the startTimeOffset when playing a sound

## [1.0.3] - 2023-01-13
- Make bufferSourceNode on a PlayingSound public

## [1.0.2] - 2023-01-12
- Return PlayingSound when calling play on a channel
- Volume/pan change events are now dispatched from where the change happened: a Channel, PlayingSound or the Channels instance (for main output) 

## [0.6.0] - 2022-09-07
- Effects can be set pre or post volume (on a sound, a channel or main output)
- Fix stopAllSounds() not immediately stopping sounds when fadeOutTime is set
- move defaultStartStopProps to createChannelProps
- Add panning

## [0.5.0] - 2022-09-06

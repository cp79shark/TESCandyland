import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import musicSrc from './Sugar_Snap_Speedway.mp3'

const VOLUME      = 0.55
const CROSSFADE_S = 2.5   // seconds of overlap at each loop point

/**
 * Schedule one playback pass of `buffer` starting at `startAt` (Web Audio clock).
 * The pass fades in over CROSSFADE_S (except the very first play which starts at
 * full volume), then fades out CROSSFADE_S before its end so the next pass can
 * cross-fade smoothly.
 *
 * Returns a cleanup function that cancels the timer and immediately stops the source.
 */
function schedulePass(
  ctx: AudioContext,
  buffer: AudioBuffer,
  masterGain: GainNode,
  startAt: number,
  isFirst: boolean,
  stopFlag: { stopped: boolean },
): () => void {
  const dur  = buffer.duration
  const src  = ctx.createBufferSource()
  const gain = ctx.createGain()

  src.buffer = buffer
  src.connect(gain)
  gain.connect(masterGain)

  // Gain envelope: fade-in (skip on very first play) → sustain → fade-out
  if (isFirst) {
    gain.gain.setValueAtTime(VOLUME, startAt)
  } else {
    gain.gain.setValueAtTime(0, startAt)
    gain.gain.linearRampToValueAtTime(VOLUME, startAt + CROSSFADE_S)
  }
  gain.gain.setValueAtTime(VOLUME, startAt + dur - CROSSFADE_S)
  gain.gain.linearRampToValueAtTime(0, startAt + dur)

  src.start(startAt)
  src.stop(startAt + dur)

  // When CROSSFADE_S seconds remain, launch the next overlapping pass.
  const msUntilNext = Math.max(0, (startAt + dur - CROSSFADE_S - ctx.currentTime) * 1000)
  const timer = setTimeout(() => {
    if (!stopFlag.stopped) {
      schedulePass(ctx, buffer, masterGain, ctx.currentTime, false, stopFlag)
    }
  }, msUntilNext)

  return () => {
    clearTimeout(timer)
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    try { src.stop() } catch { /* already stopped */ }
    gain.disconnect()
  }
}

export default function CandyMusic() {
  const [playing, setPlaying] = useState(false)

  // Immutable after first load
  const rawBufRef    = useRef<ArrayBuffer | null>(null)
  const ctxRef       = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const bufferRef    = useRef<AudioBuffer | null>(null)

  // Mutable: cleanup function returned by the current pass
  const stopPassRef  = useRef<(() => void) | null>(null)
  const stopFlagRef  = useRef<{ stopped: boolean }>({ stopped: true })

  // Pre-fetch the raw bytes (no AudioContext needed — works without user gesture)
  useEffect(() => {
    fetch(musicSrc)
      .then(r => r.arrayBuffer())
      .then(ab => { rawBufRef.current = ab })
      .catch(() => { /* network unavailable — music simply won't play */ })

    return () => {
      // Tear down AudioContext on unmount
      stopFlagRef.current.stopped = true
      stopPassRef.current?.()
      ctxRef.current?.close()
    }
  }, [])

  async function startPlayback() {
    // Lazily create AudioContext — must happen inside a user-gesture handler.
    if (!ctxRef.current) {
      const ctx = new AudioContext()
      const mg  = ctx.createGain()
      mg.gain.value = 1
      mg.connect(ctx.destination)
      ctxRef.current  = ctx
      masterGainRef.current = mg
    }

    const ctx = ctxRef.current
    if (ctx.state === 'suspended') await ctx.resume()

      // Decode once and cache the AudioBuffer.
      // Pass `raw` directly — decodeAudioData does not consume the ArrayBuffer in
      // modern browsers, and bufferRef caches the result so we never call it again.
      if (!bufferRef.current) {
        const raw = rawBufRef.current
        if (!raw) return          // not loaded yet — bail
        bufferRef.current = await ctx.decodeAudioData(raw)
      }

    const stopFlag = { stopped: false }
    stopFlagRef.current = stopFlag

    const cleanup = schedulePass(ctx, bufferRef.current, masterGainRef.current!, ctx.currentTime, true, stopFlag)
    stopPassRef.current = cleanup
  }

  function stopPlayback() {
    stopFlagRef.current.stopped = true
    stopPassRef.current?.()
    stopPassRef.current = null
  }

  function toggle() {
    if (playing) {
      stopPlayback()
      setPlaying(false)
    } else {
      startPlayback().catch(() => { /* autoplay policy */ })
      setPlaying(true)
    }
  }

  return (
    <motion.button
      onClick={toggle}
      title={playing ? 'Mute music' : 'Play Sugar Snap Speedway 🎵'}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 rounded-full border-2 border-white/50 shadow-xl text-2xl flex items-center justify-center transition-colors"
      style={{
        width: 52,
        height: 52,
        background: playing
          ? 'linear-gradient(135deg, #FF4444, #FF69B4)'
          : 'linear-gradient(135deg, #9B59B6, #3498DB)',
      }}
    >
      {playing ? '🔇' : '🎵'}
    </motion.button>
  )
}

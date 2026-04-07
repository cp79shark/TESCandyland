import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// C major pentatonic: C4 E4 G4 C5 E5 G5 C6
const NOTES = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]

// Upbeat 16-beat candy melody (indices into NOTES[])
const MELODY = [4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6, 6, 5, 4, 3, 4]

const BEAT_MS = 340

function playTone(ctx: AudioContext, freq: number, volume = 0.10) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, ctx.currentTime)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1600, ctx.currentTime)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.40)
}

export default function CandyMusic() {
  const [playing, setPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beatRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (playing) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const step = () => {
        const noteIdx = MELODY[beatRef.current % MELODY.length]!
        const freq = NOTES[noteIdx]!
        playTone(ctx, freq)
        // Add a soft harmony every 4 beats (a descending fourth: freq * 0.75)
        if (beatRef.current % 4 === 0) {
          playTone(ctx, freq * 0.75, 0.04)
        }
        beatRef.current++
        timerRef.current = setTimeout(step, BEAT_MS)
      }
      step()
    } else {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [playing])

  return (
    <motion.button
      onClick={() => setPlaying((p) => !p)}
      title={playing ? 'Mute music' : 'Play candy music 🎵'}
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

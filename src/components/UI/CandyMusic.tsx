import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import musicSrc from './Sugar_Snap_Speedway.mp3'

export default function CandyMusic() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const el = new Audio(musicSrc)
    el.loop = true
    el.volume = 0.55
    audioRef.current = el
    return () => {
      el.pause()
      el.src = ''
    }
  }, [])

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play().catch(() => {/* autoplay blocked — user gesture required */})
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

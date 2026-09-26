import { useEffect, useRef, useState } from 'react'

const MAX_RETRIES = 4
const RETRY_DELAY_MS = 1500

// Wikimedia's redirect endpoint occasionally answers with a transient 429/5xx
// under bursty load. Retry a few times before falling back to a text card so
// the flowchart still reads well even if one image is temporarily unavailable.
export default function LandmarkImage({ src, alt }) {
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  function handleError() {
    if (attempt < MAX_RETRIES) {
      timeoutRef.current = setTimeout(() => {
        setAttempt((a) => a + 1)
      }, RETRY_DELAY_MS * (attempt + 1))
    } else {
      setFailed(true)
    }
  }

  if (failed) {
    return <span className="flow-frame-fallback">{alt}</span>
  }

  return (
    <img
      key={attempt}
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
    />
  )
}

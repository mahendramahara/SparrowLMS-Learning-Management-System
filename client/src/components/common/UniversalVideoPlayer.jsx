import { useState, useEffect } from 'react';
import { resolveVideoSource } from '../../utils/videoUtils';

export default function UniversalVideoPlayer({
  videoUrl,
  poster,
  title = 'Course Video',
  autoPlay = false,
  className = '',
}) {
  const [currentUrl, setCurrentUrl] = useState(videoUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentUrl(videoUrl);
    setHasError(false);
  }, [videoUrl]);

  const source = resolveVideoSource(hasError ? '' : currentUrl);

  const handleVideoError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  if (source.type === 'youtube' || source.type === 'vimeo') {
    return (
      <iframe
        key={source.src}
        src={source.src}
        title={title}
        className={`h-full w-full border-0 ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video
      key={source.src}
      src={source.src}
      controls
      autoPlay={autoPlay}
      playsInline
      controlsList="nodownload"
      poster={poster}
      onError={handleVideoError}
      className={`h-full w-full object-contain ${className}`}
    >
      <source src={source.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

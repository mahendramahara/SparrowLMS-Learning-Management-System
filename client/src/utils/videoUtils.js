const DEFAULT_SAMPLE_VIDEO = 'https://vjs.zencdn.net/v/oceans.mp4';

const BROKEN_URL_PATTERNS = [
  'gtv-videos-bucket',
  'commondatastorage.googleapis.com',
  'via.placeholder.com',
];

export function resolveVideoSource(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      type: 'html5',
      src: DEFAULT_SAMPLE_VIDEO,
      isFallback: true,
    };
  }

  const trimmed = rawUrl.trim();

  for (const broken of BROKEN_URL_PATTERNS) {
    if (trimmed.includes(broken)) {
      return {
        type: 'html5',
        src: DEFAULT_SAMPLE_VIDEO,
        isFallback: true,
      };
    }
  }

  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch) {
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isFallback: false,
    };
  }

  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/i
  );
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isFallback: false,
    };
  }

  return {
    type: 'html5',
    src: trimmed,
    isFallback: false,
  };
}

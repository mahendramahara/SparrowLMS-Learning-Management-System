const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

const RESOLUTIONS = [
  { name: '360p', width: 640, height: 360, bitrate: '800k' },
  { name: '480p', width: 854, height: 480, bitrate: '1400k' },
  { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
];

const getVideoMetadata = videoPath => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
};

const transcodeVideo = async (inputPath, outputPath, resolution) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size(`${resolution.width}x${resolution.height}`)
      .videoBitrate(resolution.bitrate)
      .audioBitrate('128k')
      .outputOptions(['-preset fast', '-crf 23', '-movflags +faststart'])
      .on('end', () => {
        logger.info(`Transcoding completed: ${resolution.name}`);
        resolve(outputPath);
      })
      .on('error', err => {
        logger.error(`Transcoding error: ${err.message}`);
        reject(err);
      })
      .on('progress', progress => {
        logger.info(`Processing ${resolution.name}: ${progress.percent}%`);
      })
      .run();
  });
};

const generateHLSPlaylist = async (inputPath, outputDir) => {
  await fs.mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const playlistPath = path.join(outputDir, 'playlist.m3u8');

    ffmpeg(inputPath)
      .outputOptions([
        '-codec: copy',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
      ])
      .output(playlistPath)
      .on('end', () => {
        logger.info('HLS playlist generated');
        resolve(playlistPath);
      })
      .on('error', err => {
        logger.error(`HLS generation error: ${err.message}`);
        reject(err);
      })
      .run();
  });
};

const processVideoForMultipleResolutions = async (inputPath, outputDir) => {
  const metadata = await getVideoMetadata(inputPath);
  const videoStream = metadata.streams.find(s => s.codec_type === 'video');
  const inputHeight = videoStream.height;

  const applicableResolutions = RESOLUTIONS.filter(res => res.height <= inputHeight);

  const transcodingPromises = applicableResolutions.map(async resolution => {
    const outputPath = path.join(outputDir, `${resolution.name}.mp4`);
    await transcodeVideo(inputPath, outputPath, resolution);
    return { resolution: resolution.name, path: outputPath };
  });

  const results = await Promise.all(transcodingPromises);
  return results;
};

const generateThumbnail = async (videoPath, outputPath, timestamp = '00:00:01') => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720',
      })
      .on('end', () => {
        logger.info('Thumbnail generated');
        resolve(outputPath);
      })
      .on('error', err => {
        logger.error(`Thumbnail generation error: ${err.message}`);
        reject(err);
      });
  });
};

const extractAudio = async (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .on('end', () => {
        logger.info('Audio extracted');
        resolve(outputPath);
      })
      .on('error', err => {
        logger.error(`Audio extraction error: ${err.message}`);
        reject(err);
      })
      .run();
  });
};

const mergeVideoChunks = async (chunkPaths, outputPath) => {
  const writeStream = require('fs').createWriteStream(outputPath);

  for (const chunkPath of chunkPaths) {
    const chunkData = await fs.readFile(chunkPath);
    writeStream.write(chunkData);
  }

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      logger.info('Video chunks merged successfully');
      resolve(outputPath);
    });
    writeStream.on('error', reject);
    writeStream.end();
  });
};

const getVideoDuration = async videoPath => {
  const metadata = await getVideoMetadata(videoPath);
  return parseFloat(metadata.format.duration);
};

const compressVideo = async (inputPath, outputPath, targetSizeMB) => {
  const metadata = await getVideoMetadata(inputPath);
  const duration = parseFloat(metadata.format.duration);
  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  const audioBitrate = 128;
  const videoBitrate = Math.floor((targetSizeBytes * 8) / duration - audioBitrate);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoBitrate(`${videoBitrate}k`)
      .audioBitrate(`${audioBitrate}k`)
      .outputOptions(['-preset medium', '-crf 28'])
      .on('end', () => {
        logger.info('Video compressed successfully');
        resolve(outputPath);
      })
      .on('error', err => {
        logger.error(`Compression error: ${err.message}`);
        reject(err);
      })
      .run();
  });
};

module.exports = {
  getVideoMetadata,
  transcodeVideo,
  generateHLSPlaylist,
  processVideoForMultipleResolutions,
  generateThumbnail,
  extractAudio,
  mergeVideoChunks,
  getVideoDuration,
  compressVideo,
};

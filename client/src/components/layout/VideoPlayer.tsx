import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  PlayCircleIconSolid,
  PauseCircleIconSolid,
  SpeakerWaveIconSolid,
  SpeakerXMarkIconSolid,
  ArrowsPointingOutIconSolid,
  Cog6ToothIconSolid,
} from "./Icon";
import * as React from "react";

interface VideoPlayerProps {
  videoTitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  isYouTubeStream?: boolean;
  mimeType?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoTitle = "Live Stream",
  videoUrl,
  posterUrl,
  isYouTubeStream = false,
  mimeType,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Detect YouTube URL
  const isYouTubeUrl = videoUrl?.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/
  );
  const youTubeVideoId = isYouTubeUrl ? isYouTubeUrl[1] : null;

  useEffect(() => {
    if (!videoRef.current || !videoUrl || youTubeVideoId) return;

    const video = videoRef.current;
    const isM3u8 = videoUrl.endsWith(".m3u8") && !isYouTubeStream;
    const isHlsSupported = Hls.isSupported();
    const isNativeHlsSupported = video.canPlayType(
      "application/vnd.apple.mpegurl"
    );

    setError(null);

    if (isM3u8 && isNativeHlsSupported && !isHlsSupported) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLive(isNaN(video.duration) || video.duration === Infinity);
      });
    } else if (isM3u8 && isHlsSupported) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(hls.levels.some((level) => level.details?.live));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error. Retrying...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error. Attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              setError("Playback failed. Please try again.");
              hls.destroy();
              hlsRef.current = null;
              break;
          }
        }
      });
    } else {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLive(isNaN(video.duration) || video.duration === Infinity);
        if (isYouTubeStream && !video.videoWidth && !video.videoHeight) {
          video.style.backgroundColor = "black";
        }
      });
      video.addEventListener("error", () => {
        setError("Failed to load media. Please check the stream URL.");
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.src = "";
        videoRef.current.removeEventListener("loadedmetadata", () => {});
        videoRef.current.removeEventListener("error", () => {});
      }
    };
  }, [videoUrl, isYouTubeStream, youTubeVideoId]);

  useEffect(() => {
    if (videoRef.current && !youTubeVideoId) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, youTubeVideoId]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current && !youTubeVideoId) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().catch(() => {
          setError("Playback was blocked. Please try again.");
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
    if (!isMuted && newVolume === 0) setIsMuted(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLive(
        isNaN(videoRef.current.duration) ||
          videoRef.current.duration === Infinity
      );
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && !isLive && !youTubeVideoId) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen().catch((err) => {
          alert(`Error enabling full-screen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleSettings = () => {
    console.log("Open settings");
  };

  const handleMouseEnter = () => {
    if (!youTubeVideoId) {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && !youTubeVideoId) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 2000);
    }
  };

  useEffect(() => {
    if (!youTubeVideoId) {
      setShowControls(!isPlaying || !videoRef.current?.played.length);
    }
  }, [isPlaying, youTubeVideoId]);

  if (!videoUrl) {
    return (
      <div className="relative w-full aspect-video bg-black text-white rounded-lg shadow-2xl flex items-center justify-center">
        <p>No video URL provided</p>
      </div>
    );
  }

  if (youTubeVideoId) {
    return (
      <div
        ref={playerRef}
        className="relative w-full aspect-video bg-black text-white rounded-lg shadow-2xl overflow-hidden"
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${youTubeVideoId}?autoplay=0&controls=1&rel=0`}
          title={videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="absolute top-0 left-0 p-2 bg-gradient-to-b from-black/70 to-transparent">
          <h2 className="text-sm font-semibold">{videoTitle}</h2>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className="relative w-full aspect-video bg-black text-white rounded-lg shadow-2xl overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        className="absolute inset-0 w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={() => {
          if (videoRef.current) {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted);
          }
        }}
      >
        {videoUrl && (
          <source
            src={videoUrl}
            type={
              mimeType ||
              (videoUrl.endsWith(".m3u8")
                ? "application/x-mpegURL"
                : videoUrl.endsWith(".mp3")
                ? "audio/mpeg"
                : "video/mp4")
            }
          />
        )}
        Your browser does not support the video tag.
      </video>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-500 text-center p-4">
          <p>{error}</p>
        </div>
      )}

      {!isPlaying && posterUrl && !error && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
        >
          <PlayCircleIconSolid className="w-20 h-20 text-white/80 hover:text-white" />
        </button>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {!isLive && (
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1.5 mb-2 accent-red-500 cursor-pointer"
            aria-label="Video progress"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="hover:text-red-500 transition-colors"
            >
              {isPlaying ? (
                <PauseCircleIconSolid className="w-7 h-7" />
              ) : (
                <PlayCircleIconSolid className="w-7 h-7" />
              )}
            </button>
            <div className="flex items-center group/volume">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="hover:text-red-500 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIconSolid className="w-6 h-6" />
                ) : (
                  <SpeakerWaveIconSolid className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 ml-1 accent-red-500 cursor-pointer opacity-0 group-hover/volume:opacity-100 sm:opacity-100 transition-opacity"
                aria-label="Volume"
              />
            </div>
            <span className="text-xs">
              {isLive
                ? "Live"
                : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSettings}
              aria-label="Settings"
              className="hover:text-red-500 transition-colors"
            >
              <Cog6ToothIconSolid className="w-6 h-6" />
            </button>
            <button
              onClick={handleFullscreen}
              aria-label="Fullscreen"
              className="hover:text-red-500 transition-colors"
            >
              <ArrowsPointingOutIconSolid className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 left-0 p-2 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-sm font-semibold">{videoTitle}</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;

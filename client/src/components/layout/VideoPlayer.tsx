import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  PlayCircleIconSolid,
  PauseCircleIconSolid,
  SpeakerWaveIconSolid,
  SpeakerXMarkIconSolid,
  ArrowsPointingOutIconSolid,
} from "./Icon";
import * as React from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useUserInteraction } from "@/context/UserInteractionContext";
import { useTheme, useMediaQuery } from "@mui/material";

// Mở rộng kiểu HTMLVideoElement để hỗ trợ webkitEnterFullscreen
interface ExtendedVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
}

interface VideoPlayerProps {
  videoTitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  isYouTubeStream?: boolean;
  mimeType?: string;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoTitle = "Live Stream",
  videoUrl,
  posterUrl,
  isYouTubeStream = false,
  mimeType,
  autoPlay = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<
    { id: number; height: number }[]
  >([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<ExtendedVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const wasPlayingBeforeFullscreen = useRef(false);

  const { setHasUserInteracted } = useUserInteraction();

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

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.src = "";
    setError(null);
    video.muted = true;
    video.autoplay = false;
    video.playsInline = true;

    if (isM3u8 && isNativeHlsSupported && !isHlsSupported) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLive(isNaN(video.duration) || video.duration === Infinity);
      });
    } else if (isM3u8 && isHlsSupported) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(hls.levels.some((level) => level.details?.live));
        setQualityLevels(
          hls.levels.map((level, index) => ({
            id: index,
            height: level.height || 720,
          }))
        );
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError(`HLS Error: ${data.type}. Please try again.`);
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLive(isNaN(video.duration) || video.duration === Infinity);
      });
      video.addEventListener("error", () => {
        setError("Failed to load media. Please check the stream URL.");
      });
    }

    const handleFullscreenEnter = () => {
      if (!video.paused) wasPlayingBeforeFullscreen.current = true;
      else wasPlayingBeforeFullscreen.current = false;
    };

    const handleFullscreenExit = () => {
      const isExiting =
        !document.fullscreenElement && !(document as any).webkitIsFullScreen;
      if (isExiting && wasPlayingBeforeFullscreen.current) {
        video.play().then(() => {
          setIsPlaying(true);
          setShowPlayButton(false);
        });
      }
    };

    video.addEventListener("webkitbeginfullscreen", handleFullscreenEnter);
    video.addEventListener("webkitendfullscreen", handleFullscreenExit);
    document.addEventListener("fullscreenchange", handleFullscreenExit);
    document.addEventListener("webkitfullscreenchange", handleFullscreenExit);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.src = "";
      video.removeEventListener("webkitbeginfullscreen", handleFullscreenEnter);
      video.removeEventListener("webkitendfullscreen", handleFullscreenExit);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenExit
      );
    };
  }, [videoUrl, isYouTubeStream, youTubeVideoId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !youTubeVideoId && isPlaying) {
      video.muted = false; // Unmute khi phát thành công
      setIsMuted(false);
    }
  }, [isPlaying, youTubeVideoId]);

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
        videoRef.current.muted = false; // Unmute khi phát thủ công
        setIsMuted(false);
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false); // Ẩn nút play sau khi phát
            setHasUserInteracted(true);
          })
          .catch((err) => {
            setError(`Playback failed: ${err.message}`);
            console.error("Play error:", err);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setHasUserInteracted(true);
    }
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

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video && !youTubeVideoId) {
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen().catch((err) => {
            console.error(`Fullscreen error (standard): ${err.message}`);
          });
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // Hỗ trợ iOS
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleQualityChange = (levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
      setCurrentLevel(levelId);
      setShowSettings(false);
    }
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

  const handleVideoClick = () => {
    if (!isMobile && videoRef.current && !youTubeVideoId) {
      togglePlay(); // Trên desktop, nhấp để phát
    } else if (isMobile && videoRef.current && !youTubeVideoId) {
      setShowPlayButton(true); // Trên mobile, hiển thị nút play
    }
  };

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
          src={`https://www.youtube-nocookie.com/embed/${youTubeVideoId}?autoplay=1&controls=1&rel=0`}
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
        onClick={handleVideoClick}
        onDoubleClick={handleFullscreen} // Nhấn đúp để full screen
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
        autoPlay={false} // Tắt autoplay để tránh lỗi
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

      {/* Hiển thị nút play khi showPlayButton là true trên mobile */}
      {showPlayButton && isMobile && !isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors"
        >
          <PlayCircleIconSolid className="w-20 h-20 text-white/80 hover:text-white" />
        </button>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-500 text-center p-4">
          <p>{error}</p>
        </div>
      )}

      {!isPlaying && posterUrl && !error && !showPlayButton && (
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

          <div className="flex items-center space-x-3 relative">
            <button
              onClick={handleSettings}
              aria-label="Settings"
              className="hover:text-red-500 transition-colors"
            >
              <Cog8ToothIcon className="w-6 h-6" />
            </button>
            {showSettings && qualityLevels.length > 0 && (
              <div className="absolute bottom-10 right-0 bg-black/90 text-white rounded-md shadow-lg p-2 z-10">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => handleQualityChange(-1)}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-red-500/50 ${
                        currentLevel === -1 ? "bg-red-500/70" : ""
                      }`}
                    >
                      Auto
                    </button>
                  </li>
                  {qualityLevels.map((level) => (
                    <li key={level.id}>
                      <button
                        onClick={() => handleQualityChange(level.id)}
                        className={`w-full text-left px-2 py-1 rounded hover:bg-red-500/50 ${
                          currentLevel === level.id ? "bg-red-500/70" : ""
                        }`}
                      >
                        {level.height}p
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

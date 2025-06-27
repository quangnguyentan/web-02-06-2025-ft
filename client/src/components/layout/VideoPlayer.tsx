import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  PlayCircleIconSolid,
  PauseCircleIconSolid,
  SpeakerWaveIconSolid,
  SpeakerXMarkIconSolid,
  ArrowsPointingIconSolid,
  ArrowsPointingOutIconSolid,
} from "./Icon";
import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useUserInteraction } from "@/context/UserInteractionContext";
import { useTheme, useMediaQuery } from "@mui/material";
import { Match } from "@/types/match.types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// Mở rộng kiểu HTMLVideoElement để hỗ trợ webkit
interface ExtendedVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
}

interface VideoPlayerProps {
  videoTitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  isYouTubeStream?: boolean;
  mimeType?: string;
  autoPlay?: boolean;
  match?: Match;
}

// Define constants and helper functions
const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const renderTime = (dimension: any, time: any) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time: any) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time: any) =>
  ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time: any) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time: any) => (time / daySeconds) | 0;

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoTitle = "Live Stream",
  videoUrl,
  posterUrl,
  isYouTubeStream = false,
  mimeType = "auto",
  autoPlay = false,
  match,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null); // Keep as string | null
  const [showControls, setShowControls] = useState(true); // Luôn giữ true
  const [showSettings, setShowSettings] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<
    { id: number; height: number }[]
  >([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // Native fullscreen state
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false); // Custom fullscreen state
  const [countdownActive, setCountdownActive] = useState(false); // New state for countdown
  const videoRef = useRef<ExtendedVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastTouchTime = useRef<number>(0); // Theo dõi thời gian chạm cuối cùng
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const { hasUserInteracted, setHasUserInteracted } = useUserInteraction();

  const isYouTubeUrl = videoUrl?.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/
  );
  const youTubeVideoId = isYouTubeUrl ? isYouTubeUrl[1] : null;

  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(true);
    setCurrentTime(0);
    setDuration(0);
    setIsLive(false);
    setError(null);
    setShowPlayButton(false);
    setQualityLevels([]);
    setCurrentLevel(-1);
    setIsFullscreen(false);
    setIsCustomFullscreen(false);
    setCountdownActive(false); // Reset countdown
  }, [videoUrl]);

  useEffect(() => {
    if (!videoRef.current || !videoUrl || youTubeVideoId) return;

    const video = videoRef.current;
    video.playsInline = true;
    video.controls = false; // Explicitly disable native controls
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
      video.playsInline = true;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(hls.levels.some((level) => level.details?.live));
        setQualityLevels(
          hls.levels.map((level, index) => ({
            id: index,
            height: level.height || 720,
          }))
        );
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
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
        if (isYouTubeStream && !video.videoWidth && !video.videoHeight) {
          video.style.backgroundColor = "black";
        }
      });
      video.addEventListener("error", () => {
        const startTimeVN = new Date(
          new Date(match?.startTime || "").toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh",
          })
        ).getTime();
        const nowVN = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        });
        const nowVNTime = new Date(nowVN).getTime();
        if (match?.status !== "LIVE" && startTimeVN > nowVNTime) {
          setCountdownActive(true); // Activate countdown
        }
      });
    }

    const handleFullscreenChange = () => {
      const video = videoRef.current;
      if (!video) return;

      const isCurrentlyFullscreen =
        !!document.fullscreenElement || !!video.webkitDisplayingFullscreen;
      setIsFullscreen(isCurrentlyFullscreen);
      setShowControls(isCurrentlyFullscreen); // Show controls in fullscreen
      if (!isCurrentlyFullscreen && isPlaying) {
        setTimeout(() => {
          video.play().catch((err) => {
            console.error("Resume playback error:", err);
          });
          setShowPlayButton(false);
        }, 100); // Slight delay for iOS
      }
    };

    const handlePause = () => {
      if (videoRef.current && isFullscreen && isPlaying) {
        setShowPlayButton(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    video.addEventListener("pause", handlePause);

    // Add click listener to wrapper div for desktop
    const handleWrapperClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (
        videoRef.current &&
        !youTubeVideoId &&
        !isMobile &&
        (isFullscreen || isCustomFullscreen)
      ) {
        console.log("Wrapper clicked in fullscreen on desktop"); // Debug log
        togglePlay();
      }
    };
    if (videoWrapperRef.current) {
      videoWrapperRef.current.addEventListener("click", handleWrapperClick, {
        capture: true,
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
        videoRef.current.removeEventListener("pause", handlePause);
      }
      if (videoWrapperRef.current) {
        videoWrapperRef.current.removeEventListener(
          "click",
          handleWrapperClick
        );
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [videoUrl, isYouTubeStream, youTubeVideoId, isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !youTubeVideoId && isPlaying) {
      video.muted = false;
      setIsMuted(false);
    }
  }, [isPlaying, youTubeVideoId]);

  useEffect(() => {
    if (videoRef.current && !youTubeVideoId) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, youTubeVideoId]);

  useEffect(() => {
    if (isCustomFullscreen && playerRef.current) {
      playerRef.current.style.position = "fixed";
      playerRef.current.style.top = "0";
      playerRef.current.style.left = "0";
      playerRef.current.style.width = "100%";
      playerRef.current.style.height = "100%";
      playerRef.current.style.zIndex = "10";
      playerRef.current.style.backgroundColor = "black";
      document.body.style.overflow = "hidden";
      playerRef.current.style.display = "flex";
      playerRef.current.style.alignItems = "center";
      playerRef.current.style.justifyContent = "center";
    } else if (playerRef.current) {
      playerRef.current.style.position = "";
      playerRef.current.style.top = "";
      playerRef.current.style.left = "";
      playerRef.current.style.width = "";
      playerRef.current.style.height = "";
      playerRef.current.style.zIndex = "";
      playerRef.current.style.backgroundColor = "";
      playerRef.current.style.display = "";
      playerRef.current.style.alignItems = "";
      playerRef.current.style.justifyContent = "";
      document.body.style.overflow = "";
    }
  }, [isCustomFullscreen]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = () => {
    setIsFullscreen(false); // Reset custom fullscreen on play toggle
    if (videoRef.current && !youTubeVideoId) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false);
            setHasUserInteracted(true);
          })
          .catch((err) => {
            // setError(`Playback failed: ${err.message}`);
            console.error("Play error:", err);
            const startTimeVN = new Date(
              new Date(match?.startTime || "").toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
              })
            ).getTime();
            const nowVN = new Date().toLocaleString("en-US", {
              timeZone: "Asia/Ho_Chi_Minh",
            });
            const nowVNTime = new Date(nowVN).getTime();
            if (match?.status !== "LIVE" && startTimeVN > nowVNTime) {
              setCountdownActive(true); // Activate countdown on play error
            }
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
      if (!isFullscreen) {
        if (video.requestFullscreen) {
          video.requestFullscreen().catch((err) => {
            console.error(`Fullscreen error (standard): ${err.message}`);
          });
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
        setIsFullscreen(true);
        setShowControls(true); // Ensure controls are visible in fullscreen
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        } else if (video.webkitExitFullscreen) {
          video.webkitExitFullscreen();
        }
        setIsFullscreen(false);
        setShowControls(true); // Restore controls on exit
      }
    }
  };

  const handleCustomFullscreen = () => {
    if (!isFullscreen) {
      // Only allow custom fullscreen if not in native fullscreen
      setIsCustomFullscreen(!isCustomFullscreen);
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

  const handleVideoClick = () => {
    if (videoRef.current && !youTubeVideoId) {
      if (!isMobile) {
        togglePlay();
      } else {
        setShowPlayButton(true);
      }
    }
  };

  // Xử lý double-tap trên mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchTime.current;
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault(); // Ngăn chạm kép mở menu trình duyệt
      handleFullscreen();
    }
    lastTouchTime.current = currentTime;
  };
  console.log(lastTouchTime);
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
      onClick={(e) => e.stopPropagation()} // Prevent parent clicks from interfering
    >
      <div
        ref={videoWrapperRef}
        className={`w-full h-full ${
          isCustomFullscreen
            ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            : ""
        }`}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          poster={posterUrl}
          className={`w-full h-full object-contain z-10`}
          onDoubleClick={isMobile ? undefined : handleFullscreen}
          onTouchStart={isMobile ? handleTouchStart : undefined} // Thêm xử lý double-tap trên mobile
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
          autoPlay={false}
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
      </div>

      {showPlayButton && isMobile && !isPlaying && (
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors z-50"
        >
          <PlayCircleIconSolid className="w-20 h-20 text-white/80 hover:text-white" />
        </button>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-500 text-center p-4">
          <p>{error}</p>
        </div>
      )}

      {!isPlaying &&
        posterUrl &&
        !error &&
        !showPlayButton &&
        !countdownActive && (
          <button
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors z-50"
          >
            {isPlaying ? (
              <PauseCircleIconSolid className="w-20 h-20" />
            ) : (
              <PlayCircleIconSolid className="w-20 h-20 " />
            )}
          </button>
        )}
      {isPlaying && !showPlayButton && !isMobile && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors opacity-0 z-50"
        >
          {isPlaying ? (
            <PauseCircleIconSolid className="w-20 h-20" />
          ) : (
            <PlayCircleIconSolid className="w-20 h-20 " />
          )}
        </button>
      )}

      {countdownActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white  text-center p-2 z-10">
          <div className="bg-white md:py-20 md:px-32 px-10 py-6 relative  ">
            <div className="max-w-xs w-full flex flex-col gap-2 md:gap-6">
              <div className="flex-col items-start justify-start absolute top-1 left-0 px-4 bg-slate-50 w-full py-2 hidden md:flex ">
                <span className="text-black text-xs md:text-sm font-semibold">
                  Giải đấu {match?.league?.name}
                </span>
                <span className="text-black text-xs md:text-sm font-semibold">
                  Thời gian:{" "}
                  {new Date(match?.startTime ?? "").toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <span className="text-black font-semibold md:text-lg text-xs">
                Trận đấu này sẽ bắt đầu sau
              </span>
              <div>
                {(() => {
                  const startTimeVN = new Date(
                    new Date(match?.startTime || "").toLocaleString("en-US", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })
                  ).getTime();
                  const nowVN = new Date(
                    new Date().toLocaleString("en-US", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })
                  ).getTime();
                  const totalRemainingTime = Math.floor(
                    (startTimeVN - nowVN) / 1000
                  );
                  const days = Math.ceil(totalRemainingTime / daySeconds);
                  const daysDuration = days * daySeconds;

                  return (
                    <div className="flex flex-row space-x-2">
                      <CountdownCircleTimer
                        {...timerProps}
                        size={isMobile ? 60 : 90} // Giảm kích thước vòng tròn xuống `${isMobile ? 60 : 90}`px
                        colors="#3399FF"
                        duration={daysDuration}
                        initialRemainingTime={totalRemainingTime}
                      >
                        {({ elapsedTime, color }) => (
                          <span
                            style={{ color }}
                            className="text-xs !text-black  md:text-sm md:font-bold"
                          >
                            {renderTime(
                              "Ngày",
                              getTimeDays(daysDuration - elapsedTime)
                            )}
                          </span>
                        )}
                      </CountdownCircleTimer>
                      <CountdownCircleTimer
                        {...timerProps}
                        size={isMobile ? 60 : 90} // Giảm kích thước vòng tròn xuống `${isMobile ? 60 : 90}`px
                        colors="#3399FF"
                        duration={daySeconds}
                        initialRemainingTime={totalRemainingTime % daySeconds}
                        onComplete={(totalElapsedTime) => ({
                          shouldRepeat:
                            totalRemainingTime - totalElapsedTime > hourSeconds,
                        })}
                      >
                        {({ elapsedTime, color }) => (
                          <span
                            style={{ color }}
                            className="text-xs !text-black  md:text-sm md:font-bold "
                          >
                            {renderTime(
                              "Giờ",
                              getTimeHours(daySeconds - elapsedTime)
                            )}
                          </span>
                        )}
                      </CountdownCircleTimer>
                      <CountdownCircleTimer
                        {...timerProps}
                        size={isMobile ? 60 : 90} // Giảm kích thước vòng tròn xuống `${isMobile ? 60 : 90}`px
                        colors="#3399FF"
                        duration={hourSeconds}
                        initialRemainingTime={totalRemainingTime % hourSeconds}
                        onComplete={(totalElapsedTime) => ({
                          shouldRepeat:
                            totalRemainingTime - totalElapsedTime >
                            minuteSeconds,
                        })}
                      >
                        {({ elapsedTime, color }) => (
                          <span
                            style={{ color }}
                            className="text-xs !text-black  md:text-sm md:font-bold "
                          >
                            {renderTime(
                              "Phút",
                              getTimeMinutes(hourSeconds - elapsedTime)
                            )}
                          </span>
                        )}
                      </CountdownCircleTimer>
                      <CountdownCircleTimer
                        {...timerProps}
                        size={isMobile ? 60 : 90} // Giảm kích thước vòng tròn xuống `${isMobile ? 60 : 90}`px
                        colors="#3399FF"
                        duration={minuteSeconds}
                        initialRemainingTime={
                          totalRemainingTime % minuteSeconds
                        }
                        onComplete={(totalElapsedTime) => ({
                          shouldRepeat:
                            totalRemainingTime - totalElapsedTime > 0,
                        })}
                      >
                        {({ elapsedTime, color }) => (
                          <span
                            style={{ color }}
                            className="text-xs !text-black  md:text-sm md:font-bold "
                          >
                            {renderTime("Giây", getTimeSeconds(elapsedTime))}
                          </span>
                        )}
                      </CountdownCircleTimer>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {isCustomFullscreen && (
        <button
          onClick={handleCustomFullscreen}
          aria-label="Exit Custom Fullscreen"
          className="absolute top-1 right-2 z-[10000] hover:text-red-500 transition-colors rounded-xl bg-black hover:bg-black/70 p-1 "
        >
          <XMarkIcon className="w-6 h-6 text-white/80 hover:text-white stroke-border" />
        </button>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-50 ${
          (isFullscreen || isCustomFullscreen) && !showControls ? "hidden" : ""
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
            {/* <span className="text-xs">
              {isLive
                ? "Live"
                : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </span> */}
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
            {isMobile && (
              <button
                onClick={handleCustomFullscreen}
                aria-label={
                  isCustomFullscreen
                    ? "Exit Custom Fullscreen"
                    : "Custom Fullscreen"
                }
                className="hover:text-red-500 transition-colors"
              >
                <ArrowsPointingIconSolid
                  className={`w-6 h-6 ${isCustomFullscreen ? "rotate-45" : ""}`}
                />
              </button>
            )}
            <button
              onClick={handleFullscreen}
              aria-label="Native Fullscreen"
              className="hover:text-red-500 transition-colors"
            >
              <ArrowsPointingOutIconSolid />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 p-2 bg-gradient-to-b from-black/70 to-transparent z-50">
        <h2 className="text-sm font-semibold">{videoTitle}</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;

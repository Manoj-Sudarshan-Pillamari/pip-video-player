import { useState, useEffect, useRef, useCallback } from "react";
import CrossIcon from "./icons/CrossIcon";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import "./PipVideoPlayer.css";

export const PipVideoPlayer = ({ media = [], onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  const containerRef = useRef(null);

  const isValidMedia = media && Array.isArray(media) && media.length > 0;
  const currentItem = isValidMedia ? media[currentIndex] : null;
  const isVideo = currentItem?.type === "video";
  const isImage = currentItem?.type === "image" || currentItem?.type === "gif";

  // Clear auto-advance timer
  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Start auto-advance timer for images/gifs
  const startAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    if (media.length <= 1) return;

    autoAdvanceTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 3000);
  }, [media.length, clearAutoAdvance]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible || !isVideo || !currentItem) return;

    setIsLoading(true);
    setHasError(false);

    video.src = currentItem.src;
    video.load();
    video.play().catch((err) => console.log("Autoplay prevented:", err));

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error("Video failed to load:", currentItem.src);
    };

    const handleVideoEnd = () => {
      if (media.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % media.length);
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentIndex, isVisible, isVideo, currentItem, media.length]);

  // Handle image/gif loading and auto-advance
  useEffect(() => {
    if (!isVisible || !isImage || !currentItem) return;

    setIsLoading(true);
    setHasError(false);
    clearAutoAdvance();

    const img = new Image();

    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      startAutoAdvance();
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      console.error("Image failed to load:", currentItem.src);
    };

    img.src = currentItem.src;

    return () => {
      clearAutoAdvance();
    };
  }, [
    currentIndex,
    isVisible,
    isImage,
    currentItem,
    clearAutoAdvance,
    startAutoAdvance,
  ]);

  // Pause video when hidden
  useEffect(() => {
    const video = videoRef.current;
    if (!isVisible) {
      clearAutoAdvance();
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    }
  }, [isVisible, clearAutoAdvance]);

  // Cleanup on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      clearAutoAdvance();
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [clearAutoAdvance]);

  const handleMediaClick = useCallback(() => {
    if (currentItem?.redirectUrl) {
      window.open(currentItem.redirectUrl, "_blank");
    }
  }, [currentItem]);

  const handleClose = useCallback(
    (e) => {
      e?.stopPropagation();
      setIsVisible(false);
      clearAutoAdvance();
      if (onClose) onClose();
    },
    [onClose, clearAutoAdvance]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (!isValidMedia) return;
      clearAutoAdvance();
      setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    },
    [media.length, isValidMedia, clearAutoAdvance]
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (!isValidMedia) return;
      clearAutoAdvance();
      setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    },
    [media.length, isValidMedia, clearAutoAdvance]
  );

  const handleDotClick = useCallback(
    (e, index) => {
      e?.stopPropagation();
      clearAutoAdvance();
      setCurrentIndex(index);
    },
    [clearAutoAdvance]
  );

  const handleRetry = useCallback(
    (e) => {
      e?.stopPropagation();
      if (!currentItem) return;

      setHasError(false);
      setIsLoading(true);

      if (isVideo) {
        const video = videoRef.current;
        if (video) {
          video.src = currentItem.src;
          video.load();
          video
            .play()
            .catch((err) => console.log("Retry play prevented:", err));
        }
      } else {
        // Re-trigger image loading by forcing state change
        const tempIndex = currentIndex;
        setCurrentIndex(-1);
        setTimeout(() => setCurrentIndex(tempIndex), 50);
      }
    },
    [currentItem, isVideo, currentIndex]
  );

  if (!isValidMedia) return null;
  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="pip-container">
      <div className="pip-player">
        <button onClick={handleClose} className="pip-close-button">
          <CrossIcon width="16px" height="16px" />
        </button>

        {media.length > 1 && (
          <button
            onClick={handlePrev}
            className="pip-carousel-button pip-carousel-button-left"
          >
            <ChevronLeftIcon width="20px" height="20px" />
          </button>
        )}

        {media.length > 1 && (
          <button
            onClick={handleNext}
            className="pip-carousel-button pip-carousel-button-right"
          >
            <ChevronRightIcon width="20px" height="20px" />
          </button>
        )}

        <div onClick={handleMediaClick} className="pip-video-wrapper">
          {/* Video element — hidden when showing image/gif */}
          <video
            ref={videoRef}
            className="pip-video-element"
            style={{ display: isVideo ? "block" : "none" }}
            autoPlay
            muted
            playsInline
          />

          {/* Image/GIF element */}
          {isImage && !hasError && (
            <img
              src={currentItem.src}
              alt="Popular brand"
              className="pip-video-element"
              style={{
                display: isLoading ? "none" : "block",
                objectFit: "cover",
              }}
            />
          )}

          {/* Loading spinner */}
          {isLoading && !hasError && (
            <div className="pip-video-loader">
              <div className="pip-spinner"></div>
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="pip-video-error">
              <div className="pip-error-content">
                <p className="pip-error-message">
                  Failed to load {isVideo ? "video" : "image"}
                </p>
                <button onClick={handleRetry} className="pip-retry-button">
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Carousel dots */}
          {media.length > 1 && (
            <div className="pip-carousel-dots">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(e, index)}
                  className={`pip-carousel-dot ${
                    index === currentIndex ? "pip-carousel-dot-active" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

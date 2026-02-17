import { useState, useEffect } from "react";
import axios from "axios";
import { PipVideoPlayer } from "./PipVideoPlayer";
import "./PipVideoPlayer.css";

const API_URL = import.meta.env.VITE_PIP_VIDEOS_API_URL;

export default function App() {
  const [mediaData, setMediaData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchPipVideos = async () => {
      try {
        const res = await axios.get(API_URL);
        const videos = res?.data?.data;

        if (!videos || !Array.isArray(videos) || videos?.length === 0) {
          setMediaData([]);
          setIsDataReady(true);
          return;
        }

        const transformedData = videos?.map((item) => ({
          id: item._id,
          src: item.media?.url || "",
          type: item.media?.type || "video",
          redirectUrl: item?.link || "",
          rank: item?.rank,
        }));

        const validData = transformedData?.filter((item) => item?.src);

        setMediaData(validData);
      } catch (err) {
        console.error("Failed to fetch PiP videos:", err);
        setMediaData([]);
      } finally {
        setIsDataReady(true);
      }
    };

    fetchPipVideos();
  }, []);

  const handlePlayerClose = () => {
    console.log("PiP player closed");
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-title">PiP Video Player App</h1>
        <p className="main-description">
          This is the PiP Video Player application. Videos are loaded from the
          backend API and displayed in a floating picture-in-picture player.
        </p>
      </div>

      {isDataReady && mediaData?.length > 0 && (
        <PipVideoPlayer media={mediaData} onClose={handlePlayerClose} />
      )}
    </div>
  );
}

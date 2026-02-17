import { useState, useEffect } from "react";
import axios from "axios";
import { PipVideoPlayer } from "./PipVideoPlayer";
import "./PipVideoPlayer.css";

const API_URL = import.meta.env.VITE_POPULAR_BRANDS_API_URL;

export default function App() {
  console.log(import.meta.env.VITE_POPULAR_BRANDS_API_URL, "URLLLLLLLL");
  const [mediaData, setMediaData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchPopularBrands = async () => {
      try {
        const res = await axios.get(API_URL);
        const brands = res?.data?.data;

        if (!brands || !Array.isArray(brands) || brands.length === 0) {
          setMediaData([]);
          setIsDataReady(true);
          return;
        }

        const transformedData = brands.map((brand) => ({
          id: brand._id,
          src: brand.media?.url || "",
          type: brand.media?.type || "video",
          redirectUrl: brand.link || "",
          rank: brand.rank,
        }));

        // Filter out items with no valid source
        const validData = transformedData.filter((item) => item.src);

        setMediaData(validData);
      } catch (err) {
        console.error("Failed to fetch popular brands:", err);
        setMediaData([]);
      } finally {
        setIsDataReady(true);
      }
    };

    fetchPopularBrands();
  }, []);

  const handlePlayerClose = () => {
    console.log("PiP player closed");
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-title">PiP Video Player App</h1>
        <p className="main-description">
          Why do we use it? It is a long established fact that a reader will be
          distracted by the readable content of a page when looking at its
          layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English. Many desktop
          publishing packages and web page editors now use Lorem Ipsum as their
          default model text, and a search for 'lorem ipsum' will uncover many
          web sites still in their infancy. Various versions have evolved over
          the years, sometimes by accident, sometimes on purpose (injected
          humour and the like).
        </p>
      </div>

      {isDataReady && mediaData.length > 0 && (
        <PipVideoPlayer media={mediaData} onClose={handlePlayerClose} />
      )}
    </div>
  );
}

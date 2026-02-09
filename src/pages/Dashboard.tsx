import { useState, useEffect } from "react";
import { imageService } from "../api/imageService";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";
import ImageUploader from "../components/ImageUploader";
import TransformSettings from "../components/TransformSettings";
import "./Dashboard.css";

type ViewMode = "list" | "upload" | "edit";

export default function Dashboard() {
  const [view, setView] = useState<ViewMode>("list");
  const [images, setImages] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await imageService.getAll(0, 10);
      setImages(data.content);
      setView("list");
    } catch (err) {
      console.error("Gallery load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleTransform = async (img: any) => {
    console.log("Received image object:", img);
  
    if (!img) return;

    setLoading(true);
    try {
      const imageKey = img.r2Key; 
      setKey(img.r2Key);
      const url = await imageService.getSecureImageUrl(imageKey);
      setSelectedUrl(url);
      setView("edit");      
    } catch (err) {
      console.error("Failed to load image for editing", err);
    } finally {
    setLoading(false);
    }
  };


  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-menu">
        <button 
          className={view === "list" ? "active" : ""} 
          onClick={() => setView("list")}
        >
          Gallery
        </button>
        <button 
          className={view === "upload" ? "active" : ""} 
          onClick={() => setView("upload")}
        >
          Upload
        </button>
      </div>

      <main className="dashboard-content">
        {view === "list" && (
          <div className="image-grid">
            {images.map((img) => (
              <ImageCard key={img.id} img={img} onEdit={handleTransform} />
            ))}
            {images.length === 0 && !loading && <p>No images found. Start by uploading one!</p>}
          </div>
        )}

        {view === "upload" && (
          <ImageUploader onSuccess={loadGallery} />
        )}

        {view === "edit" && selectedUrl && key && (
          <div className="editor-container">
            <button className="back-link" onClick={() => setView("list")}>← Back to Gallery</button>
            <TransformSettings r2Key={key} imageUrl={selectedUrl} />
          </div>
        )}
      </main>
    </div>
  );
}
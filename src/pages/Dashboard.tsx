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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const handleTransform = (id: string) => {
    setSelectedId(id);
    setView("edit");
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
          <ImageUploader onFileSelect={(file) => console.log("Upload logic here", file)} />
        )}

        {view === "edit" && selectedId && (
          <div className="editor-container">
            <button className="back-link" onClick={() => setView("list")}>← Back to Gallery</button>
            <TransformSettings onProcess={(data) => console.log("Transforming", selectedId, data)} />
          </div>
        )}
      </main>
    </div>
  );
}
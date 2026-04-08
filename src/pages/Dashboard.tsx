import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Upload, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
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
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await imageService.getAll(0, 50); // Increased limit for better gallery view
      setImages(data.content || []);
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
      
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <button 
            className={`nav-item ${view === "list" ? "active" : ""}`} 
            onClick={() => setView("list")}
          >
            <LayoutGrid size={18} />
            <span>Gallery</span>
          </button>
          <button 
            className={`nav-item ${view === "upload" ? "active" : ""}`} 
            onClick={() => setView("upload")}
          >
            <Upload size={18} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      <main className="dashboard-main">
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div 
              key="list"
              className="gallery-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="view-header">
                <h2>Your Media Library</h2>
                <p>{images.length} images stored</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <Loader2 className="spinner" size={40} />
                  <p>Loading your gallery...</p>
                </div>
              ) : (
                <div className="image-grid">
                  {images.map((img) => (
                    <ImageCard key={img.id} img={img} onEdit={handleTransform} />
                  ))}
                  {images.length === 0 && (
                    <div className="empty-state">
                      <ImageIcon size={48} />
                      <h3>No images found</h3>
                      <p>Start by uploading your first image to get started.</p>
                      <button className="primary-btn" onClick={() => setView("upload")}>
                        Upload Image
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === "upload" && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="view-header centered">
                <h2>Upload New Image</h2>
                <p>Add images to your library for processing</p>
              </div>
              <ImageUploader onSuccess={loadGallery} />
            </motion.div>
          )}

          {view === "edit" && selectedUrl && key && (
            <motion.div 
              key="edit"
              className="editor-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="editor-nav">
                <button className="back-link-btn" onClick={() => setView("list")}>
                  <ArrowLeft size={18} />
                  <span>Back to Library</span>
                </button>
                <div className="editor-title">
                  <h2>Image Editor</h2>
                </div>
              </div>
              <TransformSettings r2Key={key} imageUrl={selectedUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
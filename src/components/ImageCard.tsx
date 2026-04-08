import { useState, useEffect } from "react";
import { imageService } from "../api/imageService";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Download, Trash2, Maximize2, FileText } from "lucide-react";
import "./ImageCard.css";

interface ImageCardProps {
  img: any;
  onEdit: (img: any) => void;
}

export default function ImageCard({ img, onEdit }: ImageCardProps) {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let objectUrl: string;
    imageService.getSecureImageUrl(img.r2Key).then(url => {
      objectUrl = url;
      setImgUrl(url);
    });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [img.r2Key]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await imageService.deleteImage(img.r2Key);
        window.location.reload();
      } catch (err) {
        alert("Failed to delete image");
      }
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    imageService.downloadImage(img.r2Key);
  };

  return (
    <motion.div 
      className="image-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="image-preview-container">
        {imgUrl ? (
          <img src={imgUrl} alt={img.originalName} className="image-preview-img" />
        ) : (
          <div className="image-placeholder">
            <div className="loader"></div>
          </div>
        )}
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="image-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button className="overlay-btn" onClick={() => onEdit(img)} title="Transform">
                <Settings size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="image-details">
        <div className="image-header">
          <FileText size={14} className="text-muted" />
          <h4 className="image-title" title={img.originalName}>{img.originalName}</h4>
        </div>
        
        <div className="image-meta">
          <div className="meta-item">
            <Maximize2 size={12} />
            <span>{img.width} × {img.height}</span>
          </div>
          <span className="file-tag">{img.contentType.split('/')[1].toUpperCase()}</span>
        </div>

        <div className="card-actions">
          <button className="action-btn edit-btn" onClick={() => onEdit(img)}>
            <Settings size={16} />
            <span>Edit</span>
          </button>
          <button className="action-btn download-btn" onClick={handleDownload}>
            <Download size={16} />
          </button>
          <button className="action-btn delete-btn" onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
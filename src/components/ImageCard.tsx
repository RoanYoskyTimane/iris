import { useState, useEffect } from "react";
import { imageService } from "../api/imageService";
import "./ImageCard.css";

interface ImageCardProps {
  img: any;
  onEdit: (img: any) => void;
}

export default function ImageCard({ img, onEdit }: ImageCardProps) {
  const [imgUrl, setImgUrl] = useState<string>("");

  useEffect(() => {
    let objectUrl: string;
    imageService.getSecureImageUrl(img.r2Key).then(url => {
      objectUrl = url;
      setImgUrl(url);
    });

    // Cleanup to prevent memory leaks
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [img.r2Key]);

  const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this image?")) {
    try {
      await imageService.deleteImage(img.id);
      window.location.reload();
    } catch (err) {
      alert("Failed to delete image");
    }
  }
};

  return (
    <div className="image-card">
      <div className="image-preview">
        {imgUrl ? (
          <img src={imgUrl} alt={img.originalName} />
        ) : (
          <div className="image-placeholder">Loading...</div>
        )}
      </div>
      <div className="image-info">
        <h4>{img.originalName}</h4>
        <p>{img.width} x {img.height} • {img.contentType.split('/')[1].toUpperCase()}</p>
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(img)}>
            Transform
          </button>
          <button 
            className="download-btn" 
            onClick={() => imageService.downloadImage(img.id)}
          >
            Download
          </button>
          <button className="delete-btn" onClick={handleDelete} title="Delete Image">
  Delete
</button>
        </div>
      </div>
    </div>
  );
}
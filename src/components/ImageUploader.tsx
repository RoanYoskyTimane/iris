import { useState, useRef } from 'react';
import { imageService } from '../api/imageService';
import './ImageUploader.css';

interface ImageUploaderProps {
  onSuccess: () => void;
}

export default function ImageUploader({ onSuccess }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await imageService.upload(selectedFile);
      setPreviewUrl(null);
      setSelectedFile(null);
      onSuccess(); 
    } catch (err) {
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader-wrapper">
      <div className="uploader-container">
        {!previewUrl ? (
          <div 
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            <div className="upload-icon">↑</div>
            <h3>Click or drag image here</h3>
            <p>Supports PNG, JPG, WebP</p>
            <input type="file" hidden ref={fileInputRef} accept="image/*" 
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
          </div>
        ) : (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" />
            <div className="upload-actions">
              <button className="confirm-btn" onClick={handleUploadSubmit} disabled={uploading}>
                {uploading ? "Uploading..." : "Confirm Upload"}
              </button>
              <button 
                style={{background: 'none', border: 'none', color: '#888', cursor: 'pointer'}} 
                onClick={() => setPreviewUrl(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
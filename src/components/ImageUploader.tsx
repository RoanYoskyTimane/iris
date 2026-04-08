import { useState, useRef } from 'react';
import { imageService } from '../api/imageService';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onSuccess: () => void;
}

export default function ImageUploader({ onSuccess }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
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
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="uploader-wrapper">
      <motion.div 
        className="uploader-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div 
              key="dropzone"
              className={`drop-zone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-icon-container">
                <Upload size={32} />
              </div>
              <div className="upload-text">
                <h3>Select an image to process</h3>
                <p>Drag and drop or click to browse</p>
              </div>
              <div className="upload-formats">
                <span>PNG</span>
                <span>JPG</span>
                <span>WebP</span>
              </div>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              className="preview-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="preview-image-wrapper">
                <img src={previewUrl} alt="Preview" className="upload-preview-img" />
                <button className="clear-btn" onClick={clearSelection}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="preview-info">
                <div className="file-info-header">
                  <ImageIcon size={18} className="text-primary" />
                  <span className="file-name">{selectedFile?.name}</span>
                </div>
                
                <div className="upload-actions">
                  <button className="confirm-upload-btn" onClick={handleUploadSubmit} disabled={uploading}>
                    {uploading ? (
                      <div className="loader-sm"></div>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Confirm and Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
import { useState } from 'react';
import './TransformSettings.css';
import { imageService } from '../api/imageService';
import ImageCropper from './ImageCropper';

export default function TransformSettings({r2Key,imageUrl}: { r2Key: string ,imageUrl: string}) {
  const [format, setFormat] = useState('png');
  const [filters, setFilters] = useState({ grayscale: false, sepia: false });
  const [cropPixels, setCropPixels] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransform = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        transformations: {
          resize: { width: 800, height: 600 },
          crop: cropPixels,
          format: format,
          rotate: rotation,
          filters: filters
        }
      };

      const resultUrl = await imageService.transform(r2Key, payload);
      setProcessedUrl(resultUrl); 
    } catch (err) {
      alert("Transformation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `transformed-${r2Key}.${format}`;
    link.click();
  };

  return (
    <div>
      {!processedUrl ? 
      (
        <div className="settings-card">
      <ImageCropper image={imageUrl} onCropComplete={setCropPixels} rotation={rotation}/>
      <div className="settings-group">
        <label>Output Format</label>
        <div className="format-options">
          {['png', 'jpg', 'webp'].map((f) => (
            <button 
              key={f}
              className={`format-btn ${format === f ? 'active' : ''}`}
              onClick={() => setFormat(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="controls">
            <label>Rotation: {rotation}°</label>
            <input 
              type="range" min="0" max="360" 
              value={rotation} 
              onChange={(e) => setRotation(Number(e.target.value))} 
            />
      </div>

      <div className="settings-group">
        <label>Filters</label>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ fontWeight: 400 }}>
            <input 
              type="checkbox" 
              onChange={(e) => setFilters({...filters, grayscale: e.target.checked})} 
            /> Grayscale
          </label>
          <label style={{ fontWeight: 400 }}>
            <input 
              type="checkbox" 
              onChange={(e) => setFilters({...filters, sepia: e.target.checked})} 
            /> Sepia
          </label>
        </div>
      </div>


      <button className="process-btn" onClick={handleTransform} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Apply Transformations"}
      </button>
      </div>
    </div>
      ) : (
        <div className="result-preview">
          <h3>Transformation Complete!</h3>
          <img src={processedUrl} alt="Result" style={{ maxWidth: '100%' }} />
          <div className="actions">
            <button onClick={() => setProcessedUrl(null)}>Edit Again</button>
            <button className="download-btn" onClick={downloadProcessed}>
              Download Result
            </button>
          </div>
        </div>
      )
      }
    </div>
  );
}
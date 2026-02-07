import { useState } from 'react';
import './TransformSettings.css';
import ImageCropper from './ImageCropper';

export default function TransformSettings({imageUrl, onProcess }: { imageUrl: string,onProcess: (data: any) => void }) {
  const [format, setFormat] = useState('png');
  const [filters, setFilters] = useState({ grayscale: false, sepia: false });
  const [cropPixels, setCropPixels] = useState(null);

  const handleSubmit = () => {
    const payload = {
      transformations: {
        format: format,
        crop: cropPixels,
        resize: { width: 800, height: 600 }, 
        rotate: 0,
        filters: filters
      }
    };
    onProcess(payload);
  };

  return (
    <div className="settings-card">
      <ImageCropper image={imageUrl} onCropComplete={setCropPixels} />
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

      <button className="process-btn" onClick={handleSubmit}>
        Process Image
      </button>
    </div>
  );
}
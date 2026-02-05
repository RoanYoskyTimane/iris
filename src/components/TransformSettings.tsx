import { useState } from 'react';
import './TransformSettings.css';

export default function TransformSettings({ onProcess }: { onProcess: (data: any) => void }) {
  const [format, setFormat] = useState('png');
  const [filters, setFilters] = useState({ grayscale: false, sepia: false });

  const handleSubmit = () => {
    const payload = {
      transformations: {
        format: format,
        filters: filters,
        // Default values for now
        rotate: 0,
        resize: { width: 800, height: 600 }
      }
    };
    onProcess(payload);
  };

  return (
    <div className="settings-card">
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
        <label>AI Enhancements</label>
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
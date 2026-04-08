import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  RotateCw, 
  Layers, 
  Type, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { imageService } from '../api/imageService';
import ImageCropper from './ImageCropper';
import './TransformSettings.css';

export default function TransformSettings({r2Key, imageUrl}: { r2Key: string, imageUrl: string }) {
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
      alert("Transformation failed. Please try again.");
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
    <div className="transform-wrapper">
      <AnimatePresence mode="wait">
        {!processedUrl ? (
          <motion.div 
            key="settings"
            className="settings-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="settings-main">
              <div className="settings-preview-section">
                <ImageCropper image={imageUrl} onCropComplete={setCropPixels} rotation={rotation}/>
              </div>

              <div className="settings-controls-section">
                <div className="settings-header">
                  <Settings size={20} className="text-primary" />
                  <h3>Transformation Settings</h3>
                </div>

                <div className="control-group">
                  <div className="control-header">
                    <Type size={16} />
                    <span>Output Format</span>
                  </div>
                  <div className="format-grid">
                    {['png', 'jpg', 'webp'].map((f) => (
                      <button 
                        key={f}
                        className={`format-option ${format === f ? 'active' : ''}`}
                        onClick={() => setFormat(f)}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <div className="control-header">
                    <RotateCw size={16} />
                    <span>Rotation: {rotation}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" 
                    value={rotation} 
                    onChange={(e) => setRotation(Number(e.target.value))} 
                    className="rotation-range"
                  />
                </div>

                <div className="control-group">
                  <div className="control-header">
                    <Layers size={16} />
                    <span>Filters</span>
                  </div>
                  <div className="filter-options">
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={filters.grayscale}
                        onChange={(e) => setFilters({...filters, grayscale: e.target.checked})} 
                      />
                      <span>Grayscale</span>
                    </label>
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={filters.sepia}
                        onChange={(e) => setFilters({...filters, sepia: e.target.checked})} 
                      />
                      <span>Sepia</span>
                    </label>
                  </div>
                </div>

                <button 
                  className="apply-btn" 
                  onClick={handleTransform} 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="loader-sm"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      <span>Apply Transformations</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            className="result-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="result-header">
              <div className="success-badge">
                <CheckCircle2 size={20} />
                <span>Transformation Complete</span>
              </div>
            </div>

            <div className="result-preview-wrapper">
              <img src={processedUrl} alt="Transformed Result" className="result-img" />
            </div>

            <div className="result-actions">
              <button className="back-btn" onClick={() => setProcessedUrl(null)}>
                <ArrowLeft size={18} />
                <span>Adjust Settings</span>
              </button>
              <button className="download-result-btn" onClick={downloadProcessed}>
                <Download size={18} />
                <span>Download {format.toUpperCase()}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
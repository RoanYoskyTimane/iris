import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { ZoomIn, ZoomOut } from 'lucide-react'
import './ImageCropper.css'

interface CropperProps {
  image: string;
  onCropComplete: (croppedAreaPixels: any) => void;
  rotation: number;
}

export default function ImageCropper({ image, onCropComplete, rotation }: CropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  return (
    <div className="cropper-wrapper">
      <div className="crop-container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          rotation={rotation}
          onCropChange={setCrop}
          onCropComplete={(_, pixels) => onCropComplete(pixels)}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              borderRadius: 'var(--radius-lg)',
            }
          }}
        />
      </div>
      <div className="cropper-controls">
        <div className="zoom-control">
          <button className="zoom-btn" onClick={() => setZoom(Math.max(1, zoom - 0.1))}>
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-range"
          />
          <button className="zoom-btn" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
            <ZoomIn size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
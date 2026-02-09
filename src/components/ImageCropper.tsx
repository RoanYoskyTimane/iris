import { useState } from 'react'
import Cropper from 'react-easy-crop'
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
          onRotationChange={() => {}}
        />
      </div>
      <div className="controls">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="zoom-range"
        />
      </div>
    </div>
  )
}
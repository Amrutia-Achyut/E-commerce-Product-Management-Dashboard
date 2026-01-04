'use client';

import { useState } from 'react';
import axios from 'axios';
import './forms.css';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setImages([...images, response.data.data.url]);
      } else {
        setError('Failed to upload image');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-grid">
        {images.map((url, index) => (
          <div key={index} className="image-preview">
            <img src={url} alt={`Product ${index + 1}`} />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="remove-image-btn"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <label className="image-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <div className="image-upload-placeholder">
              {uploading ? (
                <div className="upload-spinner">Uploading...</div>
              ) : (
                <>
                  <span className="upload-icon">+</span>
                  <span className="upload-text">Add Image</span>
                </>
              )}
            </div>
          </label>
        )}
      </div>
      {error && <span className="field-error">{error}</span>}
      <p className="image-upload-hint">
        Upload up to 5 images. Max file size: 5MB
      </p>
    </div>
  );
}


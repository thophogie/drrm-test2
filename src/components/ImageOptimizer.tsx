import React, { useState } from 'react';
import { Image, Download, Zap, Info } from 'lucide-react';

interface ImageOptimizerProps {
  imageUrl: string;
  onOptimized?: (optimizedUrl: string, stats: OptimizationStats) => void;
}

interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
  format: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ imageUrl, onOptimized }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stats, setStats] = useState<OptimizationStats | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);

  const optimizeImage = async (
    file: File | string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'webp' | 'png';
    } = {}
  ): Promise<{ blob: Blob; stats: OptimizationStats }> => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const originalDimensions = { width, height };

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Apply image smoothing for better quality
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Convert to blob
        const mimeType = `image/${format}`;
        canvas.toBlob((blob) => {
          if (blob) {
            // Calculate original size (estimate for URLs)
            const originalSize = typeof file === 'string' ? blob.size * 2 : file.size;
            const compressionRatio = ((originalSize - blob.size) / originalSize) * 100;

            const stats: OptimizationStats = {
              originalSize,
              optimizedSize: blob.size,
              compressionRatio,
              dimensions: { width, height },
              format
            };

            resolve({ blob, stats });
          } else {
            reject(new Error('Failed to optimize image'));
          }
        }, mimeType, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      if (typeof file === 'string') {
        img.crossOrigin = 'anonymous';
        img.src = file;
      } else {
        img.src = URL.createObjectURL(file);
      }
    });
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const { blob, stats } = await optimizeImage(imageUrl);
      const optimizedUrl = URL.createObjectURL(blob);
      
      setOptimizedUrl(optimizedUrl);
      setStats(stats);
      
      if (onOptimized) {
        onOptimized(optimizedUrl, stats);
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadOptimized = () => {
    if (optimizedUrl) {
      const link = document.createElement('a');
      link.href = optimizedUrl;
      link.download = `optimized-image.${stats?.format || 'jpg'}`;
      link.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="mr-2 text-yellow-500" size={20} />
          Image Optimizer
        </h3>
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Image size={16} />
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
        </button>
      </div>

      {/* Original Image */}
      <div className="mb-4">
        <img
          src={imageUrl}
          alt="Original"
          className="w-full h-48 object-cover rounded-lg border"
        />
      </div>

      {/* Optimization Results */}
      {stats && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Info className="text-green-600 mr-2" size={16} />
              <span className="font-medium text-green-800">Optimization Complete</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Original Size:</span>
                <div className="font-semibold">{formatFileSize(stats.originalSize)}</div>
              </div>
              <div>
                <span className="text-gray-600">Optimized Size:</span>
                <div className="font-semibold text-green-600">{formatFileSize(stats.optimizedSize)}</div>
              </div>
              <div>
                <span className="text-gray-600">Compression:</span>
                <div className="font-semibold text-blue-600">{stats.compressionRatio.toFixed(1)}% saved</div>
              </div>
              <div>
                <span className="text-gray-600">Dimensions:</span>
                <div className="font-semibold">{stats.dimensions.width} × {stats.dimensions.height}</div>
              </div>
            </div>
          </div>

          {/* Optimized Image Preview */}
          {optimizedUrl && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Optimized Preview</span>
                <button
                  onClick={downloadOptimized}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
              <img
                src={optimizedUrl}
                alt="Optimized"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      )}

      {/* Optimization Tips */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 mb-2">Optimization Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Images are resized to max 1920×1080 for web optimization</li>
          <li>• JPEG quality is set to 85% for best size/quality balance</li>
          <li>• WebP format provides better compression than JPEG</li>
          <li>• Optimized images load faster and save bandwidth</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageOptimizer;
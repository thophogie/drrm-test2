import React, { useState, useCallback } from 'react';
import { X, Upload, Image, Check, AlertCircle, Trash2, Edit3 } from 'lucide-react';

interface BulkUploadItem {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
  status: 'pending' | 'processing' | 'optimized' | 'error';
  optimizedSize?: number;
  originalSize: number;
  compressionRatio?: number;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: BulkUploadItem[]) => void;
  categories: string[];
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories 
}) => {
  const [uploadItems, setUploadItems] = useState<BulkUploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Image optimization function
  const optimizeImage = (file: File): Promise<{ blob: Blob; compressionRatio: number }> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for web)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressionRatio = ((file.size - blob.size) / file.size) * 100;
            resolve({ blob, compressionRatio });
          }
        }, 'image/jpeg', 0.85); // 85% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const newItems: BulkUploadItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const item: BulkUploadItem = {
          id: Date.now().toString() + i,
          file,
          preview,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: '',
          category: categories[0] || '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          tags: [],
          status: 'pending',
          originalSize: file.size
        };
        newItems.push(item);
      }
    }
    
    setUploadItems(prev => [...prev, ...newItems]);
  }, [categories]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const optimizeAllImages = async () => {
    setIsProcessing(true);
    
    for (const item of uploadItems) {
      if (item.status === 'pending') {
        setUploadItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'processing' } : i
        ));
        
        try {
          const { blob, compressionRatio } = await optimizeImage(item.file);
          
          setUploadItems(prev => prev.map(i => 
            i.id === item.id ? { 
              ...i, 
              status: 'optimized',
              optimizedSize: blob.size,
              compressionRatio
            } : i
          ));
        } catch (error) {
          setUploadItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'error' } : i
          ));
        }
      }
    }
    
    setIsProcessing(false);
  };

  const updateItem = (id: string, updates: Partial<BulkUploadItem>) => {
    setUploadItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id));
  };

  const addTag = (id: string, tag: string) => {
    if (tag.trim()) {
      updateItem(id, {
        tags: [...uploadItems.find(i => i.id === id)?.tags || [], tag.trim()]
      });
    }
  };

  const removeTag = (id: string, tagToRemove: string) => {
    const item = uploadItems.find(i => i.id === id);
    if (item) {
      updateItem(id, {
        tags: item.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleSubmit = () => {
    const validItems = uploadItems.filter(item => 
      item.title.trim() && item.category && item.date
    );
    onSubmit(validItems);
    setUploadItems([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Upload & Image Optimization</h2>
            <p className="text-sm text-gray-600">Upload multiple images and optimize them for web</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop images here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Support for JPG, PNG, GIF up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="bulk-file-input"
            />
            <label
              htmlFor="bulk-file-input"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
            >
              Select Images
            </label>
          </div>

          {/* Optimization Controls */}
          {uploadItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Image Optimization</h3>
                  <p className="text-sm text-gray-600">
                    Optimize images for faster loading (recommended)
                  </p>
                </div>
                <button
                  onClick={optimizeAllImages}
                  disabled={isProcessing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Image size={16} />
                  <span>{isProcessing ? 'Optimizing...' : 'Optimize All'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Total Images</div>
                  <div className="text-2xl font-bold text-blue-600">{uploadItems.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Original Size</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatFileSize(uploadItems.reduce((sum, item) => sum + item.originalSize, 0))}
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">Optimized Size</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatFileSize(uploadItems.reduce((sum, item) => sum + (item.optimizedSize || item.originalSize), 0))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Items */}
          <div className="space-y-4">
            {uploadItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-4">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={item.preview}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -right-2">
                      {item.status === 'optimized' && (
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                      {item.status === 'processing' && (
                        <div className="bg-blue-500 text-white rounded-full p-1 animate-spin">
                          <Image size={12} />
                        </div>
                      )}
                      {item.status === 'error' && (
                        <div className="bg-red-500 text-white rounded-full p-1">
                          <AlertCircle size={12} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(item.id, { category: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateItem(item.id, { date: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateItem(item.id, { location: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Event location"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        placeholder="Brief description of the event or activity"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => removeTag(item.id, tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add tag and press Enter"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(item.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* File Info & Actions */}
                  <div className="w-32 text-right">
                    <div className="text-xs text-gray-500 mb-2">
                      <div>Original: {formatFileSize(item.originalSize)}</div>
                      {item.optimizedSize && (
                        <div className="text-green-600">
                          Optimized: {formatFileSize(item.optimizedSize)}
                          <br />
                          Saved: {item.compressionRatio?.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {uploadItems.length} images ready for upload
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploadItems.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload All ({uploadItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
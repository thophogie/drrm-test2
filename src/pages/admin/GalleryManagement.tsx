import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Upload, X, Calendar, MapPin, Tag, Zap } from 'lucide-react';
import BulkUploadModal from '../../components/BulkUploadModal';
import ImageOptimizer from '../../components/ImageOptimizer';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
  status: 'published' | 'draft';
  featured: boolean;
  createdAt: string;
  optimized?: boolean;
  originalSize?: number;
  optimizedSize?: number;
}

const GalleryManagement: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      title: 'BDRRM Planning Training Workshop',
      description: 'Training session on Barangay Disaster Risk Reduction and Management Planning at Barangay Basicao Interior.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
      category: 'Training',
      date: '2024-06-25',
      location: 'Barangay Basicao Interior',
      tags: ['BDRRM', 'Training', 'Workshop', 'Barangay Officials'],
      status: 'published',
      featured: true,
      createdAt: '2024-06-29',
      optimized: true,
      originalSize: 2048000,
      optimizedSize: 512000
    },
    {
      id: '2',
      title: 'Nationwide Simultaneous Earthquake Drill',
      description: 'Municipality participated in the 2nd quarter nationwide simultaneous earthquake drill with over 5,000 participants.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg',
      category: 'Drill',
      date: '2023-06-09',
      location: 'Municipality-wide',
      tags: ['Earthquake', 'Drill', 'Safety', 'Community'],
      status: 'published',
      featured: false,
      createdAt: '2023-06-09',
      optimized: false
    },
    {
      id: '3',
      title: 'Water Rescue Training Course',
      description: '20 volunteers completed intensive training in Basic Life Support, survival skills, and Water Search and Rescue (WASAR).',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
      category: 'Training',
      date: '2021-11-19',
      location: 'Training Center',
      tags: ['Water Rescue', 'WASAR', 'Volunteers', 'Life Support'],
      status: 'published',
      featured: false,
      createdAt: '2023-05-24',
      optimized: true,
      originalSize: 1536000,
      optimizedSize: 384000
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [selectedImageForOptimization, setSelectedImageForOptimization] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    date: '',
    location: '',
    tags: [] as string[],
    status: 'draft' as 'published' | 'draft',
    featured: false
  });
  const [tagInput, setTagInput] = useState('');

  const categories = ['Training', 'Drill', 'Response', 'Community Event', 'Meeting', 'Workshop', 'Assessment'];

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString().split('T')[0];
    
    if (editingItem) {
      setGalleryItems(prev => prev.map(item => 
        item.id === editingItem 
          ? { ...item, ...formData, createdAt: item.createdAt }
          : item
      ));
    } else {
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        optimized: false
      };
      setGalleryItems(prev => [newItem, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: '',
      date: '',
      location: '',
      tags: [],
      status: 'draft',
      featured: false
    });
    setTagInput('');
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      date: item.date,
      location: item.location,
      tags: item.tags,
      status: item.status,
      featured: item.featured
    });
    setEditingItem(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, featured: !item.featured }
        : item
    ));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleBulkUpload = (items: any[]) => {
    const newItems: GalleryItem[] = items.map(item => ({
      id: Date.now().toString() + Math.random(),
      title: item.title,
      description: item.description,
      image: item.preview, // In real app, this would be uploaded to server
      category: item.category,
      date: item.date,
      location: item.location,
      tags: item.tags,
      status: 'draft',
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      optimized: item.status === 'optimized',
      originalSize: item.originalSize,
      optimizedSize: item.optimizedSize
    }));

    setGalleryItems(prev => [...newItems, ...prev]);
  };

  const handleOptimizeImage = (id: string) => {
    const item = galleryItems.find(i => i.id === id);
    if (item) {
      setSelectedImageForOptimization(item.image);
      setIsOptimizerOpen(true);
    }
  };

  const handleOptimizationComplete = (optimizedUrl: string, stats: any) => {
    if (selectedImageForOptimization) {
      // In real app, you would upload the optimized image to server
      // For demo, we'll just update the optimization status
      setGalleryItems(prev => prev.map(item => 
        item.image === selectedImageForOptimization
          ? { 
              ...item, 
              optimized: true,
              originalSize: stats.originalSize,
              optimizedSize: stats.optimizedSize
            }
          : item
      ));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = galleryItems.reduce((sum, item) => sum + (item.originalSize || 0), 0);
  const totalOptimizedSize = galleryItems.reduce((sum, item) => sum + (item.optimizedSize || item.originalSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Manage photos, events, and activities gallery with bulk upload and optimization</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Single Item</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{galleryItems.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {galleryItems.filter(item => item.status === 'published').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Optimized</p>
              <p className="text-3xl font-bold text-purple-600">
                {galleryItems.filter(item => item.optimized).length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Saved</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatFileSize(totalOriginalSize - totalOptimizedSize)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compression</p>
              <p className="text-3xl font-bold text-green-600">{totalSavings.toFixed(1)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredItems.length} items
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                {item.optimized && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Zap size={10} className="mr-1" />
                    Optimized
                  </span>
                )}
                {item.featured && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <button
                  onClick={() => handleOptimizeImage(item.id)}
                  className="bg-purple-600 text-white p-1 rounded-full hover:bg-purple-700 transition-colors"
                  title="Optimize Image"
                >
                  <Zap size={12} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  {item.location}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Tag size={12} className="mr-1" />
                  {item.category}
                </div>
                {item.optimized && item.originalSize && item.optimizedSize && (
                  <div className="text-xs text-green-600">
                    Saved: {formatFileSize(item.originalSize - item.optimizedSize)} 
                    ({(((item.originalSize - item.optimizedSize) / item.originalSize) * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    item.featured
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.featured ? 'Unfeature' : 'Feature'}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Single Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Featured Item</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSubmit={handleBulkUpload}
        categories={categories}
      />

      {/* Image Optimizer Modal */}
      {isOptimizerOpen && selectedImageForOptimization && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Image Optimizer</h2>
                <button
                  onClick={() => {
                    setIsOptimizerOpen(false);
                    setSelectedImageForOptimization(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <ImageOptimizer
                imageUrl={selectedImageForOptimization}
                onOptimized={handleOptimizationComplete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
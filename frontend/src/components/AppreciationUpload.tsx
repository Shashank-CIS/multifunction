import React, { useState, useRef } from 'react';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X, 
  User, 
  Calendar,
  Briefcase,
  MessageSquare,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AppreciationUpload as AppreciationUploadType } from '../types';

interface AppreciationUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (upload: Omit<AppreciationUploadType, 'id' | 'uploadedAt'>) => void;
  engineerName?: string;
  engineerId?: string;
}

const AppreciationUpload: React.FC<AppreciationUploadProps> = ({
  isOpen,
  onClose,
  onSubmit,
  engineerName = "Shashankagowda S",
  engineerId = "2171826"
}) => {
  const [formData, setFormData] = useState({
    engineerId: engineerId,
    engineerName: engineerName,
    projectName: '',
    description: '',
    tags: [''],
    isPublic: true,
    appreciationType: 'client_feedback' as 'client_feedback' | 'team_recognition' | 'management_appreciation' | 'other'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        file: 'Only PDF and image files (JPEG, PNG, GIF) are allowed'
      }));
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setErrors(prev => ({
        ...prev,
        file: 'File size must be less than 10MB'
      }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      // In a real application, you would upload the file to a server here
      // For now, we'll simulate the upload and create a mock file URL
      const mockFileUrl = URL.createObjectURL(selectedFile!);
      
      const validTags = formData.tags.filter(tag => tag.trim());
      
      const uploadData: Omit<AppreciationUploadType, 'id' | 'uploadedAt'> = {
        engineerId: formData.engineerId,
        engineerName: formData.engineerName,
        projectName: formData.projectName,
        fileName: selectedFile!.name,
        fileUrl: mockFileUrl,
        fileType: selectedFile!.type.startsWith('image/') ? 'image' : 'pdf',
        fileSize: selectedFile!.size,
        description: formData.description,
        tags: validTags,
        isPublic: formData.isPublic,
        appreciationType: formData.appreciationType
      };

      onSubmit(uploadData);
      onClose();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to upload file. Please try again.'
      }));
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <Image className="w-8 h-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Appreciation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Auto-filled Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Engineer Name
              </label>
              <input
                type="text"
                value={formData.engineerName}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="text"
                value={new Date('2025-07-29').toLocaleDateString()}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Project Name *
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="Enter project name..."
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 ${
                errors.projectName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : selectedFile
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : errors.file
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center space-x-4">
                  {getFileIcon(selectedFile)}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Drag and drop your file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, JPEG, PNG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide context about this appreciation (project details, achievement, etc.)..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Appreciation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appreciation Type
            </label>
            <select
              value={formData.appreciationType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                appreciationType: e.target.value as typeof formData.appreciationType 
              }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="client_feedback">Client Feedback</option>
              <option value="team_recognition">Team Recognition</option>
              <option value="management_appreciation">Management Appreciation</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags (Optional)
            </label>
            
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder={`Tag ${index + 1}...`}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTag}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Tag className="w-4 h-4 mr-2" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="w-5 h-5 text-blue-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.isPublic ? <Eye className="w-4 h-4 inline mr-2" /> : <EyeOff className="w-4 h-4 inline mr-2" />}
                Make this appreciation public (visible to team members)
              </span>
            </label>
          </div>

          {errors.submit && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 rounded-b-2xl">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Upload Appreciation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppreciationUpload; 
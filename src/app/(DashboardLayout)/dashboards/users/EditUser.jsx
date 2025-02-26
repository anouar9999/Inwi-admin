import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, EyeOff, User, Mail, Shield, Award, Star, CheckCircle, ImageIcon, FileText } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    points: '',
    rank: '',
    is_verified: false,
    bio: '',
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        ...user,
        points: user.points?.toString() || '',
        rank: user.rank?.toString() || '',
        // Convert is_verified to boolean
        is_verified: user.is_verified === 1 || user.is_verified === '1' || user.is_verified === true
      });
      setNewPassword('');
      setImagePreview(null);
    }
  }, [user, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    if (name === 'is_verified') {
      // Convert value to boolean for is_verified
      setFormData(prev => ({
        ...prev,
        [name]: value === '1' || value === true || value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? e.target.checked : value
      }));
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert("Only JPG, PNG & GIF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Add basic fields
    submitData.append('id', formData.id);
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('type', formData.type || 'participant');
    submitData.append('points', formData.points || '0');
    
    // Convert boolean to 1/0 for is_verified
    submitData.append('is_verified', formData.is_verified ? '1' : '0');
    
    submitData.append('bio', formData.bio || '');
    
    // Only append password if it was changed
    if (newPassword) {
      submitData.append('password', newPassword);
    }
    
    // Handle avatar file
    if (formData.avatar instanceof File) {
      submitData.append('avatar', formData.avatar);
    }

    onSave(submitData);
  }, [formData, newPassword, onSave]);

  const InputField = useCallback(({ icon: Icon, label, name, type = "text", value, onChange, options = null, placeholder = "", disabled = false }) => (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-gray-300 text-sm">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        {options ? (
          <select
            id={name}
            name={name}
            value={value ? "1" : "0"}
            onChange={onChange}
            disabled={disabled}
            className="w-full pl-10 pr-3 py-2 bg-[#1a202c]/50 border border-gray-800 text-gray-100 rounded-md focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="0" className="bg-gray-900">Not Verified</option>
            <option value="1" className="bg-gray-900">Verified</option>
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-3 py-2 bg-[#1a202c]/50 border border-gray-800 text-gray-100 rounded-md focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        )}
      </div>
    </div>
  ), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#151923] rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-3 flex justify-between items-center">
          <h2 className="text-gray-100 text-lg">
            Editing {formData.username} s profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="mb-6">
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={`${formData.username}'s avatar`}
                      className="w-28 h-28 rounded-lg object-cover border border-gray-800 group-hover:opacity-75 transition-opacity"
                    />
                  ) : formData.avatar ? (
                    <img
                      src={typeof formData.avatar === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.avatar}` : ''}
                      alt={`${formData.username}'s avatar`}
                      className="w-28 h-28 rounded-lg object-cover border border-gray-800 group-hover:opacity-75 transition-opacity"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${formData.username}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-lg bg-[#1a202c]/50 border border-gray-800 flex items-center justify-center group-hover:bg-[#1a202c]/70 transition-colors">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-gray-400">Click to change avatar</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InputField
                icon={User}
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
              
              <InputField
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              <InputField
                icon={Award}
                label="Points"
                name="points"
                type="number"
                value={formData.points}
                onChange={handleChange}
                placeholder="0"
              />

              <InputField
                icon={Star}
                label="Rank"
                name="rank"
                type="text"
                value={formData.rank}
                onChange={handleChange}
              />

              <InputField
                icon={CheckCircle}
                label="Verification Status"
                name="is_verified"
                value={formData.is_verified}
                onChange={handleChange}
                options={[
                  { value: "0", label: "Not Verified" },
                  { value: "1", label: "Verified" }
                ]}
              />

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-sm">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-[#1a202c]/50 border border-gray-800 text-gray-100 rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Field */}
            <div className="space-y-1.5">
              <label className="text-gray-300 text-sm">Bio</label>
              <div className="relative">
                <div className="absolute top-2.5 left-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#1a202c]/50 border border-gray-800 text-gray-100 rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                  rows="4"
                  placeholder="Write something about yourself..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-gray-800">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 angular-cut hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white angular-cut hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  CheckSquare, 
  AlertTriangle,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { DailyProductionEntry } from '../types';

interface DailyProductionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<DailyProductionEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingEntry?: DailyProductionEntry;
  engineerName?: string;
  engineerId?: string;
}

const DailyProductionForm: React.FC<DailyProductionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingEntry,
  engineerName = "Shashankagowda S", // Default fallback
  engineerId = "2171826" // Default fallback
}) => {
  const [formData, setFormData] = useState({
    engineerId: engineerId,
    engineerName: engineerName,
    date: '2025-07-29',
    projectName: '',
    tasksCompleted: [''],
    workDuration: 'full-day' as 'full-day' | 'half-day',
    ticketsResolved: 0,
    blockers: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        engineerId: existingEntry.engineerId,
        engineerName: existingEntry.engineerName,
        date: existingEntry.date,
        projectName: existingEntry.projectName,
        tasksCompleted: existingEntry.tasksCompleted,
        workDuration: existingEntry.workDuration,
        ticketsResolved: existingEntry.ticketsResolved,
        blockers: existingEntry.blockers || ''
      });
    } else {
      // Reset to defaults for new entries
      setFormData({
        engineerId: engineerId,
        engineerName: engineerName,
        date: '2025-07-29',
        projectName: '',
        tasksCompleted: [''],
        workDuration: 'full-day',
        ticketsResolved: 0,
        blockers: ''
      });
    }
  }, [existingEntry, engineerId, engineerName, isOpen]);

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasksCompleted: [...prev.tasksCompleted, '']
    }));
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted.filter((_, i) => i !== index)
    }));
  };

  const updateTask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted.map((task, i) => i === index ? value : task)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    // Work duration validation is implicit - only full-day or half-day allowed

    if (formData.ticketsResolved < 0) {
      newErrors.ticketsResolved = 'Tickets resolved cannot be negative';
    }

    if (formData.ticketsResolved > 100) {
      newErrors.ticketsResolved = 'Tickets resolved seems too high (max 100 per day)';
    }

    // Tasks are now optional - no validation required

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty tasks
    const validTasks = formData.tasksCompleted.filter((task: string) => task.trim());
    
    onSubmit({
      ...formData,
      tasksCompleted: validTasks
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {existingEntry ? 'Edit' : 'New'} Daily Production Update
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
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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

          {/* Work Duration and Tickets Resolved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Work Duration *
              </label>
              <select
                value={formData.workDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, workDuration: e.target.value as 'full-day' | 'half-day' }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-day">Full Day (10 hours)</option>
                <option value="half-day">Half Day (5 hours)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Standard work day durations</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CheckSquare className="w-4 h-4 inline mr-2" />
                Tickets Resolved
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.ticketsResolved}
                onChange={(e) => setFormData(prev => ({ ...prev, ticketsResolved: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 ${
                  errors.ticketsResolved ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.ticketsResolved && (
                <p className="mt-1 text-sm text-red-600">{errors.ticketsResolved}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Number of support tickets resolved today</p>
            </div>
          </div>

          {/* Tasks Completed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Tasks Completed
            </label>
            <p className="text-xs text-gray-500 mb-3">Optional - Add tasks you completed today</p>
            
            <div className="space-y-3">
              {formData.tasksCompleted.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder={`Task ${index + 1}...`}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.tasksCompleted.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTask}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Task
              </button>
            </div>
            
            {errors.tasks && (
              <p className="mt-1 text-sm text-red-600">{errors.tasks}</p>
            )}
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Blockers (Optional)
            </label>
            <textarea
              value={formData.blockers}
              onChange={(e) => setFormData(prev => ({ ...prev, blockers: e.target.value }))}
              placeholder="Describe any blockers or issues encountered..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 rounded-b-2xl">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyProductionForm; 
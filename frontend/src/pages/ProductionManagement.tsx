import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload as UploadIcon, 
  User, 
  Settings,
  BarChart3,
  FileText,
  Award,
  Users,
  Calendar,
  Download,
  Shield,
  Edit,
  Search,
  X,
  Save,
  Ticket,
    Filter,
  Eye,
  Clock
} from 'lucide-react';
import DailyProductionForm from '../components/DailyProductionForm';
import AppreciationUpload from '../components/AppreciationUpload';
import ProductionDashboard from '../components/ProductionDashboard';
import EngineerProfileView from '../components/EngineerProfileView';
import { 
  DailyProductionEntry, 
  AppreciationUpload as AppreciationUploadType, 
  Engineer,
  AdminProductionAccess
} from '../types';
import { useAuth } from '../contexts/AuthContext';

// Real engineers data for auto-fill
const realEngineers = [
  { empId: '162296', name: 'Satya Sharma', project: 'PAPA', location: 'Bangalore', assetId: 'BLR-WS-001' },
  { empId: '162420', name: 'Madhan Raj Selvaraj', project: 'Metlife', location: 'Chennai', assetId: 'CHN-WS-002' },
  { empId: '162421', name: 'Kameswaran Murugesan', project: 'Pearson', location: 'Mumbai', assetId: 'MUM-WS-003' },
  { empId: '187784', name: 'Ashish Avinash Patil', project: 'Trafigura & Takeda', location: 'Pune', assetId: 'PUN-WS-004' },
  { empId: '2171826', name: 'Shashankagowda S', project: 'NYL', location: 'Bangalore', assetId: 'BLR-WS-005' },
  { empId: '2171825', name: 'Mohan Kumar V', project: 'Takeda', location: 'Chennai', assetId: 'CHN-WS-006' },
  { empId: '2175815', name: 'Arunsankar V', project: 'HCSC', location: 'Hyderabad', assetId: 'HYD-WS-007' },
  { empId: '2176358', name: 'Charansai Patnam', project: 'IDCS Application', location: 'Mumbai', assetId: 'MUM-WS-008' },
  { empId: '2181455', name: 'Dineshkumar T', project: 'US Bank', location: 'Pune', assetId: 'PUN-WS-009' },
  { empId: '2438360', name: 'Dinanath Vijay Patil', project: 'Compliance', location: 'Kolkata', assetId: 'KOL-WS-010' },
  { empId: '265754', name: 'Saikrishna Maddi', project: 'UBS', location: 'Bangalore', assetId: 'BLR-WS-011' },
  { empId: '282670', name: 'Denzil F', project: 'BNYM', location: 'Chennai', assetId: 'CHN-WS-012' },
  { empId: '408515', name: 'Somnath Ghosh', project: 'JPMC', location: 'Mumbai', assetId: 'MUM-WS-013' },
  { empId: '459873', name: 'Manash Ranjan Nayak', project: 'Microsoft (HYD)', location: 'Hyderabad', assetId: 'HYD-WS-014' },
  { empId: '482720', name: 'Hamsanada S', project: 'Apple', location: 'Bangalore', assetId: 'BLR-WS-015' },
  { empId: '599860', name: 'Vamsi Krishna Vrns Pammy', project: 'LinkedIn', location: 'Chennai', assetId: 'CHN-WS-016' },
  { empId: '599886', name: 'Atul Landge', project: 'JPMC', location: 'Mumbai', assetId: 'MUM-WS-017' }
];

// Create Ticket Modal Component
interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (ticket: any) => void;
  onUpdateTicket?: (ticketId: string, updates: any) => void;
  editingTicket?: any | null;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmitTicket, 
  onUpdateTicket,
  editingTicket 
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    assetId: '',
    location: '',
    project: '',
    date: new Date().toISOString().split('T')[0],
    issueDescription: '',
    resolution: '',
    ticketStatus: 'Open'
  });
  const [searchSuggestions, setSearchSuggestions] = useState<(typeof realEngineers[0] & { isImported?: boolean })[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUsers, setUploadedUsers] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState('');

  // Effect to populate form data when editing
  useEffect(() => {
    if (editingTicket) {
      setFormData({
        employeeId: editingTicket.employeeId || '',
        employeeName: editingTicket.employeeName || '',
        assetId: editingTicket.assetId || '',
        location: editingTicket.location || '',
        project: editingTicket.project || '',
        date: editingTicket.date || new Date().toISOString().split('T')[0],
        issueDescription: editingTicket.issueDescription || '',
        resolution: editingTicket.resolution || '',
        ticketStatus: editingTicket.ticketStatus || 'Open'
      });
    } else {
      // Reset form for new ticket
      setFormData({
        employeeId: '',
        employeeName: '',
        assetId: '',
        location: '',
        project: '',
        date: new Date().toISOString().split('T')[0],
        issueDescription: '',
        resolution: '',
        ticketStatus: 'Open'
      });
    }
    // Clear upload state when modal opens/closes
    if (isOpen) {
      setUploadedFile(null);
      setUploadedUsers([]);
      setUploadError('');
    }
  }, [editingTicket, isOpen]);

  // Auto-fill based on employee ID or name
  const handleEmployeeSearch = (value: string, field: 'employeeId' | 'employeeName') => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value.length > 2) {
      // Search in existing engineers
      const filteredEngineers = realEngineers.filter(eng => 
        field === 'employeeId' 
          ? eng.empId.includes(value)
          : eng.name.toLowerCase().includes(value.toLowerCase())
      );

      // Search in uploaded users and convert to engineer format
      const filteredUploaded = uploadedUsers.filter(user => 
        field === 'employeeId' 
          ? user.employeeId?.includes(value)
          : user.employeeName?.toLowerCase().includes(value.toLowerCase())
      ).map(user => ({
        empId: user.employeeId || '',
        name: user.employeeName || '',
        assetId: user.assetId || '',
        location: user.location || '',
        project: user.project || '',
        designation: user.designation || 'N/A',
        email: user.email || 'N/A',
        isImported: true // Flag to identify imported users
      }));

      // Combine both arrays with imported users first
      const combinedSuggestions = [...filteredUploaded, ...filteredEngineers];
      setSearchSuggestions(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // File upload handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a CSV file only');
      return;
    }

    setUploadedFile(file);
    setUploadError('');

    try {
      const text = await file.text();
      const users = parseCSV(text);
      setUploadedUsers(users);
    } catch (error) {
      setUploadError('Error reading file. Please check file format.');
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const users: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const user: any = {};
      headers.forEach((header, index) => {
        switch (header) {
          case 'employee id':
          case 'empid':
          case 'id':
            user.employeeId = values[index];
            break;
          case 'employee name':
          case 'name':
            user.employeeName = values[index];
            break;
          case 'asset id':
          case 'assetid':
            user.assetId = values[index];
            break;
          case 'location':
            user.location = values[index];
            break;
          case 'project':
            user.project = values[index];
            break;
          case 'designation':
            user.designation = values[index];
            break;
          case 'email':
            user.email = values[index];
            break;
          default:
            user[header] = values[index];
        }
      });
      users.push(user);
    }

    return users;
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadedUsers([]);
    setUploadError('');
    // Reset file input
    const fileInput = document.getElementById('userFileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const selectEmployee = (employee: typeof realEngineers[0] & { isImported?: boolean }) => {
    setFormData(prev => ({
      ...prev,
      employeeId: employee.empId,
      employeeName: employee.name,
      assetId: employee.assetId,
      location: employee.location,
      project: employee.project
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTicket && onUpdateTicket) {
      // Update existing ticket
      const updates = {
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        assetId: formData.assetId,
        location: formData.location,
        project: formData.project,
        date: formData.date,
        issueDescription: formData.issueDescription,
        resolution: formData.resolution,
        ticketStatus: formData.ticketStatus,
        updatedAt: new Date().toISOString()
      };
      
      onUpdateTicket(editingTicket.id, updates);
      alert('Ticket updated successfully!');
    } else {
      // Create new ticket
      const newTicket = {
        id: `TKT-${String(Date.now()).slice(-3).padStart(3, '0')}`,
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        assetId: formData.assetId,
        location: formData.location,
        project: formData.project,
        date: formData.date,
        issueDescription: formData.issueDescription,
        resolution: formData.resolution,
        ticketStatus: formData.ticketStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSubmitTicket(newTicket);
      alert('Ticket created successfully!');
    }
    
    onClose();
  };

  const resetForm = () => {
    if (!editingTicket) {
      setFormData({
        employeeId: '',
        employeeName: '',
        assetId: '',
        location: '',
        project: '',
        date: new Date().toISOString().split('T')[0],
        issueDescription: '',
        resolution: '',
        ticketStatus: 'Open'
      });
    }
    setShowSuggestions(false);
    clearUpload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center">
            <Edit className="w-6 h-6 mr-3" />
            <div>
              <h2 className="text-2xl font-semibold">
                {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
              </h2>
              <p className="text-orange-100 text-sm">
                {editingTicket 
                  ? 'Modify the ticket information below' 
                  : 'Enter employee details to auto-fill and create ticket information'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-500 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Search Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleEmployeeSearch(e.target.value, 'employeeId')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter Employee ID"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleEmployeeSearch(e.target.value, 'employeeName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter Employee Name"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* File Upload Button */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <input
                  id="userFileUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="userFileUpload"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-xs font-medium"
                >
                  <UploadIcon className="w-3 h-3 mr-1" />
                  Import CSV
                </label>
                
                {uploadedFile && !uploadError && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ {uploadedUsers.length} users imported
                  </span>
                )}
                
                {uploadError && (
                  <span className="text-xs text-red-600 font-medium">
                    ✗ {uploadError}
                  </span>
                )}
              </div>
              
              {uploadedFile && (
                <button
                  type="button"
                  onClick={clearUpload}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select Employee:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchSuggestions.map((emp, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectEmployee(emp)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        emp.isImported 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300' 
                          : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {emp.isImported && (
                            <FileText className="w-3 h-3 text-blue-600 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{emp.name}</p>
                            <p className="text-sm text-gray-600">
                              ID: {emp.empId} • {emp.project}
                              {emp.isImported && <span className="text-blue-600 ml-2 text-xs">(Imported)</span>}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{emp.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-filled Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset ID
                </label>
                <input
                  type="text"
                  value={formData.assetId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <input
                  type="text"
                  value={formData.project}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-gray-500 text-xs">(editable)</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">You can change the date if this ticket is for a different day</p>
            </div>

            {/* User Input Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.resolution}
                  onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the resolution steps taken..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ticketStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketStatus: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.employeeId || !formData.issueDescription || !formData.resolution}
                className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingTicket ? 'Update Ticket' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Ticket Management View Component
interface TicketManagementViewProps {
  tickets: any[];
  onUpdateTicket: (ticketId: string, updates: any) => void;
}

const TicketManagementView: React.FC<TicketManagementViewProps> = ({ tickets, onUpdateTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.employeeId.includes(searchTerm) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.ticketStatus === statusFilter;
    
    // Date filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const ticketDate = new Date(ticket.date);
      if (startDate) {
        const start = new Date(startDate);
        matchesDateRange = matchesDateRange && ticketDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        matchesDateRange = matchesDateRange && ticketDate <= end;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportTickets = () => {
    // Create CSV headers
    const headers = [
      'Ticket ID',
      'Employee Name',
      'Employee ID',
      'Asset ID',
      'Location',
      'Project',
      'Issue Description',
      'Resolution',
      'Status',
      'Date',
      'Created At',
      'Updated At'
    ];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add filtered ticket data
    filteredTickets.forEach(ticket => {
      const row = [
        ticket.id,
        `"${ticket.employeeName || ''}"`,
        ticket.employeeId || '',
        ticket.assetId || '',
        `"${ticket.location || ''}"`,
        `"${ticket.project || ''}"`,
        `"${(ticket.issueDescription || '').replace(/"/g, '""')}"`,
        `"${(ticket.resolution || '').replace(/"/g, '""')}"`,
        ticket.ticketStatus || '',
        ticket.date || '',
        ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '',
        ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : ''
      ];
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      // Create filename with current filters and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const statusPart = statusFilter !== 'All' ? `_${statusFilter.replace(/\s+/g, '')}` : '';
      const searchPart = searchTerm ? `_search` : '';
      const datePart = startDate || endDate 
        ? `_${startDate || 'start'}-to-${endDate || 'end'}` 
        : '';
      const filename = `tickets_export${statusPart}${searchPart}${datePart}_${timestamp}.csv`;
      
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ticket Management</h2>
          <p className="text-gray-600">Track and manage all support tickets</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
              <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.ticketStatus === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.ticketStatus === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.ticketStatus === 'Resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Date Range Filters */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <X className="w-3 h-3 mr-1" />
              Clear Dates
            </button>
          )}
          
          {(startDate || endDate) && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {startDate && endDate 
                ? `${startDate} to ${endDate}` 
                : startDate 
                  ? `From ${startDate}` 
                  : `Until ${endDate}`
              }
            </span>
          )}

          {/* Export Button */}
          <button
            onClick={exportTickets}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ({filteredTickets.length})
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tickets ({filteredTickets.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project/Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.employeeName}</div>
                      <div className="text-sm text-gray-500">ID: {ticket.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.project}</div>
                      <div className="text-sm text-gray-500">{ticket.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={ticket.issueDescription}>
                      {ticket.issueDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.ticketStatus)}`}>
                      {ticket.ticketStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(ticket.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditingTicket(ticket);
                          setShowEditModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 text-sm font-medium flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'All' ? 'Try adjusting your search or filter criteria.' : 'Get started by creating a new ticket.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center">
                <Ticket className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-2xl font-semibold">Ticket Details</h2>
                  <p className="text-blue-100 text-sm">#{selectedTicket.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employee Name</label>
                      <p className="text-gray-900">{selectedTicket.employeeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employee ID</label>
                      <p className="text-gray-900">{selectedTicket.employeeId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Asset ID</label>
                      <p className="text-gray-900">{selectedTicket.assetId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{selectedTicket.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Project</label>
                      <p className="text-gray-900">{selectedTicket.project}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ticket Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{formatDate(selectedTicket.date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.ticketStatus)}`}>
                        {selectedTicket.ticketStatus}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900">{formatDate(selectedTicket.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Issue Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedTicket.issueDescription}</p>
                </div>
              </div>

              {/* Resolution */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resolution</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedTicket.resolution ? (
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedTicket.resolution}</p>
                  ) : (
                    <p className="text-gray-500 italic">No resolution provided yet</p>
                  )}
                </div>
              </div>

              {/* Quick Status Update */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Status Update</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedTicket.ticketStatus}
                    onChange={(e) => {
                      onUpdateTicket(selectedTicket.id, { ticketStatus: e.target.value });
                      setSelectedTicket({ ...selectedTicket, ticketStatus: e.target.value });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      <CreateTicketModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTicket(null);
        }}
        onSubmitTicket={() => {}} // Not used for editing
        onUpdateTicket={(ticketId: string, updates: any) => {
          onUpdateTicket(ticketId, updates);
          setShowEditModal(false);
          setEditingTicket(null);
        }}
        editingTicket={editingTicket}
      />
    </div>
  );
};

// Mock engineer data
const mockEngineer: Engineer = {
  id: 'ENG001',
  employeeId: 'CIS001',
  name: 'John Doe',
  email: 'john.doe@cognizant.com',
  phone: '+91-9876543210',
  team: {
    id: 'noc',
    name: 'Network Operations Center',
    code: 'NOC',
    description: 'Network monitoring and incident response',
    color: '#3B82F6',
    department: {} as any,
    memberIds: [],
    createdAt: '',
    maxCapacity: 0
  },
  department: {
    id: 'network-security',
    name: 'Network & Security Operations',
    code: 'NETSEC',
    description: 'Network infrastructure and security management',
    color: '#3B82F6',
    teamIds: ['noc'],
    headCount: 38,
    location: {} as any
  },
  location: {
    id: 'chennai',
    name: 'Chennai Delivery Center',
    address: 'Sholinganallur, Chennai',
    city: 'Chennai',
    country: 'India',
    timezone: 'Asia/Kolkata'
  },
  skills: ['Network Monitoring', 'Incident Response', 'Linux Administration'],
      shiftHistory: [],
      productionMetrics: {
    ticketsResolved: 0,
    incidentsHandled: 0,
    tasksCompleted: 0,
    systemUptimeHours: 0,
    projectsDelivered: 0,
    monthlyTarget: 0,
    lastUpdated: '',
    averageResolutionTime: 0,
    customerSatisfactionRating: 0
  },
  isTeamLead: false,
  isOnCall: false,
  status: 'active',
  joinDate: '2023-01-15',
  certifications: ['ITIL Foundation', 'CompTIA Network+'],
  experience: 3,
  designation: 'System Engineer'
};

const ProductionManagement: React.FC = () => {
  const { user, isManager } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'tickets' | 'admin'>('dashboard');

  // Create current engineer object from authenticated user
  const currentEngineer: Engineer = {
    id: user?.engineerId || user?.id || 'unknown',
    employeeId: user?.engineerId || 'CIS001',
    name: user?.name || 'Unknown User',
    email: user?.email || 'unknown@cognizant.com',
    phone: '+91-9876543210',
    team: {
      id: 'production',
      name: 'Production Team',
      code: 'PROD',
      description: 'Production support and maintenance',
      color: '#3B82F6',
      department: {} as any,
      memberIds: [],
      createdAt: '',
      maxCapacity: 0
    },
    department: {
      id: 'cis',
      name: 'CIS Operations',
      description: 'Customer Infrastructure Services',
      code: 'CIS',
      color: '#6366F1',
      teamIds: ['production'],
      headCount: 50,
      location: {
        id: 'bangalore',
        name: 'Bangalore',
        address: 'Electronic City, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        timezone: 'Asia/Kolkata'
      }
    },
    location: {
      id: 'bangalore',
      name: 'Bangalore',
      address: 'Electronic City, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      timezone: 'Asia/Kolkata'
    },
    shiftHistory: [],
    productionMetrics: {
      ticketsResolved: 0,
      incidentsHandled: 0,
      tasksCompleted: 0,
      systemUptimeHours: 0,
      projectsDelivered: 0,
      monthlyTarget: 50,
      lastUpdated: '2025-07-29T00:00:00Z',
      averageResolutionTime: 2.5,
      customerSatisfactionRating: 4.5
    },
    isTeamLead: isManager,
    isOnCall: false,
    status: 'active',
    joinDate: '2022-01-15',
    skills: ['Network Operations', 'Incident Response', 'System Administration'],
    certifications: ['ITIL Foundation', 'CompTIA Network+'],
    experience: 3,
    designation: 'System Engineer'
  };
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [showAppreciationUpload, setShowAppreciationUpload] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      employeeId: '2171826',
      employeeName: 'Shashankagowda S',
      assetId: 'BLR-WS-005',
      location: 'Bangalore',
      project: 'NYL',
      date: '2025-01-27',
      issueDescription: 'Network connectivity issue affecting multiple users in the department. Unable to access shared drives and printing services.',
      resolution: 'Identified faulty network switch port. Replaced the port module and restored connectivity. Verified all services are working properly.',
      ticketStatus: 'Resolved',
      createdAt: '2025-01-27T09:30:00Z',
      updatedAt: '2025-01-27T14:15:00Z'
    },
    {
      id: 'TKT-002',
      employeeId: '2175815',
      employeeName: 'Arunsankar V',
      assetId: 'HYD-WS-007',
      location: 'Hyderabad',
      project: 'HCSC',
      date: '2025-01-26',
      issueDescription: 'Application server showing high CPU usage. Performance is degraded and response times are slow.',
      resolution: 'Applied memory optimization patches and restarted services. Monitoring shows normal CPU usage now.',
      ticketStatus: 'Closed',
      createdAt: '2025-01-26T11:00:00Z',
      updatedAt: '2025-01-26T16:30:00Z'
    },
    {
      id: 'TKT-003',
      employeeId: '162420',
      employeeName: 'Madhan Raj Selvaraj',
      assetId: 'CHN-WS-002',
      location: 'Chennai',
      project: 'Metlife',
      date: '2025-01-25',
      issueDescription: 'Email server synchronization failure. Users unable to receive emails for the past 2 hours.',
      resolution: 'Currently investigating the mail server logs. Initial findings suggest database connectivity issues.',
      ticketStatus: 'In Progress',
      createdAt: '2025-01-25T13:20:00Z',
      updatedAt: '2025-01-25T15:45:00Z'
    },
    {
      id: 'TKT-004',
      employeeId: '2438360',
      employeeName: 'Dinanath Vijay Patil',
      assetId: 'KOL-WS-010',
      location: 'Kolkata',
      project: 'Compliance',
      date: '2025-01-24',
      issueDescription: 'Security audit reporting tool showing incorrect data. Compliance reports are not matching with actual system logs.',
      resolution: '',
      ticketStatus: 'Open',
      createdAt: '2025-01-24T08:15:00Z',
      updatedAt: '2025-01-24T08:15:00Z'
    }
  ]);
  const [editingEntry, setEditingEntry] = useState<DailyProductionEntry | null>(null);
  const [duration, setDuration] = useState<'this-week' | 'this-month' | 'this-quarter' | 'this-year' | 'last-week' | 'last-month' | 'last-quarter' | 'last-year' | 'custom'>('this-month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '2025-06-29',
    end: '2025-07-29'
  });
  
  // Mock data - in a real app, this would come from API calls
  const [productionEntries, setProductionEntries] = useState<DailyProductionEntry[]>([
    {
      id: '1',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      date: '2025-07-29',
      projectName: 'Network Infrastructure Upgrade',
      tasksCompleted: [
        'Configured new firewall rules for production environment',
        'Updated network documentation for VLAN changes',
        'Completed security audit for client servers'
      ],
      workDuration: 'full-day',
      ticketsResolved: 12,
      blockers: 'Waiting for client approval on new security policies',
      createdAt: '2025-07-29T09:00:00Z',
      updatedAt: '2025-07-29T09:00:00Z'
    },
    {
      id: '2',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      date: '2025-07-28',
      projectName: 'Database Migration',
      tasksCompleted: [
        'Migrated customer data to new database cluster',
        'Validated data integrity post-migration',
        'Updated application connection strings'
      ],
      workDuration: 'full-day',
      ticketsResolved: 8,
      createdAt: '2025-07-28T08:30:00Z',
      updatedAt: '2025-07-28T08:30:00Z'
    },
    {
      id: '3',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      date: '2025-07-26',
      projectName: 'Cloud Infrastructure Optimization',
      tasksCompleted: [
        'Optimized AWS EC2 instances for cost efficiency',
        'Implemented auto-scaling policies',
        'Updated monitoring dashboards'
      ],
      workDuration: 'full-day',
      ticketsResolved: 15,
      blockers: '',
      createdAt: '2025-07-26T08:00:00Z',
      updatedAt: '2025-07-26T08:00:00Z'
    },
    {
      id: '4',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      date: '2025-07-25',
      projectName: 'Security Patch Deployment',
      tasksCompleted: [
        'Applied critical security patches to production servers',
        'Validated system functionality post-patching'
      ],
      workDuration: 'half-day',
      ticketsResolved: 6,
      blockers: '',
      createdAt: '2025-07-25T13:00:00Z',
      updatedAt: '2025-07-25T13:00:00Z'
    }
  ]);

  const [appreciations, setAppreciations] = useState<AppreciationUploadType[]>([
    {
      id: '1',
      engineerId: '2171826',
      engineerName: 'Shashankagowda S',
      projectName: 'Network Infrastructure Upgrade',
      fileName: 'client_appreciation_letter.pdf',
      fileUrl: '/mock-file-url',
      fileType: 'pdf',
      fileSize: 2048576,
      description: 'Client appreciation for excellent network upgrade work with zero downtime.',
      uploadedAt: '2025-07-29T10:00:00Z',
      tags: ['client-feedback', 'network', 'zero-downtime'],
      isPublic: true,
      appreciationType: 'client_feedback'
    },
    {
      id: '2',
      engineerId: '2268205',
      engineerName: 'Pradip Shinde',
      projectName: 'Cloud Infrastructure Optimization',
      fileName: 'team_appreciation_certificate.pdf',
      fileUrl: '/mock-file-url-2',
      fileType: 'pdf',
      fileSize: 1536768,
      description: 'Team appreciation for excellent cloud optimization work that resulted in 40% cost savings.',
      uploadedAt: '2025-07-26T14:30:00Z',
      tags: ['team-recognition', 'cloud', 'cost-optimization'],
      isPublic: true,
      appreciationType: 'team_recognition'
    }
  ]);

  // Filter data based on user role - engineers see only their own data
  const getFilteredEntries = () => {
    if (isManager) {
      return productionEntries; // Managers see all entries
    }
    // Engineers see only their own entries
    return productionEntries.filter(entry => 
      entry.engineerId === (user?.engineerId || user?.id)
    );
  };

  const getFilteredAppreciations = () => {
    if (isManager) {
      return appreciations; // Managers see all appreciations
    }
    // Engineers see only their own appreciations  
    return appreciations.filter(appreciation =>
      appreciation.engineerId === (user?.engineerId || user?.id)
    );
  };

  const filteredEntries = getFilteredEntries();
  const filteredAppreciations = getFilteredAppreciations();

  const handleSubmitProduction = (entry: Omit<DailyProductionEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DailyProductionEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date('2025-07-29').toISOString(),
      updatedAt: new Date('2025-07-29').toISOString()
    };

    if (editingEntry) {
      setProductionEntries(prev => 
        prev.map(e => e.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : e)
      );
      setEditingEntry(null);
    } else {
      setProductionEntries(prev => [newEntry, ...prev]);
    }
  };

  const handleSubmitAppreciation = (appreciation: Omit<AppreciationUploadType, 'id' | 'uploadedAt'>) => {
    const newAppreciation: AppreciationUploadType = {
      ...appreciation,
      id: Date.now().toString(),
      uploadedAt: new Date('2025-07-29').toISOString()
    };
    setAppreciations(prev => [newAppreciation, ...prev]);
  };

  const handleEditEntry = (entry: DailyProductionEntry) => {
    setEditingEntry(entry);
    setShowProductionForm(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setProductionEntries(prev => prev.filter(e => e.id !== entryId));
    }
  };

  const handleViewAppreciation = (appreciation: AppreciationUploadType) => {
    // In a real app, this would open the file in a new window or modal
    window.open(appreciation.fileUrl, '_blank');
  };

    const handleExportReport = () => {
    // Generate Excel-compatible CSV format
    const generateCSV = () => {
      const dateRange = duration === 'custom' 
        ? `${customDateRange.start} to ${customDateRange.end}`
        : getDurationDisplayName(duration);

      // Calculate summary statistics
      const totalEntries = filteredViewData.entries.length;
      const totalTickets = filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
      const totalHours = filteredViewData.entries.reduce((sum, entry) => sum + (entry.workDuration === 'full-day' ? 10 : 5), 0);
      const totalAppreciations = filteredViewData.appreciations.length;

      let csvContent = '';
      
      // Report Header
      csvContent += `Production Management Report\n`;
      csvContent += `Period:,${dateRange}\n`;
      csvContent += `Generated:,${new Date('2025-07-29').toLocaleDateString()}\n`;
      csvContent += `\n`;

      // Summary Section
      csvContent += `SUMMARY\n`;
      csvContent += `Total Entries:,${totalEntries}\n`;
      csvContent += `Total Hours:,${totalHours}\n`;
      csvContent += `Total Tickets Resolved:,${totalTickets}\n`;
      csvContent += `Total Appreciations:,${totalAppreciations}\n`;
      csvContent += `Average Tickets/Day:,${totalEntries > 0 ? (totalTickets / totalEntries).toFixed(2) : 0}\n`;
      csvContent += `\n`;

      // Production Entries Section
      csvContent += `PRODUCTION ENTRIES\n`;
      csvContent += `Date,Engineer Name,Project Name,Work Duration,Hours,Tasks Completed,Tickets Resolved,Blockers,Created At\n`;
      
      filteredViewData.entries.forEach(entry => {
        const tasks = entry.tasksCompleted.join('; ');
        const hours = entry.workDuration === 'full-day' ? 10 : 5;
        const blockers = (entry.blockers || '').replace(/,/g, ';'); // Replace commas to avoid CSV issues
        
        csvContent += `${entry.date},"${entry.engineerName}","${entry.projectName}",${entry.workDuration},${hours},"${tasks}",${entry.ticketsResolved},"${blockers}",${new Date(entry.createdAt).toLocaleDateString()}\n`;
      });

      if (filteredViewData.appreciations.length > 0) {
        csvContent += `\n`;
        csvContent += `APPRECIATIONS\n`;
        csvContent += `Date,Engineer Name,Project Name,Type,Description,File Name,Tags,Public\n`;
        
        filteredViewData.appreciations.forEach(appreciation => {
          const description = (appreciation.description || '').replace(/,/g, ';').replace(/"/g, '""');
          const tags = (appreciation.tags || []).join('; ');
          
          csvContent += `${appreciation.uploadedAt.split('T')[0]},"${appreciation.engineerName}","${appreciation.projectName}",${appreciation.appreciationType},"${description}","${appreciation.fileName}","${tags}",${appreciation.isPublic ? 'Yes' : 'No'}\n`;
        });
      }

      return csvContent;
    };

    // Create and download Excel file
    const csvContent = generateCSV();
    const BOM = '\uFEFF'; // Byte Order Mark for proper Excel UTF-8 encoding
    const dataBlob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `production-report-${duration}-${new Date('2025-07-29').toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    const totalEntries = filteredViewData.entries.length;
    const totalTickets = filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0);
    const totalHours = filteredViewData.entries.reduce((sum, entry) => sum + (entry.workDuration === 'full-day' ? 10 : 5), 0);
    
    alert(`Exported Excel report for ${getDurationDisplayName(duration)} with ${totalEntries} entries covering ${totalTickets} tickets and ${totalHours} hours.`);
  };

  // Get filtered data based on duration
  const getFilteredViewData = () => {
    if (duration === 'custom') {
      return {
        entries: productionEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return entryDate >= startDate && entryDate <= endDate;
        }),
        appreciations: appreciations.filter(app => {
          const appDate = new Date(app.uploadedAt);
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return appDate >= startDate && appDate <= endDate;
        })
      };
    }

    // Calculate date range for predefined durations
    const endDate = new Date('2025-07-29');
    const startDate = new Date('2025-07-29');
    
    switch (duration) {
      case 'this-week': {
        // Start of this week (Sunday)
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek);
        break;
      }
      case 'this-month':
        startDate.setDate(1); // Start of this month
        break;
      case 'last-week': {
        // Last week: from Sunday to Saturday of previous week
        const dayOfWeek = endDate.getDay();
        startDate.setDate(endDate.getDate() - dayOfWeek - 7);
        const lastWeekEnd = new Date(endDate);
        lastWeekEnd.setDate(endDate.getDate() - dayOfWeek - 1);
        break;
      }
             case 'last-month': {
         // Last month: from 1st to last day of previous month
         const lastMonth = new Date(endDate);
         lastMonth.setMonth(endDate.getMonth() - 1);
         startDate.setMonth(lastMonth.getMonth(), 1);
         break;
       }
       case 'this-quarter': {
         // Start of current quarter
         const currentQuarter = Math.floor(endDate.getMonth() / 3);
         startDate.setMonth(currentQuarter * 3, 1);
         break;
       }
       case 'this-year':
         startDate.setFullYear(endDate.getFullYear(), 0, 1); // January 1st of current year
         break;
       case 'last-quarter':
         startDate.setMonth(endDate.getMonth() - 3);
         break;
       case 'last-year':
         startDate.setFullYear(endDate.getFullYear() - 1);
         break;
    }
    
    return {
      entries: productionEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      }),
      appreciations: appreciations.filter(app => {
        const appDate = new Date(app.uploadedAt);
        return appDate >= startDate && appDate <= endDate;
      })
    };
  };

  const filteredViewData = getFilteredViewData();

  // Get display name for duration
  const getDurationDisplayName = (dur: typeof duration) => {
    const displayNames = {
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-quarter': 'This Quarter',
      'this-year': 'This Year',
      'last-week': 'Last Week',
      'last-month': 'Last Month',
      'last-quarter': 'Last Quarter',
      'last-year': 'Last Year',
      'custom': 'Custom Range'
    };
    return displayNames[dur] || dur;
  };



  const renderActionButtons = () => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setShowProductionForm(true)}
        className="group relative bg-blue-500/10 backdrop-blur-md border border-blue-200/50 text-blue-700 px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500/20 hover:border-blue-300/50"
      >
        <div className="flex items-center space-x-2">
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span className="relative z-10">New Entry</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      
      <button
        onClick={() => setShowAppreciationUpload(true)}
        className="group relative bg-green-500/10 backdrop-blur-md border border-green-200/50 text-green-700 px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-500/20 hover:border-green-300/50"
      >
        <div className="flex items-center space-x-2">
          <UploadIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="relative z-10">Upload Appreciation</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      
      <button
        onClick={() => setShowCreateTicket(true)}
        className="group relative bg-orange-500/10 backdrop-blur-md border border-orange-200/50 text-orange-700 px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-orange-500/20 hover:border-orange-300/50"
      >
        <div className="flex items-center space-x-2">
          <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="relative z-10">Create Ticket</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {isManager && (
        <button
          onClick={() => setActiveView('admin')}
          className={`group relative backdrop-blur-md px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
            activeView === 'admin'
              ? 'bg-purple-500/20 border border-purple-300/50 text-purple-700'
              : 'bg-purple-500/10 border border-purple-200/50 text-purple-700 hover:bg-purple-500/20 hover:border-purple-300/50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">Admin Panel</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Production Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track daily production updates, manage appreciations, and monitor performance
          </p>
        </div>
        {renderActionButtons()}
      </div>

      {/* Modern Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6 pb-0">
          <div className="bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200 dark:border-gray-600">
            <nav className="flex space-x-1" aria-label="Tabs">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
                { id: 'tickets', name: 'Tickets', icon: Ticket, description: 'Ticket Management' },
                { id: 'profile', name: 'My Profile', icon: User, description: 'Personal History' },
                ...(isManager ? [{ id: 'admin', name: 'Admin Panel', icon: Settings, description: 'Manage & Reports' }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as typeof activeView)}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    activeView === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-100 dark:border-blue-500/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/70 dark:hover:bg-gray-600/70'
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left relative z-10">
                    <div className="font-semibold">{tab.name}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                  {activeView === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
                  {activeView === 'dashboard' && (
            <ProductionDashboard
              entries={filteredEntries}
              appreciations={filteredAppreciations}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onViewAppreciation={handleViewAppreciation}
              isAdmin={isManager}
              currentUserId={user?.engineerId || user?.id || 'unknown'}
            />
          )}

                  {activeView === 'profile' && (
            <EngineerProfileView
              engineer={currentEngineer}
              entries={filteredEntries}
              appreciations={filteredAppreciations}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onViewAppreciation={handleViewAppreciation}
            />
          )}

        {activeView === 'tickets' && (
          <TicketManagementView tickets={tickets} onUpdateTicket={(ticketId, updates) => {
            setTickets(prev => prev.map(ticket => 
              ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
            ));
          }} />
        )}

        {activeView === 'admin' && isManager && (
          <div className="space-y-6">
            {/* Admin Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Controls</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    View & Export Duration
                  </label>
            <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as typeof duration)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                      <option value="this-quarter">This Quarter</option>
                      <option value="this-year">This Year</option>
                      <option value="last-week">Last Week</option>
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="last-year">Last Year</option>
                      <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
                {duration === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
          </div>
                  </>
                )}

                <div className="flex items-end">
                  <button 
                    onClick={handleExportReport}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
              <Download className="w-4 h-4 mr-2" />
                    Export Report
            </button>
          </div>
        </div>
      </div>

            {/* System Overview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Overview 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({duration === 'custom' 
                    ? `${customDateRange.start} to ${customDateRange.end}`
                    : getDurationDisplayName(duration)})
                    </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                  </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Engineers</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">150</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredViewData.entries.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Appreciations</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredViewData.appreciations.length}</p>
            </div>
          </div>
        </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</h3>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {filteredViewData.entries.reduce((sum, entry) => sum + (entry.ticketsResolved || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>

                         {/* Admin Actions */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Actions</h3>
               
               {/* Additional Admin Actions */}
               <div className="mb-6">
                 <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Additional Actions</h4>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <button className="flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                    <div className="text-sm text-gray-500">User permissions & access</div>
                  </div>
                </button>

                <button className="flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <BarChart3 className="w-5 h-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Analytics</div>
                    <div className="text-sm text-gray-500">Detailed performance metrics</div>
                  </div>
                </button>
          </div>
        </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {filteredViewData.entries.length > 0 ? (
                  filteredViewData.entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.engineerName} submitted entry for {entry.projectName}
                          </p>
                          <p className="text-sm text-gray-500">
                             {new Date(entry.createdAt).toLocaleDateString()} • {entry.workDuration === 'full-day' ? '10h' : '5h'} worked
                           </p>
                      </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No entries found for the selected time period.
                    </p>
              </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Modals */}
      <DailyProductionForm
        isOpen={showProductionForm}
        onClose={() => {
          setShowProductionForm(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmitProduction}
        existingEntry={editingEntry || undefined}
        engineerName={user?.name || 'Unknown'}
        engineerId={user?.engineerId || user?.id || 'unknown'}
      />

      <AppreciationUpload
        isOpen={showAppreciationUpload}
        onClose={() => setShowAppreciationUpload(false)}
        onSubmit={handleSubmitAppreciation}
        engineerName={user?.name || 'Unknown'}
        engineerId={user?.engineerId || user?.id || 'unknown'}
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onSubmitTicket={(ticket: any) => setTickets(prev => [ticket, ...prev])}
      />

    </div>
  );
};

export default ProductionManagement; 
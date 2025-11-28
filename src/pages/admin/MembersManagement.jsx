import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  NoSymbolIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const MembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [membershipFilter, setMembershipFilter] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [currentPage, searchTerm, membershipFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMembers({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        membershipTier: membershipFilter
      });
      setMembers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddMember = async (memberData) => {
    try {
      await adminService.createMember(memberData);
      toast.success('Member created successfully and credentials sent via email');
      setShowAddModal(false);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to create member');
    }
  };

  const handleUpdateMember = async (memberData) => {
    try {
      await adminService.updateMember(selectedMember._id, memberData);
      toast.success('Member updated successfully');
      setShowEditModal(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update member');
    }
  };

  const handleDeactivateMember = async (memberId) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      try {
        await adminService.deactivateMember(memberId);
        toast.success('Member deactivated successfully');
        fetchMembers();
      } catch (error) {
        toast.error('Failed to deactivate member');
      }
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await adminService.deleteMember(memberId);
        toast.success('Member deleted successfully');
        fetchMembers();
      } catch (error) {
        toast.error('Failed to delete member');
      }
    }
  };

  const handleImportMembers = async (file) => {
    try {
      const response = await adminService.importMembers(file);
      toast.success(`Imported ${response.data.success} members successfully`);
      if (response.data.failed > 0) {
        toast.error(`Failed to import ${response.data.failed} members`);
      }
      fetchMembers();
    } catch (error) {
      toast.error('Failed to import members');
    }
  };

  const handleExportMembers = async () => {
    try {
      const response = await adminService.exportMembers();
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'members.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Members exported successfully');
    } catch (error) {
      toast.error('Failed to export members');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await adminService.getMemberTemplate();
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'member-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-700';
      case 'Premium':
        return 'bg-purple-100 text-purple-700';
      case 'Elite':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600 mt-2">Manage all members and their privileges</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Template
          </button>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleImportMembers(e.target.files[0])}
            className="hidden"
            id="import-members"
          />
          <label
            htmlFor="import-members"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
            Import
          </label>
          <button
            onClick={handleExportMembers}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Membership Tiers</option>
            <option value="Gold">Gold</option>
            <option value="Premium">Premium</option>
            <option value="Elite">Elite</option>
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                            <StarIcon className="w-5 h-5 text-secondary-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(member.membershipTier)}`}>
                            {member.membershipTier || 'Gold'}
                          </span>
                          <div className="text-xs text-gray-500">
                            Since {formatDate(member.membershipDate || member.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.loyaltyPoints || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowViewModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivateMember(member._id)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <NoSymbolIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {}
            <div className="md:hidden">
              {members.map((member) => (
                <div key={member._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-secondary-700" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(member.membershipTier)}`}>
                        {member.membershipTier || 'Gold'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Phone: {member.phone}</p>
                    <p>Points: {member.loyaltyPoints || 0}</p>
                    <p>Member since: {formatDate(member.membershipDate || member.createdAt)}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowViewModal(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowEditModal(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeactivateMember(member._id)}
                      className="flex items-center px-3 py-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <NoSymbolIcon className="w-4 h-4 mr-1" />
                      Deactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMember}
        />
      )}

      {}
      {showEditModal && selectedMember && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          onSubmit={handleUpdateMember}
        />
      )}

      {}
      {showViewModal && selectedMember && (
        <ViewMemberModal
          member={selectedMember}
          onClose={() => {
            setShowViewModal(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

// Add Member Modal Component
const AddMemberModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipTier: 'Gold',
    sponsoredBy: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership Tier
            </label>
            <select
              value={formData.membershipTier}
              onChange={(e) => setFormData({ ...formData, membershipTier: e.target.value })}
              className="input-field"
            >
              <option value="Gold">Gold</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sponsored By (Email)
            </label>
            <input
              type="email"
              value={formData.sponsoredBy}
              onChange={(e) => setFormData({ ...formData, sponsoredBy: e.target.value })}
              className="input-field"
              placeholder="Optional"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading && <LoadingSpinner size="small" className="mr-2" />}
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Member Modal Component
const EditMemberModal = ({ member, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: member.firstName || '',
    lastName: member.lastName || '',
    email: member.email || '',
    phone: member.phone || '',
    membershipTier: member.membershipTier || 'Gold',
    loyaltyPoints: member.loyaltyPoints || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership Tier
            </label>
            <select
              value={formData.membershipTier}
              onChange={(e) => setFormData({ ...formData, membershipTier: e.target.value })}
              className="input-field"
            >
              <option value="Gold">Gold</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loyalty Points
            </label>
            <input
              type="number"
              min="0"
              value={formData.loyaltyPoints}
              onChange={(e) => setFormData({ ...formData, loyaltyPoints: parseInt(e.target.value) || 0 })}
              className="input-field"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading && <LoadingSpinner size="small" className="mr-2" />}
              Update Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Member Modal Component
const ViewMemberModal = ({ member, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-700';
      case 'Premium':
        return 'bg-purple-100 text-purple-700';
      case 'Elite':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Details</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
              <StarIcon className="w-8 h-8 text-secondary-700" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {member.firstName} {member.lastName}
              </h4>
              <p className="text-sm text-gray-500">{member.email}</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getTierColor(member.membershipTier)}`}>
                {member.membershipTier || 'Gold'} Member
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900">{member.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className={member.isActive ? 'text-green-600' : 'text-red-600'}>
                {member.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Loyalty Points:</span>
              <p className="text-gray-900 font-semibold">{member.loyaltyPoints || 0}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Member Since:</span>
              <p className="text-gray-900">{formatDate(member.membershipDate || member.createdAt)}</p>
            </div>
            {member.sponsoredBy && (
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Sponsored By:</span>
                <p className="text-gray-900">
                  {member.sponsoredBy.firstName} {member.sponsoredBy.lastName}
                </p>
                <p className="text-sm text-gray-500">{member.sponsoredBy.email}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersManagement;

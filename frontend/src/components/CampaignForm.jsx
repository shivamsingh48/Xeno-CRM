import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

const FIELD_OPTIONS = [
  { value: 'spend', label: 'Total Spend' },
  { value: 'visits', label: 'Number of Visits' },
  { value: 'lastActive', label: 'Days Since Last Active' },
  { value: 'orderCount', label: 'Number of Orders' }
];

const OPERATOR_OPTIONS = [
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater Than or Equal' },
  { value: '<=', label: 'Less Than or Equal' },
  { value: '==', label: 'Equal To' },
  { value: '!=', label: 'Not Equal To' }
];

const CampaignForm = () => {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [audienceSize, setAudienceSize] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    segment: {
      name: '',
      rules: [{ field: 'spend', operator: '>', value: '' }],
      ruleLogic: 'AND'
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSegmentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        [name]: value
      }
    }));
  };

  const handleRuleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        rules: prev.segment.rules.map((rule, i) => 
          i === index ? { ...rule, [field]: value } : rule
        )
      }
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        rules: [...prev.segment.rules, { field: 'spend', operator: '>', value: '' }]
      }
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        rules: prev.segment.rules.filter((_, i) => i !== index)
      }
    }));
  };

  const previewAudience = async () => {
    setPreviewLoading(true);
    try {
      const response = await api.post('/campaigns/preview-audience', {
        segment: formData.segment
      });
      setAudienceSize(response.data.audienceSize);
      toast.success(`Audience size: ${response.data.audienceSize} customers`);
    } catch (error) {
      toast.error('Error previewing audience');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/campaigns', formData);
      toast.success('Campaign created successfully!');
      navigate('/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campaign Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Hi {name}, here's 10% off on your next order!"
                required
              />
            </div>
          </div>
        </div>

        {/* Audience Segment */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Audience Segment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Segment Name</label>
              <input
                type="text"
                name="name"
                value={formData.segment.name}
                onChange={handleSegmentChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Logic</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ruleLogic"
                    value="AND"
                    checked={formData.segment.ruleLogic === 'AND'}
                    onChange={handleSegmentChange}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">AND (All rules must match)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ruleLogic"
                    value="OR"
                    checked={formData.segment.ruleLogic === 'OR'}
                    onChange={handleSegmentChange}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">OR (Any rule can match)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {formData.segment.rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <select
                    value={rule.field}
                    onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {FIELD_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {OPERATOR_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={rule.value}
                    onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Value"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addRule}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" />
                Add Rule
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={previewAudience}
                disabled={previewLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaEye className="mr-2" />
                {previewLoading ? 'Previewing...' : 'Preview Audience'}
              </button>

              {audienceSize !== null && (
                <span className="text-sm text-gray-600">
                  Estimated audience size: {audienceSize} customers
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm; 
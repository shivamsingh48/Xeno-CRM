import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CampaignForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    segment: {
      operator: 'AND',
      rules: []
    },
    messageTemplate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns`,
        {
          ...formData,
          userId: localStorage.getItem('userId')
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      navigate('/campaigns');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        rules: [...prev.segment.rules, { condition: '', comparator: '', value: '' }]
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

  const updateRule = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        rules: prev.segment.rules.map((rule, i) => {
          if (i === index) {
            return { ...rule, [field]: value };
          }
          return rule;
        })
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Campaign Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Audience Rules
        </label>
        <div className="space-y-4">
          {formData.segment.rules.map((rule, index) => (
            <div key={index} className="flex items-center gap-4">
              <select
                value={rule.condition}
                onChange={(e) => updateRule(index, 'condition', e.target.value)}
                className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select condition</option>
                <option value="spend">Total Spend</option>
                <option value="visits">Number of Visits</option>
                <option value="inactive_days">Days Inactive</option>
              </select>

              <select
                value={rule.comparator}
                onChange={(e) => updateRule(index, 'comparator', e.target.value)}
                className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select</option>
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
                <option value="=">Equals</option>
                <option value="!=">Not equals</option>
              </select>

              <input
                type="number"
                value={rule.value}
                onChange={(e) => updateRule(index, 'value', e.target.value)}
                placeholder="Value"
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />

              {formData.segment.rules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRule}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Rule
        </button>
      </div>

      <div>
        <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700">
          Campaign Message
        </label>
        <textarea
          id="messageTemplate"
          value={formData.messageTemplate}
          onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your campaign message..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
} 
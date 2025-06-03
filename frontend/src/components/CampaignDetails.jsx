import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaChartBar, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      if (response.data.success) {
        setCampaign(response.data.campaign);
      } else {
        toast.error(response.data.message || 'Error fetching campaign details');
        navigate('/campaigns');
      }
    } catch (error) {
      toast.error('Error fetching campaign details');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/campaigns')}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <FaArrowLeft className="mr-2" />
          Back to Campaigns
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{campaign.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status || 'draft'}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Segment Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.segment?.name || 'No segment name'}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Message Template</dt>
              <dd className="mt-1 text-sm text-gray-900">{campaign.messageTemplate}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Campaign Statistics</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaEnvelope className="text-indigo-500 mr-2" />
                      <span className="font-medium">Sent</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{campaign.stats?.sent || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-500 mr-2" />
                      <span className="font-medium">Failed</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{campaign.stats?.failed || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaChartBar className="text-green-500 mr-2" />
                      <span className="font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{campaign.stats?.total || 0}</p>
                  </div>
                </div>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Segment Rules</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="font-medium">Rule Logic: </span>
                    {campaign.segment?.ruleLogic || 'AND'}
                  </div>
                  <div className="space-y-2">
                    {campaign.segment?.rules?.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="font-medium">{rule.field}</span>
                        <span>{rule.operator}</span>
                        <span>{rule.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails; 
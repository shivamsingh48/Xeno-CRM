import React, { useEffect, useState } from "react";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    segment: "",
    messageTemplate: "",
  });

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (response.ok) {
        fetchCampaigns(); // Refresh campaigns after creating a new one
        setNewCampaign({ name: "", segment: "", messageTemplate: "" }); // Reset form
        alert("Campaign created successfully!");
      } else {
        alert("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

      {/* Campaign Creation Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create New Campaign</h3>
        <form onSubmit={handleCreateCampaign} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Campaign Name"
            value={newCampaign.name}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, name: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
          <textarea
            placeholder='Segment (e.g., {\"age\":20,\"location\":\"USA\"})'
            value={newCampaign.segment}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, segment: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Message Template"
            value={newCampaign.messageTemplate}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                messageTemplate: e.target.value,
              })
            }
            required
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </form>
      </div>

      {/* Campaign List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Campaigns</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Segment</th>
              <th className="border p-2">Message Template</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td className="border p-2">{campaign.name}</td>
                <td className="border p-2">
                  {JSON.stringify(campaign.segment)}
                </td>
                <td className="border p-2">{campaign.messageTemplate}</td>
                <td className="border p-2">{campaign.status}</td>
                <td className="border p-2">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsPage;

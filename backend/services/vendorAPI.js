import axios from "axios";

export const sendMessageToVendor = async (campaignId, customer) => {
  const successRate = Math.random() < 0.9; // ~90% success
  const status = successRate ? "SENT" : "FAILED";

  const message = `Hi ${customer.name}, here’s 10% off on your next order!`;

  console.log(`Sending message to ${customer.name}: "${message}"`);

  try {
    // Simulate sending message
    console.log(`Message to ${customer.name}: ${status}`);

    // Call the Delivery Receipt API to log the delivery status
    await axios.post("http://localhost:8000/api/delivery-receipt", {
      campaignId,
      customerId: customer._id.toString(),
      status,
    });

    console.log(`Delivery receipt sent for customer ${customer.name}.`);
  } catch (error) {
    console.error(`Error sending delivery receipt for ${customer.name}:`, error.message);
  }
};


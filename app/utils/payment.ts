/**
 * Payment processing utilities
 * Used to handle payment requests to the Ozow API
 */

/**
 * Process a payment request through our backend API
 * @returns Promise with payment response data
 */
export const processPayment = async (data: object) => {
  console.log("Processing payment:", data);
  try {
    const response = await fetch('/api/payment-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process payment');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

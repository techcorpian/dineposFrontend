import React from 'react';
import axios from 'axios';

// Define types for Props
interface Props {
  amount: string; // The amount passed as a string (could be number if needed)
  handleProceed: (orderId: string, paymentId: string) => void; // Callback function to handle payment success
}

// Define types for Razorpay options and response
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const Payment: React.FC<Props> = ({ amount, handleProceed }) => {
  const handlePayment = async () => {
    try {
      // Create an order on the backend
      const { data: order } = await axios.post('http://localhost:5001/api/orders/createOrderByUPI', {
        amount: parseInt(amount, 10), // Convert amount to number
        currency: 'INR',
      });

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Dine POS',
        description: 'Test Transaction',
        order_id: order.id, // Order ID from Razorpay
        handler: function (response: RazorpayResponse) {
          // Payment is successful
          if (response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
            alert('Payment Successful');
            console.log('Payment Details:', response);
            handleProceed(response.razorpay_order_id, response.razorpay_payment_id); // Call handleProceed() only if payment succeeds
          } else {
            console.error('Invalid payment response:', response);
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'your-email@example.com',
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} className="text-center py-2 border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white cursor-pointer w-full">
        Pay With Razorpay
      </button>
    </div>
  );
};

export default Payment;

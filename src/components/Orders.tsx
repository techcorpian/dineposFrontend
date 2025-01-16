import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../UIElements/Modal';

interface Item {
  _id: string;
  orderId: string;
  createdAt: string;
  payableAmount: number;
  paymentMode: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Item[]>([]);
  const [openView, setOpenView] = useState<boolean>(false);
  // const [viewId, setViewId] = useState<string | null>(null);
  const [orderViewData, setOrderViewData] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Item[]>('http://localhost:5001/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrdersById = async (id: string) => {
    try {
      const response = await axios.get<Item>(`http://localhost:5001/api/orders/getOrderById/${id}`);
      // console.log(response.data.order);
      setOrderViewData(response.data.order);

    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderViewOpen = (id: string) => {
    setOpenView(true);
    fetchOrdersById(id);
  };

  const handleOrderViewClose = () => {
    setOpenView(false);
    setOrderViewData(null);
  };

  // console.log(orderViewData);


  return (
    <div className="px-4">
      {openView && (
        <Modal onClose={handleOrderViewClose}>
          <div>
            <div className='text-xl pb-3 font-bold'>Order Details</div>
            {orderViewData ? (
              <div>
                <div className='flex justify-between text-sm pb-4'>
                  <p><strong>Order #</strong>{orderViewData.orderId} / Dine In</p>
                  <p><strong></strong> {orderViewData.createdAt.split("T")[0]}</p>
                </div>
                <div className='bg-gray-100 px-4 py-3 rounded-lg mb-4'>
                  {
                    orderViewData.orderList.map((data) => (
                      <div className='flex justify-between pb-3'>
                        <div>
                          <div>{data.itemName}</div>
                          <div className='text-sm text-gray-400'>${data.itemPrice}</div>
                        </div>
                        <div className='text-sm'>x{data.itemQty}</div>
                      </div>
                    ))
                  }
                </div>
                <p className='flex justify-between text-gray-700'><strong>Sub Total:</strong> ${orderViewData.subTotal}</p>
                <p className='flex justify-between text-gray-700'><strong>Tax:</strong> ${orderViewData.tax}</p>
                <p className='flex justify-between pb-4 text-gray-700'><strong>Grand Total:</strong> ${orderViewData.payableAmount}</p>
                <p className='flex justify-between text-gray-700'><strong>Mode Of Payment</strong> {orderViewData.paymentMode}</p>
                {orderViewData.razorpay_order_id ? <p className='flex justify-between text-gray-700'><strong>UPI Order Id</strong> {orderViewData.razorpay_order_id}</p> : ''}
                {orderViewData.razorpay_payment_id ? <p className='flex justify-between text-gray-700'><strong>UPI Payment Id</strong> {orderViewData.razorpay_payment_id}</p> : ''}
              </div>
            ) : (
              <p>Loading order details...</p>
            )}
          </div>
        </Modal>
      )}
      <div className="py-3 text-xl font-bold text-gray-500">Order List ({orders.length})</div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="bg-gray-600 p-3 text-center font-bold text-white">Order #</th>
            <th className="bg-gray-600 p-3 text-center font-bold text-white">Date Created</th>
            <th className="bg-gray-600 p-3 text-center font-bold text-white">Payable Amount</th>
            <th className="bg-gray-600 p-3 text-center font-bold text-white">Payment Mode</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order._id}
              onClick={() => handleOrderViewOpen(order._id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td
                className={`${index % 2 === 0 ? "bg-gray-200" : ""} p-3 text-sm text-center text-blue-500 font-light`}
              >
                #{order.orderId}
              </td>
              <td
                className={`${index % 2 === 0 ? "bg-gray-200" : ""} p-3 text-sm text-center text-gray-600 font-light`}
              >
                {order.createdAt ? order.createdAt.split("T")[0] : '01-01-2024'}
              </td>
              <td
                className={`${index % 2 === 0 ? "bg-gray-200" : ""} p-3 text-sm text-center font-light`}
              >
                ${order.payableAmount}
              </td>
              <td
                className={`${index % 2 === 0 ? "bg-gray-200" : ""} text-center text-sm p-3 font-light`}
              >
                {order.paymentMode}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;

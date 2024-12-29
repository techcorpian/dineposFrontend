import React, { useState, useEffect } from 'react';
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit2 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { editItem, deleteItem, clearItems } from '../redux/slices/itemsSlice';

import axios from 'axios'
import Modal from '../UIElements/Modal'

interface Item {
    name: string;
    price: number;
    quantity: number;
}

const RightPanel: React.FC = () => {
    const items = useSelector((state: RootState) => state.items.items);
    const dispatch = useDispatch<AppDispatch>();

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newQuantities, setNewQuantities] = useState<{ [key: number]: number | null }>({});
    const [orderId, setOrderId] = useState<string | null>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleEditItem = (index: number, newQuantity: number) => {
        dispatch(editItem({ index, newQuantity }));
        setNewQuantities({ ...newQuantities, [index]: null });
        setEditingIndex(null); // Reset editing state after saving
    };

    const handleDeleteItem = (index: number) => {
        dispatch(deleteItem(index));
        console.log(index)
    };

    useEffect(() => {
        setEditingIndex(null); // Reset editing state when items change
    }, [items]);

    const handleEditClick = (index: number) => {
        setEditingIndex(index);
        setNewQuantities({ ...newQuantities, [index]: items[index].quantity }); // Preserve previous quantity for editing
    };

    const totalAmount = items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const totalTax = totalAmount * 0.05;

    const fetchOrderId = async () => {
        const response = await axios.get<number | null>('http://localhost:5001/api/orders/newOrderId');
        let newOrderId = response.data.orderId + 1
        setOrderId(newOrderId);
    };

    useEffect(() => {
        fetchOrderId();
    }, []);

    // console.log(items)

    const handleSummaryOpen = () => {
        setModalOpen(true);
    }

    const handleSummaryClose = () => {
        setModalOpen(false);
    }

    const handleProceed = async () => {
        try {
            // Format the orderData according to your schema
            const orderData = {
                orderId,  // Ensure that orderId is correctly calculated and passed
                orderList: items.map(item => ({
                    itemName: item.name,
                    itemQty: item.quantity,
                    itemDesc: item.description,  // Ensure description is available in item
                    itemPrice: item.price,
                })),
                subTotal: totalAmount - totalTax,
                tax: totalTax,
                payableAmount: totalAmount,
                paymentMode: selectedPayment,  // You can change this based on actual payment method
            };

            // console.log(orderData);

            // Send the POST request to create the order
            const response = await axios.post('http://localhost:5001/api/orders', orderData);

            // Success response handling
            console.log('Order created successfully:', response.data);
            dispatch(clearItems());
            fetchOrderId();
            setModalOpen(false)
            alert('Order created successfully!');
        } catch (error) {
            // Error handling
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        }
    };

    // State to store the selected value
    const [selectedPayment, setSelectedPayment] = useState("cash");

    // Handle change event
    const handleChange = (event) => {
        setSelectedPayment(event.target.value); // Update the state with the selected value
    };

    return (
        <div className='p-3 w-full'>
            {modalOpen ?
                <Modal onClose={handleSummaryClose}>
                    <>
                        <div className="text-xl font-bold text-gray-800 pb-6">Payment Summary</div>
                        {items.length === 0 ? (
                            <div className="text-center text-gray-600 border py-2">Please Add Any Items!</div>
                        ) : (
                            <div className="flex flex-row justify-between gap-4">
                                <ul className="bg-gray-100 p-4 w-full rounded-lg">
                                    <div className="font-semibold pb-4">Transaction Details</div>
                                    {items.map((item, index) => (
                                        <div key={index} className="pb-4 text-sm">
                                            <div className="flex justify-between">
                                                <div>{item.name}</div>
                                                <div>x{item.quantity}</div>
                                            </div>
                                            <div>${item.price}</div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between pb-4">
                                        <li className="text-sm">Items ({items.length})</li>
                                        <li className="text-sm">${totalAmount - totalTax}</li>
                                    </div>
                                    <div className="flex justify-between pb-6">
                                        <li className="text-sm">Tax</li>
                                        <li className="text-sm">${totalTax}</li>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <li className="text-sm">Total</li>
                                        <li className="text-sm">${totalAmount}</li>
                                    </div>
                                </ul>
                                <ul className="w-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500 pb-4">Order #{orderId} / Dine In</div>
                                        <select name="" id="" className='w-full border p-2 px-2 focus:outline-none' value={selectedPayment} onChange={handleChange}>
                                            <option value="cash">Cash</option>
                                            <option value="online payment">Online Payment</option>
                                            <option value="upi payment">UPI Payment</option>
                                        </select>
                                    </div>
                                    <div className='text-center py-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer' onClick={handleProceed}>Complete Payment</div>
                                </ul>
                            </div>
                        )}
                    </>
                </Modal>

                : ''}
            <div className='border h-full rounded-lg shadow-xl bg-white px-2 py-2'>
                <div className='flex flex-col justify-between h-full'>

                    <ul>
                        <div className='pb-4 px-2 pt-2 font-bold'>Order <span className='text-blue-500 '>#{orderId}</span></div>
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className={`p-3 my-1 text-sm ${index % 2 === 0 ? "bg-sky-100 rounded-md" : ""}`}
                            >
                                <span className="mr-2 text-sky-600 font-light">x{item.quantity}</span>
                                <span className="font-medium text-sky-900">{item.name}</span>
                                <span className="px-2 ml-2 bg-sky-400 text-white">
                                    ${item.price.toFixed(2)}
                                </span>

                                <button
                                    className="float-right text-lg text-red-400"
                                    onClick={() => handleDeleteItem(index)}
                                    aria-label="Delete Item"
                                >
                                    <TiDeleteOutline />
                                </button>

                                {editingIndex === index ? (
                                    <div className="py-1 border-t mt-2">
                                        <input
                                            className="p-1 pl-2 mt-2 border rounded-md placeholder:text-sm text-sky-700 border-sky-300 placeholder:text-gray-300"
                                            type="number"
                                            value={
                                                newQuantities[index] === null
                                                    ? ""
                                                    : newQuantities[index] || item.quantity
                                            }
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setNewQuantities({
                                                    ...newQuantities,
                                                    [index]: value > 0 ? value : null,
                                                });
                                            }}
                                        />
                                        <button
                                            className="bg-sky-800 px-3 py-[5px] mx-2 rounded-md text-white"
                                            onClick={() =>
                                                handleEditItem(index, newQuantities[index] || item.quantity)
                                            }
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            className="float-right text-sm text-gray-400 mr-2 mt-[2px]"
                                            onClick={() => handleEditClick(index)}
                                            aria-label="Edit Quantity"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <span className="float-right mr-6 font-medium text-sky-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div>
                        <div className="p-4">
                            <div className="text-sm text-sky-700 border-t border-sky-300 pt-3">
                                <span>Subtotal</span>
                                <span className="float-right">
                                    ${(totalAmount - totalTax).toFixed(2)}
                                </span>
                            </div>
                            <div className="text-sm text-sky-700">
                                <span>Tax</span>
                                <span className="float-right">${totalTax.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 text-sky-800 font-bold">
                                <span>Payable Amount</span>
                                <span className="float-right">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="px-3 pb-1 flex md:flex-row flex-col w-full">
                            <Link
                                className="p-3 w-full text-center mx-1 rounded-md bg-sky-700 text-white hover:bg-sky-600"
                                to="#"
                            >
                                Hold Cart
                            </Link>
                            <Link
                                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white p-3 w-full text-center mx-1 rounded-md"
                                to="#"
                                onClick={handleSummaryOpen}
                            >
                                Proceed
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;

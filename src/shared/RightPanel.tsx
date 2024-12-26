import React, { useState, useEffect } from 'react';
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit2 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { editItem, deleteItem } from '../redux/slices/itemsSlice';

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

    const handleEditItem = (index: number, newQuantity: number) => {
        dispatch(editItem({ index, newQuantity }));
        setNewQuantities({ ...newQuantities, [index]: null });
        setEditingIndex(null); // Reset editing state after saving
    };

    const handleDeleteItem = (index: number) => {
        dispatch(deleteItem( index ));
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

    return (
        <div className='p-3 w-full'>
            <div className='border h-full rounded-lg shadow-xl bg-white px-2 py-2'>
                <div className='flex flex-col justify-between h-full'>
                    <ul>
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

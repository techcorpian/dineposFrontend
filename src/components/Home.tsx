import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addProduct } from '../redux/slices/itemsSlice';

import { IoFastFoodSharp } from "react-icons/io5";
import axios from 'axios'

export interface Item {
    _id?: string;
    name: string;
    description: string;
    price: number;
}

const Home: React.FC = () => {
    const api = import.meta.env.VITE_API
    const dispatch = useDispatch<AppDispatch>();
    const [items, setItems] = useState<Item[]>([]);

    const handleAdd = (name: string, price: number) => {
        dispatch(addProduct({ name, price }));
        console.log(name, price);
    };

    const fetchItems = async () => {
        const response = await axios.get<Item[]>(`${api}/api/items`);
        setItems(response.data);
    };

    useEffect(() => {
        fetchItems();
    }, []);
    return (
        <ul className='p-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
            {items.map((item) => (
                <div onClick={() => handleAdd(item.name, item.price)} className='flex flex-col items-center border bg-white p-3 rounded-md gap-4'>
                    <div className='text-7xl text-gray-200'><IoFastFoodSharp /></div>
                    <div className='text-center'>
                        <div className='font-bold text-gray-600'>{item.name}</div>
                        <p className='text-xs font-thin'>{item.description}</p>
                        <div>${item.price}</div>
                    </div>
                </div>
            ))}
        </ul>
    )
}

export default Home
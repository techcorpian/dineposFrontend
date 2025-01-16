import React from 'react';
import { Link } from 'react-router-dom';
import { RiHomeLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi2";
import { TbBrandAirtable } from "react-icons/tb";
import { FiShoppingBag } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';


interface MenuItem {
    title: string;
    link: string;
    icon: JSX.Element;
}

const Menu: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };
    const menuList: MenuItem[] = [
        {
            title: 'Home',
            link: '/',
            icon: <RiHomeLine />
        },
        // Uncomment if needed
        // {
        //     title: 'Customers',
        //     link: '/customers'
        // },
        // {
        //     title: 'Tables',
        //     link: '/tables'
        // },
        {
            title: 'Orders',
            link: '/orders',
            icon: <FiShoppingBag />
        },
        {
            title: 'Inventory',
            link: '/inventory',
            icon: <TbBrandAirtable />
        },
        {
            title: 'Users',
            link: '/users',
            icon: <HiOutlineUsers />
        },
        {
            title: 'Settings',
            link: '/settings',
            icon: <IoSettingsOutline />
        }
    ];

    return (
        <div className="flex flex-col justify-between bg-black/80 w-full shadow-xl text-white p-3">
            <ul className='flex flex-col'>
                {menuList.map((menu, index) => (
                    <Link key={`${menu.title}-${index}`} to={menu.link} className={`navlink border border-gray-500 text-gray-300 font-extralight text-center rounded-lg flex flex-col items-center justify-center mb-3 hover:shadow-md hover:shadow-gray-600 hover:border-gray-600 hover:border hover:text-gray-600 py-4 `}>
                        <div className='text-4xl'>{menu.icon}</div>
                        <div className='text-sm text-gray-400'>{menu.title}</div>
                    </Link>
                ))}
            </ul>
            <button onClick={handleLogout} className='py-2 px-3 rounded-l-3xl bg-red-700'>Logout</button>
        </div>
    );
};

export default Menu;

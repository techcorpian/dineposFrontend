import React, { ReactNode, useEffect } from 'react';

interface Props {
    onClose: () => void;
    children: ReactNode; // Ensure `children` is explicitly typed
}

const OrderViewModal: React.FC<Props> = ({ onClose, children }) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal-backdrop')) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop absolute top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-10">
            <div className="bg-white rounded-xl shadow-xl w-1/2 relative">
                <span
                    onClick={onClose}
                    className="cursor-pointer text-xl font-bold absolute top-2 right-4"
                >
                    ×
                </span>
                <div className="p-6 px-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default OrderViewModal;

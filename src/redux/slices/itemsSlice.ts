import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface ItemsState {
  items: Item[];
}

const initialState: ItemsState = {
  items: JSON.parse(localStorage.getItem('items') || '[]'), // Initialize from localStorage
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<{ name: string; price: number }>) {
      const { name, price } = action.payload;
      const existingItem = state.items.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ name, price, quantity: 1 });
      }
      localStorage.setItem('items', JSON.stringify(state.items));
    },
    editItem(state, action: PayloadAction<{ index: number; newQuantity: number }>) {
      const { index, newQuantity } = action.payload;
      if (state.items[index]) {
        state.items[index].quantity = newQuantity;
        localStorage.setItem('items', JSON.stringify(state.items));
      }
    },
    deleteItem(state, action: PayloadAction<number>) {
      state.items.splice(action.payload, 1);
      console.log(action.payload);
      localStorage.setItem('items', JSON.stringify(state.items));
      
    },
  },
});

export const { addProduct, editItem, deleteItem } = itemsSlice.actions;

export default itemsSlice.reducer;

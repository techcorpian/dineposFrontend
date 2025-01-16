import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface ItemsState {
  items: Item[];
}

const initialState: ItemsState = {
  items: JSON.parse(localStorage.getItem('items') || '[]'), // Initialize from localStorage
};

const saveToLocalStorage = (items: Item[]) => {
  localStorage.setItem('items', JSON.stringify(items));
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
        state.items.push({ name, price, quantity: 1, description: '' }); // Assuming description is optional
      }
      saveToLocalStorage(state.items);
    },
    editItem(state, action: PayloadAction<{ index: number; newQuantity: number }>) {
      const { index, newQuantity } = action.payload;
      if (state.items[index]) {
        state.items[index].quantity = newQuantity;
        saveToLocalStorage(state.items);
      }
    },
    deleteItem(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (state.items[index]) {
        state.items.splice(index, 1);
        saveToLocalStorage(state.items);
      }
    },
    clearItems(state) {
      state.items = []; // Reset the items to an empty array
      localStorage.removeItem('items'); // Clear localStorage
    },
  },
});

export const { addProduct, editItem, deleteItem, clearItems } = itemsSlice.actions;

export default itemsSlice.reducer;

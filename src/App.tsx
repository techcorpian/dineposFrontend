// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { Provider } from 'react-redux';
import store from './redux/store';

import Menu from './shared/Menu';
import RightPanel from './shared/RightPanel';

import Home from './components/Home';
import Orders from './components/Orders';
import Inventory from './components/Inventory';
import Users from './components/Users';
import Settings from './components/Settings';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
    <Router>
    <div className='h-screen'>
      <div className="flex w-full h-full">
        <div class="w-60 h-full lg:flex hidden"><Menu/></div>

        <div className="w-full overflow-y-auto scrollbar-hide bg-gray-50">

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          
        </div>

        <div className="w-1/2 h-full sm:flex hidden bg-gray-50"><RightPanel/></div>

      </div>
      <div className='absolute bottom-0 border w-full bg-black text-white lg:hidden'>dasfsddsfsdf</div>
    </div>
    </Router>
    </Provider>
  )
}

export default App

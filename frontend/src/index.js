import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {MainPage} from './components/FrontPage.jsx'
import {Register} from "./components/FrontPage Components/Register.jsx"
import {store,persistor} from "./App/store.js"
import { Provider,useSelector } from "react-redux";
import { User } from './components/User/User.jsx'
import UserProfile from './components/User/User.profile.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import ImageCropper from './components/ImageCroper/ImageCropper.jsx'
import Modal from './components/Modal/Modal.jsx'
import ChatWithProfile from './components/User/ChatWith.Profile.jsx'
import ModalSmallScreen from './components/Modal/Modal.smallScreen.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element: <MainPage/>,
    
  },
  {
    path:"/user/:userId",
    element: <User/>
  },
  {
    path:"/user/:userId/profile",
    element: <UserProfile/>
  },{
    path:"/image",
    element: <ModalSmallScreen/>
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router}/>
    </PersistGate>
  </Provider>,
)
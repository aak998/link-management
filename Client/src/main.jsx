import * as ReactDOM from "react-dom/client";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './App.css'
import ErrorPage from "../routes/404";

import LandingPage from "../routes/mainPage";
import MobLandingPage from "../mobroutes/mobMAinPage";
import Register from "../routes/register";
import MobRegister from "../mobroutes/mobRegister";
import DashboardPage from "../routes/dashboardPage";
import MobDashboardPage from "../mobroutes/MobileDashboard";
import CreateLinkPage from "../routes/createLinkPage";


const isMobileOrTablet = window.innerWidth > 1024;
const router = createBrowserRouter([
  {
    path: "/",
    element: isMobileOrTablet ? <LandingPage /> : <MobLandingPage/>, 
    errorElement: <ErrorPage />, 
   },
   {
    path: "/register",
    element: isMobileOrTablet ? <Register /> : <MobRegister/>,
    
   },
   {
    path:"/login",
    element: isMobileOrTablet ? <LandingPage /> : <MobLandingPage/>, 

   },
   {
    path: "/dashboard",
    element: isMobileOrTablet ? <DashboardPage /> : <MobDashboardPage/>,
   },
   {
    path:'/createlink',
    element: isMobileOrTablet ? <CreateLinkPage /> : <CreateLinkPage/>
   },
   {
    path:"/editlink/:id",
    element: isMobileOrTablet ? <CreateLinkPage /> : <CreateLinkPage/>
   }
])


ReactDOM.createRoot(document.getElementById("root")).render(
  
    
  <RouterProvider router={router} />


);
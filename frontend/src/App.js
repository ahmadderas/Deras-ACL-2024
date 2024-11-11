// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TouristSignUp from './components/TouristSignUp';
import WorkerSignUp from './components/WorkerSignUp';
import AdminDashboard from './components/admin/adminDashboard';
import UserManagementPage from './components/admin/userManagement/userManagementPage';
import AddAdmin from './components/admin/userManagement/addAdmin';
import AddGovernor from './components/admin/userManagement/addGovernor';
import ViewSignupRequests from './components/admin/userManagement/viewSignupRequests';
import DeleteUser from './components/admin/userManagement/deleteUser';
import ActivityCategories from './components/admin/activityCategories';
import Tags from './components/admin/tags';
import NotAccepted from './components/NotAccepted';
import AcceptTerms from './components/AcceptTerms';
import SellerDashboard from './components/seller/sellerDashboard';
import TourGuideDashboard from './components/tourGuide/tourGuideDashboard';
import TourGuideProfile from './components/tourGuide/updateProfile';
import SellerProfile from './components/seller/updateProfile';
import AdvertiserProfile from './components/advertiser/updateProfile';
import AdvertiserDashboard from './components/advertiser/advertiserDashboard';
import ViewActivities from './components/advertiser/viewActivities';
import ItineraryComponent from './components/tourGuide/viewItineraries';
import MuseumHistoricalPlaceComponent from './components/tourismGovernor/viewMuseumHistorical';
import TourismGovernorDashboard from './components/tourismGovernor/tourismGovernorDashboard';
import HistoricalTagComponent from './components/tourismGovernor/viewHistoricalTags';
import TouristDashboard from './components/tourist/touristDashboard';
import TouristProfileComponent from './components/tourist/updateProfile';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import TourSystemDemo from './components/TourSystemDemo';
import UserStats from './components/admin/userManagement/viewUserNumbers';
import Events from './components/admin/events';
import AdvertiserNotifications from './components/advertiser/viewNotifications';
import Notifications from './components/tourGuide/viewNotifications';
import ViewAll from './components/tourist/viewAll';
import Comments from './components/tourist/comments';
import ViewSaved from './components/tourist/viewSaved';


function App() {
  return (
    <div className = "App">
    <BrowserRouter>
    <div className = "pages">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/TourSystemDemo" element={<TourSystemDemo />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/notAccepted" element={<NotAccepted />} />
        <Route path="/acceptTerms" element={<AcceptTerms />} />
        <Route path="/signup/tourist" element={<TouristSignUp />} />
        <Route path="/signup/worker" element={<WorkerSignUp />} />
        <Route path="/admin/adminDashboard" element={<AdminDashboard />} />
        <Route path="/seller/sellerDashboard" element={<SellerDashboard />} />
        <Route path="/tourGuide/tourGuideDashboard" element={<TourGuideDashboard />} />
        <Route path="/advertiser/advertiserDashboard" element={<AdvertiserDashboard />} />
        <Route path="/tourismGovernor/tourismGovernorDashboard" element={<TourismGovernorDashboard />} />
        <Route path="/tourist/touristDashboard" element={<TouristDashboard />} />
        <Route path="/tourist/viewAll" element={<ViewAll />} />
        <Route path="/tourist/comments" element={<Comments />} />
        <Route path="/tourist/viewSaved" element={<ViewSaved />} />
        <Route path="/tourist/viewNotifications" element={<Notifications />} />
        <Route path="/tourGuide/updateProfile" element={<TourGuideProfile />} />
        <Route path="/seller/updateProfile" element={<SellerProfile />} />
        <Route path="/tourist/updateProfile" element={<TouristProfileComponent />} />
        <Route path="/advertiser/updateProfile" element={<AdvertiserProfile />} />
        <Route path="/advertiser/viewActivities" element={<ViewActivities />} />
        <Route path="/advertiser/viewNotifications" element={<AdvertiserNotifications />} />
        <Route path="/tourGuide/viewItineraries" element={<ItineraryComponent />} />
        <Route path="/tourGuide/viewNotifications" element={<Notifications />} />
        <Route path="/tourismGovernor/viewMuseumHistorical" element={<MuseumHistoricalPlaceComponent />} />
        <Route path="/tourismGovernor/viewHistoricalTags" element={<HistoricalTagComponent />} />
        <Route path="/admin/UserManagement/userManagementPage" element={<UserManagementPage />} />
        <Route path="/admin/UserManagement/addAdmin" element={<AddAdmin />} />
        <Route path="/admin/UserManagement/addGovernor" element={<AddGovernor />} />
        <Route path="/admin/UserManagement/viewSignupRequests" element={<ViewSignupRequests />} />
        <Route path="/admin/UserManagement/deleteUser" element={<DeleteUser />} />
        <Route path="/admin/UserManagement/viewUserNumbers" element={<UserStats />} />
        <Route path="/admin/events" element={<Events />} />
        <Route path="/admin/activityCategories" element={<ActivityCategories />} />
        <Route path="/admin/tags" element={<Tags />} />




      </Routes>
      </div>
    </BrowserRouter>
    </div>
  );
};

export default App;

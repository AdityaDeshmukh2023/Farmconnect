import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import Auth from './pages/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import Application from './pages/application/Application';
import MarketAnalysis from './components/marketanalysis/MarketAnalysis';
import Weather from './components/weather/Weather';
import Greenscan from './components/greenscan/Greenscan';
import ProfileView from './components/profileview/ProfileView';
import ProfileInput from './components/profileinput/ProfileInput';
import News from './components/news/News';
import CropPrediction from './components/crop-prediction/CropPrediction'
import Feed from './components/feed/Feed';
import Land from './components/land/Land';
import Cummunity from './components/cummunity/Cummunity';
import ExpertForm from './components/expert-form/ExpertForm';
import Experts from './components/experts/Experts';
import Dairy from './components/dairypoultry/Dairy';
import DairyCompo from './components/dairycompo/DairyCompo';
import Forget from './components/forgetpass/Forget';
import ChangePassword from './components/changepassword/ChangePassword';
import CreateReel from './components/createreel/AgroLoopUpload'
import { useSelector } from "react-redux";
import ResetPassword from './components/resetpassword/ResetPassword';
import UploadPost from './components/uploadpost/UpoadPost';




function App() {
  const access_token = useSelector((state) => state.auth_token.access_token)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage city="karanja" signInfo="Sign In" />} />
          <Route path="auth" element={!access_token ? <Auth /> : <Navigate to="/application/land" />} />
          <Route path="forget" element={<Forget />} />
          <Route path="application" element={<Application />} >
            <Route path="dashboard" element={access_token ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="market" element={access_token ? <MarketAnalysis /> : <Navigate to="/auth" />} />
            <Route path="weather" element={access_token ? <Weather /> : <Navigate to="/auth" />} />
            <Route path="profile-view" element={access_token ? <ProfileView /> : <Navigate to="/auth" />} />
            <Route path="profile-input" element={access_token ? <ProfileInput /> : <Navigate to="/auth" />} />
            <Route path="greenscan" element={access_token ? <Greenscan /> : <Navigate to="/auth" />} />
            <Route path="news" element={access_token ? <News /> : <Navigate to="/auth" />} />
            <Route path="crop-prediction" element={access_token ? <CropPrediction /> : <Navigate to="/auth" />} />
            <Route path="agriloop" element={access_token ? <Feed /> : <Navigate to="/auth" />} />
            <Route path="land" element={access_token ? <Land /> : <Navigate to="/auth" />} />
            <Route path="community" element={access_token ? <Cummunity /> : <Navigate to="/auth" />} />
            <Route path="expert" element={access_token ? <ExpertForm /> : <Navigate to="/auth" />} />
            <Route path="experts-page" element={access_token ? <Experts /> : <Navigate to="/auth" />} />
            <Route path="guidance" element={access_token ? <Dairy /> : <Navigate to="/auth" />} />
            <Route path="change-password" element={access_token ? <ChangePassword /> : <Navigate to="/auth" />} />
            <Route path="create-agroloop" element={access_token ? <CreateReel /> : <Navigate to="/auth" />} />
            <Route path="upload-post" element={access_token ? <UploadPost /> : <Navigate to="/auth" />} />



            <Route path=':id' element={<DairyCompo />} />
          </Route>
          <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

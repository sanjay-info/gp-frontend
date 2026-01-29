import React, { useEffect } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { Modal } from 'react-bootstrap';
import { useAppContext } from './Pages/components/AppProvider';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-phone-input-2/lib/style.css';
import "react-datepicker/dist/react-datepicker.css";
import Login from './Pages/Login';
import ChangePassword from './Pages/components/ChangePassword';
import { SidebarProvider } from './Pages/components/SidebarContext';
import ForgotPassword from './Pages/components/ForgotPassword';
import ClientListInves from './Pages/User/ClientListInves';
import HoldingTable from './Pages/User/HoldingTable';
import SfLoginOtp from './Pages/components/Sfloginotp';
import Myprofilekyc from './Pages/User/Myprofilekyc';
import Userlist from './Pages/Admin/Userlist';
import Gpbond from './Pages/User/Gpbond';
import PaymentGatway from './Pages/User/PaymentGatway';
import Homepage from './Pages/User/Homepage';
import PreviewBondView from './Pages/User/PreviewBondView';
import ChangePassworduser from './Pages/User/ChangePassworduser';
import AboutUs from './Pages/User/AboutUs';
import Holding from './Pages/User/Holding';
// -------------- Approver--------------
import UserKycDetails from './Pages/Approver/UserKycDetails';
import PaymentApprove from './Pages/FINANCE/PaymentApprove';
import ViewKycdata from './Pages/Approver/ViewKycdata';
import UserBondApprove from './Pages/Approver/UserBondApprove';
import ViewBonddata from './Pages/Approver/ViewBonddata';
import ChckFinancepayment from './Pages/FINANCE/ChckFinancepayment';
import TeamsAndCondition from './Pages/User/TeamsAndCondition';
import DisableDevtool from 'disable-devtool';
import NriOciform from './Pages/Nriandoci/Nriociform';
import UpdateNriociform from './Pages/Nriandoci/UpdateNriociform';
import AdminCreateuser from './Pages/Admin/AdminCreateuser';
import ViewUserByadmin from './Pages/Admin/ViewUserByadmin';
import AdminMsg from './Pages/Admin/AdminMsg';
import ForgotUsername from './Pages/components/ForgotUsername';
import FinanceReport from './Pages/FINANCE/FinanceReport';
import ApproverReport from './Pages/Approver/ApproverReport';
import CubeHomepage from './Pages/User/CubeHomepage';
import { monitorNetworkStatus } from './Pages/components/networkStatus';
import UnitAllowcation from './Pages/FINANCE/UnitAllowcation';
import FormList from './Pages/FINANCE/FormList';
import ApplicationForm from './Pages/FINANCE/ApplicationForm';
import Dividend from './Pages/FINANCE/Dividend';
import ViewDividend from './Pages/User/ViewDividend';
import ViewDividendFinance from './Pages/FINANCE/ViewDividendFinance';
import ScrollToTop from './Pages/components/ScrollToTop';
import DraftGetAll from './Pages/User/DraftGetAll';
import Scheme from './Pages/Admin/Scheme';
import ViewScheme from './Pages/Admin/ViewScheme';
import ProjectMaster from './Pages/Admin/ProjectMaster';
import ViewProjectMaster from './Pages/Admin/ViewProjectMaster';
import DividendMaster from './Pages/Admin/DividendMaster';
import ViewHoldingDetails from './Pages/User/ViewHoldingDetails';
import ConversionRate from './Pages/FINANCE/ConversionRate';
import DroneImgUpload from './Pages/Admin/DroneImgUpload';
import VideoUrlPage from './Pages/User/VideoUrlPage';
import ProjectlistUpload from './Pages/Admin/ProjectlistUpload';
import UserProjectlist from './Pages/User/UserProjectlist';
import DividendDeclaration from './Pages/Secretariat/DividendDeclaration';
import AllotmentForm from './Pages/Secretariat/AllotementForm';
import DividendPayout from './Pages/Secretariat/DividendPayout';
import DividendYear from './Pages/FINANCE/DividendYear';
import OtpCenter from './Pages/Admin/OtpCenter';
import LoginHistory from './Pages/Admin/LoginHistory';
import AuditTrail from './Pages/Admin/AuditTrail';
import IntentDetails from './Pages/Admin/IntentLoans';
import LoanList from './Pages/Admin/Adminloan';
import LoanView from './Pages/Admin/LoanView';
import LoanApplications from './Pages/Admin/LoanApplication';
import IntentView from './Pages/Admin/Intentview';
import LoanApplicationView from './Pages/Admin/LoanApplicationView';
import ViewUserAdminNew from './Pages/Admin/ViewloanesbyAdmin';
import LoanPayout from './Pages/FINANCE/Loanpayout';
import GMFinanceLoan from './Pages/GM-Finance/GMFinanceLoan';
import GMFinanceLoanView from './Pages/GM-Finance/GMFinanceLoanView';
import DocumentMaster from './Pages/FINANCE/DocumentMaster';
import DocumentTemplates from './Pages/FINANCE/DocumentTemplate';
import Documents from './Pages/FINANCE/Document';
import LoanApprovals from './Pages/GM-Finance/GMFinanceLoan';
import Payments from './Pages/FINANCE/Payment';


const simplifiedConfig = {
  ondevtoolopen: (type, next) => {
    const userConfirmed = window.confirm("Don't open Developer Tools. It's not allowed in the application.");
    if (userConfirmed) {
      localStorage.clear();
      window.location.hash = "/";
    }
  },
};

if (process.env.REACT_APP_STAGE === "production") {
  DisableDevtool(simplifiedConfig);
}

function App() {
  const { appContextValue } = useAppContext();

  const roleId = localStorage.getItem("Role_id");

  let storedRoleId = JSON.parse(roleId)

  // useEffect(() => {
  //   if (process.env.REACT_APP_STAGE === "production") {
  //     const handleCopy = (event) => {
  //       event.preventDefault();
  //     };

  //     const handlePaste = (event) => {
  //       event.preventDefault();
  //     };

  //     document.addEventListener('copy', handleCopy);
  //     document.addEventListener('paste', handlePaste);

  //     return () => {
  //       document.removeEventListener('copy', handleCopy);
  //       document.removeEventListener('paste', handlePaste);
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (process.env.REACT_APP_STAGE === "production") {
      const handleContextMenu = (e) => {
        e.preventDefault();
      };
      document.addEventListener('contextmenu', handleContextMenu);

      const ctrlShiftKey = (e, key) => {
        return e.ctrlKey && e.shiftKey && e.key === key;
      };

      const handleKeyDown = (e) => {
        if (
          e.keyCode === 123 || // F12 (Dev Tools)
          ctrlShiftKey(e, 'I') || // Ctrl+Shift+I (Dev Tools)
          ctrlShiftKey(e, 'J') || // Ctrl+Shift+J (Console)
          ctrlShiftKey(e, 'C') || // Ctrl+Shift+C (Inspect Element)
          (e.ctrlKey && e.key === 'U') // Ctrl+U (View Source)
        ) {
          e.preventDefault();
          return false;
        }
      };

      const handleResize = () => {
        // Detect opening of the dev tools by checking window size changes
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
          window.close(); // Close the window if dev tools are opened
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  useEffect(() => {
    const cleanupNetworkStatus = monitorNetworkStatus();

    return () => {
      cleanupNetworkStatus();
    };
  }, []);

  return (
    <div>
      <SidebarProvider>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/ForgetPassword' element={<ForgotPassword />} />
            <Route path='/ForgotUsername' element={<ForgotUsername />} />
            <Route path={'/SfLoginOtp'} element={<SfLoginOtp />} />
            <Route path="/ChangePassworduser" element={<ChangePassworduser />} />
            <Route path="/changePassword" element={<ChangePassword />} />

            {/* ----------------- Users --------------- */}

            <Route path="/Myprofilekyc" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <Myprofilekyc /> : <Login />} />
            <Route path="/ClientList" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <ClientListInves /> : <Login />} />
            <Route path="/GpBond" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <Gpbond /> : <Login />} />
            <Route path="/HoldingTable" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <HoldingTable /> : <Login />} />
            <Route path="/Holding" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <Holding /> : <Login />} />
            <Route path="/PreviewBondView" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <PreviewBondView /> : <Login />} />
            <Route path="/PaymentGatway" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <PaymentGatway /> : <Login />} />
            <Route path="/HomePage" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <Homepage /> : <Login />} />
            <Route path="/AboutUs" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <AboutUs /> : <Login />} />
            <Route path="/TeamsAndCondition" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <TeamsAndCondition /> : <Login />} />
            <Route path="/Nriociform" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <NriOciform /> : <Login />} />
            <Route path="/UpdateNriociform" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <UpdateNriociform /> : <Login />} />
            <Route path="/CubeHomepage" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <CubeHomepage></CubeHomepage> : <Login />} />
            <Route path="/DraftGetAll" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <DraftGetAll /> : <Login />} />
            <Route path="/ViewHoldingDetails" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <ViewHoldingDetails /> : <Login />} />
            <Route path="/VideoUrlPage" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <VideoUrlPage /> : <Login />} />
            <Route path="/UserProjectlist" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 2 ? <UserProjectlist></UserProjectlist> : <Login />} />

            {/* ----------------- admin ----------------------- */}

            <Route path='/Investors' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <Userlist /> : <Login />}></Route>
            <Route path='/Loaners' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <Userlist /> : <Login />}></Route>
            <Route path='/AdminCreateuser' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <AdminCreateuser /> : <Login />} />
            <Route path='/ViewUserByadmin' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <ViewUserByadmin /> : <Login />} />
            <Route path='/Adminmsg' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <AdminMsg /> : <Login />} />
            <Route path='/ProjectMaster' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <ProjectMaster /> : <Login />} />
            <Route path='/ViewProjectMaster' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <ViewProjectMaster /> : <Login />} />
            <Route path='/DividendMaster' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 4) ? <DividendMaster /> : <Login />} />
            <Route path='/ProjectlistUpload' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 4) ? <ProjectlistUpload /> : <Login />} />
            <Route path='/DroneImgUpload' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 4) ? <DroneImgUpload /> : <Login />} />
            <Route path='/OtpDetails' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 4) ? <OtpCenter /> : <Login />} />
            <Route path='/LoginHistory' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 4) ? <LoginHistory /> : <Login />} />
            <Route path='/AuditTrail' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <AuditTrail /> : <Login />}></Route>
            <Route path='/AdminLoanIntent' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <IntentDetails /> : <Login />}></Route>
            <Route path='/AdminLoans' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <LoanList /> : <Login />}></Route>
            <Route path="/LoanView/:loanId" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <LoanView /> : <Login />}></Route>
            <Route path='/IntentView' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <IntentView /> : <Login />}></Route>
            <Route path='/LoanApplications' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <LoanApplications /> : <Login />}></Route>
            <Route path='/LoanApplicationView/:loanApplicationId' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <LoanApplicationView /> : <Login />}></Route>
            <Route path='/ViewLoanerByAdmin' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 1 ? <ViewUserAdminNew /> : <Login />}></Route>


            {/* ----------------- Approver ----------------------- */}

            <Route path='/UserKycDetails' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 3 ? <UserKycDetails /> : <Login />}></Route>
            <Route path='/ViewKycdata' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 3 ? <ViewKycdata /> : <Login />}></Route>
            <Route path='/UserBondApprove' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 3 ? <UserBondApprove /> : <Login />}></Route>
            <Route path='/ViewBonddata' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 3 ? <ViewBonddata /> : <Login />}></Route>
            <Route path='/ApproverReport' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 3 ? <ApproverReport /> : <Login />}></Route>

            {/* ----------------- Finance ----------------------- */}

            <Route path='/PaymentApprove' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <PaymentApprove /> : <Login />}></Route>
            <Route path='/ChckFinancepayment' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <ChckFinancepayment /> : <Login />}></Route>
            <Route path='/FinanceReport' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <FinanceReport /> : <Login />}></Route>
            <Route path='/ApplicationForm' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <ApplicationForm /> : <Login />} />
            <Route path='/Dividend' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <Dividend /> : <Login />} />
            <Route path='/ViewDividendFinance' element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <ViewDividendFinance /> : <Login />} />
            <Route path="/ViewDividend" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <ViewDividend /> : <Login />} />
            <Route path="/ConversionRate" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 4 ? <ConversionRate /> : <Login />} />

            <Route path='/ViewScheme' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 6) ? <ViewScheme /> : <Login />} />
            <Route path='/Scheme' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 1 || storedRoleId[0].id === 6) ? <Scheme /> : <Login />} />
            <Route path='/FormList' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 4 || storedRoleId[0].id === 6) ? <FormList /> : <Login />} />
            <Route path='/UnitAllowcation' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 4 || storedRoleId[0].id === 6) ? <UnitAllowcation /> : <Login />} />
            <Route path='/DividendYear' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 4 || storedRoleId[0].id === 6) ? <DividendYear /> : <Login />} />
            <Route path='/LoanPayout' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 4 || storedRoleId[0].id === 6) ? <LoanPayout /> : <Login />} />
            <Route
              path="/DocumentMasters"
              element={
                roleId !== null &&
                  roleId !== undefined &&
                  roleId !== "" &&
                  storedRoleId[0].id === 4
                  ? <DocumentMaster />
                  : <Login />
              }
            />

            <Route
              path="/DocumentTemplates"
              element={
                roleId !== null &&
                  roleId !== undefined &&
                  roleId !== "" &&
                  storedRoleId[0].id === 4
                  ? <DocumentTemplates />
                  : <Login />
              }
            />

            <Route
              path="/Documents"
              element={
                roleId !== null &&
                  roleId !== undefined &&
                  roleId !== "" &&
                  storedRoleId[0].id === 4
                  ? <Documents />
                  : <Login />
              }
            />
            <Route path='/Payments' element={roleId !== null && roleId !== undefined && roleId !== "" && (storedRoleId[0].id === 4 || storedRoleId[0].id === 6) ? <Payments /> : <Login />} />




            {/* ----------------- Secretariat ----------------------- */}
            <Route path="/DividendDeclaration" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 6 ? <DividendDeclaration /> : <Login />} />
            <Route path="/AllotmentForm" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 6 ? <AllotmentForm /> : <Login />} />
            <Route path="/DividendPayout" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 6 ? <DividendPayout /> : <Login />} />


            <Route path="/LoanApprovals/:status" element={roleId !== null && roleId !== undefined && roleId !== "" && storedRoleId[0].id === 7 ? <LoanApprovals /> : <Login />} />
            <Route
              path="/GMFinanceLoanView/:loanId"
              element={
                roleId !== null &&
                  roleId !== undefined &&
                  roleId !== "" &&
                  storedRoleId[0].id === 7
                  ? <LoanView />
                  : <Login />
              }
            />

          </Routes>
        </HashRouter>
      </SidebarProvider>
      <div>
        <Modal className='loader_modal' centered show={appContextValue.value}>
          <RotatingLines
            strokeColor="#659DBD"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={appContextValue.value}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
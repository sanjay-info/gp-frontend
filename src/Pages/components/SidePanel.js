import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSidebar } from "./SidebarContext";
import { FaUser } from "react-icons/fa";
import { IoHomeOutline, IoWalletOutline } from "react-icons/io5";
import { BiGitPullRequest } from "react-icons/bi";
import { PiMoneyLight, PiPasswordFill } from "react-icons/pi";
import { MdRoundaboutRight, MdMessage } from "react-icons/md";
import { TbUsersPlus } from "react-icons/tb";
import { TbReport } from "react-icons/tb";
import { LuAlignEndHorizontal, LuCalculator } from "react-icons/lu";
import { BsDatabase } from "react-icons/bs";
import { gp_logo } from "./imageUrl";
import { RiDraftLine } from "react-icons/ri";
import { GoHistory, GoProjectRoadmap } from "react-icons/go";
import { BiWindowOpen } from "react-icons/bi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { TbNavigationDollar } from "react-icons/tb";
import { RiFileUploadLine } from "react-icons/ri";
import { GiDeliveryDrone } from "react-icons/gi";
import { AiOutlineYoutube } from "react-icons/ai";

const SidePanel = () => {
  var {
    sideBarCollapse,
    sideBarToggle,
    handleSidebarToggle,
    handleBackdropClick,
  } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const storedItem = localStorage.getItem("Role_id");

  const [tooltip, setTooltip] = useState({ text: '', visible: true, });

  const handleMouseEnter = (event, text) => {
    setTooltip({
      text,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ text: '', visible: false, });
  };

  var role = [];
  if (storedItem !== null && storedItem !== undefined) {
    role = JSON.parse(storedItem);
  } else {
    role = [];
  }

  useEffect(() => {
    if (sideBarToggle) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }

    // Cleanup function to remove the class if the component unmounts
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [sideBarToggle]);

  return (
    <Sidebar
      collapsed={sideBarCollapse}
      toggled={sideBarToggle}
      onToggle={handleSidebarToggle}
      onBackdropClick={handleBackdropClick}
      breakPoint="lg"
      className="sidebar_container"
    >
      <div className="d-block d-md-none">
        <div className="sidebar_img_div">
          <img src={gp_logo} alt="no" className="logoimglogin" />
        </div>
      </div>
      {role.map((item) => {
        return (
          <>
            {/* Admin */}
            {item.id === 1 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  onClick={() => {
                    navigate("/userList");
                    handleBackdropClick();
                  }}
                  icon={<TbUsersPlus id="sidebaruser" />}
                  className={
                    location.pathname === "/userList" ||
                      location.pathname === "/AdminCreateuser" ||
                      location.pathname === "/ViewUserByadmin"
                      ? "active"
                      : ""
                  }
                >
                  User list
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/ProjectMaster");
                    handleBackdropClick();
                  }}
                  icon={<GoProjectRoadmap id="sidebaruser" />}
                  className={
                    location.pathname === "/ProjectMaster" ||
                      location.pathname === "/ViewProjectMaster"
                      ? "active"
                      : ""
                  }
                >
                  Project Master
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/Scheme");
                    handleBackdropClick();
                  }}
                  icon={<BiWindowOpen id="sidebaruser" />}
                  className={
                    location.pathname === "/Scheme" ||
                      location.pathname === "/ViewScheme"
                      ? "active"
                      : ""
                  }
                >
                  Scheme Master
                </MenuItem>
                {/* <MenuItem
                                    onClick={() => { navigate('/DividendMaster'); handleBackdropClick() }}
                                    icon={<FaHandHoldingDollar  id="sidebaruser" />}
                                    className={location.pathname === '/DividendMaster' || location.pathname === '/DividendMaster' ? 'active' : ''}
                                >
                                    Dividend Master
                                </MenuItem> */}

                <MenuItem
                  onClick={() => {
                    navigate("/ProjectlistUpload");
                    handleBackdropClick();
                  }}
                  icon={<GiDeliveryDrone id="sidebaruser" />}
                  className={
                    location.pathname === "/ProjectlistUpload" ||
                      location.pathname === "/DroneImgUpload"
                      ? "active"
                      : ""
                  }
                >
                  Upload File
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/OtpDetails");
                    handleBackdropClick();
                  }}
                  icon={<PiPasswordFill id="OtpDetails" />}
                  className={location.pathname === "/OtpDetails" ? "active" : ""}
                >
                  NRI Otp Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/AdminMsg");
                    handleBackdropClick();
                  }}
                  icon={<MdMessage id="sidebaruser" />}
                  className={location.pathname === "/AdminMsg" ? "active" : ""}
                >
                  Message
                </MenuItem>
                  
                   <MenuItem
                  onClick={() => {
                    navigate("/LoginHistory");
                    handleBackdropClick();
                  }}
                  icon={<GoHistory id="sidebaruser" />}
                  className={location.pathname === "/LoginHistory" ? "active" : ""}
                >
                  Login History
                </MenuItem>


<MenuItem
                  onClick={() => {
                    navigate("/AuditTrail");
                    handleBackdropClick();
                  }}
                  icon={<GoHistory id="sidebaruser" />}
                  className={location.pathname === "/AuditTrail" ? "active" : ""}
                >
                  Audit Trail
                </MenuItem>

              </Menu>
            )}
            {/* User */}
            {item.id === 2 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  onClick={() => {
                    navigate("/Homepage");
                    handleBackdropClick();
                  }}
                  icon={<IoHomeOutline id="sidebarhome" />}
                  className={location.pathname === "/Homepage" ? "active" : ""}
                >
                  <span>Home Page</span>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/ClientList");
                    handleBackdropClick();
                  }}
                  icon={<PiMoneyLight id="sidebarSchems" />}
                  className={
                    location.pathname === "/ClientList" ||
                      location.pathname === "/Gpbond" ||
                      location.pathname === "/Gpbondnineper" ||
                      location.pathname === "/Nriociform"
                      ? "active"
                      : ""
                  }
                  //   onMouseEnter={(e) => handleMouseEnter(e, `Choose your shares, receive dividends (half-yearly or after 3 years), and redeem after the term ends.`)}
                  //   onMouseLeave={handleMouseLeave}
                  title="Choose your shares, receive dividends (half-yearly or after 3 years), and redeem after the term ends."
                >
                  Schemes
                </MenuItem>
                {/* <MenuItem
                                    onClick={() => { navigate('/DraftGetAll'); handleBackdropClick() }}
                                    icon={<RiDraftLine id="sidebarSchems" />}
                                    className={location.pathname === '/DraftGetAll' ? 'active' : ''}
                                >
                                    Draft
                                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    navigate("/HoldingTable");
                    handleBackdropClick();
                  }}
                  icon={<BiGitPullRequest id="sidebarinves" />}
                  className={
                    location.pathname === "/HoldingTable" ||
                      location.pathname === "/PreviewBondView" ||
                      location.pathname === "/UpdateNriociform" ||
                      location.pathname === "/DraftGetAll"
                      ? "active"
                      : ""
                  }
                  //   onMouseEnter={(e) => handleMouseEnter(e, `All schemes you've chosen and invested in are listed here.`)}
                  //   onMouseLeave={handleMouseLeave}
                  title="All schemes you've chosen and invested in are listed here.   "
                >
                  {/* Investment Applied */}
                  My Investments
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/Holding");
                    handleBackdropClick();
                  }}
                  icon={<IoWalletOutline id="sidebarinves" />}
                  className={
                    location.pathname === "/Holding" ||
                      location.pathname === "/ViewHoldingDetails"
                      ? "active"
                      : ""
                  }
                  //   onMouseEnter={(e) => handleMouseEnter(e, `Manage your allocated shares, access documents, and track your earnings.`)}
                  //   onMouseLeave={handleMouseLeave}
                  title="Manage your allocated shares, access documents, and track your earnings."
                >
                  My Holdings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/UserProjectlist");
                    handleBackdropClick();
                  }}
                  icon={<AiOutlineYoutube id="sidebarinves" />}
                  className={
                    location.pathname === "/UserProjectlist" ||
                      location.pathname === "/VideoUrlPage"
                      ? "active"
                      : ""
                  }
                >
                  Project Updates
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/AboutUs");
                    handleBackdropClick();
                  }}
                  icon={<MdRoundaboutRight id="sidebarabout" />}
                  className={location.pathname === "/AboutUs" ? "active" : ""}
                >
                  Contact Us
                </MenuItem>
              </Menu>
            )}
            {item.id === 3 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  onClick={() => {
                    navigate("/UserKycDetails");
                    handleBackdropClick();
                  }}
                  icon={<IoHomeOutline id="sidebarkyc" />}
                  className={
                    location.pathname === "/UserKycDetails" ||
                      location.pathname === "/ViewKycdata"
                      ? "active"
                      : ""
                  }
                >
                  Investors KYC Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/UserBondApprove");
                    handleBackdropClick();
                  }}
                  icon={<PiMoneyLight id="sidebarform" />}
                  className={
                    location.pathname === "/UserBondApprove" ||
                      location.pathname === "/ViewBonddata"
                      ? "active"
                      : ""
                  }
                >
                  Investment Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/ApproverReport");
                    handleBackdropClick();
                  }}
                  icon={<TbReport id="ApproverReport" />}
                  className={
                    location.pathname === "/ApproverReport" ? "active" : ""
                  }
                >
                  Report
                </MenuItem>
              </Menu>
            )}
            {item.id === 4 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  onClick={() => {
                    navigate("/PaymentApprove");
                    handleBackdropClick();
                  }}
                  icon={<FaUser id="financeadmin" />}
                  className={
                    location.pathname === "/PaymentApprove" ||
                      location.pathname === "/ChckFinancepayment"
                      ? "active"
                      : ""
                  }
                >
                  User Payment Details
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/UnitAllowcation")}
                  icon={<LuAlignEndHorizontal id="UnitAllowcation" />}
                  className={
                    location.pathname === "/UnitAllowcation" ||
                      location.pathname === "/FormList" ||
                      location.pathname === "/ApplicationForm"
                      ? "active"
                      : ""
                  }
                >
                  Allotment
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/Dividend")}
                  icon={<BsDatabase id="Dividend" />}
                  className={
                    location.pathname === "/Dividend" ||
                      location.pathname === "/DividendMaster"
                      ? "active"
                      : ""
                  }
                >
                  Dividend
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/DividendYear")}
                  icon={<LuCalculator id="DividendYear" />}
                  className={
                    location.pathname === "/DividendYear"
                      ? "active"
                      : ""
                  }
                >
                  Dividend Year Calculation
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/ConversionRate")}
                  icon={<TbNavigationDollar id="ConversionRate" />}
                  className={
                    location.pathname === "/ConversionRate" ? "active" : ""
                  }
                >
                  Conversion Rate
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/OtpDetails");
                    handleBackdropClick();
                  }}
                  icon={<PiPasswordFill id="OtpDetails" />}
                  className={location.pathname === "/OtpDetails" ? "active" : ""}
                >
                  NRI Otp Details
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/FinanceReport");
                    handleBackdropClick();
                  }}
                  icon={<TbReport id="FinanceReport" />}
                  className={
                    location.pathname === "/FinanceReport" ? "active" : ""
                  }
                >
                  Report
                </MenuItem>
              </Menu>
            )}
            {item.id === 5 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  icon={<FaUser id="agentuser" />}
                  className={location.pathname === "/userList" ? "active" : ""}
                >
                  Agent
                </MenuItem>
              </Menu>
            )}
            {item.id === 6 && (
              <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                  onClick={() => navigate("/DividendDeclaration")}
                  icon={<BsDatabase id="DividendDeclaration" />}
                  className={
                    location.pathname === "/DividendDeclaration" ||
                      location.pathname === "/DividendDeclaration"
                      ? "active"
                      : ""
                  }
                >
                  Dividend Declaration
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/DividendPayout")}
                  icon={<BsDatabase id="DividendPayout" />}
                  className={
                    location.pathname === "/DividendPayout" ||
                      location.pathname === "/DividendPayout"
                      ? "active"
                      : ""
                  }
                >
                  Dividend Payout
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/UnitAllowcation")}
                  icon={<LuAlignEndHorizontal id="UnitAllowcation" />}
                  className={
                    location.pathname === "/UnitAllowcation" ||
                      location.pathname === "/FormList" ||
                      location.pathname === "/AllotmentForm"
                      ? "active"
                      : ""
                  }
                >
                  Allotment
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/Scheme");
                    handleBackdropClick();
                  }}
                  icon={<BiWindowOpen id="sidebaruser" />}
                  className={
                    location.pathname === "/Scheme" ||
                      location.pathname === "/ViewScheme"
                      ? "active"
                      : ""
                  }
                >
                  Scheme Master
                </MenuItem>
              </Menu>
            )}

          </>
        );
      })}
    </Sidebar>
  );
};

export default SidePanel;

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useSidebar } from "./SidebarContext";

import { FaUser } from "react-icons/fa";
import { IoHomeOutline, IoWalletOutline } from "react-icons/io5";
import { BiGitPullRequest, BiWindowOpen } from "react-icons/bi";
import { PiMoneyLight, PiPasswordFill } from "react-icons/pi";
import { MdRoundaboutRight, MdMessage, MdFactCheck } from "react-icons/md";
import { TbUsersPlus, TbReport, TbNavigationDollar } from "react-icons/tb";
import { LuAlignEndHorizontal, LuCalculator } from "react-icons/lu";
import { BsDatabase } from "react-icons/bs";
import { RiDraftLine, RiLoginBoxLine } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { GiDeliveryDrone } from "react-icons/gi";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { gp_logo } from "./imageUrl";
import { FaFileCircleCheck } from "react-icons/fa6";

import {
  PiClockLight,
  PiCheckCircleLight,
  PiXCircleLight,
} from "react-icons/pi";


const SidePanel = () => {
  const {
    sideBarCollapse,
    sideBarToggle,
    handleSidebarToggle,
    handleBackdropClick,
  } = useSidebar();

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const storedItem = localStorage.getItem("Role_id");
  const role = storedItem ? JSON.parse(storedItem) : [];

  useEffect(() => {
    if (sideBarToggle) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => document.body.classList.remove("body-scroll-lock");
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
          <img src={gp_logo} alt="logo" className="logoimglogin" />
        </div>
      </div>

      {role.map((item) => (
        <React.Fragment key={item.id}>

          {/* ================= ADMIN (ROLE 1) ================= */}
          {item.id === 1 && (
            <Menu iconShape="square" className="ClsMenu">

              {/* USERS */}
              <SubMenu
                label="Users"
                icon={<TbUsersPlus />}
                defaultOpen={
                  pathname === "/Investors" ||
                  pathname === "/Loaners"
                }
              >
                <MenuItem
                  icon={<FaUser />}
                  className={pathname === "/Investors" ? "active" : ""}
                  onClick={() => {
                    navigate("/Investors");
                    handleBackdropClick();
                  }}
                >
                  Investors
                </MenuItem>

                <MenuItem
                  icon={<FaHandHoldingDollar />}
                  className={pathname === "/Loaners" ? "active" : ""}
                  onClick={() => {
                    navigate("/Loaners");
                    handleBackdropClick();
                  }}
                >
                  Loaners
                </MenuItem>
              </SubMenu>

              {/* ADMIN */}
              <SubMenu
                label="Admin"
                icon={<GoProjectRoadmap />}
                defaultOpen={
                  pathname.includes("/ProjectMaster") ||
                  pathname.includes("/Scheme") ||
                  pathname.includes("/ProjectlistUpload") ||
                  pathname.includes("/OtpDetails") ||
                  pathname.includes("/AdminMsg")
                }
              >
                <MenuItem
                  className={pathname.includes("/ProjectMaster") ? "active" : ""}
                  onClick={() => navigate("/ProjectMaster")}
                >
                  Project Master
                </MenuItem>

                <MenuItem
                  className={pathname.includes("/Scheme") ? "active" : ""}
                  onClick={() => navigate("/Scheme")}
                >
                  Scheme Master
                </MenuItem>

                <MenuItem
                  className={pathname.includes("/ProjectlistUpload") ? "active" : ""}
                  onClick={() => navigate("/ProjectlistUpload")}
                >
                  Upload File
                </MenuItem>

                <MenuItem
                  className={pathname === "/OtpDetails" ? "active" : ""}
                  onClick={() => navigate("/OtpDetails")}
                >
                  NRI Otp Details
                </MenuItem>

                <MenuItem
                  className={pathname === "/AdminMsg" ? "active" : ""}
                  onClick={() => navigate("/AdminMsg")}
                >
                  Message
                </MenuItem>
              </SubMenu>

              {/* LOAN */}

              <SubMenu
                label="Loan"
                icon={<FaHandHoldingDollar />}
                defaultOpen={
                  pathname.includes("/AdminLoanIntent") ||
                  pathname.includes("/IntentView") ||
                  pathname.includes("/LoanApplications") ||
                  pathname.includes("/LoanApplicationView") ||
                  pathname.includes("/AdminLoans") ||
                  pathname.includes("/LoanView")
                }
              >

                <MenuItem
                  icon={<RiDraftLine />}
                  className={
                    pathname === "/AdminLoanIntent" ||
                      pathname.includes("/IntentView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/AdminLoanIntent")}
                >
                  Loan Intent
                </MenuItem>

                <MenuItem
                  icon={<RiDraftLine />}
                  className={
                    pathname === "/LoanApplications" ||
                      pathname.includes("/LoanApplicationView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/LoanApplications")}
                >
                  Loan Applications
                </MenuItem>


                <MenuItem
                  icon={<PiMoneyLight />}
                  className={
                    pathname === "/AdminLoans" ||
                      pathname.includes("/LoanView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/AdminLoans")}
                >
                  Loans
                </MenuItem>

              </SubMenu>

              {/* AUDIT */}
              <SubMenu
                label="Audit"
                icon={<MdFactCheck />}
                defaultOpen={
                  pathname.includes("/LoginHistory") ||
                  pathname.includes("/AuditTrail")
                }
              >
                <MenuItem
                  icon={<RiLoginBoxLine />}
                  className={pathname === "/LoginHistory" ? "active" : ""}
                  onClick={() => navigate("/LoginHistory")}
                >
                  Login History
                </MenuItem>

                <MenuItem
                  icon={<MdFactCheck />}
                  className={pathname === "/AuditTrail" ? "active" : ""}
                  onClick={() => navigate("/AuditTrail")}
                >
                  Audit Trail
                </MenuItem>
              </SubMenu>

            </Menu>
          )}
          {/* ------------------- USER (Role 2) -------------------- */}
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
                title="Choose your shares, receive dividends."
              >
                Schemes
              </MenuItem>

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
              >
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
                className={
                  location.pathname === "/AboutUs" ? "active" : ""
                }
              >
                Contact Us
              </MenuItem>
            </Menu>
          )}

          {/* ------------------- APPROVER (Role 3) -------------------- */}
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
                  location.pathname === "/ApproverReport"
                    ? "active"
                    : ""
                }
              >
                Report
              </MenuItem>
            </Menu>
          )}

          {/* ------------------- FINANCE ADMIN (Role 4) -------------------- */}
          {/* ------------------- FINANCE ADMIN (Role 4) -------------------- */}
          {item.id === 4 && (
            <Menu iconShape="square" className="ClsMenu">

              {/* INVESTORS */}
              <SubMenu
                label="Investors"
                icon={<FaUser />}
                defaultOpen={
                  pathname.includes("/PaymentApprove") ||
                  pathname.includes("/ConversionRate") ||
                  pathname.includes("/Dividend") ||
                  pathname.includes("/DividendYear")
                }
              >
                <MenuItem
                  onClick={() => navigate("/PaymentApprove")}
                  className={pathname === "/PaymentApprove" ? "active" : ""}
                >
                  User Payment Details
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/ConversionRate")}
                  className={pathname === "/ConversionRate" ? "active" : ""}
                >
                  Conversion Rate
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/Dividend")}
                  className={
                    pathname === "/Dividend" ||
                      pathname === "/DividendMaster"
                      ? "active"
                      : ""
                  }
                >
                  Dividend
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/DividendYear")}
                  className={pathname === "/DividendYear" ? "active" : ""}
                >
                  Dividend Year Calculation
                </MenuItem>
              </SubMenu>

              {/* LOANS */}
              <SubMenu
                label="Loans"
                icon={<FaHandHoldingDollar />}
                defaultOpen={
                  pathname.includes("/AdminLoanIntent") ||
                  pathname.includes("/IntentView") ||
                  pathname.includes("/LoanApplications") ||
                  pathname.includes("/LoanApplicationView") ||
                  pathname.includes("/AdminLoans") ||
                  pathname.includes("/LoanView") ||
                  pathname.includes("/LoanPayout") ||
                  pathname.includes("/LoanPayoutView") ||
                  pathname.includes("/Document")
                }
              >
                <MenuItem
                  icon={<RiDraftLine />}
                  className={
                    pathname === "/AdminLoanIntent" ||
                      pathname.includes("/IntentView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/AdminLoanIntent")}
                >
                  Loan Intent
                </MenuItem>

                <MenuItem
                  icon={<RiDraftLine />}
                  className={
                    pathname === "/LoanApplications" ||
                      pathname.includes("/LoanApplicationView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/LoanApplications")}
                >
                  Loan Applications
                </MenuItem>

                <MenuItem
                  icon={<PiMoneyLight />}
                  className={
                    pathname === "/AdminLoans" ||
                      pathname.includes("/LoanView")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/AdminLoans")}
                >
                  Loans
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/LoanPayout")}
                  className={
                    pathname === "/LoanPayout" ||
                      pathname.includes("/LoanPayoutView")
                      ? "active"
                      : ""
                  }
                >
                  Loan Payment
                </MenuItem>

                {/* Documents directly under Loans */}
                <MenuItem
                  icon={<BsDatabase />}
                  onClick={() => navigate("/Documents")}
                  className={
                    pathname.includes("/DocumentMasters") ||
                      pathname.includes("/DocumentTemplates") ||
                      pathname.includes("/Documents")
                      ? "active"
                      : ""
                  }
                >
                  Documents
                </MenuItem>
              </SubMenu>


              {/* DOCUMENTS */}


              {/* REPORT */}
              <MenuItem
                icon={<TbReport />}
                onClick={() => navigate("/FinanceReport")}
                className={pathname === "/FinanceReport" ? "active" : ""}
              >
                Report
              </MenuItem>

            </Menu>
          )}


          {/* ------------------- AGENT (Role 5) -------------------- */}
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

          {/* ------------------- DIVIDEND ADMIN (Role 6) -------------------- */}
          {item.id === 6 && (
            <Menu iconShape="square" className="ClsMenu">
              <MenuItem
                onClick={() => navigate("/DividendDeclaration")}
                icon={<BsDatabase id="DividendDeclaration" />}
                className={
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
                  location.pathname === "/DividendPayout" ? "active" : ""
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
              <SubMenu
                label="Intent Approvals"
                icon={<FaFileCircleCheck />}
                defaultOpen={pathname.includes("/IntentApprovals")}
              >
                <MenuItem
                  icon={<PiClockLight />}
                  className={pathname === "/IntentApprovals/pending" ? "active" : ""}
                  onClick={() => {
                    navigate("/IntentApprovals/pending");
                    handleBackdropClick();
                  }}
                >
                  Pending
                </MenuItem>

                <MenuItem
                  icon={<PiCheckCircleLight />}
                  className={pathname === "/IntentApprovals/approved" ? "active" : ""}
                  onClick={() => {
                    navigate("/IntentApprovals/approved");
                    handleBackdropClick();
                  }}
                >
                  Approved
                </MenuItem>

                <MenuItem
                  icon={<PiXCircleLight />}
                  className={pathname === "/IntentApprovals/rejected" ? "active" : ""}
                  onClick={() => {
                    navigate("/IntentApprovals/rejected");
                    handleBackdropClick();
                  }}
                >
                  Rejected
                </MenuItem>
              </SubMenu>
            </Menu>

          )}
          {/* ------------------- GM FINANCE (Role 7) -------------------- */}
          {item.id === 7 && (
            <Menu iconShape="square" className="ClsMenu">

              {/* ---------------- Loan Approvals ---------------- */}
              <SubMenu
                label="Loan Approvals"
                icon={<FaHandHoldingDollar />}
                defaultOpen={pathname.includes("/LoanApprovals")}
              >
                <MenuItem
                  icon={<PiClockLight />}
                  className={pathname === "/LoanApprovals/pending" ? "active" : ""}
                  onClick={() => {
                    navigate("/LoanApprovals/pending");
                    handleBackdropClick();
                  }}
                >
                  Pending
                </MenuItem>

                <MenuItem
                  icon={<PiCheckCircleLight />}
                  className={pathname === "/LoanApprovals/approved" ? "active" : ""}
                  onClick={() => {
                    navigate("/LoanApprovals/approved");
                    handleBackdropClick();
                  }}
                >
                  Approved
                </MenuItem>

                <MenuItem
                  icon={<PiXCircleLight />}
                  className={pathname === "/LoanApprovals/rejected" ? "active" : ""}
                  onClick={() => {
                    navigate("/LoanApprovals/rejected");
                    handleBackdropClick();
                  }}
                >
                  Rejected
                </MenuItem>
              </SubMenu>

              {/* ---------------- Intent Approvals ---------------- */}

              <MenuItem
                icon={<FaFileCircleCheck />}
                className={
                  pathname.includes("/IntentDetails") ? "active" : ""
                }
                onClick={() => {
                  navigate("/IntentDetails");
                  handleBackdropClick();
                }}
              >
                Loan Intent
              </MenuItem>

            </Menu>
          )}


        </React.Fragment>
      ))}
    </Sidebar>
  );
};

export default SidePanel;

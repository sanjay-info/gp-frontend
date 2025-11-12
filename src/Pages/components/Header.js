import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Popover, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useSidebar } from "./SidebarContext";
import { gp_logo } from "./imageUrl";
import { AiOutlineMenuFold } from "react-icons/ai";
import useWebSocket from "./useWebSocket";
import { toast } from "react-toastify";
import { IoPerson } from "react-icons/io5";
import { PiUserList } from "react-icons/pi";

const Header = () => {
  const { handleCollapsesidebar, handleSidebarToggle } = useSidebar();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const storedItem = localStorage.getItem("Role_id");
  var role = "";

  const isMobileView = window.innerWidth <= 992;

  const { notificationMsg, setNotificationMsg } = useWebSocket();

  if (storedItem !== null && storedItem !== undefined) {
    const sortedData = JSON.parse(storedItem);

    // Ensure sortedData is an array before mapping
    if (Array.isArray(sortedData)) {
      const idArray = sortedData.map((obj) => obj.id);

      // Filter out null and undefined values from idArray
      const filteredIdArray = idArray.filter(
        (id) => id !== null && id !== undefined
      );

      // Check if there are any valid ids in filteredIdArray
      if (filteredIdArray.length > 0) {
        role = filteredIdArray.join("||");
      } else {
        role = "";
      }
    } else {
      console.log("Invalid data format in localStorage.");
    }
  }

  const handleMyprofile = () => {
    navigate("/Myprofilekyc");
    handleClosePopover();
  };

  useEffect(() => {
    if (notificationMsg) {
      console.log(location.pathname, notificationMsg);
      toast.info(notificationMsg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      if (
        location.pathname === "/HoldingTable" &&
        notificationMsg === "Your application has been verified"
      ) {
        window.location.reload();
      }
      setNotificationMsg(null);
    }
  }, [notificationMsg]);

  const handleLogout = () => {
    navigate("/");
    handleClosePopover();
    localStorage.clear();
  };

  const handlechangePassword = () => {
    navigate("/changePassworduser");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <div className="header_container">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AiOutlineMenuFold
            id={isMobileView ? "manimage" : "manimageclose"}
            className="profile_icon"
            onClick={isMobileView ? handleSidebarToggle : handleCollapsesidebar}
          />
          <img
            src={gp_logo}
            alt="no"
            className="logoimglogin d-none d-md-block"
          />
        </div>
        <div className="profile_icon_container" onClick={handleProfileClick}>
          <PiUserList className="profile_icon" />
        </div>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {role.includes("2") && (
          <>
            <Typography
              sx={{
                p: 2,
                "&:hover": {
                  backgroundColor: "lightgray",
                  cursor: "pointer",
                  fontWeight: "bold",
                },
              }}
              onClick={handleMyprofile}
            >
              My Profile
            </Typography>
          </>
        )}
        <Typography
          sx={{
            p: 2,
            "&:hover": {
              backgroundColor: "lightgray",
              cursor: "pointer",
              fontWeight: "bold",
            },
          }}
          onClick={handlechangePassword}
        >
          Change Password
        </Typography>
        <Typography
          sx={{
            p: 2,
            "&:hover": {
              backgroundColor: "lightgray",
              cursor: "pointer",
              fontWeight: "bold",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Typography>
      </Popover>
    </div>
  );
};

export default Header;

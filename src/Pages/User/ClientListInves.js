import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import "../Register.css";
import "./ClientListInves.css";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import TableOptions from "../components/TableOptions";
import { VscDebugBreakpointDataUnverified } from "react-icons/vsc";
import { Button } from "react-bootstrap";

const ClientListInves = (props) => {
  const { sideBarCollapse } = useSidebar();
  const [datalist, setDatalist] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const [investorTypes, setInvestorTypes] = useState([]);
  const { PostApi } = useAppContext();
  const [showViewPlans, setShowViewPlans] = useState(false);

  const navigate = useNavigate();

  const [noOfShares, setNoofShares] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showErrorAlert, setErrorShowAlert] = useState(false);
  const [alertErrorMessage, setErrorAlertMessage] = useState("");

  const kycVerified = JSON.parse(localStorage.getItem("kycverifiedfkflag"));

  const [token] = useState(localStorage.getItem("token"));
  const [roleId] = useState(localStorage.getItem("Role_id"));
  const userType = localStorage.getItem("UserType");
  const [userid] = useState(localStorage.getItem("user_id"));

  const [selectedRadio, setSelectedRadio] = useState({});

  const formatter = new Intl.NumberFormat("en-IN");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleErrorCloseAlert = () => {
    setErrorShowAlert(false);
    navigate("/Myprofilekyc");
  };

  useEffect(() => {
    if (roleId !== null && roleId !== "" && roleId !== undefined) {
      getInvestorDetails();
      GetallRole();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setShowViewPlans(false);
    };

    window.onpopstate = handlePopState;
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const handleLotChange = (event, index) => {
    let { value } = event.target;
    const maxValue = 25000000;
    value = value.replace(/[^0-9]/g, "");
    if (parseInt(value) > maxValue) {
      value = maxValue.toString();
    }
    const updatedData = [...investmentData];
    updatedData[index].standardUnits = value;
    const newPrice = calculatePrice(updatedData[index]);
    updatedData[index].price = newPrice;
    setInvestmentData(updatedData);
    const newNoOfShares = calculateNoOfShares(value, updatedData[index].lot);
    setNoofShares(newNoOfShares);
  };

  const handleKeyDown = (event) => {
    const invalidChars = ["e", "E", "+", "-", "."];
    const inputValue = event.target.value;

    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }

    if (inputValue.length === 0 && event.key === "0") {
      event.preventDefault();
    }
  };

  const calculatePrice = (item) => {
    if (item.standardUnits && !isNaN(item.standardUnits)) {
      const faceValue = item.acquisitionValue;
      const calculatedPrice = parseInt(item.standardUnits) * faceValue;
      return calculatedPrice;
    } else {
      return "";
    }
  };

  const calculateNoOfShares = (unit, lot) => {
    let result;
    if (!isNaN(unit) && !isNaN(lot)) {
      result = parseInt(unit) * parseInt(lot);
    } else {
      result = "";
    }
    return result;
  };

  const handleRadioChange = (idx, type) => {
    setSelectedRadio({ index: idx, type: type });
  };

  const columns = [
    {
      title: "Project Name",
      field: "clientName",
    },
    {
      title: "Status",
      field: "active",
      render: (rowData) => (
        <label style={{ color: rowData.active ? "green" : "red" }}>
          {rowData.active ? "Active" : "Inactive"}
        </label>
      ),
    },
    {
      title: "Action",
      field: "status",
      render: (rowData) => (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => rowData.active && handleView(rowData.id)}
          disabled={rowData.active === false}
        >
          View
        </button>
      ),
      cellStyle: {
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },
      sorting: false,
    },
  ];

  const getInvestorDetails = () => {
    const method = "POST";
    const url = `/client/all`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setDatalist(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const GetallRole = () => {
    const method = "POST";
    const url = `/userbond/invTypes`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setInvestorTypes(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const ViewInvestment = (clientId) => {
    const method = "POST";
    const url = `/client/bond/forUser?id=${clientId}&userId=${localStorage.getItem(
      "user_id"
    )}`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "scheme list");
        const updatedInvestmentData = response.data.data.map((item) => {
          if (!item.price) {
            const price = calculatePrice(item);
            return { ...item, price, clientId };
          }
          return { ...item, clientId };
        });
        setInvestmentData(updatedInvestmentData);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const handleView = (clickedClientId) => {
    setShowViewPlans(true);
    ViewInvestment(clickedClientId);
  };

  const handleBack = () => {
    setShowViewPlans(false);
    setSelectedRadio({});
    setInvestmentData([]);
  };

  const handlebonds = async (item, index) => {
    try {
      const kycResponse = await getUserDetailsById();

      if (selectedRadio.index !== index) {
        setShowAlert(true);
        setAlertMessage("Please select investor type (JOINT/INDIVIDUAL).");
        return;
      }

      if (!item.price || item.price === "0") {
        setShowAlert(true);
        setAlertMessage("Price should be greater than 0.");
        return;
      }

      if (parseInt(item.price) < 400000) {
        setShowAlert(true);
        setAlertMessage("Minimum investment limit is Rs.4,00,000.");
        return;
      }

      if (kycResponse?.data?.data?.kycVerified === false) {
        setErrorShowAlert(true);
        setErrorAlertMessage("Your KYC is pending. Please complete your KYC to proceed with scheme applications.");
        return;
      }

      var data = {
        ...item,
        bondId: investorTypes
          .find((type) => type.investorType === selectedRadio.type)
          .id.toString(),
        noOfShares: noOfShares,
        clientId: item.clientId,
      };

      //  ---------------- RI and NRI ------------

      if (data.id === 3) {
        navigate("/Nriociform", { state: { item: data } });
      } else {
        navigate("/Gpbond", { state: { item: data } });
      }
    } catch (error) {
      console.error("Error in handlebonds:", error);
      setErrorShowAlert(true);
      setErrorAlertMessage("An error occurred. Please try again later.");
    }
  };

  const getUserDetailsById = async () => {
    const url = `/user/id?id=${userid}`;
    const data = {};

    try {
      const response = await PostApi("POST", url, data, headers);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container">
        <div
          className={
            sideBarCollapse ? "main_content " : "main_content collapsed "
          }
        >
          {showViewPlans === false && (
            <div className="client_list_container">
              <div className="welcome_text">
                <span>Investment Schemes</span>
                <div
                  style={{
                    borderLeft: "4px solid #659DBD",
                    padding: "5px",
                    backgroundColor: "#f9f9f9", 
                    borderRadius: "4px",
                    margin: "16px 0",
                    fontSize:"14px",
                    display:"flex",
                    alignItems:"center"
                  }}
                >
                  <p style={{margin:"0px"}}>
                  Under the RISHI project, investors can choose from three unique investment schemes.
                  This scheme allows investors to purchase shares by selecting the number of shares they want and paying the corresponding amount. Two schemes offer dividends payable at the end of a 3-year period, while one scheme provides half-yearly dividends.At the end of 3 years, investors have the option to redeem their initial investment amount.
                  </p>
                </div>
              </div>
              <div className="client_table_div d-none d-lg-block">
                <MaterialTable
                  title=""
                  columns={columns}
                  data={datalist}
                  options={TableOptions()}
                />
              </div>
              <div className="client_card_div d-block d-lg-none">
                {datalist.map((item) => (
                  <div className="client_card_list">
                    <div>
                      <VscDebugBreakpointDataUnverified className="client_icon" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: "10px",
                        }}
                      >
                        <div>
                          <text style={{ fontWeight: "bolder" }}>
                            {item.clientName}
                          </text>
                        </div>
                        <div>
                          <span
                            style={{
                              fontWeight: "600",
                              color: item.active ? "green" : "red",
                            }}
                          >
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => handleView(item.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {showViewPlans === true && (
            <div className="client_list_container">
              <div className="welcome_text cenAligsp">
                <span>Golden Planet Schemes</span>
                <span
                  className="link-like"
                  onClick={() => handleBack()}
                  style={{ fontSize: "15px" }}
                >
                  Back
                </span>
              </div>
              {/* WEB */}
              <div className="client_table_div d-none d-lg-block">
                {investmentData &&
                  investmentData.map((item, index) => (
                    <div
                      className="inves_card"
                      style={{
                        marginTop: "30px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                      }}
                      key={index}
                    >
                      <div className="row">
                        <div className="col-md-3 inverscontainer">
                          <label className="projectlable">
                            {" "}
                            <label className="projectLabel">
                              {userType === "1"
                                ? "Redeemable Preference Shares"
                                : "Compulsorily Convertible Preference Shares"}
                            </label>
                          </label>
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <label className="projectlable">
                            Share Price Per Unit
                          </label>
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <label className="projectlable">
                            Units <span style={{ color: "red" }}>*</span>
                          </label>
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <label className="projectlable">
                            Price <span style={{ color: "red" }}>*</span>
                          </label>
                        </div>
                        <div className="col-md-3 inverscontainer">
                          <label className="projectlable">
                            Investor Type{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 inverscontainer">
                          <text>{item.bondName}</text>
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <text>₹ {item.acquisitionValue || 0}</text>
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <input
                            type="tel"
                            className="form-control"
                            id="unit"
                            value={item.standardUnits}
                            maxLength={9}
                            onChange={(e) => {
                              handleLotChange(e, index);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Units"
                          />
                        </div>
                        <div className="col-md-2 inverscontainer">
                          <text>₹ {formatter.format(item.price)}</text>
                        </div>
                        <div className="col-md-3 inverscontainer">
                          <div style={{ display: "flex" }}>
                            <div>
                              {["INDIVIDUAL", "JOINT"].map(
                                (type) =>
                                  item[type.toLowerCase()] && (
                                    <div
                                      className="form-check form-check-inline"
                                      key={type}
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        value={type}
                                        checked={
                                          selectedRadio.index === index &&
                                          selectedRadio.type === type
                                        } // Only check the radio button if it's the selected one globally
                                        onChange={() =>
                                          handleRadioChange(index, type)
                                        }
                                      />
                                      <label className="form-check-label">
                                        {type}
                                      </label>
                                    </div>
                                  )
                              )}
                            </div>
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handlebonds(item, index)}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="client_card_div d-block d-lg-none">
                {investmentData.map((item, index) => {
                  return (
                    <div className="client_card_list">
                      <div>
                        <VscDebugBreakpointDataUnverified className="client_icon" />
                      </div>
                      <div className="client_card_whole_div">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "10px",
                          }}
                        >
                          <div>
                            <text style={{ fontWeight: "bolder" }}>
                              {" "}
                              {userType === "1"
                                ? "Redeemable Preference Shares"
                                : "Compulsorily Convertible Preference Shares"}
                            </text>
                            <div>
                              <text>{item.bondName}</text>
                            </div>
                          </div>
                          <div>
                            <label className="projectlable">
                              Share Price Per Unit
                            </label>
                            <div>
                              <span className="text-lg">
                                ₹ {item.acquisitionValue}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="projectlable">
                              Units <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              id="unit"
                              value={item.standardUnits}
                              maxLength={9}
                              onChange={(e) => {
                                handleLotChange(e, index);
                              }}
                              onKeyDown={handleKeyDown}
                              placeholder="Units"
                            />
                          </div>
                          <div>
                            <label className="projectlable">
                              Price <span style={{ color: "red" }}>*</span>
                            </label>
                            <div>
                              <text>₹ {formatter.format(item.price)}</text>
                            </div>
                          </div>
                          <div>
                            <label className="projectlable">
                              Investor Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <div>
                              {["INDIVIDUAL", "JOINT"].map(
                                (type) =>
                                  item[type.toLowerCase()] && (
                                    <div
                                      className="form-check form-check-inline"
                                      key={type}
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        value={type}
                                        checked={
                                          selectedRadio.index === index &&
                                          selectedRadio.type === type
                                        } // Only check the radio button if it's the selected one globally
                                        onChange={() =>
                                          handleRadioChange(index, type)
                                        }
                                      />
                                      <label className="form-check-label">
                                        {type}
                                      </label>
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => handlebonds(item, index)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {showAlert && (
          <Alert
            title={"Alert"}
            msg={alertMessage}
            open={true}
            type={"error"}
            onClose={handleCloseAlert}
          />
        )}
        {showErrorAlert && (
          <Alert
            title={"Alert"}
            msg={alertErrorMessage}
            open={true}
            type={"info"}
            onClose={handleErrorCloseAlert}
          />
        )}
      </div>
    </div>
  );
};

export default ClientListInves;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import "../Register.css";
import { useAppContext } from "../components/AppProvider";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Button, Collapse, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import Alert from "../components/Alert";
import moment from "moment";

const ConversionRate = () => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [token] = useState(localStorage.getItem("token"));
  const [userid] = useState(localStorage.getItem("user_id"));
  const [datalist, setDatalist] = useState([]);

  // const
  const [conversionRate, setConversionRate] = useState("");
  const [conversionDate, setConversionDate] = useState("");

  const [userAlert, setUserAlert] = useState(false);
  const [alertTitle, setAlerttitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertClose, setAlertClose] = useState(() => null);

  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    getConversionRate();
    getCurrentDate();
  }, []);

  const getConversionRate = (item) => {
    const method = "POST";
    const url = `/dividend/conversion/all`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response.data, "Converstion Rate");
        if (response.data) {
          setDatalist(response.data.data);
        } else {
          setDatalist([]);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const getCurrentDate = (item) => {
    const method = "POST";
    const url = `/dividend/getTodayDate`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "getCurrentDate");
        setConversionDate(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const handleSave = () => {
    if (!conversionDate) {
      setUserAlert(true);
      setAlerttitle("Alert");
      setAlertType("error");
      setAlertMsg("Conversion date is required.");
      setAlertClose(() => () => setUserAlert(false));
      return;
    }

    if (!conversionRate) {
      setUserAlert(true);
      setAlerttitle("Alert");
      setAlertType("error");
      setAlertMsg("Conversion rate is required.");
      setAlertClose(() => () => setUserAlert(false));
      return;
    }
    const url = "/dividend/conversion/save";
    const data = {
      date: conversionDate,
      conversionRate: parseFloat(conversionRate),
    };
    PostApi("POST", url, data, headers)
      .then((response) => {
        console.log(response, "response");
        if (response.data.status === 200) {
          setUserAlert(true);
          setAlerttitle("Success")
          setAlertType("success");
          setAlertMsg(response.data.message);
          // setAlertClose(() => () => setUserAlert(false), window.location.reload())
          setAlertClose(() => () => {
            setUserAlert(false);
            window.location.reload();
          });
        } else {
          setUserAlert(true);
          setAlerttitle("Alert");
          setAlertType("error");
          setAlertMsg(response.data.message);
          setAlertClose(() => () => setUserAlert(false));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const Schemes = [
    {
      title: "S.No",
      field: "index",
      render: (rowData) => rowData.tableData.index + 1,
    },
    {
      title: "Conversion Date",
      render: (rowData) => (
        <text>{moment(rowData.date).format("DD-MM-YYYY")}</text>
      ),
    },
    {
      title: "Conversion Rate",
      field: "conversionRate",
    },
  ];

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
          <div className="Summary_card">
            <div className="divided_spc">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "5px",
                }}
              >
                <div
                  className="welcome_text"
                  style={{ paddingLeft: "8px", paddingBottom: "20px" }}
                >
                  <span>Conversion Rate</span>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      CONVERSION DATE <span className="required_star">*</span>
                    </label>
                    <DatePicker
                      showIcon
                      showYearDropdown
                      scrollableYearDropdown
                      selected={conversionDate}
                      disabled
                      // onChange={(date) => setLastPayment(moment(date).format("YYYY-MM-DD"))}
                      className="inputbond"
                      placeholderText="dd-mm-yyyy"
                      dateFormat="dd-MM-yyyy"
                      minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      {" "}
                      CONVERSION RATE <span className="required_star">
                        *
                      </span>{" "}
                    </label>
                    <input
                      id="conversionrate"
                      type="tel"
                      placeholder="Enter Conversion Rate"
                      className="inputbond"
                      value={conversionRate}
                      maxLength={7}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits and one dot
                        if (/^\d*\.?\d*$/.test(value)) {
                          setConversionRate(value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-2 col-12">
                  <button className="conversion_btn" onClick={handleSave}>
                    Submit
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></div>
              </div>
              <div style={{ marginTop: "3%" }}>
                <MaterialTable
                  style={{ width: "100%" }}
                  title=""
                  columns={Schemes}
                  data={datalist}
                  options={{ ...TableOptions() }}
                />
              </div>
            </div>
            <Alert
              title={alertTitle}
              msg={alertMsg}
              open={userAlert}
              type={alertType}
              onClose={alertClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionRate;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import "../Register.css";
import { useAppContext } from "../components/AppProvider";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import DatePicker from "react-datepicker";
import Alert from "../components/Alert";
import moment from "moment";

const DividendYear = () => {
    const { PostApi, GetApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const [datalist, setDatalist] = useState([]);

    const [dividendDate, setDividendDate] = useState("");
    const [dividendNoOfDays, setDividendNoOfDays] = useState("")

    const [userAlert, setUserAlert] = useState(false);
    const [alertTitle, setAlerttitle] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);
    const [alertConfirm, setAlertConfirm] = useState(() => null);

    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        getDividendYear();
    }, []);

    const getDividendYear = (item) => {
        const method = "Get";
        const url = `/dividend/calculation/getYear`;
        const data = null;
        GetApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "Dividend Year");
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

    const handleSave = () => {
        if (!dividendDate) {
            setUserAlert(true);
            setAlerttitle("Alert");
            setAlertType("error");
            setAlertMsg("Dividend To Date is required.");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        if (!dividendNoOfDays) {
            setUserAlert(true);
            setAlerttitle("Alert");
            setAlertType("error");
            setAlertMsg("No Of Days is required.");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        setUserAlert(true);
        setAlerttitle("Info");
        setAlertType("yesorno");
        setAlertMsg("Are you sure you want to proceed? Once the dividend year calculation is saved, the entered values cannot be changed.");
        setAlertClose(() => () => setUserAlert(false));
        setAlertConfirm(() => () => saveDividendYear())
    };

    const saveDividendYear = () => {
        const url = "/dividend/calculation/saveYear";
        const data = {
            date: dividendDate,
            noOfDays: parseInt(dividendNoOfDays),
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
    }

    const Schemes = [
        {
            title: "S.No",
            field: "index",
            render: (rowData) => rowData.tableData.index + 1,
        },
        {
            title: "Dividend To Date",
            render: (rowData) => (
                <text>{moment(rowData.date).format("DD-MM-YYYY")}</text>
            ),
        },
        {
            title: "No of Days",
            field: "noOfDays",
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
                                    <span>Dividend Year Calculation</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-12">
                                    <div className="responsive-column">
                                        <label className="bond_label">
                                            Dividend To Date <span className="required_star">*</span>
                                        </label>
                                        <DatePicker
                                            showIcon
                                            showYearDropdown
                                            scrollableYearDropdown
                                            selected={dividendDate}
                                            onChange={(date) => setDividendDate(moment(date).format("YYYY-MM-DD"))}
                                            className="inputbond"
                                            placeholderText="dd-mm-yyyy"
                                            dateFormat="dd-MM-yyyy"
                                            minDate={new Date()}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <div className="responsive-column">
                                        <label className="bond_label">
                                            No Of Days
                                            <span className="required_star">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="conversionrate"
                                            type="tel"
                                            placeholder="Enter No Of Days"
                                            className="inputbond"
                                            value={dividendNoOfDays}
                                            maxLength={5}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow only digits and one dot
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    setDividendNoOfDays(value);
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
                            onConfirm={alertConfirm}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DividendYear;
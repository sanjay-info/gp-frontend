import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import "../Register.css";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { Container, Row, Col } from "react-bootstrap";
import TableOptions from "../components/TableOptions";
import { Modal } from "react-bootstrap";
import moment from "moment/moment";
import { blue } from "@mui/material/colors";

const Holding = (props) => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [datalist, setDatalist] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userSchemesid, setuserSchemesid] = useState("");
  const [userid] = useState(localStorage.getItem("user_id"));
  const [roleId] = useState(localStorage.getItem("Role_id"));
  const [token] = useState(localStorage.getItem("token"));
  const [userType] = useState(localStorage.getItem("UserType"));
  const [emptyMsg, setemptyMsg] = useState("");

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    // getMyDocuments();
    getMyHolding();
  }, []);

  const navigate = useNavigate();

  // const columns = [
  //     {
  //         title: 'Form No',
  //         field: 'userBondDetails.formNo'
  //     },
  //     {
  //         title: 'Alloted Date',
  //         field: 'dateOfAllotment',
  //         render: rowData => moment(rowData.dateOfAllotment).format('DD-MM-YYYY')
  //     },
  //     {
  //         title: 'Schemes',
  //         field: 'userBondDetails.clientBondDetails.bondDescription'
  //     },
  //     {
  //         title: 'Shares Alloted',
  //         field: 'noOfSharesAlloted'
  //     },
  //     // {
  //     //     title: 'Message',
  //     //     field: 'remarks'
  //     // },
  //     {
  //         title: 'View Divided',
  //         field: 'paymentStatus',
  //         render: rowData => (
  //             <button
  //                 className="btn btn-primary"
  //                 type="button"
  //                 onClick={() => getHoldingDocumentView(rowData)}
  //             >
  //                 View
  //             </button>
  //         )
  //     },
  //     {
  //         title: 'Downloadable Documents',
  //         field: 'actions',
  //         render: rowData => (
  //             <div style={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>

  //                 <button
  //                     className="btn btn-primary"
  //                     disabled={!(
  //                         rowData.certificateUploaded
  //                     )}
  //                     onClick={() => DocumentDownload(rowData.userBondDetails.id)}
  //                 >
  //                     Certificate
  //                 </button>
  //             </div>
  //         ),
  //         cellStyle: {
  //             textAlign: 'center'
  //         },
  //         headerStyle: {
  //             textAlign: 'center'
  //         },
  //         sorting: false,
  //     },
  // ];
  const columns = [
    {
      title: "Form Number",
      field: "formNo",
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Investor Type",
      field: "investorType.investorType",
    },
    {
      title: "Shares Details",
      field: "clientBondDetails.bondName",
    },
    {
      title: "Form Status",
      field: "paymentStatus",
      render: (rowData) => (
        <span
          style={{
            color:
              rowData.paymentStatus &&
              rowData.paymentStatus.paymentStatus === "PENDING"
                ? "orange"
                : rowData.paymentStatus &&
                  rowData.paymentStatus.paymentStatus === "SUCCESS"
                ? "green"
                : "red",
          }}
        >
          {rowData.paymentStatus ? rowData.paymentStatus.paymentStatus : "N/A"}
        </span>
      ),
    },
    {
      title: "View",
      render: (rowData) => (
        <button
          className="btn btn-primary"
          onClick={() => getHoldingDocumentView(rowData)}
        >
          View
        </button>
      ),
    },
  ];
  const getMyHolding = () => {
    const method = "POST";
    const url = `/userbond/holding?userId=${userid}`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "holding");
        if (response.data?.data != null || response.data?.data !== undefined) {
          setDatalist(response.data.data);
        } else {
          setDatalist([]);
        }
        if (response.data.status === 400) {
          setemptyMsg(
            "Manage your allocated shares, access documents, and track your earnings"
          );
        } else {
          setemptyMsg(
            "Your investments will show up here once you select a scheme and make an investment."
          );
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  // const getMyDocuments = () => {
  //     const method = 'POST';
  //     const url = `/dividend/user/allocation?id=${userid}`;
  //     const data = {};
  //     PostApi(method, url, data, headers)
  //         .then((response) => {
  //             console.log(response.data.data, "holding")
  //             setDatalist(response.data.data);
  //             // setuserSchemesid(response.data.data[2].userBondDetails.id);
  //         })
  //         .catch((error) => {
  //             console.log("Error searching user:", error);
  //         });
  // }

  // const DocumentDownload = (userSchemesid) => {
  //     setLoading(true);
  //     const axiosConfig = {
  //         responseType: 'arraybuffer',
  //         headers: {
  //             'Accept': 'application/json',
  //             Authorization: `Bearer ${token}`
  //         }
  //     };
  //     axios.post(`${baseUrl}/userbond/getBondPdf?id=${userSchemesid}`, null, axiosConfig)
  //         .then((response) => {
  //             if (!response.data || response.data.byteLength === 0) {
  //                 setShowAlert(true);
  //                 setAlertMessage("PDF is not uploaded. Please contact the finance team.")
  //                 return;
  //             }
  //             const blob = new Blob([response.data], { type: 'application/pdf' });
  //             const url = window.URL.createObjectURL(blob);
  //             const link = document.createElement('a');
  //             link.href = url;
  //             link.setAttribute('download', 'Golden Planet_Certificate.pdf');
  //             document.body.appendChild(link);
  //             link.click();
  //             document.body.removeChild(link);
  //         })
  //         .catch((error) => {
  //             console.log('Error fetching PDF:', error);
  //         })
  //         .finally(() => {
  //             setLoading(false);
  //         });
  // };

  const getHoldingDocumentView = (rowData) => {
    navigate("/ViewHoldingDetails", { state: { rowData: rowData.id } });
  };
  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container ">
        <div
          className={
            sideBarCollapse ? "main_content " : "main_content collapsed "
          }
        >
          <div className="Summary_card">
            <div>
              <div
                className="welcome_text"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Holding Documents</span>
              </div>
              <div style={{ marginTop: "20px" }} className="d-none d-lg-block">
                <MaterialTable
                  style={{ width: "100%" }}
                  title=""
                  columns={columns}
                  data={datalist}
                  options={TableOptions()}
                  localization={{
                    body: {
                      emptyDataSourceMessage: emptyMsg,
                    },
                  }}
                />
              </div>
              {/* Mobile View */}
              <div className="mt-4 d-block d-lg-none">
                {!datalist ||
                (Array.isArray(datalist) && datalist.length === 0) ||
                (typeof datalist === "object" &&
                  !Array.isArray(datalist) &&
                  Object.keys(datalist).length === 0) ? (
                  <p>No records to display</p>
                ) : (
                  (datalist || []).map((item) => {
                    return (
                      <Row key={item.id}>
                        <Col xs={12} md={8} lg={12}>
                          <div
                            className="p-3"
                            style={{
                              borderRadius: "10px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              backgroundColor: "#fff",
                              marginBottom: "5%",
                            }}
                          >
                            <div
                              style={{
                                borderTop: "5px solid #274568",
                                borderRadius: "10px 10px 0 0",
                              }}
                            />
                            <div className="p-3">
                              <p
                                className="text-uppercase mb-2"
                                style={{ fontSize: "12px", color: "#999" }}
                              >
                                {item.clientBondDetails.bondDescription}
                              </p>
                              <h5
                                style={{ fontWeight: "bold", fontSize: "20px" }}
                              >
                                {item.investorType.investorType}
                              </h5>
                              <div className="holding_mbl">
                                <p style={{ margin: "0" }}>{item.name}</p>
                              </div>
                              <div className="holding_mbl">
                                <p style={{ margin: "0" }}>{item.formNo}</p>
                              </div>
                              <div className="holding_mbl">
                                <p style={{ fontSize: "13px", margin: "0" }}>
                                  Payment Status:{" "}
                                  <span
                                    style={{
                                      color:
                                        item.paymentStatus &&
                                        item.paymentStatus.paymentStatus ===
                                          "PENDING"
                                          ? "orange"
                                          : item.paymentStatus &&
                                            item.paymentStatus.paymentStatus ===
                                              "SUCCESS"
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {item.paymentStatus
                                      ? item.paymentStatus.paymentStatus
                                      : "N/A"}
                                  </span>
                                </p>
                              </div>
                              <div className="holding_mbl">
                                <label style={{ fontSize: "13px" }}>
                                  Update:
                                  <span
                                    style={{
                                      marginLeft: "4px",
                                      color: "blue",
                                    }}
                                    onClick={() => getHoldingDocumentView(item)}
                                  >
                                    View/Update
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        {showAlert && (
          <Alert
            title={""}
            msg={alertMessage}
            open={true}
            type={"error"}
            onClose={handleCloseAlert}
          />
        )}
        <div>
          <Modal className="loader_modal" centered show={loading}>
            <RotatingLines
              strokeColor="#659DBD"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={loading}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Holding;

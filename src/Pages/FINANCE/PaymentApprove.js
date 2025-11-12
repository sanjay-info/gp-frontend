import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import TableOptions from "../components/TableOptions";
import { Container, Row, Col } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

const PaymentApprove = () => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [datalist, setDatalist] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [approvalStatus, setApprovalStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();

  useEffect(() => {
    getFilterList();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleSchemeSelect = (item) => {
    setSelectedScheme(item);
    getUserDetails(item, approvalStatus);
  };

  const getUserDetails = (selectedScheme, status) => {
    const method = "POST";
    const url =
      "/userbond/forPaymentVerify?id=" +
      selectedScheme.value +
      "&status=" +
      status.value;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        if (response.data.data) {
          console.log(
            response.data.data.filter((e) => e.formNo === "FN-00077")
          );
          setDatalist(response.data.data);
        } else {
          setDatalist([]);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getFilterList = () => {
    const method = "POST";
    const url = "/client/all";
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        const list = response.data.map((item) => ({
          value: item.id,
          label: item.clientName,
        }));
        setSchemeList(list);
        setSelectedScheme(list[0]);
        setApprovalStatus({ value: 2, label: "Approval Pending" });
        getUserDetails(list[0], { value: 2, label: "Approval Pending" });
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const navigate = useNavigate();
  const handleView = (id) => {
    navigate("/ChckFinancepayment", { state: { id: id } });
  };

  const columns = [
    {
      title: "Form Number",
      field: "formNo",
      sortable:true
    },
    {
      title: "User Name",
      field: "name",
    },
    {
      title: "Project",
      field: "clientDetails.clientName",
    },
    {
      title: "Investor Type",
      field: "investorType.investorType",
    },
    {
      title: "User Type",
      field: "userType",
    },
    {
      title: "Shares Type",
      field: "clientBondDetails.bondName",
    },
    {
      title: "Form Status",
      field: "paymentStatus.paymentStatus",
      render: (rowData) => (
        <span
          style={{
            color:
              rowData.paymentStatus.paymentStatus === "SUCCESS"
                ? "green"
                : "orange",
          }}
        >
          {rowData.paymentStatus.paymentStatus}
        </span>
      ),
    },
    {
      title: "Action",
    //   field: "createdDate",
      render: (rowData) => (
        <button
          className="btn btn-primary"
          onClick={() => handleView(rowData.id)}
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

  const approvalOptions = [
    { value: 2, label: "Approval Pending" },
    { value: 1, label: "Approved" },
    { value: 3, label: "Rejected" },
  ];

  const handleApprovalChange = (selectedOption) => {
    setApprovalStatus(selectedOption);
    getUserDetails(selectedScheme, selectedOption);
  };

  const filteredData = datalist.filter(
    (item) =>
      item.formNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentStatus.paymentStatus
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.investorType.investorType
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container">
        <div
          className={
            sideBarCollapse ? "main_content" : "main_content collapsed"
          }
        >
          <div className="Summary_card">
            <div className="welcome_text">
              <span>User Payment Details</span>
            </div>
            <div style={{ paddingTop: "20px", display: "flex", gap: "20px" }}>
              <Select
                options={schemeList}
                value={selectedScheme}
                onChange={handleSchemeSelect}
                placeholder="Select Scheme"
              />
              <Select
                options={approvalOptions}
                value={approvalStatus}
                onChange={handleApprovalChange}
                placeholder="Select Approval Status"
              />
            </div>
            <div className="d-block d-lg-none mt-3">
              <div className="input_contanier">
                <div className="input_icons">
                  <CiSearch></CiSearch>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="srchinput_box"
                />
              </div>
            </div>
            <div style={{ paddingTop: "20px" }} className="d-none d-lg-block">
              <MaterialTable
                style={{ width: "100%" }}
                title=""
                columns={columns}
                data={datalist}
                options={TableOptions()}
              />
            </div>
            <div className="mt-4 d-block d-lg-none">
              {filteredData.map((item) => {
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
                            {item.name}
                          </p>
                          <p
                            className="text-uppercase mb-2"
                            style={{ fontSize: "12px", color: "#999" }}
                          >
                            {item.clientBondDetails.bondDescription}
                          </p>
                          <p
                            className="text-uppercase mb-2"
                            style={{ fontSize: "12px", color: "#C100C1" }}
                          >
                            {item.userType}
                          </p>
                          <h5 style={{ fontWeight: "bold", fontSize: "20px" }}>
                            {item.investorType.investorType}
                          </h5>
                          <div className="holding_mbl">
                            <p style={{ margin: "0" }}>{item.formNo}</p>
                          </div>
                          <div className="holding_mbl">
                            <p style={{ fontSize: "13px", margin: "0" }}>
                              Payment Status:{" "}
                              <span
                                style={{
                                  color:
                                    item.paymentStatus.paymentStatus ===
                                    "SUCCESS"
                                      ? "green"
                                      : "orange",
                                }}
                              >
                                {item.paymentStatus.paymentStatus}
                              </span>
                            </p>
                          </div>

                          <Row className="align-items-center">
                            <Col xs="auto">
                              <CiFileOn
                                style={{
                                  marginRight: "5px",
                                  marginBottom: "2px",
                                }}
                              />
                              <span
                                onClick={() => handleView(item.id)}
                                style={{
                                  color: "#007bff",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                View
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentApprove;

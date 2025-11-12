import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import Select from "react-select";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import DatePicker from "react-datepicker";
import "./declaration.css";
import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import Alert from "../components/Alert";

const DividendPayout = () => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [userid] = useState(localStorage.getItem("user_id"));
  const [token] = useState(localStorage.getItem("token"));

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState({
    value: false,
    label: "Not Paid",
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [userTypeList, setUserTypeList] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null);

  const [dividendData, setDividendData] = useState([]);

  const [dividendIds, setDividendIds] = useState([]);

  const [payoutDate, setPayoutDate] = useState(null);
  const [modeOfPayment, setModeofPayment] = useState("");

  const [payoutMsg, setPayoutMsg] = useState("");

  const [dividendModalOpen, setDividendModalOpen] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => null);
  const [alertClose, setAlertClose] = useState(() => null);

  const [tableKey, setTableKey] = useState(0);

  const [modeOfPaymentList, setModeOfPaymentList] = useState([]);

  useEffect(() => {
    getProjectList();
    getAllUserListTypes();
  }, []);

  useEffect(() => {
    if (selectedScheme) {
      getDividendList(selectedScheme.value);
    }
  }, [fromDate, toDate, selectedScheme, selectedStatus]);

  const getProjectList = () => {
    const method = "POST";
    const url = "/client/all";
    PostApi(method, url, null, headers)
      .then((response) => {
        const list = response.data.map((item) => ({
          value: item.id,
          label: item.clientName,
        }));
        setProjectList(list);
        if (list.length > 0) {
          setSelectedProject(list[0]);
        }
      })
      .catch((error) => {
        console.log("Error fetching project list:", error);
      });
  };

  const handleProjectChange = (item) => {
    setSelectedProject(item);
  };

  const getAllUserListTypes = () => {
    const url = "/user/type/all";
    PostApi("POST", url)
      .then((response) => {
        const transformedUserTypes = response.data.map((userListType) => ({
          value: userListType.id,
          label: userListType.userType,
        }));
        setUserTypeList(transformedUserTypes);
        // getSchemesList();
      })
      .catch((error) => {
        console.log("Error fetching user types:", error);
      });
  };

  const getSchemesList = (item) => {
    const method = "POST";
    const url = `/client/byUserType?userTypeId=${item}&clientId=${selectedProject.value}`;
    PostApi(method, url, null, headers)
      .then((response) => {
        const list = response.data.data.map((item) => ({
          value: item.id,
          label: item.bondName,
        }));
        setSchemeList(list);
      })
      .catch((error) => {
        console.log("Error fetching schemes list:", error);
      });
  };

  const handleSchemeChange = (item) => {
    setSelectedScheme(item);
    setFromDate(null);
    setToDate(null);
    setSelectedStatus({ value: false, label: "Not Paid" });
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleStatusChange = (item) => {
    setSelectedStatus(item);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleUserTypeChange = (item) => {
    setSelectedUserType(item);
    setSelectedScheme(null);
    setDividendData([]);
    getSchemesList(item.value);
    setTableKey((prevKey) => prevKey + 1);
  };

  const getDividendList = (schemeId) => {
    const formattedFromDate = fromDate
      ? moment(fromDate).format("YYYY-MM-DD")
      : null;
    const formattedToDate = toDate ? moment(toDate).format("YYYY-MM-DD") : null;

    let url = `/dividend/getAllDividendPayouts?schemeId=${schemeId}`;

    if (selectedStatus !== null) {
      const status = selectedStatus.value;
      url += `&paid=${status}`;
    }

    if (formattedFromDate) {
      url += `&fromDate=${encodeURIComponent(formattedFromDate)}`;
    }
    if (formattedToDate) {
      url += `&toDate=${encodeURIComponent(formattedToDate)}`;
    }

    const method = "POST";
    PostApi(method, url, null, headers)
      .then((response) => {
        console.log("Dividend List:", response);
        if (response.data.status === 200) {
          setDividendData(
            response.data.data.map((item) => ({
              ...item,
              utrNo:
                item.utrNo !== null ? item.utrNo : "Enter the transaction no",
            }))
          );
        } else {
          setDividendData([]);
        }
      })
      .catch((error) => {
        console.log("Error fetching dividend list:", error);
      });
  };

  const columns = [
    {
      title: "Applicant",
      field: "userBondDetails.name",
      editable: "never",
    },
    {
      title: "Application No",
      field: "userBondDetails.formNo",
      editable: "never",
    },
    {
      title: "Dividend Date",
      field: "dividend.fixedDividendDate",
      render: (rowData) =>
        rowData.dividend.fixedDividendDate
          ? moment(rowData.dividend.fixedDividendDate).format("DD-MM-YYYY")
          : "",
      editable: "never",
    },
    {
      title: "Dividend Amount (Before TDS)",
      field: "dividendAmount",
      render: (rowData) =>
        rowData.dividendAmount
          ? `₹ ${rowData.dividendAmount.toLocaleString("en-IN")}`
          : "",
      editable: "never",
    },
    {
      title: "TDS Amount",
      field: "tdsDeducted",
      render: (rowData) =>
        rowData.tdsDeducted
          ? `₹ ${rowData.tdsDeducted.toLocaleString("en-IN")}`
          : "",
      editable: "never",
    },
    {
      title: "Dividend Amount (After TDS)",
      field: "totalAmountToPay",
      render: (rowData) =>
        rowData.totalAmountToPay
          ? `₹ ${rowData.totalAmountToPay.toLocaleString("en-IN")}`
          : "",
      editable: "never",
    },
    {
      title: (
        <span>
          Transaction No <span className="required_star">*</span>
        </span>
      ),
      field: "utrNo",
      editComponent: (props) => (
        <input
          type="text"
          value={
            props.value !== undefined &&
            props.value !== "Enter the transaction no"
              ? props.value
              : ""
          }
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Enter transaction no"
        />
      ),
    },
  ];

  const handleSelectionChange = (rows) => {
    const selectedIdsArray = rows.map((row) => ({
      id: row.id,
      utrNo: row.utrNo,
    }));

    setDividendIds(selectedIdsArray);
  };

  const openDividendPayout = () => {
    console.log(dividendIds, "kjkkj");
    const missingTransactionNoIndex = dividendIds.findIndex(
      (row) => !row.utrNo || row.utrNo === ""
    );

    if (missingTransactionNoIndex !== -1) {
      setUserAlert(true);
      setAlertTitle("Info");
      setAlertMsg(
        `Please enter the transaction number on row ${
          missingTransactionNoIndex + 1
        }`
      );
      setAlertType("error");
      setAlertClose(() => () => setUserAlert(false));
    } else {
      getModeofPayment();
      setDividendModalOpen(true);
    }
  };

  const closeDividendModal = () => {
    setPayoutDate(null);
    setModeofPayment("");
    setFormErrors({});
    setDividendModalOpen(false);
  };

  const saveDividend = () => {
    const errors = {};
    if (payoutDate === null) {
      errors.payoutDate = "Please Select the Payout Date";
    }

    if (modeOfPayment === "") {
      errors.modeOfPayment = "Please Select the Mode of Payment";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const method = "POST";
      const url = `/dividend/addPayoutDate`;
      const data = {
        dividendRequestDtoDetails: dividendIds,
        payoutDate: moment(payoutDate).format("YYYY-MM-DD"),
        modeOfPayment: modeOfPayment,
        payoutMessage: payoutMsg,
      };

      PostApi(method, url, data, headers)
        .then((response) => {
          if (response.data.status === 200) {
            closeDividendModal();
            setUserAlert(true);
            setAlertTitle("Success");
            console.log(response.data.errors);
            if (response.data.errors && response.data.errors.length > 0) {
              setAlertMsg(
                (
                  <div>
                    Dividend Paid Successfully <br></br>
                    Some Dividends are not paid because of the following reasons
                    <br></br>
                    {response.data.errors.map(
                      (item, index) => <><span>{index + 1}. {item}</span><br/></>
                    )}
                  </div>
                )
                // `Dividend Paid Successfully.\n Some Dividends are not paid because of the following reasons \n${formattedItems}`
              );
            } else {
              setAlertMsg(`Dividend Paid Successfully`);
            }
            // setAlertMsg("Dividend Paid Successfully.");
            setAlertType("success");
            setAlertClose(() => () => window.location.reload());
          } else {
            setUserAlert(true);
            setAlertTitle("Alert");
            setAlertMsg("Something went wrong,try again.");
            setAlertType("error");
            setAlertClose(() => () => window.location.reload());
          }
        })
        .catch((error) => {
          console.log("Error fetching dividend list:", error);
        });
    }
  };

  const filterOptions = [
    { value: true, label: "Paid" },
    { value: false, label: "Not Paid" },
  ];

  const getModeofPayment = () => {
    const method = "POST";
    const url = `/userbond/modeOfPayment`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setModeOfPaymentList(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

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
              <span>Dividend Payout</span>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                width: "100%",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "20px",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <Select
                    options={projectList}
                    value={selectedProject}
                    onChange={handleProjectChange}
                    placeholder="Select Project"
                  />
                  <Select
                    options={userTypeList}
                    value={selectedUserType}
                    onChange={handleUserTypeChange}
                    placeholder="Select User Type"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <Select
                    options={schemeList}
                    value={selectedScheme}
                    onChange={handleSchemeChange}
                    placeholder="Select Schemes"
                  />
                  <Select
                    options={filterOptions}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    placeholder="Select Status"
                  />
                </div>
              </div>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "end",
                }}
              >
                <div
                  className="input_contanier filtter_container"
                  style={{ margin: "0px", width: "35%" }}
                >
                  <label className="login_label">From Date</label>
                  <DatePicker
                    showIcon
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    showYearDropdown
                    scrollableYearDropdown
                    className="input_box"
                    placeholderText="dd-mm-yyyy"
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                    maxDate={new Date()}
                  />
                </div>
                <div
                  className="input_contanier filtter_container"
                  style={{ margin: "0px", width: "35%" }}
                >
                  <label className="login_label">To Date</label>
                  <DatePicker
                    showIcon
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    showYearDropdown
                    scrollableYearDropdown
                    className="input_box"
                    placeholderText="dd-mm-yyyy"
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date(fromDate)}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>

            <div>
              <MaterialTable
                key={tableKey}
                style={{ marginTop: "30px" }}
                title=""
                columns={columns}
                data={dividendData}
                options={{
                  ...TableOptions(),
                  search: false,
                  toolbar: false,
                  selection: true,
                  selectionProps: (rowData) => ({
                    disabled:
                      rowData.utrNo === "" ||
                      rowData.utrNo === "Enter the transaction no" ||
                      rowData.paid === true,
                    color: "primary",
                  }),
                }}
                onSelectionChange={handleSelectionChange}
                cellEditable={{
                  isCellEditable: (rowData) => rowData.paid !== true,
                  onCellEditApproved: (
                    newValue,
                    oldValue,
                    rowData,
                    columnDef
                  ) =>
                    new Promise((resolve, reject) => {
                      if (!rowData || !rowData.tableData) {
                        reject();
                        return;
                      }

                      const updatedData = [...dividendData];

                      const index = updatedData.findIndex(
                        (row) => row.id === rowData.id
                      );

                      if (index === -1) {
                        reject();
                        return;
                      }

                      updatedData[index] = {
                        ...updatedData[index],
                        [columnDef.field]: newValue,
                      };

                      setDividendData(updatedData);

                      resolve();
                    }),
                }}
              />

              {dividendIds.length != 0 && (
                <div className="declare_btn_container">
                  <button
                    type="button"
                    className="declare_btn"
                    onClick={() => openDividendPayout()}
                  >
                    Payout Dividend
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal size="modal-dialog modal-lg" centered show={dividendModalOpen}>
        <Modal.Header>
          <div className="modal_subhead">
            <span className="modal_head_txt">Dividend Payout</span>
            <AiOutlineClose
              className="moda_closel_icon"
              onClick={() => closeDividendModal()}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_body_container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div className="input_contanier" style={{ width: "45%" }}>
                <label className="login_label" style={{ paddingBottom: "6px" }}>
                  Payout Date <span className="required_star">*</span>
                </label>
                <DatePicker
                  showIcon
                  selected={payoutDate}
                  onChange={(date) => setPayoutDate(date)}
                  showYearDropdown
                  scrollableYearDropdown
                  className="input_box"
                  placeholderText="dd-mm-yyyy"
                  dateFormat="dd-MM-yyyy"
                  minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                  maxDate={new Date()}
                />
                {formErrors.payoutDate && (
                  <div className="field_form_alert">
                    <span>{formErrors.payoutDate}</span>
                  </div>
                )}

                <div style={{ marginTop: "10px" }}>
                  <label
                    className="login_label"
                    style={{ paddingBottom: "6px" }}
                  >
                    Mode of Payment <span className="required_star">*</span>
                  </label>

                  <select
                    id="ModeofPayment"
                    className="input_box"
                    style={{ padding: "5px" }}
                    value={modeOfPayment}
                    onChange={(e) => {
                      setModeofPayment(e.target.value);
                    }}
                  >
                    <option value="" disabled selected>
                      Select Mode Of Payment
                    </option>
                    {modeOfPaymentList.map((paymentMethod, i) => (
                      <option key={i} value={paymentMethod}>
                        {paymentMethod}
                      </option>
                    ))}
                  </select>
                  {formErrors.modeOfPayment && (
                    <div className="field_form_alert">
                      <span>{formErrors.modeOfPayment}</span>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <label
                    className="login_label"
                    style={{ paddingBottom: "6px" }}
                  >
                    Special Note
                  </label>
                  <textarea
                    className="input_box"
                    style={{ height: "120px", padding: "5px" }}
                    rows={3}
                    maxLength={250}
                    placeholder="Enter the Message"
                    onChange={(e) => setPayoutMsg(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="caution_container">
              <div style={{ textAlign: "center" }}>
                <label style={{ fontWeight: "bold" }}>Caution</label>
              </div>
              <div style={{ textAlign: "center" }}>
                <span>
                  Once the Payout Date is submitted, the selected applicants
                  will receive a confirmation email regarding the dividend
                  Payout. Click "Submit" if you wish to proceed.
                </span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="caution_container_footer">
          <button
            type="button"
            onClick={() => closeDividendModal()}
            className="modal_close_btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => saveDividend()}
            className="modal_btn"
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
      <Alert
        title={alertTitle}
        msg={alertMsg}
        open={userAlert}
        type={alertType}
        onClose={alertClose}
        onConfirm={alertConfirm}
      />
    </div>
  );
};

export default DividendPayout;

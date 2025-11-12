import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { ThreeDots } from "react-loader-spinner";
import Alert from "../components/Alert";

const LoginHistory = () => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [authToken] = useState(localStorage.getItem("token"));
  const [loginRecords, setLoginRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [onAlertClose, setOnAlertClose] = useState(() => null);

  const tableReference = useRef(null);

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  // Fetch Login History
  const loadLoginHistory = async () => {
    setIsLoading(true);
    try {
      const method = "GET";
      const url = `/user/admin/loginHistory`;
      const payload = {};
      const response = await PostApi(method, url, payload, headers);

      if (response.data.status === 200) {
        setLoginRecords(response.data.data);
      } else {
        setLoginRecords([]);
        setShowAlert(true);
        setAlertHeader("");
        setAlertMessage(response.data.message);
        setAlertType("info");
        setOnAlertClose(() => () => setShowAlert(false));
      }
    } catch (error) {
      console.error("Error fetching login history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, []);

  // Table Columns
 const loginColumns = [
  { title: "Name", field: "name" },
  { title: "Email", field: "email" },
  { title: "Customer ID", field: "customerId" },
  { title: "Role", field: "role" },
  {
    title: "Login Time",
    field: "loginTime",
    render: (row) => new Date(row.loginTime).toLocaleString(),
  },
  {
    title: "Message",
    field: "message",
    render: (row) => (
      <span style={{ color: row.success ? "green" : "red" }}>
        {row.message}
      </span>
    ),
  },
//   { title: "Location", render: (row) => ${row.city || '-'}, ${row.country || '-'} }
  {
    title: "Location",
    // ✅ Now shows latitude and longitude instead of city, country
    render: (row) =>
      row.latitude && row.longitude
        ? `${row.latitude}, ${row.longitude}`
        : "-",
  },
];


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
            <div>
              <div className="welcome_text">
                <span>Login History</span>
              </div>

              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}
                >
                  <ThreeDots color="#659DBD" />
                </div>
              ) : (
                <MaterialTable
                  style={{ marginTop: "20px" }}
                  title=""
                  columns={loginColumns}
                  data={loginRecords}
                  options={{
                    ...TableOptions(),
                    search: true,
                    toolbar: true,
                    paging: true,
                  }}
                  tableRef={tableReference}
                />
              )}
            </div>
          </div>
        </div>

        <Alert
          title={alertHeader}
          msg={alertMessage}
          open={showAlert}
          type={alertType}
          onClose={onAlertClose}
        />
      </div>
    </div>
  );
};

export default LoginHistory;

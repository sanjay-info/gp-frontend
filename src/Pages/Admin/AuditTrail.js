import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { ThreeDots } from "react-loader-spinner";
import Alert from "../components/Alert";

// JSON Viewer for long strings
const JsonViewer = ({ jsonString }) => {
  const [expanded, setExpanded] = useState(false);
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    parsed = jsonString;
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          marginBottom: "5px",
          padding: "2px 6px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        {expanded ? "Hide" : "Show"} Full Value
      </button>
      {expanded && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "300px",
            overflow: "auto",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {JSON.stringify(parsed, null, 2)}
        </pre>
      )}
    </div>
  );
};

const AuditTrail = () => {
  const { PostApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [authToken] = useState(localStorage.getItem("token"));
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");

  const tableReference = useRef(null);

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const method = "GET";
      const url = "/user/admin/auditLogs"; // Fetch all logs
      const response = await PostApi(method, url, {}, headers);

      if (response.data && response.data.length > 0) {
        setAuditLogs(response.data);
      } else {
        setAuditLogs([]);
        setShowAlert(true);
        setAlertHeader("No Data");
        setAlertMessage("No audit logs found");
        setAlertType("info");
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setShowAlert(true);
      setAlertHeader("Error");
      setAlertMessage("Failed to fetch audit logs.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const auditColumns = [
    { title: "Entity Name", field: "entityName" },
    { title: "Entity ID", field: "entityId" },
    { title: "Action", field: "action" },
    { title: "Performed By", field: "performedBy" },
    {
      title: "Old Value",
      field: "oldValue",
      render: (row) => <JsonViewer jsonString={row.oldValue} />,
    },
    {
      title: "New Value",
      field: "newValue",
      render: (row) => <JsonViewer jsonString={row.newValue} />,
    },
    {
      title: "Timestamp",
      field: "timestamp",
      render: (row) => new Date(row.timestamp).toLocaleString(),
    },
  ];

  const handleAlertClose = () => setShowAlert(false);

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container">
        <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
          <div className="Summary_card">
            <div>
              <div className="welcome_text">
                <span>Audit Logs</span>
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
                  columns={auditColumns}
                  data={auditLogs}
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
          onClose={handleAlertClose}
        />
      </div>
    </div>
  );
};

export default AuditTrail;

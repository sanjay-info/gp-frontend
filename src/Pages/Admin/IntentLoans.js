import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation, useNavigate } from "react-router-dom";

const IntentDetails = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.onQueryChange(); // reload table when route changes
        }
    }, [location.pathname]);

    // ---------------- FETCH DATA FUNCTION ----------------
    const fetchTableData = (query) => {
        return new Promise(async (resolve) => {
            const method = "GET";
            const url = `/user/loanintent`;

            try {
                const response = await PostApi(method, url, null, headers);
                console.log(response.status, "response")

                if (response.status === 200) {
                    const items = response.data || [];

                    resolve({
                        data: items,
                        page: 0,
                        totalCount: items.length,
                    });
                } else {
                    resolve({
                        data: [],
                        page: 0,
                        totalCount: 0,
                    });
                }
            } catch (error) {
                console.log("Error loading loan intent:", error);
                resolve({
                    data: [],
                    page: 0,
                    totalCount: 0,
                });
            }
        });
    };

    // ---------------- TABLE COLUMNS ----------------
    const columns = [
        { title: "Name", field: "name" },
        { title: "Description", field: "description" },

        {
            title: "Required Amount",
            field: "requiredAmount",
            render: (row) => `₹ ${row.requiredAmount?.toLocaleString()}`,
        },

        {
            title: "Raised",
            field: "generatedAmount",
            render: (row) => `₹ ${row.generatedAmount?.toLocaleString()}`,
        },

        {
            title: "Pending",
            field: "pendingAmount",
            render: (row) => `₹ ${row.pendingAmount?.toLocaleString()}`,
        },

        {
            title: "Status",
            field: "status",
            render: (row) => (
                <span style={{ color: row.status ? "green" : "red" }}>
                    {row.status ? "Active" : "In-Active"}
                </span>
            ),
        },

        {
            title: "Intent Status",
            field: "intentStatus.intentStatus",
            render: (row) => {
                let color = "black";

                if (row.intentStatus.intentStatus === "APPROVED") color = "green";
                if (row.intentStatus.intentStatus === "REJECTED") color = "red";
                if (row.intentStatus.intentStatus === "NEEDS REVIEW") color = "orange";

                return <span style={{ color }}>{row.intentStatus.intentStatus}</span>;
            },
        },

        {
            title: "Action",
            field: "action",
            render: (row) => (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/IntentView", { state: { id: row.loanIntentId } })}
                >
                    View
                </button>
            ),
        },
    ];

    // ---------------- PAGE UI ----------------
    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Loan Intent Details</span>
                        </div>

                        <MaterialTable
                            title=""
                            columns={columns}
                            tableRef={tableRef}
                            data={(query) => fetchTableData(query)}
                            options={{
                                ...TableOptions(),
                                search: true,
                                toolbar: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntentDetails;

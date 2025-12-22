import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation, useNavigate } from "react-router-dom";

const LoanApplications = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.onQueryChange();
        }
    }, [location.pathname]);

    /* ---------- FETCH LIST ---------- */
    const fetchTableData = () => {
        return new Promise(async (resolve) => {
            try {
                const res = await PostApi(
                    "GET",
                    "/user/getAllLoanApplications",
                    null,
                    headers
                );

                if (res.status === 200) {
                    resolve({
                        data: res.data || [],
                        page: 0,
                        totalCount: res.data.length,
                    });
                } else {
                    resolve({ data: [], page: 0, totalCount: 0 });
                }
            } catch (err) {
                console.error(err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });
    };

    /* ---------- COLUMNS (MINIMAL) ---------- */
    const columns = [
        {
            title: "Application ID",
            field: "loanApplicationId",
        },
        {
            title: "Loaner Name",
            field: "loanerName",
        },
        {
            title: "Loan Intent",
            field: "loanIntent",
        },
        {
            title: "Status",
            field: "applicationStatus",
            render: (row) => {
                let color = "#374151";
                if (row.applicationStatus === "DISBURSED") color = "green";
                if (row.applicationStatus === "APPROVED") color = "blue";
                if (row.applicationStatus === "REJECTED") color = "red";

                return (
                    <span style={{ color, fontWeight: 600 }}>
                        {row.applicationStatus || "—"}
                    </span>
                );
            },
        },
        {
            title: "Action",
            field: "action",
            render: (row) => (
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(
                            `/LoanApplicationView/${row.loanApplicationId}`
                        )
                    }
                >
                    View
                </button>
            ),
        },
    ];

    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Loan Applications</span>
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

export default LoanApplications;

import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation, useNavigate } from "react-router-dom";

const LoanList = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (tableRef.current) tableRef.current.onQueryChange();
    }, [location.pathname]);

    // ---------------- FETCH LOANS ----------------
    const fetchTableData = (query) => {
        return new Promise(async (resolve) => {
            try {
                const response = await PostApi("GET", "/user/getAllLoans", null, headers);

                const items = response?.data || [];

                resolve({
                    data: items,
                    page: 0,
                    totalCount: items.length,
                });
            } catch (error) {
                console.log("Error fetching loans:", error);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });
    };

    // ---------------- MAIN COLUMNS ONLY ----------------
    const columns = [
        { title: "Loan ID", field: "loanId" },

        { title: "Loaner Name", field: "loanerName" },

        // { title: "Loan Type", field: "loanType.loanType" },

        // { title: "Loan Name", field: "loanName" },

        {
            title: "Sanctioned",
            field: "sanctionedAmount",
            render: (row) => `₹ ${row.sanctionedAmount?.toLocaleString()}`,
        },

        {
            title: "Disbursed",
            field: "disbursedAmount",
            render: (row) => `₹ ${row.disbursedAmount?.toLocaleString()}`,
        },

        { title: "Tenure", field: "tenureMonths" },

        { title: "Rate (%)", field: "interestRate" },

        // {
        //     title: "Status",
        //     field: "loanStatus.statusName",
        //     render: (row) => (
        //         <span style={{ color: row.loanStatus.statusName === "Active" ? "green" : "red" }}>
        //             {row.loanStatus.statusName}
        //         </span>
        //     ),
        // },

        // VIEW BUTTON
        {
            title: "Action",
            render: (row) => (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/LoanView/${row.loanId}`)}
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
                            <span>Loans</span>
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

export default LoanList;

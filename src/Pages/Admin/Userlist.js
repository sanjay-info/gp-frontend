import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { BsPlus } from "react-icons/bs";
import Select from "react-select";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate, useLocation } from "react-router-dom";
import "./Userlist.css";
import Alert from "../components/Alert";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";

const Userlist = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();

    const [userid] = useState(localStorage.getItem("user_id"));
    const [token] = useState(localStorage.getItem("token"));

    const [filterNum, setFilterNum] = useState(1);
    const [accountTypeFilter, setAccountTypeFilter] = useState("ALL");

    const tableRef = useRef(null);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAlertTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const navigate = useNavigate();
    const location = useLocation();

    const isLoanerPage = location.pathname === "/Loaners";

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        Aos.init({ duration: 3000, once: true });
    }, []);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.onQueryChange();
        }
    }, [location.pathname]);

    /* ================= FILTER OPTIONS ================= */

    const filterOptions = [
        { value: 1, label: "Active" },
        { value: 2, label: "Inactive" },
        { value: 3, label: "Disabled" },
    ];

    const accountTypeOptions = [
        { value: "ALL", label: "All" },
        { value: "INDIVIDUAL", label: "Individual" },
        { value: "COMPANY", label: "Company" },
        { value: "BANK", label: "Bank" },
        { value: "NBFC", label: "NBFC" },
    ];

    const handleFilterChange = (opt) => {
        setFilterNum(opt.value);
        tableRef.current.onQueryChange();
    };

    /* ================= ACTIONS ================= */

    const handleAddUser = () => navigate("/AdminCreateuser");
    const handleViewUser = (id) => {
        if (location.pathname === "/Loaners") {
            navigate("/ViewLoanerByAdmin", { state: { id } });
        } else {
            navigate("/ViewUserByadmin", { state: { id } });
        }
    };

    const sentPassword = (id) => {
        const url = `/user/admin/sendPwd?id=${id}&loginId=${userid}`;
        PostApi("POST", url, {}, headers).then((res) => {
            setUserAlert(true);
            setAlertMsg(res.data.message);
            setAlertType("info");
            setAlertClose(() => () => setUserAlert(false));
        });
    };

    /* ================= API ================= */

    const fetchTableData = async (query, filterNumber) => {
        let opportunityRecordId = "";

        if (location.pathname === "/Investors") opportunityRecordId = 1;
        if (location.pathname === "/Loaners") opportunityRecordId = 2;

        const url = `/user/admin/all?filter=${filterNumber}&pageNo=${query.page}&pageSize=${query.pageSize}${opportunityRecordId
            ? `&opportunityRecordTypeId=${opportunityRecordId}`
            : ""
            }`;

        try {
            const res = await PostApi("POST", url, null, headers);
            let users = res.data?.data || [];

            // Investors filter
            if (location.pathname === "/Investors") {
                users = users.filter(
                    (u) =>
                        !u.opportunityRecordTypes ||
                        u.opportunityRecordTypes.some(
                            (t) => t.opportunityRecordType?.toUpperCase() === "INVESTER"
                        )
                );
            }

            // Loaners + Account Type filter
            if (location.pathname === "/Loaners") {
                users = users.filter((u) =>
                    u.opportunityRecordTypes?.some(
                        (t) => t.opportunityRecordType?.toUpperCase() === "LOANER"
                    )
                );

                if (accountTypeFilter !== "ALL") {
                    users = users.filter(
                        (u) =>
                            u.accountType?.accountType?.toUpperCase() === accountTypeFilter
                    );
                }
            }

            return {
                data: users,
                page: query.page,
                totalCount: users.length,
            };
        } catch {
            return { data: [], page: 0, totalCount: 0 };
        }
    };

    /* ================= TABLE COLUMNS ================= */

    const investorColumns = [
        { title: "Name", field: "firstName" },
        {
            title: "Email",
            render: (row) =>
                row.emailId.length > 15
                    ? `${row.emailId.slice(0, 15)}...`
                    : row.emailId,
        },
        {
            title: "KYC Status",
            render: (row) => (
                <span style={{ color: row.kycVerified ? "green" : "red" }}>
                    {row.kycVerified ? "Verified" : "Not Verified"}
                </span>
            ),
        },
        {
            title: "Status",
            render: (row) => (
                <span style={{ color: row.active ? "green" : "red" }}>
                    {row.active ? "Active" : "In-Active"}
                </span>
            ),
        },
        {
            title: "Action",
            render: (row) => (
                <button className="btn btn-primary" onClick={() => handleViewUser(row.id)}>
                    View
                </button>
            ),
        },
        {
            title: "Send Password",
            render: (row) => (
                <button
                    className="btn btn-primary"
                    disabled={!row.blocked}
                    onClick={() => sentPassword(row.id)}
                >
                    Send
                </button>
            ),
        },
    ];

    const loanerColumns = [
        {
            title: "Name",
            render: (row) => `${row.firstName} ${row.lastName || ""}`,
        },
        { title: "Email", field: "emailId" },
        {
            title: "Phone",
            render: (row) =>
                row.mobileNo ? `${row.countryCode} ${row.mobileNo}` : "-",
        },
        {
            title: "Account Type",
            render: (row) => row.accountType?.accountType || "-",
        },
        {
            title: "Action",
            render: (row) => (
                <button className="btn btn-primary" onClick={() => handleViewUser(row.id)}>
                    View
                </button>
            ),
        },
    ];

    /* ================= RENDER ================= */

    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Golden Planet Users</span>
                        </div>

                        {/* ===== TOP ACTIONS ===== */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                margin: "20px 0px",
                            }}
                        >
                            {/* Left: Add User (Investors only) */}
                            {location.pathname === "/Investors" && (
                                <button className="createbutton" onClick={handleAddUser}>
                                    <span className="createbutton__text">Add Users</span>
                                    <span className="createbutton__icon">
                                        <BsPlus />
                                    </span>
                                </button>
                            )}

                            {/* Right: Filters */}
                            <div
                                style={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    gap: "12px",
                                }}
                            >
                                {/* Account Type Filter – Loaners only */}
                                {isLoanerPage && (
                                    <div style={{ width: 220 }}>
                                        <Select
                                            options={accountTypeOptions}
                                            value={accountTypeOptions.find(
                                                (o) => o.value === accountTypeFilter
                                            )}
                                            onChange={(opt) => {
                                                setAccountTypeFilter(opt.value);
                                                tableRef.current.onQueryChange();
                                            }}
                                            placeholder="Account Type"
                                        />
                                    </div>
                                )}

                                {/* Status Filter – Always */}
                                <div style={{ width: 220 }}>
                                    <Select
                                        options={filterOptions}
                                        value={filterOptions.find(
                                            (o) => o.value === filterNum
                                        )}
                                        onChange={handleFilterChange}
                                        placeholder="Status"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ===== TABLE ===== */}
                        <MaterialTable
                            tableRef={tableRef}
                            columns={isLoanerPage ? loanerColumns : investorColumns}
                            data={(query) => fetchTableData(query, filterNum)}
                            options={{
                                ...TableOptions(),
                                search: false,
                                toolbar: false,
                            }}
                        />
                    </div>
                </div>
            </div>

            <Alert
                open={userAlert}
                title={alertTittle}
                msg={alertMsg}
                type={alertType}
                onClose={alertClose}
            />
        </div>
    );
};

export default Userlist;

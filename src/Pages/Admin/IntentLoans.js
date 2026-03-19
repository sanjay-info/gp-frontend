import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { Box } from "@mui/material";
import "./IntentView.css";

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

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        requiredAmount: "",
        generatedAmount: "",
        pendingAmount: "",
    });

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.onQueryChange();
        }
    }, [location.pathname]);

    // ---------------- FETCH TABLE DATA ----------------
    const fetchTableData = (query) => {
        return new Promise(async (resolve) => {
            try {
                const response = await PostApi(
                    "GET",
                    "/user/loanintent",
                    null,
                    headers
                );

                if (response.status === 200) {
                    const items = response.data || [];
                    resolve({
                        data: items,
                        page: 0,
                        totalCount: items.length,
                    });
                } else {
                    resolve({ data: [], page: 0, totalCount: 0 });
                }
            } catch (error) {
                console.log("Error loading loan intent:", error);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });
    };

    // ---------------- HANDLE INPUT CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedData = { ...formData, [name]: value };

        // Auto calculate pending amount
        if (name === "requiredAmount" || name === "generatedAmount") {
            const required = Number(
                name === "requiredAmount" ? value : updatedData.requiredAmount
            );
            const generated = Number(
                name === "generatedAmount" ? value : updatedData.generatedAmount
            );

            if (!isNaN(required) && !isNaN(generated)) {
                updatedData.pendingAmount = required - generated;
            }
        }

        setFormData(updatedData);
    };

    // ---------------- CREATE INTENT ----------------
    const handleSaveIntent = async () => {
        if (!formData.name || !formData.requiredAmount) {
            alert("Name and Required Amount are mandatory");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name,
                description: formData.description,
                requiredAmount: Number(formData.requiredAmount),
                generatedAmount: Number(formData.generatedAmount) || 0,
                pendingAmount: Number(formData.pendingAmount) || 0,
                status: true,
                approvalStatus: "APPROVED",
                requestedBy: "admin",
                reviewedBy: "manager",
                rejectionReason: null,
                intentStatus: {
                    intentStatusId: 2,
                },
            };

            let response;

            if (editingId) {
                response = await PostApi(
                    "PUT",
                    `/user/loanintent/update?id=${editingId}`,
                    payload,
                    headers
                );
            } else {
                response = await PostApi(
                    "POST",
                    "/user/add-loanintent",
                    payload,
                    headers
                );
            }

            if (response.status === 200 || response.status === 201) {
                setShowModal(false);
                setEditingId(null);

                setFormData({
                    name: "",
                    description: "",
                    requiredAmount: "",
                    generatedAmount: "",
                    pendingAmount: "",
                });

                tableRef.current?.onQueryChange();
            }

        } catch (error) {
            console.log("Save Intent Error:", error);
            alert("Failed to save intent");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- TABLE COLUMNS ----------------
    const columns = [
        { title: "Name", field: "name" },
        { title: "Description", field: "description" },

        {
            title: "Required Amount",
            field: "requiredAmount",
            render: (row) =>
                `₹ ${row.requiredAmount?.toLocaleString() || 0}`,
        },

        {
            title: "Raised",
            field: "generatedAmount",
            render: (row) =>
                `₹ ${row.generatedAmount?.toLocaleString() || 0}`,
        },

        {
            title: "Pending",
            field: "pendingAmount",
            render: (row) =>
                `₹ ${row.pendingAmount?.toLocaleString() || 0}`,
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
                const status = row.intentStatus?.intentStatus || "";
                let color = "black";

                if (status === "APPROVED") color = "green";
                if (status === "REJECTED") color = "red";
                if (status === "NEEDS REVIEW") color = "orange";

                return <span style={{ color }}>{status}</span>;
            },
        },

        {
            title: "Action",
            field: "action",
            width: 220,
            cellStyle: { minWidth: 220 },
            headerStyle: { minWidth: 220 },
            render: (row) => (
                <Box display="flex" gap={1} alignItems="center">

                    <Button
                        size="small"
                        variant="outlined"
                        className="doc-btn view"
                        onClick={() =>
                            navigate("/IntentView", {
                                state: { id: row.loanIntentId },
                            })
                        }
                    >
                        View
                    </Button>

                    {/* <Button
                        size="small"
                        variant="outlined"
                        className="doc-btn edit"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button> */}

                </Box>
            ),
        }
    ];
    const handleEdit = (row) => {
        setFormData({
            name: row.name,
            description: row.description,
            requiredAmount: row.requiredAmount,
            generatedAmount: row.generatedAmount,
            pendingAmount: row.pendingAmount,
        });

        setEditingId(row.loanIntentId);
        setShowModal(true);
    };
    // ---------------- UI ----------------
    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div
                    className={
                        sideBarCollapse
                            ? "main_content"
                            : "main_content collapsed"
                    }
                >
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Loan Intent Details</span>
                        </div>

                        {/* CREATE BUTTON */}
                        <div
                            style={{
                                marginBottom: "15px",
                                textAlign: "right",
                            }}
                        >
                            <button
                                className="btn btn-success"
                                onClick={() => setShowModal(true)}
                            >
                                + Create Intent
                            </button>
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

            {/* ---------------- MODAL ---------------- */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingId ? "Update Loan Intent" : "Create Loan Intent"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Required Amount *</Form.Label>
                            <Form.Control
                                type="number"
                                name="requiredAmount"
                                value={formData.requiredAmount}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Generated Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="generatedAmount"
                                value={formData.generatedAmount}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Pending Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="pendingAmount"
                                value={formData.pendingAmount}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSaveIntent}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editingId ? "Update Intent" : "Create Intent"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IntentDetails;

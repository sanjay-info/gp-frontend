import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Chip,
    Box,
    MenuItem,
} from "@mui/material";
import "./DocumentTemplate.css";

const Documents = () => {
    const { GetApi, PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const tableRef = useRef(null);
    const location = useLocation();

    /* ---------- STATES ---------- */
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [documentDetails, setDocumentDetails] = useState(null);

    const [loanApplications, setLoanApplications] = useState([]);
    const [loans, setLoans] = useState([]);


    const [templates, setTemplates] = useState([]);

    const [form, setForm] = useState({
        documentName: "",
        documentTemplateId: "",
        loanApplicationId: "",
        loanId: "",
        submissionOnly: false,
        receivableOnly: false,
        returnable: false,
        description: "",
    });

    const loadLoanApplications = async () => {
        try {
            const res = await GetApi(
                "GET",
                "/user/getAllLoanApplications",
                null,
                headers
            );
            if (res?.status === 200) {
                setLoanApplications(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load loan applications", err);
        }
    };
    const loadLoans = async () => {
        try {
            const res = await GetApi(
                "GET",
                "/user/getAllLoans",
                null,
                headers
            );
            if (res?.status === 200) {
                setLoans(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load loans", err);
        }
    };
    const loanMap = loanApplications.map(app => {
        const matchedLoan = loans.find(
            loan => loan.applicationNumber === `APP-${app.loanApplicationId}`
        );

        return {
            loanApplicationId: app.loanApplicationId,
            loanId: matchedLoan?.loanId || null,
            loanerName: app.loanerName,
            loanIntent: app.loanIntent,
            loanStatus: matchedLoan?.loanStatus,
        };
    });


    useEffect(() => {
        loadLoanApplications();
        loadLoans();
    }, []);


    /* ---------- AUTO REFRESH ---------- */
    useEffect(() => {
        tableRef.current?.onQueryChange();
    }, [location.pathname]);

    /* ---------- LOAD DOCUMENT TEMPLATES ---------- */
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const res = await GetApi(
                "GET",
                "/user/document/document-template",
                null,
                headers
            );
            if (res?.status === 200) {
                setTemplates(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load templates", err);
        }
    };

    /* ---------- FETCH DOCUMENT LIST ---------- */
    const fetchTableData = () =>
        new Promise(async (resolve) => {
            try {
                const res = await GetApi(
                    "GET",
                    "/user/document/document-list",
                    null,
                    headers
                );

                if (res?.status === 200) {
                    resolve({
                        data: res.data || [],
                        page: 0,
                        totalCount: res.data?.length || 0,
                    });
                } else {
                    resolve({ data: [], page: 0, totalCount: 0 });
                }
            } catch (err) {
                console.error("Failed to fetch documents", err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });

    /* ---------- FETCH DOCUMENT DETAILS ---------- */
    const fetchDocumentDetails = async (documentId) => {
        try {
            setDetailsOpen(true);
            setDetailsLoading(true);
            setDocumentDetails(null);

            const res = await GetApi(
                "GET",
                `/user/document/document-details/${documentId}`,
                null,
                headers
            );

            if (res?.status === 200) {
                setDocumentDetails(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch document details", err);
        } finally {
            setDetailsLoading(false);
        }
    };

    /* ---------- SAVE DOCUMENT ---------- */
    const handleSave = async () => {
        try {
            setLoading(true);

            const payload = {
                documentName: form.documentName,
                documentTemplateId: form.documentTemplateId,
                loanApplicationId: Number(form.loanApplicationId),
                loanId: Number(form.loanId),
                submissionOnly: form.submissionOnly,
                receivableOnly: form.receivableOnly,
                returnable: form.returnable,
                description: form.description,
            };


            const res = await PostApi(
                "POST",
                "/user/document/add-document",
                payload,
                headers
            );

            if (res?.status === 200 || res?.status === 201) {
                setOpen(false);
                setForm({
                    documentName: "",
                    documentTemplateId: "",
                    loanApplicationId: "",
                    loanId: "",
                    submissionOnly: false,
                    receivableOnly: false,
                    returnable: false,
                    description: "",
                });
                tableRef.current?.onQueryChange();
            }
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- TABLE COLUMNS ---------- */
    const columns = [
        {
            title: "Document Name",
            field: "documentName",
            cellStyle: { fontWeight: 600 },
        },
        { title: "Loan App ID", field: "loanApplicationId" },
        { title: "Loan ID", field: "loanId" },
        { title: "Received Date", field: "receivedDate" },
        {
            title: "Flags",
            render: (row) => (
                <Box display="flex" gap={1}>
                    {row.submissionOnly && <Chip label="Submission" size="small" />}
                    {row.receivableOnly && <Chip label="Receivable" size="small" />}
                    {row.returnable && <Chip label="Returnable" size="small" />}
                </Box>
            ),
        },
        {
            title: "Action",
            render: (row) => (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => fetchDocumentDetails(row.documentId)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <>
            <div className="">
                <div
                    className={sideBarCollapse ? "main_content" : "main_content collapsed"}
                >
                    <div className="Summary_card document-card">

                        {/* HEADER */}
                        <div className="document-header">
                            <div>
                                <h2>Documents</h2>

                            </div>

                            <button
                                className="primary-btn"
                                onClick={() => setOpen(true)}
                            >
                                + Add Document
                            </button>
                        </div>

                        {/* TABLE */}
                        <MaterialTable
                            title=""
                            columns={columns}
                            tableRef={tableRef}
                            data={() => fetchTableData()}
                            options={{
                                ...TableOptions(),
                                search: true,
                                paging: false,
                                toolbar: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ---------- ADD DOCUMENT MODAL ---------- */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Document</DialogTitle>

                <DialogContent>
                    <TextField
                        label="Document Name"
                        fullWidth
                        required
                        margin="normal"
                        value={form.documentName}
                        onChange={(e) =>
                            setForm({ ...form, documentName: e.target.value })
                        }
                    />

                    <TextField
                        select
                        label="Document Template"
                        fullWidth
                        required
                        margin="normal"
                        value={form.documentTemplateId}
                        onChange={(e) =>
                            setForm({ ...form, documentTemplateId: e.target.value })
                        }
                    >
                        {templates.map((t) => (
                            <MenuItem key={t.documentTemplateId} value={t.documentTemplateId}>
                                {t.documentName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Loan Application"
                        fullWidth
                        required
                        margin="normal"
                        value={form.loanApplicationId}
                        onChange={(e) => {
                            const selected = loanMap.find(
                                l => l.loanApplicationId === Number(e.target.value)
                            );

                            setForm({
                                ...form,
                                loanApplicationId: selected.loanApplicationId,
                                loanId: selected.loanId, // 🔥 auto-filled
                            });
                        }}
                    >
                        {loanMap.map(item => (
                            <MenuItem key={item.loanApplicationId} value={item.loanApplicationId}>
                                {item.loanApplicationId} — {item.loanerName}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Loan ID"
                        fullWidth
                        margin="normal"
                        value={form.loanId || ""}
                        disabled
                    />


                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <Box mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.submissionOnly}
                                    onChange={(e) =>
                                        setForm({ ...form, submissionOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Submission Only"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.receivableOnly}
                                    onChange={(e) =>
                                        setForm({ ...form, receivableOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Receivable Only"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.returnable}
                                    onChange={(e) =>
                                        setForm({ ...form, returnable: e.target.checked })
                                    }
                                />
                            }
                            label="Returnable"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={
                            !form.documentName ||
                            !form.documentTemplateId ||
                            form.loanApplicationId == null ||
                            form.loanId == null ||
                            loading
                        }
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>

                </DialogActions>
            </Dialog>

            {/* ---------- DOCUMENT DETAILS MODAL ---------- */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Document Details</DialogTitle>

                <DialogContent>
                    {detailsLoading ? (
                        <p>Loading...</p>
                    ) : documentDetails ? (
                        <Box className="details-grid">

                            <div className="detail-row">
                                <span>Document Name</span>
                                <strong>{documentDetails.documentName}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Document Template ID</span>
                                <strong>{documentDetails.documentTemplateId}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Loan Application ID</span>
                                <strong>{documentDetails.loanApplicationId}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Loan ID</span>
                                <strong>{documentDetails.loanId}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Received Date</span>
                                <strong>{documentDetails.receivedDate}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Description</span>
                                <strong>{documentDetails.description || "—"}</strong>
                            </div>

                            <Box mt={2} display="flex" gap={1}>
                                {documentDetails.submissionOnly && (
                                    <Chip label="Submission Only" size="small" />
                                )}
                                {documentDetails.receivableOnly && (
                                    <Chip label="Receivable Only" size="small" />
                                )}
                                {documentDetails.returnable && (
                                    <Chip label="Returnable" size="small" />
                                )}
                            </Box>

                        </Box>
                    ) : (
                        <p>No details found</p>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Documents;

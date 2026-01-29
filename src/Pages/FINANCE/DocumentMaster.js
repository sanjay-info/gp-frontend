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
    Switch,
    Chip,
    Box,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

import "./DocumentMaster.css";

const DocumentMasters = () => {
    const { PostApi } = useAppContext();
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
    const [masterDetails, setMasterDetails] = useState(null);

    const [form, setForm] = useState({
        documentName: "",
        description: "",
        isActive: true,
    });
    const [templateOpen, setTemplateOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState(null);

    const [templateForm, setTemplateForm] = useState({
        documentName: "",
        submissionOnly: false,
        receivableOnly: false,
        returnable: false,
    });

    /* ---------- AUTO REFRESH ---------- */
    useEffect(() => {
        tableRef.current?.onQueryChange();
    }, [location.pathname]);

    /* ---------- FETCH MASTER LIST ---------- */
    const fetchTableData = () =>
        new Promise(async (resolve) => {
            try {
                const res = await PostApi(
                    "GET",
                    "/user/document/master-template",
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
                console.error("Fetch failed", err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });

    /* ---------- FETCH MASTER DETAILS ---------- */
    const fetchMasterDetails = async (masterId) => {
        try {
            setDetailsOpen(true);
            setDetailsLoading(true);
            setMasterDetails(null);

            const res = await PostApi(
                "GET",
                `/user/document/master-template/${masterId}`,
                null,
                headers
            );

            if (res?.status === 200) {
                setMasterDetails(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch master details", err);
        } finally {
            setDetailsLoading(false);
        }
    };

    /* ---------- SAVE MASTER ---------- */
    const handleSave = async () => {
        try {
            setLoading(true);

            const payload = {
                documentName: form.documentName,
                description: form.description,
                isActive: form.isActive,
            };

            const res = await PostApi(
                "POST",
                "/user/document/addmaster-template",
                payload,
                headers
            );

            if (res?.status === 200 || res?.status === 201) {
                setOpen(false);
                setForm({ documentName: "", description: "", isActive: true });
                tableRef.current?.onQueryChange();
            }
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSave = async () => {
        try {
            const payload = {
                documentName: templateForm.documentName,
                documentTemplateMaster: {
                    id: selectedMaster.id, // 🔥 row-level link
                },
                submissionOnly: templateForm.submissionOnly,
                receivableOnly: templateForm.receivableOnly,
                returnable: templateForm.returnable,
            };

            const res = await PostApi(
                "POST",
                "/user/document/adddocument-template",
                payload,
                headers
            );

            if (res?.status === 200 || res?.status === 201) {
                setTemplateOpen(false);
                setTemplateForm({
                    documentName: "",
                    submissionOnly: false,
                    receivableOnly: false,
                    returnable: false,
                });

                // Optional: refresh master details or table
                tableRef.current?.onQueryChange();
            }
        } catch (err) {
            console.error("Template creation failed", err);
        }
    };


    /* ---------- TABLE COLUMNS ---------- */
    const columns = [
        {
            title: "Document Name",
            field: "documentName",
            cellStyle: { fontWeight: 600 },
        },
        {
            title: "Description",
            field: "description",
        },
        {
            title: "Status",
            render: (row) =>
                row.isActive ? (
                    <Chip label="Active" color="success" size="small" />
                ) : (
                    <Chip label="Inactive" size="small" />
                ),
        },
        {
            title: "Action",
            render: (row) => (
                <Box display="flex" gap={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => fetchMasterDetails(row.id)}
                    >
                        View
                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                            setSelectedMaster(row);
                            setTemplateOpen(true);
                        }}
                    >
                        + Template
                    </Button>
                </Box>
            ),
        }

    ];

    return (
        <div className="document-master-page">
            <Header />
            <SidePanel />

            <div className="page_container">
                <div
                    className={sideBarCollapse ? "main_content" : "main_content collapsed"}
                >
                    <div className="Summary_card document-card">

                        <div className="document-header">
                            <div>
                                <h2>Document Masters</h2>
                            </div>

                            <button
                                className="primary-btn"
                                onClick={() => setOpen(true)}
                            >
                                + Add Document Master
                            </button>
                        </div>

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

            {/* ---------- ADD MASTER MODAL ---------- */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Document Master</DialogTitle>

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

                    <Box display="flex" alignItems="center" mt={2}>
                        <span style={{ marginRight: 12, fontWeight: 500 }}>
                            Active
                        </span>
                        <Switch
                            checked={form.isActive}
                            onChange={(e) =>
                                setForm({ ...form, isActive: e.target.checked })
                            }
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!form.documentName || loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------- MASTER DETAILS MODAL ---------- */}
            {/* ---------- MASTER DETAILS MODAL ---------- */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Document Master Details</DialogTitle>

                <DialogContent>
                    {detailsLoading ? (
                        <p>Loading...</p>
                    ) : masterDetails ? (
                        <Box>

                            {/* ===== MASTER INFO ===== */}
                            <Box className="details-grid">
                                <div className="detail-row">
                                    <span>Master Name</span>
                                    <strong>{masterDetails.documentName}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Description</span>
                                    <strong>{masterDetails.description || "—"}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Status</span>
                                    <Chip
                                        label={
                                            masterDetails.isActive === null
                                                ? "N/A"
                                                : masterDetails.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                        }
                                        color={
                                            masterDetails.isActive === true
                                                ? "success"
                                                : masterDetails.isActive === false
                                                    ? "default"
                                                    : "warning"
                                        }
                                        size="small"
                                    />
                                </div>
                            </Box>

                            {/* ===== TEMPLATE LIST ===== */}
                            <Box mt={4}>
                                <h4 style={{ marginBottom: 12 }}>Document Templates</h4>

                                {masterDetails.documentTemplates?.length > 0 ? (
                                    masterDetails.documentTemplates.map((tpl) => (
                                        <Box key={tpl.documentTemplateId} className="template-item">
                                            <div>
                                                <strong>{tpl.documentName}</strong>
                                                <Box mt={1} display="flex" gap={1}>
                                                    {tpl.submissionOnly && (
                                                        <Chip label="Submission" size="small" />
                                                    )}
                                                    {tpl.receivableOnly && (
                                                        <Chip label="Receivable" size="small" />
                                                    )}
                                                    {tpl.returnable && (
                                                        <Chip label="Returnable" size="small" />
                                                    )}
                                                </Box>
                                            </div>

                                            <Chip
                                                label={tpl.isActive ? "Active" : "Inactive"}
                                                size="small"
                                                color={tpl.isActive ? "success" : "default"}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <p>No templates linked to this master</p>
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
            <Dialog
                open={templateOpen}
                onClose={() => setTemplateOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Add Template
                    {selectedMaster && (
                        <span style={{ fontSize: 13, marginLeft: 8, opacity: 0.7 }}>
                            ({selectedMaster.documentName})
                        </span>
                    )}
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Template Name"
                        fullWidth
                        required
                        margin="normal"
                        value={templateForm.documentName}
                        onChange={(e) =>
                            setTemplateForm({ ...templateForm, documentName: e.target.value })
                        }
                    />

                    <Box mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={templateForm.submissionOnly}
                                    onChange={(e) =>
                                        setTemplateForm({
                                            ...templateForm,
                                            submissionOnly: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Submission Only"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={templateForm.receivableOnly}
                                    onChange={(e) =>
                                        setTemplateForm({
                                            ...templateForm,
                                            receivableOnly: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Receivable Only"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={templateForm.returnable}
                                    onChange={(e) =>
                                        setTemplateForm({
                                            ...templateForm,
                                            returnable: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Returnable"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setTemplateOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleTemplateSave}
                        disabled={!templateForm.documentName}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default DocumentMasters;

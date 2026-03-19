import React, { useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";

import { Tabs, Tab, Box } from "@mui/material";
import DocumentMasters from "./DocumentMaster";
import DocumentTemplates from "./DocumentTemplate";
import Documents from "./Document";



const DocumentsPage = () => {
    const { sideBarCollapse } = useSidebar();
    const [tab, setTab] = useState(0);

    const handleChange = (e, newValue) => {
        setTab(newValue);
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

                        {/* TABS */}
                        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                            <Tabs value={tab} onChange={handleChange}>
                                <Tab label="Document Masters" />
                                <Tab label="Document Templates" />
                                <Tab label="Documents" />
                            </Tabs>
                        </Box>

                        {/* TAB CONTENT */}
                        {tab === 0 && <DocumentMasters />}
                        {tab === 1 && <DocumentTemplates />}
                        {tab === 2 && <Documents />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
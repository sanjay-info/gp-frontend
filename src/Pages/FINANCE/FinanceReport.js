import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import DrillDownChart from "../components/Charts/DrillDownChart";
import GaugeChart from "../components/Charts/GaugeChart";

const FinanceReport = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`
    }), [token]);

    const [applicationDataList, setApplicationDataList] = useState({});
    const [paymentDataList, setPaymentDataList] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            window.location.reload();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            try {
                await Promise.all([
                    getPaymentDetails(),
                    fetchApplicationData(),
                ]);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const fetchApplicationData = async () => {
        try {
            const response = await PostApi('POST', '/report/userbond/application', null, headers);
            setApplicationDataList(response.data);
        } catch (error) {
            console.error("Error fetching application data:", error);
            throw error;
        }
    };

    const getPaymentDetails = async () => {
        try {
            const response = await PostApi('POST', '/report/amount', null, headers);
            setPaymentDataList(response.data);
        }
        catch (error) {
            setPaymentDataList({});
            console.error("Error fetching payment details:", error);
            throw error;
        }
    };

    const doughnutData = useMemo(() => ([
        { value: applicationDataList.nriApplication || 0, name: 'NRI Payment', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.riApplication || 0, name: 'RI Payment', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    const nriPieData = useMemo(() => ([
        { value: applicationDataList.nriPaymentVerified || 0, name: 'NRI Payment Verified', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.nriPaymentNotVerified || 0, name: 'NRI Payment Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    const riPieData = useMemo(() => ([
        { value: applicationDataList.riPaymentVerified || 0, name: 'RI Payment Verified', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.riPaymentNotVerified || 0, name: 'RI Payment Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    const targetAmount = 2500000000;

    if (loading) {
        return (
            <div>
                <Header />
                <SidePanel />
                <div className="page_container">
                    <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-md-12 col-12">
                                <div className="Summary_card">Loading...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <SidePanel />
                <div className="page_container">
                    <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-md-12 col-12">
                                <div className="Summary_card">Error loading data: {error.message}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-12 col-12">
                            <div className="Summary_card">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <DrillDownChart
                                            doughnutData={doughnutData}
                                            nriPieData={nriPieData}
                                            riPieData={riPieData}
                                            title={'Finance Report'}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        {/* {paymentDataList.length >= 0 && ( */}
                                        <GaugeChart
                                            current={paymentDataList.verifiedAmount}
                                            target={targetAmount}
                                            max={paymentDataList.totalAmountReceived}
                                        />
                                        {/* )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceReport;
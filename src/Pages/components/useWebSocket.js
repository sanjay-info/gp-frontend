import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

const useWebSocket = () => {
    const [usdAmount, setUsdAmount] = useState();
    const [aedAmount, setAedAmount] = useState();
    const [ukAmount, setUkAmount] = useState();
    const stompClientRef = useRef(null);

    const [registerOtpFlag, setRegisterOtpFlag] = useState(null);
    const [forgotOtpFlag, setForgotOtpFlag] = useState(null);

    const [notificationMsg, setNotificationMsg] = useState()

    const [userId] = useState(localStorage.getItem("user_id"));

    const [role] = useState(localStorage.getItem("Role_id"))

    useEffect(() => {
        const socketUrl = `${process.env.REACT_APP_BASE_URL}/ws`;

        const stompClient = new Client({
            brokerURL: socketUrl,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => onConnected(stompClient),
            onStompError: onError,
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const onConnected = (stompClient) => {
        console.log('Connected to server');
        stompClient.subscribe('/topic/usd', (message) => {
            try {
                const response = JSON.parse(message.body);

                const usd = response
                    .filter(item => item.currency === "USD")
                    .map(item => item.amount ?? "--");
                setUsdAmount(usd);

                const aed = response
                    .filter(item => item.currency === "UAE")
                    .map(item => item.amount ?? "--");
                setAedAmount(aed);

                const uk = response
                    .filter(item => item.currency === "UK")
                    .map(item => item.amount ?? "--");
                setUkAmount(uk);
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }

        });

        stompClient.subscribe('/topic/message', (message) => {
            try {
                let storedItem = JSON.parse(role)
                if (storedItem[0].id !== 1) {
                    setNotificationMsg(message.body)
                }
            }
            catch (error) {
                console.log(error)
            }
        })

        const userQueue = `/user/${userId}/queue/notifications`;
        stompClient.subscribe(userQueue, (message) => {
            try {
                setNotificationMsg(message.body)
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }
        });

        stompClient.subscribe('/topic/registration', (message) => {
            try {
                const response = JSON.parse(message.body);
                setRegisterOtpFlag(response);
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }
        });

        stompClient.subscribe('/topic/updation', (message) => {
            try {
                const response = JSON.parse(message.body);
                setForgotOtpFlag(response);
            } catch (error) {
                console.log('Error parsing JSON:', error);
            }
        });
    };

    const onError = (error) => {
        console.log('Connection error:', error);
    };

    return { usdAmount, aedAmount, ukAmount, setUsdAmount, setAedAmount, setUkAmount, notificationMsg, setNotificationMsg, registerOtpFlag, forgotOtpFlag }
};

export default useWebSocket;
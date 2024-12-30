import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { TabBar } from "antd-mobile";
import {
  AppOutline,
  CalendarOutline,
  FileOutline,
  UserOutline,
} from "antd-mobile-icons";
import HomePage from "../homepage";
import ReservationPage from "../reservationpage/reservationpage";
import OrdersPage from "../orderInfopage/orderInfopage";
import UserInfoPagpe from "../userInfopage/userinfopage";
import Settings from "../settingpage/settingpage";
import EditPasswordPage from "../editPwdpage/editpwdpage";
import RechargePage from "../rechargepage/rechargepage";
import RechargeOrderPage from "../rechargeOrderpage/rechargeorderpage";
import MemberLevelPage from "../vipPowerpage/memberlevelPage";
import HoetelDetailPage from "../reservationpage/hoteldetailpage";
import HotelReservationPage from "../reservationpage/hotelreservationpage";
import RoomOrderHandlePage from "../roomorderhandlepage/RoomOrderHandlePage";
import RoomBookingOrderPage from "../roombookinghandle/roombookingpage";
import MessageBoxPage from "../messageBoxpage/MessageBoxPage";
import "./IndexPage.css";
import axios from "../../axios.js";

export default function IndexPage() {
  const [activeKey, setActiveKey] = useState("/home/homepage");
  const [keyCounter, setKeyCounter] = useState(0); // 用于强制刷新
  const [position, setPosition] = useState({ x: 50, y: 50 }); // 通知图标的初始位置
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        axios.get("account/unread-message-count").then((res) => {
          setUnreadMessages(res.data.data);
        });
        // 假设返回的数据格式为 { count: number }
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadMessages(); // 初始调用

    const intervalId = setInterval(fetchUnreadMessages, 30000); // 每30秒调用一次

    return () => clearInterval(intervalId); // 清除定时器
  }, []);

  const tabs = [
    {
      key: "/home/userInfo",
      title: "主页",
      icon: <UserOutline />,
    },

    {
      key: "/home/reservation",
      title: "预定",
      icon: <CalendarOutline />,
    },
    {
      key: "/home/orders",
      title: "订单",
      icon: <FileOutline />,
    },
    {
      key: "/home/homepage",
      title: "个人",
      icon: <AppOutline />,
    },
  ];

  // 跳转页面并处理刷新
  const handleTabChange = (key) => {
    if (location.pathname === key) {
      // 强制刷新页面
      setKeyCounter((prevKey) => prevKey + 1);
    } else {
      setActiveKey(key);
      navigate(key);
    }
  };

  // 处理触摸事件
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setPosition({
      x: touch.clientX - 25,
      y: touch.clientY - 25,
    });
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    setPosition({
      x: touch.clientX - 25,
      y: touch.clientY - 25,
    });
  };

  const goToMessageBox = () => {
    navigate("/home/messageBoxPage");
  };

  return (
    <div className="index-page">
      <div className="content">
        <Routes key={keyCounter}>
          {" "}
          {/* 强制刷新时改变 key */}
          <Route path="homepage" element={<HomePage />} />
          <Route path="reservation" element={<ReservationPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="userInfo" element={<UserInfoPagpe />} />
          <Route path="settings" element={<Settings />} />
          <Route path="editpwd" element={<EditPasswordPage />} />
          <Route path="recharge" element={<RechargePage />} />
          <Route
            path="rechargeOrderPay/:orderId"
            element={<RechargeOrderPage />}
          />
          <Route path="memberlevel" element={<MemberLevelPage />} />
          <Route
            path="hoteldetailPage/:hotelId"
            element={<HoetelDetailPage />}
          ></Route>
          <Route
            path="hotelreservationpage/:roomId"
            element={<HotelReservationPage />}
          />
          <Route
            path="roomOrderHandle/:orderId"
            element={<RoomOrderHandlePage />}
          />
          <Route
            path="roombookingOrderPage/:orderId"
            element={<RoomBookingOrderPage />}
          />
          <Route path="messageBoxPage" element={<MessageBoxPage />} />
        </Routes>
      </div>
      <div className="router-box">
        <TabBar activeKey={activeKey} onChange={handleTabChange}>
          {tabs.map((tab) => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
          ))}
        </TabBar>
      </div>
      <div
        onClick={goToMessageBox}
        className="notification-icon"
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: 50,
          height: 50,
          backgroundColor: "#409EFF",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 9999, // 确保足够高的 z-index 值
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 22c1.104 0 2-.897 2-2h-4c0 1.103.896 2 2 2zm6-6v-5c0-3.072-1.637-5.641-4.5-6.32v-.68c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v.68c-2.863.679-4.5 3.248-4.5 6.32v5l-2 2v1h16v-1l-2-2zm-10-5c0-2.481 1.519-4.5 4-4.5s4 2.019 4 4.5v5h-8v-5z" />
        </svg>
        {unreadMessages > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,

            }}
          >
            {unreadMessages}
          </div>
        )}
      </div>
    </div>
  );
}

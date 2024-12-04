import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { TabBar } from "antd-mobile";
import { AppOutline, CalendarOutline, FileOutline, UserOutline } from "antd-mobile-icons";
import HomePage from "../homepage";
import ReservationPage from "../reservationpage/reservationpage";
import OrdersPage from "../orderInfopage/orderInfopage";
import UserInfoPagpe from "../userInfopage/userinfopage";
import Settings from "../settingpage/settingpage";
import EditPasswordPage from '../editPwdpage/editpwdpage';
import RechargePage from '../rechargepage/rechargepage';
import RechargeOrderPage from '../rechargeOrderpage/rechargeorderpage';
import MemberLevelPage from '../vipPowerpage/memberlevelPage';
import HoetelDetailPage from "../reservationpage/hoteldetailpage";
import HotelReservationPage from '../reservationpage/hotelreservationpage';
import RoomOrderHandlePage from '../roomorderhandlepage/RoomOrderHandlePage';
import "./IndexPage.css";

export default function IndexPage() {
  const [activeKey, setActiveKey] = useState("/home/homepage");
  const [keyCounter, setKeyCounter] = useState(0); // 用于强制刷新
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      key: "/home/homepage",
      title: "主页",
      icon: <AppOutline />,
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
      key: "/home/userInfo",
      title: "个人",
      icon: <UserOutline />,
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

  return (
    <div className="index-page">
      <div className="content">
        <Routes key={keyCounter}> {/* 强制刷新时改变 key */}
          <Route path="homepage" element={<HomePage />} />
          <Route path="reservation" element={<ReservationPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="userInfo" element={<UserInfoPagpe />} />
          <Route path="settings" element={<Settings />} />
          <Route path="editpwd" element={<EditPasswordPage />} />
          <Route path="recharge" element={<RechargePage />} />
          <Route path="rechargeOrderPay/:orderId" element={<RechargeOrderPage />} />
          <Route path="memberlevel" element={<MemberLevelPage />} />
          {/* 用户查看酒店可用房间信息页面 */}
          <Route path="hoteldetailPage/:hotelId" element={<HoetelDetailPage />}></Route>
          {/* 酒店预定详细信息页面 */}
          <Route path="hotelreservationpage/:roomId" element={<HotelReservationPage />} />
          <Route path='roomOrderHandle/:orderId' element={<RoomOrderHandlePage />} />
        </Routes>
      </div>
      <div className="router-box">
        <TabBar activeKey={activeKey} onChange={handleTabChange}>
          {tabs.map((tab) => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
}

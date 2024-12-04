import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Row,
  Col,
  Space,
  Divider,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./HotelReservationPage.css";
import axios from "axios";
import moment from "moment";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const HotelReservationPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [roomInfo, setRoomInfo] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  const [roomBookingDto, setRoomBookingDto] = useState(null);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => {
        setUserInfo(res.data.data);
      })
      .catch(() => {
        message.error("服务器异常");
      });
  }, []);

  useEffect(() => {
    if (location.state) {
      setCheckInDate(location.state.checkInDate);
      setCheckOutDate(location.state.checkOutDate);

      fetchRoomDetails(roomId);
    }
  }, [roomId, location.state]);

  const fetchRoomDetails = (id) => {
    axios
      .get(`/api/room/query`, {
        params: { roomId: id },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setRoomInfo(res.data.data);
        } else {
          console.error("获取房间详情失败");
        }
      })
      .catch((err) => {
        console.error("服务器异常", err);
      });
  };

  const calculateTotalPrice = () => {
    const newRoomBookingDto = {
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      memberLevel: userInfo.memberLevel,
    };

    axios.post("/api/room/calculatePrice", newRoomBookingDto).then((res) => {
      setTotalPrice(res.data.data);
      setRoomBookingDto(newRoomBookingDto); // 更新状态变量
    });
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && userInfo) {
      calculateTotalPrice();
    }
  }, [checkInDate, checkOutDate, userInfo]);

  const handleBack = () => {
    window.history.back();
  };

  const handleConfirmBooking = () => {
    if (!roomBookingDto) {
      message.error("请先选择房间和日期");
      return;
    }

    // 直接使用状态变量 roomBookingDto
    const updatedRoomBookingDto = {
      ...roomBookingDto,
      userPayAmount: totalPrice,
    };

    axios
      .post("/api/roomInfo/reserve", updatedRoomBookingDto)
      .then((res) => {
        if (res.data.code === 200) {
          message.success("创建订单成功，请前往支付");
          navigate(`/home/roomOrderHandle/${res.data.data}`);
        } else {
          message.error("创建订单失败");
        }
      })
      .catch(() => {
        message.error("服务器异常");
      });
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="reservation-page-container">
        <Row justify="space-between" align="middle" style={{ padding: "16px" }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <Title level={3}>确认预定</Title>
          <Button type="text">帮助</Button>
        </Row>
        {roomInfo && (
          <Card
            title={`您选择的房间：${roomInfo.roomName}`}
            style={{ margin: "16px" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Space direction="vertical">
                  <Text strong>入住时间：</Text>
                  <Text>
                    {location.state
                      ? moment(location.state.checkInDate).format("YYYY-MM-DD")
                      : ""}
                  </Text>
                </Space>
              </Col>
              <Col span={24}>
                <Space direction="vertical">
                  <Text strong>离店时间：</Text>
                  <Text>
                    {location.state
                      ? moment(location.state.checkOutDate).format("YYYY-MM-DD")
                      : ""}
                  </Text>
                </Space>
              </Col>
              <Col span={24}>
                <Space direction="vertical">
                  <Text strong>价格：</Text>
                  <Text>{roomInfo.todayPrice}元/晚</Text>
                </Space>
              </Col>
              <Col span={24}>
                <Space direction="vertical">
                  <Text strong>总价格：</Text>
                  <Text>{totalPrice.toFixed(2)}元</Text>
                </Space>
              </Col>
            </Row>
            <Divider />
            <Row justify="end" style={{ padding: "16px" }}>
              <Button type="primary" onClick={handleConfirmBooking}>
                提交订单
              </Button>
            </Row>
          </Card>
        )}
      </div>
    </ConfigProvider>
  );
};

export default HotelReservationPage;

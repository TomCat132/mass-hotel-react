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
  Tag,
  Radio,
  Checkbox,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./HotelReservationPage.css";
import axios from "../../axios";
import moment from "moment";
import { debounce } from "lodash";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks

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
  const dispatch = useDispatch();
  const selectedVoucher = useSelector(state => state.selectedVoucher); // Get selected voucher from Redux store
  const [validVoucherList, setValidVoucherList] = useState([]);

  const memberLevelDetails = [
    { level: "青铜", color: "brown", label: "青铜会员", discount: 1 },
    { level: "白银", color: "silver", label: "白银会员", discount: 0.95 },
    { level: "黄金", color: "gold", label: "黄金会员", discount: 0.9 },
    { level: "铂金", color: "blue", label: "铂金会员", discount: 0.85 },
    { level: "钻石", color: "purple", label: "钻石会员", discount: 0.8 },
  ];

  useEffect(() => {
    axios
      .get("/user")
      .then((res) => {
        setUserInfo(res.data.data);
      })
      .catch(() => {
        message.error("服务器异常");
      });
  }, []);

  /** 获取有效优惠券列表 */
  useEffect(() => {
    axios
      .get("/activity/voucher-list")
      .then((res) => {
        setValidVoucherList(res.data.data);
        console.log("validVoucherList", res.data.data);
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
      .get(`/room/query`, {
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

  /** 计算价格 */
  const calculateTotalPrice = () => {
    const newRoomBookingDto = {
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      memberLevel: userInfo.memberLevel,
      voucherId: selectedVoucher, // 传递选中的优惠券ID
    };

    axios.post("/room/calculatePrice", newRoomBookingDto).then((res) => {
      let calculatedPrice = res.data.data;
      setTotalPrice(calculatedPrice);
      setRoomBookingDto(newRoomBookingDto);
    });
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && userInfo) {
      calculateTotalPrice();
    }
  }, [checkInDate, checkOutDate, userInfo, selectedVoucher]);

  const handleBack = () => {
    window.history.back();
  };

  /** 重新计算价格 */
  const debouncedRecalculateTotalPrice = debounce((e) => {
    const voucherId = e.target.value;
    dispatch({ type: 'SET_SELECTED_VOUCHER', payload: voucherId });
    calculateTotalPrice();
  }, 300); // 300ms 的防抖延迟

  const handleConfirmBooking = () => {
    if (!roomBookingDto) {
      message.error("请先选择房间和日期");
      return;
    }

    const updatedRoomBookingDto = {
      ...roomBookingDto,
      userPayAmount: totalPrice,
    };

    axios
      .post("/roomInfo/reserve", updatedRoomBookingDto)
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
        <div className="top-nav">
          <Row style={{ padding: "10px" }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              返回
            </Button>
            <Title level={3}>确认预定</Title>
            <Button type="text">帮助</Button>
          </Row>
        </div>

        {roomInfo && (
          <Card
            className="card-container"
            title={`房间类型：${roomInfo.roomName}`}
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
            </Row>
            <Divider />
            {userInfo && (
              <div className="discountRegion">
                <Checkbox checked disabled className="box1">
                  {memberLevelDetails[userInfo.memberLevel].discount * 100}%
                </Checkbox>
                会员等级: &nbsp;
                <Tag color={memberLevelDetails[userInfo.memberLevel].color}>
                  {memberLevelDetails[userInfo.memberLevel].label}
                </Tag>
                <span className="check-box"></span>
              </div>
            )}
            <Divider />
            <div className="discountRegion">
              <p>优惠券减免:</p>
              <Radio.Group
                value={selectedVoucher} // Use selected voucher from Redux store
                onChange={debouncedRecalculateTotalPrice}
                className="voucherBox"
              >
                {validVoucherList.map((voucher) => (
                  <Radio
                    key={voucher.voucherId}
                    value={voucher.voucherId}
                    className="voucherItem"
                  >
                    {voucher.voucherTitle}
                  </Radio>
                ))}
              </Radio.Group>
              <span className="check-box"></span>
            </div>
            <Divider />
            <div className="totalPrice">
              <div className="content">
                <Text strong>最终支付金额:</Text>
                <Text className="priceValue">{totalPrice.toFixed(2)}元</Text>

                <Button
                  type="primary"
                  className="btn"
                  onClick={handleConfirmBooking}
                >
                  提交订单
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ConfigProvider>
  );
};

export default HotelReservationPage;
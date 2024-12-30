import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import "./roombookingpage.css";
import {
  Card,
  Spin,
  Alert,
  Descriptions,
  Tag,
  Typography,
  Button,
  Collapse,
} from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  PayCircleOutlined,
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Panel } = Collapse;

export default function RoomBookingPage() {
  const { orderId } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await axios.get(`/order/getRoomBookingBaseInfo/${orderId}`);
        if (res.data.code === 200) {
          setBookingData(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [orderId]);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" />;
  }

  if (!bookingData) {
    return <Alert message="No data available" type="warning" />;
  }

  const { roomOrder, orderStatus, roomInfo, room, hotel } = bookingData;

  const roomTypeMap = {
    0: "经济房",
    1: "标准房",
    2: "豪华房",
    3: "总统套房",
    4: "情侣房",
    5: "亲子房",
  };

  const orderStatusMap = {
    0: "待支付",
    1: "支付成功",
    2: "支付失败",
    3: "已取消",
    4: "退款中",
    5: "退款成功",
    6: "退款失败",
    7: "订单失效",
  };

  const payTypeMap = {
    0: "支付宝支付",
    1: "微信支付",
    2: "余额支付",
  };

  const roomDesc = JSON.parse(room.roomDesc);

  console.log(roomDesc);

  // 添加处理按钮点击的函数
  const handleContactSupport = () => {
    console.log("联系客户支持");
  };

  const handleCancelOrder = () => {
    console.log("取消订单");
  };

  const handleOnlineCheckIn = () => {
    console.log("线上办理入住");
  };

  return (
    <div style={{ padding: 2, paddingBottom: 20 }}>
      <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
        <Panel
          header={
            <span>
              <HomeOutlined /> 酒店信息
            </span>
          }
          key="1"
        >
          <Card bordered={false} style={{ backgroundColor: "#f0f2f5" }}>
            <Descriptions column={1}>
              <Descriptions.Item
                label={
                  <>
                    <HomeOutlined /> 酒店名称
                  </>
                }
              >
                {hotel.hotelName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined /> 地址
                  </>
                }
              >
                {hotel.address}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined /> 城市
                  </>
                }
              >
                {hotel.city}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <StarOutlined /> 星级
                  </>
                }
              >
                {hotel.starRating}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> 客服电话
                  </>
                }
              >
                {hotel.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 消费次数
                  </>
                }
              >
                {hotel.liveCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 酒店类型
                  </>
                }
              >
                {hotel.hotelType === 0 ? "经济型" : "其他"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Panel>

        <Panel
          header={
            <span>
              <MoneyCollectOutlined /> 订单信息
            </span>
          }
          key="3"
        >
          <Card bordered={false} style={{ backgroundColor: "#f0f2f5" }}>
            <Descriptions column={1}>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 订单号
                  </>
                }
              >
                {roomOrder.orderId}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PayCircleOutlined /> 支付金额
                  </>
                }
              >
                <Text strong className="s2">
                  {roomOrder.userPayAmount} 元
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> 订单创建时间
                  </>
                }
              >
                {roomOrder.createTime}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> 入住时间
                  </>
                }
              >
                {roomOrder.checkInDate}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> 离开时间
                  </>
                }
              >
                {roomOrder.checkOutDate}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 订单状态
                  </>
                }
              >
                <Tag
                  color={orderStatus.orderStatus === 1 ? "green" : "volcano"}
                >
                  {orderStatusMap[orderStatus.orderStatus]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PayCircleOutlined /> 支付方式
                  </>
                }
              >
                {payTypeMap[orderStatus.payType]}
                {orderStatus.payType === 2 && (
                  <Tag color="gold">查看账户余额</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> 支付时间
                  </>
                }
              >
                {orderStatus.payTime}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Panel>

        <Panel
          header={
            <span>
              <InfoCircleOutlined /> 房间信息
            </span>
          }
          key="2"
        >
          <Card bordered={false} style={{ backgroundColor: "#f0f2f5" }}>
            <Descriptions column={1}>
              <Descriptions.Item
                label={
                  <>
                    <HomeOutlined /> 房间名称
                  </>
                }
              >
                {room.roomName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 房间类型
                  </>
                }
              >
                <Tag color="red">{roomTypeMap[room.roomType]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <InfoCircleOutlined /> 房间描述
                  </>
                }
              ></Descriptions.Item>
              <Tag>规格: {roomDesc.bedInfo.bedType}</Tag>
              <Tag>
                数量:<Tag>{roomDesc.bedInfo.bedNum}</Tag>
              </Tag>
              <Tag>规格: {roomDesc.facilities.roomSize}</Tag>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 房间号
                  </>
                }
              >
                <span>{roomInfo.roomInfoId}</span> &nbsp;
                <Tag color="blue">{roomDesc.facilities.floor}楼</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TagOutlined /> 房间状态
                  </>
                }
              >
                <Tag color={roomInfo.status === 1 ? "green" : "red"}>
                  {roomInfo.status === 1 ? "可用" : "不可用"}
                </Tag>
              </Descriptions.Item>
              {roomInfo.type === 1 && (
                <Descriptions.Item>
                  <Tag color="blue">密码房 (可线上自助办理手续)</Tag>
                </Descriptions.Item>
              )}
              {roomInfo.type === 1 && (
                <Tag>
                  {" "}
                  <Button
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={handleOnlineCheckIn}
                  >
                    线上办理入住
                  </Button>
                </Tag>
              )}
            </Descriptions>
          </Card>
        </Panel>
      </Collapse>

      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <Button type="primary" onClick={handleContactSupport}>
          联系客服
        </Button>
      </div>
    </div>
  );
}

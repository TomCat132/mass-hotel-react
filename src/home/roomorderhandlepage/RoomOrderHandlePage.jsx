import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  message,
  Typography,
  Tag,
  Alert,
  Row,
  Col,
  Card,
  Modal,
  Input,
  Spin,
} from "antd";
import moment from "moment";
import axios from "axios";
import {
  CopyOutlined,
  AlipayCircleOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import "./RoomOrderHandlePage.css";

const { Title, Text } = Typography;

// 定义订单状态映射
const orderStatusMap = {
  0: "待支付",
  1: "支付成功",
  2: "支付失败",
  3: "已取消",
  4: "退款中",
  5: "退款成功",
  6: "退款失败",
  7: "订单失效"
};

export default function RoomOrderHandlePage() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
            `/api/roomOrder/queryOrder/${orderId}`
        );
        const orderData = response.data.data;
        setOrderDetails(orderData);

        const createTime = moment(orderData.roomOrder.createTime);
        const expirationTime = createTime.add(5, "minutes");
        const now = moment();
        const duration = moment.duration(expirationTime.diff(now));
        setTimeLeft(duration.asMilliseconds());
      } catch (error) {
        message.error("Failed to fetch order details");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 10 : 0));
    }, 10); // Update every 10 milliseconds for smoother countdown

    return () => clearInterval(timer);
  }, [timeLeft]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const Alipay = () => {
    setIsModalVisible(false);

    if (timeLeft <= 0) {
      message.error("订单已过期，无法进行支付");
      return;
    }

    const orderPayDto = {
      orderId: orderId,
      userPayAmount: orderDetails.roomOrder.userPayAmount,
      orderType: 0,
      subject: "充值服务订单",
    };

    axios
        .post("/api/alipay/window", orderPayDto)
        .then((res) => {
          if (res.data.code === 200) {
            formRef.current.innerHTML = res.data.data;
            const form = formRef.current.querySelector("form");
            form.submit();
          } else {
            message.error(res.data.message);
          }
        })
        .catch(() => {
          message.error("系统繁忙，请稍后重试~");
        });
  };

  const WeiXinpay = () => {
    message.error("微信支付尚未开通");
  };

  const AccountPay = () => {
    if (timeLeft <= 0) {
      message.error("订单已过期，无法进行支付");
      return;
    }

    setIsPasswordModalVisible(true);
  };

  const handleAccountPaySubmit = async () => {
    try {
      const response = await axios.post("/api/user/checkPwd", null, {
        params: {
          oldPwd: password, // 使用状态中的密码
        },
      });

      if (response.data.code === 200) {
        setIsPasswordModalVisible(false);
        // 可以在这里刷新页面或者更新订单状态

        const orderPayDto = {
          orderId: orderId,
          userPayAmount: orderDetails.roomOrder.userPayAmount,
          payType: 2,
        };

        axios
            .post("/api/roomOrder/createRoomOrderInfo", orderPayDto)
            .then((res) => {
              if (res.data.code === 200) {
                message.success(res.data.data);
                setIsModalVisible(false);
              } else if (res.data.code === 400) {
                // 余额不足，选择其他支付方式
                setIsModalVisible(true);
                message.error("余额不足，请选择其他支付方式");
              }
            })
            .catch(() => {
              message.error("服务器繁忙");
            });
      } else {
        message.error("密码错误");
      }
    } catch (error) {
      message.error("系统繁忙，请稍后重试~");
    }
  };

  const handleCopy = () => {
    copy(orderId);
    message.success("订单号已复制");
  };

  if (!orderDetails) {
    return (
        <div className="loading-container">
          <Spin size="large" />
          <Text>加载中...</Text>
        </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const milliseconds = timeLeft % 1000;

  const formattedTimeLeft = `${String(minutes).padStart(2, "0")}:${String(
      seconds
  ).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;

  return (
      <div className="order-payment-page-container">
        <Card className="order-card">
          <Alert
              message="订单将在5分钟内失效"
              type="warning"
              showIcon
              banner
              closable={false}
              style={{ marginBottom: 16 }}
          />
          <div className="header">
            <Title level={3} className="title">
              支付订单
            </Title>
            <Text className="subtitle">请确认订单并完成支付</Text>
          </div>
          <div className="order-details">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text>
                  <Tag color="blue">订单号</Tag>:{" "}
                  <Tag style={{ cursor: "pointer" }}>{orderId}</Tag>
                </Text>
                <CopyOutlined
                    onClick={handleCopy}
                    style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Col>
              <Col span={24}>
                <Text>
                  <Tag color="green">支付金额</Tag>: ¥
                  {orderDetails.roomOrder.userPayAmount.toFixed(2)}
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  <Tag color="gold">总金额</Tag>: ¥
                  {orderDetails.roomOrder.userPayAmount.toFixed(2)}
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  <Tag color="purple">创建时间</Tag>:{" "}
                  {orderDetails.roomOrder.createTime}
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  <Tag color="red">订单状态</Tag>:{" "}
                  {orderStatusMap[orderDetails.orderStatus.orderStatus] || "未知状态"}
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  <Tag color="volcano">有效时间</Tag>:{" "}
                  {timeLeft > 0 ? formattedTimeLeft : "已过期"}
                </Text>
              </Col>
            </Row>
          </div>
          <div className="button-container">
            <Button
                type="primary"
                onClick={showModal}
                size="large"
                disabled={timeLeft <= 0}
            >
              确认支付
            </Button>
          </div>
        </Card>
        <div ref={formRef}></div>

        <Modal
            title="选择支付方式"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
        >
          <div className="payment-options">
            <Button
                icon={<AlipayCircleOutlined />}
                size="large"
                onClick={() => Alipay()}
                style={{ width: "100%", marginBottom: "16px" }}
            >
              支付宝支付
            </Button>
            <Button
                icon={<WechatOutlined />}
                size="large"
                onClick={() => WeiXinpay()}
                style={{ width: "100%" }}
            >
              微信支付
            </Button>
            <Button
                icon={<WechatOutlined />}
                size="large"
                onClick={() => AccountPay()}
                style={{ width: "100%", marginTop: "16px" }}
            >
              余额支付
            </Button>
          </div>
        </Modal>

        <Modal
            title="请输入密码"
            visible={isPasswordModalVisible}
            onOk={handleAccountPaySubmit}
            onCancel={() => setIsPasswordModalVisible(false)}
            okText="确定"
            cancelText="取消"
        >
          <Input.Password
              placeholder="输入您的密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleAccountPaySubmit}
          />
        </Modal>
      </div>
  );
}

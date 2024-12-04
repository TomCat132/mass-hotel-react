import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons"; // 删除 Popconfirm 的导入
import {
  List,
  Card,
  Button,
  Skeleton,
  Typography,
  Input,
  Space,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import "./orderInfoPage.css";

const { Text } = Typography;

export default function OrderInfoPage() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const getOrderList = async () => {
    try {
      const response = await axios.get("/api/user/orderlist");
      setOrderList(response.data.data);
    } catch (err) {
      console.error("Failed to fetch order list:", err);
      setError(err.message || "Failed to load order list.");
    } finally {
      setLoading(false);
    }
  };

  /**删除订单 */
  const deleteOrder = async (orderId) => {
    try {
      await axios.put(`/api/user/deleteOrderById/${orderId}`);
      setOrderList(orderList.filter((order) => order.orderId !== orderId));
      message.success("订单删除成功！");
    } catch (err) {
      console.error("Failed to delete order:", err);
      message.error("订单删除失败，请稍后重试。");
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  if (loading) return <Skeleton active />;
  if (error) return <div>Error: {error}</div>;

  // 过滤订单列表
  const filteredOrders = orderList.filter(
    (order) =>
      order.orderId.includes(searchText) ||
      order.orderType.toString().includes(searchText) ||
      order.orderStatus.toString().includes(searchText)
  );

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 0:
        return "green";
      case 1:
        return "red";
      case 2:
        return "black";
      default:
        return "gray";
    }
  };

  const renderOrderType = (orderId) => {
      // 截取orderId 的前4位
      const type = parseInt(orderId.substring(0, 4));
      console.log("订单类型", type)
      const typeText = type === 1013 ? "充值" : "消费";
      return <Text strong>{typeText}</Text>;
  };

  const goToOrderInfoPage = (orderId) => {
    // 截取订单号的前4位
    const orderPrefix = orderId.substring(0, 4);

    // 根据订单前缀决定跳转的页面
    if (orderPrefix === "1013") {
      // 如果是充值订单，跳转到充值订单支付页面
      navigate(`/home/rechargeOrderPay/${orderId}`);
    } else if (orderPrefix === "1014") {
      // 如果是房间订单，跳转到房间订单处理页面
      navigate(`/home/roomOrderHandle/${orderId}`);
    } else {
      // 对于其他类型的订单，可以设置一个默认的处理方式或者抛出错误
      console.error("未知订单类型:", orderId);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div
          style={{
            position: "fixed",
            top: 0, // 搜索框固定在顶部
            zIndex: 1, // 确保搜索框位于内容之上
            background: "#fff", // 可选：为搜索框设置背景色，以防止文字重叠
          }}
        >
          <div className="dnf1">
            <Input.Search
              placeholder="输入订单号进行搜索"
              onSearch={(value) => setSearchText(value)}
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: "149%" }}
            />
          </div>
        </div>
        <List
          style={{
            margin: "10px 0",
          }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
            xxl: 6,
          }}
          dataSource={filteredOrders}
          renderItem={(item) => (
            <List.Item>
              <Card
                className="orderInfo"
                title={`订单号: ${item.orderId}`}
                extra={
                  <Space>
                    <Button
                      type="link"
                      onClick={() => goToOrderInfoPage(item.orderId)}
                    >
                      查看详情
                    </Button>
                    <Popconfirm
                      title="确定要删除此订单吗？"
                      onConfirm={() => deleteOrder(item.orderId)}
                      okText="是"
                      cancelText="否"
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <div className="orderInfo">
                  <p>类型：{renderOrderType(item.orderId)}</p>
                  <p className="status">
                    订单状态：
                    <Text
                      style={{ color: getPaymentStatusColor(item.orderStatus) }}
                    >
                      {(item.orderStatus === 0 && "未支付") ||
                        (item.orderStatus === 1 && "已支付") ||
                        (item.orderStatus === 2 && "支付失败") ||
                        (item.orderStatus === 3 && "已取消") ||
                        (item.orderStatus === 4 && "退款中") ||
                        (item.orderStatus === 5 && "退款成功") ||
                        (item.orderStatus === 6 && "退款失败") ||
                        (item.orderStatus === 7 && "订单失效") ||
                        "未知状态"}
                    </Text>
                  </p>
                  <p>创建时间：{new Date(item.createTime).toLocaleString()}</p>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
}

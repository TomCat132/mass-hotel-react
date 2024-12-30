import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
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
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import "./orderInfoPage.css";

const { Text } = Typography;

// 订单状态映射
const orderStatusMap = {
  0: "未支付",
  1: "已支付",
  2: "支付失败",
  3: "已取消",
  4: "退款中",
  5: "退款成功",
  6: "退款失败",
  7: "订单失效",
};

// 状态颜色映射
const statusColorMap = {
  0: "green", // 未支付
  1: "blue", // 已支付
  2: "red", // 支付失败
  3: "orange", // 已取消
  4: "purple", // 退款中
  5: "green", // 退款成功
  6: "red", // 退款失败
  7: "gray", // 订单失效
};

export default function OrderInfoPage() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const getOrderList = async () => {
    try {
      const response = await axios.get("/user/orderlist");
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
      await axios.put(`/user/deleteOrderById/${orderId}`);
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

  const renderOrderTypeText = (orderId) => {
    const type = parseInt(orderId.substring(0, 4));
    console.log("订单类型", type);
    return type === 1013 ? "充值" : "消费";
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
            background: "#fff",
            verticalAlign: "middle",
            width: "62%",
            marginLeft: "4%"
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
            margin: "1% 1%",
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
                title={`类型: ${renderOrderTypeText(item.orderId)}`} // 直接调用 renderOrderType
                extra={
                  <Space>
                    <Button
                       type="primary"
                    
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
                   <Button type="primary" danger>删除</Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <div className="orderInfo">
                  <p>订单号 {item.orderId}</p>

                  <p className="status">
                    订单状态：
                    <Text
                      style={{
                        color: statusColorMap[item.orderStatus] || "black",
                      }}
                    >
                      {orderStatusMap[item.orderStatus] || "未知状态"}
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

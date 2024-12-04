import React, { useState, useEffect } from "react";
import { Progress, Button, message, Row, Col, Typography, Tag } from "antd";
import { useNavigate } from 'react-router-dom';
import moment from "moment-timezone";
import "antd/dist/reset.css"; // 确保全局引入Ant Design样式
import "./rechargepage.css";
import axios from "axios";

const { Title, Text } = Typography;

export default function RechargePage() {
  const [rechargePlans, setRechargePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [balance, setBalance] = useState(200.0); // 假设初始余额为200.00
  const [levelProgress, setLevelProgress] = useState(50); // 假设当前进度为50%
  const [timeLeft, setTimeLeft] = useState([]);
  const [orderId, setOrderId] = useState();
  const navigate = useNavigate();
  const fetchRechargePlans = async () => {
    try {
      const response = await axios.get(
        "/api/rechargePlan/validRechargePlanList"
      );
      const plans = response.data.data;
      console.log("Fetched plans:", plans);
      setRechargePlans(plans);
    } catch (error) {
      console.error("Failed to fetch recharge plans:", error);
    }
  };
  useEffect(() => {
    // 只调用一次
    fetchRechargePlans();

  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (rechargePlans.length > 0) {
        const now = moment().tz("Asia/Shanghai"); // 设置时区
        const updatedTimeLeft = rechargePlans.map((plan) => {
          const expiration = moment.tz(plan.expirationDate, "Asia/Shanghai"); // 确保时区一致
          if (now.isAfter(expiration)) {
            return fetchRechargePlans();
          } else {
            const duration = moment.duration(expiration.diff(now));
            const days = Math.floor(duration.asDays());
            const hours = Math.floor(duration.asHours() % 24);
            const minutes = duration.minutes();
            const seconds = duration.seconds();
            return {
              planId: plan.planId,
              timeLeft: `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`,
            };
          }
        });
        setTimeLeft(updatedTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rechargePlans]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  /** 创建订单 */
  const handleRecharge = () => {
    if (selectedPlan) {
      // 这里可以调用实际的充值接口
      console.log("Selected Plan:", selectedPlan);
      const rechargeDto = {
        planId: selectedPlan.planId,
        userPayAmount: selectedPlan.userPayAmount,
        bonusAmount: selectedPlan.bonusAmount,
      };
      axios.post("/api/rechargeOrder/createOrder", rechargeDto).then((res) => {
        if (res.data.code === 200) {
          setOrderId(res.data.data);
          navigate(`/home/rechargeOrderPay/${res.data.data}`)
          message.success("充值订单创建成功！");
        } else {
           message.error(res.data.message)
        }
      })
        .catch(() => {
          message.error("系统繁忙，请稍后重试~")
        });
    } else {
      message.error("请选择一个充值方案！");
    }
  };

  const getTimeLeft = (planId) => {
    const planTimeLeft = timeLeft.find((t) => t.planId === planId);
    return planTimeLeft ? planTimeLeft.timeLeft : "计算中...";
  };

  return (
    <div className="recharge-page-container">
      <div className="header">
        <Title level={3} className="title">
          充值中心
        </Title>
        <Text className="subtitle">选择充值方案并完成订单</Text>
      </div>
      <Row className="progress-bar" justify="center">
        <Col span={24}>
          <Text>
            {" "}
            <Tag className="current-member-level">青铜会员</Tag>
            <span>升级到 </span>{" "}
            <Tag className="next-member-level">白银会员</Tag>
          </Text>
          <Progress percent={levelProgress} showInfo={false} />
        </Col>
      </Row>
      <div className="account-balance">
        <Text>
          <Tag>账户余额</Tag>: ¥{balance.toFixed(2)}
        </Text>
      </div>
      <div className="recharge-plan-container">
        {rechargePlans.length > 0 ? (
          rechargePlans.map((plan) => (
            <div key={plan.planId} className="recharge-plan-card">
              {plan.planType === 1 && <div className="plan-type">活动</div>}
              <div>充值金额: ¥{plan.userPayAmount.toFixed(2)}</div>
              <div className="bonus-amount">
                赠送金额: ¥{plan.bonusAmount.toFixed(2)}
              </div>
              <div>总金额: ¥{plan.totalAmount.toFixed(2)}</div>
              <div className="expiration-date">
                到期时间: {getTimeLeft(plan.planId)}
              </div>
              <Button
                type="primary"
                style={{
                  marginTop: "8px",
                  backgroundColor:
                    selectedPlan && selectedPlan.planId === plan.planId
                      ? "grey"
                      : "",
                }}
                onClick={() => handleSelectPlan(plan)}
                disabled={selectedPlan && selectedPlan.planId === plan.planId}
              >
                {selectedPlan && selectedPlan.planId === plan.planId
                  ? "已选择"
                  : "选择"}
              </Button>
            </div>
          ))
        ) : (
          <div>加载中...</div> // 或者显示一个加载动画
        )}
      </div>
      <div className="button-container">
        <Button type="primary" onClick={handleRecharge} size="large">
          创建订单
        </Button>
      </div>
    </div>
  );
}

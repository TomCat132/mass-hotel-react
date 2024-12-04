import React from "react";
import { Form, Input, Button, Card, Typography, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const user = {
      phone: values.phone,
      password: values.password,
    };
    axios
      .post("/api/user/login", user)
      .then((res) => {
        if (res.data.code === 200) {
          message.success(res.data.data);
          navigate("/home/homepage")
        } else {
          message.error(res.data.message);
        }
      })
      .catch(() => {
        message.error("服务器异常");
      });
  };

  return (
    <div className="login-background">
      <div className="header-title">
        <Title level={2} style={{ color: "#ffffff" }}>
          便携旅行
        </Title>
      </div>
      <Row
        justify="center"
        align="middle"
        style={{ height: "100vh", width: "95vw" }}
      >
        <Col xs={22} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              width: "105%",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "transparent",
              border: "1px solid #ffffff",
            }}
          >
            <Title level={2} style={{ textAlign: "center" }}>
              登录
            </Title>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "手机号不能为空" }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="请输入手机号"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "密码不能为空" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="请输入密码"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link to="/register">没有账户？去注册</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;

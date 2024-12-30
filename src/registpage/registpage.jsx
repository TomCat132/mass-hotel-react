import React from "react";
import { Form, Input, Button, Card, Typography, Row, Col, message } from "antd";
import { UserOutlined, PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import "./registpage.css";
import axios from "../axios";

import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const regist = (values) => {
    const user = {
      username: values.username,
      phone: values.phone,
      password: values.password,
    };
    axios
      .post("/user/register", user)
      .then((res) => {
        if (res.data.code === 200) {
      
          navigate('/login');
          message.success("注册成功");
        } else {
          message.error(res.data.message);
      
        }
      })
      .catch((err) => {
        message.error("服务器异常");
      });
  };

  return (
    <div className="register-background">
      <Row
        className="box-1"
        justify="center"
        align="top"
        style={{ height: "50vh", width: "95vw" }}
      >
        <Col xs={22} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              width: "105%",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "transparent",
              border: "1px solid #fff",
            }}
          >
            <Title level={2} style={{ textAlign: "center" }}>
              注册
            </Title>
            <Form
              name="register"
              initialValues={{ remember: true }}
              layout="vertical"
              onFinish={regist}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "用户名不能为空" }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="请输入用户名"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "手机号不能为空" }]}
              >
                <Input
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
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
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "请确认密码" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("密码不匹配"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="确认密码"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link to="/login">已有账号？去登录</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
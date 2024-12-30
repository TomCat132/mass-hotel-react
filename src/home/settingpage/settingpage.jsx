import React from "react";
import { List, Space, Modal, message } from "antd";
import {
  SettingOutlined,
  KeyOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "antd/dist/reset.css"; // 确保全局引入Ant Design样式
import "./settingpage.css";
import axios from "../../axios";

export default function SettingPage() {
  const navigate = useNavigate();

  /** 退出登陆 */
  const logout = () => {
    Modal.confirm({
      title: "确认退出",
      content: "你确定要退出登录吗？",
      cancelText: "取消",
      okText: "确认",
      style: { top: 250 },
      onOk: () => {
        axios
          .post("/user/logout")
          .then((res) => {
            if (res.data.code === 200) {
              message.success(res.data.data);
              sessionStorage.removeItem("userInfo");
              sessionStorage.removeItem("isSigned");
            } else {
              message.error(res.data.data);
            }
          })
          .catch((error) => {
            console.error("退出时发生错误", error);
          })
          .finally(() => {
            navigate("/");
          });
      },
    });
  };

  /** 前往修改密码页面 */
  const gotoEditPwdPage = () => {
    navigate("/home/editpwd");
  };

  const items = [
    {
      title: "修改个人信息",
      icon: <SettingOutlined />,
    },
    {
      title: "修改密码",
      icon: <KeyOutlined />,
      action: gotoEditPwdPage,
    },
    {
      title: "退出登陆",
      icon: <PoweroffOutlined />,
      action: logout,
    },
  ];

  return (
    <div className="setting-page-container">
      <List
        className="button-box"
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item onClick={item.action}>
            <div className="item">
              <Space className="button-tar">
                <span>{item.icon}</span>
                <div>{item.title}</div>
                <span></span>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

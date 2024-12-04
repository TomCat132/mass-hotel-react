import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message, Button, Row, Col } from "antd";
import {
  AppstoreOutlined,
  GiftOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./UserInfoPage.css";

export default function UserInfoPage() {
  const [userInfo, setUserInfo] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 使用 Promise.all 来等待所有请求完成
        const [userResponse, signResponse] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/usersign/signed"),
        ]);

     
          axios.get("/api/oss/api/convert", {
            params: {
             url: userResponse.data.data.avatarKey
           }
          }).then(res => {
            if (res === 8001) {
              message.error("数据异常");
            } else {
              setUserInfo(user => ({
                ...user,
                avatarKey: res.data
              }));
            }
          });
       
        
  
        setUserInfo(userResponse.data.data);
        setIsSigned(signResponse.data);
      } catch (error) {
        // 统一处理错误
        message.error("部分功能正在维护");
      }
    };

    fetchUserData();
  }, []);

  /**===== 用户签到 =====*/
  const userSign = () => {
    axios
      .post("/api/usersign")
      .then((res) => {
        if (res.data.code === 200) {
          setIsSigned(!isSigned);
          message.success(res.data.data);
        } else {
          message.error(res.data.message);
        }
      })
      .catch(() => {
        message.error("系统繁忙，请稍后重试~");
      });
  };

  /**  前往设置页面 */
  const goToSettings = () => {
    navigate("/home/settings");
  };

  /** 前往充值方案页面 */
  const goToRechargePage = () => {
    navigate("/home/recharge");
  };

  /** 前往 会员权益页面 */
  const gotoMemberLevelPage = () => {
    navigate("/home/memberlevel")
  }

  /** 选择头像 */
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  /** 修改头像 */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/api/user/editavatar", formData, {})
        .then((res) => {
          if (res.data.code === 200) {
            // 更新头像
            setUserInfo({ ...userInfo, avatarKey: URL.createObjectURL(file) });
            message.success("头像更新成功");
          } else {
            message.error(res.data.message);
          }
        })
        .catch(() => {
          message.error("头像上传失败，请稍后重试");
        });
    }
  };

  return (
    <div className="user-info-page">
      <div className="user-info-header">
        <img
          className="user-avatar"
          src={userInfo.avatarKey || "https://via.placeholder.com/40"}
          alt="User Avatar"
          onClick={handleAvatarClick}
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*" // 确保只接受图片文件
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="user-name">{userInfo.username}</div>
      </div>
      <div className="user-info-list">
        <div className="user-info-item">
          <span className="user-info-label">注册时间:</span>
          <span className="user-info-value">{userInfo.registrationTime}</span>
        </div>
        <div className="user-info-item">
          <span className="user-info-label">登录时间:</span>
          <span className="user-info-value">{userInfo.lastLoginTime}</span>
        </div>
        <div className="user-info-item">
          <span className="user-info-label">账户余额:</span>
          <span className="user-info-value">
            ￥{userInfo.account?.toFixed(2)}
          </span>
        </div>
        <div className="user-info-item">
          <span className="user-info-label">会员等级:</span>
          <div className="user-member-level">
            {userInfo.memberLevel === 0 && <span>青铜会员</span>}
            {userInfo.memberLevel === 1 && <span>白银会员</span>}
            {userInfo.memberLevel === 2 && <span>黄金会员</span>}
            {userInfo.memberLevel === 3 && <span>铂金会员</span>}
            {userInfo.memberLevel === 4 && <span>钻石会员</span>}
          </div>
        </div>
      </div>
      <div className="title">
        <span className="title-one">
          {" "}
          <AppstoreOutlined /> 功能模块
        </span>
      </div>
      <hr />
      <div className="user-actions">
        <Row gutter={[5, 5]}>
          <Col span={12}>
            <Button type="primary" block onClick={goToRechargePage}>
              账户充值
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={gotoMemberLevelPage}>
              会员权益
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block>
              积分商城
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block>
              优惠活动
            </Button>
          </Col>
        </Row>
      </div>
      <hr />
      <div className="daily-features">
        <span className="title-one">
          {" "}
          <GiftOutlined /> 每日福利
        </span>
        <div
          className={`sign-box sign ${isSigned ? "signed" : ""}`}
          onClick={userSign}
        >
          {isSigned ? (
            <span className="sign-text">
              已签到 <span className="check-mark">✔</span>
            </span>
          ) : (
            <span className="sign-text">签到</span>
          )}
        </div>
      </div>
      <hr />
      <div className="today-features">
        <span className="title-one">
          <TagOutlined /> 今日特惠
        </span>
      </div>
      <SettingOutlined className="settings-icon" onClick={goToSettings} />{" "}
      {/* 添加 onClick 处理程序 */}
    </div>
  );
}

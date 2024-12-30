import React, { useState, useEffect, useRef } from "react";
import axios from "../../axios";
import { message, Button, Row, Col } from "antd";
import {
  AppstoreOutlined,
  GiftOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../components/CustomLoader";
import "./UserInfoPage.css";

export default function UserInfoPage() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, signResponse] = await Promise.all([
          axios.get("/user"),
          axios.get("/usersign/signed"),
        ]);

        axios
          .get("/oss/api/convert", {
            params: {
              url: userResponse.data.data.avatarKey,
            },
          })
          .then((res) => {
            if (res === 8001) {
              message.error("数据异常");
            } else {
              setUserInfo((user) => ({
                ...user,
                avatarKey: res.data,
              }));
              setLoading(false)
            }
          });

        setUserInfo(userResponse.data.data);
        setIsSigned(signResponse.data);
      } catch (error) {
        message.error("部分功能正在维护");
      } finally {
        setTimeout(() => setLoading(false), 1);
      }
    };

    fetchUserData();
  }, []);

  const userSign = () => {
    axios
      .post("/usersign")
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

  const goToSettings = () => {
    navigate("/home/settings");
  };

  const goToRechargePage = () => {
    navigate("/home/recharge");
  };

  const gotoMemberLevelPage = () => {
    navigate("/home/memberlevel");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/user/editavatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
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
    <>
      {loading && <CustomLoader />}
      <div className={`user-info-page ${loading ? 'hidden' : ''}`}>
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
            accept="image/*"
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
            <AppstoreOutlined /> 功能应用
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
        <SettingOutlined className="settings-icon" onClick={goToSettings} />
      </div>
    </>
  );
}
import React, { useEffect, useState } from "react";
import { Input, Select, List, Typography, Divider, Card, message } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./ReservationPage.css"; // 引入自定义样式
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const ReservationPage = () => {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [Radius, setRadius] = useState(1);
  const [hotels, setHotelList] = useState([]);

  /** 获取用户的位置 */
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  /** 查询酒店列表 */
  const getHotelList = () => {
    axios
      .get("/api/hotel/getNearByHotelList", {
        params: {
          userLng: longitude || 104.085907, // 使用用户的经度，如果没有则使用默认值
          userLat: latitude || 30.5335, // 使用用户的纬度，如果没有则使用默认值
          queryRange: Radius,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          if (res.data.data !== null) {
            setHotelList(res.data.data);
          } else {
            setHotelList(null);
          }
        }
      })
      .catch(() => {
        message.error("服务器异常");
      });
  };

  /**用户选择范围半径时触发 */
  const handleRadiusChange = (value) => {
    setRadius(value);
    message.success("已更改搜索范围")
  };

  /** 查看酒店详细可用房间类型列表 */
  const goToHotelDetailPage = (hotelId) => {
    navigate(`/home/hoteldetailPage/${hotelId}`);
  };

  useEffect(() => {
    setTimeout(() => {
      getUserLocation();
    }, 1000);
  }, []);

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getHotelList();
  }, [Radius]); // 只有当 Radius 发生变化时才重新获取酒店列表

  return (
    <div className="reservation-container">
      <div className="search-section">
        <Input.Search
          placeholder="输入关键词搜索"
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: "100%" }}
        />
      </div>

      <div className="options-section">
        <div className="location-info">
          <EnvironmentOutlined />
          <Text strong>成都</Text>
        </div>
        <div className="radius-selector">
          <Select
            defaultValue={""}
            onChange={handleRadiusChange}
            style={{ width: "100%" }}
            size="large"
          >
            <Option value={""}>1 km </Option>
            <Option value={1}>1 km</Option>
            <Option value={5}>5 km</Option>
            <Option value={10}>10 km</Option>
            <Option value={20}>20 km</Option>
          </Select>
        </div>
      </div>

      <Divider />

      <div className="hotel-list">
        <List
          itemLayout="horizontal"
          dataSource={hotels}
          renderItem={(item) => (
            <Card
              className="hotel-card"
              bordered={true}
              onClick={() => goToHotelDetailPage(item.hotelId)} // 添加点击事件处理器
            >
              <div className="hotelData">
                <Title level={5} className="hotelName">
                  {item.hotelName}
                </Title>
                <Text className="address">{item.address}</Text>
                <div className="hotel-details">
                  <span className="distance">{item.distance.toFixed(2)}km</span>
                  <span className="minPrice">起价: ¥{item.minPrice}</span>
                </div>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default ReservationPage;

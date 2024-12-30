import React, { useEffect, useState } from "react";
import {
  Input,
  List,
  Typography,
  Divider,
  Card,
  message,
  Spin,
  Button,
} from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./ReservationPage.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLocation } from "../../store/store.js";

const { Title, Text } = Typography;

const ReservationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useSelector((state) => state.location);
  const [radius, setRadius] = useState(100);
  const [hotels, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserLocation = () => {
    axios
      .get("/account/get-user-location-info")
      .then((res) => {
        const { lat, lon, city } = res.data.data;
        dispatch(setLocation({ latitude: lat, longitude: lon, city: city }));
        message.success("已定位您的位置信息~");
        getHotelList(lat, lon);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getHotelList = (lat, lon) => {
    setLoading(true);
    axios
      .get("/hotel/getNearByHotelList", {
        params: {
          userLng: lon,
          userLat: lat,
          queryRange: radius,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setHotelList(res.data.data);
        }
      })
      .catch(() => {
        message.error("服务器异常");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  const handleSearch = () => {
    if (isNaN(radius) || radius <= 0) {
      message.error("请输入有效的搜索范围");
      return;
    }
    message.success("已更改搜索范围");
    getHotelList(location.latitude, location.longitude);
  };

  const goToHotelDetailPage = (hotelId) => {
    navigate(`/home/hoteldetailPage/${hotelId}`);
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getHotelList(location.latitude, location.longitude);
      setLoading(false);
    } else {
      getUserLocation();
    }
  }, [JSON.stringify(location)]);

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
          <EnvironmentOutlined onClick={getUserLocation}/>
          <Text strong> {location.city}</Text>
        </div>
        <div className="radius-selector">
          <Input
            placeholder="输入搜索范围 (km)"
            onChange={handleRadiusChange}
            style={{ width: "75%", marginRight: "2px" }}
            size="midle"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="midle"
            onClick={handleSearch}
          >
          </Button>
        </div>
      </div>


      <Spin spinning={loading}>
        <div className="hotel-list">
          <List
            itemLayout="horizontal"
            dataSource={hotels}
            renderItem={(item) => (
              <Card
                className="hotel-card"
                bordered={true}
                onClick={() => goToHotelDetailPage(item.hotelId)}
              >
                <div className="hotelData">
                  <Title level={5} className="hotelName">
                    {item.hotelName}
                  </Title>
                  <Text className="address">{item.address}</Text>
                  <div className="hotel-details">
                    <span className="distance">
                      {item.distance.toFixed(2)}km
                    </span>
                    <span className="minPrice">起价: ¥{item.minPrice}</span>
                  </div>
                </div>
              </Card>
            )}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ReservationPage;
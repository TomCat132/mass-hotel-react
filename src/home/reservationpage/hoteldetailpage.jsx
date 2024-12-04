import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker, List, Card, Typography, Button, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import './HotelDetailPage.css';
import axios from 'axios';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

const { Title, Text } = Typography;

const HotelDetailPage = () => {
  const [checkInDate, setCheckInDate] = useState(moment()); // 默认今天
  const [checkOutDate, setCheckOutDate] = useState(moment().add(1, 'days')); // 默认明天
  const [roomList, setRoomList] = useState([]);
  const { hotelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomList();
  }, [hotelId, checkInDate, checkOutDate]);

  /**获取酒店符合条件的房间类型 */
  const fetchRoomList = () => {
    if (!checkInDate || !checkOutDate) return;
    axios
      .get('/api/hotel/getHotelRoomTypeList', {
        params: {
          hotelId: hotelId,
          checkInDate: checkInDate.format('YYYY-MM-DD'),
          checkOutDate: checkOutDate.format('YYYY-MM-DD')
        }
      })
      .then((res) => {
        if (res.data.code === 200) {
          setRoomList(res.data.data);
        } else {
          message.error('获取房间列表失败');
        }
      })
      .catch(() => {
        message.error('服务器异常');
      });
  };

  const handleCheckInDateChange = (date) => {
    if (date && date.isSameOrAfter(checkOutDate)) {
      message.error('入住时间不能晚于或等于离店时间');
      return;
    }
    setCheckInDate(date);
    fetchRoomList();
  };

  const handleCheckOutDateChange = (date) => {
    if (date && date.isSameOrBefore(checkInDate)) {
      message.error('离店时间不能早于或等于入住时间');
      return;
    }
    setCheckOutDate(date);
    fetchRoomList();
  };

  const handleBookRoom = (roomId) => {
    navigate(`/home/hotelreservationpage/${roomId}`, {
      state: {
        checkInDate: checkInDate.format('YYYY-MM-DD'),
        checkOutDate: checkOutDate.format('YYYY-MM-DD')
      }
    });
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="hotel-detail-container">
        <div className="date-picker-section">
          <Title level={3}>请选择您的入住时间：</Title>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DatePicker
              value={checkInDate}
              placeholder="选择入住时间"
              onChange={handleCheckInDateChange}
              suffixIcon={<CalendarOutlined />}
            />
            <DatePicker
              value={checkOutDate}
              placeholder="选择离店时间"
              onChange={handleCheckOutDateChange}
              suffixIcon={<CalendarOutlined />}
              style={{ marginLeft: 16 }}
            />
          </div>
        </div>

        <div className="room-list-section">
          <Title level={3}>房间类型列表</Title>
          <List
            itemLayout="vertical"
            dataSource={roomList}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.roomName} bordered={true}>
                  <p><Text strong>今日价格：</Text>{item.todayPrice}</p>
                  <p><Text strong>剩余房间数：</Text>{item.roomCount}</p>
                  <p><Text strong>原价：</Text>{item.oldPrice}</p>
                  <Button type="primary" block onClick={() => handleBookRoom(item.roomId)}>
                    预订
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HotelDetailPage;
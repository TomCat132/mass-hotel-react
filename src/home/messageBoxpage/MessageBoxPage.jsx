import React, { useEffect, useState } from 'react';
import { List, Toast } from 'antd-mobile';
import axios from '../../axios.js';
import './MessageBoxPage.css';

const MessageBoxPage = () => {
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/account/message-box-list');
        if (response.data.code === 200) {
          setMessageList(response.data.data);
        } else {
          Toast.show('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        Toast.show('Error fetching messages');
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const formatMessageTime = (dateString) => {
    const messageDate = new Date(dateString);
    const currentDate = new Date();

    const isToday =
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getDate() === currentDate.getDate();

    const timeString = messageDate.toTimeString().slice(0, 5);
    const dateStringPart = isToday
      ? '今天'
      : `${messageDate.getMonth() + 1}-${messageDate.getDate()}`;

    return `${timeString} ${dateStringPart}`;
  };

  return (
    <div style={{ padding: '16px' }}>
      <List header="消息通知">
        {messageList.map((message, index) => (
          <List.Item key={index} style={{ padding: '1px 0' }}>
            <div
              className='content1'
              style={{
                fontWeight: message.status === 0 ? 'bold' : 'normal',
                color: message.status === 1 ? 'gray' : 'black',
                wordBreak: 'break-all',
              }}
            >
              {message.messageContent.split('&').map((line, lineIndex) => (
                <div className='content1-1' key={lineIndex}>{line}</div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'gray' }}>
                  {formatMessageTime(message.senderTime)}
                </span>
                <span style={{ fontSize: '12px', color: 'gray' }}>
                  {message.senderId}
                </span>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default MessageBoxPage;
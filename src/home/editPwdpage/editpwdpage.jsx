import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css'; // 确保全局引入Ant Design样式
import './editpwdpage.css';
import axios from 'axios';

export default function EditPwdPage() {

  const navigator = useNavigate();
  
  /** 返回 */
  const goBack = () => {
     navigator(-1)
  }
  /**修改密码 */
  const onFinish = values => {
    console.log('Received values of form: ', values);  
    const passwordDto = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    }
    axios.put('/api/user/updatepwd', passwordDto)
      .then(res => {
        if (res.data.code === 200) {
          message.success(res.data.data)
          navigator('/')
        }
        else {
          message.error(res.data.message)
        }
      })
      .catch(() => {
       message.error("服务器异常")
    })
  };

  return (
    
    <div className="editpwd-page-container">
      <div className="image-box">
    
      </div>
      <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
      <span>温馨提示：修改密码后需要重新登陆哦~</span> <br/><br/>
      <Form
        className="editpwd-form"
        name="editPassword"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="oldPassword"
          rules={[{ required: true, message: '请输入当前密码' }]}
          className="editpwd-form-item"
        >
          <Input.Password placeholder="当前密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: '请输入新密码' }]}
          className="editpwd-form-item"
        >
          <Input.Password placeholder="新密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
          className="editpwd-form-item"
        >
          <Input.Password placeholder="确认新密码" />
        </Form.Item>
        <Form.Item className="editpwd-form-item">
          <Button type="primary" htmlType="submit" className="editpwd-form-button">
            修改密码
          </Button>
          <Button className="cancel-button" onClick={goBack}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

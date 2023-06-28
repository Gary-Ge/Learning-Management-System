import { useState } from "react";
import "./register.less";
import { Link,useHistory } from 'umi';
import { Button, Form, Input, Radio } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { validEmail, validNotNull,  ValidPassword, HOST, REGISTER_URL, saveToken, HEADER } from '../utils/utils';
import { RegisterDTO } from '../utils/entities';

export default function LoginPage() {
  const [form] = Form.useForm();
  const [size, setSize] = useState<SizeType>('small');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleUsernameChange = (e:any) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e:any) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!validNotNull(username)) {
      alert('Please input a username')
      return
    }
    if (!validEmail(email)) {
      alert('Please input a valid email')
      return
    } 
    const dto = new RegisterDTO(username,password,email);
    console.log(dto); 
    console.log(dto.username); 
    console.log(typeof dto.username); 
    fetch(`${HOST}${REGISTER_URL}`, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: HEADER
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message)
      }
      console.log(res.data.token)
      saveToken(res.data.token)
      history.push('/login'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      alert(error.message)
    });  
  };

  return (
    <div className="body_login_register">
      <div className="icon-container">
                <img src="/assert/logo_l.png" alt="icon" /> 
            </div>
      <div className="container_signin">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
          style={{fontFamily: 'Comic Sans MS'}}
        >
          <Form.Item style={{ marginTop: '30px' }}>
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
              <Link to="/login">
                <Radio.Button value="login">Login</Radio.Button>
              </Link>
              <Link to="/register">
                <Radio.Button value="small">Register</Radio.Button>
              </Link>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Username"
            name="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Please input your username" value={username} onChange={handleUsernameChange} />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="Email Address"
            rules={[{ required: true, message: 'Please input your email address!' }]}
          >
            <Input placeholder="Please input your email address" value={email} onChange={handleEmailChange} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Please input your password" value={password} onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item className="Submit" style={{ marginTop: '60px' }}>
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

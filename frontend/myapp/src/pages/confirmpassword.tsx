import { useState } from "react";
import "./forgetpassword.less";
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import { Link,history } from 'umi'; 
import { HOST,PASSWORD_URL,HEADER} from '../utils/utils';
import { LoginDTO } from '../utils/entities';

export default function ConfirmPassword() {
    const [form] = Form.useForm();
    const [password, setPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const handlePasswordChange = (e:any) => {
        setPassword(e.target.value);
    };
    const handleNewPasswordChange = (e:any) => {
        setNewPassword(e.target.value);
    };
    const handleSubmit = () => {
        if (password !== newpassword) {
            message.error('Password is not equal to new password')
            return;
        }
        const storedEmail = localStorage.getItem("email");
        const dto = new LoginDTO(storedEmail,password);
        fetch(`${HOST}${PASSWORD_URL}`, {
            method: 'PUT',
            body:JSON.stringify(dto),
            headers: HEADER
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              message.error(res.message)
              return;
            }
            message.success('Reset your password successfully');
            history.push('/login');
          })
          .catch(error => {
            message.error(error.message);
          });  
        
    }
    return (
        <div className="container_forgetpassword_body">
            <div className="icon-container">
                <img src="/assert/logo_l.png" alt="icon" /> 
            </div>
            <div className="container_forgetpassword">
                <Link to="/login">
                <CloseCircleOutlined className="anticon-close-circle_black " style={{color:'black'}}/>
                </Link>
                <div className="title_forgetpassword" style={{ width: '80%', marginLeft: '10%', fontFamily: 'Comic Sans MS', fontSize:'20px', color: 'black'}}>
                    Please confirm new password
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    style={{fontFamily: 'Comic Sans MS'}}
                >
                    <Form.Item 
                        style={{ marginTop: '30px' }}
                        label="Password"
                        name="Password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password placeholder="Please input your Password" value={password} onChange={handlePasswordChange}/>
                    </Form.Item>
                    <Form.Item 
                        style={{ marginTop: '30px' }}
                        label="Confirm Password"
                        name="Confirm Password"
                        rules={[{ required: true, message: 'Please input your Password again' }]}
                    >
                        <Input.Password placeholder="Please input your Password Again" value={newpassword} onChange={handleNewPasswordChange}/>
                    </Form.Item>
                    
                    <Form.Item className="Submit" style={{ marginTop: '65px' }}>
                        <Button type="primary" onClick={handleSubmit} style={{ borderRadius: '3px',marginLeft: '-10px', height: '35px'}}>Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
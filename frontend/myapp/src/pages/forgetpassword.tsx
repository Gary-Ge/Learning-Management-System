import { useState } from "react";
import "./forgetpassword.less";
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import { Link,useHistory } from 'umi'; 
import { validEmail,validNotNull,HOST,EMAIL_URL,HEADER,CODE_URL} from '../utils/utils';
import { CaptachaDTO } from '../utils/entities';

export default function ForgetPassword() {
    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const [captcha, setCaptcha] = useState("");
    const history = useHistory();
    const handleEmailChange = (e:any) => {
        setEmail(e.target.value);
    };
    const handleCaptchaChange = (e:any) => {
        setCaptcha(e.target.value);
    };
    const SendSubmit = () => {
        if (!validEmail(email)) {
            alert('Please input a valid email')
            return
        }
        fetch(`${HOST}${EMAIL_URL}/${email}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              message.error(res.message)
              return
            }
            message.success('Verification code sent successfully');
          })
          .catch(error => {
            message.error(error.message);
          });  
    }
    const handleSubmit = () => {
        const dto = new CaptachaDTO(email,captcha);
        if (!validNotNull(captcha)) {
            alert('Please input a captcha')
            return
        }
        fetch(`${HOST}${CODE_URL}`, {
            method: 'POST',
            body: JSON.stringify(dto),
            headers: HEADER
          })
          .then(res => res.json())
          .then(res => {
            if (res.code !== 20000) {
              message.error(res.message)
              return
            }
            localStorage.setItem("email", email);
            history.push('/confirmpassword');
          })
          .catch(error => {
            alert(error.message);
          });         
    }
    return (
        <div className="container_forgetpassword_body">
            <div className="icon-container">
                <img src="/assert/logo_l.png" alt="icon" /> 
            </div>
            <div className="container_forgetpassword">
                <Link to="/login">
                <CloseCircleOutlined className="anticon-close-circle_black" style={{color:'black'}}/>
                </Link>
                <div className="title_forgetpassword" style={{ width: '80%', marginLeft: '10%', fontFamily: 'Comic Sans MS', fontSize:'20px', color: 'black'}}>
                    Please access your email to<br />
                    confirm your identity
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    style={{fontFamily: 'Comic Sans MS'}}
                >
                    <Form.Item 
                        style={{ marginTop: '30px' }}
                        label="Email"
                        name="Email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input placeholder="please input your Email" value={email} onChange={handleEmailChange}/>
                    </Form.Item>
                    <Form.Item 
                        label="Captcha"
                        name="captcha"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item
                                name={['captcha', 'input']}
                                noStyle
                                rules={[{ required: true, message: 'Please input the captcha!' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input style={{ width: 'calc(100% - 120px)' }} placeholder="please input your Captcha"value={captcha} onChange={handleCaptchaChange}/>
                            </Form.Item>
                            <Button style={{ width: '100px', marginLeft: '10px',borderRadius: '3px' }} type="primary" ghost onClick={SendSubmit}>Send</Button>
                        </div>
                    </Form.Item>
                    <Form.Item className="Submit" style={{ marginTop: '60px' }}>
                        <Button type="primary" onClick={handleSubmit} style={{ borderRadius: '3px',marginLeft: '-10px', height: '35px'}}>Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}


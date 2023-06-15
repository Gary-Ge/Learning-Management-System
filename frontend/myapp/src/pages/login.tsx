import { useState } from "react";
import "./login.less"; 
import { Button, Form, Input, Radio } from 'antd';
import { Link,useHistory } from 'umi'; 
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { LoginDTO } from '../utils/entities';
import { validEmail, validNotNull, HOST, LOGIN_URL, saveToken, HEADER, getToken } from '../utils/utils';
import AlertDialog from '../../component/alert';

export default function LoginPage() {

  const [form] = Form.useForm();
  const [size, setSize] = useState<SizeType>('small');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmailState, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [showAlertEmail, setShowEmail] = useState(false);
  const [showAlertPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const [showMessage, setShowMessage] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState("");
  


  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e:any) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!validEmail(email)) {
      setValidEmail(false);
      setShowEmail(true);
      return
    } else {
      setValidEmail(true);
    }
    if (!validNotNull(password)) {
      setValidPassword(false);
      setShowPassword(true);
      return
    } else {
      setValidPassword(true);
    }
    const dto = new LoginDTO(email,password);
    console.log(dto)
    fetch(`${HOST}${LOGIN_URL}`, {
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
      history.push('/'); // redirect to login page, adjust as needed
    })
    .catch(error => {
      setShowMessage(true);
      setAlertDialogContent(error.message);
    });  
  }

  return (
    <div className="body_login_register">
        <div className="container_login_register">
        <Form
      form={form}
      layout="vertical"
      initialValues={{ remember: true }}
    >
      <Form.Item style={{ marginTop: '30px' }}>
        <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        <Link to="/login">
          <Radio.Button value="small">Login</Radio.Button>
        </Link>
        <Link to="/register">
          <Radio.Button value="signin">Register</Radio.Button>
          </Link>
        </Radio.Group>
      </Form.Item>
      <Form.Item 
      label="Email"
      name="Email"
      rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input placeholder="please input your Email" value={email} onChange={handleEmailChange}/>
      </Form.Item>
      <Form.Item
        label="Password"
        name="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="please input your password" value={password} onChange={handlePasswordChange}/>
      </Form.Item>
      <Form.Item>
        <Link to="/">Forgot password?</Link>
      </Form.Item>

      <Form.Item className="Submit">
        <Button type="primary" onClick={handleSubmit}>Submit</Button>
      </Form.Item>
    </Form>
    {showAlertEmail && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description="Please input a valid email" 
              onClose={() => setShowEmail(false)}
            />
          </div>
        }
        {showAlertPassword && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description="Please input a password " 
              onClose={() => setShowPassword(false)}
            />
          </div>
        }
        {showMessage && 
          <div className="alert-dialog-container">
            <AlertDialog
              message="Error"
              description={alertDialogContent}
              onClose={() => setShowMessage(false)}
            />
          </div>
        }
        </div>
    </div>
  );
}




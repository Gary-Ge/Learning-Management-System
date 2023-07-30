import React from 'react';
import { Alert } from 'antd';

interface CustomAlertProps {
  message: string;
  description: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, description, onClose }) => {
  return (
    <Alert
      className="alert-dialog"
      message={message}
      description={description}
      type="error"
      closable
      onClose={onClose}
      showIcon
    />
  );
};

export default CustomAlert;

import React, { useState, useEffect } from 'react';
import { Button, Upload, message  } from 'antd';
import './StaffDashboardContent.less';
import {
  CameraOutlined,
  InstagramOutlined,
  LoadingOutlined,
  CheckOutlined,
} from '@ant-design/icons';

interface UploadImageButtonProps {
  onImageUpload: (url: string) => void;
  url: string;
}
const UploadImageButton: React.FC<UploadImageButtonProps> = ({ onImageUpload, url }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    if (url !== "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/cover/default/default-cover.jpg" && url !== "") {
      setUploadedImageUrl(url);
      setUploadStatus('success');
    }
  }, [url]);

  const handleUpload = async (file: any) => {
    try {
      setUploading(true);
      // 模拟上传请求
      await uploadRequest(file);
      setUploadedImage(file);
      setUploadStatus('success');
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageUrl(imageUrl);
      message.success('Upload Successful');
      onImageUpload(imageUrl); // 调用回调函数，并传递上传成功的 URL
    } catch (error) {
      setUploadStatus('failed');
      message.error('Upload Failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadRequest = (file: any) => {
    // 实际的上传请求逻辑
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 模拟上传成功
        resolve();
        // 模拟上传失败
        // reject();
      }, 2000);
    });
  };

  const renderButtonContent = () => {
    if (uploading) {
      return (
        <>
          <LoadingOutlined className="upload-icon" />
          <span style={{ fontFamily: 'Comic Sans MS', marginLeft: '6%' }}>Loading...</span>
        </>
      );
    } else if (uploadStatus === 'success' && uploadedImage) {
      return (
        <>
          <img 
            src={URL.createObjectURL(uploadedImage)} 
            alt="Uploaded" 
            style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }} 
          />
          <CheckOutlined className="upload-icon" />
        </>
      );
    } else if (uploadStatus === 'failed') {
      return (
        <>
          <span style={{ fontFamily: 'Comic Sans MS', fontWeight: 'normal' }}>Upload Failed</span>
        </>
      );
    } else {
      if (url === "https://brainoverflow.oss-ap-southeast-2.aliyuncs.com/cover/default/default-cover.jpg") {
        return (
          <>
            <div>
              <InstagramOutlined style={{ fontSize: '400%', color: '#224564', marginBottom: '5%' }} />
            </div>
            <span style={{ fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >Upload Cover Image</span>
          </>
        );
      }
      else if (url === "") {
        return (
          <>
            <div>
              <InstagramOutlined style={{ fontSize: '400%', color: '#224564', marginBottom: '5%' }} />
            </div>
            <span style={{ fontFamily: 'Comic Sans MS', fontWeight: 'normal' }} >Upload Cover Image</span>
          </>
        );
      }
    }
  };

  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      beforeUpload={handleUpload}
      disabled={uploading}
      className="upload-button"
      style={{ display: 'inline-block' }}
    >
      <Button 
        className={uploading ? 'uploading' : ''} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderStyle: 'dashed', 
          border: '1px dashed #6C8EBF' 
       }}
      >
        {renderButtonContent()}
      </Button>
    </Upload>
  );
};
          
export default UploadImageButton;
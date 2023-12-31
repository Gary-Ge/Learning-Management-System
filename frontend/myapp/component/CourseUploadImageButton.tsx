import React, { useState, useEffect } from 'react';
import { Button, Upload, message  } from 'antd';
import {
  InstagramOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { getToken, HOST_COURSE, COURSE_DETAIL_URL } from '../src/utils/utils'

interface UploadImageButtonProps {
  onImageUpload: (url: string) => void;
  url: string;
}
const CourseUploadImageButton: React.FC<UploadImageButtonProps> = ({ onImageUpload, url }) => {
  const token = getToken();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fromoutside, setFromoutside] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [tempFile, setTempFile] = useState<File | null>(null);

  useEffect(() => {
      setFromoutside(true)
      setUploadedImageUrl(url);
      setUploadStatus('success');
  }, [url]);
  
  const handleUpload = async (file: any) => {
    setTempFile(file);
    const formData = new FormData();
    formData.append("file",  file);
    fetch (`${HOST_COURSE}${COURSE_DETAIL_URL}/cover`,{
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })
    .then(res => res.json())
    .then(res => {
      if (res.code !== 20000) {
        throw new Error(res.message);
      }
      setImageUrl(res.data.cover);
      onImageUpload(res.data.cover);
      setUploadStatus('success')
      setFromoutside(false)
    })
    .catch(error => {
      message.error(error.message);
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
    } else if (uploadStatus === 'success' && tempFile && !fromoutside) {
      return (
        <>
          <img 
            src={URL.createObjectURL(tempFile)} 
            alt="Uploaded" 
            style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }} 
          />
        </>
      );
    } else if (uploadStatus === 'success' && uploadedImageUrl && fromoutside) {
      return (
        <>
          <img 
            src={uploadedImageUrl} 
            alt="Uploaded" 
            style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }} 
          />
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
          
export default CourseUploadImageButton;
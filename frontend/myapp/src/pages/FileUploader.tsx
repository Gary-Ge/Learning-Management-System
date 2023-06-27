import React, { useState } from 'react';
import { Layout, Upload, Button, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

interface FileUploaderProps {
  onFileListChange: (fileList: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileListChange }) => {
  const [fileList, setFileList] = useState<Array<any>>([]);

  const handleFileChange = ({ fileList }: { fileList: Array<any> }) => {
    setFileList(fileList);
    onFileListChange(fileList);
  };
  const beforeUpload = (file: any) => {
    const isFileExist = fileList.some(item => item.name === file.name);

    if (isFileExist) {
      message.error('File already exists!');
      setFileList([]);
      return false; // 阻止文件上传
    }

    const updatedFileList = [...fileList, file];
    setFileList(updatedFileList);

    return false; // 阻止文件上传
  };

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Upload
          multiple
          onChange={handleFileChange}
          fileList={fileList}
          beforeUpload={beforeUpload}
          style={{ flexGrow: 1 }}
        >
          <Button 
            icon={<FolderOpenOutlined />} 
            type="primary" 
            ghost
            style={{ border: '1px dashed #9999FF', height: '100px', width: '100%' }}
          >
            Select files here to upload
          </Button>
        </Upload>
      </div>
    </Layout>
  );
};

export default FileUploader;
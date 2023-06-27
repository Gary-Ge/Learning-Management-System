import React, { useState } from 'react';
import { Layout, Upload, Button, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

const FileUploader = () => {
  const [fileList, setFileList] = useState<Array<any>>([]);

  const handleFileChange = ({ fileList }: { fileList: Array<any> }) => {
    setFileList(fileList);
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
  const handleUpload = () => {
    // 在这里执行上传文件的逻辑
    // 可以将文件发送到服务器或进行其他操作

    // 清空上传的文件列表
    setFileList([]);
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
      {fileList.length > 0 && (
        <Button
          type="primary"            
          onClick={handleUpload}
          style={{ border: '5px' }}
        >
          Upload
        </Button>
      )}
    </Layout>
  );
};

export default FileUploader;
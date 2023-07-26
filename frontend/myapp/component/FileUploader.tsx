import React, { useState } from 'react';
import { Layout, Upload, Button, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

interface FileUploaderProps {
  onFileListChange: (fileList: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileListChange }) => {
  const [fileList, setFileList] = useState<Array<any>>([]);

  const onRemove = (file: any) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
    onFileListChange(newFileList);
  }

  const beforeUpload = (file: any) => {
    const isFileExist = fileList.some((item) => item.name === file.name);

    if (isFileExist) {
      message.error('File already exists!');
      return false; // Block file upload
    }

    // Adds a new file to the file list
    fileList.push(file);
    let copyfilelist = fileList.slice();
    setFileList([...copyfilelist]);
    onFileListChange(fileList);
    return false; // Block file upload
  };

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Upload
          multiple
          fileList={fileList}
          beforeUpload={beforeUpload}
          style={{ flexGrow: 1 }}
          onRemove={onRemove}
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

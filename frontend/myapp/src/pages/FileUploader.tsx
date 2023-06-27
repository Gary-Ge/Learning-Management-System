import React, { useState } from 'react';
import { Layout, Upload, Button, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

interface FileUploaderProps {
  onFileListChange: (fileList: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileListChange }) => {
  const [fileList, setFileList] = useState<Array<any>>([]);

  const beforeUpload = (file: any) => {
    const isFileExist = fileList.some((item) => item.name === file.name);

    if (isFileExist) {
      message.error('File already exists!');
      return false; // 阻止文件上传
    }

    // // 添加新文件到文件列表
    // const updatedFileList = [...fileList, file];
    // setFileList(updatedFileList);
    fileList.push(file);
    let copyfilelist = fileList.slice();
    // console.log('copyfilelist', copyfilelist);
    // setFileList([...fileList, file]);
    setFileList([...copyfilelist]);
    // console.log('fileList', fileList);
    onFileListChange(fileList);
    return false; // 阻止文件上传
  };

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Upload
          multiple
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

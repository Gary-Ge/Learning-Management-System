import'./index.less';
import { useState } from "react";
import Navbar from "../../component/navbar"
import { List,ConfigProvider,Avatar} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Data Not Found</p>
  </div>
);
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
];

export default function IndexPage() {
  const [customize, setCustomize] = useState(true);
  return (
      <div className='body_user'>
      <Navbar />
      <ConfigProvider renderEmpty={customize ? customizeRenderEmpty : undefined}>
      <div className='timeline'>
      <div className='container_timeline_left'> {/* First div */}
      </div>
      <div className='container_timeline'> 
      <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
          title={<a href="https://ant.design">{item.title}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    )}
  />
  </div>
      </div>
      </ConfigProvider>
  </div>
  );
}

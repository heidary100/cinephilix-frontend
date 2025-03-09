import React, { useState } from 'react';
import { Typography, Row, Col, Card, Tabs, Button, Space, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MediaCard from '../components/MediaCard';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface List {
  id: string;
  name: string;
  items: any[];
}

const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState('watchlist');

  // Placeholder data - replace with actual API calls
  const watchlist = [
    {
      id: '1',
      type: 'movie' as const,
      title: 'Inception',
      year: 2010,
      rating: { averageRating: 8.8, numVotes: 2200000 },
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      runtimeMinutes: 148,
    },
    // Add more items
  ];

  const customLists: List[] = [
    {
      id: '1',
      name: 'Favorite Sci-Fi',
      items: [],
    },
    // Add more lists
  ];

  const handleCreateList = () => {
    // Implement create list functionality
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={4}>My Library</Title>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Watchlist" key="watchlist">
            {watchlist.length > 0 ? (
              <Row gutter={[16, 16]}>
                {watchlist.map(item => (
                  <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                    <MediaCard {...item} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="Your watchlist is empty"
                style={{ padding: '40px 0' }}
              />
            )}
          </TabPane>
          
          <TabPane tab="Custom Lists" key="lists">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  onClick={handleCreateList}
                >
                  <Empty
                    image={<PlusOutlined style={{ fontSize: 48 }} />}
                    description="Create New List"
                  />
                </Card>
              </Col>
              
              {customLists.map(list => (
                <Col key={list.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    title={list.name}
                    extra={<Text type="secondary">{list.items.length} items</Text>}
                  >
                    {list.items.length > 0 ? (
                      <div>List items preview</div>
                    ) : (
                      <Empty description="This list is empty" />
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab="Watched" key="watched">
            <Empty
              description="You haven't marked any titles as watched"
              style={{ padding: '40px 0' }}
            >
              <Button type="primary">Browse Titles</Button>
            </Empty>
          </TabPane>

          <TabPane tab="Ratings & Reviews" key="ratings">
            <Empty
              description="You haven't rated any titles yet"
              style={{ padding: '40px 0' }}
            >
              <Button type="primary">Browse Titles</Button>
            </Empty>
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

export default Library; 
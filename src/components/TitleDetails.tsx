import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Rate, Tag, Tabs, Card, Avatar, List, Spin } from 'antd';
import { UserOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons';
import { Title, CastMember, CrewMember, Review, titleService } from '../services/api';

const { Title: TitleComponent, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface TitleDetailsProps {
  title: Title;
}

const TitleDetails: React.FC<TitleDetailsProps> = ({ title }) => {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [castData, crewData, reviewsData] = await Promise.all([
          titleService.getTitleCast(title.id),
          titleService.getTitleCrew(title.id),
          titleService.getTitleReviews(title.id),
        ]);
        setCast(castData);
        setCrew(crewData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching title details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [title.id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <img
            src={title.posterUrl || 'https://placehold.co/300x450?text=No+Poster'}
            alt={title.primaryTitle}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} md={16}>
          <TitleComponent level={2}>{title.primaryTitle}</TitleComponent>
          {title.originalTitle !== title.primaryTitle && (
            <Text type="secondary">Original Title: {title.originalTitle}</Text>
          )}
          
          <div style={{ margin: '16px 0' }}>
            {title.genres.map((genre, index) => (
              <Tag key={index} color="blue">
                {genre.name}
              </Tag>
            ))}
          </div>

          {title.rating && (
            <div style={{ margin: '16px 0' }}>
              <Rate disabled defaultValue={title.rating.averageRating / 2} />
              <Text style={{ marginLeft: '8px' }}>{title.rating.averageRating.toFixed(1)}/10</Text>
              <Text type="secondary" style={{ marginLeft: '8px' }}>({title.rating.numVotes.toLocaleString()} votes)</Text>
            </div>
          )}

          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <Text strong>Year: </Text>
              <Text>{title.startYear}{title.endYear && ` - ${title.endYear}`}</Text>
            </Col>
            {title.runtimeMinutes && (
              <Col span={12}>
                <Text strong>Runtime: </Text>
                <Text>
                  {Math.floor(title.runtimeMinutes / 60)}h {title.runtimeMinutes % 60}m
                </Text>
              </Col>
            )}
          </Row>

          {title.plot && (
            <div style={{ margin: '16px 0' }}>
              <Text strong>Plot: </Text>
              <Paragraph>{title.plot}</Paragraph>
            </div>
          )}
        </Col>
      </Row>

      <Tabs defaultActiveKey="cast" style={{ marginTop: '24px' }}>
        <TabPane
          tab={<span><TeamOutlined />Cast</span>}
          key="cast"
        >
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={cast}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <Card.Meta
                    avatar={
                      <Avatar
                        src={item.profileUrl}
                        icon={!item.profileUrl && <UserOutlined />}
                        size={64}
                      />
                    }
                    title={item.name}
                    description={item.character}
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={<span><TeamOutlined />Crew</span>}
          key="crew"
        >
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={crew}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <Card.Meta
                    avatar={
                      <Avatar
                        src={item.profileUrl}
                        icon={!item.profileUrl && <UserOutlined />}
                        size={64}
                      />
                    }
                    title={item.name}
                    description={`${item.department} - ${item.job}`}
                  />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={<span><StarOutlined />Reviews</span>}
          key="reviews"
        >
          <List
            itemLayout="vertical"
            dataSource={reviews}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.author}
                  description={
                    <Rate disabled defaultValue={item.rating} style={{ fontSize: '14px' }} />
                  }
                />
                <Paragraph>{item.content}</Paragraph>
                <Text type="secondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TitleDetails; 
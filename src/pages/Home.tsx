import React from 'react';
import { Typography, Row, Col, Card, Button, Space, Carousel } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder data - replace with actual API calls
  const trendingMovies = [
    {
      id: '1',
      type: 'movie' as const,
      title: 'Inception',
      year: 2010,
      rating: { averageRating: 8.8, numVotes: 2200000 },
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      runtimeMinutes: 148,
    },
    // Add more movies
  ];

  const trendingTVShows = [
    {
      id: '1',
      type: 'tvSeries' as const,
      title: 'Breaking Bad',
      year: 2008,
      rating: { averageRating: 9.5, numVotes: 1800000 },
      genres: ['Crime', 'Drama', 'Thriller'],
      runtimeMinutes: 45,
    },
    // Add more TV shows
  ];

  const SectionHeader = ({ title, link }: { title: string; link: string }) => (
    <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
      <Title level={4} style={{ margin: 0 }}>{title}</Title>
      <Button type="link" onClick={() => navigate(link)} icon={<RightOutlined />}>
        View All
      </Button>
    </Space>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Carousel autoplay style={{ marginBottom: 24 }}>
        {trendingMovies.map(movie => (
          <div key={movie.id}>
            <div style={{
              height: 400,
              background: '#001529',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <Title level={2} style={{ color: 'white' }}>{movie.title}</Title>
            </div>
          </div>
        ))}
      </Carousel>

      <div>
        <SectionHeader title="Trending Movies" link="/movies" />
        <Row gutter={[16, 16]}>
          {trendingMovies.map(movie => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
              <MediaCard {...movie} />
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <SectionHeader title="Popular TV Shows" link="/tvshows" />
        <Row gutter={[16, 16]}>
          {trendingTVShows.map(show => (
            <Col key={show.id} xs={24} sm={12} md={8} lg={6}>
              <MediaCard {...show} />
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={4}>Quick Links</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Button type="primary" block onClick={() => navigate('/explore')}>
                  Explore All
                </Button>
              </Col>
              <Col span={8}>
                <Button block onClick={() => navigate('/movies')}>
                  Movies
                </Button>
              </Col>
              <Col span={8}>
                <Button block onClick={() => navigate('/tvshows')}>
                  TV Shows
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Home; 
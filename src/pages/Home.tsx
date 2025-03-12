import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Space, Carousel, theme, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { titleService } from '../services/api';
import type { Title as TitleType } from '../services/api';

const { Title } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState<TitleType[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TitleType[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [movies, tvShows] = await Promise.all([
          // Fetch top rated movies
          titleService.searchTitles({
            titleType: 'movie',
            sortBy: 'rating.weighted',
            sortOrder: 'desc',
            limit: 8,
            page: 1,
            ratingRange: [7, 10], // Only high-rated content
            isAdult: false
          }),
          // Fetch top rated TV shows
          titleService.searchTitles({
            titleType: 'tvSeries',
            sortBy: 'rating.weighted',
            sortOrder: 'desc',
            limit: 8,
            page: 1,
            ratingRange: [7, 10], // Only high-rated content
            isAdult: false
          })
        ]);

        setTrendingMovies(movies.items);
        setTrendingTVShows(tvShows.items);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const SectionHeader = ({ title, link }: { title: string; link: string }) => (
    <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
      <Title level={4} style={{ margin: 0 }}>{title}</Title>
      <Button type="link" onClick={() => navigate(link)} icon={<RightOutlined />}>
        View All
      </Button>
    </Space>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading trending content..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px' }}>
      {trendingMovies.length > 0 && (
        <Carousel autoplay style={{ marginBottom: 24 }}>
          {trendingMovies.slice(0, 4).map(movie => (
            <div key={movie.id} onClick={() => navigate(`/movies/${movie.id}`)} style={{ cursor: 'pointer' }}>
              <div style={{
                height: 400,
                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${movie.posterUrl || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 48px',
                textAlign: 'center'
              }}>
                <Title level={2} style={{ color: token.colorTextLightSolid, marginBottom: 8 }}>
                  {movie.primaryTitle}
                </Title>
                {movie.startYear && (
                  <Title level={4} style={{ color: token.colorTextLightSolid, margin: 0, opacity: 0.8 }}>
                    {movie.startYear}
                  </Title>
                )}
                {movie.rating && (
                  <Title level={4} style={{ color: token.colorTextLightSolid, margin: '8px 0', opacity: 0.8 }}>
                    ★ {movie.rating.averageRating.toFixed(1)}
                  </Title>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      )}

      <div>
        <SectionHeader title="Trending Movies" link="/movies" />
        <Row gutter={[16, 16]}>
          {trendingMovies.map(movie => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
              <MediaCard 
                id={movie.id}
                type="movie"
                title={movie.primaryTitle}
                year={movie.startYear}
                rating={movie.rating}
                genres={movie.genres?.map(g => g.name)}
                runtimeMinutes={movie.runtimeMinutes}
                imageUrl={movie.posterUrl}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <SectionHeader title="Popular TV Shows" link="/tvshows" />
        <Row gutter={[16, 16]}>
          {trendingTVShows.map(show => (
            <Col key={show.id} xs={24} sm={12} md={8} lg={6}>
              <MediaCard 
                id={show.id}
                type="tvSeries"
                title={show.primaryTitle}
                year={show.startYear}
                rating={show.rating}
                genres={show.genres?.map(g => g.name)}
                runtimeMinutes={show.runtimeMinutes}
                imageUrl={show.posterUrl}
              />
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
import React, { useState } from 'react';
import { Typography, Row, Col, Card, Select, Space, Button, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import MediaCard from '../components/MediaCard';

const { Title, Text } = Typography;

interface MovieFilters {
  genre?: string;
  year?: number;
  sortBy: string;
}

const Movies: React.FC = () => {
  const [filters, setFilters] = useState<MovieFilters>({
    sortBy: 'rating.averageRating',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder data - replace with actual API calls
  const movies = [
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

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
  ].map(genre => ({ label: genre, value: genre }));

  const yearOptions = Array.from({ length: 2024 - 1900 + 1 }, (_, i) => ({
    label: String(2024 - i),
    value: 2024 - i,
  }));

  const sortOptions = [
    { label: 'Rating', value: 'rating.averageRating' },
    { label: 'Year', value: 'startYear' },
    { label: 'Title', value: 'primaryTitle' },
    { label: 'Runtime', value: 'runtimeMinutes' },
  ];

  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Movies</Title>
          </Col>
          <Col flex="auto">
            <Space wrap>
              <FilterOutlined />
              <Select
                allowClear
                placeholder="Select Genre"
                style={{ width: 200 }}
                options={genreOptions}
                value={filters.genre}
                onChange={(value) => handleFilterChange('genre', value)}
              />
              <Select
                allowClear
                placeholder="Select Year"
                style={{ width: 120 }}
                options={yearOptions}
                value={filters.year}
                onChange={(value) => handleFilterChange('year', value)}
              />
              <Select
                placeholder="Sort By"
                style={{ width: 120 }}
                options={sortOptions}
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {movies.map(movie => (
          <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
            <MediaCard {...movie} />
          </Col>
        ))}
      </Row>

      <Row justify="center">
        <Pagination
          current={currentPage}
          onChange={setCurrentPage}
          total={100} // Replace with actual total
          pageSize={20}
          showSizeChanger={false}
        />
      </Row>
    </Space>
  );
};

export default Movies; 
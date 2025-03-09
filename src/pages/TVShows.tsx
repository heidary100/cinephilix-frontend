import React, { useState } from 'react';
import { Typography, Row, Col, Card, Select, Space, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import MediaCard from '../components/MediaCard';

const { Title } = Typography;

interface TVShowFilters {
  genre?: string;
  year?: number;
  type?: string;
  sortBy: string;
}

const TVShows: React.FC = () => {
  const [filters, setFilters] = useState<TVShowFilters>({
    sortBy: 'rating.averageRating',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder data - replace with actual API calls
  const shows = [
    {
      id: '1',
      type: 'tvSeries' as const,
      title: 'Breaking Bad',
      year: 2008,
      rating: { averageRating: 9.5, numVotes: 1800000 },
      genres: ['Crime', 'Drama', 'Thriller'],
      runtimeMinutes: 45,
    },
    // Add more shows
  ];

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Reality-TV',
  ].map(genre => ({ label: genre, value: genre }));

  const yearOptions = Array.from({ length: 2024 - 1900 + 1 }, (_, i) => ({
    label: String(2024 - i),
    value: 2024 - i,
  }));

  const typeOptions = [
    { label: 'TV Series', value: 'tvSeries' },
    { label: 'Mini-Series', value: 'tvMiniSeries' },
    { label: 'TV Special', value: 'tvSpecial' },
  ];

  const sortOptions = [
    { label: 'Rating', value: 'rating.averageRating' },
    { label: 'Year', value: 'startYear' },
    { label: 'Title', value: 'primaryTitle' },
    { label: 'Runtime', value: 'runtimeMinutes' },
  ];

  const handleFilterChange = (key: keyof TVShowFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>TV Shows</Title>
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
                allowClear
                placeholder="Show Type"
                style={{ width: 150 }}
                options={typeOptions}
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
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
        {shows.map(show => (
          <Col key={show.id} xs={24} sm={12} md={8} lg={6}>
            <MediaCard {...show} />
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

export default TVShows; 
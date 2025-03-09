import React, { useState } from 'react';
import { Input, Card, Row, Col, Select, Slider, Button, Space, Typography, Switch, InputNumber } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface SearchFilters {
  titleType: string;
  genres: string[];
  startYear?: number;
  endYear?: number;
  ratingRange: [number, number];
  isAdult: boolean;
  runtimeRange: [number, number];
  language?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const Explore: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    titleType: 'all',
    genres: [],
    ratingRange: [0, 10],
    isAdult: false,
    runtimeRange: [0, 500],
    sortBy: 'rating.averageRating',
    sortOrder: 'desc'
  });

  const titleTypes = [
    { label: 'All', value: 'all' },
    { label: 'Movie', value: 'movie' },
    { label: 'TV Series', value: 'tvSeries' },
    { label: 'TV Episode', value: 'tvEpisode' },
    { label: 'TV Mini-Series', value: 'tvMiniSeries' },
    { label: 'TV Special', value: 'tvSpecial' },
    { label: 'Short Film', value: 'short' },
    { label: 'Documentary', value: 'documentary' }
  ];

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'Game-Show',
    'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News', 'Reality-TV',
    'Romance', 'Sci-Fi', 'Sport', 'Talk-Show', 'Thriller', 'War', 'Western'
  ].map(genre => ({ label: genre, value: genre }));

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      titleType: 'all',
      genres: [],
      ratingRange: [0, 10],
      isAdult: false,
      runtimeRange: [0, 500],
      sortBy: 'rating.averageRating',
      sortOrder: 'desc'
    });
  };

  return (
    <div>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={2}>Explore</Title>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Search
            placeholder="Search by title, actor, director, or writer..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
          />
          
          <Space>
            <Button 
              type="link" 
              icon={<FilterOutlined />}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
          </Space>

          {showAdvanced && (
            <Card>
              <Row gutter={[24, 24]}>
                <Col span={24} md={8}>
                  <Text strong>Content Type</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={filters.titleType}
                    onChange={(value) => handleFilterChange('titleType', value)}
                    options={titleTypes}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Genres</Text>
                  <Select
                    mode="multiple"
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Select genres"
                    value={filters.genres}
                    onChange={(value) => handleFilterChange('genres', value)}
                    options={genreOptions}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Year Range</Text>
                  <Space style={{ width: '100%', marginTop: 8 }}>
                    <InputNumber
                      style={{ width: '45%' }}
                      placeholder="From"
                      value={filters.startYear}
                      onChange={(value) => handleFilterChange('startYear', value)}
                      min={1900}
                      max={2024}
                    />
                    <Text type="secondary">to</Text>
                    <InputNumber
                      style={{ width: '45%' }}
                      placeholder="To"
                      value={filters.endYear}
                      onChange={(value) => handleFilterChange('endYear', value)}
                      min={1900}
                      max={2024}
                    />
                  </Space>
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Rating Range</Text>
                  <Slider
                    range
                    value={filters.ratingRange}
                    onChange={(value) => handleFilterChange('ratingRange', value)}
                    min={0}
                    max={10}
                    step={0.1}
                    marks={{
                      0: '0',
                      5: '5',
                      10: '10'
                    }}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Runtime (minutes)</Text>
                  <Slider
                    range
                    value={filters.runtimeRange}
                    onChange={(value) => handleFilterChange('runtimeRange', value)}
                    min={0}
                    max={500}
                    step={5}
                    marks={{
                      0: '0',
                      120: '120',
                      240: '240',
                      500: '500+'
                    }}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Sort By</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={filters.sortBy}
                    onChange={(value) => handleFilterChange('sortBy', value)}
                    options={[
                      { label: 'Rating', value: 'rating.averageRating' },
                      { label: 'Number of Votes', value: 'rating.numVotes' },
                      { label: 'Title', value: 'primaryTitle' },
                      { label: 'Year', value: 'startYear' },
                      { label: 'Runtime', value: 'runtimeMinutes' }
                    ]}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Text strong>Sort Order</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={filters.sortOrder}
                    onChange={(value) => handleFilterChange('sortOrder', value)}
                    options={[
                      { label: 'Descending', value: 'desc' },
                      { label: 'Ascending', value: 'asc' }
                    ]}
                  />
                </Col>

                <Col span={24} md={8}>
                  <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                    <Text strong>Include Adult Content</Text>
                    <Switch
                      checked={filters.isAdult}
                      onChange={(checked) => handleFilterChange('isAdult', checked)}
                    />
                  </Space>
                </Col>
              </Row>

              <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<SearchOutlined />}>
                      Apply Filters
                    </Button>
                    <Button onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}
        </Space>
      </Card>

      <Card bordered={false}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Title level={3}>Results</Title>
          <Text type="secondary">Showing 0 results</Text>
        </Row>
        {/* Results grid will be implemented here */}
      </Card>
    </div>
  );
};

export default Explore; 
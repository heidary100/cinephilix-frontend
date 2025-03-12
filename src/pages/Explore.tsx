import React, { useState, useEffect } from 'react';
import { Input, Card, Row, Col, Select, Slider, Button, Space, Typography, Switch, InputNumber, List, Tag, Rate, Spin, message, Pagination, Avatar } from 'antd';
import { SearchOutlined, FilterOutlined, ClockCircleOutlined, StarOutlined, AppstoreOutlined, UnorderedListOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { titleService, type Title } from '../services/api';
import type { SearchFilters as SearchFiltersType } from '../types/search';
import { theme } from 'antd';

const { Title: AntTitle, Text, Paragraph } = Typography;
const { Search } = Input;

interface SearchFilters extends SearchFiltersType {
  search?: string;
}

const Explore: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  
  const [filters, setFilters] = useState<SearchFilters>({
    titleType: 'all',
    genres: [],
    ratingRange: [0, 10],
    isAdult: false,
    runtimeRange: [0, 500],
    sortBy: 'rating.weighted',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  const { token } = theme.useToken();

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

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setError(null);
    await fetchResults({ ...filters, search: value, page: 1 });
  };

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
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
    setSearchQuery('');
    fetchResults({
      titleType: 'all',
      genres: [],
      ratingRange: [0, 10],
      isAdult: false,
      runtimeRange: [0, 500],
      sortBy: 'rating.averageRating',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
  };

  const fetchResults = async (searchFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await titleService.searchTitles(searchFilters);
      setSearchResults(response.items);
      setTotalResults(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      message.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchResults({ ...filters, page });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchResults({ ...filters, search: searchQuery, page: 1 });
  };

  useEffect(() => {
    fetchResults(filters);
  }, []);

  const renderTitleCard = (title: Title) => (
    <Card 
      hoverable 
      style={{ marginBottom: 16 }}
      cover={
        <img
          alt={title.primaryTitle}
          src={title.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
          style={{ height: 450, objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={
          <Space direction="vertical" size={0}>
            <AntTitle level={4}>{title.primaryTitle}</AntTitle>
            <Space>
              {title.startYear && <Text type="secondary">{title.startYear}</Text>}
              {title.runtimeMinutes && (
                <Text type="secondary">
                  <ClockCircleOutlined /> {title.runtimeMinutes} min
                </Text>
              )}
              {title.rating && (
                <Text>
                  <StarOutlined style={{ color: token.colorWarning, marginRight: 4 }} />
                  {title.rating.averageRating.toFixed(1)}
                </Text>
              )}
            </Space>
          </Space>
        }
        description={
          <>
            <Space style={{ marginBottom: 8 }}>
              {title.genres?.map((genre: any) => (
                <Tag key={genre.name}>{genre.name}</Tag>
              ))}
            </Space>
            {title.principals && (
              <Paragraph>
                <Text strong>Cast: </Text>
                {title.principals
                  .filter((p: any) => p.category.name === 'actor' || p.category.name === 'actress')
                  .map((p: any) => p.name.primaryName)
                  .join(', ')}
              </Paragraph>
            )}
          </>
        }
      />
    </Card>
  );

  const renderCompactList = (titles: Title[]) => (
    <List
      dataSource={titles}
      renderItem={title => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                size={64}
                shape="square"
                src={title.posterUrl}
                icon={!title.posterUrl && <PlayCircleOutlined />}
              />
            }
            title={title.primaryTitle}
            description={
              <Space>
                {title.startYear && <Text type="secondary">{title.startYear}</Text>}
                {title.rating && (
                  <Text>
                    <StarOutlined style={{ color: token.colorWarning, marginRight: 4 }} />
                    {title.rating.averageRating.toFixed(1)}
                  </Text>
                )}
                {title.genres?.map((genre: any) => (
                  <Tag key={genre.name}>{genre.name}</Tag>
                ))}
              </Space>
            }
          />
        </List.Item>
      )}
      style={{
        background: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary
      }}
    />
  );

  return (
    <div style={{ padding: 24 }}>
      <Card 
        bordered={false} 
        style={{ 
          marginBottom: 24,
          background: token.colorBgElevated,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <AntTitle level={2}>Explore</AntTitle>
            </Col>
            <Col>
              <Space>
                <Switch
                  checkedChildren={<AppstoreOutlined />}
                  unCheckedChildren={<UnorderedListOutlined />}
                  checked={viewMode === 'card'}
                  onChange={(checked) => setViewMode(checked ? 'card' : 'list')}
                />
              </Space>
            </Col>
          </Row>

          <Search
            placeholder="Search by title, actor, director, or writer..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
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
                      { 
                        label: 'Rating (Weighted by Votes)', 
                        value: 'rating.weighted',
                        title: 'Sort by rating weighted by number of votes, similar to IMDb\'s ranking'
                      },
                      { 
                        label: 'Average Rating', 
                        value: 'rating.averageRating',
                        title: 'Sort by raw average rating'
                      },
                      { 
                        label: 'Number of Votes', 
                        value: 'rating.numVotes',
                        title: 'Sort by total number of votes'
                      },
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
                    <Button type="primary" icon={<SearchOutlined />} onClick={applyFilters}>
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

      <Card 
        bordered={false}
        style={{
          background: token.colorBgElevated,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <AntTitle level={3}>Results</AntTitle>
          <Text type="secondary">
            {totalResults > 0 ? `Showing ${searchResults.length} of ${totalResults} results` : 'No results found'}
          </Text>
        </Row>
        
        <Spin spinning={loading} tip="Loading results...">
          {error ? (
            <Row justify="center" style={{ padding: 24 }}>
              <Text type="danger">{error}</Text>
            </Row>
          ) : searchResults.length === 0 ? (
            <Row justify="center" style={{ padding: 24 }}>
              <Text type="secondary">
                {loading ? 'Searching...' : 'No results found. Try adjusting your search criteria.'}
              </Text>
            </Row>
          ) : (
            <>
              {viewMode === 'card' ? (
                <Row gutter={[24, 24]}>
                  {searchResults.map((title) => (
                    <Col key={title.id} xs={24} sm={12} md={8} lg={6}>
                      {renderTitleCard(title)}
                    </Col>
                  ))}
                </Row>
              ) : (
                renderCompactList(searchResults)
              )}
              
              {searchResults.length > 0 && (
                <Row justify="center" style={{ marginTop: 24 }}>
                  <Col>
                    <Pagination
                      total={totalResults}
                      pageSize={filters.limit || 20}
                      current={currentPage}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default Explore; 
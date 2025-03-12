import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Space, Typography, Spin, Empty, Button, Card, Switch, InputNumber, List, Tag, Avatar, Slider } from 'antd';
import { SearchOutlined, FilterOutlined, ClockCircleOutlined, StarOutlined, AppstoreOutlined, UnorderedListOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import MovieCard from '../components/MovieCard';
import TitlePagination from '../components/TitlePagination';
import TitleDetailsModal from '../components/TitleDetailsModal';
import { titleService, Title } from '../services/api';
import { theme } from 'antd';

const { Title: AntTitle, Text, Paragraph } = Typography;
const { Search } = Input;

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedMovie, setSelectedMovie] = useState<Title | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    titleType: 'movie',
    genres: [],
    startYear: undefined,
    endYear: undefined,
    ratingRange: [0, 10],
    isAdult: false,
    runtimeRange: [0, 500],
    sortBy: 'rating.weighted',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
    limit: 20,
    search: ''
  });

  const { token } = theme.useToken();

  const titleTypes = [
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

  const fetchMovies = async (searchFilters: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await titleService.searchTitles(searchFilters);
      setMovies(data.items);
      setTotal(data.total);
      setCurrentPage(searchFilters.page || 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(filters);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const newFilters = {
      ...filters,
      search: value,
      page: 1
    };
    setFilters(newFilters);
    fetchMovies(newFilters);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number, size: number) => {
    const newFilters = {
      ...filters,
      page,
      limit: size
    };
    setFilters(newFilters);
    fetchMovies(newFilters);
  };

  const handleMovieClick = (movie: Title) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const resetFilters = () => {
    const defaultFilters = {
      titleType: 'movie',
      genres: [],
      startYear: undefined,
      endYear: undefined,
      ratingRange: [0, 10],
      isAdult: false,
      runtimeRange: [0, 500],
      sortBy: 'rating.averageRating',
      sortOrder: 'desc' as 'asc' | 'desc',
      page: 1,
      limit: 20,
      search: ''
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    fetchMovies(defaultFilters);
  };

  const applyFilters = () => {
    const newFilters = {
      ...filters,
      page: 1
    };
    setFilters(newFilters);
    fetchMovies(newFilters);
  };

  const renderMovieCard = (movie: Title) => (
    <Card 
      hoverable 
      style={{ marginBottom: 16 }}
      cover={
        <img
          alt={movie.primaryTitle}
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
          style={{ height: 450, objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={
          <Space direction="vertical" size={0}>
            <AntTitle level={4}>{movie.primaryTitle}</AntTitle>
            <Space>
              {movie.startYear && <Text type="secondary">{movie.startYear}</Text>}
              {movie.runtimeMinutes && (
                <Text type="secondary">
                  <ClockCircleOutlined /> {movie.runtimeMinutes} min
                </Text>
              )}
              {movie.rating && (
                <Text>
                  <StarOutlined style={{ color: token.colorWarning, marginRight: 4 }} />
                  {movie.rating.averageRating.toFixed(1)}
                </Text>
              )}
            </Space>
          </Space>
        }
        description={
          <>
            <Space style={{ marginBottom: 8 }}>
              {movie.genres?.map((genre: any) => (
                <Tag key={genre.name}>{genre.name}</Tag>
              ))}
            </Space>
            {movie.principals && (
              <Paragraph>
                <Text strong>Cast: </Text>
                {movie.principals
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

  const renderCompactList = (movies: Title[]) => (
    <List
      dataSource={movies}
      renderItem={movie => (
        <List.Item onClick={() => handleMovieClick(movie)} style={{ cursor: 'pointer' }}>
          <List.Item.Meta
            avatar={
              <Avatar
                size={64}
                shape="square"
                src={movie.posterUrl}
                icon={!movie.posterUrl && <PlayCircleOutlined />}
              />
            }
            title={movie.primaryTitle}
            description={
              <Space>
                {movie.startYear && <Text type="secondary">{movie.startYear}</Text>}
                {movie.rating && (
                  <Text>
                    <StarOutlined style={{ color: token.colorWarning, marginRight: 4 }} />
                    {movie.rating.averageRating.toFixed(1)}
                  </Text>
                )}
                {movie.genres?.map((genre: any) => (
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
              <AntTitle level={2}>Movies</AntTitle>
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
            placeholder="Search movies by title, actor, director..."
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
            {total > 0 ? `Showing ${movies.length} of ${total} results` : 'No results found'}
          </Text>
        </Row>
        
        <Spin spinning={loading} tip="Loading results...">
          {error ? (
            <Row justify="center" style={{ padding: 24 }}>
              <Text type="danger">{error}</Text>
            </Row>
          ) : movies.length === 0 ? (
            <Row justify="center" style={{ padding: 24 }}>
              <Text type="secondary">
                {loading ? 'Searching...' : 'No results found. Try adjusting your search criteria.'}
              </Text>
            </Row>
          ) : (
            <>
              {viewMode === 'card' ? (
                <Row gutter={[24, 24]}>
                  {movies.map((movie) => (
                    <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                      <div onClick={() => handleMovieClick(movie)}>
                        {renderMovieCard(movie)}
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                renderCompactList(movies)
              )}
              
              <TitlePagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            </>
          )}
        </Spin>
      </Card>

      <TitleDetailsModal
        title={selectedMovie}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Movies; 
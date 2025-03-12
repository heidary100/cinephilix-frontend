import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Space, Typography, Spin, Empty, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import MovieCard from '../components/MovieCard';
import TitlePagination from '../components/TitlePagination';
import TitleDetailsModal from '../components/TitleDetailsModal';
import { titleService, Title, SearchTitleDto, SearchResponse } from '../services/api';

const { Title: TitleComponent } = Typography;
const { Search } = Input;

const TVShows: React.FC = () => {
  const [shows, setShows] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedShow, setSelectedShow] = useState<Title | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchTitleDto>({
    titleType: 'tvSeries',
    take: pageSize,
    skip: 0,
  });

  const fetchShows = async () => {
    try {
      setLoading(true);
      const data = await titleService.searchTitles(searchParams);
      setShows(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    setSearchParams(prev => ({
      ...prev,
      query: value,
      skip: 0,
    }));
  };

  const handleYearChange = (value: [number, number]) => {
    setCurrentPage(1);
    setSearchParams(prev => ({
      ...prev,
      startYear: value[0],
      endYear: value[1],
      skip: 0,
    }));
  };

  const handleGenreChange = (value: string) => {
    setCurrentPage(1);
    setSearchParams(prev => ({
      ...prev,
      genre: value,
      skip: 0,
    }));
  };

  const handleReset = () => {
    setCurrentPage(1);
    setSearchParams({
      titleType: 'tvSeries',
      take: pageSize,
      skip: 0,
    });
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    setSearchParams(prev => ({
      ...prev,
      take: size,
      skip: (page - 1) * size,
    }));
  };

  const handleShowClick = (show: Title) => {
    setSelectedShow(show);
    setModalVisible(true);
  };

  return (
    <div>
      <TitleComponent level={2}>TV Shows</TitleComponent>
      
      <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search TV shows..."
              onSearch={handleSearch}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select genre"
              onChange={handleGenreChange}
              allowClear
            >
              <Select.Option value="Drama">Drama</Select.Option>
              <Select.Option value="Comedy">Comedy</Select.Option>
              <Select.Option value="Action">Action</Select.Option>
              <Select.Option value="Crime">Crime</Select.Option>
              <Select.Option value="Mystery">Mystery</Select.Option>
              <Select.Option value="Sci-Fi">Sci-Fi</Select.Option>
              <Select.Option value="Fantasy">Fantasy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Year range"
              onChange={handleYearChange}
              allowClear
            >
              <Select.Option value={[2020, 2024]}>2020-2024</Select.Option>
              <Select.Option value={[2015, 2019]}>2015-2019</Select.Option>
              <Select.Option value={[2010, 2014]}>2010-2014</Select.Option>
              <Select.Option value={[2000, 2009]}>2000-2009</Select.Option>
              <Select.Option value={[1990, 1999]}>1990-1999</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              style={{ width: '100%' }}
            >
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Space>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : shows.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {shows.map((show) => (
              <Col key={show.id} xs={24} sm={12} md={8} lg={6}>
                <MovieCard 
                  title={show} 
                  onClick={() => handleShowClick(show)}
                />
              </Col>
            ))}
          </Row>
          <TitlePagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </>
      ) : (
        <Empty
          description="No TV shows found"
          style={{ margin: '50px 0' }}
        />
      )}

      <TitleDetailsModal
        title={selectedShow}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default TVShows; 
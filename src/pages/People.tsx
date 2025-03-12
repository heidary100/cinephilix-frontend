import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Select, Space, Pagination, Input, Spin } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import PersonCard from '../components/PersonCard';
import { peopleService, Person } from '../services/api';
import debounce from 'lodash/debounce';

const { Title } = Typography;
const { Search } = Input;

interface PeopleFilters {
  search?: string;
  profession?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const PAGE_SIZE = 20;

const People: React.FC = () => {
  const [filters, setFilters] = useState<PeopleFilters>({
    sortBy: 'popularity',
    sortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [people, setPeople] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await peopleService.searchPeople({
        ...filters,
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setPeople(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [filters, currentPage]);

  const debouncedSearch = debounce((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, 500);

  const professionOptions = [
    { label: 'Actor', value: 'actor' },
    { label: 'Director', value: 'director' },
    { label: 'Writer', value: 'writer' },
    { label: 'Producer', value: 'producer' },
    { label: 'Cinematographer', value: 'cinematographer' },
  ];

  const sortOptions = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Name', value: 'primaryName' },
    { label: 'Birth Year', value: 'birthYear' },
  ];

  const handleFilterChange = (key: keyof PeopleFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>People</Title>
          </Col>
          <Col flex="auto">
            <Space wrap>
              <Search
                placeholder="Search people..."
                allowClear
                style={{ width: 250 }}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <FilterOutlined />
              <Select
                allowClear
                placeholder="Select Profession"
                style={{ width: 200 }}
                options={professionOptions}
                value={filters.profession}
                onChange={(value) => handleFilterChange('profession', value)}
              />
              <Select
                placeholder="Sort By"
                style={{ width: 120 }}
                options={sortOptions}
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
              />
              <Select
                placeholder="Order"
                style={{ width: 120 }}
                options={[
                  { label: 'Ascending', value: 'asc' },
                  { label: 'Descending', value: 'desc' },
                ]}
                value={filters.sortOrder}
                onChange={(value) => handleFilterChange('sortOrder', value)}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {people.map(person => (
            <Col key={person.id} xs={24} sm={12} md={8} lg={6}>
              <PersonCard
                id={person.id}
                name={person.primaryName}
                profession={person.primaryProfession?.[0]}
                birthYear={person.birthYear}
                knownFor={person.knownForTitles?.map(title => ({
                  title: title.primaryTitle,
                  year: title.startYear
                }))}
                imageUrl={person.profileUrl}
              />
            </Col>
          ))}
        </Row>
      </Spin>

      {total > 0 && (
        <Row justify="center">
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={total}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
          />
        </Row>
      )}
    </Space>
  );
};

export default People; 
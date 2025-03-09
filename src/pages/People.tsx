import React, { useState } from 'react';
import { Typography, Row, Col, Card, Select, Space, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import PersonCard from '../components/PersonCard';

const { Title } = Typography;

interface PeopleFilters {
  profession?: string;
  sortBy: string;
}

const People: React.FC = () => {
  const [filters, setFilters] = useState<PeopleFilters>({
    sortBy: 'popularity',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder data - replace with actual API calls
  const people = [
    {
      id: '1',
      name: 'Christopher Nolan',
      profession: 'Director',
      birthYear: 1970,
      knownFor: [
        { title: 'Inception', year: 2010 },
        { title: 'The Dark Knight', year: 2008 },
        { title: 'Interstellar', year: 2014 },
      ],
    },
    // Add more people
  ];

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
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {people.map(person => (
          <Col key={person.id} xs={24} sm={12} md={8} lg={6}>
            <PersonCard {...person} />
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

export default People; 
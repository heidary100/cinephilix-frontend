import React from 'react';
import { Pagination, Row } from 'antd';

interface TitlePaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

const TitlePagination: React.FC<TitlePaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  return (
    <Row justify="center" style={{ marginTop: '24px' }}>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />
    </Row>
  );
};

export default TitlePagination; 
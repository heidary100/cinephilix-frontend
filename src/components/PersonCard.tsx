import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

interface PersonCardProps {
  id: string;
  name: string;
  profession?: string;
  birthYear?: number;
  deathYear?: number;
  knownFor?: Array<{
    title: string;
    year?: number;
  }>;
  imageUrl?: string;
}

const PersonCard: React.FC<PersonCardProps> = ({
  id,
  name,
  profession,
  birthYear,
  deathYear,
  knownFor,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/people/${id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ 
          height: 300, 
          background: '#001529',
          backgroundImage: `url(${imageUrl || '/placeholder-person.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imageUrl && <UserOutlined style={{ fontSize: 48, color: '#fff' }} />}
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={name}
        description={
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            {profession && <Tag>{profession}</Tag>}
            
            {(birthYear || deathYear) && (
              <Text type="secondary">
                {birthYear || '?'} - {deathYear || 'Present'}
              </Text>
            )}
            
            {knownFor && knownFor.length > 0 && (
              <div>
                <Text type="secondary">Known for:</Text>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  {knownFor.slice(0, 3).map((work, index) => (
                    <li key={index}>
                      <Text>{work.title}</Text>
                      {work.year && <Text type="secondary"> ({work.year})</Text>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default PersonCard; 
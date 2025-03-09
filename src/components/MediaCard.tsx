import React from 'react';
import { Card, Typography, Rate, Tag, Space } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

interface MediaCardProps {
  id: string;
  type: 'movie' | 'tvSeries' | 'tvEpisode';
  title: string;
  year?: number;
  rating?: {
    averageRating: number;
    numVotes: number;
  };
  genres?: string[];
  runtimeMinutes?: number;
  imageUrl?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  type,
  title,
  year,
  rating,
  genres,
  runtimeMinutes,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}s/${id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ 
          height: 300, 
          background: '#001529',
          backgroundImage: `url(${imageUrl || '/placeholder.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imageUrl && <PlayCircleOutlined style={{ fontSize: 48, color: '#fff' }} />}
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={title}
        description={
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Space size={4}>
              {year && <Text type="secondary">{year}</Text>}
              {runtimeMinutes && (
                <Text type="secondary">
                  <ClockCircleOutlined /> {runtimeMinutes}min
                </Text>
              )}
            </Space>
            
            {rating && (
              <Space>
                <Rate disabled defaultValue={rating.averageRating / 2} allowHalf />
                <Text type="secondary">({rating.numVotes.toLocaleString()})</Text>
              </Space>
            )}
            
            <Space size={[0, 4]} wrap>
              {genres?.map((genre) => (
                <Tag key={genre}>{genre}</Tag>
              ))}
            </Space>
          </Space>
        }
      />
    </Card>
  );
};

export default MediaCard; 
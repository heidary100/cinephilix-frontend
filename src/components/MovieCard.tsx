import React from 'react';
import { Card, Typography, Tag, Rate, theme } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Title } from '../services/api';

const { Text } = Typography;
const { Meta } = Card;

interface MovieCardProps {
  title: Title;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, onClick }) => {
  const defaultPoster = 'https://placehold.co/300x450?text=No+Poster';
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      style={{ width: 300, margin: '10px' }}
      cover={
        <div style={{ position: 'relative', height: 450 }}>
          <img
            alt={title.primaryTitle}
            src={title.posterUrl || defaultPoster}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(transparent, ${token.colorBgMask})`,
              padding: '20px 10px 10px',
            }}
          >
            <Typography.Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>
              {title.primaryTitle}
            </Typography.Title>
            <Text style={{ color: token.colorTextSecondary }}>
              {title.startYear}
              {title.endYear && ` - ${title.endYear}`}
            </Text>
          </div>
        </div>
      }
      onClick={onClick}
    >
      <Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '16px' }} ellipsis>
              {title.primaryTitle}
            </Text>
            {title.rating && (
              <Rate 
                disabled 
                defaultValue={title.rating / 2} 
                count={5} 
                style={{ fontSize: '14px' }} 
              />
            )}
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>
              {title.genres.map((genre: string, index: number) => (
                <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                  {genre}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlayCircleOutlined />
              <Text type="secondary">
                {title.runtimeMinutes 
                  ? `${Math.floor(title.runtimeMinutes / 60)}h ${title.runtimeMinutes % 60}m`
                  : 'Duration N/A'}
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default MovieCard; 
import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  UserOutlined,
  HeartOutlined,
  CompassOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Space, Typography, Select } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import People from './pages/People';
import Library from './pages/Library';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type ThemeMode = 'light' | 'dark' | 'system';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Handle system theme changes
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  const navigationItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/explore',
      icon: <CompassOutlined />,
      label: 'Explore',
    },
    {
      key: '/movies',
      icon: <PlayCircleOutlined />,
      label: 'Movies',
    },
    {
      key: '/tvshows',
      icon: <PlayCircleOutlined />,
      label: 'TV Shows',
    },
    {
      key: '/people',
      icon: <TeamOutlined />,
      label: 'People',
    },
    {
      type: 'divider',
    },
    {
      key: '/library',
      icon: <HeartOutlined />,
      label: 'My Library',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={{ 
          background: colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div className="logo" style={{ 
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
        >
          <Title level={collapsed ? 4 : 3} style={{ margin: 0 }}>
            {collapsed ? 'C' : 'Cinephilix'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={navigationItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space size="middle">
            <BulbOutlined style={{ fontSize: '18px' }} />
            <Select
              value={themeMode}
              onChange={(value: ThemeMode) => setThemeMode(value)}
              style={{ width: 100 }}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tvshows" element={<TVShows />} />
            <Route path="/people" element={<People />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
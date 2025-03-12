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
import { Button, Layout, Menu, theme, Space, Typography, Select, ConfigProvider } from 'antd';
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
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'system';
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get theme token at component level
  const { token } = theme.useToken();

  useEffect(() => {
    const updateTheme = (dark: boolean) => {
      setIsDarkMode(dark);
      localStorage.setItem('theme', themeMode);
    };

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      updateTheme(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        updateTheme(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      updateTheme(themeMode === 'dark');
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
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          // Customize the background colors for different elevations
          colorBgLayout: isDarkMode ? '#000000' : '#f0f2f5',
          colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
          colorBgElevated: isDarkMode ? '#1f1f1f' : '#ffffff',
          // Customize shadows for better visibility
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Layout style={{ 
        minHeight: '100vh',
        background: isDarkMode ? '#000000' : '#f0f2f5'
      }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          style={{ 
            background: isDarkMode ? '#141414' : '#ffffff',
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <Logo 
            collapsed={collapsed} 
            onLogoClick={() => navigate('/')}
          />
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
            background: isDarkMode ? '#141414' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: token.boxShadowSecondary,
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
              background: isDarkMode ? '#141414' : '#ffffff',
              borderRadius: token.borderRadiusLG,
              minHeight: 280,
              overflow: 'auto',
              boxShadow: token.boxShadowSecondary,
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
    </ConfigProvider>
  );
};

const Logo: React.FC<{ 
  collapsed: boolean; 
  onLogoClick: () => void;
}> = ({ collapsed, onLogoClick }) => {
  
  return (
    <div className="logo" style={{ 
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer'
    }}
    onClick={onLogoClick}
    >
      <Title level={collapsed ? 4 : 3} style={{ margin: 0 }}>
        {collapsed ? 'C' : 'Cinephilix'}
      </Title>
    </div>
  );
};

export default App;
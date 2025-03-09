import { Layout, Menu } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons'

const { Sider } = Layout

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
    const toggleCollapse = () => {
      setCollapsed(!collapsed);
    };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse} style={{ position: 'fixed', left: 0, height: '100vh' }}>
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<SearchOutlined />}>
          Search
        </Menu.Item>
        <Menu.Item key="3" icon={<InfoCircleOutlined />}>
          About
        </Menu.Item>
      </Menu>
      <div className="collapse-button" onClick={toggleCollapse}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  )
}

export default Sidebar

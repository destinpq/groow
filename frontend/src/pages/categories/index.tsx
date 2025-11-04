import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tree,
  Badge,
  Image,
  Empty,
  Breadcrumb,
  Tag,
  Space,
} from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Title, Text } = Typography;

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  productCount: number;
  image?: string;
  description?: string;
  children?: Category[];
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    parentId: null,
    productCount: 1245,
    image: 'https://via.placeholder.com/200x150?text=Electronics',
    description: 'Latest electronic devices and gadgets',
    children: [
      {
        id: 11,
        name: 'Audio',
        slug: 'electronics/audio',
        parentId: 1,
        productCount: 345,
        children: [
          { id: 111, name: 'Headphones', slug: 'electronics/audio/headphones', parentId: 11, productCount: 156 },
          { id: 112, name: 'Speakers', slug: 'electronics/audio/speakers', parentId: 11, productCount: 89 },
          { id: 113, name: 'Microphones', slug: 'electronics/audio/microphones', parentId: 11, productCount: 45 },
          { id: 114, name: 'Earbuds', slug: 'electronics/audio/earbuds', parentId: 11, productCount: 55 },
        ],
      },
      {
        id: 12,
        name: 'Computers',
        slug: 'electronics/computers',
        parentId: 1,
        productCount: 456,
        children: [
          { id: 121, name: 'Laptops', slug: 'electronics/computers/laptops', parentId: 12, productCount: 234 },
          { id: 122, name: 'Desktops', slug: 'electronics/computers/desktops', parentId: 12, productCount: 123 },
          { id: 123, name: 'Tablets', slug: 'electronics/computers/tablets', parentId: 12, productCount: 99 },
        ],
      },
      {
        id: 13,
        name: 'Mobile Devices',
        slug: 'electronics/mobile',
        parentId: 1,
        productCount: 234,
        children: [
          { id: 131, name: 'Smartphones', slug: 'electronics/mobile/smartphones', parentId: 13, productCount: 178 },
          { id: 132, name: 'Accessories', slug: 'electronics/mobile/accessories', parentId: 13, productCount: 56 },
        ],
      },
      {
        id: 14,
        name: 'Smart Home',
        slug: 'electronics/smart-home',
        parentId: 1,
        productCount: 210,
      },
    ],
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    parentId: null,
    productCount: 2340,
    image: 'https://via.placeholder.com/200x150?text=Fashion',
    description: 'Latest fashion trends and apparel',
    children: [
      {
        id: 21,
        name: "Men's Clothing",
        slug: 'fashion/mens',
        parentId: 2,
        productCount: 890,
        children: [
          { id: 211, name: 'Shirts', slug: 'fashion/mens/shirts', parentId: 21, productCount: 234 },
          { id: 212, name: 'Pants', slug: 'fashion/mens/pants', parentId: 21, productCount: 189 },
          { id: 213, name: 'Shoes', slug: 'fashion/mens/shoes', parentId: 21, productCount: 345 },
        ],
      },
      {
        id: 22,
        name: "Women's Clothing",
        slug: 'fashion/womens',
        parentId: 2,
        productCount: 1234,
        children: [
          { id: 221, name: 'Dresses', slug: 'fashion/womens/dresses', parentId: 22, productCount: 456 },
          { id: 222, name: 'Tops', slug: 'fashion/womens/tops', parentId: 22, productCount: 345 },
          { id: 223, name: 'Shoes', slug: 'fashion/womens/shoes', parentId: 22, productCount: 433 },
        ],
      },
      {
        id: 23,
        name: 'Accessories',
        slug: 'fashion/accessories',
        parentId: 2,
        productCount: 216,
      },
    ],
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    parentId: null,
    productCount: 1567,
    image: 'https://via.placeholder.com/200x150?text=Home',
    description: 'Home essentials and garden supplies',
    children: [
      {
        id: 31,
        name: 'Furniture',
        slug: 'home-garden/furniture',
        parentId: 3,
        productCount: 678,
        children: [
          { id: 311, name: 'Living Room', slug: 'home-garden/furniture/living', parentId: 31, productCount: 234 },
          { id: 312, name: 'Bedroom', slug: 'home-garden/furniture/bedroom', parentId: 31, productCount: 189 },
          { id: 313, name: 'Office', slug: 'home-garden/furniture/office', parentId: 31, productCount: 255 },
        ],
      },
      {
        id: 32,
        name: 'Kitchen',
        slug: 'home-garden/kitchen',
        parentId: 3,
        productCount: 445,
      },
      {
        id: 33,
        name: 'Garden',
        slug: 'home-garden/garden',
        parentId: 3,
        productCount: 444,
      },
    ],
  },
  {
    id: 4,
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    parentId: null,
    productCount: 892,
    image: 'https://via.placeholder.com/200x150?text=Sports',
    description: 'Sports equipment and fitness gear',
    children: [
      { id: 41, name: 'Exercise Equipment', slug: 'sports-fitness/exercise', parentId: 4, productCount: 345 },
      { id: 42, name: 'Sports Gear', slug: 'sports-fitness/gear', parentId: 4, productCount: 289 },
      { id: 43, name: 'Outdoor Recreation', slug: 'sports-fitness/outdoor', parentId: 4, productCount: 258 },
    ],
  },
];

const SubcategoryBrowserPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<Category[]>([]);

  const buildTreeData = (categories: Category[]): DataNode[] => {
    return categories.map(cat => ({
      title: (
        <Space>
          <span>{cat.name}</span>
          <Badge count={cat.productCount} showZero style={{ backgroundColor: '#1890ff' }} />
        </Space>
      ),
      key: cat.id.toString(),
      icon: expandedKeys.includes(cat.id.toString()) ? <FolderOpenOutlined /> : <FolderOutlined />,
      children: cat.children ? buildTreeData(cat.children) : undefined,
      data: cat,
    }));
  };

  const findCategoryById = (categories: Category[], id: number): Category | null => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const buildBreadcrumbPath = (categoryId: number): Category[] => {
    const path: Category[] = [];
    let current = findCategoryById(mockCategories, categoryId);
    
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        current = findCategoryById(mockCategories, current.parentId);
      } else {
        break;
      }
    }
    
    return path;
  };

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const categoryId = parseInt(selectedKeys[0] as string);
      const category = findCategoryById(mockCategories, categoryId);
      setSelectedCategory(category);
      setBreadcrumbPath(buildBreadcrumbPath(categoryId));
    }
  };

  const handleExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const treeData = buildTreeData(mockCategories);

  const displayCategories = selectedCategory?.children || mockCategories;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <AppstoreOutlined /> Browse Categories
        </Title>
        
        {/* Breadcrumb */}
        {breadcrumbPath.length > 0 && (
          <Breadcrumb style={{ marginTop: 16 }}>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            {breadcrumbPath.map((cat, idx) => (
              <Breadcrumb.Item
                key={cat.id}
                href={`/categories/${cat.slug}`}
              >
                {cat.name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
      </div>

      <Row gutter={24}>
        {/* Category Tree Sidebar */}
        <Col xs={24} lg={6}>
          <Card title="All Categories">
            <Tree
              showIcon
              defaultExpandAll={false}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={handleSelect}
              treeData={treeData}
            />
          </Card>
        </Col>

        {/* Category Grid */}
        <Col xs={24} lg={18}>
          <Card
            title={selectedCategory ? selectedCategory.name : 'All Categories'}
            extra={
              selectedCategory && (
                <Tag color="blue">{selectedCategory.productCount} products</Tag>
              )
            }
          >
            {selectedCategory?.description && (
              <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                <Text type="secondary">{selectedCategory.description}</Text>
              </div>
            )}

            {displayCategories.length === 0 ? (
              <Empty description="No subcategories found" />
            ) : (
              <Row gutter={[16, 16]}>
                {displayCategories.map(category => (
                  <Col xs={12} sm={8} md={6} key={category.id}>
                    <Card
                      hoverable
                      onClick={() => {
                        setSelectedCategory(category);
                        setBreadcrumbPath(buildBreadcrumbPath(category.id));
                        if (category.children && category.children.length > 0) {
                          setExpandedKeys([...expandedKeys, category.id.toString()]);
                        }
                      }}
                      cover={
                        category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            preview={false}
                            style={{ height: 120, objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              height: 120,
                              background: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FolderOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                          </div>
                        )
                      }
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text ellipsis style={{ fontSize: 14 }}>{category.name}</Text>
                            {category.children && category.children.length > 0 && (
                              <FolderOutlined style={{ color: '#1890ff' }} />
                            )}
                          </div>
                        }
                        description={
                          <div>
                            <Badge
                              count={category.productCount}
                              showZero
                              style={{ backgroundColor: '#52c41a' }}
                            />
                            {category.children && (
                              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                • {category.children.length} subcategories
                              </Text>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubcategoryBrowserPage;

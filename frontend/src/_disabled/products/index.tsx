import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Empty, message } from 'antd';
import { useNavigate } from 'umi';
import { productAPI, type Product } from '@/services/api/productAPI';
import { useCartStore } from '@/store/cartStore';
import ProductHeader from '@/components/products/ProductHeader';
import ProductSearch from '@/components/products/ProductSearch';
import ProductGrid from '@/components/products/ProductGrid';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchKeyword]);

  const loadProducts = async () => {
    try {
      setSearchLoading(true);
      
      const response = await productAPI.getProducts(currentPage, pageSize);
      
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to load products:', error);
      message.error('Failed to load products');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    // For now, just reload products - we can add search later
    loadProducts();
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({
        productId: product.id.toString(),
        quantity: 1,
      });
      message.success('Product added to cart');
    } catch (error) {
      message.error('Failed to add product to cart');
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    // For now, just show a message - we can implement wishlist later
    message.info('Wishlist feature coming soon!');
  };

  const handleProductView = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <ProductHeader 
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      <Row style={{ marginBottom: 24 }}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <ProductSearch 
            onSearch={handleSearch}
            loading={searchLoading}
          />
        </Col>
      </Row>

      {products.length === 0 && !searchLoading ? (
        <Empty description="No products found" />
      ) : (
        <ProductGrid
          products={products}
          wishlist={[]}
          loading={searchLoading}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onView={handleProductView}
        />
      )}

      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

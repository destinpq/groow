import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Comprehensive Analytics & Dashboard Data Seeding Script
 * 
 * This script seeds:
 * - Analytics metrics (time series data for last 30 days)
 * - Vendor performance stats
 * - Real-time metrics
 * - Dashboard configurations
 * - System health data
 * - Reports data
 * 
 * Run with: npm run seed:analytics
 */

async function seedAnalytics() {
  console.log('🌱 Starting analytics data seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // ============================================
    // 1. Seed Analytics Metrics (Time Series)
    // ============================================
    console.log('📊 Seeding analytics metrics...');
    
    const today = new Date();
    const metricsToSeed = [];

    // Generate last 30 days of data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Base values with growth trend
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseMultiplier = isWeekend ? 0.7 : 1.0;
      const growthFactor = 1 + (29 - i) * 0.02; // 2% daily growth
      
      // Revenue metrics
      const dailyRevenue = Math.round((15000 + Math.random() * 5000) * baseMultiplier * growthFactor);
      const dailyOrders = Math.round((80 + Math.random() * 40) * baseMultiplier * growthFactor);
      const dailyVisitors = Math.round((3500 + Math.random() * 1500) * baseMultiplier * growthFactor);
      const conversionRate = 2.5 + Math.random() * 2.0;
      
      metricsToSeed.push(
        // Revenue
        {
          metricType: 'revenue',
          entityType: 'global',
          date: date.toISOString().split('T')[0],
          granularity: 'day',
          value: dailyRevenue,
          previousValue: dailyRevenue * 0.95,
          changePercentage: 5.0 + Math.random() * 10,
          dimensions: { channel: 'all', source: 'all' },
          metadata: { calculationMethod: 'sum', dataQuality: 'high' }
        },
        // Orders
        {
          metricType: 'orders',
          entityType: 'global',
          date: date.toISOString().split('T')[0],
          granularity: 'day',
          value: dailyOrders,
          previousValue: Math.round(dailyOrders * 0.93),
          changePercentage: 7.0 + Math.random() * 8,
          dimensions: { channel: 'all', source: 'all' },
          metadata: { calculationMethod: 'count', dataQuality: 'high' }
        },
        // Traffic
        {
          metricType: 'traffic',
          entityType: 'global',
          date: date.toISOString().split('T')[0],
          granularity: 'day',
          value: dailyVisitors,
          previousValue: Math.round(dailyVisitors * 0.92),
          changePercentage: 8.0 + Math.random() * 7,
          dimensions: { channel: 'organic', source: 'google' },
          metadata: { calculationMethod: 'unique_count', dataQuality: 'high' }
        },
        // Conversion Rate
        {
          metricType: 'conversion_rate',
          entityType: 'global',
          date: date.toISOString().split('T')[0],
          granularity: 'day',
          value: conversionRate,
          previousValue: conversionRate * 0.95,
          changePercentage: 5.0,
          dimensions: { channel: 'all', source: 'all' },
          metadata: { calculationMethod: 'percentage', dataQuality: 'high' }
        },
        // Average Order Value
        {
          metricType: 'average_order_value',
          entityType: 'global',
          date: date.toISOString().split('T')[0],
          granularity: 'day',
          value: dailyRevenue / dailyOrders,
          previousValue: (dailyRevenue * 0.95) / (dailyOrders * 0.93),
          changePercentage: 2.0,
          dimensions: { channel: 'all', source: 'all' },
          metadata: { calculationMethod: 'average', dataQuality: 'high' }
        }
      );
    }

    // Insert metrics
    for (const metric of metricsToSeed) {
      await dataSource.query(
        `INSERT INTO analytics_metrics 
        ("metricType", "entityType", "entityId", date, granularity, value, "previousValue", "changePercentage", dimensions, metadata, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        ON CONFLICT DO NOTHING`,
        [
          metric.metricType,
          metric.entityType,
          null,
          metric.date,
          metric.granularity,
          metric.value,
          metric.previousValue,
          metric.changePercentage,
          JSON.stringify(metric.dimensions),
          JSON.stringify(metric.metadata)
        ]
      );
    }
    
    console.log(`✅ Seeded ${metricsToSeed.length} analytics metrics\n`);

    // ============================================
    // 2. Seed Vendor Performance Stats
    // ============================================
    console.log('🏪 Seeding vendor performance stats...');
    
    const vendors = await dataSource.query('SELECT id FROM vendors LIMIT 10');
    
    if (vendors.length > 0) {
      for (const vendor of vendors) {
        await dataSource.query(
          `INSERT INTO vendor_performance 
          ("vendorId", "totalSales", "totalOrders", "averageRating", "totalReviews", 
           "onTimeDeliveryRate", "returnRate", "responseTime", "qualityScore", 
           "customerSatisfaction", "period", "lastCalculated", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW())
          ON CONFLICT ("vendorId", period) DO UPDATE SET
            "totalSales" = EXCLUDED."totalSales",
            "totalOrders" = EXCLUDED."totalOrders",
            "averageRating" = EXCLUDED."averageRating",
            "lastCalculated" = NOW()`,
          [
            vendor.id,
            Math.round(50000 + Math.random() * 150000), // totalSales
            Math.round(200 + Math.random() * 500), // totalOrders
            4.0 + Math.random() * 1.0, // averageRating (4.0-5.0)
            Math.round(50 + Math.random() * 200), // totalReviews
            90 + Math.random() * 10, // onTimeDeliveryRate (90-100%)
            2 + Math.random() * 3, // returnRate (2-5%)
            Math.round(120 + Math.random() * 180), // responseTime (2-5 hours in minutes)
            85 + Math.random() * 15, // qualityScore (85-100)
            4.2 + Math.random() * 0.8, // customerSatisfaction (4.2-5.0)
            'monthly', // period
          ]
        );
      }
      console.log(`✅ Seeded performance stats for ${vendors.length} vendors\n`);
    } else {
      console.log('⚠️  No vendors found, skipping vendor performance stats\n');
    }

    // ============================================
    // 3. Seed Real-time Metrics Snapshot
    // ============================================
    console.log('⚡ Seeding real-time metrics...');
    
    await dataSource.query(
      `INSERT INTO analytics_metrics 
      ("metricType", "entityType", date, granularity, value, dimensions, metadata, "createdAt", "updatedAt")
      VALUES 
        ('current_visitors', 'global', CURRENT_DATE, 'hour', $1, '{"channel": "all"}', '{"dataQuality": "high"}', NOW(), NOW()),
        ('active_orders', 'global', CURRENT_DATE, 'hour', $2, '{"status": "processing"}', '{"dataQuality": "high"}', NOW(), NOW()),
        ('today_revenue', 'global', CURRENT_DATE, 'day', $3, '{"channel": "all"}', '{"dataQuality": "high"}', NOW(), NOW()),
        ('today_orders', 'global', CURRENT_DATE, 'day', $4, '{"channel": "all"}', '{"dataQuality": "high"}', NOW(), NOW())
      ON CONFLICT DO NOTHING`,
      [
        Math.round(120 + Math.random() * 80), // current visitors (120-200)
        Math.round(25 + Math.random() * 20), // active orders (25-45)
        Math.round(18000 + Math.random() * 7000), // today revenue
        Math.round(95 + Math.random() * 40) // today orders
      ]
    );
    
    console.log('✅ Seeded real-time metrics\n');

    // ============================================
    // 4. Seed Analytics Dashboards
    // ============================================
    console.log('📊 Seeding analytics dashboards...');
    
    const adminUsers = await dataSource.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );
    
    if (adminUsers.length > 0) {
      const adminId = adminUsers[0].id;
      
      const dashboards = [
        {
          name: 'Executive Dashboard',
          description: 'High-level overview of business performance',
          type: 'overview',
          config: {
            widgets: [
              {
                id: 'revenue-metric',
                type: 'metric',
                title: 'Total Revenue',
                position: { x: 0, y: 0, width: 3, height: 2 },
                dataSource: 'analytics_metrics',
                visualization: 'metric',
                filters: { metricType: 'revenue' }
              },
              {
                id: 'orders-metric',
                type: 'metric',
                title: 'Total Orders',
                position: { x: 3, y: 0, width: 3, height: 2 },
                dataSource: 'analytics_metrics',
                visualization: 'metric',
                filters: { metricType: 'orders' }
              },
              {
                id: 'revenue-chart',
                type: 'chart',
                title: 'Revenue Trend',
                position: { x: 0, y: 2, width: 6, height: 4 },
                dataSource: 'analytics_metrics',
                visualization: 'line',
                filters: { metricType: 'revenue', granularity: 'day' }
              }
            ],
            layout: 'grid',
            theme: 'light',
            refreshInterval: 300000,
            timezone: 'UTC'
          },
          visibility: 'team',
          isDefault: true
        },
        {
          name: 'Sales Analytics',
          description: 'Detailed sales performance and trends',
          type: 'sales',
          config: {
            widgets: [
              {
                id: 'sales-overview',
                type: 'chart',
                title: 'Sales Overview',
                position: { x: 0, y: 0, width: 12, height: 6 },
                dataSource: 'analytics_metrics',
                visualization: 'area',
                filters: { metricType: 'revenue' }
              }
            ],
            layout: 'grid',
            theme: 'light',
            refreshInterval: 600000,
            timezone: 'UTC'
          },
          visibility: 'team',
          isDefault: false
        }
      ];

      for (const dashboard of dashboards) {
        await dataSource.query(
          `INSERT INTO analytics_dashboards 
          (name, description, type, config, filters, visibility, permissions, "isDefault", "isActive", "userId", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          ON CONFLICT DO NOTHING`,
          [
            dashboard.name,
            dashboard.description,
            dashboard.type,
            JSON.stringify(dashboard.config),
            JSON.stringify({ dateRange: { start: '2025-10-15', end: '2025-11-15' }, granularity: 'day' }),
            dashboard.visibility,
            JSON.stringify({ view: ['admin', 'manager'], edit: ['admin'], share: ['admin'] }),
            dashboard.isDefault,
            true,
            adminId
          ]
        );
      }
      
      console.log(`✅ Seeded ${dashboards.length} analytics dashboards\n`);
    } else {
      console.log('⚠️  No admin users found, skipping dashboard creation\n');
    }

    // ============================================
    // 5. Seed Analytics Reports
    // ============================================
    console.log('📄 Seeding analytics reports...');
    
    const reports = [
      {
        title: 'Monthly Sales Report - November 2025',
        description: 'Comprehensive sales analysis for November 2025',
        type: 'sales',
        category: 'operational',
        status: 'completed',
        metrics: {
          totalRevenue: 542000,
          totalOrders: 2847,
          averageOrderValue: 190.38,
          conversionRate: 3.6,
          profitMargin: 24.5
        },
        data: {
          summary: {
            period: 'November 2025',
            growth: '+12.5% vs October',
            topCategory: 'Electronics',
            topVendor: 'TechSupplies Inc.'
          },
          insights: [
            {
              type: 'positive',
              message: 'Revenue increased by 12.5% compared to last month',
              severity: 'high',
              actionable: false
            },
            {
              type: 'warning',
              message: 'Conversion rate slightly below target of 4%',
              severity: 'medium',
              actionable: true,
              recommendation: 'Consider A/B testing checkout flow improvements'
            }
          ]
        }
      },
      {
        title: 'Product Performance Report',
        description: 'Analysis of product sales and inventory',
        type: 'products',
        category: 'operational',
        status: 'completed',
        metrics: {
          totalProducts: 1250,
          activeProducts: 1180,
          outOfStock: 45,
          lowStock: 78
        },
        data: {
          summary: {
            topPerformer: 'Wireless Headphones Pro',
            fastestGrowing: 'Smart Home Hub',
            needsAttention: 45
          }
        }
      }
    ];

    for (const report of reports) {
      await dataSource.query(
        `INSERT INTO analytics_reports 
        (title, description, type, category, "dateRange", filters, metrics, data, status, format, "fileUrl", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        ON CONFLICT DO NOTHING`,
        [
          report.title,
          report.description,
          report.type,
          report.category,
          JSON.stringify({ start: '2025-11-01', end: '2025-11-15', timezone: 'UTC', granularity: 'day' }),
          JSON.stringify({}),
          JSON.stringify(report.metrics),
          JSON.stringify(report.data),
          report.status,
          'json',
          null
        ]
      );
    }
    
    console.log(`✅ Seeded ${reports.length} analytics reports\n`);

    // ============================================
    // 6. Seed Analytics Events (Sample behavioral data)
    // ============================================
    console.log('🎯 Seeding analytics events...');
    
    const eventTypes = [
      'page_view',
      'product_view',
      'add_to_cart',
      'remove_from_cart',
      'checkout_initiated',
      'purchase_completed',
      'search_performed'
    ];
    
    const eventsToSeed = [];
    for (let i = 0; i < 100; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      
      eventsToSeed.push({
        eventType,
        category: 'user_interaction',
        entityType: eventType.includes('product') ? 'product' : eventType.includes('cart') ? 'cart' : 'page',
        url: `/products/${Math.floor(Math.random() * 100)}`,
        properties: {
          value: eventType === 'purchase_completed' ? Math.round(100 + Math.random() * 500) : null,
          currency: 'USD'
        },
        device: {
          type: Math.random() > 0.3 ? 'desktop' : 'mobile',
          os: Math.random() > 0.5 ? 'Windows' : 'macOS',
          browser: Math.random() > 0.5 ? 'Chrome' : 'Safari'
        },
        timestamp
      });
    }

    for (const event of eventsToSeed) {
      await dataSource.query(
        `INSERT INTO analytics_events 
        ("eventType", category, "entityType", "entityId", "userId", "sessionId", 
         "userAgent", "ipAddress", url, referrer, properties, location, device, utm, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          event.eventType,
          event.category,
          event.entityType,
          null,
          null,
          `session_${Math.random().toString(36).substr(2, 9)}`,
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          '192.168.1.1',
          event.url,
          'https://google.com',
          JSON.stringify(event.properties),
          JSON.stringify({ country: 'US', city: 'New York' }),
          JSON.stringify(event.device),
          JSON.stringify({ source: 'organic', medium: 'search' }),
          event.timestamp
        ]
      );
    }
    
    console.log(`✅ Seeded ${eventsToSeed.length} analytics events\n`);

    // ============================================
    // Summary
    // ============================================
    console.log('✨ Analytics seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${metricsToSeed.length} analytics metrics (30 days of data)`);
    console.log(`   - ${vendors.length} vendor performance records`);
    console.log(`   - Real-time metrics snapshot`);
    console.log(`   - 2 analytics dashboards`);
    console.log(`   - ${reports.length} analytics reports`);
    console.log(`   - ${eventsToSeed.length} behavioral events`);
    console.log('\n🎉 Your dashboard should now load without 404 errors!\n');

  } catch (error) {
    console.error('❌ Analytics seeding error:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed function
seedAnalytics()
  .then(() => {
    console.log('✅ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });


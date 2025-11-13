import { DataSource } from 'typeorm';
import { Service } from '../../modules/service/entities/service.entity';
import { ServiceReview } from '../../modules/service/entities/service-review.entity';
import { ServiceStatus, ServiceType, PricingModel } from '../../common/enums';
import { Vendor } from '../../modules/auth/entities/vendor.entity';
import { Customer } from '../../modules/auth/entities/customer.entity';

export const itServicesSeedData = {
  services: [
    // Web Development Services
    {
      name: 'Custom Web Application Development',
      slug: 'custom-web-application-development',
      description: 'Full-stack web application development using modern technologies like React, Node.js, and cloud deployment. We build scalable, secure, and user-friendly web applications tailored to your business needs.',
      shortDescription: 'Custom web applications with modern tech stack',
      serviceCode: 'WEB-001',
      categoryId: 'software-development',
      subcategoryId: 'web-development',
      serviceType: ServiceType.PROJECT,
      pricingModel: PricingModel.FIXED,
      basePrice: 5000,
      discountPrice: 4500,
      estimatedDuration: 8,
      durationUnit: 'weeks',
      minOrderSize: 1,
      maxConcurrentProjects: 3,
      images: ['/uploads/services/web-development-1.jpg', '/uploads/services/web-development-2.jpg'],
      videoUrl: 'https://youtube.com/watch?v=demo-web-dev',
      servicePackages: [
        {
          id: 'basic-web',
          name: 'Basic Package',
          description: 'Simple responsive website with up to 5 pages',
          price: 2500,
          features: ['Responsive Design', 'Contact Form', 'SEO Optimization', 'Mobile Friendly'],
          deliveryTime: 4,
          revisions: 3
        },
        {
          id: 'standard-web',
          name: 'Standard Package', 
          description: 'Dynamic website with CMS and basic e-commerce',
          price: 5000,
          features: ['Custom Design', 'CMS Integration', 'Payment Gateway', 'Admin Dashboard', 'SSL Certificate'],
          deliveryTime: 8,
          revisions: 5
        },
        {
          id: 'premium-web',
          name: 'Premium Package',
          description: 'Full-featured web application with advanced functionality',
          price: 10000,
          features: ['Custom Development', 'API Integration', 'Advanced Security', 'Performance Optimization', 'Maintenance Support'],
          deliveryTime: 12,
          revisions: 8
        }
      ],
      technicalSpecs: [
        {
          category: 'Frontend Technologies',
          items: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Ant Design']
        },
        {
          category: 'Backend Technologies',
          items: ['Node.js', 'Express.js', 'NestJS', 'PostgreSQL', 'MongoDB']
        },
        {
          category: 'Cloud Platforms',
          items: ['AWS', 'Vercel', 'Digital Ocean', 'Azure', 'Google Cloud']
        }
      ],
      deliverables: [
        'Complete source code',
        'Deployed application',
        'Technical documentation',
        'User manual',
        '30 days post-launch support'
      ],
      requirements: [
        'Business requirements document',
        'Design mockups (if available)',
        'Content and media assets',
        'Third-party service credentials'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.8,
      reviewCount: 47,
      viewCount: 1250,
      ordersCompleted: 23,
      portfolio: [
        {
          title: 'E-commerce Platform for Fashion Brand',
          description: 'Modern e-commerce website with inventory management',
          image: '/uploads/portfolio/ecommerce-fashion.jpg',
          url: 'https://demo-fashion.example.com',
          technologies: ['React', 'Node.js', 'Stripe', 'AWS']
        },
        {
          title: 'Restaurant Management System',
          description: 'Complete restaurant ordering and management platform',
          image: '/uploads/portfolio/restaurant-system.jpg',
          technologies: ['Next.js', 'PostgreSQL', 'Payment Gateway']
        }
      ],
      isActive: true,
      isFeatured: true,
      responseTime: 2,
      availableTimezones: ['UTC', 'PST', 'EST', 'IST'],
      supportedLanguages: ['English', 'Hindi', 'Spanish']
    },
    
    // Mobile App Development
    {
      name: 'Cross-Platform Mobile App Development',
      slug: 'cross-platform-mobile-app-development',
      description: 'Native-quality mobile applications for iOS and Android using React Native and Flutter. From concept to deployment, we handle the entire mobile app development lifecycle.',
      shortDescription: 'iOS & Android apps with single codebase',
      serviceCode: 'MOB-001',
      categoryId: 'software-development',
      subcategoryId: 'mobile-development',
      serviceType: ServiceType.PROJECT,
      pricingModel: PricingModel.FIXED,
      basePrice: 8000,
      discountPrice: 7200,
      estimatedDuration: 12,
      durationUnit: 'weeks',
      minOrderSize: 1,
      maxConcurrentProjects: 2,
      images: ['/uploads/services/mobile-dev-1.jpg', '/uploads/services/mobile-dev-2.jpg'],
      servicePackages: [
        {
          id: 'basic-mobile',
          name: 'Basic App',
          description: 'Simple mobile app with core features',
          price: 5000,
          features: ['Cross-platform', 'Push Notifications', 'User Authentication', 'Basic UI/UX'],
          deliveryTime: 8,
          revisions: 3
        },
        {
          id: 'standard-mobile',
          name: 'Standard App',
          description: 'Feature-rich app with backend integration',
          price: 8000,
          features: ['API Integration', 'Payment Gateway', 'Admin Panel', 'Analytics', 'App Store Deployment'],
          deliveryTime: 12,
          revisions: 5
        },
        {
          id: 'premium-mobile',
          name: 'Enterprise App',
          description: 'Complex app with advanced features and scalability',
          price: 15000,
          features: ['Custom Architecture', 'Real-time Features', 'Advanced Security', 'CI/CD Pipeline', '90 days support'],
          deliveryTime: 16,
          revisions: 8
        }
      ],
      technicalSpecs: [
        {
          category: 'Mobile Frameworks',
          items: ['React Native', 'Flutter', 'Expo', 'Native iOS/Android']
        },
        {
          category: 'Backend Services',
          items: ['Firebase', 'AWS Amplify', 'Node.js APIs', 'GraphQL']
        }
      ],
      deliverables: [
        'iOS and Android apps',
        'Source code',
        'App Store deployment',
        'Technical documentation',
        'Testing reports'
      ],
      requirements: [
        'App concept and features list',
        'UI/UX designs',
        'Apple Developer Account',
        'Google Play Developer Account'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.7,
      reviewCount: 32,
      viewCount: 890,
      ordersCompleted: 16,
      isActive: true,
      isFeatured: true,
      responseTime: 3,
      availableTimezones: ['UTC', 'EST', 'IST'],
      supportedLanguages: ['English', 'Hindi']
    },

    // Cloud Services
    {
      name: 'AWS Cloud Migration & Setup',
      slug: 'aws-cloud-migration-setup',
      description: 'Complete cloud migration services including infrastructure setup, security configuration, and cost optimization. We help businesses move to AWS with minimal downtime and maximum efficiency.',
      shortDescription: 'Professional AWS cloud migration and setup',
      serviceCode: 'CLD-001',
      categoryId: 'cloud-services',
      subcategoryId: 'aws-migration',
      serviceType: ServiceType.PROJECT,
      pricingModel: PricingModel.CUSTOM,
      basePrice: 3000,
      estimatedDuration: 6,
      durationUnit: 'weeks',
      minOrderSize: 1,
      maxConcurrentProjects: 5,
      images: ['/uploads/services/aws-migration-1.jpg'],
      servicePackages: [
        {
          id: 'basic-aws',
          name: 'Basic Migration',
          description: 'Simple application migration to AWS',
          price: 3000,
          features: ['EC2 Setup', 'RDS Configuration', 'Basic Security', 'Documentation'],
          deliveryTime: 4,
          revisions: 2
        },
        {
          id: 'enterprise-aws',
          name: 'Enterprise Migration',
          description: 'Complex enterprise migration with high availability',
          price: 8000,
          features: ['Multi-AZ Setup', 'Load Balancing', 'Auto Scaling', 'Monitoring', 'Cost Optimization'],
          deliveryTime: 8,
          revisions: 5
        }
      ],
      technicalSpecs: [
        {
          category: 'AWS Services',
          items: ['EC2', 'RDS', 'S3', 'CloudFront', 'Route 53', 'Lambda', 'ELB', 'VPC']
        },
        {
          category: 'Tools',
          items: ['Terraform', 'CloudFormation', 'AWS CLI', 'CloudWatch']
        }
      ],
      deliverables: [
        'Migrated infrastructure',
        'Infrastructure as Code',
        'Security audit report',
        'Cost optimization plan',
        'Monitoring setup'
      ],
      requirements: [
        'Current infrastructure details',
        'AWS account access',
        'Business requirements',
        'Downtime windows'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.9,
      reviewCount: 28,
      viewCount: 650,
      ordersCompleted: 14,
      isActive: true,
      isFeatured: false,
      responseTime: 4,
      availableTimezones: ['UTC', 'PST', 'EST'],
      supportedLanguages: ['English']
    },

    // Cybersecurity Services
    {
      name: 'Website Security Audit & Penetration Testing',
      slug: 'website-security-audit-penetration-testing',
      description: 'Comprehensive security assessment of your web applications including vulnerability scanning, penetration testing, and detailed security recommendations to protect against cyber threats.',
      shortDescription: 'Professional security audit and penetration testing',
      serviceCode: 'SEC-001',
      categoryId: 'cybersecurity',
      subcategoryId: 'security-audit',
      serviceType: ServiceType.PROJECT,
      pricingModel: PricingModel.FIXED,
      basePrice: 2500,
      estimatedDuration: 3,
      durationUnit: 'weeks',
      minOrderSize: 1,
      maxConcurrentProjects: 8,
      images: ['/uploads/services/security-audit-1.jpg'],
      servicePackages: [
        {
          id: 'basic-security',
          name: 'Basic Security Audit',
          description: 'Standard vulnerability assessment',
          price: 1500,
          features: ['Automated Scanning', 'OWASP Top 10 Check', 'Basic Report'],
          deliveryTime: 1,
          revisions: 1
        },
        {
          id: 'comprehensive-security',
          name: 'Comprehensive Audit',
          description: 'Detailed manual testing and assessment',
          price: 2500,
          features: ['Manual Testing', 'Penetration Testing', 'Detailed Report', 'Remediation Guide'],
          deliveryTime: 3,
          revisions: 2
        }
      ],
      technicalSpecs: [
        {
          category: 'Testing Tools',
          items: ['Nessus', 'Burp Suite', 'OWASP ZAP', 'Nmap', 'Metasploit']
        },
        {
          category: 'Testing Areas',
          items: ['Authentication', 'Authorization', 'Input Validation', 'Session Management', 'Encryption']
        }
      ],
      deliverables: [
        'Security assessment report',
        'Vulnerability details',
        'Risk analysis',
        'Remediation recommendations',
        'Executive summary'
      ],
      requirements: [
        'Website/application URLs',
        'Testing credentials',
        'Testing timeframe',
        'Scope of testing'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.6,
      reviewCount: 19,
      viewCount: 420,
      ordersCompleted: 11,
      isActive: true,
      responseTime: 6,
      availableTimezones: ['UTC', 'EST'],
      supportedLanguages: ['English']
    },

    // DevOps Services
    {
      name: 'DevOps CI/CD Pipeline Setup',
      slug: 'devops-cicd-pipeline-setup',
      description: 'Setup automated CI/CD pipelines for faster and more reliable software deployments. Includes Docker containerization, automated testing, and deployment automation using modern DevOps tools.',
      shortDescription: 'Automated CI/CD pipeline implementation',
      serviceCode: 'DEV-001',
      categoryId: 'devops',
      subcategoryId: 'cicd-setup',
      serviceType: ServiceType.PROJECT,
      pricingModel: PricingModel.FIXED,
      basePrice: 2000,
      estimatedDuration: 4,
      durationUnit: 'weeks',
      minOrderSize: 1,
      maxConcurrentProjects: 6,
      images: ['/uploads/services/devops-cicd-1.jpg'],
      servicePackages: [
        {
          id: 'basic-cicd',
          name: 'Basic Pipeline',
          description: 'Simple CI/CD setup with basic automation',
          price: 1500,
          features: ['GitHub Actions', 'Docker Setup', 'Basic Tests', 'Single Environment'],
          deliveryTime: 2,
          revisions: 2
        },
        {
          id: 'advanced-cicd',
          name: 'Advanced Pipeline',
          description: 'Multi-stage pipeline with comprehensive testing',
          price: 3000,
          features: ['Multi-stage Pipeline', 'Automated Testing', 'Multiple Environments', 'Monitoring', 'Rollback Strategy'],
          deliveryTime: 4,
          revisions: 3
        }
      ],
      technicalSpecs: [
        {
          category: 'CI/CD Tools',
          items: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'Docker', 'Kubernetes']
        },
        {
          category: 'Cloud Platforms',
          items: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean']
        }
      ],
      deliverables: [
        'Configured CI/CD pipeline',
        'Docker containers',
        'Deployment scripts',
        'Documentation',
        'Training session'
      ],
      requirements: [
        'Source code repository',
        'Cloud platform access',
        'Application requirements',
        'Deployment targets'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.5,
      reviewCount: 15,
      viewCount: 320,
      ordersCompleted: 8,
      isActive: true,
      responseTime: 8,
      availableTimezones: ['UTC', 'PST'],
      supportedLanguages: ['English']
    },

    // Consulting Services
    {
      name: 'Technical Architecture Consultation',
      slug: 'technical-architecture-consultation',
      description: 'Expert technical consultation for system architecture, technology stack selection, and scalability planning. Get professional guidance for your technical decisions and project planning.',
      shortDescription: 'Expert technical architecture guidance',
      serviceCode: 'CON-001',
      categoryId: 'consulting',
      subcategoryId: 'architecture-consulting',
      serviceType: ServiceType.CONSULTATION,
      pricingModel: PricingModel.HOURLY,
      basePrice: 150,
      estimatedDuration: 4,
      durationUnit: 'hours',
      minOrderSize: 2,
      maxConcurrentProjects: 10,
      images: ['/uploads/services/tech-consulting-1.jpg'],
      servicePackages: [
        {
          id: 'basic-consultation',
          name: 'Basic Consultation',
          description: 'Single session technical review',
          price: 300,
          features: ['2 Hours Session', 'Technology Review', 'Basic Recommendations'],
          deliveryTime: 1,
          revisions: 0
        },
        {
          id: 'comprehensive-consultation',
          name: 'Comprehensive Review',
          description: 'Detailed architecture review and planning',
          price: 800,
          features: ['8 Hours Consultation', 'Architecture Document', 'Implementation Roadmap', 'Follow-up Session'],
          deliveryTime: 2,
          revisions: 1
        }
      ],
      technicalSpecs: [
        {
          category: 'Expertise Areas',
          items: ['Microservices', 'Cloud Architecture', 'Database Design', 'API Design', 'Security Architecture']
        },
        {
          category: 'Technologies',
          items: ['Node.js', 'Python', 'Java', 'React', 'AWS', 'Docker', 'Kubernetes']
        }
      ],
      deliverables: [
        'Architecture recommendations',
        'Technology stack suggestions',
        'Scalability plan',
        'Best practices guide',
        'Meeting recordings'
      ],
      requirements: [
        'Project requirements',
        'Current system overview',
        'Business objectives',
        'Technical constraints'
      ],
      status: ServiceStatus.ACTIVE,
      rating: 4.9,
      reviewCount: 42,
      viewCount: 850,
      ordersCompleted: 35,
      isActive: true,
      isFeatured: true,
      responseTime: 1,
      availableTimezones: ['UTC', 'PST', 'EST', 'IST'],
      supportedLanguages: ['English', 'Hindi']
    }
  ],

  reviews: [
    // Reviews for Web Development Service
    {
      serviceId: 'WEB-001',
      rating: 5,
      comment: 'Excellent work on our e-commerce platform. The team delivered exactly what we needed on time and within budget. Highly recommend!',
      pros: ['Great communication', 'On-time delivery', 'High quality code', 'Responsive design'],
      cons: ['Minor delay in initial wireframes'],
      isVerified: true,
      isActive: true
    },
    {
      serviceId: 'WEB-001',
      rating: 4,
      comment: 'Professional service with good technical expertise. The website looks great and functions well.',
      pros: ['Technical expertise', 'Clean code', 'SEO optimization'],
      cons: ['Could improve documentation'],
      isVerified: true,
      isActive: true
    },
    
    // Reviews for Mobile App Service
    {
      serviceId: 'MOB-001',
      rating: 5,
      comment: 'Amazing mobile app development! The app works flawlessly on both iOS and Android. Great user experience.',
      pros: ['Cross-platform compatibility', 'Smooth performance', 'Great UI/UX', 'Excellent support'],
      cons: [],
      isVerified: true,
      isActive: true
    },
    
    // Reviews for Cloud Migration Service
    {
      serviceId: 'CLD-001',
      rating: 5,
      comment: 'Seamless migration to AWS with zero downtime. The team handled everything professionally and provided excellent documentation.',
      pros: ['Zero downtime migration', 'Cost optimization', 'Excellent documentation', 'Ongoing support'],
      cons: ['Initial setup took longer than expected'],
      isVerified: true,
      isActive: true
    },
    
    // Reviews for Security Audit Service
    {
      serviceId: 'SEC-001',
      rating: 4,
      comment: 'Comprehensive security audit with detailed findings and actionable recommendations. Helped us improve our security posture significantly.',
      pros: ['Detailed reports', 'Actionable recommendations', 'Expert knowledge'],
      cons: ['Report could be more visual'],
      isVerified: true,
      isActive: true
    },
    
    // Reviews for DevOps Service
    {
      serviceId: 'DEV-001',
      rating: 5,
      comment: 'Fantastic CI/CD pipeline setup! Deployment process is now automated and much faster. Great work!',
      pros: ['Automated deployments', 'Faster releases', 'Good documentation', 'Training provided'],
      cons: [],
      isVerified: true,
      isActive: true
    },
    
    // Reviews for Technical Consultation
    {
      serviceId: 'CON-001',
      rating: 5,
      comment: 'Exceptional technical guidance. The architect provided valuable insights that saved us months of development time.',
      pros: ['Expert knowledge', 'Clear explanations', 'Practical recommendations', 'Responsive communication'],
      cons: [],
      isVerified: true,
      isActive: true
    }
  ]
};

export async function seedServices(dataSource: DataSource) {
  console.log('🌱 Seeding IT services data...');
  
  const serviceRepository = dataSource.getRepository(Service);
  const reviewRepository = dataSource.getRepository(ServiceReview);
  const vendorRepository = dataSource.getRepository(Vendor);
  const customerRepository = dataSource.getRepository(Customer);
  
  try {
    // Get actual vendor and customer IDs
    const vendors = await vendorRepository.find({ take: 5 });
    const customers = await customerRepository.find({ take: 10 });
    
    if (vendors.length === 0) {
      throw new Error('No vendors found in database. Please seed vendors first.');
    }
    if (customers.length === 0) {
      throw new Error('No customers found in database. Please seed customers first.');
    }
    
    // Clear existing data (only delete if tables have data)
    const reviewCount = await reviewRepository.count();
    const serviceCount = await serviceRepository.count();
    
    if (reviewCount > 0) {
      await reviewRepository.delete({});
    }
    if (serviceCount > 0) {
      await serviceRepository.delete({});
    }
    console.log('📝 Cleared existing services data');
    
    // Seed services
    const services = [];
    for (let i = 0; i < itServicesSeedData.services.length; i++) {
      const serviceData = itServicesSeedData.services[i];
      // Assign vendors in round-robin fashion
      const vendorId = vendors[i % vendors.length].id;
      
      const service = serviceRepository.create({
        ...serviceData,
        vendorId: vendorId,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      services.push(await serviceRepository.save(service));
      console.log(`✅ Created service: ${service.name}`);
    }
    
    // Seed reviews
    for (let i = 0; i < itServicesSeedData.reviews.length; i++) {
      const reviewData = itServicesSeedData.reviews[i];
      const service = services.find(s => s.serviceCode === reviewData.serviceId);
      if (service) {
        // Assign customers in round-robin fashion
        const customerId = customers[i % customers.length].id;
        
        const review = reviewRepository.create({
          ...reviewData,
          serviceId: service.id,
          customerId: customerId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await reviewRepository.save(review);
        console.log(`✅ Created review for service: ${service.name}`);
      }
    }
    
    console.log(`✅ Successfully seeded ${services.length} services with reviews`);
  } catch (error) {
    console.error('❌ Error seeding services data:', error);
    throw error;
  }
}
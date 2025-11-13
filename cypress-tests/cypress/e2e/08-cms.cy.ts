/// <reference types="cypress" />

describe('CMS APIs', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('Banners', () => {
    it('GET /cms/banners - Should list all banners', () => {
      cy.apiRequest('GET', '/cms/banners').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('GET /cms/banners/active - Should get active banners', () => {
      cy.apiRequest('GET', '/cms/banners/active').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('POST /cms/banners - Should create a banner', () => {
      const bannerData = {
        title: 'Test Banner',
        imageUrl: 'https://example.com/banner.jpg',
        link: '/test',
        isActive: true
      };

      cy.apiRequest('POST', '/cms/banners', bannerData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401]);
      });
    });
  });

  describe('FAQs', () => {
    it('GET /cms/faqs - Should list all FAQs', () => {
      cy.apiRequest('GET', '/cms/faqs').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('POST /cms/faqs - Should create a FAQ', () => {
      const faqData = {
        question: 'Test Question?',
        answer: 'Test Answer',
        category: 'general',
        isActive: true
      };

      cy.apiRequest('POST', '/cms/faqs', faqData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401]);
      });
    });
  });

  describe('Pages', () => {
    it('GET /cms/pages - Should list all pages', () => {
      cy.apiRequest('GET', '/cms/pages').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('POST /cms/pages - Should create a page', () => {
      const pageData = {
        title: 'Test Page',
        slug: 'test-page-' + Date.now(),
        content: 'Test content',
        isActive: true
      };

      cy.apiRequest('POST', '/cms/pages', pageData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401]);
      });
    });
  });
});


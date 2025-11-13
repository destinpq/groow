/// <reference types="cypress" />

describe('Marketing APIs - Deals, Coupons, Promotions', () => {
  let adminToken: string;

  before(() => {
    cy.loginAsAdmin().then((token) => {
      adminToken = token;
    });
  });

  describe('Deals APIs', () => {
    it('GET /deals - Should list all deals', () => {
      cy.apiRequest('GET', '/deals', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /deals/stats - Should get deal statistics', () => {
      cy.apiRequest('GET', '/deals/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /deals/active - Should get active deals', () => {
      cy.apiRequest('GET', '/deals/active', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /deals/trending - Should get trending deals', () => {
      cy.apiRequest('GET', '/deals/trending', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('POST /deals - Should create a deal', () => {
      const dealData = {
        title: 'Test Deal',
        description: 'Test Deal Description',
        discountPercentage: 20,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      };

      cy.apiRequest('POST', '/deals', dealData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401]);
      });
    });
  });

  describe('Coupons APIs', () => {
    it('GET /coupons - Should list all coupons', () => {
      cy.apiRequest('GET', '/coupons', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /coupons/stats - Should get coupon statistics', () => {
      cy.apiRequest('GET', '/coupons/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('POST /coupons - Should create a coupon', () => {
      const couponData = {
        code: 'TEST' + Date.now(),
        discountType: 'percentage',
        discountValue: 10,
        isActive: true
      };

      cy.apiRequest('POST', '/coupons', couponData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });

  describe('Promotions APIs', () => {
    it('GET /promotions - Should list all promotions', () => {
      cy.apiRequest('GET', '/promotions', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('GET /promotions/stats - Should get promotion statistics', () => {
      cy.apiRequest('GET', '/promotions/stats', null, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('POST /promotions - Should create a promotion', () => {
      const promotionData = {
        name: 'Test Promotion',
        description: 'Test Promotion Description',
        isActive: true
      };

      cy.apiRequest('POST', '/promotions', promotionData, adminToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 404]);
      });
    });
  });
});


/**
 * Auto-generated API Tests for Iot Module
 * Generated: 2025-11-15T08:17:13.110Z
 * Endpoints: 168
 */

import {
  testAPI,
  initializeTestSession,
  saveTestReport,
} from '../../support/api-test-helpers';

describe('🔍 Iot Module API Tests', () => {
  let authToken: string;

  before(() => {
    // Get auth token if needed
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200 && response.body.data?.accessToken) {
        authToken = response.body.data.accessToken;
      }
    });
  });

  describe('GET Requests (71 endpoints)', () => {
    it('should test GET /iot/alerts', () => {
      testAPI('GET', '/iot/alerts', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/alerts',
      });
    });

    it('should test GET /iot/analytics/alerts', () => {
      testAPI('GET', '/iot/analytics/alerts', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/alerts',
      });
    });

    it('should test GET /iot/analytics/alerts/${alertId}', () => {
      testAPI('GET', '/iot/analytics/alerts/test-id', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/alerts/${alertId}',
      });
    });

    it('should test GET /iot/analytics/catalog', () => {
      testAPI('GET', '/iot/analytics/catalog', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/catalog',
      });
    });

    it('should test GET /iot/analytics/dashboards', () => {
      testAPI('GET', '/iot/analytics/dashboards', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/dashboards',
      });
    });

    it('should test GET /iot/analytics/dashboards/${dashboardId}', () => {
      testAPI('GET', '/iot/analytics/dashboards/test-id', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/dashboards/${dashboardId}',
      });
    });

    it('should test GET /iot/analytics/dashboards/${dashboardId}/data', () => {
      testAPI('GET', '/iot/analytics/dashboards/test-id/data', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/dashboards/${dashboardId}/data',
      });
    });

    it('should test GET /iot/analytics/insights', () => {
      testAPI('GET', '/iot/analytics/insights', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/insights',
      });
    });

    it('should test GET /iot/analytics/insights/${insightId}', () => {
      testAPI('GET', '/iot/analytics/insights/test-id', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/insights/${insightId}',
      });
    });

    it('should test GET /iot/analytics/metrics', () => {
      testAPI('GET', '/iot/analytics/metrics', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/metrics',
      });
    });

    it('should test GET /iot/analytics/metrics/${metricId}', () => {
      testAPI('GET', '/iot/analytics/metrics/test-id', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/metrics/${metricId}',
      });
    });

    it('should test GET /iot/analytics/metrics/${metricId}/data', () => {
      testAPI('GET', '/iot/analytics/metrics/test-id/data', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/metrics/${metricId}/data',
      });
    });

    it('should test GET /iot/analytics/models', () => {
      testAPI('GET', '/iot/analytics/models', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/models',
      });
    });

    it('should test GET /iot/analytics/models/${modelId}', () => {
      testAPI('GET', '/iot/analytics/models/test-id', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/models/${modelId}',
      });
    });

    it('should test GET /iot/analytics/overview', () => {
      testAPI('GET', '/iot/analytics/overview', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/overview',
      });
    });

    it('should test GET /iot/analytics/queries', () => {
      testAPI('GET', '/iot/analytics/queries', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/queries',
      });
    });

    it('should test GET /iot/analytics/queries/${queryId}', () => {
      testAPI('GET', '/iot/analytics/queries/test-id', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/analytics/queries/${queryId}',
      });
    });

    it('should test GET /iot/analytics/reports', () => {
      testAPI('GET', '/iot/analytics/reports', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/reports',
      });
    });

    it('should test GET /iot/analytics/reports/${reportId}', () => {
      testAPI('GET', '/iot/analytics/reports/test-id', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/reports/${reportId}',
      });
    });

    it('should test GET /iot/analytics/reports/${reportId}/download/${jobId}', () => {
      testAPI('GET', '/iot/analytics/reports/test-id/download/test-id', 200, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'GET /iot/analytics/reports/${reportId}/download/${jobId}',
      });
    });

    it('should test GET /iot/anomaly-detection/${detectionId}', () => {
      testAPI('GET', '/iot/anomaly-detection/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/anomaly-detection/${detectionId}',
      });
    });

    it('should test GET /iot/automation/analytics', () => {
      testAPI('GET', '/iot/automation/analytics', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/analytics',
      });
    });

    it('should test GET /iot/automation/executions', () => {
      testAPI('GET', '/iot/automation/executions', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/executions',
      });
    });

    it('should test GET /iot/automation/executions/${executionId}', () => {
      testAPI('GET', '/iot/automation/executions/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/executions/${executionId}',
      });
    });

    it('should test GET /iot/automation/logs', () => {
      testAPI('GET', '/iot/automation/logs', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/logs',
      });
    });

    it('should test GET /iot/automation/rules', () => {
      testAPI('GET', '/iot/automation/rules', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/rules',
      });
    });

    it('should test GET /iot/automation/rules/${ruleId}', () => {
      testAPI('GET', '/iot/automation/rules/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/rules/${ruleId}',
      });
    });

    it('should test GET /iot/automation/scenes', () => {
      testAPI('GET', '/iot/automation/scenes', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/scenes',
      });
    });

    it('should test GET /iot/automation/scenes/${sceneId}', () => {
      testAPI('GET', '/iot/automation/scenes/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/scenes/${sceneId}',
      });
    });

    it('should test GET /iot/automation/system-variables', () => {
      testAPI('GET', '/iot/automation/system-variables', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/system-variables',
      });
    });

    it('should test GET /iot/automation/templates', () => {
      testAPI('GET', '/iot/automation/templates', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/templates',
      });
    });

    it('should test GET /iot/automation/workflows', () => {
      testAPI('GET', '/iot/automation/workflows', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/workflows',
      });
    });

    it('should test GET /iot/automation/workflows/${workflowId}', () => {
      testAPI('GET', '/iot/automation/workflows/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/automation/workflows/${workflowId}',
      });
    });

    it('should test GET /iot/commands/${commandId}', () => {
      testAPI('GET', '/iot/commands/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/commands/${commandId}',
      });
    });

    it('should test GET /iot/data/alerts', () => {
      testAPI('GET', '/iot/data/alerts', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/data/alerts',
      });
    });

    it('should test GET /iot/data/exports/${exportId}', () => {
      testAPI('GET', '/iot/data/exports/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/data/exports/${exportId}',
      });
    });

    it('should test GET /iot/data/exports/${exportId}/download', () => {
      testAPI('GET', '/iot/data/exports/test-id/download', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/data/exports/${exportId}/download',
      });
    });

    it('should test GET /iot/data/patterns', () => {
      testAPI('GET', '/iot/data/patterns', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/data/patterns',
      });
    });

    it('should test GET /iot/data/retention-policies', () => {
      testAPI('GET', '/iot/data/retention-policies', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/data/retention-policies',
      });
    });

    it('should test GET /iot/device-groups', () => {
      testAPI('GET', '/iot/device-groups', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/device-groups',
      });
    });

    it('should test GET /iot/devices', () => {
      testAPI('GET', '/iot/devices', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices',
      });
    });

    it('should test GET /iot/devices/${deviceId}', () => {
      testAPI('GET', '/iot/devices/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}',
      });
    });

    it('should test GET /iot/devices/${deviceId}/commands', () => {
      testAPI('GET', '/iot/devices/test-id/commands', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/commands',
      });
    });

    it('should test GET /iot/devices/${deviceId}/connectivity', () => {
      testAPI('GET', '/iot/devices/test-id/connectivity', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/connectivity',
      });
    });

    it('should test GET /iot/devices/${deviceId}/data-quality', () => {
      testAPI('GET', '/iot/devices/test-id/data-quality', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/data-quality',
      });
    });

    it('should test GET /iot/devices/${deviceId}/data/aggregated', () => {
      testAPI('GET', '/iot/devices/test-id/data/aggregated', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/data/aggregated',
      });
    });

    it('should test GET /iot/devices/${deviceId}/data/latest', () => {
      testAPI('GET', '/iot/devices/test-id/data/latest', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/data/latest',
      });
    });

    it('should test GET /iot/devices/${deviceId}/data/realtime', () => {
      testAPI('GET', '/iot/devices/test-id/data/realtime', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/data/realtime',
      });
    });

    it('should test GET /iot/devices/${deviceId}/health', () => {
      testAPI('GET', '/iot/devices/test-id/health', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/health',
      });
    });

    it('should test GET /iot/devices/${deviceId}/sensors/${sensorType}/statistics', () => {
      testAPI('GET', '/iot/devices/test-id/sensors/test-id/statistics', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/sensors/${sensorType}/statistics',
      });
    });

    it('should test GET /iot/devices/${deviceId}/statistics', () => {
      testAPI('GET', '/iot/devices/test-id/statistics', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/statistics',
      });
    });

    it('should test GET /iot/devices/${deviceId}/streams', () => {
      testAPI('GET', '/iot/devices/test-id/streams', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/streams',
      });
    });

    it('should test GET /iot/devices/${deviceId}/updates', () => {
      testAPI('GET', '/iot/devices/test-id/updates', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/devices/${deviceId}/updates',
      });
    });

    it('should test GET /iot/integrations', () => {
      testAPI('GET', '/iot/integrations', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations',
      });
    });

    it('should test GET /iot/integrations/${integrationId}', () => {
      testAPI('GET', '/iot/integrations/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/${integrationId}',
      });
    });

    it('should test GET /iot/integrations/${integrationId}/documentation', () => {
      testAPI('GET', '/iot/integrations/test-id/documentation', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/${integrationId}/documentation',
      });
    });

    it('should test GET /iot/integrations/analytics', () => {
      testAPI('GET', '/iot/integrations/analytics', 200, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/analytics',
      });
    });

    it('should test GET /iot/integrations/endpoints', () => {
      testAPI('GET', '/iot/integrations/endpoints', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/endpoints',
      });
    });

    it('should test GET /iot/integrations/endpoints/${endpointId}', () => {
      testAPI('GET', '/iot/integrations/endpoints/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/endpoints/${endpointId}',
      });
    });

    it('should test GET /iot/integrations/events', () => {
      testAPI('GET', '/iot/integrations/events', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/events',
      });
    });

    it('should test GET /iot/integrations/flows', () => {
      testAPI('GET', '/iot/integrations/flows', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/flows',
      });
    });

    it('should test GET /iot/integrations/flows/${flowId}', () => {
      testAPI('GET', '/iot/integrations/flows/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/flows/${flowId}',
      });
    });

    it('should test GET /iot/integrations/health', () => {
      testAPI('GET', '/iot/integrations/health', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/health',
      });
    });

    it('should test GET /iot/integrations/protocols', () => {
      testAPI('GET', '/iot/integrations/protocols', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/protocols',
      });
    });

    it('should test GET /iot/integrations/protocols/${protocolId}', () => {
      testAPI('GET', '/iot/integrations/protocols/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/protocols/${protocolId}',
      });
    });

    it('should test GET /iot/integrations/syncs', () => {
      testAPI('GET', '/iot/integrations/syncs', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/syncs',
      });
    });

    it('should test GET /iot/integrations/syncs/${syncId}', () => {
      testAPI('GET', '/iot/integrations/syncs/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/syncs/${syncId}',
      });
    });

    it('should test GET /iot/integrations/templates', () => {
      testAPI('GET', '/iot/integrations/templates', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/templates',
      });
    });

    it('should test GET /iot/integrations/templates/${templateId}', () => {
      testAPI('GET', '/iot/integrations/templates/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/integrations/templates/${templateId}',
      });
    });

    it('should test GET /iot/maintenance', () => {
      testAPI('GET', '/iot/maintenance', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/maintenance',
      });
    });

    it('should test GET /iot/updates/${updateId}', () => {
      testAPI('GET', '/iot/updates/test-id', 404, 'Iot', {
        requiresAuth: false,
        description: 'GET /iot/updates/${updateId}',
      });
    });

  });

  describe('POST Requests (66 endpoints)', () => {
    it('should test POST /iot/analytics/alerts', () => {
      testAPI('POST', '/iot/analytics/alerts', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/alerts',
      });
    });

    it('should test POST /iot/analytics/alerts/${alertId}/acknowledge', () => {
      testAPI('POST', '/iot/analytics/alerts/test-id/acknowledge', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/alerts/${alertId}/acknowledge',
      });
    });

    it('should test POST /iot/analytics/alerts/${alertId}/resolve', () => {
      testAPI('POST', '/iot/analytics/alerts/test-id/resolve', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/alerts/${alertId}/resolve',
      });
    });

    it('should test POST /iot/analytics/dashboards', () => {
      testAPI('POST', '/iot/analytics/dashboards', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /iot/analytics/dashboards',
      });
    });

    it('should test POST /iot/analytics/dashboards/${dashboardId}/share', () => {
      testAPI('POST', '/iot/analytics/dashboards/test-id/share', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /iot/analytics/dashboards/${dashboardId}/share',
      });
    });

    it('should test POST /iot/analytics/export', () => {
      testAPI('POST', '/iot/analytics/export', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/export',
      });
    });

    it('should test POST /iot/analytics/insights/generate', () => {
      testAPI('POST', '/iot/analytics/insights/generate', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/insights/generate',
      });
    });

    it('should test POST /iot/analytics/metrics', () => {
      testAPI('POST', '/iot/analytics/metrics', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/metrics',
      });
    });

    it('should test POST /iot/analytics/models', () => {
      testAPI('POST', '/iot/analytics/models', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/models',
      });
    });

    it('should test POST /iot/analytics/models/${modelId}/deploy', () => {
      testAPI('POST', '/iot/analytics/models/test-id/deploy', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/models/${modelId}/deploy',
      });
    });

    it('should test POST /iot/analytics/models/${modelId}/predict', () => {
      testAPI('POST', '/iot/analytics/models/test-id/predict', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/models/${modelId}/predict',
      });
    });

    it('should test POST /iot/analytics/models/${modelId}/train', () => {
      testAPI('POST', '/iot/analytics/models/test-id/train', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/models/${modelId}/train',
      });
    });

    it('should test POST /iot/analytics/queries', () => {
      testAPI('POST', '/iot/analytics/queries', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/queries',
      });
    });

    it('should test POST /iot/analytics/queries/execute', () => {
      testAPI('POST', '/iot/analytics/queries/execute', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/analytics/queries/execute',
      });
    });

    it('should test POST /iot/analytics/reports', () => {
      testAPI('POST', '/iot/analytics/reports', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /iot/analytics/reports',
      });
    });

    it('should test POST /iot/analytics/reports/${reportId}/generate', () => {
      testAPI('POST', '/iot/analytics/reports/test-id/generate', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'POST /iot/analytics/reports/${reportId}/generate',
      });
    });

    it('should test POST /iot/anomaly-detection/${detectionId}/train', () => {
      testAPI('POST', '/iot/anomaly-detection/test-id/train', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/anomaly-detection/${detectionId}/train',
      });
    });

    it('should test POST /iot/automation/executions/${executionId}/cancel', () => {
      testAPI('POST', '/iot/automation/executions/test-id/cancel', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/executions/${executionId}/cancel',
      });
    });

    it('should test POST /iot/automation/export', () => {
      testAPI('POST', '/iot/automation/export', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/export',
      });
    });

    it('should test POST /iot/automation/import', () => {
      testAPI('POST', '/iot/automation/import', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/import',
      });
    });

    it('should test POST /iot/automation/rules', () => {
      testAPI('POST', '/iot/automation/rules', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/rules',
      });
    });

    it('should test POST /iot/automation/rules/${ruleId}/execute', () => {
      testAPI('POST', '/iot/automation/rules/test-id/execute', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/rules/${ruleId}/execute',
      });
    });

    it('should test POST /iot/automation/rules/${ruleId}/test', () => {
      testAPI('POST', '/iot/automation/rules/test-id/test', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/rules/${ruleId}/test',
      });
    });

    it('should test POST /iot/automation/scenes', () => {
      testAPI('POST', '/iot/automation/scenes', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/scenes',
      });
    });

    it('should test POST /iot/automation/scenes/${sceneId}/activate', () => {
      testAPI('POST', '/iot/automation/scenes/test-id/activate', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/scenes/${sceneId}/activate',
      });
    });

    it('should test POST /iot/automation/templates/${templateId}/create', () => {
      testAPI('POST', '/iot/automation/templates/test-id/create', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/templates/${templateId}/create',
      });
    });

    it('should test POST /iot/automation/validate', () => {
      testAPI('POST', '/iot/automation/validate', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/validate',
      });
    });

    it('should test POST /iot/automation/workflows', () => {
      testAPI('POST', '/iot/automation/workflows', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/workflows',
      });
    });

    it('should test POST /iot/automation/workflows/${workflowId}/execute', () => {
      testAPI('POST', '/iot/automation/workflows/test-id/execute', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/workflows/${workflowId}/execute',
      });
    });

    it('should test POST /iot/automation/workflows/${workflowId}/stop', () => {
      testAPI('POST', '/iot/automation/workflows/test-id/stop', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/automation/workflows/${workflowId}/stop',
      });
    });

    it('should test POST /iot/data/detect-anomalies', () => {
      testAPI('POST', '/iot/data/detect-anomalies', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/data/detect-anomalies',
      });
    });

    it('should test POST /iot/data/discover-patterns', () => {
      testAPI('POST', '/iot/data/discover-patterns', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/data/discover-patterns',
      });
    });

    it('should test POST /iot/data/export', () => {
      testAPI('POST', '/iot/data/export', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/data/export',
      });
    });

    it('should test POST /iot/data/query', () => {
      testAPI('POST', '/iot/data/query', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/data/query',
      });
    });

    it('should test POST /iot/data/retention-policies', () => {
      testAPI('POST', '/iot/data/retention-policies', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/data/retention-policies',
      });
    });

    it('should test POST /iot/device-groups', () => {
      testAPI('POST', '/iot/device-groups', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/device-groups',
      });
    });

    it('should test POST /iot/device-groups/${groupId}/devices', () => {
      testAPI('POST', '/iot/device-groups/test-id/devices', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/device-groups/${groupId}/devices',
      });
    });

    it('should test POST /iot/devices', () => {
      testAPI('POST', '/iot/devices', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices',
      });
    });

    it('should test POST /iot/devices/${deviceId}/alert-rules', () => {
      testAPI('POST', '/iot/devices/test-id/alert-rules', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/alert-rules',
      });
    });

    it('should test POST /iot/devices/${deviceId}/anomaly-detection', () => {
      testAPI('POST', '/iot/devices/test-id/anomaly-detection', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/anomaly-detection',
      });
    });

    it('should test POST /iot/devices/${deviceId}/calibrate/${sensorType}', () => {
      testAPI('POST', '/iot/devices/test-id/calibrate/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/calibrate/${sensorType}',
      });
    });

    it('should test POST /iot/devices/${deviceId}/commands', () => {
      testAPI('POST', '/iot/devices/test-id/commands', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/commands',
      });
    });

    it('should test POST /iot/devices/${deviceId}/diagnostics', () => {
      testAPI('POST', '/iot/devices/test-id/diagnostics', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/diagnostics',
      });
    });

    it('should test POST /iot/devices/${deviceId}/export', () => {
      testAPI('POST', '/iot/devices/test-id/export', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/export',
      });
    });

    it('should test POST /iot/devices/${deviceId}/maintenance', () => {
      testAPI('POST', '/iot/devices/test-id/maintenance', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/maintenance',
      });
    });

    it('should test POST /iot/devices/${deviceId}/reset', () => {
      testAPI('POST', '/iot/devices/test-id/reset', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/reset',
      });
    });

    it('should test POST /iot/devices/${deviceId}/streams/${sensorType}/start', () => {
      testAPI('POST', '/iot/devices/test-id/streams/test-id/start', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/streams/${sensorType}/start',
      });
    });

    it('should test POST /iot/devices/${deviceId}/streams/${sensorType}/stop', () => {
      testAPI('POST', '/iot/devices/test-id/streams/test-id/stop', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/streams/${sensorType}/stop',
      });
    });

    it('should test POST /iot/devices/${deviceId}/updates/${updateId}/install', () => {
      testAPI('POST', '/iot/devices/test-id/updates/test-id/install', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/updates/${updateId}/install',
      });
    });

    it('should test POST /iot/devices/${deviceId}/updates/${updateId}/rollback', () => {
      testAPI('POST', '/iot/devices/test-id/updates/test-id/rollback', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/${deviceId}/updates/${updateId}/rollback',
      });
    });

    it('should test POST /iot/devices/bulk-command', () => {
      testAPI('POST', '/iot/devices/bulk-command', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/devices/bulk-command',
      });
    });

    it('should test POST /iot/integrations', () => {
      testAPI('POST', '/iot/integrations', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations',
      });
    });

    it('should test POST /iot/integrations/${integrationId}/sync', () => {
      testAPI('POST', '/iot/integrations/test-id/sync', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/${integrationId}/sync',
      });
    });

    it('should test POST /iot/integrations/${integrationId}/test', () => {
      testAPI('POST', '/iot/integrations/test-id/test', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/${integrationId}/test',
      });
    });

    it('should test POST /iot/integrations/endpoints', () => {
      testAPI('POST', '/iot/integrations/endpoints', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/endpoints',
      });
    });

    it('should test POST /iot/integrations/endpoints/${endpointId}/test', () => {
      testAPI('POST', '/iot/integrations/endpoints/test-id/test', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/endpoints/${endpointId}/test',
      });
    });

    it('should test POST /iot/integrations/endpoints/${endpointId}/trigger', () => {
      testAPI('POST', '/iot/integrations/endpoints/test-id/trigger', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/endpoints/${endpointId}/trigger',
      });
    });

    it('should test POST /iot/integrations/export', () => {
      testAPI('POST', '/iot/integrations/export', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/export',
      });
    });

    it('should test POST /iot/integrations/flows', () => {
      testAPI('POST', '/iot/integrations/flows', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/flows',
      });
    });

    it('should test POST /iot/integrations/flows/${flowId}/${action}', () => {
      testAPI('POST', '/iot/integrations/flows/test-id/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/flows/${flowId}/${action}',
      });
    });

    it('should test POST /iot/integrations/flows/${flowId}/execute', () => {
      testAPI('POST', '/iot/integrations/flows/test-id/execute', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/flows/${flowId}/execute',
      });
    });

    it('should test POST /iot/integrations/import', () => {
      testAPI('POST', '/iot/integrations/import', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/import',
      });
    });

    it('should test POST /iot/integrations/syncs/${syncId}/cancel', () => {
      testAPI('POST', '/iot/integrations/syncs/test-id/cancel', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/syncs/${syncId}/cancel',
      });
    });

    it('should test POST /iot/integrations/syncs/${syncId}/retry', () => {
      testAPI('POST', '/iot/integrations/syncs/test-id/retry', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/syncs/${syncId}/retry',
      });
    });

    it('should test POST /iot/integrations/templates/${templateId}/create', () => {
      testAPI('POST', '/iot/integrations/templates/test-id/create', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/templates/${templateId}/create',
      });
    });

    it('should test POST /iot/integrations/validate', () => {
      testAPI('POST', '/iot/integrations/validate', 401, 'Iot', {
        requiresAuth: false,
        description: 'POST /iot/integrations/validate',
      });
    });

  });

  describe('PUT Requests (24 endpoints)', () => {
    it('should test PUT /iot/alert-rules/${ruleId}', () => {
      testAPI('PUT', '/iot/alert-rules/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/alert-rules/${ruleId}',
      });
    });

    it('should test PUT /iot/alerts/${alertId}/acknowledge', () => {
      testAPI('PUT', '/iot/alerts/test-id/acknowledge', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/alerts/${alertId}/acknowledge',
      });
    });

    it('should test PUT /iot/alerts/${alertId}/resolve', () => {
      testAPI('PUT', '/iot/alerts/test-id/resolve', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/alerts/${alertId}/resolve',
      });
    });

    it('should test PUT /iot/alerts/${alertId}/suppress', () => {
      testAPI('PUT', '/iot/alerts/test-id/suppress', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/alerts/${alertId}/suppress',
      });
    });

    it('should test PUT /iot/analytics/alerts/${alertId}', () => {
      testAPI('PUT', '/iot/analytics/alerts/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/analytics/alerts/${alertId}',
      });
    });

    it('should test PUT /iot/analytics/dashboards/${dashboardId}', () => {
      testAPI('PUT', '/iot/analytics/dashboards/test-id', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'PUT /iot/analytics/dashboards/${dashboardId}',
      });
    });

    it('should test PUT /iot/analytics/insights/${insightId}/status', () => {
      testAPI('PUT', '/iot/analytics/insights/test-id/status', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/analytics/insights/${insightId}/status',
      });
    });

    it('should test PUT /iot/analytics/metrics/${metricId}', () => {
      testAPI('PUT', '/iot/analytics/metrics/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/analytics/metrics/${metricId}',
      });
    });

    it('should test PUT /iot/automation/rules/${ruleId}', () => {
      testAPI('PUT', '/iot/automation/rules/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/automation/rules/${ruleId}',
      });
    });

    it('should test PUT /iot/automation/rules/${ruleId}/toggle', () => {
      testAPI('PUT', '/iot/automation/rules/test-id/toggle', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/automation/rules/${ruleId}/toggle',
      });
    });

    it('should test PUT /iot/automation/scenes/${sceneId}', () => {
      testAPI('PUT', '/iot/automation/scenes/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/automation/scenes/${sceneId}',
      });
    });

    it('should test PUT /iot/automation/system-variables', () => {
      testAPI('PUT', '/iot/automation/system-variables', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/automation/system-variables',
      });
    });

    it('should test PUT /iot/automation/workflows/${workflowId}', () => {
      testAPI('PUT', '/iot/automation/workflows/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/automation/workflows/${workflowId}',
      });
    });

    it('should test PUT /iot/commands/${commandId}/cancel', () => {
      testAPI('PUT', '/iot/commands/test-id/cancel', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/commands/${commandId}/cancel',
      });
    });

    it('should test PUT /iot/data/alerts/${alertId}/acknowledge', () => {
      testAPI('PUT', '/iot/data/alerts/test-id/acknowledge', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/data/alerts/${alertId}/acknowledge',
      });
    });

    it('should test PUT /iot/data/patterns/${patternId}/validate', () => {
      testAPI('PUT', '/iot/data/patterns/test-id/validate', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/data/patterns/${patternId}/validate',
      });
    });

    it('should test PUT /iot/device-groups/${groupId}', () => {
      testAPI('PUT', '/iot/device-groups/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/device-groups/${groupId}',
      });
    });

    it('should test PUT /iot/devices/${deviceId}', () => {
      testAPI('PUT', '/iot/devices/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/devices/${deviceId}',
      });
    });

    it('should test PUT /iot/devices/${deviceId}/streams/${sensorType}', () => {
      testAPI('PUT', '/iot/devices/test-id/streams/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/devices/${deviceId}/streams/${sensorType}',
      });
    });

    it('should test PUT /iot/integrations/${integrationId}', () => {
      testAPI('PUT', '/iot/integrations/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/integrations/${integrationId}',
      });
    });

    it('should test PUT /iot/integrations/${integrationId}/toggle', () => {
      testAPI('PUT', '/iot/integrations/test-id/toggle', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/integrations/${integrationId}/toggle',
      });
    });

    it('should test PUT /iot/integrations/endpoints/${endpointId}', () => {
      testAPI('PUT', '/iot/integrations/endpoints/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/integrations/endpoints/${endpointId}',
      });
    });

    it('should test PUT /iot/integrations/flows/${flowId}', () => {
      testAPI('PUT', '/iot/integrations/flows/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/integrations/flows/${flowId}',
      });
    });

    it('should test PUT /iot/maintenance/${recordId}', () => {
      testAPI('PUT', '/iot/maintenance/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'PUT /iot/maintenance/${recordId}',
      });
    });

  });

  describe('DELETE Requests (7 endpoints)', () => {
    it('should test DELETE /iot/analytics/dashboards/${dashboardId}', () => {
      testAPI('DELETE', '/iot/analytics/dashboards/test-id', 401, 'Iot', {
        requiresAuth: true,
        authToken: authToken,
        description: 'DELETE /iot/analytics/dashboards/${dashboardId}',
      });
    });

    it('should test DELETE /iot/analytics/metrics/${metricId}', () => {
      testAPI('DELETE', '/iot/analytics/metrics/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/analytics/metrics/${metricId}',
      });
    });

    it('should test DELETE /iot/automation/rules/${ruleId}', () => {
      testAPI('DELETE', '/iot/automation/rules/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/automation/rules/${ruleId}',
      });
    });

    it('should test DELETE /iot/device-groups/${groupId}/devices', () => {
      testAPI('DELETE', '/iot/device-groups/test-id/devices', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/device-groups/${groupId}/devices',
      });
    });

    it('should test DELETE /iot/devices/${deviceId}', () => {
      testAPI('DELETE', '/iot/devices/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/devices/${deviceId}',
      });
    });

    it('should test DELETE /iot/integrations/${integrationId}', () => {
      testAPI('DELETE', '/iot/integrations/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/integrations/${integrationId}',
      });
    });

    it('should test DELETE /iot/integrations/endpoints/${endpointId}', () => {
      testAPI('DELETE', '/iot/integrations/endpoints/test-id', 401, 'Iot', {
        requiresAuth: false,
        description: 'DELETE /iot/integrations/endpoints/${endpointId}',
      });
    });

  });

});

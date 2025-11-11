// ========================================
// Dashboards API - Advanced Business Intelligence Platform
// POJO Integration: backend/src/modules/dashboard/** -> frontend TypeScript API client
// ========================================

import { api } from './client';

// ========================================
// Supporting Types & Interfaces - Comprehensive definitions
// ========================================

// Basic Data Types
export enum DataSourceType {
  DATABASE = 'database',
  API = 'api',
  FILE = 'file',
  WAREHOUSE = 'warehouse',
  LAKE = 'lake',
  STREAM = 'stream',
  CACHE = 'cache',
  EXTERNAL = 'external',
  FEDERATION = 'federation',
  VIRTUAL = 'virtual'
}

export enum AnalyticsPeriod {
  HOUR = 'hour',
  DAY = 'day', 
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export interface WidgetInteraction {
  id: string;
  type: 'click' | 'hover' | 'drag';
  action: string;
  target?: string;
  parameters?: Record<string, any>;
}

export interface WidgetFilter {
  id: string;
  field: string;
  operator: string;
  value: any;
  label?: string;
  required: boolean;
}

export interface WidgetParameter {
  name: string;
  label: string;
  type: string;
  value: any;
  required: boolean;
}

export interface WidgetSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  showTitle: boolean;
  showBorder: boolean;
  showBackground: boolean;
  allowInteraction: boolean;
  exportEnabled: boolean;
  cacheEnabled: boolean;
}

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  strategy: string;
  key?: string;
}

export interface ResponsiveLayout {
  breakpoint: string;
  columns: number;
  rows: number;
  margin: number;
}

export interface LayoutBreakpoint {
  name: string;
  width: number;
  columns: number;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
  visible: boolean;
}

export interface SpacingSettings {
  padding: number;
  margin: number;
  gap: number;
}

export interface FilterDataType {
  type: string;
  format?: string;
}

export interface FilterValue {
  value: any;
  label: string;
  count?: number;
  selected?: boolean;
}

export interface FilterPosition {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
  floating: boolean;
}

export interface FilterVisibility {
  visible: boolean;
  collapsible: boolean;
  collapsed: boolean;
}

export interface FilterDependency {
  filterId: string;
  condition: string;
  value: any;
}

export interface FilterValidation {
  rule: string;
  message: string;
  parameters?: any[];
}

export interface VariableCalculation {
  formula: string;
  dependencies: string[];
  aggregation?: string;
}

export interface VariableScope {
  global: boolean;
  dashboard: boolean;
  widget: boolean;
  session: boolean;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
}

export interface Typography {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: number;
}

export interface SpacingTheme {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface BorderTheme {
  radius: Record<string, string>;
  width: Record<string, string>;
  style: string;
}

export interface ShadowTheme {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BackgroundTheme {
  primary: string;
  secondary: string;
  surface: string;
  paper: string;
  overlay: string;
}

export interface ComponentThemes {
  button: Record<string, any>;
  card: Record<string, any>;
  input: Record<string, any>;
  table: Record<string, any>;
  chart: Record<string, any>;
}

export interface GroupPermission {
  groupId: string;
  permission: string;
}

export interface RolePermission {
  roleId: string;
  permission: string;
}

export interface PermissionRestriction {
  type: string;
  value: any;
  message?: string;
}

export interface SharingPermissions {
  allowPublic: boolean;
  allowEmbed: boolean;
  allowExport: boolean;
  allowComment: boolean;
}

export interface ExportPermissions {
  pdf: boolean;
  image: boolean;
  data: boolean;
  template: boolean;
}

export interface ComplexityScore {
  score: number;
  factors: any[];
  recommendation: string;
}

export interface DashboardDependency {
  id: string;
  type: string;
  name: string;
  version?: string;
  required: boolean;
  status: string;
}

export interface DashboardLineage {
  source: string;
  target: string;
  type: string;
  metadata: any;
}

export interface UsageStats {
  views: number;
  uniqueUsers: number;
  avgSessionTime: number;
  lastAccessed: Date;
  peakUsage: Date;
}

export interface PerformanceStats {
  avgLoadTime: number;
  p95LoadTime: number;
  errorRate: number;
  cacheHitRate: number;
  bottlenecks: string[];
}

// Additional supporting interfaces
export interface NotificationTarget {
  type: string;
  address: string;
  template?: string;
}

export interface PositionAnchor {
  x: 'left' | 'center' | 'right';
  y: 'top' | 'center' | 'bottom';
}

export interface PositionAlignment {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
}

export interface ResponsiveSize {
  breakpoint: string;
  width: number;
  height: number;
}

export interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AlertCondition {
  field: string;
  operator: string;
  value: any;
  aggregation?: string;
}

export interface AlertThreshold {
  min?: number;
  max?: number;
  value?: any;
  percentage?: number;
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ParameterMapping {
  source: string;
  target: string;
  transform?: string;
}

export interface FilterMapping {
  source: string;
  target: string;
  transform?: string;
}

export enum SnapshotFormat {
  JSON = 'json',
  PARQUET = 'parquet',
  CSV = 'csv'
}

export interface PerformanceAnalytics {
  avgLoadTime: number;
  p95LoadTime: number;
  errorRate: number;
  cacheHitRate: number;
  trends: any[];
}

export interface ExecutedQuery {
  sql: string;
  parameters: Record<string, any>;
  executionTime: number;
  rowsAffected: number;
}

export interface CacheInfo {
  enabled: boolean;
  hit: boolean;
  key: string;
  ttl: number;
  size: number;
}

// Placeholder implementations for complex interfaces
export interface DashboardStructure {
  version: string;
  layout: any;
  widgets: any[];
  filters: any[];
  variables: any[];
}

export interface TemplateStructure {
  sections: any[];
  layout: any;
  styling: any;
}

export interface WidgetTemplate {
  type: WidgetType;
  name: string;
  configuration: any;
  preview: string;
}

export interface VariableTemplate {
  type: VariableType;
  name: string;
  configuration: any;
}

export interface FilterTemplate {
  type: FilterType;
  name: string;
  configuration: any;
}

export interface TemplateSettings {
  allowCustomization: boolean;
  requiredFields: string[];
  optionalFields: string[];
}

export interface TemplateRequirement {
  type: 'dataSource' | 'field' | 'permission' | 'feature';
  name: string;
  description: string;
  required: boolean;
}

export interface ShareType {
  PUBLIC: 'public';
  PRIVATE: 'private'; 
  EMBED: 'embed';
  LINK: 'link';
}

export interface SharePermissions {
  view: boolean;
  interact: boolean;
  export: boolean;
  comment: boolean;
  share: boolean;
}

export interface ShareRestriction {
  type: string;
  value: any;
  message: string;
}

export interface EmbedSettings {
  theme: 'light' | 'dark' | 'auto';
  hideControls: boolean;
  hideTitle: boolean;
  autoRefresh: boolean;
  allowFullscreen: boolean;
}

export interface SnapshotData {
  widgetId: string;
  data: any;
  metadata: any;
}

export interface CommentPosition {
  x: number;
  y: number;
  widgetId?: string;
}

export interface CommentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CommentReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ViewAnalytics {
  total: number;
  unique: number;
  returning: number;
  avgDuration: number;
}

export interface InteractionAnalytics {
  clicks: number;
  hovers: number;
  filters: number;
  exports: number;
  drilldowns: number;
}

export interface WidgetAnalytics {
  widgetId: string;
  name: string;
  views: number;
  interactions: number;
  errors: number;
  avgLoadTime: number;
}

export interface FilterAnalytics {
  filterId: string;
  name: string;
  uses: number;
  popularValues: FilterValue[];
}

export interface UserAnalytics {
  total: number;
  active: number;
  new: number;
  returning: number;
  avgSessionTime: number;
}

export interface ErrorAnalytics {
  total: number;
  byType: Record<string, number>;
  byWidget: Record<string, number>;
  trends: any[];
}

export interface TrendAnalytics {
  metric: string;
  data: any[];
  direction: 'up' | 'down' | 'stable';
  change: number;
}

export interface AnalyticsInsight {
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation?: string;
  data?: any;
}

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  action?: string;
}

export interface AnalyticsSummary {
  period: any;
  totalViews: number;
  uniqueUsers: number;
  avgLoadTime: number;
  errorRate: number;
  topDashboards: string[];
  trends: any[];
}

export interface TrendData {
  date: Date;
  value: number;
  comparison?: number;
}

export interface AnalyticsComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export interface CategorySummary {
  category: string;
  count: number;
  percentage: number;
}

export interface TagSummary {
  tag: string;
  count: number;
  color?: string;
}

export interface FilterSummary {
  applied: number;
  available: number;
  active: any[];
}

export interface FilterState {
  id: string;
  name: string;
  value: any;
  operator: string;
}

export interface VariableState {
  id: string;
  name: string;
  value: any;
  type: VariableType;
}

export interface WidgetMetadata {
  rowCount: number;
  columnCount: number;
  dataSize: number;
  lastUpdate: Date;
  cacheHit: boolean;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  dataFetchTime: number;
  cacheEnabled: boolean;
  memoryUsage: number;
}

export interface PreviewMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  timestamp: Date;
}

export interface WidgetPreview {
  widgetId: string;
  name: string;
  type: WidgetType;
  position: WidgetPosition;
  size: WidgetSize;
}

// ========================================
// Core Dashboard POJOs - Full backend integration
// ========================================

export interface DashboardEntity {
  id: string;
  name: string;
  description?: string;
  category: DashboardCategory;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  variables: DashboardVariable[];
  theme: DashboardTheme;
  permissions: DashboardPermissions;
  settings: DashboardSettings;
  metadata: DashboardMetadata;
  version: number;
  status: DashboardStatus;
  isPublic: boolean;
  isFavorite: boolean;
  isTemplate: boolean;
  parentId?: string;
  tags: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  lastViewed?: Date;
  viewCount: number;
  shareCount: number;
}

export interface DashboardWidget {
  id: string;
  dashboardId: string;
  name: string;
  type: WidgetType;
  dataSource: WidgetDataSource;
  query: WidgetQuery;
  visualization: WidgetVisualization;
  position: WidgetPosition;
  size: WidgetSize;
  style: WidgetStyle;
  interactions: WidgetInteraction[];
  filters: WidgetFilter[];
  parameters: WidgetParameter[];
  settings: WidgetSettings;
  cache: CacheSettings;
  alerts: WidgetAlert[];
  drilldowns: DrilldownPath[];
  isVisible: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  type: LayoutType;
  columns: number;
  rows: number;
  cellHeight: number;
  cellWidth: number;
  margin: number;
  padding: number;
  responsive: ResponsiveLayout[];
  breakpoints: LayoutBreakpoint[];
  autoHeight: boolean;
  grid: GridSettings;
  spacing: SpacingSettings;
}

export interface DashboardFilter {
  id: string;
  name: string;
  label: string;
  type: FilterType;
  dataType: FilterDataType;
  values: FilterValue[];
  defaultValue?: any;
  required: boolean;
  multiSelect: boolean;
  cascade: boolean;
  position: FilterPosition;
  visibility: FilterVisibility;
  dependencies: FilterDependency[];
  validation: FilterValidation[];
  autoRefresh: boolean;
  searchable: boolean;
}

export interface DashboardVariable {
  id: string;
  name: string;
  label: string;
  type: VariableType;
  value: any;
  defaultValue: any;
  calculation?: VariableCalculation;
  scope: VariableScope;
  format: string;
  description?: string;
  isHidden: boolean;
  isReadonly: boolean;
  dependencies: string[];
}

export interface DashboardTheme {
  id: string;
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: SpacingTheme;
  borders: BorderTheme;
  shadows: ShadowTheme;
  backgrounds: BackgroundTheme;
  components: ComponentThemes;
  customCss?: string;
  isDark: boolean;
  isSystem: boolean;
}

export interface DashboardPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  groups: GroupPermission[];
  roles: RolePermission[];
  public: boolean;
  inherit: boolean;
  restrictions: PermissionRestriction[];
  sharing: SharingPermissions;
  export: ExportPermissions;
}

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
  cacheEnabled: boolean;
  cacheExpiration: number;
  showTitle: boolean;
  showDescription: boolean;
  showFilters: boolean;
  showVariables: boolean;
  showTimestamp: boolean;
  allowExport: boolean;
  allowPrint: boolean;
  allowShare: boolean;
  allowEmbed: boolean;
  fullscreen: boolean;
  mobileOptimized: boolean;
}

export interface DashboardMetadata {
  size: number;
  widgetCount: number;
  filterCount: number;
  variableCount: number;
  lastRefresh: Date;
  avgLoadTime: number;
  complexity: ComplexityScore;
  dependencies: DashboardDependency[];
  lineage: DashboardLineage[];
  usage: UsageStats;
  performance: PerformanceStats;
}

// ========================================
// Widget-Specific POJOs
// ========================================

export interface WidgetDataSource {
  id: string;
  type: DataSourceType;
  connection: Record<string, any>;
  tables?: string[];
  refreshRate: number;
  lastSync: Date;
  status: string;
}

export interface WidgetQuery {
  sql?: string;
  api?: Record<string, any>;
  aggregations?: Record<string, any>[];
  filters?: Record<string, any>[];
  sorting?: Record<string, any>[];
  limit?: number;
  groupBy?: string[];
  having?: Record<string, any>[];
  joins?: Record<string, any>[];
  subqueries?: Record<string, any>[];
  parameters?: Record<string, any>[];
  cache: boolean;
  timeout: number;
}

export interface WidgetVisualization {
  type: VisualizationType;
  config: Record<string, any>;
  axes?: Record<string, any>[];
  series?: Record<string, any>[];
  legend?: Record<string, any>;
  tooltip?: Record<string, any>;
  colors: Record<string, any>;
  animations: Record<string, any>;
  interactions: Record<string, any>;
  responsive: Record<string, any>;
  accessibility: Record<string, any>;
}

export interface WidgetPosition {
  x: number;
  y: number;
  layer: number;
  anchor: PositionAnchor;
  alignment: PositionAlignment;
  relative: boolean;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  autoSize: boolean;
  responsive: ResponsiveSize[];
}

export interface WidgetStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  boxShadow?: string;
  opacity?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
  customCss?: string;
  className?: string;
}

export interface WidgetAlert {
  id: string;
  name: string;
  condition: AlertCondition;
  threshold: AlertThreshold;
  severity: AlertSeverity;
  notifications: NotificationTarget[];
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface DrilldownPath {
  id: string;
  name: string;
  targetDashboard?: string;
  targetWidget?: string;
  targetReport?: string;
  parameters?: ParameterMapping[];
  filters?: FilterMapping[];
  newWindow: boolean;
  preserveContext: boolean;
}

// ========================================
// Specialized Dashboard Types
// ========================================

export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  category: DashboardCategory;
  preview: string;
  structure: DashboardStructure;
  widgets: WidgetTemplate[];
  variables: VariableTemplate[];
  filters: FilterTemplate[];
  theme: DashboardTheme;
  settings: TemplateSettings;
  requirements: TemplateRequirement[];
  isPublic: boolean;
  isSystem: boolean;
  rating: number;
  downloads: number;
  createdBy: string;
  createdAt: Date;
}

export interface DashboardShare {
  id: string;
  dashboardId: string;
  shareType: ShareType;
  shareToken?: string;
  password?: string;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  permissions: SharePermissions;
  restrictions: ShareRestriction[];
  embedSettings?: EmbedSettings;
  createdBy: string;
  createdAt: Date;
  lastAccessed?: Date;
  isActive: boolean;
}

export interface DashboardSnapshot {
  id: string;
  dashboardId: string;
  name: string;
  description?: string;
  data: SnapshotData[];
  filters: Record<string, any>;
  variables: Record<string, any>;
  timestamp: Date;
  size: number;
  format: SnapshotFormat;
  retention: Date;
  isBaseline: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface DashboardComment {
  id: string;
  dashboardId: string;
  widgetId?: string;
  parentId?: string;
  content: string;
  position?: CommentPosition;
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  isResolved: boolean;
  mentions: string[];
  attachments: CommentAttachment[];
  reactions: CommentReaction[];
  isPrivate: boolean;
}

export interface DashboardAnalytics {
  dashboardId: string;
  period: AnalyticsPeriod;
  views: ViewAnalytics;
  interactions: InteractionAnalytics;
  performance: PerformanceAnalytics;
  widgets: WidgetAnalytics[];
  filters: FilterAnalytics[];
  users: UserAnalytics;
  errors: ErrorAnalytics;
  trends: TrendAnalytics[];
  insights: AnalyticsInsight[];
  recommendations: Recommendation[];
}

// ========================================
// Enum Types
// ========================================

export enum DashboardCategory {
  EXECUTIVE = 'executive',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  SALES = 'sales',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  MONITORING = 'monitoring',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom'
}

export enum DashboardStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated',
  PRIVATE = 'private',
  SHARED = 'shared',
  EMBEDDED = 'embedded'
}

export enum WidgetType {
  CHART = 'chart',
  TABLE = 'table',
  KPI = 'kpi',
  GAUGE = 'gauge',
  MAP = 'map',
  TEXT = 'text',
  IMAGE = 'image',
  IFRAME = 'iframe',
  FILTER = 'filter',
  BUTTON = 'button',
  CALENDAR = 'calendar',
  TIMELINE = 'timeline',
  TREE = 'tree',
  HEATMAP = 'heatmap',
  SPARKLINE = 'sparkline',
  BULLET = 'bullet'
}

export enum LayoutType {
  GRID = 'grid',
  FLEX = 'flex',
  ABSOLUTE = 'absolute',
  RESPONSIVE = 'responsive',
  MASONRY = 'masonry',
  TABBED = 'tabbed'
}

export enum FilterType {
  DROPDOWN = 'dropdown',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SLIDER = 'slider',
  DATE_PICKER = 'date_picker',
  DATE_RANGE = 'date_range',
  TEXT_INPUT = 'text_input',
  SEARCH = 'search',
  TREE_SELECT = 'tree_select'
}

export enum VariableType {
  CONSTANT = 'constant',
  PARAMETER = 'parameter',
  CALCULATED = 'calculated',
  AGGREGATED = 'aggregated',
  CONDITIONAL = 'conditional',
  DYNAMIC = 'dynamic'
}

export enum VisualizationType {
  LINE = 'line',
  BAR = 'bar',
  COLUMN = 'column',
  PIE = 'pie',
  DONUT = 'donut',
  AREA = 'area',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  WATERFALL = 'waterfall',
  FUNNEL = 'funnel',
  RADAR = 'radar',
  GAUGE = 'gauge',
  BULLET = 'bullet',
  SPARKLINE = 'sparkline',
  CANDLESTICK = 'candlestick',
  BOXPLOT = 'boxplot',
  HISTOGRAM = 'histogram',
  SANKEY = 'sankey',
  NETWORK = 'network'
}

// ========================================
// Request/Response Types
// ========================================

export interface CreateDashboardRequest {
  name: string;
  description?: string;
  category: DashboardCategory;
  templateId?: string;
  layout?: Partial<DashboardLayout>;
  theme?: string;
  settings?: Partial<DashboardSettings>;
  permissions?: Partial<DashboardPermissions>;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  category?: DashboardCategory;
  layout?: Partial<DashboardLayout>;
  theme?: string;
  settings?: Partial<DashboardSettings>;
  permissions?: Partial<DashboardPermissions>;
  tags?: string[];
  isPublic?: boolean;
}

export interface CreateWidgetRequest {
  dashboardId: string;
  name: string;
  type: WidgetType;
  dataSource: Partial<WidgetDataSource>;
  query?: Partial<WidgetQuery>;
  visualization: Partial<WidgetVisualization>;
  position?: Partial<WidgetPosition>;
  size?: Partial<WidgetSize>;
  style?: Partial<WidgetStyle>;
  settings?: Partial<WidgetSettings>;
}

export interface UpdateWidgetRequest {
  name?: string;
  query?: Partial<WidgetQuery>;
  visualization?: Partial<WidgetVisualization>;
  position?: Partial<WidgetPosition>;
  size?: Partial<WidgetSize>;
  style?: Partial<WidgetStyle>;
  settings?: Partial<WidgetSettings>;
  isVisible?: boolean;
  isLocked?: boolean;
}

export interface DashboardFiltersRequest {
  dashboardId: string;
  filters: Record<string, any>;
  variables?: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  timezone?: string;
}

// ========================================
// Response Types
// ========================================

export interface DashboardsResponse {
  dashboards: DashboardEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: CategorySummary[];
  tags: TagSummary[];
  filters: FilterSummary;
}

export interface DashboardDataResponse {
  widgets: Array<{
    widgetId: string;
    data: any;
    metadata: WidgetMetadata;
    performance: PerformanceMetrics;
    errors?: string[];
  }>;
  filters: FilterState[];
  variables: VariableState[];
  timestamp: Date;
  loadTime: number;
  cacheUsed: boolean;
}

export interface WidgetDataResponse {
  data: any;
  metadata: WidgetMetadata;
  query: ExecutedQuery;
  cache: CacheInfo;
  performance: PerformanceMetrics;
  errors?: string[];
  warnings?: string[];
}

export interface DashboardPreviewResponse {
  preview: string; // base64 encoded image
  metadata: PreviewMetadata;
  widgets: WidgetPreview[];
}

// ========================================
// Dashboards API Implementation
// ========================================

export const dashboardsAPI = {
  // ========================================
  // Dashboard Management
  // ========================================
  getDashboards: async (filters?: {
    category?: DashboardCategory;
    status?: DashboardStatus;
    owner?: string;
    tag?: string;
    favorite?: boolean;
    recent?: boolean;
    shared?: boolean;
    template?: boolean;
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<DashboardsResponse> => {
    const response = await api.get<DashboardsResponse>('/dashboards', {
      params: filters
    });
    return response.data;
  },

  getDashboardById: async (id: string): Promise<DashboardEntity> => {
    const response = await api.get<DashboardEntity>(`/dashboards/${id}`);
    return response.data;
  },

  createDashboard: async (data: CreateDashboardRequest): Promise<DashboardEntity> => {
    const response = await api.post<DashboardEntity>('/dashboards', data);
    return response.data;
  },

  updateDashboard: async (id: string, data: UpdateDashboardRequest): Promise<DashboardEntity> => {
    const response = await api.put<DashboardEntity>(`/dashboards/${id}`, data);
    return response.data;
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await api.delete(`/dashboards/${id}`);
  },

  cloneDashboard: async (id: string, name?: string): Promise<DashboardEntity> => {
    const response = await api.post<DashboardEntity>(`/dashboards/${id}/clone`, { name });
    return response.data;
  },

  favoriteDashboard: async (id: string, favorite: boolean): Promise<void> => {
    await api.patch(`/dashboards/${id}/favorite`, { favorite });
  },

  archiveDashboard: async (id: string): Promise<void> => {
    await api.patch(`/dashboards/${id}/archive`);
  },

  restoreDashboard: async (id: string): Promise<void> => {
    await api.patch(`/dashboards/${id}/restore`);
  },

  publishDashboard: async (id: string): Promise<DashboardEntity> => {
    const response = await api.patch<DashboardEntity>(`/dashboards/${id}/publish`);
    return response.data;
  },

  // ========================================
  // Widget Management
  // ========================================
  getWidgets: async (dashboardId: string): Promise<DashboardWidget[]> => {
    const response = await api.get<DashboardWidget[]>(`/dashboards/${dashboardId}/widgets`);
    return response.data;
  },

  getWidgetById: async (widgetId: string): Promise<DashboardWidget> => {
    const response = await api.get<DashboardWidget>(`/widgets/${widgetId}`);
    return response.data;
  },

  createWidget: async (data: CreateWidgetRequest): Promise<DashboardWidget> => {
    const response = await api.post<DashboardWidget>('/widgets', data);
    return response.data;
  },

  updateWidget: async (widgetId: string, data: UpdateWidgetRequest): Promise<DashboardWidget> => {
    const response = await api.put<DashboardWidget>(`/widgets/${widgetId}`, data);
    return response.data;
  },

  deleteWidget: async (widgetId: string): Promise<void> => {
    await api.delete(`/widgets/${widgetId}`);
  },

  cloneWidget: async (widgetId: string, targetDashboardId: string): Promise<DashboardWidget> => {
    const response = await api.post<DashboardWidget>(`/widgets/${widgetId}/clone`, {
      targetDashboardId
    });
    return response.data;
  },

  moveWidget: async (widgetId: string, position: WidgetPosition): Promise<DashboardWidget> => {
    const response = await api.patch<DashboardWidget>(`/widgets/${widgetId}/position`, position);
    return response.data;
  },

  resizeWidget: async (widgetId: string, size: WidgetSize): Promise<DashboardWidget> => {
    const response = await api.patch<DashboardWidget>(`/widgets/${widgetId}/size`, size);
    return response.data;
  },

  // ========================================
  // Dashboard Data & Rendering
  // ========================================
  getDashboardData: async (id: string, filters?: DashboardFiltersRequest): Promise<DashboardDataResponse> => {
    const response = await api.post<DashboardDataResponse>(`/dashboards/${id}/data`, filters);
    return response.data;
  },

  refreshDashboard: async (id: string, widgetIds?: string[]): Promise<DashboardDataResponse> => {
    const response = await api.post<DashboardDataResponse>(`/dashboards/${id}/refresh`, {
      widgetIds
    });
    return response.data;
  },

  getWidgetData: async (widgetId: string, filters?: Record<string, any>): Promise<WidgetDataResponse> => {
    const response = await api.post<WidgetDataResponse>(`/widgets/${widgetId}/data`, {
      filters
    });
    return response.data;
  },

  refreshWidget: async (widgetId: string): Promise<WidgetDataResponse> => {
    const response = await api.post<WidgetDataResponse>(`/widgets/${widgetId}/refresh`);
    return response.data;
  },

  previewDashboard: async (id: string, options?: {
    format?: 'png' | 'jpg' | 'pdf';
    width?: number;
    height?: number;
  }): Promise<DashboardPreviewResponse> => {
    const response = await api.post<DashboardPreviewResponse>(`/dashboards/${id}/preview`, options);
    return response.data;
  },

  // ========================================
  // Filters & Variables
  // ========================================
  getFilters: async (dashboardId: string): Promise<DashboardFilter[]> => {
    const response = await api.get<DashboardFilter[]>(`/dashboards/${dashboardId}/filters`);
    return response.data;
  },

  updateFilters: async (dashboardId: string, filters: DashboardFilter[]): Promise<DashboardFilter[]> => {
    const response = await api.put<DashboardFilter[]>(`/dashboards/${dashboardId}/filters`, {
      filters
    });
    return response.data;
  },

  getFilterValues: async (filterId: string, search?: string): Promise<FilterValue[]> => {
    const response = await api.get<FilterValue[]>(`/filters/${filterId}/values`, {
      params: { search }
    });
    return response.data;
  },

  getVariables: async (dashboardId: string): Promise<DashboardVariable[]> => {
    const response = await api.get<DashboardVariable[]>(`/dashboards/${dashboardId}/variables`);
    return response.data;
  },

  updateVariables: async (dashboardId: string, variables: DashboardVariable[]): Promise<DashboardVariable[]> => {
    const response = await api.put<DashboardVariable[]>(`/dashboards/${dashboardId}/variables`, {
      variables
    });
    return response.data;
  },

  calculateVariable: async (variableId: string, context?: Record<string, any>): Promise<any> => {
    const response = await api.post(`/variables/${variableId}/calculate`, { context });
    return response.data;
  },

  // ========================================
  // Templates
  // ========================================
  getTemplates: async (filters?: {
    category?: DashboardCategory;
    public?: boolean;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    templates: DashboardTemplate[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get('/dashboards/templates', { params: filters });
    return response.data;
  },

  getTemplateById: async (id: string): Promise<DashboardTemplate> => {
    const response = await api.get<DashboardTemplate>(`/dashboards/templates/${id}`);
    return response.data;
  },

  createFromTemplate: async (templateId: string, name: string, customizations?: any): Promise<DashboardEntity> => {
    const response = await api.post<DashboardEntity>('/dashboards/from-template', {
      templateId,
      name,
      customizations
    });
    return response.data;
  },

  saveAsTemplate: async (dashboardId: string, name: string, isPublic?: boolean): Promise<DashboardTemplate> => {
    const response = await api.post<DashboardTemplate>(`/dashboards/${dashboardId}/save-as-template`, {
      name,
      isPublic
    });
    return response.data;
  },

  // ========================================
  // Sharing & Collaboration
  // ========================================
  shareDashboard: async (dashboardId: string, shareData: {
    shareType: ShareType;
    password?: string;
    expiresAt?: Date;
    permissions: SharePermissions;
  }): Promise<DashboardShare> => {
    const response = await api.post<DashboardShare>(`/dashboards/${dashboardId}/share`, shareData);
    return response.data;
  },

  getDashboardShares: async (dashboardId: string): Promise<DashboardShare[]> => {
    const response = await api.get<DashboardShare[]>(`/dashboards/${dashboardId}/shares`);
    return response.data;
  },

  updateShare: async (shareId: string, updates: Partial<DashboardShare>): Promise<DashboardShare> => {
    const response = await api.put<DashboardShare>(`/dashboard-shares/${shareId}`, updates);
    return response.data;
  },

  deleteShare: async (shareId: string): Promise<void> => {
    await api.delete(`/dashboard-shares/${shareId}`);
  },

  accessSharedDashboard: async (shareToken: string, password?: string): Promise<{
    dashboard: DashboardEntity;
    permissions: SharePermissions;
    remaining?: number;
  }> => {
    const response = await api.post('/dashboards/shared/access', {
      shareToken,
      password
    });
    return response.data;
  },

  // ========================================
  // Comments & Annotations
  // ========================================
  getComments: async (dashboardId: string, widgetId?: string): Promise<DashboardComment[]> => {
    const response = await api.get<DashboardComment[]>(`/dashboards/${dashboardId}/comments`, {
      params: { widgetId }
    });
    return response.data;
  },

  addComment: async (dashboardId: string, data: {
    content: string;
    widgetId?: string;
    position?: CommentPosition;
    parentId?: string;
  }): Promise<DashboardComment> => {
    const response = await api.post<DashboardComment>(`/dashboards/${dashboardId}/comments`, data);
    return response.data;
  },

  updateComment: async (commentId: string, content: string): Promise<DashboardComment> => {
    const response = await api.put<DashboardComment>(`/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  resolveComment: async (commentId: string, resolved: boolean): Promise<void> => {
    await api.patch(`/comments/${commentId}/resolve`, { resolved });
  },

  // ========================================
  // Snapshots & Versioning
  // ========================================
  createSnapshot: async (dashboardId: string, name: string, description?: string): Promise<DashboardSnapshot> => {
    const response = await api.post<DashboardSnapshot>(`/dashboards/${dashboardId}/snapshots`, {
      name,
      description
    });
    return response.data;
  },

  getSnapshots: async (dashboardId: string): Promise<DashboardSnapshot[]> => {
    const response = await api.get<DashboardSnapshot[]>(`/dashboards/${dashboardId}/snapshots`);
    return response.data;
  },

  restoreSnapshot: async (snapshotId: string): Promise<DashboardEntity> => {
    const response = await api.post<DashboardEntity>(`/snapshots/${snapshotId}/restore`);
    return response.data;
  },

  compareSnapshots: async (snapshot1Id: string, snapshot2Id: string): Promise<{
    differences: Array<{
      type: 'added' | 'removed' | 'modified';
      path: string;
      oldValue?: any;
      newValue?: any;
    }>;
    summary: {
      totalChanges: number;
      addedWidgets: number;
      removedWidgets: number;
      modifiedWidgets: number;
    };
  }> => {
    const response = await api.post('/snapshots/compare', {
      snapshot1Id,
      snapshot2Id
    });
    return response.data;
  },

  // ========================================
  // Analytics & Monitoring
  // ========================================
  getDashboardAnalytics: async (dashboardId: string, period: AnalyticsPeriod): Promise<DashboardAnalytics> => {
    const response = await api.get<DashboardAnalytics>(`/dashboards/${dashboardId}/analytics`, {
      params: { period }
    });
    return response.data;
  },

  getSystemAnalytics: async (period: AnalyticsPeriod): Promise<{
    summary: AnalyticsSummary;
    dashboards: DashboardAnalytics[];
    trends: TrendData[];
    insights: AnalyticsInsight[];
  }> => {
    const response = await api.get('/dashboards/analytics', {
      params: { period }
    });
    return response.data;
  },

  getPopularDashboards: async (period: AnalyticsPeriod, limit?: number): Promise<Array<{
    dashboard: DashboardEntity;
    views: number;
    uniqueUsers: number;
    avgLoadTime: number;
    interactionRate: number;
  }>> => {
    const response = await api.get('/dashboards/analytics/popular', {
      params: { period, limit }
    });
    return response.data;
  },

  getPerformanceMetrics: async (dashboardId: string, period: AnalyticsPeriod): Promise<{
    avgLoadTime: number;
    minLoadTime: number;
    maxLoadTime: number;
    errorRate: number;
    cacheHitRate: number;
    widgetPerformance: Array<{
      widgetId: string;
      avgLoadTime: number;
      errorRate: number;
    }>;
    trends: Array<{
      date: Date;
      loadTime: number;
      errors: number;
      cacheHits: number;
    }>;
  }> => {
    const response = await api.get(`/dashboards/${dashboardId}/performance`, {
      params: { period }
    });
    return response.data;
  },

  // ========================================
  // Alerts & Monitoring
  // ========================================
  getAlerts: async (dashboardId?: string, widgetId?: string): Promise<WidgetAlert[]> => {
    const response = await api.get<WidgetAlert[]>('/alerts', {
      params: { dashboardId, widgetId }
    });
    return response.data;
  },

  createAlert: async (widgetId: string, alert: Omit<WidgetAlert, 'id' | 'lastTriggered' | 'triggerCount'>): Promise<WidgetAlert> => {
    const response = await api.post<WidgetAlert>(`/widgets/${widgetId}/alerts`, alert);
    return response.data;
  },

  updateAlert: async (alertId: string, updates: Partial<WidgetAlert>): Promise<WidgetAlert> => {
    const response = await api.put<WidgetAlert>(`/alerts/${alertId}`, updates);
    return response.data;
  },

  deleteAlert: async (alertId: string): Promise<void> => {
    await api.delete(`/alerts/${alertId}`);
  },

  testAlert: async (alertId: string): Promise<{
    triggered: boolean;
    value: any;
    threshold: any;
    message: string;
  }> => {
    const response = await api.post(`/alerts/${alertId}/test`);
    return response.data;
  },

  // ========================================
  // Export & Integration
  // ========================================
  exportDashboard: async (id: string, format: 'pdf' | 'png' | 'jpg' | 'json', options?: {
    includeData?: boolean;
    pageSize?: string;
    orientation?: 'portrait' | 'landscape';
    width?: number;
    height?: number;
  }): Promise<Blob> => {
    const response = await api.post(`/dashboards/${id}/export`, 
      { format, options },
      { responseType: 'blob' }
    );
    return response.data;
  },

  importDashboard: async (file: File, options?: {
    overwrite?: boolean;
    updateDataSources?: boolean;
    preserveIds?: boolean;
  }): Promise<{
    success: boolean;
    dashboard?: DashboardEntity;
    errors: string[];
    warnings: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/dashboards/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getEmbedCode: async (dashboardId: string, options?: {
    theme?: 'light' | 'dark' | 'auto';
    hideControls?: boolean;
    autoRefresh?: boolean;
    width?: string;
    height?: string;
  }): Promise<{
    embedUrl: string;
    iframeCode: string;
    javascriptCode: string;
    token: string;
  }> => {
    const response = await api.post(`/dashboards/${dashboardId}/embed`, options);
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================
  bulkUpdateDashboards: async (dashboardIds: string[], updates: UpdateDashboardRequest): Promise<{
    successful: DashboardEntity[];
    failed: Array<{
      dashboardId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/dashboards/bulk-update', {
      dashboardIds,
      updates
    });
    return response.data;
  },

  bulkDeleteDashboards: async (dashboardIds: string[]): Promise<{
    successful: string[];
    failed: Array<{
      dashboardId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/dashboards/bulk-delete', {
      dashboardIds
    });
    return response.data;
  },

  // ========================================
  // System Management
  // ========================================
  refreshCache: async (dashboardIds?: string[]): Promise<{
    refreshed: string[];
    failed: Array<{
      dashboardId: string;
      error: string;
    }>;
  }> => {
    const response = await api.post('/dashboards/cache/refresh', { dashboardIds });
    return response.data;
  },

  clearCache: async (): Promise<{
    cleared: number;
    totalSize: number;
  }> => {
    const response = await api.post('/dashboards/cache/clear');
    return response.data;
  },

  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    dashboards: {
      total: number;
      active: number;
      errors: number;
    };
    widgets: {
      total: number;
      loading: number;
      errors: number;
    };
    performance: {
      avgLoadTime: number;
      slowDashboards: number;
      cacheHitRate: number;
    };
    issues: Array<{
      severity: 'low' | 'medium' | 'high';
      message: string;
      dashboardId?: string;
      widgetId?: string;
    }>;
  }> => {
    const response = await api.get('/dashboards/health');
    return response.data;
  }
};

export default dashboardsAPI;
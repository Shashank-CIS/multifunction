import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Plus, 
  Filter, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Eye,
  Clock,
  User,
  Tag,
  Lightbulb,
  FolderOpen,
  RefreshCw
} from 'lucide-react';
import { KnowledgeArticle, AISearch } from '../types';

// Mock data - in production this would come from API
const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'How to Reset User Password',
    content: 'To reset a user password, follow these steps:\n\n1. Navigate to User Management\n2. Find the user account\n3. Click "Reset Password"\n4. Send new credentials to user email\n\nFor bulk password resets, use the CSV import feature.',
    summary: 'Step-by-step guide for password reset process',
    category: 'Account Management',
    tags: ['password', 'user management', 'security'],
    author: 'John Smith',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z',
    views: 245,
    helpful: 23,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '2',
    title: 'Database Connection Troubleshooting',
    content: 'Common database connection issues and solutions:\n\n1. Check connection string format\n2. Verify network connectivity\n3. Check database server status\n4. Review firewall settings\n5. Validate credentials\n\nFor persistent issues, check the error logs in /var/log/database.',
    summary: 'Troubleshooting guide for database connectivity issues',
    category: 'Database',
    tags: ['database', 'connectivity', 'troubleshooting'],
    author: 'Sarah Chen',
    createdAt: '2023-10-28T14:30:00Z',
    updatedAt: '2023-10-28T14:30:00Z',
    views: 178,
    helpful: 19,
    notHelpful: 1,
    status: 'published'
  },
  {
    id: '3',
    title: 'Setting Up VPN Access',
    content: 'VPN setup instructions for remote access:\n\n1. Download the VPN client\n2. Import the configuration file\n3. Enter your credentials\n4. Connect to the VPN\n5. Verify connection status\n\nContact IT support if you encounter certificate errors.',
    summary: 'Complete guide for VPN configuration and troubleshooting',
    category: 'Network',
    tags: ['vpn', 'remote access', 'security'],
    author: 'Mike Johnson',
    createdAt: '2023-10-25T09:15:00Z',
    updatedAt: '2023-10-25T09:15:00Z',
    views: 312,
    helpful: 28,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '4',
    title: 'Server Deployment Best Practices',
    content: 'Essential practices for secure server deployment:\n\n1. Environment Configuration\n   - Set up staging and production environments\n   - Configure environment variables\n   - Implement proper logging\n\n2. Security Measures\n   - Enable firewall rules\n   - Configure SSL certificates\n   - Set up monitoring alerts\n\n3. Performance Optimization\n   - Configure load balancing\n   - Set up caching mechanisms\n   - Monitor resource usage\n\n4. Backup and Recovery\n   - Implement automated backups\n   - Test recovery procedures\n   - Document rollback processes',
    summary: 'Comprehensive guide for secure and efficient server deployment',
    category: 'Deployment',
    tags: ['deployment', 'server', 'security', 'best practices'],
    author: 'Alex Rodriguez',
    createdAt: '2023-11-05T16:20:00Z',
    updatedAt: '2023-11-05T16:20:00Z',
    views: 189,
    helpful: 31,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '5',
    title: 'API Security Implementation',
    content: 'Securing REST APIs with authentication and authorization:\n\n1. Authentication Methods\n   - JWT token implementation\n   - OAuth 2.0 integration\n   - API key management\n\n2. Authorization Strategies\n   - Role-based access control (RBAC)\n   - Permission-based authorization\n   - Resource-level security\n\n3. Data Protection\n   - Input validation and sanitization\n   - SQL injection prevention\n   - XSS protection\n\n4. Rate Limiting and Monitoring\n   - Implement rate limiting\n   - Set up API monitoring\n   - Log security events',
    summary: 'Complete guide to implementing robust API security measures',
    category: 'Security',
    tags: ['api', 'security', 'authentication', 'authorization'],
    author: 'Lisa Wang',
    createdAt: '2023-11-03T11:45:00Z',
    updatedAt: '2023-11-03T11:45:00Z',
    views: 267,
    helpful: 42,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '6',
    title: 'Cloud Infrastructure Setup',
    content: 'Setting up scalable cloud infrastructure:\n\n1. Cloud Provider Selection\n   - Compare AWS, Azure, and GCP\n   - Evaluate pricing models\n   - Consider regional availability\n\n2. Network Configuration\n   - Set up Virtual Private Cloud (VPC)\n   - Configure subnets and routing\n   - Implement security groups\n\n3. Auto Scaling Configuration\n   - Configure auto scaling groups\n   - Set up load balancers\n   - Implement health checks\n\n4. Monitoring and Alerting\n   - Set up CloudWatch/Azure Monitor\n   - Configure alerting rules\n   - Implement log aggregation',
    summary: 'Step-by-step guide for setting up scalable cloud infrastructure',
    category: 'Infrastructure',
    tags: ['cloud', 'infrastructure', 'scaling', 'monitoring'],
    author: 'David Kim',
    createdAt: '2023-10-30T13:30:00Z',
    updatedAt: '2023-10-30T13:30:00Z',
    views: 198,
    helpful: 25,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '7',
    title: 'Database Performance Optimization',
    content: 'Optimizing database performance for better application response:\n\n1. Query Optimization\n   - Analyze slow queries\n   - Create appropriate indexes\n   - Optimize JOIN operations\n\n2. Database Design\n   - Normalize data structure\n   - Implement proper relationships\n   - Consider denormalization for read-heavy workloads\n\n3. Connection Management\n   - Configure connection pooling\n   - Set appropriate timeout values\n   - Monitor connection usage\n\n4. Maintenance Tasks\n   - Regular statistics updates\n   - Index maintenance\n   - Database cleanup procedures',
    summary: 'Comprehensive guide to database performance optimization techniques',
    category: 'Database',
    tags: ['database', 'performance', 'optimization', 'queries'],
    author: 'Maria Santos',
    createdAt: '2023-11-02T09:15:00Z',
    updatedAt: '2023-11-02T09:15:00Z',
    views: 156,
    helpful: 29,
    notHelpful: 1,
    status: 'published'
  },
  {
    id: '8',
    title: 'Network Security Protocols',
    content: 'Implementing essential network security protocols:\n\n1. Firewall Configuration\n   - Set up network firewalls\n   - Configure application firewalls\n   - Implement intrusion detection\n\n2. Encryption Standards\n   - TLS/SSL implementation\n   - Certificate management\n   - End-to-end encryption\n\n3. Access Control\n   - Network segmentation\n   - VPN configuration\n   - Multi-factor authentication\n\n4. Monitoring and Auditing\n   - Network traffic analysis\n   - Security event logging\n   - Regular security audits',
    summary: 'Essential network security protocols and implementation strategies',
    category: 'Security',
    tags: ['network', 'security', 'protocols', 'encryption'],
    author: 'Robert Brown',
    createdAt: '2023-10-27T14:20:00Z',
    updatedAt: '2023-10-27T14:20:00Z',
    views: 223,
    helpful: 35,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '9',
    title: 'Troubleshooting Application Errors',
    content: 'Systematic approach to diagnosing and fixing application issues:\n\n1. Error Identification\n   - Review error logs\n   - Identify error patterns\n   - Classify error severity\n\n2. Debugging Techniques\n   - Use debugging tools\n   - Implement logging strategies\n   - Trace execution flow\n\n3. Common Issues\n   - Memory leaks\n   - Performance bottlenecks\n   - Configuration errors\n\n4. Resolution Strategies\n   - Apply fixes systematically\n   - Test in staging environment\n   - Document solutions',
    summary: 'Comprehensive troubleshooting guide for common application errors',
    category: 'Troubleshooting',
    tags: ['troubleshooting', 'debugging', 'errors', 'application'],
    author: 'Jennifer Lee',
    createdAt: '2023-10-29T10:30:00Z',
    updatedAt: '2023-10-29T10:30:00Z',
    views: 134,
    helpful: 21,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '10',
    title: 'User Account Management System',
    content: 'Comprehensive user account management implementation:\n\n1. User Registration\n   - Account creation workflow\n   - Email verification process\n   - Profile setup procedures\n\n2. Authentication System\n   - Login mechanisms\n   - Password policies\n   - Session management\n\n3. Role Management\n   - Define user roles\n   - Assign permissions\n   - Implement role hierarchies\n\n4. Account Maintenance\n   - Password reset procedures\n   - Account deactivation\n   - Data retention policies',
    summary: 'Complete guide to implementing robust user account management',
    category: 'Account Management',
    tags: ['user management', 'authentication', 'roles', 'permissions'],
    author: 'Thomas Wilson',
    createdAt: '2023-11-04T15:45:00Z',
    updatedAt: '2023-11-04T15:45:00Z',
    views: 201,
    helpful: 33,
    notHelpful: 1,
    status: 'published'
  },
  {
    id: '11',
    title: 'Docker Container Management',
    content: 'Complete guide to Docker container lifecycle management:\n\n1. Container Creation\n   - Writing Dockerfiles\n   - Building images\n   - Managing layers\n\n2. Container Operations\n   - Starting and stopping containers\n   - Container networking\n   - Volume management\n\n3. Container Monitoring\n   - Health checks\n   - Log management\n   - Resource monitoring\n\n4. Production Deployment\n   - Container orchestration\n   - Scaling strategies\n   - Security considerations',
    summary: 'Comprehensive guide to Docker container management and deployment',
    category: 'Infrastructure',
    tags: ['docker', 'containers', 'deployment', 'devops'],
    author: 'Carlos Martinez',
    createdAt: '2023-11-06T08:30:00Z',
    updatedAt: '2023-11-06T08:30:00Z',
    views: 342,
    helpful: 38,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '12',
    title: 'SSL Certificate Configuration',
    content: 'Setting up and managing SSL certificates:\n\n1. Certificate Types\n   - Domain validation (DV)\n   - Organization validation (OV)\n   - Extended validation (EV)\n\n2. Certificate Installation\n   - Web server configuration\n   - Certificate chain setup\n   - Intermediate certificates\n\n3. Certificate Management\n   - Renewal processes\n   - Monitoring expiration\n   - Automated renewal\n\n4. Troubleshooting\n   - Common SSL errors\n   - Certificate validation\n   - Browser compatibility',
    summary: 'Complete guide to SSL certificate setup and management',
    category: 'Security',
    tags: ['ssl', 'certificates', 'https', 'security'],
    author: 'Emma Thompson',
    createdAt: '2023-11-07T14:15:00Z',
    updatedAt: '2023-11-07T14:15:00Z',
    views: 289,
    helpful: 45,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '13',
    title: 'Git Version Control Best Practices',
    content: 'Essential Git workflows and best practices:\n\n1. Repository Setup\n   - Repository initialization\n   - .gitignore configuration\n   - Branch strategy\n\n2. Commit Management\n   - Writing good commit messages\n   - Atomic commits\n   - Code review process\n\n3. Branching Strategies\n   - Git Flow workflow\n   - Feature branches\n   - Release management\n\n4. Collaboration\n   - Pull request workflow\n   - Conflict resolution\n   - Code review guidelines',
    summary: 'Best practices for Git version control and team collaboration',
    category: 'Deployment',
    tags: ['git', 'version control', 'collaboration', 'workflow'],
    author: 'Ryan O\'Connor',
    createdAt: '2023-11-08T10:45:00Z',
    updatedAt: '2023-11-08T10:45:00Z',
    views: 456,
    helpful: 52,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '14',
    title: 'Load Balancer Configuration',
    content: 'Setting up and configuring load balancers:\n\n1. Load Balancer Types\n   - Application load balancers\n   - Network load balancers\n   - Classic load balancers\n\n2. Configuration Setup\n   - Target group configuration\n   - Health check setup\n   - SSL termination\n\n3. Routing Rules\n   - Path-based routing\n   - Host-based routing\n   - Weighted routing\n\n4. Monitoring and Optimization\n   - Performance metrics\n   - Auto scaling integration\n   - Cost optimization',
    summary: 'Comprehensive guide to load balancer setup and optimization',
    category: 'Infrastructure',
    tags: ['load balancer', 'scaling', 'performance', 'aws'],
    author: 'Sophie Anderson',
    createdAt: '2023-11-09T16:20:00Z',
    updatedAt: '2023-11-09T16:20:00Z',
    views: 234,
    helpful: 29,
    notHelpful: 5,
    status: 'published'
  },
  {
    id: '15',
    title: 'MongoDB Database Administration',
    content: 'MongoDB administration and optimization:\n\n1. Installation and Setup\n   - MongoDB installation\n   - Configuration files\n   - Security setup\n\n2. Database Operations\n   - CRUD operations\n   - Indexing strategies\n   - Aggregation pipelines\n\n3. Performance Optimization\n   - Query optimization\n   - Index management\n   - Memory tuning\n\n4. Backup and Recovery\n   - Backup strategies\n   - Point-in-time recovery\n   - Disaster recovery planning',
    summary: 'Complete MongoDB administration and performance optimization guide',
    category: 'Database',
    tags: ['mongodb', 'nosql', 'database', 'administration'],
    author: 'Ahmed Hassan',
    createdAt: '2023-11-10T12:30:00Z',
    updatedAt: '2023-11-10T12:30:00Z',
    views: 187,
    helpful: 34,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '16',
    title: 'Firewall Rules Configuration',
    content: 'Configuring network firewalls for security:\n\n1. Firewall Basics\n   - Firewall types\n   - Rule hierarchy\n   - Default policies\n\n2. Rule Configuration\n   - Inbound rules\n   - Outbound rules\n   - Port management\n\n3. Advanced Features\n   - Application-layer filtering\n   - Intrusion detection\n   - VPN integration\n\n4. Monitoring and Maintenance\n   - Log analysis\n   - Rule optimization\n   - Security audits',
    summary: 'Essential guide to firewall configuration and network security',
    category: 'Security',
    tags: ['firewall', 'network security', 'rules', 'monitoring'],
    author: 'Nina Patel',
    createdAt: '2023-11-11T09:15:00Z',
    updatedAt: '2023-11-11T09:15:00Z',
    views: 298,
    helpful: 41,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '17',
    title: 'Redis Caching Implementation',
    content: 'Implementing Redis for application caching:\n\n1. Redis Setup\n   - Installation and configuration\n   - Memory optimization\n   - Persistence options\n\n2. Caching Strategies\n   - Cache-aside pattern\n   - Write-through caching\n   - Write-behind caching\n\n3. Data Structures\n   - Strings and hashes\n   - Lists and sets\n   - Sorted sets and streams\n\n4. Performance Monitoring\n   - Memory usage tracking\n   - Hit ratio optimization\n   - Scaling strategies',
    summary: 'Complete guide to Redis caching implementation and optimization',
    category: 'Database',
    tags: ['redis', 'caching', 'performance', 'memory'],
    author: 'Kevin Zhang',
    createdAt: '2023-11-12T15:45:00Z',
    updatedAt: '2023-11-12T15:45:00Z',
    views: 267,
    helpful: 36,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '18',
    title: 'Kubernetes Cluster Management',
    content: 'Managing Kubernetes clusters in production:\n\n1. Cluster Setup\n   - Node configuration\n   - Network setup\n   - Storage configuration\n\n2. Workload Management\n   - Deployments and services\n   - ConfigMaps and secrets\n   - Resource management\n\n3. Monitoring and Logging\n   - Cluster monitoring\n   - Application logging\n   - Health checks\n\n4. Security and Maintenance\n   - RBAC configuration\n   - Cluster upgrades\n   - Backup strategies',
    summary: 'Comprehensive Kubernetes cluster management and operations guide',
    category: 'Infrastructure',
    tags: ['kubernetes', 'orchestration', 'containers', 'devops'],
    author: 'Isabella Rodriguez',
    createdAt: '2023-11-13T11:20:00Z',
    updatedAt: '2023-11-13T11:20:00Z',
    views: 389,
    helpful: 47,
    notHelpful: 5,
    status: 'published'
  },
  {
    id: '19',
    title: 'OAuth 2.0 Implementation',
    content: 'Implementing OAuth 2.0 authentication:\n\n1. OAuth 2.0 Basics\n   - Authorization flows\n   - Grant types\n   - Token management\n\n2. Implementation Steps\n   - Authorization server setup\n   - Client registration\n   - Scope configuration\n\n3. Security Considerations\n   - Token validation\n   - PKCE implementation\n   - Refresh token handling\n\n4. Integration Examples\n   - Web application flow\n   - Mobile app integration\n   - API protection',
    summary: 'Complete OAuth 2.0 implementation guide with security best practices',
    category: 'Security',
    tags: ['oauth', 'authentication', 'api', 'security'],
    author: 'Marcus Johnson',
    createdAt: '2023-11-14T13:10:00Z',
    updatedAt: '2023-11-14T13:10:00Z',
    views: 324,
    helpful: 43,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '20',
    title: 'CI/CD Pipeline Setup',
    content: 'Setting up continuous integration and deployment:\n\n1. Pipeline Design\n   - Workflow planning\n   - Stage configuration\n   - Dependency management\n\n2. Build Automation\n   - Code compilation\n   - Testing automation\n   - Artifact creation\n\n3. Deployment Strategies\n   - Blue-green deployment\n   - Canary releases\n   - Rolling updates\n\n4. Monitoring and Rollback\n   - Deployment monitoring\n   - Automated rollback\n   - Performance tracking',
    summary: 'Complete CI/CD pipeline setup and deployment automation guide',
    category: 'Deployment',
    tags: ['cicd', 'automation', 'deployment', 'devops'],
    author: 'Rachel Kim',
    createdAt: '2023-11-15T07:30:00Z',
    updatedAt: '2023-11-15T07:30:00Z',
    views: 412,
    helpful: 49,
    notHelpful: 6,
    status: 'published'
  },
  {
    id: '21',
    title: 'PostgreSQL Performance Tuning',
    content: 'Optimizing PostgreSQL database performance:\n\n1. Configuration Tuning\n   - Memory settings\n   - Connection pooling\n   - Query planner settings\n\n2. Index Optimization\n   - Index types and usage\n   - Query plan analysis\n   - Index maintenance\n\n3. Query Optimization\n   - Query writing best practices\n   - Execution plan analysis\n   - Performance monitoring\n\n4. Maintenance Tasks\n   - VACUUM and ANALYZE\n   - Statistics updates\n   - Log analysis',
    summary: 'Comprehensive PostgreSQL performance tuning and optimization guide',
    category: 'Database',
    tags: ['postgresql', 'performance', 'tuning', 'optimization'],
    author: 'Daniel Foster',
    createdAt: '2023-11-16T14:45:00Z',
    updatedAt: '2023-11-16T14:45:00Z',
    views: 276,
    helpful: 39,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '22',
    title: 'Network Monitoring Tools',
    content: 'Essential network monitoring and troubleshooting tools:\n\n1. Network Analysis Tools\n   - Wireshark for packet analysis\n   - Nmap for network discovery\n   - Netstat for connection monitoring\n\n2. Performance Monitoring\n   - Bandwidth monitoring\n   - Latency measurement\n   - Throughput analysis\n\n3. Infrastructure Monitoring\n   - SNMP monitoring\n   - Network device health\n   - Alert configuration\n\n4. Troubleshooting Workflows\n   - Problem identification\n   - Root cause analysis\n   - Resolution documentation',
    summary: 'Complete guide to network monitoring tools and troubleshooting techniques',
    category: 'Network',
    tags: ['network', 'monitoring', 'troubleshooting', 'tools'],
    author: 'Laura Chen',
    createdAt: '2023-11-17T10:15:00Z',
    updatedAt: '2023-11-17T10:15:00Z',
    views: 198,
    helpful: 27,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '23',
    title: 'Backup and Recovery Strategies',
    content: 'Implementing comprehensive backup and recovery solutions:\n\n1. Backup Planning\n   - Backup types and schedules\n   - Retention policies\n   - Storage considerations\n\n2. Backup Implementation\n   - Full system backups\n   - Incremental backups\n   - Database backups\n\n3. Recovery Procedures\n   - Disaster recovery planning\n   - Point-in-time recovery\n   - Testing recovery procedures\n\n4. Monitoring and Maintenance\n   - Backup verification\n   - Storage management\n   - Documentation updates',
    summary: 'Essential backup and disaster recovery planning and implementation guide',
    category: 'Infrastructure',
    tags: ['backup', 'recovery', 'disaster recovery', 'data protection'],
    author: 'James Wilson',
    createdAt: '2023-11-18T16:00:00Z',
    updatedAt: '2023-11-18T16:00:00Z',
    views: 345,
    helpful: 44,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '24',
    title: 'API Rate Limiting Implementation',
    content: 'Implementing rate limiting for API protection:\n\n1. Rate Limiting Strategies\n   - Token bucket algorithm\n   - Fixed window approach\n   - Sliding window method\n\n2. Implementation Techniques\n   - Application-level limiting\n   - Gateway-level limiting\n   - Distributed rate limiting\n\n3. Configuration Options\n   - Rate limit rules\n   - Burst handling\n   - User-based limits\n\n4. Monitoring and Analytics\n   - Rate limit metrics\n   - Abuse detection\n   - Performance impact analysis',
    summary: 'Complete guide to API rate limiting implementation and management',
    category: 'Security',
    tags: ['api', 'rate limiting', 'security', 'performance'],
    author: 'Anna Kowalski',
    createdAt: '2023-11-19T12:25:00Z',
    updatedAt: '2023-11-19T12:25:00Z',
    views: 223,
    helpful: 31,
    notHelpful: 5,
    status: 'published'
  },
  {
    id: '25',
    title: 'Microservices Architecture Design',
    content: 'Designing and implementing microservices architecture:\n\n1. Architecture Planning\n   - Service decomposition\n   - Bounded contexts\n   - Communication patterns\n\n2. Service Implementation\n   - Service design principles\n   - Data management\n   - API design\n\n3. Infrastructure Considerations\n   - Service discovery\n   - Load balancing\n   - Circuit breakers\n\n4. Monitoring and Observability\n   - Distributed tracing\n   - Centralized logging\n   - Health monitoring',
    summary: 'Comprehensive guide to microservices architecture design and implementation',
    category: 'Infrastructure',
    tags: ['microservices', 'architecture', 'design', 'scalability'],
    author: 'Roberto Silva',
    createdAt: '2023-11-20T08:40:00Z',
    updatedAt: '2023-11-20T08:40:00Z',
    views: 467,
    helpful: 56,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '26',
    title: 'Log Management and Analysis',
    content: 'Implementing comprehensive log management solutions:\n\n1. Log Collection\n   - Application logging\n   - System log collection\n   - Centralized logging\n\n2. Log Processing\n   - Log parsing and formatting\n   - Data enrichment\n   - Real-time processing\n\n3. Analysis and Monitoring\n   - Log analysis tools\n   - Alert configuration\n   - Dashboard creation\n\n4. Storage and Retention\n   - Log storage strategies\n   - Retention policies\n   - Archive management',
    summary: 'Complete log management and analysis implementation guide',
    category: 'Troubleshooting',
    tags: ['logging', 'monitoring', 'analysis', 'troubleshooting'],
    author: 'Priya Sharma',
    createdAt: '2023-11-21T15:30:00Z',
    updatedAt: '2023-11-21T15:30:00Z',
    views: 189,
    helpful: 26,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '27',
    title: 'Container Security Best Practices',
    content: 'Securing containerized applications and infrastructure:\n\n1. Image Security\n   - Base image selection\n   - Vulnerability scanning\n   - Image signing\n\n2. Runtime Security\n   - Container isolation\n   - Resource limits\n   - Security policies\n\n3. Network Security\n   - Network segmentation\n   - Service mesh security\n   - Traffic encryption\n\n4. Compliance and Monitoring\n   - Security benchmarks\n   - Continuous monitoring\n   - Audit logging',
    summary: 'Essential container security practices and implementation guide',
    category: 'Security',
    tags: ['containers', 'security', 'docker', 'kubernetes'],
    author: 'Oliver Brown',
    createdAt: '2023-11-22T11:45:00Z',
    updatedAt: '2023-11-22T11:45:00Z',
    views: 312,
    helpful: 42,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '28',
    title: 'Database Migration Strategies',
    content: 'Planning and executing database migrations:\n\n1. Migration Planning\n   - Assessment and analysis\n   - Migration strategy selection\n   - Risk assessment\n\n2. Data Migration\n   - Schema migration\n   - Data transfer methods\n   - Validation procedures\n\n3. Application Updates\n   - Code modifications\n   - Configuration changes\n   - Testing procedures\n\n4. Rollback and Recovery\n   - Rollback planning\n   - Data consistency\n   - Performance monitoring',
    summary: 'Comprehensive database migration planning and execution guide',
    category: 'Database',
    tags: ['migration', 'database', 'planning', 'data transfer'],
    author: 'Grace Liu',
    createdAt: '2023-11-23T13:20:00Z',
    updatedAt: '2023-11-23T13:20:00Z',
    views: 245,
    helpful: 35,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '29',
    title: 'Web Application Security Testing',
    content: 'Comprehensive web application security testing guide:\n\n1. Security Testing Types\n   - Vulnerability assessment\n   - Penetration testing\n   - Code review\n\n2. Common Vulnerabilities\n   - OWASP Top 10\n   - Injection attacks\n   - Authentication flaws\n\n3. Testing Tools\n   - Automated scanners\n   - Manual testing tools\n   - Code analysis tools\n\n4. Remediation Process\n   - Vulnerability prioritization\n   - Fix implementation\n   - Verification testing',
    summary: 'Complete web application security testing methodology and tools guide',
    category: 'Security',
    tags: ['security testing', 'web security', 'vulnerabilities', 'penetration testing'],
    author: 'Hassan Ahmed',
    createdAt: '2023-11-24T09:35:00Z',
    updatedAt: '2023-11-24T09:35:00Z',
    views: 278,
    helpful: 38,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '30',
    title: 'Cloud Cost Optimization',
    content: 'Optimizing cloud infrastructure costs:\n\n1. Cost Analysis\n   - Resource utilization review\n   - Cost breakdown analysis\n   - Waste identification\n\n2. Optimization Strategies\n   - Right-sizing resources\n   - Reserved instance planning\n   - Spot instance usage\n\n3. Automation Tools\n   - Auto-scaling configuration\n   - Scheduled shutdowns\n   - Cost monitoring alerts\n\n4. Governance Policies\n   - Budget controls\n   - Resource tagging\n   - Cost allocation',
    summary: 'Essential cloud cost optimization strategies and implementation guide',
    category: 'Infrastructure',
    tags: ['cloud', 'cost optimization', 'aws', 'resource management'],
    author: 'Victoria Adams',
    createdAt: '2023-11-25T14:50:00Z',
    updatedAt: '2023-11-25T14:50:00Z',
    views: 356,
    helpful: 46,
    notHelpful: 5,
    status: 'published'
  },
  {
    id: '31',
    title: 'Identity and Access Management',
    content: 'Implementing comprehensive IAM solutions:\n\n1. IAM Architecture\n   - Identity providers\n   - Access management\n   - Federation setup\n\n2. Authentication Methods\n   - Multi-factor authentication\n   - Single sign-on (SSO)\n   - Biometric authentication\n\n3. Authorization Frameworks\n   - Role-based access control\n   - Attribute-based access control\n   - Policy management\n\n4. Compliance and Auditing\n   - Access reviews\n   - Compliance reporting\n   - Audit trails',
    summary: 'Complete identity and access management implementation guide',
    category: 'Account Management',
    tags: ['iam', 'authentication', 'authorization', 'security'],
    author: 'Benjamin Taylor',
    createdAt: '2023-11-26T10:15:00Z',
    updatedAt: '2023-11-26T10:15:00Z',
    views: 423,
    helpful: 51,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '32',
    title: 'Performance Monitoring and APM',
    content: 'Application performance monitoring implementation:\n\n1. Monitoring Strategy\n   - Metrics selection\n   - Alerting thresholds\n   - Dashboard design\n\n2. APM Tools Setup\n   - Agent installation\n   - Configuration management\n   - Data collection\n\n3. Performance Analysis\n   - Bottleneck identification\n   - Trend analysis\n   - Root cause analysis\n\n4. Optimization Actions\n   - Performance tuning\n   - Capacity planning\n   - Proactive monitoring',
    summary: 'Comprehensive application performance monitoring and optimization guide',
    category: 'Troubleshooting',
    tags: ['apm', 'monitoring', 'performance', 'optimization'],
    author: 'Samantha Davis',
    createdAt: '2023-11-27T16:25:00Z',
    updatedAt: '2023-11-27T16:25:00Z',
    views: 234,
    helpful: 32,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '33',
    title: 'API Gateway Configuration',
    content: 'Setting up and configuring API gateways:\n\n1. Gateway Setup\n   - Installation and configuration\n   - Service registration\n   - Route configuration\n\n2. Security Features\n   - Authentication integration\n   - Rate limiting\n   - Request validation\n\n3. Traffic Management\n   - Load balancing\n   - Circuit breakers\n   - Retry policies\n\n4. Monitoring and Analytics\n   - Request tracking\n   - Performance metrics\n   - Error analysis',
    summary: 'Complete API gateway setup and configuration guide',
    category: 'Infrastructure',
    tags: ['api gateway', 'microservices', 'routing', 'security'],
    author: 'Michael Chang',
    createdAt: '2023-11-28T12:40:00Z',
    updatedAt: '2023-11-28T12:40:00Z',
    views: 289,
    helpful: 39,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '34',
    title: 'Incident Response Procedures',
    content: 'Establishing effective incident response processes:\n\n1. Incident Classification\n   - Severity levels\n   - Impact assessment\n   - Escalation criteria\n\n2. Response Procedures\n   - Initial response\n   - Investigation process\n   - Communication protocols\n\n3. Resolution and Recovery\n   - Fix implementation\n   - Service restoration\n   - Validation testing\n\n4. Post-Incident Activities\n   - Root cause analysis\n   - Documentation updates\n   - Process improvements',
    summary: 'Comprehensive incident response procedures and best practices guide',
    category: 'Troubleshooting',
    tags: ['incident response', 'troubleshooting', 'processes', 'documentation'],
    author: 'Elena Rodriguez',
    createdAt: '2023-11-29T08:55:00Z',
    updatedAt: '2023-11-29T08:55:00Z',
    views: 167,
    helpful: 24,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '35',
    title: 'Message Queue Implementation',
    content: 'Implementing message queues for distributed systems:\n\n1. Queue Selection\n   - Message broker comparison\n   - Use case analysis\n   - Scalability requirements\n\n2. Implementation Setup\n   - Queue configuration\n   - Producer setup\n   - Consumer implementation\n\n3. Message Patterns\n   - Point-to-point messaging\n   - Publish-subscribe patterns\n   - Request-reply patterns\n\n4. Reliability and Monitoring\n   - Message durability\n   - Dead letter queues\n   - Performance monitoring',
    summary: 'Complete message queue implementation and management guide',
    category: 'Infrastructure',
    tags: ['message queue', 'messaging', 'distributed systems', 'scalability'],
    author: 'Nathan Cooper',
    createdAt: '2023-11-30T15:10:00Z',
    updatedAt: '2023-11-30T15:10:00Z',
    views: 198,
    helpful: 28,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '36',
    title: 'DNS Configuration and Management',
    content: 'DNS setup and management best practices:\n\n1. DNS Fundamentals\n   - Record types\n   - Zone configuration\n   - Name resolution\n\n2. DNS Server Setup\n   - Authoritative servers\n   - Recursive resolvers\n   - Caching strategies\n\n3. Advanced Features\n   - Load balancing\n   - Failover configuration\n   - Geographic routing\n\n4. Security and Monitoring\n   - DNSSEC implementation\n   - DNS monitoring\n   - Performance optimization',
    summary: 'Comprehensive DNS configuration and management guide',
    category: 'Network',
    tags: ['dns', 'networking', 'configuration', 'management'],
    author: 'Zoe Mitchell',
    createdAt: '2023-12-01T11:30:00Z',
    updatedAt: '2023-12-01T11:30:00Z',
    views: 245,
    helpful: 33,
    notHelpful: 4,
    status: 'published'
  },
  {
    id: '37',
    title: 'Elasticsearch Configuration',
    content: 'Setting up and optimizing Elasticsearch clusters:\n\n1. Cluster Setup\n   - Node configuration\n   - Index management\n   - Shard allocation\n\n2. Data Modeling\n   - Mapping design\n   - Index templates\n   - Data types\n\n3. Query Optimization\n   - Search performance\n   - Aggregation queries\n   - Query profiling\n\n4. Monitoring and Maintenance\n   - Cluster health\n   - Performance metrics\n   - Index lifecycle management',
    summary: 'Complete Elasticsearch setup and optimization guide',
    category: 'Database',
    tags: ['elasticsearch', 'search', 'indexing', 'optimization'],
    author: 'Lucas Anderson',
    createdAt: '2023-12-02T13:45:00Z',
    updatedAt: '2023-12-02T13:45:00Z',
    views: 321,
    helpful: 41,
    notHelpful: 3,
    status: 'published'
  },
  {
    id: '38',
    title: 'Zero-Trust Security Model',
    content: 'Implementing zero-trust security architecture:\n\n1. Zero-Trust Principles\n   - Never trust, always verify\n   - Least privilege access\n   - Assume breach mentality\n\n2. Implementation Components\n   - Identity verification\n   - Device authentication\n   - Network segmentation\n\n3. Technology Stack\n   - Identity providers\n   - Network security tools\n   - Endpoint protection\n\n4. Monitoring and Compliance\n   - Continuous monitoring\n   - Risk assessment\n   - Compliance reporting',
    summary: 'Zero-trust security model implementation and best practices guide',
    category: 'Security',
    tags: ['zero trust', 'security model', 'architecture', 'compliance'],
    author: 'Aisha Johnson',
    createdAt: '2023-12-03T09:20:00Z',
    updatedAt: '2023-12-03T09:20:00Z',
    views: 378,
    helpful: 48,
    notHelpful: 2,
    status: 'published'
  },
  {
    id: '39',
    title: 'Serverless Architecture Patterns',
    content: 'Designing and implementing serverless applications:\n\n1. Serverless Fundamentals\n   - Function-as-a-Service (FaaS)\n   - Event-driven architecture\n   - Stateless design\n\n2. Architecture Patterns\n   - Microservices with functions\n   - Event sourcing\n   - CQRS implementation\n\n3. Implementation Best Practices\n   - Cold start optimization\n   - Resource management\n   - Error handling\n\n4. Monitoring and Debugging\n   - Distributed tracing\n   - Log aggregation\n   - Performance monitoring',
    summary: 'Comprehensive serverless architecture design and implementation guide',
    category: 'Infrastructure',
    tags: ['serverless', 'architecture', 'faas', 'event-driven'],
    author: 'Tyler Williams',
    createdAt: '2023-12-04T14:35:00Z',
    updatedAt: '2023-12-04T14:35:00Z',
    views: 456,
    helpful: 54,
    notHelpful: 5,
    status: 'published'
  },
  {
    id: '40',
    title: 'Data Privacy and GDPR Compliance',
    content: 'Implementing data privacy and GDPR compliance:\n\n1. GDPR Requirements\n   - Data protection principles\n   - Legal basis for processing\n   - Individual rights\n\n2. Technical Implementation\n   - Privacy by design\n   - Data encryption\n   - Access controls\n\n3. Compliance Processes\n   - Data mapping\n   - Impact assessments\n   - Consent management\n\n4. Monitoring and Auditing\n   - Compliance monitoring\n   - Breach detection\n   - Audit documentation',
    summary: 'Complete GDPR compliance and data privacy implementation guide',
    category: 'Security',
    tags: ['gdpr', 'privacy', 'compliance', 'data protection'],
    author: 'Catherine Moore',
    createdAt: '2023-12-05T16:50:00Z',
    updatedAt: '2023-12-05T16:50:00Z',
    views: 267,
    helpful: 37,
    notHelpful: 3,
    status: 'published'
  }
];

const mockCategories = [
  { id: '1', name: 'Infrastructure' },
  { id: '2', name: 'Security' },
  { id: '3', name: 'Database' },
  { id: '4', name: 'Networking' },
  { id: '5', name: 'Account Management' },
  { id: '6', name: 'Troubleshooting' },
  { id: '7', name: 'Deployment' }
];

const KnowledgeBase: React.FC = () => {
  const { user, isManager } = useAuth();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  // Modal states
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showArticleDetailsModal, setShowArticleDetailsModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  // Handle article click
  const handleArticleClick = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setShowArticleDetailsModal(true);
    // Simulate view increment
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, views: a.views + 1 } : a
    ));
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate AI suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 2) {
      const suggestions = [
        'password reset procedure',
        'database troubleshooting',
        'vpn setup guide',
        'user management',
        'network configuration'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
        suggestion !== searchTerm
      );
      setAiSuggestions(suggestions.slice(0, 3));
    } else {
      setAiSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header and Stats Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600">
                {isManager ? 'Manage and browse technical documentation' : 'Search and browse technical documentation'}
              </p>
            </div>
            {isManager && (
              <button className="group relative bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/40 hover:text-blue-600">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="relative z-10">New Article</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-blue-50"
            onClick={() => setShowArticlesModal(true)}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockArticles.length}</p>
                <p className="text-xs text-blue-600 mt-1">Click to view all</p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-green-50"
            onClick={() => setShowVotesModal(true)}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Helpful Votes</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockArticles.reduce((sum, article) => sum + article.helpful, 0)}
                </p>
                <p className="text-xs text-green-600 mt-1">Click to see reviews</p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50"
            onClick={() => setShowViewsModal(true)}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockArticles.reduce((sum, article) => sum + article.views, 0)}
                </p>
                <p className="text-xs text-purple-600 mt-1">Click for details</p>
              </div>
            </div>
          </div>

          <div 
            className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-yellow-50"
            onClick={() => setShowCategoriesModal(true)}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                <p className="text-2xl font-semibold text-gray-900">{mockCategories.length}</p>
                <p className="text-xs text-yellow-600 mt-1">Click to explore</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-2">Search Articles</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              <option value="">All Categories</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="px-3 py-1 text-sm bg-white text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Articles List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-blue-50"
              onClick={() => handleArticleClick(article)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  article.category === 'Infrastructure' ? 'bg-blue-100 text-blue-800' :
                  article.category === 'Security' ? 'bg-red-100 text-red-800' :
                  article.category === 'Database' ? 'bg-green-100 text-green-800' :
                  article.category === 'Networking' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {article.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.max(1, Math.ceil(article.content.split(' ').length / 200))}m read
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.views}
                  </span>
                  <button 
                    onClick={() => handleArticleClick(article)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all"
                  >
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Total Articles Modal */}
      {showArticlesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Knowledge Base Articles</h2>
              <button
                onClick={() => setShowArticlesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Articles Overview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Articles Library</h3>
                    <p className="text-blue-700">Complete knowledge base collection</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900">{mockArticles.length}</div>
                    <div className="text-sm text-blue-600">Total Articles</div>
                  </div>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockArticles.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.author}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {article.category}
                          </span>
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{article.tags.length - 2} more</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Eye className="w-4 h-4 mr-1" />
                              {article.views} views
                            </span>
                            <span className="flex items-center text-green-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {article.helpful}
                            </span>
                            <span className="flex items-center text-red-500">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {article.notHelpful}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {mockArticles.filter(a => a.status === 'published').length}
                  </div>
                  <div className="text-xs text-green-600">Published</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-700">
                    {mockArticles.filter(a => a.status === 'draft').length}
                  </div>
                  <div className="text-xs text-yellow-600">Drafts</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {Math.round(mockArticles.reduce((sum, a) => sum + a.views, 0) / mockArticles.length)}
                  </div>
                  <div className="text-xs text-purple-600">Avg Views</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(mockArticles.reduce((sum, a) => sum + a.helpful, 0) / mockArticles.length)}
                  </div>
                  <div className="text-xs text-blue-600">Avg Helpful</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowArticlesModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Votes Modal */}
      {showVotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Helpful Votes & Reviews</h2>
              <button
                onClick={() => setShowVotesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Votes Overview */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Community Feedback</h3>
                    <p className="text-green-700">User ratings and reviews for knowledge base articles</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-900">
                      {mockArticles.reduce((sum, article) => sum + article.helpful, 0)}
                    </div>
                    <div className="text-sm text-green-600">Total Helpful Votes</div>
                  </div>
                </div>
              </div>

              {/* Vote Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {mockArticles.reduce((sum, article) => sum + article.helpful, 0)}
                  </div>
                  <div className="text-xs text-green-600">👍 Helpful</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {mockArticles.reduce((sum, article) => sum + article.notHelpful, 0)}
                  </div>
                  <div className="text-xs text-red-600">👎 Not Helpful</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(
                      (mockArticles.reduce((sum, article) => sum + article.helpful, 0) / 
                       (mockArticles.reduce((sum, article) => sum + article.helpful + article.notHelpful, 0))) * 100
                    )}%
                  </div>
                  <div className="text-xs text-blue-600">Satisfaction Rate</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {mockArticles.reduce((sum, article) => sum + article.helpful + article.notHelpful, 0)}
                  </div>
                  <div className="text-xs text-purple-600">Total Votes</div>
                </div>
              </div>

              {/* Articles with Reviews */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Reviews</h3>
                <div className="space-y-4">
                  {mockArticles.map((article) => {
                    // Generate mock reviews
                    const reviews = [
                      { user: 'Alex Johnson', rating: 'helpful', comment: 'Very clear instructions, helped me resolve the issue quickly!', date: '2023-11-15' },
                      { user: 'Maria Garcia', rating: 'helpful', comment: 'Step-by-step guide was perfect. Saved me hours of troubleshooting.', date: '2023-11-14' },
                      { user: 'David Chen', rating: 'helpful', comment: 'Exactly what I was looking for. Great documentation!', date: '2023-11-13' },
                      { user: 'Sarah Wilson', rating: 'not_helpful', comment: 'Instructions were unclear for my specific setup.', date: '2023-11-12' }
                    ].slice(0, Math.floor(Math.random() * 3) + 1);

                    return (
                      <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{article.title}</h4>
                            <p className="text-sm text-gray-600">{article.category}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-green-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {article.helpful}
                            </span>
                            <span className="flex items-center text-red-500">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {article.notHelpful}
                            </span>
                          </div>
                        </div>

                        {/* Sample Reviews */}
                        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                          {reviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">{review.user}</div>
                                    <div className="text-xs text-gray-500">{review.date}</div>
                                  </div>
                                </div>
                                <div className={`flex items-center text-sm ${
                                  review.rating === 'helpful' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {review.rating === 'helpful' ? (
                                    <><ThumbsUp className="w-4 h-4 mr-1" /> Helpful</>
                                  ) : (
                                    <><ThumbsDown className="w-4 h-4 mr-1" /> Not Helpful</>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Rated Articles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rated Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockArticles
                    .sort((a, b) => (b.helpful / (b.helpful + b.notHelpful)) - (a.helpful / (a.helpful + a.notHelpful)))
                    .slice(0, 3)
                    .map((article, index) => (
                      <div key={article.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg font-bold text-green-700">#{index + 1}</div>
                          <div className="text-sm text-green-600">
                            {Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)}% helpful
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-green-600">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {article.helpful}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowVotesModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Views Modal */}
      {showViewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Article Views & Analytics</h2>
              <button
                onClick={() => setShowViewsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Views Overview */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Knowledge Base Analytics</h3>
                    <p className="text-purple-700">Comprehensive view statistics and engagement metrics</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-900">
                      {mockArticles.reduce((sum, article) => sum + article.views, 0)}
                    </div>
                    <div className="text-sm text-purple-600">Total Views</div>
                  </div>
                </div>
              </div>

              {/* View Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {mockArticles.reduce((sum, article) => sum + article.views, 0)}
                  </div>
                  <div className="text-xs text-purple-600">Total Views</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(mockArticles.reduce((sum, article) => sum + article.views, 0) / mockArticles.length)}
                  </div>
                  <div className="text-xs text-blue-600">Avg per Article</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {Math.max(...mockArticles.map(a => a.views))}
                  </div>
                  <div className="text-xs text-green-600">Highest Views</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-700">
                    {Math.round(mockArticles.reduce((sum, article) => sum + article.views, 0) / 30)}
                  </div>
                  <div className="text-xs text-yellow-600">Daily Average</div>
                </div>
              </div>

              {/* Most Viewed Articles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Articles</h3>
                <div className="space-y-4">
                  {mockArticles
                    .sort((a, b) => b.views - a.views)
                    .map((article, index) => (
                      <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-purple-600">#{index + 1}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{article.title}</h4>
                              <p className="text-sm text-gray-600">{article.category}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {article.author}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(article.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-700">{article.views}</div>
                            <div className="text-sm text-purple-600">views</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="flex items-center text-green-600 text-sm">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {article.helpful}
                              </span>
                              <span className="text-gray-300">|</span>
                              <span className="text-sm text-gray-600">
                                {Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)}% helpful
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* View Trends (Mock Data) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Views */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Daily Views (Last 7 Days)</h4>
                    <div className="space-y-2">
                      {[
                        { day: 'Today', views: 89, change: '+12%' },
                        { day: 'Yesterday', views: 76, change: '+8%' },
                        { day: '2 days ago', views: 65, change: '-5%' },
                        { day: '3 days ago', views: 71, change: '+15%' },
                        { day: '4 days ago', views: 58, change: '-2%' },
                        { day: '5 days ago', views: 62, change: '+9%' },
                        { day: '6 days ago', views: 54, change: '+3%' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{item.day}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{item.views}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Performance */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Views by Category</h4>
                    <div className="space-y-3">
                      {mockCategories.slice(0, 5).map((category) => {
                        const categoryViews = mockArticles
                          .filter(article => article.category === category.name)
                          .reduce((sum, article) => sum + article.views, 0);
                        const totalViews = mockArticles.reduce((sum, article) => sum + article.views, 0);
                        const percentage = Math.round((categoryViews / totalViews) * 100);
                        
                        return (
                          <div key={category.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{category.name}</span>
                              <span className="font-medium text-gray-900">{categoryViews} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockArticles.map((article) => {
                    const engagementRate = ((article.helpful + article.notHelpful) / article.views) * 100;
                    return (
                      <div key={article.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{article.title}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Views</span>
                            <span className="font-medium">{article.views}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Engagement</span>
                            <span className="font-medium">{Math.round(engagementRate)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-purple-600 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(engagementRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewsModal(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Knowledge Base Categories</h2>
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Categories Overview */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">Content Organization</h3>
                    <p className="text-yellow-700">Browse articles by topic and expertise area</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-900">{mockCategories.length}</div>
                    <div className="text-sm text-yellow-600">Categories</div>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCategories.map((category) => {
                  const categoryArticles = mockArticles.filter(article => article.category === category.name);
                  const totalViews = categoryArticles.reduce((sum, article) => sum + article.views, 0);
                  const totalVotes = categoryArticles.reduce((sum, article) => sum + article.helpful + article.notHelpful, 0);
                  const avgRating = categoryArticles.length > 0 
                    ? Math.round(categoryArticles.reduce((sum, article) => sum + (article.helpful / (article.helpful + article.notHelpful)), 0) / categoryArticles.length * 100)
                    : 0;

                  const categoryColors = {
                    'Infrastructure': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
                    'Security': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' },
                    'Database': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
                    'Networking': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
                    'Account Management': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
                    'Troubleshooting': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600' },
                    'Deployment': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' }
                  };

                  const colors = categoryColors[category.name as keyof typeof categoryColors] || categoryColors['Infrastructure'];

                  return (
                    <div key={category.id} className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-2 ${colors.bg} rounded-lg mr-3`}>
                            <FolderOpen className={`w-5 h-5 ${colors.icon}`} />
                          </div>
                          <h4 className={`font-semibold ${colors.text}`}>{category.name}</h4>
                        </div>
                        <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full font-medium`}>
                          {categoryArticles.length} articles
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Category Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-center p-2 bg-white/50 rounded">
                            <div className={`font-bold ${colors.text}`}>{totalViews}</div>
                            <div className="text-xs text-gray-600">Total Views</div>
                          </div>
                          <div className="text-center p-2 bg-white/50 rounded">
                            <div className={`font-bold ${colors.text}`}>{avgRating}%</div>
                            <div className="text-xs text-gray-600">Avg Rating</div>
                          </div>
                        </div>

                        {/* Top Articles in Category */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Top Articles:</h5>
                          <div className="space-y-1">
                            {categoryArticles.slice(0, 2).map((article) => (
                              <div key={article.id} className="bg-white/70 rounded p-2 text-xs">
                                <div className="font-medium text-gray-900 truncate">{article.title}</div>
                                <div className="flex items-center space-x-2 text-gray-500 mt-1">
                                  <span className="flex items-center">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {article.views}
                                  </span>
                                  <span className="flex items-center">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {article.helpful}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {categoryArticles.length > 2 && (
                              <div className="text-xs text-gray-500 text-center py-1">
                                +{categoryArticles.length - 2} more articles
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Category Description */}
                        <div className="text-xs text-gray-600">
                          {category.name === 'Infrastructure' && 'Server management, cloud services, and system architecture'}
                          {category.name === 'Security' && 'Authentication, authorization, and security protocols'}
                          {category.name === 'Database' && 'Database administration, queries, and optimization'}
                          {category.name === 'Networking' && 'Network configuration, VPN, and connectivity'}
                          {category.name === 'Account Management' && 'User accounts, permissions, and access control'}
                          {category.name === 'Troubleshooting' && 'Problem diagnosis and resolution guides'}
                          {category.name === 'Deployment' && 'Application deployment and release management'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                <div className="space-y-4">
                  {mockCategories
                    .map(category => {
                      const categoryArticles = mockArticles.filter(article => article.category === category.name);
                      const totalViews = categoryArticles.reduce((sum, article) => sum + article.views, 0);
                      const totalVotes = categoryArticles.reduce((sum, article) => sum + article.helpful + article.notHelpful, 0);
                      const helpfulRate = categoryArticles.length > 0 
                        ? Math.round(categoryArticles.reduce((sum, article) => sum + article.helpful, 0) / Math.max(totalVotes, 1) * 100)
                        : 0;
                      
                      return { ...category, articles: categoryArticles.length, views: totalViews, helpfulRate };
                    })
                    .sort((a, b) => b.views - a.views)
                    .map((category, index) => (
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-xl font-bold text-gray-600">#{index + 1}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.articles} articles</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-purple-700">{category.views}</div>
                            <div className="text-gray-500">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-700">{category.helpfulRate}%</div>
                            <div className="text-gray-500">Helpful</div>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((category.views / Math.max(...mockCategories.map(c => {
                                const cArticles = mockArticles.filter(article => article.category === c.name);
                                return cArticles.reduce((sum, article) => sum + article.views, 0);
                              }))) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Category Usage Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-700">
                        {mockCategories.filter(c => mockArticles.filter(a => a.category === c.name).length > 0).length}
                      </div>
                      <div className="text-sm text-gray-600">Active Categories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {Math.round(mockArticles.length / mockCategories.length)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Articles/Category</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-700">
                        {mockCategories.reduce((max, category) => {
                          const count = mockArticles.filter(a => a.category === category.name).length;
                          return count > max ? count : max;
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Most Articles</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-700">
                        {Math.round(mockCategories.reduce((sum, category) => {
                          const categoryArticles = mockArticles.filter(a => a.category === category.name);
                          const views = categoryArticles.reduce((s, a) => s + a.views, 0);
                          return sum + views;
                        }, 0) / mockCategories.length)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Views/Category</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Details Modal */}
      {showArticleDetailsModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedArticle.title}</h2>
                  <p className="text-gray-600">{selectedArticle.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowArticleDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Article Meta Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500">Author</div>
                      <div className="font-medium text-gray-900">{selectedArticle.author}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500">Updated</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500">Views</div>
                      <div className="font-medium text-gray-900">{selectedArticle.views}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-500">Read Time</div>
                      <div className="font-medium text-gray-900">
                        {Math.max(1, Math.ceil(selectedArticle.content.split(' ').length / 200))} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Summary */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Summary</h3>
                <p className="text-blue-800">{selectedArticle.summary}</p>
              </div>

              {/* Article Content */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">Helpful ({selectedArticle.helpful})</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      <ThumbsDown className="w-5 h-5" />
                      <span className="font-medium">Not Helpful ({selectedArticle.notHelpful})</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Helpfulness Rating: {Math.round((selectedArticle.helpful / (selectedArticle.helpful + selectedArticle.notHelpful)) * 100)}%
                    ({selectedArticle.helpful + selectedArticle.notHelpful} total votes)
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockArticles
                    .filter(article => 
                      article.id !== selectedArticle.id && 
                      (article.category === selectedArticle.category || 
                       article.tags.some(tag => selectedArticle.tags.includes(tag)))
                    )
                    .slice(0, 4)
                    .map((relatedArticle) => (
                      <div 
                        key={relatedArticle.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedArticle(relatedArticle);
                          // Simulate view increment for related article
                          setArticles(prev => prev.map(a => 
                            a.id === relatedArticle.id ? { ...a, views: a.views + 1 } : a
                          ));
                        }}
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {relatedArticle.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {relatedArticle.views} views
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {relatedArticle.helpful} helpful
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Comments Section (Mock) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h3>
                <div className="space-y-4">
                  {[
                    { 
                      user: 'Alice Johnson', 
                      comment: 'This article was extremely helpful! The step-by-step instructions made it easy to follow.',
                      date: '2 days ago',
                      helpful: true
                    },
                    { 
                      user: 'Bob Smith', 
                      comment: 'Great explanation of the concepts. I was able to implement this successfully.',
                      date: '1 week ago',
                      helpful: true
                    },
                    { 
                      user: 'Carol Davis', 
                      comment: 'Could use more examples for edge cases, but overall very informative.',
                      date: '2 weeks ago',
                      helpful: false
                    }
                  ].map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              comment.helpful ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {comment.helpful ? 'Found helpful' : 'Suggested improvements'}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowArticleDetailsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase; 
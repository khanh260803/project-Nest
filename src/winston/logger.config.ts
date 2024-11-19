// winston.config.ts
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

// Elasticsearch client options
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'http://localhost:9200', // Elasticsearch URL
    auth: {
      username: 'elastic', // Your Elasticsearch username
      password: 'your_password', // Your Elasticsearch password
    },
    ssl: {
      rejectUnauthorized: false, // Set to true in production
    },
  },
  indexPrefix: 'logs-app', // Prefix for the indices
  indexSuffixPattern: 'YYYY.MM.DD', // Daily indices
  messageType: 'log',
  ensureMappingTemplate: true,
  mappingTemplate: {
    index_patterns: ['logs-app-*'], // Template name
    settings: {
      number_of_shards: 1,
      number_of_replicas: 1,
      index: {
        refresh_interval: '5s',
      },
    },
    mappings: {
      dynamic_templates: [
        {
          message_field: {
            path_match: 'message',
            mapping: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
        {
          string_fields: {
            match_mapping_type: 'string',
            mapping: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
      ],
      properties: {
        '@timestamp': { type: 'date' },
        level: { type: 'keyword' },
        context: { type: 'keyword' },
        trace: { type: 'text' },
        service: { type: 'keyword' },
        environment: { type: 'keyword' },
        requestID: { type: 'keyword' }, // Add requestID field
      },
    },
  },
};

// Create Elasticsearch transport
const esTransport = new ElasticsearchTransport(esTransportOpts);

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('myApp', {
          prettyPrint: true,
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level} ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level} ${message}`;
        }),
      ),
    }),
    esTransport,
  ],
  // Add global format for all transports
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata({
      fillWith: ['service', 'environment'],
    }),
    winston.format.json(),
  ),
  // Add default metadata
  defaultMeta: {
    service: 'nest-app',
    environment: process.env.NODE_ENV || 'development',
  },
};

// Handle transport errors
esTransport.on('error', (error) => {
  console.error('Error in Elasticsearch transport', error);
});

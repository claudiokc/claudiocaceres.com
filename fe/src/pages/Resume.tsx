import React from 'react';

const Resume: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Claudio Cáceres</h1>
            <p className="text-xl">Senior Software Engineer</p>
          </div>

          {/* Contact Info */}
          <div className="p-8 border-b">
            <div className="flex flex-wrap gap-4 text-gray-600">
              <a href="mailto:catocaceres@hotmail.com" className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span property="mail">catocaceres@hotmail.com</span>
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Summary</h2>
            <p className="text-gray-600">
              Results-driven Senior Software Engineer with 10+ years of experience designing, building, and scaling full-stack applications.
              Specializes in Python (Flask, Django), JavaScript (ReactJS), cloud infrastructure (AWS, GCP), and Agile development.
              Adept at creating robust APIs, CI/CD pipelines, and performance-oriented frontends using modern frameworks and tools.
            </p>
          </div>

          {/* Experience */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Professional Experience</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Senior Software Engineer</h3>
                <p className="text-blue-600">OpenSolar • Sep 2025 - Present</p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>Backend API using Django/DRF</li>
                  <li>Frontend development with React</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Tech Stack: Django, Restframework, MySQL, React, TypeScript, AWS, Redis</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">Senior Software Engineer</h3>
                <p className="text-blue-600">Filterbuy.com • Remote • June 2023 - September 2025</p>
                <p className="text-gray-600 mb-3">E-commerce Marketplace Platform for HVAC & Air Filters</p>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>Architected and maintained multi-tenant Django-based backend system handling product management, inventory, orders, and marketplace integrations</li>
                  <li>Built modern Next.js frontend with TypeScript, implementing responsive design patterns and SEO optimization</li>
                  <li>Designed complex database models for product variants, inventory management, and multi-channel sales tracking</li>
                  <li>Integrated with 7+ major e-commerce marketplaces (Amazon SP-API, eBay, Walmart, Wayfair) and payment processors</li>
                  <li>Developed comprehensive product catalog management with SKU-based inventory tracking across multiple warehouses</li>
                  <li>Implemented automated pricing strategies and dynamic pricing algorithms for competitive marketplace positioning</li>
                  <li>Built order management system with multi-carrier shipping integration (UPS, FedEx, Amazon FBA)</li>
                  <li>Created advanced filtering and search functionality using Elasticsearch/OpenSearch</li>
                  <li>Automated inventory synchronization across all sales channels with real-time stock updates</li>
                  <li>Containerized application using Docker and implemented CI/CD pipelines with automated testing</li>
                  <li>Configured monitoring and logging using Sentry, structured logging, and health checks</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Tech Stack: Django 3.2, Next.js 14, React 18, TypeScript, PostgreSQL, Redis, Celery, Elasticsearch/OpenSearch, Docker, AWS, Nginx, Gunicorn, Memcached, REST APIs, GraphQL, Jest, Testing Library</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">Remote Software Engineer</h3>
                <p className="text-blue-600">Impel.io • October 2020 - June 2023</p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Engineered full-stack features using Flask and ReactJS</li>
                  <li>Delivered testable and maintainable code with modern testing suites (Pytest, JMeter)</li>
                  <li>Enhanced platform stability via robust CI/CD automation and Terraform infrastructure</li>
                  <li>Drove frontend consistency using TailwindCSS and Redux-based architecture</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Tech Stack: Flask, React/Redux, TailwindCSS, Docker, PostgreSQL, AWS, Sentry, Redis</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">Remote Software Engineer</h3>
                <p className="text-blue-600">Delphix • June 2019 - October 2020</p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Developed serverless backend APIs using AWS Lambda, API Gateway, and SAM</li>
                  <li>Implemented secure authentication using Okta with SAML integrations</li>
                  <li>Built interactive UIs and business logic with Angular</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Tech Stack: AWS Lambda, API Gateway, PynamoDB, Serverless Framework, Angular</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">FullStack Engineer</h3>
                <p className="text-blue-600">Laureate Education • July 2016 - June 2019</p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Created RESTful services and backend logic using Django and Google App Engine</li>
                  <li>Automated deployments and managed cloud infrastructure in GCP</li>
                  <li>Delivered dynamic frontend interfaces with AngularJS</li>
                  <li>Led SAML-based identity provider and SSO system integration</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">Tech Stack: GCP, Django/Wagtail, Google App Engine, AngularJS, Couchbase</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Frontend</h3>
                <p className="text-gray-600">React/Redux, Angular, TailwindCSS, JavaScript</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Backend</h3>
                <p className="text-gray-600">Python, Flask, Django, AWS Lambda</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Cloud & DevOps</h3>
                <p className="text-gray-600">AWS, GCP, Docker, Terraform, CI/CD</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Database</h3>
                <p className="text-gray-600">PostgreSQL, MongoDB, Couchbase, Redis</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Testing</h3>
                <p className="text-gray-600">Pytest, Selenium, JMeter</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800">Tools</h3>
                <p className="text-gray-600">Git, Pyenv, Poetry, SAM</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">B.Sc. in Computer Science Engineering</h3>
                <p className="text-blue-600">Universidad Nacional Autónoma de Honduras (UNAH), Honduras</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">React Nanodegree</h3>
                <p className="text-blue-600">Udacity</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Certifications & Courses</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Python Programming</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">ReactJS & Modern JavaScript</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Agile Methodologies</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">MongoDB & SQL</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">AWS Solutions Architect</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Microservices Design & Architecture</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Data Engineering Fundamentals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume; 
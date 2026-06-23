/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
    },
};

// Sample content data - replace with real content later
const RAW_CONTENT_DATA = [
    // ============ YouTube / Video Content ============
    {
        id: 'content-001',
        platform: 'youtube',
        title: 'AI Essay Generator with Gemini',
        description: 'Built with Google Gemini API — an AI-powered essay generator that creates well-structured content from simple prompts. Demonstrates Python integration with Google AI Studio and Gemini models.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/ai-essay-generator-with-gemini-34pc',
        date: '2026-03-03',
        views: '144',
        duration: '8 min',
    },
    {
        id: 'content-002',
        platform: 'youtube',
        title: 'PyShrink: Python Project Sanitizer',
        description: 'A VS Code extension that sanitizes and packages Python projects with POM-style architecture. Streamlines dependency management and project scaffolding for Python developers.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/pyshrink-vscode',
        date: '2026-02-07',
        views: '151',
        duration: '12 min',
    },
    {
        id: 'content-003',
        platform: 'youtube',
        title: 'Automation Framework in Python',
        description: 'A comprehensive modular test automation framework built from scratch in Python. Features POM design pattern, pytest integration, and cross-browser support.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/automation-framework-in-python',
        date: '2025-12-28',
        views: '2.4K',
        duration: '22:10',
    },
    {
        id: 'content-004',
        platform: 'youtube',
        title: 'PhoneTracer — OSINT Toolkit',
        description: 'An OSINT toolkit for extracting metadata from phone numbers using Python. Features carrier lookup, location data, and comprehensive reporting.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/phonetracer',
        date: '2025-12-15',
        views: '1.8K',
        duration: '18:33',
    },
    {
        id: 'content-005',
        platform: 'youtube',
        title: 'BDD Testing with Behave & Allure',
        description: 'Implement Behavior-Driven Development in Python using Behave framework with Allure reporting for comprehensive test documentation.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/implement-bdd-in-python-using-behave-allure-56c3',
        date: '2025-12-01',
        views: '343',
        duration: '20:15',
    },
    {
        id: 'content-006',
        platform: 'youtube',
        title: 'Building Automation with Selenium',
        description: 'Step-by-step guide to building robust browser automation scripts with Python Selenium. Covers waits, frames, alerts, and advanced selectors.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30',
        date: '2025-11-20',
        views: '2.8K',
        duration: '25:00',
    },
    {
        id: 'content-007',
        platform: 'youtube',
        title: 'Data Science Mini Projects',
        description: 'A collection of data science projects covering pandas, numpy, data visualization, and machine learning fundamentals with real-world datasets.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/Data-Science-mini-projects',
        date: '2025-11-10',
        views: '1.5K',
        duration: '30:22',
    },
    {
        id: 'content-008',
        platform: 'youtube',
        title: 'Transition from pip to uv',
        description: 'Complete guide to migrating from pip to the uv package manager. Discover 10x faster package installation and modern Python dependency management.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/transition-from-pip-to-uv-package-manager-3ike',
        date: '2025-10-28',
        views: '1.9K',
        duration: '18:45',
    },

    // ============ Blog Posts (Dev.to Articles) ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'Built with Google Gemini: AI Essay Generator',
        description: 'Step-by-step guide to building an AI-powered essay generator using Google Gemini API and Python. Covers prompt engineering, API integration, and deployment.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/ai-essay-generator-with-gemini-34pc',
        date: '2026-03-03',
        readTime: '8 min',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'Git Certificate Error Eradication',
        description: 'Quick fix for Git\'s "Error Setting Certificate File" issue. A practical troubleshooting guide with 2343+ views that\'s helped thousands of developers.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/git-certificate-error-eradication-1jkj',
        date: '2025-04-09',
        readTime: '5 min',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'BDD with Behave & Allure',
        description: 'Complete implementation guide for Behavior-Driven Development in Python using Behave framework with Allure reporting integration.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/implement-bdd-in-python-using-behave-allure-56c3',
        date: '2025-04-08',
        readTime: '10 min',
    },
    {
        id: 'blog-004',
        platform: 'blog',
        title: 'VAPT Learning Journey',
        description: 'My self-training journey in Vulnerability Assessment and Penetration Testing. Covers tools, techniques, certifications, and practical experience.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/journey-in-vapt-self-training-58k3',
        date: '2024-12-15',
        readTime: '8 min',
    },
    {
        id: 'blog-005',
        platform: 'blog',
        title: 'API Testing Automation',
        description: 'The art and science of API testing automation using Python, pytest, and requests library. Covers mocking, fixtures, and CI/CD integration.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/the-art-and-science-of-api-testing-automation-1mlg',
        date: '2023-08-19',
        readTime: '8 min',
    },
    {
        id: 'blog-006',
        platform: 'blog',
        title: 'GitHub Actions for Workflow Automation',
        description: 'Harnessing GitHub Actions for seamless CI/CD workflow automation. Covers custom actions, matrix builds, and deployment pipelines.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/harnessing-github-actions-for-seamless-workflow-automation-40kp',
        date: '2023-08-19',
        readTime: '9 min',
    },
    {
        id: 'blog-007',
        platform: 'blog',
        title: 'India\'s Cheapest Pentesting Tool',
        description: 'How to build India\'s cheapest yet most effective penetration testing tool using Arduino and BadUSB. A practical cybersecurity project.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/how-to-build-indias-cheapest-yet-most-effective-penetration-testing-tool-4m5h',
        date: '2025-12-21',
        readTime: '15 min',
    },
    {
        id: 'blog-008',
        platform: 'blog',
        title: 'Publish Your First PyPI Library',
        description: 'Complete guide to publishing your first Python package on PyPI. Covers setup.py, packaging, testing, and version management.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30/guide-to-publish-your-first-pypi-library-1bnh',
        date: '2026-02-08',
        readTime: '10 min',
    },

    // ============ Social Content (Instagram/Twitter) ============
    {
        id: 'social-001',
        platform: 'tiktok',
        title: 'Automation Engineer Life 🚀',
        description: 'Day in the life of a Senior Automation Engineer — Python, Selenium, AI tools, and a whole lot of debugging. Behind the scenes at Happiest Minds.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: 'https://www.instagram.com/nitinkumar30.py/',
        date: '2026-06-20',
        views: '15.2K',
        likes: '1.2K',
    },
    {
        id: 'social-002',
        platform: 'tiktok',
        title: 'Python Automation Magic 🐍',
        description: 'Watch how I automate boring stuff with Python. From file organization to browser automation — Python makes it all possible!',
        thumbnail: null,
        url: 'https://www.instagram.com/nitinkumar30.py/',
        date: '2026-06-15',
        views: '8.5K',
        likes: '756',
    },
    {
        id: 'social-003',
        platform: 'tiktok',
        title: 'AI Prompt Engineering Tips 🎯',
        description: 'The art of crafting perfect prompts for ChatGPT, Claude, and Gemini. Tips that actually work for better AI outputs.',
        thumbnail: null,
        url: 'https://twitter.com/nitinkumar30',
        date: '2026-06-10',
        views: '22.1K',
        likes: '3.4K',
    },
    {
        id: 'social-004',
        platform: 'tiktok',
        title: 'Selenium vs Playwright ⚔️',
        description: 'Comparing two of the biggest browser automation frameworks. Speed, reliability, and features showdown!',
        thumbnail: null,
        url: 'https://twitter.com/nitinkumar30',
        date: '2026-06-05',
        views: '12.3K',
        likes: '1.1K',
    },
    {
        id: 'social-005',
        platform: 'tiktok',
        title: 'Git Tips Every Dev Needs 🔥',
        description: 'Git commands and workflows that will save you hours. From rebase to cherry-pick, master the essentials.',
        thumbnail: null,
        url: 'https://twitter.com/nitinkumar30',
        date: '2026-05-28',
        views: '45.2K',
        likes: '5.8K',
    },
    {
        id: 'social-006',
        platform: 'tiktok',
        title: 'Open Source Contributions 🗂️',
        description: 'How I maintain 227+ GitHub repos with 160+ stars. Tips for effective open source contribution and repo management.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30',
        date: '2026-05-20',
        views: '18.7K',
        likes: '2.1K',
    },
    {
        id: 'social-007',
        platform: 'tiktok',
        title: 'Cyber Security Basics 💀',
        description: 'Essential cybersecurity concepts every developer should know. From OSINT to network security — stay safe out there!',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30',
        date: '2026-05-15',
        views: '33.4K',
        likes: '4.2K',
    },
    {
        id: 'social-008',
        platform: 'tiktok',
        title: 'Automation Frameworks ⚡',
        description: 'Building scalable automation frameworks from scratch. My architecture patterns and best practices for test automation.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/automation-framework-in-python',
        date: '2026-05-08',
        views: '28.9K',
        likes: '3.6K',
    },
    {
        id: 'social-009',
        platform: 'tiktok',
        title: 'Dev.to Writing Journey 📝',
        description: 'How I grew my Dev.to blog from 0 to thousands of views. Tips for technical writing and building an audience.',
        thumbnail: null,
        url: 'https://dev.to/nitinkumar30',
        date: '2026-05-01',
        views: '19.3K',
        likes: '2.4K',
    },
    {
        id: 'social-010',
        platform: 'tiktok',
        title: 'CI/CD Pipeline Setup 🔄',
        description: 'Setting up automated CI/CD pipelines with GitHub Actions. From testing to deployment in minutes!',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30',
        date: '2026-04-25',
        views: '41.2K',
        likes: '5.1K',
    },
    {
        id: 'social-011',
        platform: 'tiktok',
        title: 'Data Science for Devs 📊',
        description: 'Pandas, NumPy, and data viz tips for developers transitioning into data science. Practical examples included!',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/Data-Science-mini-projects',
        date: '2026-04-18',
        views: '25.6K',
        likes: '3.0K',
    },
    {
        id: 'social-012',
        platform: 'tiktok',
        title: 'VS Code Power User Tips 🖥️',
        description: 'VS Code extensions and shortcuts that supercharge your productivity. From Python to TypeScript development.',
        thumbnail: null,
        url: 'https://github.com/nitinkumar30/pyshrink-vscode',
        date: '2026-04-10',
        views: '31.8K',
        likes: '4.0K',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};

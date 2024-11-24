export interface DesignTemplate {
    title: string;
    description: string;
    prompt: string;
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
    {
        title: 'Social Media Platform',
        description: 'Design a scalable platform with features like posts, comments, and real-time updates',
        prompt: 'Design a social media platform that can handle millions of users, with features like posts, comments, and real-time notifications'
    },
    {
        title: 'E-commerce System',
        description: 'Design an online shopping platform with product catalog and payments',
        prompt: 'Design an e-commerce system with product listings, shopping cart, and payment processing'
    },
    {
        title: 'Video Streaming',
        description: 'Design a video platform like Netflix or YouTube',
        prompt: 'Design a video streaming service with content delivery and recommendations'
    },
    {
        title: 'Ride-Sharing',
        description: 'Design a ride-hailing service like Uber or Lyft',
        prompt: 'Design a ride-sharing platform with real-time matching and location tracking'
    },
    {
        title: 'Cloud Storage',
        description: 'Design a file storage and sharing system like Dropbox',
        prompt: 'Design a cloud storage system with file sync and sharing capabilities'
    },
    {
        title: 'IoT Platform',
        description: 'Design an Internet of Things data collection and analysis system',
        prompt: 'Design an IoT platform that can handle device management and real-time data processing'
    },
    {
        title: 'Payment Gateway',
        description: 'Design a payment processing system',
        prompt: 'Design a payment gateway that can handle various payment methods and high transaction volumes'
    },
    {
        title: 'Chat Application',
        description: 'Design a real-time messaging platform',
        prompt: 'Design a chat application with support for one-on-one and group messaging'
    }
];

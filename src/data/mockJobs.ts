import { Job } from '@/types/job';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'Bangalore, India',
    experience: '3-5 years',
    salary: '₹15-25 LPA',
    datePosted: new Date('2025-10-24'),
    jobType: 'Full-time',
    description: 'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building and maintaining user interfaces for our web applications.',
    requirements: [
      'Strong proficiency in React, TypeScript, and modern JavaScript',
      '3+ years of experience in frontend development',
      'Experience with state management (Redux, Zustand, etc.)',
      'Knowledge of responsive design and CSS frameworks',
      'Good understanding of REST APIs and async operations'
    ],
    responsibilities: [
      'Develop new user-facing features using React',
      'Build reusable components and front-end libraries',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with backend developers and designers',
      'Ensure technical feasibility of UI/UX designs'
    ],
    benefits: ['Health Insurance', 'Work from Home', 'Flexible Hours', 'Learning Budget'],
    contactEmail: 'careers@techcorp.com',
    contactWhatsApp: '+91-9876543210'
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'DesignHub Inc.',
    location: 'Mumbai, India',
    experience: '2-4 years',
    salary: '₹10-18 LPA',
    datePosted: new Date('2025-10-25'),
    jobType: 'Full-time',
    description: 'Join our creative team as a UI/UX Designer and help craft beautiful, intuitive user experiences for our digital products.',
    requirements: [
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Strong portfolio demonstrating UI/UX design skills',
      'Understanding of user-centered design principles',
      'Experience with prototyping and wireframing',
      'Knowledge of HTML/CSS is a plus'
    ],
    responsibilities: [
      'Create user-centered designs for web and mobile applications',
      'Conduct user research and usability testing',
      'Develop wireframes, prototypes, and high-fidelity mockups',
      'Collaborate with developers to ensure design implementation',
      'Maintain and evolve design systems'
    ],
    benefits: ['Creative Environment', 'Latest Tools', 'Team Outings'],
    contactEmail: 'hr@designhub.com',
    contactWhatsApp: '+91-9876543211'
  },
  {
    id: '3',
    title: 'Full Stack Developer Intern',
    company: 'StartupXYZ',
    location: 'Delhi, India',
    experience: '0-1 years',
    salary: '₹20,000-30,000/month',
    datePosted: new Date('2025-10-26'),
    jobType: 'Internship',
    description: 'Looking for passionate interns to join our team and work on real-world projects. Great learning opportunity for fresh graduates.',
    requirements: [
      'Basic knowledge of web development (HTML, CSS, JavaScript)',
      'Familiarity with React or Vue.js',
      'Understanding of databases (SQL/NoSQL)',
      'Good problem-solving skills',
      'Eagerness to learn and adapt'
    ],
    responsibilities: [
      'Assist in developing web applications',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Learn from senior developers',
      'Contribute to team projects'
    ],
    benefits: ['Mentorship', 'Certificate', 'Pre-Placement Offer'],
    contactEmail: 'intern@startupxyz.com',
    contactWhatsApp: '+91-9876543212'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'Hyderabad, India',
    experience: '4-7 years',
    salary: '₹20-35 LPA',
    datePosted: new Date('2025-10-23'),
    jobType: 'Full-time',
    description: 'Seeking an experienced DevOps Engineer to manage our cloud infrastructure and implement CI/CD pipelines.',
    requirements: [
      'Strong experience with AWS/Azure/GCP',
      'Proficiency in Docker and Kubernetes',
      'Experience with CI/CD tools (Jenkins, GitLab CI)',
      'Knowledge of infrastructure as code (Terraform, Ansible)',
      'Strong scripting skills (Python, Bash)'
    ],
    responsibilities: [
      'Manage and optimize cloud infrastructure',
      'Implement and maintain CI/CD pipelines',
      'Monitor system performance and reliability',
      'Automate deployment processes',
      'Ensure security best practices'
    ],
    benefits: ['Remote Work', 'Stock Options', 'Conference Budget'],
    contactEmail: 'devops@cloudscale.com',
    contactWhatsApp: '+91-9876543213'
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'Pune, India',
    experience: '5-8 years',
    salary: '₹25-40 LPA',
    datePosted: new Date('2025-10-22'),
    jobType: 'Full-time',
    description: 'Lead product strategy and execution for our SaaS platform. Work with cross-functional teams to deliver exceptional products.',
    requirements: [
      '5+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with Agile methodologies',
      'Excellent communication skills',
      'Technical background preferred'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Gather and prioritize requirements',
      'Work with engineering and design teams',
      'Conduct market research and analysis',
      'Track and analyze product metrics'
    ],
    benefits: ['Equity', 'Flexible Hours', 'Health Insurance'],
    contactEmail: 'pm@innovatelabs.com',
    contactWhatsApp: '+91-9876543214'
  },
  {
    id: '6',
    title: 'Backend Developer',
    company: 'DataFlow Technologies',
    location: 'Chennai, India',
    experience: '2-5 years',
    salary: '₹12-22 LPA',
    datePosted: new Date('2025-10-25'),
    jobType: 'Full-time',
    description: 'Join our backend team to build scalable APIs and services that power our applications.',
    requirements: [
      'Strong proficiency in Node.js or Python',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of RESTful API design',
      'Understanding of microservices architecture',
      'Familiarity with cloud services'
    ],
    responsibilities: [
      'Design and develop backend APIs',
      'Optimize database queries and performance',
      'Implement security best practices',
      'Write unit and integration tests',
      'Collaborate with frontend developers'
    ],
    benefits: ['Work from Home', 'Learning Budget', 'Team Events'],
    contactEmail: 'backend@dataflow.com',
    contactWhatsApp: '+91-9876543215'
  }
];

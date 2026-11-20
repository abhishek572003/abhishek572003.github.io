// All site text lives here. Edit this file to update the website.

export const person = {
  name: 'Abhishek Sunil Tiwari',
  first: 'Abhishek',
  last: 'Tiwari',
  role: 'Cloud and edge systems security',
  status: 'Prospective Ph.D. student · Fall 2027',
  email: 'abhishekst5703@gmail.com',
  cv: 'assets/Abhishek_Tiwari_Academic_CV.pdf',
  github: 'https://github.com/abhishek572003',
  linkedin: 'https://www.linkedin.com/in/abhishek-tiwari05/',
  photo: 'assets/abhishek.jpg',
  location: 'Mumbai, India',
  now: 'Analyst at Capgemini. Running a study on security misconfigurations in AI-agent-written infrastructure code.',
};

export const intro =
  'I study how distributed systems stay trustworthy when identity, policy and telemetry are spread across many services, from the cloud down to small edge devices. Before research, I configured access control, TLS and deployment pipelines for production AWS workloads, and that work kept raising one question: when a single identity or configuration decision can affect both security and availability, how do we notice when something has gone wrong?';

export const research = {
  question:
    'Do AI coding agents introduce more cloud security misconfigurations than people do when they change infrastructure code?',
  context:
    'Coding agents now open a growing share of pull requests on GitHub, including changes to Terraform and Kubernetes files that decide who can reach what. Recent work compared agent and human infrastructure changes for maintainability, but not for security.',
  method: [
    ['Find', 'Agent-authored pull requests that change .tf or Kubernetes YAML, each matched with human changes in the same repository.'],
    ['Rebuild', 'Every changed file at the base commit and the head commit.'],
    ['Scan', 'Checkov and KICS on both versions. Only checks that fail after the change count as introduced.'],
    ['Compare', 'Hand-label a sample for false positives, then compare matched pairs by category: IAM, network exposure, encryption, container privilege.'],
  ],
  log: [
    { date: '21 Nov 2026', text: 'Framed the question after reviewing 13 papers. The closest prior study measured maintainability smells only.' },
    { date: '21 Nov 2026', text: 'Pilot pipeline runs end to end on 9 pull requests. Too small for conclusions; showed that matching on change size is needed.' },
    { date: 'Dec 2026', text: 'Next: scale to 500+ agent pull requests, add Kubernetes manifests and a second scanner.', next: true },
    { date: 'Feb 2027', text: 'Goal: a preprint with code and data released.', next: true },
  ],
  note: 'No results yet. This log is updated as the study progresses.',
};

export const interests = [
  { layer: 'identity layer', title: 'Workload identity and access control', text: 'Service identity and least privilege in containerized and serverless platforms.' },
  { layer: 'configuration', title: 'Misconfiguration and policy drift', text: 'How infrastructure-as-code and cluster settings drift into insecure states, and who introduces the drift.' },
  { layer: 'links + packets', title: 'Telemetry-driven detection', text: 'Correlating flows, deployment events and traces to find credential misuse and lateral movement.' },
  { layer: 'edge devices', title: 'Adaptive security at the edge', text: 'Continual anomaly detection for cloud-connected IoT under tight compute and network limits.' },
];

export const experience = [
  { when: 'Sep 2025 – now', role: 'Analyst, Digital Analytics', org: 'Capgemini', place: 'Mumbai', text: 'Digital analytics and customer-data workflows with Adobe Analytics, Adobe Experience Platform, Adobe Journey Optimizer and Google Analytics 4. Role-based training in Python and Microsoft Azure.' },
  { when: 'Jun – Aug 2025', role: 'Cloud and DevOps Engineer (freelance)', org: 'SearchHR', place: 'Remote', text: 'Designed the AWS architecture for a multi-tenant HR platform: ECS Fargate, Cognito, RDS, CloudWatch, with CodePipeline and CloudFormation delivery. Worked through trade-offs between tenant isolation, authentication, availability and cost.' },
  { when: 'Feb – May 2024', role: 'Cloud Infrastructure Trainee', org: 'Serendib Trading and Properties', place: 'Mumbai', text: 'Configured IAM roles, security groups, SSL/TLS, load balancing, and backup and recovery for AWS EC2 workloads. Diagnosed deployment issues by correlating application logs, network behaviour and infrastructure state.' },
];

export const projects = [
  { name: 'Surveillance drone', year: '2023', kind: 'Edge cyber-physical system', text: 'KK2.1.5 flight controller and ESP32 camera with Python/OpenCV interfaces. Semester IV team project that showed how thin the trust boundary is on small edge devices.', link: 'https://github.com/abhishek572003/Surveillance-Drone' },
  { name: 'CyberStorm', year: '2025', kind: 'Security education', text: 'Modular Django capture-the-flag platform used to run a campus security event: challenges, users and scoring.', link: 'https://github.com/abhishek572003/cyberstorm_ctf' },
  { name: 'Multi-tenant platform on AWS', year: '2025', kind: 'Access control and isolation', text: 'Containerized deployment for SearchHR, where one IAM or network decision changes what every tenant can reach.' },
  { name: 'Blockchain security model', year: '2024', kind: 'Semester VI mini project', text: 'A blockchain-based security model built in the cryptography and blockchain course sequence.' },
  { name: 'Serverless to-do on AWS', year: '2024', kind: 'Infrastructure as code', text: 'Lambda, DynamoDB, Cognito and CloudFront, defined with AWS SAM and deployed through GitHub Actions.', link: 'https://github.com/abhishek572003/todo-app-aws' },
  { name: 'Container CI/CD pipeline', year: '2024', kind: 'Delivery', text: 'React–Django application containerized with Docker, delivered through Jenkins to Kubernetes.', link: 'https://github.com/abhishek572003/react_django_demo_app' },
  { name: 'VR for Autism Spectrum Disorder', year: '2025', kind: 'Final-year project', text: 'Team of four, advised by Dr. Sulochana Madachane, SIES GST.' },
];

export const community = [
  { when: '2023 – now', role: 'Cloud Computing Lead', org: 'Google Developer Student Clubs, then GDG on Campus, SIES GST', text: 'Started the chapter’s first cloud domain. Taught workshops for 200+ students on Linux, Git, Kubernetes, serverless and three-tier architecture, ran a 30-day Google Cloud bootcamp, and co-led a cloud and web security event with hands-on capture-the-flag exercises.', figure: '200+', figureLabel: 'students taught' },
  { when: '2024', role: 'Facilitator, Generative AI Study Jams', org: 'Google Cloud, SIES GST cohort', text: 'Planned doubt-solving sessions and lab marathons; the campus reached the Tier 2 milestone.', figure: '60', figureLabel: 'participants completed' },
  { when: 'Mar 2025 – now', role: 'Google Cloud Arcade Facilitator', org: 'Google Cloud Arcade Facilitator Program', text: 'Mentor participants from any college or background through hands-on Google Cloud labs and skill badges.' },
];

export const education = {
  degree: 'Bachelor of Engineering, Computer Science and Engineering',
  spec: 'Internet of Things and Cyber Security, including Blockchain Technology',
  school: 'SIES Graduate School of Technology (Autonomous), University of Mumbai',
  when: '2021 – 2025',
  grade: 'CGPI 7.89 / 10',
  trend: 'Final-year SGPI 8.32 and 8.35',
  coursework: 'Cryptography and Network Security · Ethical Hacking and Digital Forensics · Penetration Testing · DevSecOps · Computer Networks · Operating Systems · Edge/Fog Computing · IoT Architecture and Protocols',
  certs: ['Claude Certified Architect – Foundations, Anthropic (2026)', 'Microsoft Azure Fundamentals AZ-900 (2026)', 'Google Cloud Platform Fundamentals (2023)'],
};

export const timeline = [
  ['2019', 'Secondary school (SSC), Chandresh Lodha Memorial School, Mumbai · 85.20%'],
  ['2021', 'Higher secondary (HSC), Pragati College · 87.50%'],
  ['2021', 'Started B.E. in Computer Science (IoT and Cyber Security), SIES GST'],
  ['2022', 'Indigo Squad member, Mood Indigo, IIT Bombay'],
  ['2023', 'Built the surveillance drone · Semester IV team project'],
  ['2023', 'Became Cloud Computing Lead, Google Developer Student Clubs'],
  ['2023', 'Smart India Hackathon · Google Cloud Platform Fundamentals'],
  ['2024', 'Cloud Infrastructure Trainee, Serendib Trading and Properties'],
  ['2024', 'Serverless and CI/CD projects on AWS · Google Solution Challenge'],
  ['2024', 'Facilitator, Google Cloud GenAI Study Jams · campus reached Tier 2'],
  ['2025', 'Google Cloud Arcade Facilitator'],
  ['2025', 'CyberStorm capture-the-flag platform'],
  ['2025', 'Graduated, B.E. CSE · CGPI 7.89'],
  ['2025', 'Freelance: SearchHR multi-tenant platform on AWS'],
  ['2025', 'Joined Capgemini as Analyst'],
  ['2026', 'AZ-900 · Claude Certified Architect – Foundations'],
  ['2026', 'Started the study on AI-agent-written infrastructure code'],
  ['2027', 'Applying to Ph.D. programs in Computer Science', true],
];

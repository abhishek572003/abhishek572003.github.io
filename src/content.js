// All site text and links live here. Edit this file to update the website.
const li = (id) => `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;

export const person = {
  name: 'Abhishek Sunil Tiwari',
  short: 'Abhishek Tiwari',
  email: 'abhishekst5703@gmail.com',
  cv: 'assets/Abhishek_Tiwari_Academic_CV.pdf',
  github: 'https://github.com/abhishek572003',
  linkedin: 'https://www.linkedin.com/in/abhishek-tiwari05/',
  photo: 'assets/abhishek.jpg',
  location: 'Mumbai, India',
  status: 'Applying for a Ph.D. in Computer Science · Fall 2027',
  headline: ['I build cloud', 'infrastructure,', 'and I want to know', 'how it breaks.'],
  intro:
    'Cloud and DevOps engineer, community teacher and builder from Mumbai. I have shipped AWS platforms, taught 200+ students how the cloud works, and built two live learning products. Next: a Ph.D. on the security of cloud and edge systems.',
};

export const ticker = ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Linux', 'Python', 'Google Cloud', 'Azure', 'Jenkins', 'GitHub Actions', 'IAM', 'CI/CD', 'IoT', 'Security'];

export const stats = [
  { value: 200, suffix: '+', label: 'students taught in cloud workshops' },
  { value: 2, suffix: '', label: 'live products built and shipped' },
  { value: 3, suffix: '', label: 'Google Cloud community roles' },
  { value: 60, suffix: '', label: 'GenAI Study Jams finishers I facilitated' },
];

export const work = [
  {
    name: 'KultKloud',
    year: '2026',
    tag: 'Live product',
    what: 'A free, game-style learning path for Cloud, DevOps and AI infrastructure. Pick a job, follow the quest, earn XP, with curated free videos and docs in the right order.',
    stack: ['Next.js', 'Vercel', 'Content design'],
    img: 'img/kultkloud.webp',
    links: [['Visit live site', 'https://abhi-kultkloud.vercel.app'], ['Code', 'https://github.com/abhishek572003/abhi-kultkloud']],
  },
  {
    name: 'CheatCode',
    year: '2026',
    tag: 'Live prototype',
    what: 'Know your fit before you apply. A tech-jobs prototype for Indian freshers with skill matching, a gap-and-prep plan for every role, and a Scam Shield for fake offers.',
    stack: ['React', 'TypeScript', 'Vite', 'Vitest'],
    img: 'img/cheatcode.webp',
    links: [['Visit live site', 'https://getcheatcode.vercel.app']],
  },
  {
    name: 'Surveillance drone',
    year: '2023',
    tag: 'Edge hardware',
    what: 'Built from scratch with a team of four: KK2.1.5 flight controller, brushless motors and an ESP32 camera module, with Python/OpenCV control. My first look at how thin security is on small edge devices.',
    stack: ['ESP32', 'Python', 'OpenCV', 'KK2.1.5'],
    img: 'img/drone.webp',
    tall: true,
    links: [['Code and report', 'https://github.com/abhishek572003/Surveillance-Drone'], ['The story', li('7228606124332052480')]],
  },
  {
    name: 'CyberStorm CTF',
    year: '2025',
    tag: 'Security education',
    what: 'A capture-the-flag platform for a campus security event, built in Django with separate modules for users, challenges and scoring.',
    stack: ['Django', 'Python', 'CTF design'],
    art: 'ctf',
    links: [['Code', 'https://github.com/abhishek572003/cyberstorm_ctf']],
  },
  {
    name: 'SearchHR on AWS',
    year: '2025',
    tag: 'Freelance · cloud architecture',
    what: 'Designed the AWS setup for a multi-tenant HR platform: containers on ECS Fargate, Cognito sign-in, RDS, CloudWatch, and a CodePipeline delivery flow. Every IAM and network choice decided what each tenant could reach.',
    stack: ['ECS Fargate', 'Cognito', 'RDS', 'CloudFormation'],
    art: 'arch',
  },
  {
    name: 'VR training for CBRN response',
    year: '2024',
    tag: 'Hackathon · Team Illusion',
    what: 'A 360° virtual-reality drill for chemical-emergency response teams: assess casualties, set a safety perimeter, and report to command, with choices that change the outcome.',
    stack: ['VR', 'Scenario design'],
    art: 'vr',
    links: [['Code', 'https://github.com/abhishek572003/Virtual-Reality-Based-Training-for-CBRN-Disaster-Response-Team-Name--ILLUSION-']],
  },
];

export const research = {
  title: 'What I want to research',
  lead: 'How do cloud and edge systems stay secure when identity, configuration and telemetry are spread across many services?',
  areas: ['Workload identity and access control', 'Misconfiguration and policy drift', 'Attack detection from telemetry', 'Security for edge and IoT devices'],
  now: {
    label: 'Study in progress',
    text: 'Do AI coding agents add more security mistakes than people when they change Terraform and Kubernetes code? I am collecting and scanning real GitHub pull requests to find out.',
    status: 'Pilot running since 21 Nov 2026 · no results yet · preprint planned for early 2027',
  },
};

export const experience = [
  { when: 'Sep 2025 – now', role: 'Analyst, Digital Analytics', org: 'Capgemini', url: 'https://www.capgemini.com', text: 'Customer-data and analytics workflows with Adobe Analytics, Adobe Experience Platform, Journey Optimizer and Google Analytics 4.' },
  { when: 'Jun – Aug 2025', role: 'Cloud & DevOps Engineer · freelance', org: 'SearchHR', text: 'AWS architecture and delivery pipeline for a multi-tenant HR platform.' },
  { when: 'Feb – May 2024', role: 'Cloud Infrastructure Trainee', org: 'Serendib Trading & Properties', text: 'EC2, IAM roles, security groups, TLS, load balancing, backups and CI/CD for Project Jarwiz.' },
];

export const teaching = {
  title: 'I teach what I learn',
  text: 'Since 2023 I have led the cloud track of the Google developer community at my college, then kept facilitating Google Cloud programs after graduating.',
  photos: [
    { img: 'img/talk-k8s.webp', caption: 'Talking Kubernetes at the Hacktoberfest 2023 intro session', href: li('7128946951311568896') },
    { img: 'img/workshop.webp', caption: 'First GDSC cloud session: about 60 students, Sept 2023', href: li('7111914717362712576') },
    { img: 'img/security-event.webp', caption: 'Cloud and web security event with hands-on CTF exercises', href: li('7160677251846488064') },
  ],
  roles: [
    { when: '2023 – now', role: 'Cloud Computing Lead', org: 'GDSC → GDG on Campus, SIES GST', href: li('7220993490401296384'), text: 'Started the chapter’s first cloud domain; workshops, a 30-day Google Cloud bootcamp and a cloud security event.' },
    { when: '2024', role: 'Facilitator, GenAI Study Jams', org: 'Google Cloud', href: li('7310503282181865472'), text: 'Took the campus to the Tier 2 milestone with 60 finishers.' },
    { when: '2025 – now', role: 'Google Cloud Arcade Facilitator', org: 'Google Cloud', href: li('7313592624584515584'), text: 'Mentoring anyone, from any college, through hands-on Google Cloud labs.' },
  ],
};

export const credentials = {
  degree: { title: 'B.E. Computer Science and Engineering', sub: 'IoT and Cyber Security, incl. Blockchain Technology', school: 'SIES Graduate School of Technology, University of Mumbai', url: 'https://siesgst.edu.in', when: '2021 – 2025', grade: 'CGPI 7.89 · final-year SGPI 8.32 and 8.35', project: 'Final-year project: VR-based solution for Autism Spectrum Disorder, guided by Dr. Sulochana Madachane' },
  certs: [
    { name: 'Claude Certified Architect – Foundations', by: 'Anthropic', year: '2026', href: 'https://www.credly.com/badges/3fdc28ea-2105-4735-9b37-d763a17072ef', verify: 'Verify on Credly' },
    { name: 'Azure Fundamentals (AZ-900)', by: 'Microsoft', year: '2026', href: li('7460169583874961408'), verify: 'See post' },
    { name: 'Google Cloud Platform Fundamentals', by: 'Google Cloud', year: '2023' },
  ],
};

export const journey = [
  ['2021', 'Started B.E. in CSE (IoT & Cyber Security) at SIES GST'],
  ['2022', 'Indigo Squad, Mood Indigo, IIT Bombay'],
  ['2023', 'Built a surveillance drone · became GDSC Cloud Lead · first Kubernetes talk'],
  ['2024', 'Cloud internship · VR hackathon · GenAI Study Jams facilitator'],
  ['2025', 'Graduated · Arcade Facilitator · CyberStorm CTF · joined Capgemini'],
  ['2026', 'Shipped KultKloud and CheatCode · started my first research study'],
  ['2027', 'Ph.D. in Computer Science, if you will have me'],
];

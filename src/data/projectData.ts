
import { Project, TeamMember } from "@/types/project";

// Sample team members data
export const teamMembers: TeamMember[] = [
  { id: "user-1", name: "Alex Johnson", role: "Frontend Lead" },
  { id: "user-2", name: "Taylor Kim", role: "UI/UX Designer" },
  { id: "user-3", name: "Jordan Chen", role: "Backend Developer" },
  { id: "user-4", name: "Mira Patel", role: "Full Stack Developer" },
  { id: "user-5", name: "Sam Rodriguez", role: "Mobile Developer" },
  { id: "user-6", name: "Riley Singh", role: "Backend Developer" },
  { id: "user-7", name: "Casey Williams", role: "Data Engineer" },
  { id: "user-8", name: "Morgan Lee", role: "DevOps Engineer" },
  { id: "user-9", name: "Jamie Garcia", role: "QA Engineer" },
];

// Sample project data
export const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-commerce Platform",
    description: "A modern e-commerce platform with product catalog, cart functionality, and secure checkout.",
    progress: 65,
    repository: "https://github.com/example/ecommerce-platform",
    technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    team: [
      { id: "user-1", name: "Alex Johnson", role: "Frontend Lead" },
      { id: "user-2", name: "Taylor Kim", role: "UI/UX Designer" },
      { id: "user-3", name: "Jordan Chen", role: "Backend Developer" },
      { id: "user-4", name: "Mira Patel", role: "Full Stack Developer" },
    ],
    lastUpdated: "2023-10-15T14:30:00Z",
    structure: [
      {
        id: "folder-1",
        name: "src",
        type: "folder",
        expanded: true,
        children: [
          {
            id: "folder-2",
            name: "components",
            type: "folder",
            expanded: true,
            children: [
              { id: "file-1", name: "Header.tsx", type: "file", extension: "tsx", size: "2.4 KB" },
              { id: "file-2", name: "Footer.tsx", type: "file", extension: "tsx", size: "1.8 KB" },
              { id: "file-3", name: "ProductCard.tsx", type: "file", extension: "tsx", size: "3.2 KB" },
              { id: "file-4", name: "Cart.tsx", type: "file", extension: "tsx", size: "4.6 KB" },
            ],
          },
          {
            id: "folder-3",
            name: "pages",
            type: "folder",
            expanded: true,
            children: [
              { id: "file-5", name: "Home.tsx", type: "file", extension: "tsx", size: "2.9 KB" },
              { id: "file-6", name: "Product.tsx", type: "file", extension: "tsx", size: "5.1 KB" },
              { id: "file-7", name: "Checkout.tsx", type: "file", extension: "tsx", size: "7.3 KB" },
            ],
          },
          {
            id: "folder-4",
            name: "utils",
            type: "folder",
            expanded: false,
            children: [
              { id: "file-8", name: "api.ts", type: "file", extension: "ts", size: "1.5 KB" },
              { id: "file-9", name: "helpers.ts", type: "file", extension: "ts", size: "0.9 KB" },
            ],
          },
          { id: "file-10", name: "App.tsx", type: "file", extension: "tsx", size: "1.7 KB" },
          { id: "file-11", name: "index.tsx", type: "file", extension: "tsx", size: "0.8 KB" },
        ],
      },
      {
        id: "folder-5",
        name: "public",
        type: "folder",
        expanded: false,
        children: [
          { id: "file-12", name: "index.html", type: "file", extension: "html", size: "0.6 KB" },
          { id: "file-13", name: "favicon.ico", type: "file", extension: "ico", size: "4.3 KB" },
        ],
      },
      { id: "file-14", name: "package.json", type: "file", extension: "json", size: "1.2 KB" },
      { id: "file-15", name: "tsconfig.json", type: "file", extension: "json", size: "0.5 KB" },
      { id: "file-16", name: "README.md", type: "file", extension: "md", size: "3.8 KB" },
    ],
  },
  {
    id: "proj-2",
    name: "Mobile Banking App",
    description: "A secure mobile banking application with transaction history, bill payments, and account management.",
    progress: 40,
    repository: "https://github.com/example/mobile-banking",
    technologies: ["React Native", "Express", "PostgreSQL", "Redux"],
    team: [
      { id: "user-3", name: "Jordan Chen", role: "Tech Lead" },
      { id: "user-5", name: "Sam Rodriguez", role: "Mobile Developer" },
      { id: "user-6", name: "Riley Singh", role: "Backend Developer" },
    ],
    lastUpdated: "2023-10-12T09:15:00Z",
    structure: [
      {
        id: "folder-6",
        name: "src",
        type: "folder",
        expanded: true,
        children: [
          {
            id: "folder-7",
            name: "screens",
            type: "folder",
            expanded: true,
            children: [
              { id: "file-17", name: "Login.js", type: "file", extension: "js", size: "3.2 KB" },
              { id: "file-18", name: "Dashboard.js", type: "file", extension: "js", size: "4.8 KB" },
              { id: "file-19", name: "Transactions.js", type: "file", extension: "js", size: "6.1 KB" },
            ],
          },
          {
            id: "folder-8",
            name: "components",
            type: "folder",
            expanded: false,
            children: [
              { id: "file-20", name: "Header.js", type: "file", extension: "js", size: "1.5 KB" },
              { id: "file-21", name: "TransactionItem.js", type: "file", extension: "js", size: "2.3 KB" },
            ],
          },
          { id: "file-22", name: "App.js", type: "file", extension: "js", size: "1.2 KB" },
          { id: "file-23", name: "Navigation.js", type: "file", extension: "js", size: "1.9 KB" },
        ],
      },
      { id: "file-24", name: "package.json", type: "file", extension: "json", size: "1.4 KB" },
      { id: "file-25", name: "babel.config.js", type: "file", extension: "js", size: "0.3 KB" },
    ],
  },
  {
    id: "proj-3",
    name: "Analytics Dashboard",
    description: "A data visualization dashboard with interactive charts and filterable metrics for business intelligence.",
    progress: 90,
    repository: "https://github.com/example/analytics-dashboard",
    technologies: ["Vue.js", "D3.js", "Flask", "PostgreSQL"],
    team: [
      { id: "user-7", name: "Casey Williams", role: "Data Engineer" },
      { id: "user-8", name: "Morgan Lee", role: "Frontend Developer" },
      { id: "user-9", name: "Jamie Garcia", role: "Backend Developer" },
    ],
    lastUpdated: "2023-10-08T16:45:00Z",
    structure: [
      {
        id: "folder-9",
        name: "src",
        type: "folder",
        expanded: true,
        children: [
          {
            id: "folder-10",
            name: "components",
            type: "folder",
            expanded: true,
            children: [
              { id: "file-26", name: "BarChart.vue", type: "file", extension: "vue", size: "4.2 KB" },
              { id: "file-27", name: "LineChart.vue", type: "file", extension: "vue", size: "5.7 KB" },
              { id: "file-28", name: "Dashboard.vue", type: "file", extension: "vue", size: "3.1 KB" },
            ],
          },
          { id: "file-29", name: "App.vue", type: "file", extension: "vue", size: "1.3 KB" },
          { id: "file-30", name: "main.js", type: "file", extension: "js", size: "0.7 KB" },
        ],
      },
      {
        id: "folder-11",
        name: "server",
        type: "folder",
        expanded: false,
        children: [
          { id: "file-31", name: "app.py", type: "file", extension: "py", size: "2.9 KB" },
          { id: "file-32", name: "models.py", type: "file", extension: "py", size: "1.8 KB" },
          { id: "file-33", name: "routes.py", type: "file", extension: "py", size: "3.5 KB" },
        ],
      },
      { id: "file-34", name: "package.json", type: "file", extension: "json", size: "1.1 KB" },
      { id: "file-35", name: "requirements.txt", type: "file", extension: "txt", size: "0.4 KB" },
    ],
  },
];

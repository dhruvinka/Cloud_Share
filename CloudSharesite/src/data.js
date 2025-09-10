import { CreditCard, Files, LayoutDashboard, Receipt, UploadCloud } from "lucide-react";
import Upload from "./pages/Upload";

export const features = [
  {
    iconName: "ArrowUpCircle",
    iconColor: "text-purple-500",
    title: "Easy File Upload",
    description: "Quickly upload your files with our intuitive drag-and-drop interface."
  },
  {
    iconName: "Shield",
    iconColor: "text-green-500",
    title: "Secure Storage",
    description: "Your files are encrypted and stored securely in our cloud infrastructure."
  },
  {
    iconName: "Share2",
    iconColor: "text-purple-500",
    title: "Simple Sharing",
    description: "Share files with anyone using secure links that you control."
  },
  {
    iconName: "CreditCard",
    iconColor: "text-orange-500",
    title: "Flexible Credits",
    description: "Pay only for what you use with our credit-based system."
  },
  {
    iconName: "FileText",
    iconColor: "text-red-500",
    title: "File Management",
    description: "Organize, preview, and manage your files from any device."
  },
  {
    iconName: "Clock",
    iconColor: "text-indigo-500",
    title: "Transaction History",
    description: "Keep track of all your credit purchases and usage."
  }
];

export const pricingPlans = [
    {
        name: "Basic",
        price: "0",
        credits:5,
        features: [
        "5 file uploads",
       "Basice File sharing",
       "Priority email support",
        ],
        cta:"Get Started",
        highlight:true
    },
    {
        name: "Premium",
        price: "500",
           credits:500,
        features: [
        "500 file uploads",
       "Advanced File sharing",
       "Priority email support",
       "24/7 Support",
       "file analytics",
        ],
        recommended:false
    },
    {
        name: "Ultimate",
        price: "2500",
        credits:5000,
        features: [
       "5000 file uploads",
       "Advanced File sharing",
       "Priority email support",
       "24/7 Support",
       "Advanced file analytics",
       "API access",
        ],
       recommended:true
        
    }

];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "CreativeMinds Inc.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    quote: "CloudShare has transformed how our team collaborates on creative assets. The secure sharing and storage features are invaluable.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Self-employed",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote: "As a freelancer, I need to share large design files with clients securely. CloudShare's simple interface and secure links make it effortless.",
    rating: 4
  },
  
  {
    name: "Arjun Singh",
    role: "Software Engineer",
    company: "TechWave Solutions",
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    quote: "The file management and secure storage features have greatly improved our workflow and security.",
    rating: 5
  },
  {
    name: "Neha Sharma",
    role: "UX Designer",
    company: "Creative Studio",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "I love the intuitive interface and easy sharing options. It has made collaboration with clients seamless.",
    rating: 5
  },
  {
    name: "Rohit Verma",
    role: "Business Analyst",
    company: "Data Insights Ltd.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    quote: "Reliable and efficient file storage solution. The credit system is very flexible for our needs.",
    rating: 4
  },
  {
    name: "Anita Joshi",
    role: "Content Strategist",
    company: "MediaWorks",
    image: "https://randomuser.me/api/portraits/women/51.jpg",
    quote: "The transaction history feature keeps me on top of my purchases, which is a huge plus.",
    rating: 5
  },
 
];


export const SIDE_MENU_DATA=[
  {
     id:"01",
     label:"Dashboard",
     icon:LayoutDashboard,
     Path:"/dashboard"
  },
  {
     id:"02",
     label:"Upload",
     icon:UploadCloud,
     Path:"/upload"
  },
  {
     id:"03",
     label:"My Files",
     icon:Files,
     Path:"/myfiles"
  },
  {
     id:"04",
     label:"Subscription",
     icon:CreditCard,
     Path:"/subscription"
  },
  {
     id:"05",
     label:"Transactions",
     icon:Receipt,
     Path:"/transaction"
  }
]
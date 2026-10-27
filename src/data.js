import elysoria from "./assets/elysoria.webp";
import krishinova from "./assets/krishinova.webp";
import chatty from "./assets/chatty.webp";

/* Contact details used by every WhatsApp and email link on the site. */
export const SITE = {
  name: "Divyanshu Mishra",
  whatsapp: "919569533902", // country code + number, no "+" or spaces
  email: "divyanshumishra2004@gmail.com",
  github: "https://github.com/Divyanshu-Mishra9620",
  city: "Lucknow",
  timeZone: "Asia/Kolkata",
};

export const WA_DEFAULT =
  "Hi Divyanshu, I saw your website and want to talk about a project.";
export const WA_AGENCY =
  "Hi Divyanshu, I run an agency and want to discuss white-label website work.";

export const waLink = (text = WA_DEFAULT) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
];

export const AUDIENCES = [
  "local businesses",
  "coaching centres",
  "clinics",
  "gyms",
  "shops",
  "agencies",
];

export const PROJECTS = [
  {
    id: "chatty",
    short: "Chatty",
    title: "Chatty real-time chat",
    kind: "Web app",
    description:
      "A chat app with user accounts, instant messages, typing indicators and read status. Every conversation is saved.",
    tags: ["Real-time", "User accounts", "Typing indicators", "Read status"],
    url: "https://fullstack-chat-app-1-57jj.onrender.com",
    cta: "Open the app",
    image: chatty,
    width: 1000,
    height: 454,
    alt: "Chatty sign-in screen with email and password fields",
    tint: "#e8964a",
  },
  {
    id: "elysoria",
    short: "Elysoria",
    title: "Elysoria online store",
    kind: "E-commerce",
    description:
      "A clothing store with 19,000+ products, quick search and Razorpay payments. It stays fast even with a catalogue that size.",
    tags: ["19,000+ products", "Instant search", "Razorpay", "Coupons"],
    url: "https://e-commerce-frontend-murex-eta.vercel.app/",
    cta: "Visit the store",
    image: elysoria,
    width: 1000,
    height: 461,
    alt: "Elysoria store homepage showing the men’s collection with shirts, trousers and accessories",
    tint: "#f2b53c",
  },
  {
    id: "krishinova",
    short: "KrishiNova",
    title: "KrishiNova AI farming assistant",
    kind: "AI assistant",
    description:
      "Farmers can ask about crops or weather, upload a photo of a sick plant to find the disease, or just speak their question.",
    tags: [
      "AI chat",
      "Disease from a photo",
      "Voice questions",
      "District map",
    ],
    url: "https://kris-hinova.vercel.app/",
    cta: "Try the assistant",
    image: krishinova,
    width: 1000,
    height: 455,
    alt: "KrishiNova showing a clickable India district map next to the AI farming assistant chat",
    tint: "#19c08a",
  },
];

export const SERVICES = [
  {
    id: "website",
    title: "Business website",
    for: "Coaching centres, clinics, gyms",
    description:
      "Your services, photos, timings and location, with an enquiry form that sends every lead to your WhatsApp.",
    points: ["Services & photos", "Timings & map", "WhatsApp enquiry form"],
    ask: "Hi Divyanshu, I’m interested in a business website.",
  },
  {
    id: "store",
    title: "Online store",
    for: "Shops & brands",
    description:
      "Product pages, a cart and Razorpay payments, plus an admin page so you can add products yourself.",
    points: ["Product pages", "Cart & Razorpay", "Admin page"],
    ask: "Hi Divyanshu, I’m interested in an online store.",
  },
  {
    id: "landing",
    title: "Landing page for ads",
    for: "Businesses running ads",
    description:
      "One page built around one offer, with tracking set up so you can see which ad brought in each customer.",
    points: ["One clear offer", "Ad tracking", "Works great on phones"],
    ask: "Hi Divyanshu, I’m interested in a landing page for my ads.",
  },
  {
    id: "assistant",
    title: "AI chat assistant",
    for: "Any business with FAQs",
    description:
      "Answers common customer questions on your site at any hour and passes serious enquiries on to you.",
    points: [
      "Answers at any hour",
      "Passes on serious leads",
      "Lives on your site",
    ],
    ask: "Hi Divyanshu, I’m interested in an AI chat assistant for my website.",
  },
];

export const STEPS = [
  {
    title: "Tell me about it",
    body: "Tell me about your business on WhatsApp. A voice note is fine.",
  },
  {
    title: "Quote & timeline",
    body: "I send you a quote and a timeline. You pay 10% to get started.",
  },
  {
    title: "First version",
    body: "You get a first version you can open on your phone, and two rounds of changes.",
  },
  {
    title: "Go live",
    body: "You pay the rest, the site goes live on your domain, and you get all the code and logins.",
  },
];

export const STATS = [
  { value: 19000, suffix: "+", label: "products in one store I built" },
  { value: 3, suffix: "", label: "live projects you can try today" },
  { value: 15, suffix: "+", label: "interface bugs fixed in GSSoC 2024" },
  { value: 2, suffix: "", label: "rounds of changes in every project" },
];

export const TIMELINE = [
  {
    when: "Now",
    title: "Freelance web developer",
    body: "Final-year B.Tech student at MMMUT Gorakhpur, building websites for businesses and agencies across India.",
  },
  {
    when: "Jobs",
    title: "AI full-stack engineer, ParallelDots",
    body: "Built an AI gateway that controls who can use the company’s AI features and how much, and a chatbot that answers business questions from company data in plain English.",
  },
  {
    when: "2024",
    title: "Open-source contributor, GirlScript Summer of Code",
    body: "Shipped 5+ features and fixed 15+ interface bugs.",
  },
];

export const FAQS = [
  {
    q: "What do you need from me to get started?",
    a: "Just tell me about your business on WhatsApp: what you do, who your customers are and what you want the website to do. A voice note is fine.",
  },
  {
    q: "How do payments work?",
    a: "You pay 10% to get started. After your rounds of changes, you pay the rest and the site goes live on your domain.",
  },
  {
    q: "Can I ask for changes?",
    a: "Yes. You get a first version you can open on your phone, and every project includes two rounds of changes.",
  },
  {
    q: "Will I own the website?",
    a: "Yes. When the site goes live you get all the code and logins, so you’re never locked in.",
  },
  {
    q: "Do you work with agencies?",
    a: "Yes, white-label. I build the site to your brief, you deliver it under your name, and I hand over the full code and logins when it’s done.",
  },
  {
    q: "Can we talk in Hindi?",
    a: "Of course. A WhatsApp voice note is fine too.",
    hindi: "हिंदी या English, जो आपको आसान लगे उसी में बात करें।",
  },
];

export const MARQUEE_SERVICES = [
  "Business websites",
  "Online stores",
  "Landing pages for ads",
  "AI chat assistants",
  "WhatsApp enquiry forms",
  "Razorpay payments",
];
export const MARQUEE_AUDIENCES = [
  "Coaching centres",
  "Clinics",
  "Gyms",
  "Shops",
  "Digital agencies",
  "Local businesses",
];

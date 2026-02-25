// Static data for Jobs page
export const PWD_TYPES = [
  { id: "visual",       label: "Visual Impairment"    },
  { id: "hearing",      label: "Hearing Impairment"   },
  { id: "mobility",     label: "Mobility / Physical"  },
  { id: "cognitive",    label: "Cognitive / Learning" },
  { id: "speech",       label: "Speech Impairment"    },
  { id: "psychosocial", label: "Psychosocial"         },
];

export const JOB_LISTINGS = [
  { id:"j1", company:"Accenture Philippines", logo:"AC", logoColor:"#648FBF",
    position:"Junior Web Developer", field:"tech",
    location:"Taguig City, Metro Manila", address:"6750 Ayala Ave, BGC, Taguig, 1634",
    contactEmail:"pwd.hiring@accenture.com.ph", contactPhone:"+63 2 8667 8000",
    setup:"Hybrid", type:"Full-time", salary:"₱25,000 – ₱40,000/mo",
    pwdFriendly:["visual","hearing","mobility","cognitive"],
    accommodations:["Screen reader software provided","Sign language interpreter available","Accessible workstation","Flexible break times"],
    description:"Join our growing tech team to build and maintain web applications. We welcome fresh graduates and career shifters. Our inclusive workplace is equipped with assistive technologies.",
    requirements:["HTML/CSS/JavaScript basics","Willingness to learn React","Good communication skills"],
    posted:"2 days ago", urgent:true, verified:true },

  { id:"j2", company:"BDO Unibank", logo:"BDO", logoColor:"#4B959E",
    position:"Data Entry Specialist", field:"finance",
    location:"Makati City, Metro Manila", address:"BDO Corporate Center, 7899 Makati Ave",
    contactEmail:"inclusive.hiring@bdo.com.ph", contactPhone:"+63 2 8840 7000",
    setup:"On-site", type:"Full-time", salary:"₱18,000 – ₱24,000/mo",
    pwdFriendly:["visual","mobility","cognitive","hearing"],
    accommodations:["Wheelchair accessible office","Braille documentation","Noise-cancelling headsets","Flexible schedule"],
    description:"Responsible for encoding, verifying and updating financial records. This role is perfect for detail-oriented individuals. Adaptive equipment is fully provided.",
    requirements:["Computer literacy","Attention to detail","Basic math skills"],
    posted:"1 day ago", urgent:false, verified:true },

  { id:"j3", company:"Teleperformance PH", logo:"TP", logoColor:"#8891C9",
    position:"Chat Support Agent", field:"bpo",
    location:"Quezon City, Metro Manila", address:"SM City North EDSA, Quezon City",
    contactEmail:"diversity@teleperformance.ph", contactPhone:"+63 2 8580 5000",
    setup:"Work from Home", type:"Full-time", salary:"₱20,000 – ₱30,000/mo",
    pwdFriendly:["hearing","mobility","speech","psychosocial"],
    accommodations:["100% remote setup","Equipment provided","Mental health support","Flexible shift options"],
    description:"Handle customer inquiries via chat and email. Ideal for those with speech or hearing impairments. No voice calls required. Full WFH setup with equipment provided.",
    requirements:["Excellent written English","Fast typing speed (40+ WPM)","Problem-solving skills"],
    posted:"3 days ago", urgent:true, verified:true },

  { id:"j4", company:"Canva Philippines", logo:"CV", logoColor:"#479880",
    position:"Graphic Design Associate", field:"creative",
    location:"Manila / Remote", address:"One World Place, BGC, Taguig",
    contactEmail:"inclusive@canva.ph", contactPhone:"+63 2 7900 0000",
    setup:"Remote", type:"Part-time", salary:"₱15,000 – ₱25,000/mo",
    pwdFriendly:["hearing","mobility","psychosocial","cognitive"],
    accommodations:["Fully remote","Async-first culture","Mental wellness budget","Custom peripheral setup"],
    description:"Create visual assets for marketing campaigns and product teams. Work at your own pace in a fully async environment. Disability accommodations are celebrated here.",
    requirements:["Proficiency in Canva / Adobe tools","Portfolio of design work","Creative thinking"],
    posted:"5 days ago", urgent:false, verified:true },

  { id:"j5", company:"Jollibee Foods Corp", logo:"JFC", logoColor:"#A899C4",
    position:"Administrative Assistant", field:"admin",
    location:"Pasig City, Metro Manila", address:"10 F. Ortigas Jr. Road, Pasig City",
    contactEmail:"hr.inclusion@jfc.com.ph", contactPhone:"+63 2 8634 1111",
    setup:"On-site", type:"Full-time", salary:"₱16,000 – ₱22,000/mo",
    pwdFriendly:["mobility","visual","hearing","cognitive"],
    accommodations:["Accessible elevator & ramps","Modified desk setup","Job coach support","Buddy system"],
    description:"Provide administrative and clerical support to the HR department. An accessible office with supportive teammates and job coaching is provided for all PWD hires.",
    requirements:["Proficiency in MS Office","Organizational skills","Team player"],
    posted:"1 week ago", urgent:false, verified:true },

  { id:"j6", company:"Sprout Solutions", logo:"SP", logoColor:"#4B9DB5",
    position:"QA Tester", field:"tech",
    location:"Mandaluyong / Remote", address:"Robinsons Cybergate, EDSA, Mandaluyong",
    contactEmail:"talent@sprout.ph", contactPhone:"+63 2 8810 0000",
    setup:"Hybrid", type:"Full-time", salary:"₱22,000 – ₱35,000/mo",
    pwdFriendly:["visual","hearing","mobility","cognitive","psychosocial"],
    accommodations:["Screen reader compatible tools","Quiet focus rooms","Flexible hours","Mental health days"],
    description:"Test software products to ensure quality and usability. We especially value candidates with disabilities as their perspective improves our accessibility testing.",
    requirements:["Analytical mindset","Basic software knowledge","Attention to detail"],
    posted:"4 days ago", urgent:false, verified:true },
];

export const USER_PROFILE = { name:"Sarah Johnson", disability:"mobility", field:"tech" };

export const FIELD_OPTIONS = [
  {id:"all",label:"All Fields"},
  {id:"tech",label:"Technology"},
  {id:"finance",label:"Finance"},
  {id:"bpo",label:"BPO / Support"},
  {id:"creative",label:"Creative"},
  {id:"admin",label:"Administrative"},
];

export const SETUP_OPTIONS = ["All","On-site","Hybrid","Remote","Work from Home"];

export const FONT_SIZES = [
  { id:"sm",  label:"Small",   scale:0.9  },
  { id:"md",  label:"Medium",  scale:1    },
  { id:"lg",  label:"Large",   scale:1.15 },
  { id:"xl",  label:"X-Large", scale:1.3  },
];
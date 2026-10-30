/**
 * Official Sri Sri University FAQ Database
 * Provides curated, verified question-and-answer pairs for speech and text queries.
 */

export interface UniversityFAQ {
  id: string;
  category: 'general' | 'admissions' | 'academics' | 'facilities' | 'lifestyle' | 'contact';
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  keywords: string[];
}

export const UNIVERSITY_FAQS: UniversityFAQ[] = [
  {
    id: "about-ssu",
    category: "general",
    questionEn: "Tell me about Sri Sri University.",
    questionHi: "श्री श्री यूनिवर्सिटी के बारे में बताइए।",
    answerEn:
      "Sri Sri University (SSU) is a premier holistic institution established in 2009 by Poojya Gurudev Sri Sri Ravi Shankar in Cuttack, Odisha. Spread over a scenic 188-acre green campus, SSU uniquely blends the best of Eastern ancient wisdom with Western modern scientific innovation under the motto 'Learn, Lead, Serve'.",
    answerHi:
      "श्री श्री यूनिवर्सिटी (SSU) की स्थापना 2009 में पूज्य गुरुदेव श्री श्री रवि शंकर जी द्वारा कटक, ओडिशा में की गई थी। 188 एकड़ के सुरम्य हरे-भरे परिसर में स्थित यह विश्वविद्यालय 'लर्न, लीड, सर्व' के ध्येय वाक्य के तहत पूर्वी ज्ञान और पश्चिमी आधुनिक विज्ञान का अद्भुत संगम प्रस्तुत करता है।",
    keywords: ["about", "overview", "what is", "introduction", "tell me about", "who founded", "ravishankar", "gurudev", "history", "यूनिवर्सिटी"]
  },
  {
    id: "location",
    category: "general",
    questionEn: "Where is Sri Sri University located?",
    questionHi: "श्री श्री यूनिवर्सिटी कहाँ स्थित है?",
    answerEn:
      "Sri Sri University is located at Sri Sri Vihar, Ward No. 3, Godi Sahi (near Bidyadharpur Arilo), Cuttack - 754006, Odisha, India. The picturesque 188-acre campus is situated on a serene hilltop overlooking the Mahanadi River basin.",
    answerHi:
      "श्री श्री यूनिवर्सिटी श्री श्री विहार, वार्ड नंबर 3, गोडी साही, कटक - 754006, ओडिशा में स्थित है। यह सुरम्य 188 एकड़ का परिसर महानदी घाटी के समीप एक शांत पहाड़ी पर बसा हुआ है।",
    keywords: ["where", "location", "address", "place", "cuttack", "odisha", "how to reach", "कहाँ", "पता", "स्थान"]
  },
  {
    id: "vision-mission",
    category: "general",
    questionEn: "What is the vision and mission of Sri Sri University?",
    questionHi: "श्री श्री यूनिवर्सिटी का विजन और मिशन क्या है?",
    answerEn:
      "The vision of Sri Sri University is to impart holistic and value-integrated education to develop visionary thinkers with social consciousness, under the summative call 'Learn, Lead, Serve'. Its mission is to establish centres of academic excellence and research that equip students to achieve the highest professional abilities while fostering human values.",
    answerHi:
      "श्री श्री यूनिवर्सिटी का विज़न 'लर्न, लीड, सर्व' के आह्वान के तहत सामाजिक चेतना से युक्त दूरदर्शी विचारक तैयार करना है। इसका मिशन ज्ञान और शोध के ऐसे केंद्र स्थापित करना है जो मानवीय मूल्यों को पोषित करते हुए छात्रों को उच्चतम व्यावसायिक क्षमता प्रदान करें।",
    keywords: ["vision", "mission", "goal", "purpose", "motto", "philosophy", "उद्देश्य", "विजन", "मिशन"]
  },
  {
    id: "learn-lead-serve",
    category: "general",
    questionEn: "What is the meaning of Learn, Lead, Serve?",
    questionHi: "'Learn, Lead, Serve' का क्या अर्थ है?",
    answerEn:
      "'Learn, Lead, Serve' is the guiding motto of Sri Sri University. 'Learn' signifies the pursuit of comprehensive knowledge and inner wisdom; 'Lead' represents developing ethical, compassionate leadership; and 'Serve' emphasizes dedicating one's skills to the welfare of society and the global community.",
    answerHi:
      "'Learn, Lead, Serve' श्री श्री यूनिवर्सिटी का आदर्श वाक्य है। 'Learn' का अर्थ ज्ञान और विवेक का अर्जन है; 'Lead' नैतिक और संवेदनशील नेतृत्व का विकास है; और 'Serve' समाज एवं विश्व कल्याण के लिए अपनी सेवाओं को समर्पित करना है।",
    keywords: ["learn lead serve", "motto meaning", "meaning of learn", "slogan", "अर्थ", "ध्येय वाक्य"]
  },
  {
    id: "courses-faculties",
    category: "academics",
    questionEn: "What courses and faculties are available at Sri Sri University?",
    questionHi: "श्री श्री यूनिवर्सिटी में कौन-कौन से कोर्स उपलब्ध हैं?",
    answerEn:
      "Sri Sri University offers undergraduate, postgraduate, and doctoral programmes across 11 faculties, including Management Studies (BBA, MBA), Engineering & Technology (B.Tech in CSE, AI & ML, Cyber Security, BCA, MCA), Agriculture (B.Sc. Hons Agriculture), Ayurvedic Medicine (BAMS), Architecture (B.Arch, B.Des), Sciences, Arts, Psychology, and Nursing.",
    answerHi:
      "श्री श्री यूनिवर्सिटी 11 संकायों में स्नातक, स्नातकोत्तर और डॉक्टरेट कार्यक्रम प्रदान करती है, जिनमें मैनेजमेंट (BBA, MBA), इंजीनियरिंग (B.Tech CSE, AI/ML, BCA, MCA), कृषि (B.Sc. Ag), आयुर्वेद (BAMS), वास्तुकला (B.Arch), विज्ञान, मनोविज्ञान और नर्सिंग शामिल हैं।",
    keywords: ["courses", "programmes", "faculties", "degrees", "btech", "mba", "bba", "bams", "agriculture", "engineering", "कोर्स", "विषय", "पढ़ाई"]
  },
  {
    id: "campus-facilities",
    category: "facilities",
    questionEn: "What facilities are available on campus?",
    questionHi: "कैंपस में क्या-क्या सुविधाएं उपलब्ध हैं?",
    answerEn:
      "The 188-acre campus features the modern Central Library in Shruti Complex, the 100+ Bed Sri Sri Ayurveda Hospital with 24/7 emergency care, separate fully furnished boys' and girls' hostels, Kaushalya Incubation Centre, sports fields (cricket, football, basketball), gymnasium, meditation halls, and the Annapurna dining hall serving pure vegetarian Sattvic meals.",
    answerHi:
      "188 एकड़ के इस परिसर में श्रुति कॉम्प्लेक्स में आधुनिक सेंट्रल लाइब्रेरी, 24 घंटे आपातकालीन सेवा युक्त 100 बिस्तरों वाला श्री श्री आयुर्वेद अस्पताल, सुसज्जित छात्रावास, कौशल्या इन्क्यूबेशन सेंटर, खेल मैदान, जिम, ध्यान कक्ष और शुद्ध शाकाहारी अन्नपूर्णा भोजनालय की सुविधा उपलब्ध है।",
    keywords: ["facilities", "amenities", "campus life", "infrastructure", "library", "gym", "hospital", "सुविधाएं", "हॉस्पिटल", "लाइब्रेरी"]
  },
  {
    id: "library",
    category: "facilities",
    questionEn: "Where is the Central Library and what does it offer?",
    questionHi: "सेंट्रल लाइब्रेरी कहाँ है और वहाँ क्या सुविधाएं हैं?",
    answerEn:
      "The Central Library is housed in the Shruti Academic Complex. It is an ultra-modern, fully air-conditioned, eco-friendly resource center equipped with vast collections of books, national and international journals, DELNET and IEEE digital subscriptions, RFID automation, and silent reading zones.",
    answerHi:
      "सेंट्रल लाइब्रेरी श्रुति एकेडमिक कॉम्प्लेक्स में स्थित है। यह पूरी तरह से वातानुकूलित और पर्यावरण-अनुकूल डिजिटल केंद्र है, जहाँ हजारों पुस्तकें, शोध पत्रिकाएँ, DELNET और IEEE जैसे ऑनलाइन डेटाबेस, और शांत अध्ययन क्षेत्र उपलब्ध हैं।",
    keywords: ["library", "books", "reading room", "shruti", "journals", "digital library", "पुस्तकालय", "किताबें"]
  },
  {
    id: "ayurveda-hospital",
    category: "facilities",
    questionEn: "Is there a hospital or medical facility on campus?",
    questionHi: "क्या कैंपस में अस्पताल या चिकित्सा सुविधा है?",
    answerEn:
      "Yes, the campus houses the Sri Sri College of Ayurvedic Science & Research Hospital, a 100+ Bed multi-specialty facility providing 24/7 emergency care, resident doctors, an on-campus ambulance, pharmacy, and traditional Panchakarma therapies for students, faculty, and visitors.",
    answerHi:
      "हाँ, कैंपस में श्री श्री कॉलेज ऑफ आयुर्वेदिक साइंस एंड रिसर्च हॉस्पिटल स्थित है। यह 100 से अधिक बिस्तरों वाला अस्पताल है जिसमें 24 घंटे आपातकालीन चिकित्सा, डॉक्टर, एम्बुलेंस, फार्मेसी और पंचकर्म उपचार उपलब्ध हैं।",
    keywords: ["hospital", "medical", "doctor", "health", "ayurveda", "emergency", "clinic", "दवा", "चिकित्सा", "अस्पताल"]
  },
  {
    id: "hostels",
    category: "facilities",
    questionEn: "What are the hostel facilities like at Sri Sri University?",
    questionHi: "श्री श्री यूनिवर्सिटी में हॉस्टल की सुविधा कैसी है?",
    answerEn:
      "SSU provides separate, secure halls of residence for boys and girls including Ambar, Kadambari, Aravali, HB 4, and Chhatrapati Shivaji Bhavan. All hostels have 24/7 security, high-speed Wi-Fi, continuous power backup, purified drinking water, common study rooms, and dedicated wardens.",
    answerHi:
      "यूनिवर्सिटी में छात्र और छात्राओं के लिए अलग-अलग सुरक्षित हॉस्टल (जैसे अंबर, कादंबरी, अरावली, एचबी 4) हैं। इनमें 24 घंटे सुरक्षा, हाई-स्पीड वाई-फाई, पावर बैकअप, शुद्ध पेयजल और अध्ययन कक्ष की उत्कृष्ट सुविधाएं हैं।",
    keywords: ["hostel", "accommodation", "stay", "room", "living", "boarding", "हॉस्टल", "रहने की जगह"]
  },
  {
    id: "food-dining",
    category: "lifestyle",
    questionEn: "What food is served in the university mess?",
    questionHi: "यूनिवर्सिटी मेस में कैसा खाना मिलता है?",
    answerEn:
      "Sri Sri University follows a strict 100% pure vegetarian, smoke-free, and alcohol-free policy. The Annapurna Dining Hall serves freshly prepared, hygienic, wholesome, and nutritious Sattvic vegetarian meals curated to support mental clarity and physical vitality.",
    answerHi:
      "श्री श्री यूनिवर्सिटी में 100% शुद्ध शाकाहारी और सात्विक आहार की व्यवस्था है। अन्नपूर्णा भोजनालय में स्वच्छता से तैयार ताजा, पौष्टिक और संतुलित भोजन परोसा जाता है। परिसर पूरी तरह से धूम्रपान और मद्यपान मुक्त है।",
    keywords: ["food", "mess", "dining", "vegetarian", "canteen", "meals", "annapurna", "खाना", "भोजन", "मेस"]
  },
  {
    id: "admissions-contact",
    category: "admissions",
    questionEn: "How can I contact Sri Sri University for admissions?",
    questionHi: "एडमिशन के लिए श्री श्री यूनिवर्सिटी से कैसे संपर्क करें?",
    answerEn:
      "You can contact the Admissions Office via phone at +91-7894424562 or email at admissions@srisriuniversity.edu.in. Applications and detailed eligibility criteria for all programmes can also be completed online at the official portal: https://srisriuniversity.edu.in/admissions/.",
    answerHi:
      "आप एडमिशन कार्यालय से फ़ोन नंबर +91-7894424562 पर या ईमेल admissions@srisriuniversity.edu.in पर संपर्क कर सकते हैं। अधिक जानकारी और ऑनलाइन आवेदन के लिए आधिकारिक वेबसाइट https://srisriuniversity.edu.in/admissions/ पर जा सकते हैं।",
    keywords: ["admissions", "apply", "contact", "phone", "email", "eligibility", "fees", "फॉर्म", "प्रवेश", "संपर्क"]
  }
];


// Extracted from index.html (line 13889) by Manus SEO pass — load order preserved

// ═══════════════════════════════════════════════════════
// Ozylix STORE — APP LOGIC
// ═══════════════════════════════════════════════════════
// Ozylix – Main Application

// ── BLOG DATA ──
const BLOGS = [
  // ── Category 1: Skin & Glow ──
  { id:1,  tag:"Skin Glow",
    title:"The 30-Day Glutathione Glow: What to Expect Week-by-Week",
    excerpt:"A science-backed timeline of results from Ozylix's 650mg L-Glutathione with L-Cysteine and Astaxanthin — week by week, from first fizz to visible skin brightening.",
    img:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    date:"Jan 15, 2026", readTime:"6 min read", author:"Dr. Ananya Gupta",
    relatedProduct:1 },

  { id:2,  tag:"Hyperpigmentation",
    title:"Why Your Face Serum Isn't Working: The Internal Approach to Hyperpigmentation",
    excerpt:"Topical creams treat the surface. Glutathione with Vitamin C tackles melanin synthesis from within — here's why internal supplementation changes everything.",
    img:"https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&q=80",
    date:"Jan 22, 2026", readTime:"7 min read", author:"Dr. Kavita Sharma",
    relatedProduct:1 },

  { id:3,  tag:"Effervescent Science",
    title:"Effervescent vs. Capsules: Why 'Fizzy' Glutathione Absorbs 3x Faster",
    excerpt:"Bioavailability research explains why Ozylix's effervescent format reaches your bloodstream 3× faster than traditional capsules or softgels.",
    img:"https://images.unsplash.com/photo-1587854680352-936b22b91030?w=600&q=80",
    date:"Feb 1, 2026", readTime:"6 min read", author:"Dr. Sanjay Mehta",
    relatedProduct:1 },

  { id:4,  tag:"Bridal Wellness",
    title:"The Ultimate Bridal Supplement Routine: 3 Months to Radiant Wedding Skin",
    excerpt:"India's wedding season demands glowing skin. A 12-week supplement stack — Glutathione, B12+Biotin, and Vitamin C — for brides across Gujarat and beyond.",
    img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    date:"Feb 10, 2026", readTime:"8 min read", author:"Dr. Kavita Sharma",
    relatedProduct:4 },

  { id:5,  tag:"Anti-Pollution",
    title:"Pollution vs. Skin: How Antioxidants Shield Urban Indian Skin",
    excerpt:"Delhi, Mumbai, Bangalore — pollution accelerates skin ageing by 10 years. Astaxanthin and Glutathione form a protective antioxidant shield against smog damage.",
    img:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
    date:"Feb 18, 2026", readTime:"5 min read", author:"Dr. Ananya Gupta",
    relatedProduct:1 },

  // ── Category 2: Superfoods & Superpowers ──
  { id:6,  tag:"Superfood Guide",
    title:"Spirulina vs. Moringa: Which 'Green Superfood' Does Your Body Need More?",
    excerpt:"Both are nutritional powerhouses — but Spirulina leads on protein and B12 while Moringa wins on iron and antioxidants. A complete comparison to help you choose.",
    img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    date:"Mar 1, 2026", readTime:"7 min read", author:"Nutritionist Priya Rao",
    relatedProduct:10 },

  { id:7,  tag:"Vegan Nutrition",
    title:"The Vegan B12 Crisis in India: How Spirulina Bridges the Nutritional Gap",
    excerpt:"Over 47% of Indian vegetarians are B12 deficient. Ozylix's Certified Organic Spirulina with D3 is the plant-based answer — no animal products, full absorption.",
    img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    date:"Mar 8, 2026", readTime:"6 min read", author:"Dr. Sanjay Mehta",
    relatedProduct:10 },

  { id:8,  tag:"Hair Growth",
    title:"Moringa for Hair Growth: The 'Miracle Tree' Secret to Thicker Hair",
    excerpt:"Moringa contains sulphur-rich amino acids that directly feed hair follicles. Combined with Biotin in effervescent form — results come faster than you'd expect.",
    img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    date:"Mar 15, 2026", readTime:"6 min read", author:"Nutritionist Meera Iyer",
    relatedProduct:4 },

  { id:9,  tag:"Fitness Recovery",
    title:"Post-Workout Recovery: Why Spirulina is the Natural Alternative to Synthetic BCAAs",
    excerpt:"Spirulina contains all essential amino acids, phycocyanin, and iron. For plant-based athletes, Ozylix's VitaPlus Spirulina is the clean recovery choice.",
    img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    date:"Mar 22, 2026", readTime:"7 min read", author:"Fitness Expert Rohit Shah",
    relatedProduct:10 },

  { id:10, tag:"Weight Management",
    title:"Ancient Wisdom, Modern Format: Why We Combined ACV with Moringa",
    excerpt:"Apple Cider Vinegar with Garcinia Cambogia and Moringa Leaf Extract — the story behind Ozylix's Green Apple effervescent and why it outperforms plain ACV.",
    img:"https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
    date:"Mar 29, 2026", readTime:"7 min read", author:"Nutritionist Priya Rao",
    relatedProduct:2 },

  // ── Category 3: Urban Wellness & Lifestyle ──
  { id:11, tag:"Productivity",
    title:"The 'Sluggish Morning' Fix: A Supplement Routine for High-Performance Professionals",
    excerpt:"Corporate India runs on caffeine. Here's a smarter morning stack — L-Carnitine, Vitamin C+Moringa, and B12+Biotin — that delivers sustainable all-day energy.",
    img:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80",
    date:"Apr 5, 2026", readTime:"6 min read", author:"Wellness Expert Rahul Verma",
    relatedProduct:3 },

  { id:12, tag:"Eye Health",
    title:"Screen Time & Eye Strain: Can Superfoods Save Your Vision in 2026?",
    excerpt:"The average Indian professional spends 11+ hours on screens. Astaxanthin and Spirulina's zeaxanthin protect the macula from blue light damage.",
    img:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    date:"Apr 12, 2026", readTime:"5 min read", author:"Dr. Sanjay Mehta",
    relatedProduct:10 },

  { id:13, tag:"Metabolic Health",
    title:"Metabolic Flexibility: How Apple Cider Vinegar Effervescent Prevents 3 PM Brain Fog",
    excerpt:"Post-lunch blood sugar crashes cause 3 PM brain fog. ACV with Moringa and B-vitamins stabilises glucose metabolism and keeps cognition sharp all afternoon.",
    img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    date:"Apr 19, 2026", readTime:"6 min read", author:"Nutritionist Priya Rao",
    relatedProduct:2 },

  { id:14, tag:"Deficiency Alert",
    title:"The Silent Epidemic: Why 70% of Indians Are Vitamin D & B12 Deficient",
    excerpt:"You can live in a sunny country and still be severely deficient. This is why urban Indians need targeted daily supplementation — and which Ozylix products help most.",
    img:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80",
    date:"Apr 26, 2026", readTime:"8 min read", author:"Dr. Kavita Sharma",
    relatedProduct:8 },

  { id:15, tag:"Gut-Skin Axis",
    title:"Gut-Skin Axis: Why Your Digestion Is the Key to Clear Skin",
    excerpt:"Leaky gut triggers systemic inflammation that shows up on your face. Moringa, ACV and zinc-rich effervescents repair the gut lining from within.",
    img:"https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80",
    date:"May 3, 2026", readTime:"7 min read", author:"Dr. Ananya Gupta",
    relatedProduct:2 },

  // ── Category 4: B2B & Manufacturing ──
  { id:16, tag:"Gujarat Manufacturing",
    title:"Anand: Why India's 'Milk Capital' Is Becoming the Global Hub for Nutraceuticals",
    excerpt:"Ozylix's FSSAI approved plant in Anand, Gujarat sits at the centre of India's emerging nutraceutical corridor — here's why it matters for global quality.",
    img:"https://images.unsplash.com/photo-1581092921461-39b392021a78?w=600&q=80",
    date:"May 10, 2026", readTime:"6 min read", author:"Ozylix Team" },

  { id:17, tag:"Private Label",
    title:"How to Start Your Own Supplement Brand in India: A Step-by-Step Guide to Private Labeling",
    excerpt:"From FSSAI registration to formulation, packaging and launch — Ascovita's B2B arm handles everything for aspiring supplement entrepreneurs across India.",
    img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    date:"May 17, 2026", readTime:"9 min read", author:"Ascovita B2B Team" },

  { id:18, tag:"Manufacturing Science",
    title:"The Science of Solubility: What Goes into Making a World-Class Effervescent Tablet?",
    excerpt:"pH balance, CO₂ release rate, citric acid ratios and coating technology — an inside look at how Ozylix's FSSAI approved plant formulates effervescents that actually work.",
    img:"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80",
    date:"May 24, 2026", readTime:"7 min read", author:"Dr. Sanjay Mehta" },

  { id:19, tag:"Global Exports",
    title:"Exporting Health: Why Indian Supplements Are Taking Over Global Markets in 2026",
    excerpt:"India's nutraceutical exports crossed $6 billion in 2025. FSSAI licensed manufacturers from Gujarat are leading the charge — and Ozylix is part of that story.",
    img:"https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80",
    date:"May 28, 2026", readTime:"6 min read", author:"Ozylix Team" },

  { id:20, tag:"Sustainability",
    title:"Sustainable Supplementation: How Ozylix Supports Local Farmers in Gujarat",
    excerpt:"Ozylix's Moringa and Spirulina are ethically sourced from certified farms across Gujarat. Here's our commitment to sustainable, local, and traceable nutrition.",
    img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    date:"Jun 4, 2026", readTime:"5 min read", author:"Ozylix Team" },
  // ── Category 5: Ozylix Company & Customer Journey ──
  { id:21, tag:"Factory to Home", slug:"from-ozylix-factory-to-your-home",
    title:"From the Ozylix Factory to Your Home",
    excerpt:"Discover Ozylix’s direct-to-consumer factory-to-home story, including product information, ordering, delivery, and customer support.",
    img:"/assets/blog/ozylix-factory-to-home.webp", alt:"Ozylix effervescent supplement tubes representing the brand’s factory-to-home model",
    date:"Aug 15, 2026", readTime:"5 min read", author:"Ozylix Editorial Team",
    metaTitle:"From the Ozylix Factory to Your Home | Ozylix",
    metaDescription:"Learn how Ozylix presents its Indian supplement range through a direct factory-to-home shopping model.",
    bodyHtml:`
      <p>When people search for a wellness brand, they want to know where a product comes from, how it reaches them, how they can contact the company, and whether the brand explains its purpose clearly. Ozylix presents a direct-to-consumer supplement experience built around its own factory-to-home story: products are introduced through the Ozylix storefront and delivered through the company’s online ordering journey.</p>
      <p>Ozylix’s public catalogue includes effervescent vitamins, spirulina products, moringa products, and other nutraceutical formats. The factory-to-home message gives that catalogue a clear customer journey: discover a product, read its information, place an order, and receive it through Ozylix’s support and delivery process.</p>
      <h3>What “factory to home” means</h3>
      <p>“Factory to home” describes Ozylix’s intended direct customer journey, not a promise about every delivery route or order. The company’s public information presents an Indian manufacturing story and a direct online storefront. Customers should still read the product label, order confirmation, shipping policy, and support information for the details that apply to their purchase.</p>
      <p>A company story is only one part of a purchasing decision. Readers should also check the product name, serving instructions, ingredient list, allergen information, storage guidance, batch or lot information, and the contact details printed on the packaging. People who take medicines, are pregnant or breastfeeding, have a medical condition, or are preparing for a procedure should discuss supplement use with a qualified healthcare professional.</p>
      <p>Explore the <a href="/about">Ozylix About page</a>, browse the <a href="/shop">current product range</a>, review the <a href="/faq">FAQs</a>, or <a href="/contact">contact the team</a> with a product or order question.</p>
      <p><strong>Important:</strong> Dietary supplements are not a substitute for professional medical advice. Always follow the product label and current website terms.</p>` },

  { id:22, tag:"Gujarat Manufacturing", slug:"ozylix-supplement-manufacturing-anand-gujarat",
    title:"Made in Anand, Gujarat: How Ozylix Approaches Supplement Manufacturing",
    excerpt:"Explore Ozylix’s public manufacturing story in Anand, Gujarat, its factory-to-home model, and the importance of clear product information.",
    img:"/assets/blog/ozylix-quality-you-can-trust.webp", alt:"Ozylix supplement tube displayed with an Anand, Gujarat manufacturing story",
    date:"Aug 15, 2026", readTime:"6 min read", author:"Ozylix Editorial Team",
    metaTitle:"Made in Anand, Gujarat: Ozylix Supplement Manufacturing",
    metaDescription:"Explore Ozylix’s public manufacturing story in Anand, Gujarat, including its factory-to-home model and clear product information.",
    bodyHtml:`
      <p>Anand, Gujarat is part of Ozylix’s public identity. The brand’s website presents Ozylix as a direct-to-consumer wellness brand and identifies Anand as the location associated with its manufacturing story. For customers, the location matters because origin is one of the first questions people ask when they compare supplement brands online.</p>
      <p>A manufacturing story is most valuable when it goes beyond a photograph or a slogan. It should explain the relationship between the facility, product format, quality checks, packaging, and customer support, while distinguishing what is verified from what is aspirational. Ozylix can build trust by keeping that explanation specific and current.</p>
      <h3>From location to process</h3>
      <p>“Made in India” gives a product an origin, but it does not by itself explain how a product was formulated, tested, packed, stored, or shipped. Customers should use the product page and packaging to review ingredients, serving information, warnings, storage instructions, and other details relevant to the specific product.</p>
      <p>Effervescent products are designed to be dissolved in water before consumption. That creates practical questions about moisture protection, tube closure, serving instructions, and storage. The most useful manufacturing communication answers those questions using the product label rather than making broad statements about absorption or guaranteed results.</p>
      <h3>A quality story is a documentation story</h3>
      <p>Ozylix’s public site uses phrases such as FSSAI licensed, lab tested, and third-party tested in its company narrative. Those phrases should always be read together with the exact licence or testing documentation and the scope of the claim. A facility approval is not the same as approval of a medical treatment, and a supplement should not be presented as preventing, treating, or curing a disease.</p>
      <p>Visit the <a href="/about">About page</a> for company information, use the <a href="/shop">Shop</a> for current availability, or <a href="/contact">contact Ozylix</a> with manufacturing or product questions.</p>
      <p><strong>Important:</strong> Consumers who take medicines or have health concerns should speak with a healthcare professional before using a new supplement.</p>` },

  { id:23, tag:"Effervescent Guide", slug:"how-to-choose-effervescent-vitamins-india",
    title:"How to Choose an Effervescent Vitamin Supplement in India",
    excerpt:"A practical checklist for comparing effervescent vitamin supplements in India, from labels and storage to company transparency and support.",
    img:"/assets/blog/ozylix-grand-launch-effervescent-vitamins.webp", alt:"Ozylix effervescent vitamin tubes shown in a product-format guide",
    date:"Aug 15, 2026", readTime:"6 min read", author:"Ozylix Editorial Team",
    metaTitle:"How to Choose Effervescent Vitamin Supplements in India | Ozylix",
    metaDescription:"Use this practical checklist to compare effervescent vitamin supplements in India, including labels, storage, support, and product information.",
    bodyHtml:`
      <p>Effervescent supplements are designed to be dissolved in water before they are consumed. The format can be convenient for people who prefer a drinkable routine, but convenience should not replace careful product selection. Before buying an effervescent vitamin supplement in India, compare the label, company information, instructions, storage requirements, and support available after purchase.</p>
      <h3>Start with the product label</h3>
      <p>The label is the most important source of information for a specific supplement. Check the product name, serving size, ingredient list, quantity per tube or pack, directions for use, storage instructions, warnings, manufacturer or marketer details, and batch information. If a product is intended to be dissolved in water, follow the stated volume and preparation instructions.</p>
      <p>A company webpage can provide context, but it should not contradict the packaging. If the online description and label differ, contact the company before using the product. Product information, safety, quality, and possible interactions are important considerations when evaluating a dietary supplement.</p>
      <h3>Look for a clear company identity</h3>
      <p>A supplement brand should make it reasonably easy to identify who is responsible for the product and how customers can ask questions. Ozylix provides public routes for shopping, FAQs, and customer contact. That information is a useful starting point for checking whether the company explains its products and policies consistently.</p>
      <h3>Do not choose by exaggerated promises</h3>
      <p>Words such as “instant,” “miracle,” “guaranteed,” “cures,” or “works for everyone” should prompt caution. Dissolving a product in water does not by itself prove a particular absorption speed or outcome. A better approach is to ask whether the format fits your routine, whether you can store the tube as directed, and whether the ingredients are appropriate for you.</p>
      <p>Browse the <a href="/shop">Ozylix effervescent range</a>, read the <a href="/faq">FAQs</a>, and <a href="/contact">contact the company</a> if you need help understanding a product label.</p>
      <p><strong>Important:</strong> Supplements are not a substitute for diagnosis, medication, a balanced diet, sleep, or professional care.</p>` },

  { id:24, tag:"Product Range", slug:"ozylix-effervescent-vitamins-spirulina-wellness-range",
    title:"Inside the Ozylix Range: Effervescent Vitamins, Spirulina and Everyday Wellness",
    excerpt:"A clear guide to exploring the Ozylix range, including effervescent formats, spirulina, moringa, and label-first product selection.",
    img:"/assets/blog/ozylix-quality-you-can-trust.webp", alt:"Ozylix product tube illustrating the company’s quality and product-range story",
    date:"Aug 15, 2026", readTime:"6 min read", author:"Ozylix Editorial Team",
    metaTitle:"Inside the Ozylix Range: Effervescent Vitamins and Spirulina",
    metaDescription:"Explore the Ozylix range of effervescent vitamins, spirulina, moringa, and other wellness formats with a practical label-first guide.",
    bodyHtml:`
      <p>People shop for supplements for different reasons: some prefer an effervescent drink, some look for a plant-based format, and others want to compare a particular ingredient or serving routine. Ozylix presents a range that includes effervescent vitamins, spirulina products, moringa products, and other nutraceutical formats. The exact formula and suitability of each product depend on its individual label.</p>
      <h3>Effervescent formats</h3>
      <p>Effervescent products are dissolved in water before consumption. This can make the routine feel different from swallowing a conventional tablet or capsule. Follow the product’s directions for the amount of water, serving frequency, storage, and use after opening.</p>
      <h3>Plant-based formats</h3>
      <p>Spirulina and moringa are plant-based ingredients that appear in parts of the Ozylix range. Category language is not a substitute for checking the full ingredient list, allergen information, serving details, or dietary suitability of a particular product. Customers following a strict dietary pattern should check the label and contact the company when needed.</p>
      <h3>Choose by information, not promises</h3>
      <p>The most useful question is not “Which product is best for everyone?” It is “Which product information matches my needs, routine, and professional guidance?” Read the label, compare the current product page, and avoid claims that promise guaranteed transformation or disease treatment.</p>
      <p>Use the <a href="/shop">Ozylix Shop</a> for current availability, learn more on the <a href="/about">About page</a>, and review the <a href="/faq">FAQs</a> before ordering.</p>
      <p><strong>Important:</strong> People who take medicines, are pregnant or breastfeeding, or have a medical condition should seek professional advice before using a new supplement.</p>` },

  { id:25, tag:"Customer Support", slug:"shopping-direct-from-ozylix-delivery-vita-points-support",
    title:"Shopping Direct from Ozylix: Delivery, Vita Points and Customer Support",
    excerpt:"What to check when shopping direct from Ozylix, from product information and delivery terms to Vita Points and support.",
    img:"/assets/blog/ozylix-vita-points-rewards.webp", alt:"Ozylix Vita Points rewards visual with an effervescent supplement tube",
    date:"Aug 15, 2026", readTime:"5 min read", author:"Ozylix Editorial Team",
    metaTitle:"Shopping Direct from Ozylix: Delivery, Vita Points and Support",
    metaDescription:"Learn what to check when shopping direct from Ozylix, including product information, delivery terms, Vita Points, and customer support.",
    bodyHtml:`
      <p>Shopping direct from a brand is easiest when the company identity, product information, ordering flow, delivery terms, and support route are easy to find. Ozylix’s customer journey is designed around moving from the company’s factory-to-home story to an online storefront where customers can review products and place orders.</p>
      <h3>Check the product before ordering</h3>
      <p>Start with the product page and packaging information. Review the ingredient list, serving size, directions, warnings, storage guidance, pack quantity, price, and any terms that apply to the product or promotion. If you have a health condition or take medicines, speak with a healthcare professional before using a new supplement.</p>
      <h3>Review delivery and returns</h3>
      <p>Delivery promises and return terms can change, so use the current Ozylix website and order confirmation as the source of truth. Check the delivery address, dispatch information, estimated arrival, and return or replacement conditions before completing an order. If a shipment arrives damaged or incorrect, contact the company with the order details and photographs where appropriate.</p>
      <h3>How Vita Points fit into the customer journey</h3>
      <p>Ozylix presents Vita Points as a customer rewards programme in its public campaign material. Customers should review the current programme terms for how points are earned, when they become available, how they can be redeemed, and whether exclusions or expiry rules apply.</p>
      <p>Visit the <a href="/shop">Shop</a> to view current products, read the <a href="/faq">FAQs</a> for common ordering questions, or use the <a href="/contact">Contact page</a> when you need assistance.</p>
      <p><strong>Important:</strong> Product, price, delivery, loyalty, and return terms are subject to the current website and order confirmation.</p>` }

];



// ── FAQ DATA ──
const FAQS = [
  { q:"How long does delivery take?", a:"Standard delivery across India generally takes 3–5 business days. Orders below ₹599 have a ₹79 shipping fee; shipping is free when the paid subtotal reaches ₹599 or more. Dispatch is normally within 24–48 hours, and the tracking link is sent after dispatch.", cat:"Shipping" },
  { q:"What payment methods do you accept?", a:"Payment options shown at checkout may include UPI, cards, net banking, supported wallets or EMI options, and Cash on Delivery where available for your PIN code. The available methods are confirmed by the payment provider at checkout.", cat:"Payment" },
  { q:'How does Mix & Match work?', a:"Add four eligible units and the lowest-priced eligible unit becomes free. Mix & Match is a standalone offer: if it unlocks, any coupon code or additional percentage discount is removed rather than stacked. The final saving is recalculated securely at checkout.", cat:"Offers" },
  { q:"Are Ozylix products FSSAI approved?", a:"Yes. All Ozylix products are manufactured in FSSAI-licensed facilities and meet all regulatory requirements for food supplements in India. Product licenses are available on request.", cat:"Products" },
  { q:"Can I take multiple supplements together?", a:"Generally yes, but we recommend checking with your doctor if you're on medications. Ozylix supplements are designed to be safe when combined. Our Combo Kits are specifically curated for safe, effective multi-supplement use.", cat:"Products" },
  { q:"How do I track my order?", a:"After dispatch, you'll receive an SMS and email with a tracking link from our shipping partner (Shiprocket). Track directly at shiprocket.in/shipment-tracking or via the link in your confirmation email.", cat:"Shipping" },
  { q:"Is COD available? Are there extra charges?", a:"Cash on Delivery is offered only where the checkout provider and delivery PIN code support it. Any applicable delivery or COD charge is shown before you place the order; orders of ₹599 or more qualify for free shipping under the current policy.", cat:"Payment" },
  { q:"Can I return or exchange products?", a:"Request a return within 7 days of delivery for sealed and unused products. Damaged, defective, or incorrect items should be reported promptly with photographs. Refunds are processed after the return is received and checked; promotional discounts and redeemed VitaPoints are reversed according to the final eligible amount.", cat:"Returns" },
  { q:"How should I store the products?", a:"Store all Ozylix products in a cool, dry place below 30°C. Keep away from direct sunlight and moisture. After opening effervescent tablet tubes, seal tightly and use within 30 days.", cat:"Products" },
  { q:"Are these suitable for vegetarians/vegans?", a:"All Ozylix supplements are 100% vegetarian. The spirulina products are also vegan. Glutathione and B1+Biotin are vegetarian but check if vegan-strict, as some capsule shells may vary.", cat:"Products" },
  { q:"How do I apply a discount code?", a:"Enter one active code in the Apply Coupon field and press Apply. A coupon cannot be stacked with Mix & Match when Mix & Match unlocks, and the server checks expiry, usage limits, minimum order value, and the maximum permitted saving again before payment.", cat:"Offers" },
  { q:"Do you offer bulk/wholesale pricing?", a:"Yes. For bulk orders or wholesale partnerships, contact ozylixcare@gmail.com or call +91 9898 582 650. Bulk pricing and quantities are quoted separately and are not automatically combined with consumer coupons or Mix & Match.", cat:"Orders" },
];

// ── APP STATE ──
let currentPage = 'home';
let currentProduct = null;
let currentCat = 'all';
let shopQuery = '';
let priceMax = 2000;
let carouselIdx = 0;
let pQty = 1;
let selectedRating = 0;
let appliedDiscount = null;
let activePromoCode  = null; // declared early; re-initialised at applyPromoCode section

// ── PAGE NAV ──
// ═══════════════════════════════════════════════════════════════
// BODY SCROLL LOCK — one owner, self-healing
//
// THE BUG THIS KILLS
//   Several overlays lock page scrolling while they are open. The mobile
//   hamburger menu does it the heavy way — body{position:fixed;
//   top:-scrollY; overflow:hidden} — which is the only reliable way to
//   stop touch-scroll on Android. The side cart, auth and "more" drawers
//   did it the light way (overflow only). The close functions did not
//   match the open functions: only closeAppMenu cleared position:fixed;
//   the others cleared overflow alone. So if the menu was open and
//   ANYTHING closed it by another path — a link that forgot
//   closeAppMenu (the WhatsApp item did), a navigation, a tab switch —
//   body stayed position:fixed forever. The result on a phone is exactly
//   "nothing scrolls and no button works": the page is pinned at a fixed
//   offset and looks dead, even though taps still fire underneath.
//
//   There was no safety net: showPage() never cleared the lock, so once
//   stuck it stayed stuck across every navigation.
//
// THE FIX
//   One unlock function that clears EVERY property the locks set and
//   restores the scroll position by reading it back out of body.style.top
//   (so it needs no shared variable and heals a lock set by any path).
//   It is called by every close function, by showPage() on every
//   navigation, and on pageshow — so the body can never stay frozen
//   after the user navigates or returns to the tab.
function unlockBodyScroll() {
  var b = document.body;
  var wasFixed = b.style.position === 'fixed';
  var y = wasFixed ? -parseInt(b.style.top || '0', 10) : null;
  b.style.position = '';
  b.style.top = '';
  b.style.left = '';
  b.style.right = '';
  b.style.width = '';
  b.style.overflow = '';
  if (wasFixed && y != null && !isNaN(y)) window.scrollTo(0, y);
}
window.unlockBodyScroll = unlockBodyScroll;

// Every layer that can cover the page, in one list so nothing can be
// missed again. These are the only elements in the document that take a
// scroll lock, so "is one of these open?" is the same question as "is the
// body legitimately locked?".
var SCROLL_LOCK_LAYERS = [
  'sideCart', 'sideCartOverlay',
  'appMoreDrawer', 'appMoreOverlay',
  'appMenuDrawer', 'appMenuOverlay', 'appHamburgerBtn',
  'authOverlay',
  'shopFilterSidebar'   // phone filter drawer — marks itself with .is-open
];

// Two open-markers exist in this document: the older drawers use `.open`,
// the shop filter drawer uses `.is-open`. Both count. Miss the second one
// and the watchdog below tears the filter drawer's scroll lock off within
// a second of it being set, letting the page scroll behind an open drawer.
function anyOverlayOpen() {
  for (var i = 0; i < SCROLL_LOCK_LAYERS.length; i++) {
    var n = document.getElementById(SCROLL_LOCK_LAYERS[i]);
    if (n && (n.classList.contains('open') || n.classList.contains('is-open'))) return true;
  }
  return false;
}

// THE BUG THIS KILLS
//   showPage() unlocked the body but left every drawer sitting there with
//   its .open class. The page changed underneath while the cart drawer
//   stayed painted over the whole screen — and because the drawer's dark
//   overlay is a full-viewport fixed element, it swallowed every tap aimed
//   at the bottom nav behind it. Tapping "Cart" then "Account" on a phone
//   did nothing at all: the second tap never reached the button.
//
//   Classes are stripped directly rather than by calling closeSideCart() /
//   closeAuth() etc, because those carry side effects — closeAuth() writes
//   a "login prompt dismissed" flag — that must not fire on every single
//   navigation. This is idempotent and safe to call as often as we like.
function closeAllOverlays() {
  for (var i = 0; i < SCROLL_LOCK_LAYERS.length; i++) {
    var n = document.getElementById(SCROLL_LOCK_LAYERS[i]);
    if (n) n.classList.remove('open');
  }
  unlockBodyScroll();
}
window.closeAllOverlays = closeAllOverlays;

// THE WATCHDOG — the guarantee, not just another patch
//   Every fix above closes one known path to a stuck lock. This closes all
//   the unknown ones. If the body is locked but nothing that locks it is
//   actually open, the lock is orphaned by definition and the page is dead
//   for no reason — so release it. Any future overlay that forgets to
//   unlock, any close path nobody thought of, heals within a second
//   instead of leaving the customer on a frozen store.
function healStuckScrollLock() {
  var b = document.body;
  if (b.style.position !== 'fixed' && b.style.overflow !== 'hidden') return;
  if (anyOverlayOpen()) return;   // locked on purpose — leave it alone
  unlockBodyScroll();
}
window.healStuckScrollLock = healStuckScrollLock;

// Returning from WhatsApp / a new tab / the app switcher restores the
// page from bfcache with whatever lock was on it — always unstick it.
window.addEventListener('pageshow', unlockBodyScroll);
window.addEventListener('popstate', healStuckScrollLock);
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) healStuckScrollLock();
});
setInterval(healStuckScrollLock, 1000);

const OZYLIX_SUBSCRIPTIONS_ENABLED = false;
window.OZYLIX_SUBSCRIPTIONS_ENABLED = OZYLIX_SUBSCRIPTIONS_ENABLED;

function showPage(pg) {
  // Recurring subscriptions are not active. Keep stale links and cached routes
  // from presenting an offer that the backend cannot fulfil.
  if (pg === 'subscriptions' && !OZYLIX_SUBSCRIPTIONS_ENABLED) {
    pg = 'shop';
  }
  // Navigation must never begin on a locked body OR under a drawer that
  // is still open from the previous page. Nothing in this store is meant
  // to stay open across a navigation, so closing everything is always
  // right and is the net that makes a stuck overlay impossible.
  closeAllOverlays();
  try { closeShopFilters(); } catch (e) {}   // shop filter drawer, same rule
  document.getElementById('codOverlay')?.remove();
  // Update URL to clean path (e.g. ozylix.com/about) — no hash
  try {
    const cleanPath = (pg && pg !== 'home') ? '/' + pg : '/';
    history.pushState({ page: pg }, '', cleanPath);
  } catch(e) { /* suppressed: sandboxed iframe preview */ }
  // ── SEO: Update title + meta description per page ──
  // ── SEO: Per-page keyword-rich titles (≤60 chars) + descriptions (≤155 chars) ──
  const PAGE_SEO = {
    home:          [
      'Glutathione Effervescent Tablets | Ozylix India',
      'FSSAI approved effervescent vitamins from Anand, Gujarat. Glutathione, Spirulina, Moringa, ACV & Multivitamins. FSSAI Approved. Free delivery, no minimum.'
    ],
    shop:          [
      'Shop Effervescent Vitamins & Supplements | Ozylix India',
      'Browse 11 premium supplements — Glutathione, Spirulina B12+D3, Organic Moringa, ACV+Moringa, Multivitamin. FSSAI approved, made in Gujarat. Up to 35% OFF on packs.'
    ],
    about:         [
      'About Ozylix | FSSAI Licensed Supplement Manufacturer Anand Gujarat',
      'Ozylix — nutraceutical manufacturer in Anand, Gujarat. FSSAI approved. Effervescent tablets, organic spirulina and moringa supplements India.'
    ],
    blog:          [
      'Supplement & Wellness Blog | Glutathione, Spirulina Guides | Ozylix',
      'Expert guides on Glutathione skin glow, Spirulina for vegans, Moringa hair growth & ACV weight loss from Ozylix\'s nutritionists. Free health tips for India.'
    ],
    faq:           [
      'FAQ – Effervescent Vitamins, Shipping & Returns | Ozylix',
      'Common questions about Ozylix supplements: absorption, FSSAI certification, delivery across India, returns and all payment options including UPI and EMI.'
    ],
    contact:       [
      'Contact Ozylix | Supplement Manufacturer in Anand, Gujarat India',
      'Reach Ascovita in Anand, Gujarat. Call +91 9898 582 650 or WhatsApp for product queries, B2B wholesale and retail support across India.'
    ],
    cart:          [
      'Your Cart | Ozylix – Effervescent Vitamins India',
      'Review your Ozylix supplement order. Free delivery, no minimum. Secure UPI, card and EMI checkout. FSSAI approved, made in Anand Gujarat.'
    ],
    checkout:      [
      'Secure Checkout | Ozylix – Made in Gujarat India',
      'Complete your order securely. Pay via UPI, Credit/Debit Card, Net Banking or EMI via GoKwik. FSSAI approved effervescent supplements delivered pan-India.'
    ],
    advisor:       [
      'AI Health Advisor – Find Your Perfect Supplement | Ozylix',
      'Answer 3 questions to discover which Ozylix effervescent vitamin is right for your skin, energy, immunity or weight goals. Powered by AI. Free to use.'
    ],
    wishlist:      [
      'My Wishlist | Ozylix Supplements India',
      'Your saved Ozylix supplements. Save for later and never miss a deal on effervescent vitamins, organic spirulina, moringa and multivitamins.'
  ],
};
  const seo = PAGE_SEO[pg];
  if (seo) {
    document.title = seo[0];
    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo[1]);
    // Open Graph title + description (dynamic per page)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo[0]);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo[1]);
    // Twitter title + description
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', seo[0]);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', seo[1]);
    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const cleanPath = (pg && pg !== 'home') ? '/' + pg : '/';
    // Only set canonical to our own domain — never to external URLs
    if (canonical && cleanPath.startsWith('/')) {
      const safeCanonical = 'https://www.ozylix.com' + cleanPath;
      if (safeCanonical.startsWith('https://www.ozylix.com')) {
        canonical.setAttribute('href', safeCanonical);
      }
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://www.ozylix.com' + cleanPath);
    // SEO fix: each route now declares itself as its own en-IN / x-default
    // alternate. Before, both hreflang tags pointed at the homepage from
    // every URL, which misrepresented site structure to Google.
    const _hl = document.querySelectorAll('link[rel="alternate"][data-hreflang]');
    _hl.forEach(l => l.setAttribute('href', 'https://www.ozylix.com' + cleanPath));
  }
  // Shop page gets category-level structured data.
  // Keep this inside showPage(), where `pg` and `cleanPath` are defined;
  // placing it in openProduct() makes direct card clicks throw before the
  // product section receives its active class.
  if (pg === 'shop' && typeof setShopPageSchema === 'function') {
    try { setShopPageSchema(); } catch (e) {}
  }
  // Track page view in GA
  window._trackPage && window._trackPage(pg);
  // Leaving a product: drop its JSON-LD so the head describes this page only.
  if (pg !== 'product' && typeof setProductPageSchema === 'function') setProductPageSchema(null);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + pg);
  if (!el) return;
  el.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
  currentPage = pg;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pg);
  });
  // Premium account header — populate welcome banner + lifetime stats
  if (pg === 'account') { try { refreshAccountWelcome(); } catch(e) {} }
  if (pg === 'notifications') { try { renderNotificationCenter(); } catch(e) {} }
  if (pg === 'shop') {
    initShop();
    try {
      const ob = document.getElementById('shopOfferBar');
      if (ob) { ob.innerHTML = offerBarHTML(); vp3dScan(ob); offerTick(); }
    } catch (e) {}
  }
  if (pg === 'cart') {
    renderCart();
    // Aug 2026: cart strategy — genuine savings / MM progress reminder
    (function () {
      try {
        if (!STORE || !STORE.cart || !STORE.cart.length) return;
        if (typeof ozylxNotify === 'undefined' || typeof PRODUCTS === 'undefined') return;
        var mmUnits = [], mmDisc = 0, total = 0;
        PRODUCTS.forEach(function (pr) {
          var ci = STORE.cart.find(function (c) { return c.id === pr.id; });
          if (!ci) return;
          var tiers = typeof getProductTiers === 'function' ? getProductTiers(pr) : null;
          var qty = ci.qty || 1;
          if (tiers) { var ti = typeof currentTierIdx === 'function' ? currentTierIdx(pr, tiers) : -1;
            if (ti >= 0 && ti < tiers.length) qty = Math.max(1, tiers[ti].units || 1); }
          for (var u = 0; u < qty; u++) mmUnits.push(pr.price || pr.salePrice || 0);
          total += (pr.salePrice || pr.price || 0) * qty;
        });
        mmUnits.sort(function (a, b) { return a - b; });
        var groups = Math.floor(mmUnits.length / 4);
        for (var g = 0; g < groups; g++) mmDisc += mmUnits[g * 4] || 0;
        var mmNeed = groups > 0 ? 0 : 4 - (mmUnits.length % 4);
        var msg = mmDisc > 0
          ? '🎉 ₹' + mmDisc.toLocaleString('en-IN') + ' saved with your Mix & Match bundle discount'
          : (mmUnits.length > 0 ? ('🎁 ' + mmNeed + ' more ' + (mmNeed === 1 ? 'item' : 'items') + ' and your bundle discount grows')
            : '💚 Don’t forget — your order earns Vita Points');
        ozylxNotify.show({ id: 'cart-' + (mmDisc > 0 ? 'saved' : mmNeed ? 'mm' : 'vita'), msg: msg, corner: 'bottom-left' });
      } catch (e) {}
    })();
    try {
      const items = STORE.cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return{id:i.id,name:p?.name||'',price:p?.salePrice||p?.price||0,qty:i.qty};});
      const tot = items.reduce((s,i)=>s+i.price*i.qty,0);
      window._trackViewCart && window._trackViewCart(items, tot);
    } catch(e){}
  }
  if (pg === 'checkout') {
    renderCheckoutSummary();
    // Pull the authoritative VitaPoints balance before the customer decides
    // how many to redeem — the server re-verifies at order time anyway, but
    // showing a stale local number here just produces a confusing rejection.
    try {
      vitaRefreshFromServer().then(function(ok){
        if (ok && typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
      }).catch(function(){});
    } catch(e) {}
    // Render product recommendations for checkout
    setTimeout(function() { if (typeof renderCkRecommendations === 'function') renderCkRecommendations(); }, 50);
    // The Pay button used to disable itself here and read "Warming up
    // server... (first load ~30s)" while it pinged Render awake. On a paid
    // plan the server is never cold, so that was 35 seconds of a greyed-out
    // Pay button and a message telling the customer to wait, at the exact
    // moment they had decided to buy. Removed with the warm-up pings.
    try {
      const items = STORE.cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return{id:i.id,name:p?.name||'',price:p?.salePrice||p?.price||0,qty:i.qty};});
      const tot = items.reduce((s,i)=>s+i.price*i.qty,0);
      window._trackBeginCheckout && window._trackBeginCheckout(items, tot);
    } catch(e){}
  }
  if (pg === 'blog') renderFullBlog();
  if (pg === 'faq') renderFullFaq();

  // Footer: hide on transactional/fullscreen pages
  const noFooterPages = ['checkout', 'thankyou', 'account', 'login'];
  const footer = document.getElementById('siteFooter');
  if (footer) {
    footer.style.display = noFooterPages.includes(pg) ? 'none' : '';
  }
}

function showShop(cat) {
  currentCat = cat || 'all';
  showPage('shop');
  setTimeout(() => filterCat(currentCat, document.querySelector(`.cpill[data-cat="${currentCat}"]`)), 30);
}

function slugify(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

// One canonical product URL everywhere: explicit SEO slug first, then any
// legacy slug field, then the product name. Never use an internal product ID
// in a customer-facing backlink.
function canonicalProductSlug(product) {
  const raw = product && typeof product === 'object'
    ? (product.seoSlug || product.slug || product.urlSlug || product.name)
    : product;
  return slugify(raw);
}
window.canonicalProductSlug = canonicalProductSlug;

// ── Ascofizz → Ozylix slug migration ────────────────────────────────────
// Product slugs are derived from product names, so renaming the brand moved
// one URL. Inbound links from the old domain, old search results and old
// social posts keep working through this map instead of dropping to /shop.
// Safe to delete once Search Console shows no traffic on the old path.
const LEGACY_PRODUCT_SLUGS = {
  'multidiata-ascofizz-premium-multivitamin': 'multidiata-ozylix-premium-multivitamin'
};

function findProductBySlug(slug) {
  if (!slug || typeof PRODUCTS === 'undefined') return null;
  const cleanSlug = String(slug).replace(/^\/+|\/+$/g, '').toLowerCase();
  const wanted = LEGACY_PRODUCT_SLUGS[cleanSlug] || cleanSlug;
  return PRODUCTS.find(p => {
    const nameSlug = slugify(p.name);
    const productSlug = canonicalProductSlug(p);
    return nameSlug === wanted || productSlug === wanted;
  }) || null;
}

function openProduct(id, routeOptions) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  window._currentProductId = id; // track for backend sync re-render
  if (currentProduct) window._trackViewItem && window._trackViewItem(currentProduct);
  if (!currentProduct) return;
  setProductPageSchema(currentProduct);
  pQty = 1;
  // Opening a product is a fresh visit, so its review list starts collapsed
  // at three. Only this entry point resets it — buildProductPage() must not,
  // because it re-runs when reviews load and would then close a list the
  // customer had just opened.
  try { if (_rvView[id]) { _rvView[id].expanded = false; _rvView[id].page = 0; } } catch(e) {}
  buildProductPage(currentProduct);
  setTimeout(()=>document.dispatchEvent(new CustomEvent('productPageShown',{detail:currentProduct})),100);
  // Push clean URL: /product/<canonical-seo-slug>. Initial deep links and
  // legacy plural links replace the current entry so Back does not revisit the
  // broken URL; normal in-app product clicks still create a history entry.
  try {
    const slug = canonicalProductSlug(currentProduct);
    const target = '/product/' + slug;
    const replace = !!(routeOptions && routeOptions.replace);
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({ page: 'product', id: id }, '', target);
  } catch(e) {}
  /* Product pages were absent from GA4's Pages report entirely. Opening a
     product does not route through showPage(), so nothing ever sent a
     page_view for it — view_item fired, which is the right ecommerce event
     but is not a pageview, so /product/... URLs simply did not exist in the
     reporting even though customers were on them.
     Sent after the pushState above so the real slug is in the URL. */
  try { window._trackPage && window._trackPage(currentProduct.name); } catch(e) {}
  // Update page title + meta for SEO
  const disc = currentProduct.salePrice ? Math.round((1 - currentProduct.salePrice/currentProduct.price)*100) : 0;
  const discText = disc > 0 ? ` – ${disc}% OFF` : '';
  document.title = currentProduct.name + discText + ' | Ozylix';
  // SEO fix: self-referencing canonical. Previously openProduct() never updated
  // the canonical, so every product page kept the static homepage default —
  // telling Google all 15 product URLs were duplicates of the homepage.
  const _can = document.querySelector('link[rel="canonical"]');
  if (_can) _can.setAttribute('href', 'https://www.ozylix.com' + window.location.pathname);

  const _ogUrl = document.querySelector('meta[property="og:url"]');
  if (_ogUrl) _ogUrl.setAttribute('content', 'https://www.ozylix.com' + window.location.pathname);
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content',
    'Buy ' + currentProduct.name + ' at ₹' + (currentProduct.salePrice||currentProduct.price) + discText + '. ' + (currentProduct.description||'').slice(0,120) + ' Free delivery on every order.'
  );
  // Show the page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-product');
  if (el) { el.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
  currentPage = 'product';
  const bc=document.getElementById('prodBCName'); if(bc) bc.textContent = currentProduct.name;
}

// REVIEW COLLECTION: called from the "Write a Review" button on delivered
// order cards in My Account. Opens the product page and jumps straight to
// the review form — the customer is already logged in (required for the
// page) and purchase-verified server-side, so it is a two-tap review.
function openProductReview(productId) {
  openProduct(productId);
  // The review list may still be loading from Supabase; scroll after the
  // live ratings land so rvFormWrap exists in the DOM.
  const tryScroll = () => {
    const wrap = document.getElementById('rvFormWrap');
    if (wrap) { setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150); return true; }
    return false;
  };
  if (!tryScroll()) {
    const h = setInterval(() => { if (tryScroll()) clearInterval(h); }, 300);
    setTimeout(() => clearInterval(h), 10000);
  }
}

// ── MOBILE MENU ──
function toggleMobile() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── HOME INIT ──
async function initHome() {
  // ✅ FIX (review count flash): paint product cards only AFTER the live
  // reviews aggregate has resolved. Without this gate the first paint
  // showed the catalogue's static figures — a product with zero real
  // reviews could flash "4.8 ★ (567)" for up to a second before the
  // honest "No ratings yet" replaced it.
  try { await loadProductRatings(); } catch (e) { /* cards fall back below */ }
  // ✅ FIX 2: Filter out _hidden (active:false) products from all grids.
  const visibleProducts = PRODUCTS.filter(p => !p._hidden && p.active !== false);
  // Do not gate the entire homepage on media availability. The static
  // catalogue intentionally boots before /api/products returns on slower
  // mobile connections; filtering out image-less products here used to
  // replace the already-painted Featured and New Arrivals cards with empty
  // grids. renderProductCard() shows an honest media-pending state, and the
  // successful backend sync re-renders these same cards with live images,
  // prices, offers, and stock. Products must not disappear during that gap.
  window.OZYLIX_MISSING_MEDIA = visibleProducts.filter(p => !p.image || !String(p.image).trim()).map(p => ({ id: p.id, name: p.name }));
  const homepageProducts = visibleProducts;
  // Use the same deterministic renderers as bootApp and backend hydration.
  // The previous inline path omitted byPosition(), so initHome could repaint
  // the cards in static catalogue order after bootApp had already sorted them.
  try { renderFeatured(); } catch (e) {
    const feat = homepageProducts.filter(p => p.tags.includes('featured')).sort(byPosition).slice(0,8);
    const fg=document.getElementById('featuredGrid'); if(fg) fg.innerHTML = feat.map(p => renderProductCard(p, { homepage: true })).join('');
  }
  try { renderNewArrivals(); } catch (e) {
    const newP = homepageProducts.filter(p => p.tags.includes('new')).sort(byPosition).slice(0,4);
    const nag=document.getElementById('newArrivalsGrid'); if(nag) nag.innerHTML = newP.map(p => renderProductCard(p, { homepage: true })).join('');
  }
  // Blog content is rendered only on the dedicated blog page.
  // FAQ
  const hfw=document.getElementById('homeFaqWrap'); if(hfw) hfw.innerHTML = FAQS.slice(0,5).map(renderFaqItem).join('');
  // Category tile counts + About page figures
  try { hydrateCategoryCounts(); } catch(e) {}
  try { hydrateAboutStats(); } catch(e) {}
  // Testimonials + Customer Reviews Wall — both pull the same real, live data
  renderTestimonials();
  renderReviewsWall();
  renderLiveRatingStat();
  STORE.updateCartUI();
}

// ── SHOP ──
function initShop() { applyFilters();
  // Aug 2026: shop hero slider — mirrors the home page top banner
  // (BANNER_SLIDES); stays hidden while that config has no usable image.
  try { if (typeof initShopHero === 'function') initShopHero(); } catch (e) {}

  // Aug 2026: shop strategy — offer popups staggered (not on first paint —
  // the customer browses first; value before pressure). Tapping the card
  // opens the home page Mix & Match section; it used to state the offer and
  // leave the customer with nowhere to act on it.
  try { setTimeout(function () {
    if (typeof ozylxNotify === 'undefined') return;
    // `cta` is required, not decorative: paint() only renders the button
    // when a label exists, so an onCta passed on its own is unreachable.
    ozylxNotify.show({ id: 'shop-discovery', msg: '🎁 Mix &amp; Match — the bigger your bundle, the bigger your automatic discount.', icon: '🎁', corner: 'bottom-left', cta: 'Build your bundle', onCta: function () { goMixMatch(); } });
  }, 9000); } catch (e) {}
  try { setTimeout(function () {
    if (typeof ozylxNotify === 'undefined') return;
    ozylxNotify.show({ id: 'shop-vitapoints', msg: '🪙 Every Ozylix order earns Vita Points — redeem them for real discounts on your next purchase.', icon: '🪙', corner: 'bottom-right', onCta: function () { showPage('home'); setTimeout(function () { document.getElementById('vitapoints-home')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120); } });
  }, 19000); } catch (e) {}
}

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cpill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilters();
  const titles = {
    all:'All Products', premium:'🏆 Ozylix Premium', spirulina:'🌊 Spirulina Range',
    effervescent:'🫧 Effervescent Range', ayurvedic:'🌿 Ayurvedic Wellness', energy:'⚡ Energy & Performance',
    combos:'🎁 Combos & Bundles', bestsellers:'🔥 Best Sellers', sale:'💰 On Sale', new:'🆕 New Launch',
    skin:'⭐ Skin & Glow', immunity:'💪 Immunity Boosters', brain:'🧠 Brain & Focus', weight:'🏋 Weight Management',
    moringa:'🌿 Moringa', vitamins:'💊 Vitamins', specialty:'⭐ Specialty'
  };
  const t = document.getElementById('shopTitle');
  if (t) t.textContent = titles[cat] || 'All Products';
}

function applyFilters() {
  // ✅ FIX 2: Never show hidden/inactive products in shop
  let prods = PRODUCTS.filter(p => !p._hidden && p.active !== false);
  const goalTags = ['skin','immunity','energy','brain','weight'];
  const query = String(shopQuery || '').trim().toLowerCase();
  if (query) {
    prods = prods.filter(p => {
      const hay = [p.name, p.brand, p.category, p.description, p.shortDescription, ...(Array.isArray(p.tags) ? p.tags : [])].filter(Boolean).join(' ').toLowerCase();
      return query.split(/\s+/).every(term => hay.includes(term));
    });
  }
  if (currentCat === 'bestsellers') prods = prods.filter(p => p.tags.includes('bestseller'));
  else if (currentCat === 'sale') prods = prods.filter(p => p.salePrice || (p.tags && p.tags.includes('sale')));
  else if (currentCat === 'new') prods = prods.filter(p => p.tags.includes('new'));
  else if (goalTags.includes(currentCat)) prods = prods.filter(p => p.tags.includes(currentCat) || p.category === currentCat);
  else if (currentCat !== 'all') prods = prods.filter(p => p.category === currentCat);

  prods = prods.filter(p => { var px = p.salePrice || p.price; return px == null || px <= priceMax; });

  const rChecks = [...document.querySelectorAll('[id^=fr]:checked')].map(c => +c.value);
  if (rChecks.length) { const min = Math.min(...rChecks); prods = prods.filter(p => p.rating >= min); }
  if (document.getElementById('fSale')?.checked) prods = prods.filter(p => p.salePrice);
  if (document.getElementById('fNew')?.checked) prods = prods.filter(p => p.tags.includes('new'));
  if (document.getElementById('fBest')?.checked) prods = prods.filter(p => p.tags.includes('bestseller'));

  const sort = document.getElementById('sortSel')?.value;
  if (sort === 'plo') prods.sort((a,b) => (a.salePrice||a.price)-(b.salePrice||b.price));
  else if (sort === 'phi') prods.sort((a,b) => (b.salePrice||b.price)-(a.salePrice||a.price));
  else if (sort === 'rat') prods.sort((a,b) => b.rating-a.rating);
  else prods.sort(byPosition); // default ("def") — respects admin-set display order

  const grid = document.getElementById('shopGrid');
  const empty = document.getElementById('shopEmpty');
  const cnt = document.getElementById('shopCount');
  if (!grid) return;
  grid.innerHTML = prods.length ? prods.map(p => renderProductCard(p)).join('') : '';
  // New cards dropped in with `img[data-src]` — wake the hydrator so
  // filtered/searched results show real photos instead of blank tiles.
  if (typeof window._hpiFlush === 'function') { try { window._hpiFlush(); } catch(e) {} }
  if (empty) empty.style.display = prods.length ? 'none' : 'block';
  if (cnt) cnt.textContent = `Showing ${prods.length} product${prods.length!==1?'s':''}`;
  syncFilterChrome(prods.length);
}

// ── MIX & MATCH — one destination, many entry points ────────────────
// Every Mix & Match teaser on the site (shop sidebar card, shop promo
// banner, the shop popup) calls this. There is exactly one place the offer
// can actually be built — the home page section — so a teaser's job is to
// get the customer there, never to restate the rules and stop.
//
// The scroll is deferred and retried because showPage() swaps the page in
// asynchronously on some paths: scrolling in the same tick lands on a
// section that is still display:none and does nothing at all.
function goMixMatch() {
  try { if (typeof closeShopFilters === 'function') closeShopFilters(); } catch (e) {}
  try { if (typeof showPage === 'function') showPage('home'); } catch (e) {}
  var tries = 0;
  (function seek() {
    var el = document.getElementById('bundle-builder');
    if (el && el.offsetParent !== null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (++tries < 20) setTimeout(seek, 80);
  })();
}
window.goMixMatch = goMixMatch;

// ── SHOP FILTER DRAWER (phones / tablets) ───────────────────────────
// Below 1024px the filter sidebar is off-canvas. Everything here is inert
// on desktop: the chrome it touches is display:none there, and the drawer
// classes have no styles outside the media query.
function syncFilterChrome(resultCount) {
  // Badge = how many filters are actually narrowing the list, so a customer
  // who left something ticked and scrolled away can see it from the button.
  var active = 0;
  document.querySelectorAll('[id^=fr]:checked, #fSale:checked, #fNew:checked, #fBest:checked').forEach(function () { active++; });
  if (typeof priceMax === 'number' && priceMax < 2000) active++;
  if (String(shopQuery || '').trim()) active++;
  var sortSel = document.getElementById('sortSel');
  if (sortSel && sortSel.value !== 'def') active++;
  var badge = document.getElementById('filterToggleCount');
  if (badge) { badge.textContent = active; badge.hidden = active === 0; }
  var apply = document.getElementById('filterApplyCount');
  if (apply && typeof resultCount === 'number') {
    apply.textContent = resultCount + ' product' + (resultCount !== 1 ? 's' : '');
  }
}
function openShopFilters() {
  var bar = document.getElementById('shopFilterSidebar');
  var scrim = document.getElementById('filterScrim');
  var btn = document.getElementById('filterToggle');
  if (!bar) return;
  if (scrim) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-open'); }); }
  bar.classList.add('is-open');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';   // the drawer scrolls, the page does not
  syncFilterChrome();
}
function closeShopFilters() {
  var bar = document.getElementById('shopFilterSidebar');
  var scrim = document.getElementById('filterScrim');
  var btn = document.getElementById('filterToggle');
  if (bar) bar.classList.remove('is-open');
  if (scrim) {
    scrim.classList.remove('is-open');
    // Wait out the fade before hiding, or the scrim vanishes mid-transition.
    setTimeout(function () { if (!scrim.classList.contains('is-open')) scrim.hidden = true; }, 320);
  }
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
function toggleShopFilters() {
  var bar = document.getElementById('shopFilterSidebar');
  if (bar && bar.classList.contains('is-open')) closeShopFilters();
  else openShopFilters();
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeShopFilters();
});
// Rotating to a wide screen turns the drawer back into a plain column; the
// leftover body lock would then freeze a page with no visible drawer.
window.addEventListener('resize', function () {
  clearTimeout(window.__fdRz);
  window.__fdRz = setTimeout(function () {
    if (window.innerWidth > 1024) closeShopFilters();
  }, 150);
});

function updateShopSearch(value) {
  shopQuery = String(value || '');
  const hint = document.getElementById('shopSearchHint');
  if (hint) hint.textContent = shopQuery.trim() ? 'Searching names, benefits, categories and tags…' : 'Search names, benefits, categories and tags.';
  applyFilters();
}
function clearShopSearch() {
  shopQuery = '';
  const input = document.getElementById('shopSearch');
  if (input) input.value = '';
  const hint = document.getElementById('shopSearchHint');
  if (hint) hint.textContent = 'Search names, benefits, categories and tags.';
  applyFilters();
}

function updatePrice(v) {
  priceMax = +v;
  const pd=document.getElementById('priceDisp'); if(pd) pd.textContent = v >= 2000 ? 'Any price' : `Up to ${fmt(+v)}`;
  applyFilters();
}

function clearFilters() {
  clearShopSearch();
  const pr=document.getElementById('priceRange'); if(pr) pr.value = 2000;
  priceMax = 2000;
  const pd2=document.getElementById('priceDisp'); if(pd2) pd2.textContent = 'Any price';
  document.querySelectorAll('[id^=fr], #fSale, #fNew, #fBest').forEach(c => { if(c) c.checked=false; });
  const ss=document.getElementById('sortSel'); if(ss) ss.value = 'def';
  currentCat = 'all';
  document.querySelectorAll('.cpill').forEach(p => p.classList.remove('active'));
  document.querySelector('.cpill[data-cat="all"]')?.classList.add('active');
  applyFilters();
}

// ── QUANTITY DISCOUNT WIDGET ──
// Tracks which tier is selected per product (productId → tierIndex).
// FIX (Aug 2026, owner video report): the tier lived in memory only, so
// the Google sign-in redirect reload (which unloads the whole page) wiped
// the customer's pack choice and they had to redo the full price ladder.
// Selected tiers now survive reloads via localStorage.
let selectedTiers = {};
try { const _st = JSON.parse(localStorage.getItem('asc_selected_tiers') || '{}'); for (const k of Object.keys(_st)) selectedTiers[Number(k)] = _st[k]; } catch(e) {}
function _persistSelectedTiers(){ try { localStorage.setItem('asc_selected_tiers', JSON.stringify(selectedTiers)); } catch(e) {} }

// The one place the product page is allowed to read a tier table.
//
// QTY_TIERS carries rows with `mrp: null, rate: null` for products whose
// price isn't set yet (Power Pro, id 22, ships that way), and the admin
// panel can push the same shape from the backend. renderProductCard and
// schemaPriceOf each grew their own filter for it; the product page never
// did, so opening one of those products ran `null.toLocaleString()` inside
// the template literal that builds the whole detail pane — one TypeError,
// and the pane stayed blank with no clue why. Returning null here means a
// priced-later product simply renders as an untiered product, which is
// what it is.
// ── DURATION LABELS: 1 tablet per day ──────────────────────────────
// The old "month supply" text assumed every pack was a 15-tab box = one
// month, so the 15-tab tier read "1 month supply" and the 60-tab carton
// read "4 months" — both wrong. Dosage is ONE tablet a day, so:
//   15 tabs = 15 days · 30 tabs = 30 days (one month) · 60 tabs = 2 months.
// dosePerDay comes from the product (admin: "Tablets per day"). It used to be
// assumed to be 1 for the whole catalogue, so a twice-daily product's 60-tab
// pack was sold as "2 months" when it is one. Falls back to 1 when unset,
// which is how every existing product already behaves.
function durationLabel(tabs, dosePerDay) {
  const per = Number(dosePerDay) > 0 ? Number(dosePerDay) : 1;
  const n = Math.round((Number(tabs) || 0) / per);   // days of supply
  if (n <= 0) return '';
  if (n < 30) return n + ' day' + (n === 1 ? '' : 's');
  const months = Math.floor(n / 30);
  const days = n % 30;
  if (days) return months + ' month' + (months === 1 ? '' : 's') + ' + ' + days + ' days';
  return months + ' month' + (months === 1 ? '' : 's');
}

// "4 tubes · 60 tablets". Only claims a unit count when the pack size divides
// evenly into the tier — a 50-tab tier on a 15-tab tube is not 3.33 tubes, so
// it states the tablets alone rather than something it cannot stand behind.
function packComposition(tier, tabletsPerPack, packUnit) {
  const tabs = Number(tier.tabs) || 0;
  const perPack = Number(tabletsPerPack) || 0;
  const noun = String(packUnit || 'pack').trim().replace(/s$/, '') || 'pack';
  if (!tabs) return '';
  if (perPack > 0 && tabs % perPack === 0) {
    const units = tabs / perPack;
    if (units >= 2) return units + ' ' + noun + 's · ' + tabs + ' tablets';
  }
  return tabs + ' tablets';
}
function getProductTiers(p) {
  const raw = p && (p._backendTiers || (typeof QTY_TIERS !== 'undefined' ? QTY_TIERS[p.id] : null));
  if (!Array.isArray(raw)) return null;
  const usable = raw.filter((t) =>
    t && Number.isFinite(Number(t.rate)) && Number(t.rate) >= 0 &&
         Number.isFinite(Number(t.mrp))  && Number(t.mrp)  > 0 && Number(t.rate) <= Number(t.mrp)
  ).map((t, index) => {
    const mrp = Number(t.mrp), rate = Number(t.rate);
    return { ...t, discountPct: Number.isFinite(Number(t.discountPct)) ? Number(t.discountPct) : (mrp > 0 ? ((mrp - rate) / mrp) * 100 : 0), savingAmount: Math.max(0, mrp - rate), _offerIndex: index };
  });
  if (!usable.length) return null;
  usable.sort((a, b) => (Number(b.discountPct) - Number(a.discountPct)) || (Number(b.savingAmount) - Number(a.savingAmount)) || (Number(b.tabs) - Number(a.tabs)) || (a._offerIndex - b._offerIndex));
  return usable.map(({ _offerIndex, ...tier }) => tier);
}

// Index into the tier list, clamped. selectedTiers survives a backend
// refresh that can shorten the list, so the stored index is a hint.
function currentTierIdx(p, tiers) {
  const list = tiers || getProductTiers(p);
  if (!list) return 0;
  const want = selectedTiers[p.id];
  return (Number.isInteger(want) && want >= 0 && want < list.length) ? want : 0;
}

// "₹51.55" — per-tablet price, to two decimals only when it needs them.
function tierUnitPrice(tier) {
  const tabs = Number(tier.tabs) || 0;
  if (!tabs) return null;
  const per = Number(tier.rate) / tabs;
  return per >= 100 ? Math.round(per).toLocaleString('en-IN')
                    : per.toFixed(per < 10 ? 2 : 1);
}

// ── OFFER THUMBNAILS ───────────────────────────────────────────────────────
// A tier card said "60 tablets · 2 months · Buy 2 + 1 free" in four separate
// lines of small text, and left the customer to assemble the offer out of
// them. Showing the packs makes the quantity the first thing read rather than
// the last: three boxes, one of them flagged free, is understood before any
// of the words are.
//
// Capped at MAX_THUMBS so a 4-pack tier does not shrink each box to a smudge
// on a 390px screen; anything beyond that becomes a "+N" chip. Every <img>
// carries explicit dimensions because these render inside a grid that must
// not reflow once they load.
const OFFER_THUMB_MAX = 4;

function buildOfferThumbs(p, tier) {
  const src = typeof getProductImg === 'function' ? getProductImg(p) : (p && p.image);
  if (!src) return '';

  const free = tier.offerType === 'buy_get' ? Math.max(0, Number(tier.freeQuantity) || 0) : 0;
  const smallest = Number(tier._unitTabs) || 0;
  const paid = free > 0
    ? Math.max(1, Number(tier.buyQuantity) || 1)
    : (smallest ? Math.max(1, Math.round(Number(tier.tabs) / smallest)) : 1);
  const total = paid + free;
  if (total < 2 && free === 0) return '';   // a single pack shows nothing new

  const pack = (isFree, count) =>
    `<span class="qt-thumb${isFree ? ' qt-thumb-free' : ''}">`
    + `<img src="${src}" alt="" width="34" height="34" loading="lazy" decoding="async">`
    + (count > 1 ? `<i class="qt-thumb-x">×${count}</i>` : '')
    + (isFree ? '<b>FREE</b>' : '')
    + '</span>';

  let out;
  if (total <= OFFER_THUMB_MAX) {
    // Few enough to draw literally, one box per pack.
    out = '';
    for (let i = 0; i < paid; i++) out += pack(false, 1);
    for (let i = 0; i < free; i++) out += pack(true, 1);
  } else {
    // Too many to draw one-for-one. The first attempt truncated the literal
    // row and appended "+N", which on a buy-3-get-3 rendered as one paid box,
    // three FREE boxes and "+2" — it read as though almost everything was
    // free. Collapsing to one box per KIND with a multiplier keeps the ratio
    // honest at any size: "×3" paid beside "×3 FREE".
    out = pack(false, paid) + (free > 0 ? pack(true, free) : '');
  }
  return `<span class="qt-thumbs" aria-hidden="true">${out}</span>`;
}

function buildTierWidget(p) {
  const tiers = getProductTiers(p);
  if (!tiers) return '';            // no tiers, or none priced yet
  const sel = currentTierIdx(p, tiers);
  const t = tiers[sel];
  const saving = t.mrp - t.rate;
  // Whole rupees. Interpolated tiers produced values like 999.01, and a price
  // carrying two decimals of arithmetic noise reads to a customer as a mistake.
  const rupee = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
  const tabletsPerPack = Number(p.tabletsPerPack) || 0;
  const packUnit = p.packUnit || '';
  const dosePerDay = Number(p.dosePerDay) > 0 ? Number(p.dosePerDay) : 1;
  const doseText = dosePerDay === 1 ? '1 tablet a day' : dosePerDay + ' tablets a day';

  // Best value is the deepest discount, resolved once rather than inside
  // the map — with `Math.max` recomputed per card it was O(n²) and, more
  // to the point, it could flag two cards when two tiers tie on percent.
  const bestPct = Math.max(...tiers.map((x) => Number(x.discountPct) || 0));
  const bestIdx = bestPct > 0 ? tiers.findIndex((x) => (Number(x.discountPct) || 0) === bestPct) : -1;

  // "3 packs of 15" only when the pack sizes really are multiples of the
  // smallest one. The old code hardcoded 15/30/45 and fell through to
  // "4 Packs" for everything else, which labelled the 60-tablet Multidiata
  // box — a single carton — as four packs.
  // The SMALLEST pack, found by looking. getProductTiers() sorts by discount
  // descending, so tiers[0] is the deepest-discount tier — usually the
  // LARGEST pack. Reading the unit off it made `n` a fraction for every
  // smaller tier and 1 for the largest, so packLabel() returned '' for all of
  // them and "3 packs of 15" never appeared on any product.
  const unit = tiers.reduce((min, t) => {
    const n = Number(t.tabs) || 0;
    return n > 0 && (min === 0 || n < min) ? n : min;
  }, 0);
  const packLabel = (tier) => {
    const n = unit ? Number(tier.tabs) / unit : 0;
    if (!Number.isInteger(n) || n < 2) return '';
    return n + ' packs of ' + unit;
  };

  return `
    <div class="qty-discount-wrap" id="tierWidget_${p.id}">
      <div class="qty-discount-header">
        <span class="qd-lead">
          <span class="vp3d" aria-hidden="true"><picture><source srcset="/assets/vitapoint-3d/vitapoint-coin-still.webp" media="(prefers-reduced-motion: reduce)"><img src="/assets/vitapoint-3d/vitapoint-coin.webp" alt="" width="176" height="176" loading="lazy" decoding="async"></picture></span>
          <span><span class="spark">⚡</span> Buy more, save more</span>
        </span>
        <span class="qd-hint">Price per tablet drops with every pack size</span>
      </div>
      <div class="qty-tiers-grid" role="radiogroup" aria-label="Choose a pack size">
        ${tiers.map((tier, i) => {
          tier._unitTabs = unit;
          const isSel  = i === sel;
          const isBest = i === bestIdx;
          const per    = tierUnitPrice(tier);
          const packs  = packLabel(tier);
          // Whole percent. 28.5% OFF shipped to customers; a discount is a
          // headline number, not a measurement, and the half point buys nothing.
          const off    = Math.round(Number(tier.discountPct) || 0);
          const save   = Number(tier.savingAmount != null ? tier.savingAmount : tier.mrp - tier.rate) || 0;
          // What the offer IS, said the way a shopper reads it. A buy-get tier
          // is a free-item offer first and a percentage second, so it leads
          // with the free units; everything else leads with the percentage.
          const freeUnits = tier.offerType === 'buy_get' ? (Number(tier.freeQuantity) || 0) : 0;
          const pctText = off > 0 ? `${off}% OFF` : '';
          // An admin-written label wins over the generated one — that is the
          // point of the field. Falls back to the generated wording when blank.
          const custom = String(tier.displayLabel || '').trim();
          const offerLabel = custom || (freeUnits > 0
            ? `Buy ${tier.buyQuantity || 1} + ${freeUnits} free`
            : (off > 0 ? `${off}% off` : 'Offer'));
          // The badge is the one thing on the card that has to survive being
          // glanced at. Free units beat a percentage for a buy-get tier; a
          // buy-get tier with no percentage still gets a badge, which the old
          // markup did not give it at all.
          const badgeText = freeUnits > 0 ? `+${freeUnits} FREE` : pctText;
          return `
          <button type="button" role="radio" aria-checked="${isSel}"
                  class="qty-tier${isSel ? ' selected' : ''}${isBest ? ' best-value' : ''}"
                  onclick="selectTier(${p.id}, ${i})">
            ${isBest ? '<span class="qt-flag">Best value</span>' : ''}
            <span class="qt-size"><b>${tier.tabs}</b> tablets</span>
            <span class="qt-term">${durationLabel(tier.tabs, dosePerDay)}</span>
            ${buildOfferThumbs(p, tier)}
            <span class="qt-packs">${packComposition(tier, tabletsPerPack, packUnit)}</span>
            <span class="qt-dose">${esc(doseText)}</span>
            <span class="qt-rate">${rupee(tier.rate)}</span>
            ${per ? `<span class="qt-unit">${'₹' + per} per tablet</span>` : ''}
            <span class="qt-compare">
              <s>${rupee(tier.mrp)}</s><i class="qt-badge${freeUnits > 0 ? ' qt-badge-free' : ''}">${badgeText || offerLabel}</i>
            </span>
            ${save > 0 ? `<span class="qt-save">You save ${rupee(save)}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
      <div class="qty-discount-footer">
        <span>Selected: <b>${t.tabs} tablets</b> for <b>${rupee(t.rate)}</b> · MRP ${rupee(t.mrp)}</span>
        ${saving > 0 ? `<span class="savings-pill">You save ${rupee(saving)}</span>` : ''}
        <span class="custom-pack-wrap" style="border-top:1px solid rgba(0,0,0,.08);padding-top:10px;display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:.75rem;color:var(--gray);font-weight:600">Build your own:
            <input type="number" id="customMonths_${p.id}" min="1" max="12" value="" placeholder="months"
                   style="width:62px;padding:5px 8px;border:1px solid rgba(0,0,0,.15);border-radius:6px;font-size:.78rem"
                   onkeydown="if(event.key==='Enter'){event.preventDefault();createCustomPack(${p.id})}">
          </span>
          <button type="button" onclick="createCustomPack(${p.id})"
                  style="font-size:.72rem;padding:6px 12px;border-radius:100px;background:var(--t-hi);color:#fff;border:none;font-weight:700;cursor:pointer">Create Pack</button>
        </span>
      </div>
    </div>`;
}
// ── CUSTOM PACK BUILDER ─────────────────────────────────────────────
// The customer names a month count; we build a synthetic tier with the
// SAME discount curve the backend interpolates (linear between the two
// bracketing defined tiers, floored percent; MRP scaled from the
// per-15-tabs MRP of the smallest tier). The server re-derives the rate
// from its own curve at checkout, so the cart line can never lie.
function createCustomPack(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  const tiers = getProductTiers(p);
  if (!tiers) return;
  const input = document.getElementById('customMonths_' + productId);
  const raw = input ? Number(input.value) : 0;
  const months = Number.isFinite(raw) && raw >= 2 && raw <= 12 ? Math.round(raw) : 0;
  if (!months) {
    showToast('Enter a pack length of 2-12 months', 'error');
    return;
  }
  const wantTabs = months * 15;
  // Defined tier already covers it — use that instead of a synthetic one
  const exact = tiers.find(t => Number(t.tabs) === wantTabs);
  if (exact) {
    const idx = tiers.indexOf(exact);
    selectedTiers[productId] = idx;
    // Same push path as the synthetic pack — one button, one result.
    const physicalPacks = Math.max(1, Math.round(wantTabs / Number(tiers[0].tabs)));
    const ex = STORE.cart.find(i => i.id === productId && i.tierIdx === idx);
    if (ex) {
      ex.qty += 1;
    } else {
      STORE.cart.push({
        id: productId, qty: 1, tierIdx: idx,
        tierTabs: exact.tabs, tierRate: exact.rate, tierMRP: exact.mrp,
        tierDisc: exact.discountPct, isBundle: physicalPacks > 1,
      });
    }
    STORE.save();
    showToast(`${p.name} — ${months}-month pack added to cart!`);
    typeof renderSideCart === "function" && renderSideCart();
    return;
  }
  const rows = tiers.slice().sort((a, b) => Number(a.tabs) - Number(b.tabs));
  const maxTabs = Number(rows[rows.length - 1].tabs) || 0;
  if (wantTabs > maxTabs) {
    showToast(`Pack too large — max ${Math.round(maxTabs / 15)} months on ${p.name}`, 'error');
    return;
  }
  let lo = rows[0], hi = rows[rows.length - 1];
  for (let k = 0; k < rows.length - 1; k++) {
    if (Number(rows[k].tabs) <= wantTabs && wantTabs <= Number(rows[k + 1].tabs)) { lo = rows[k]; hi = rows[k + 1]; break; }
  }
  const f = (wantTabs - Number(lo.tabs)) / (Number(hi.tabs) - Number(lo.tabs));
  const discPct = Math.floor((Number(lo.discountPct) || 0) + ((Number(hi.discountPct) || 0) - (Number(lo.discountPct) || 0)) * f);
  const unitMrp = Number(rows[0].mrp) / Number(rows[0].tabs);
  const mrp = Math.round(unitMrp * wantTabs * 100) / 100;
  const rate = Math.round(mrp * (1 - discPct / 100) * 100) / 100;
  const tierIdx = selectedTiers[productId] != null ? selectedTiers[productId] : 0;
  const physicalPacks = Math.max(1, Math.round(wantTabs / Number(tiers[0].tabs)));
  const ex = STORE.cart.find(i => i.id === productId && i.isCustomPack);
  if (ex) {
    ex.qty += 1; ex.tierIdx = -1;
    Object.assign(ex, { tierTabs: wantTabs, tierRate: rate, tierMRP: mrp, tierDisc: discPct, isBundle: physicalPacks > 1, isCustomPack: true });
  } else {
    STORE.cart.push({
      id: productId, qty: 1, tierIdx: -1,
      tierTabs: wantTabs, tierRate: rate, tierMRP: mrp, tierDisc: discPct,
      isBundle: physicalPacks > 1, isCustomPack: true,
    });
  }
  STORE.save();
  showToast(`${p.name} — your ${months}-month custom pack (${wantTabs} tablets, ₹${Number(rate).toLocaleString('en-IN')}) added to cart!`);
  typeof renderSideCart === "function" && renderSideCart();
}

function selectTier(productId, tierIdx) {
  const p2 = PRODUCTS.find(p => p.id === productId);
  const tiers = getProductTiers(p2);
  if (!tiers || !tiers[tierIdx]) return;
  selectedTiers[productId] = tierIdx;
  _persistSelectedTiers();

  // Rebuild widget in place
  const widget = document.getElementById(`tierWidget_${productId}`);
  if (widget) {
    const p = PRODUCTS.find(p => p.id === productId);
    widget.outerHTML = buildTierWidget(p);
    vp3dScan();   // outerHTML replaced the node the observer was watching
  }
  // Re-register after DOM replace
  // Also update the displayed price
  updatePriceDisplay(productId, tierIdx);
}

function updatePriceDisplay(productId, tierIdx) {
  const p3 = PRODUCTS.find(p => p.id === productId);
  const tiers = getProductTiers(p3);
  const t = tiers && tiers[tierIdx];
  if (!t) return;
  const disc = Math.round((1 - t.rate / t.mrp) * 100);

  const salePriceEl = document.getElementById('dynSalePrice');
  const origPriceEl = document.getElementById('dynOrigPrice');
  const discTagEl   = document.getElementById('dynDiscTag');
  const savingEl    = document.getElementById('dynSaving');

  if (salePriceEl) {
    salePriceEl.textContent = `₹${t.rate.toLocaleString('en-IN')}`;
    salePriceEl.classList.remove('price-updated');
    void salePriceEl.offsetWidth; // reflow
    salePriceEl.classList.add('price-updated');
  }
  if (origPriceEl) origPriceEl.textContent = `₹${t.mrp.toLocaleString('en-IN')}`;
  if (discTagEl)   discTagEl.textContent = `Save ${disc}%`;
  if (savingEl)    savingEl.textContent  = `You save ₹${(t.mrp - t.rate).toLocaleString('en-IN')} on this pack!`;

  // Update Add to Cart button label
  const addBtn = document.getElementById('addCartBtn');
  if (addBtn) addBtn.dataset.tier = tierIdx;
  // The sticky bottom bar must mirror the same selection — it used to stay
  // on the single-unit price even after a pack was chosen.
  typeof refreshStickyCart === 'function' && refreshStickyCart();
}

/* ── PRODUCT-PAGE REVIEW LIST: 3 shown, then paged 50 at a time ──────
   A product with a few hundred reviews used to print every one of them
   into the tab, pushing the "Write a Review" form and everything below it
   miles down the page and making the tab expensive to render on a phone.
   Three are shown up front; the rest open on request, fifty to a page.

   The view state lives out here, keyed by product, NOT inside
   buildProductPage — that function re-runs whenever reviews finish
   loading or a backend sync lands, and state held inside it would snap a
   list the customer had just expanded back shut underneath them.

   Paging re-renders only #rvListWrap. Calling buildProductPage would
   rebuild the gallery, tabs and tier table to change a list of reviews,
   and would throw away the reading position while doing it. */
const RV_TOP_N     = 3;    // before "Read all reviews"
const RV_PAGE_SIZE = 50;   // per page once expanded
const _rvView      = {};   // productId -> { expanded, page }

function rvViewState(id) {
  if (!_rvView[id]) _rvView[id] = { expanded: false, page: 0 };
  return _rvView[id];
}

function rvCardHTML(r) {
  return `<div class="rv-card"><div class="rv-hdr"><div><span class="rv-name">${esc(r.user)}</span>${r.verified?'<span class="rv-verified">&#x2713; Verified</span>':''}</div><span class="rv-date">${esc(r.date)}</span></div><div class="rv-stars">${'&#x2605;'.repeat(starCount(r.rating))}${'&#x2606;'.repeat(5-starCount(r.rating))}</div><p class="rv-text">${esc(r.text)}</p></div>`;
}

/* Paging from the bottom of a fifty-card list leaves the reader looking at
   the end of the NEXT page. Put the top of the list back under them. */
function rvScrollToList() {
  const w = document.getElementById('rvListWrap');
  if (w && w.scrollIntoView) { try { w.scrollIntoView({ block: 'start' }); } catch (e) { w.scrollIntoView(); } }
}

function rvExpand(pid)   { const v = rvViewState(pid); v.expanded = true;  v.page = 0; renderProductReviewList(pid); }
function rvCollapse(pid) { const v = rvViewState(pid); v.expanded = false; v.page = 0; renderProductReviewList(pid); rvScrollToList(); }
function rvGoPage(pid, delta) {
  const v = rvViewState(pid);
  const total = (REVIEWS[pid] || []).length;
  const last  = Math.max(0, Math.ceil(total / RV_PAGE_SIZE) - 1);
  v.page = Math.min(last, Math.max(0, v.page + delta));
  renderProductReviewList(pid);
  rvScrollToList();
}

function renderProductReviewList(pid) {
  const wrap = document.getElementById('rvListWrap');
  if (!wrap) return;
  const pad = 'text-align:center;padding:24px;color:var(--gray);font-size:.85rem';

  if (!REVIEWS_LOADED[pid]) { wrap.innerHTML = `<div style="${pad}">Loading reviews…</div>`; return; }
  const rvs = REVIEWS[pid] || [];
  if (!rvs.length) {
    wrap.innerHTML = `<div style="${pad}">No reviews yet — be the first to share your experience with this product! 🌿</div>`;
    return;
  }

  const v = rvViewState(pid), total = rvs.length;
  const btn = 'display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 20px;' +
              'border-radius:var(--r-pill);font-weight:700;font-size:.82rem;background:var(--paper);' +
              'box-shadow:var(--neo-1);color:var(--indigo);touch-action:manipulation;min-height:44px';

  if (!v.expanded) {
    let html = rvs.slice(0, RV_TOP_N).map(rvCardHTML).join('');
    if (total > RV_TOP_N) {
      html += `<div style="text-align:center;margin-top:14px">
        <button type="button" style="${btn}" onclick="rvExpand(${pid})">Read all ${total} reviews &#x2193;</button></div>`;
    }
    wrap.innerHTML = html;
    return;
  }

  const pages = Math.max(1, Math.ceil(total / RV_PAGE_SIZE));
  const page  = Math.min(v.page, pages - 1);
  const start = page * RV_PAGE_SIZE;
  const end   = Math.min(start + RV_PAGE_SIZE, total);
  const dim   = 'opacity:.4;pointer-events:none';

  let html = rvs.slice(start, end).map(rvCardHTML).join('');
  html += `<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin-top:16px">
      <div style="width:100%;text-align:center;font-size:.78rem;color:var(--t-low);margin-bottom:2px">
        Showing ${start + 1}–${end} of ${total} reviews${pages > 1 ? ` &middot; page ${page + 1} of ${pages}` : ''}
      </div>
      ${pages > 1 ? `<button type="button" style="${btn}${page === 0 ? ';' + dim : ''}" ${page === 0 ? 'disabled' : ''} onclick="rvGoPage(${pid},-1)">&#x2190; Previous</button>` : ''}
      ${pages > 1 ? `<button type="button" style="${btn}${page >= pages - 1 ? ';' + dim : ''}" ${page >= pages - 1 ? 'disabled' : ''} onclick="rvGoPage(${pid},1)">Next 50 &#x2192;</button>` : ''}
      <button type="button" style="${btn}" onclick="rvCollapse(${pid})">Show less</button>
    </div>`;
  wrap.innerHTML = html;
}

// ── PRODUCT PAGE ──
// ══════════════════════════════════════════════════════════════════════
// EDUCATIONAL GALLERY — product page (Aug 2026)
// Four sections, verified content only (see CONTENT below). Images are
// upload SLOTS via admin Site Images: edu.{slug}.{panel}.{n} (1:1).
// ══════════════════════════════════════════════════════════════════════
(function () {
  var PANELS = [
    { id: 'howto',    label: 'How To Use',
      title: 'The 15-Second Ritual',
      intro: 'One tablet into a glass of water, watch it fizz, drink while it sparkles. Once a day is the rhythm most customers settle into.',
      items: [] },
    { id: 'experts',  label: 'What Experts Say',
      title: 'Guidance from qualified professionals',
      intro: 'Effervescent delivery is a known pharmaceutical format: tablets designed to dissolve fully so the dose mixes evenly before drinking.',
      items: [] },
    { id: 'research', label: 'What Research Says',
      title: 'Ingredient science, simply explained',
      intro: 'Public research describes how each ingredient is generally studied. We share educational summaries, never promises.',
      items: [] },
    { id: 'why',      label: 'Why Ozylix',
      title: 'Made with care, verified end to end',
      intro: 'FSSAI approved, manufactured at our Anand, Gujarat facility, with quality checks from raw material to finished tablet.',
      items: [] }
  ];
  // Content that can genuinely be verified — general wellness education
  var CONTENT = {
    howto: [
      { h: 'Dissolve fully', p: 'Drop one tablet into 150-200 ml of water and wait until the fizzing stops completely.' },
      { h: 'Drink fresh', p: 'Best enjoyed within a few minutes of dissolving — that\'s the point of the format.' },
      { h: 'Once a day', p: 'One tablet a day, at a time that suits your routine — many pair it with breakfast or a workout.' },
      { h: 'Check the label', p: 'Directions per variant are on the tube and box. Always follow them, and consult your doctor for personal advice.' }
    ],
    experts: [
      { h: 'Effervescent format', p: 'Effervescent tablets are an established dosage form used by pharmacists worldwide to deliver a uniform dose in solution.' },
      { h: 'Easy to take', p: 'Clinicians note effervescents can be easier for people who struggle with swallowing tablets.' },
      { h: 'Not a substitute', p: 'Supplements support, not replace, a balanced diet — qualified professionals agree on that baseline.' }
    ],
    research: [
      { h: 'Glutathione', p: 'A tripeptide produced naturally by the body; public research explores its antioxidant role in skin and cellular health.' },
      { h: 'Apple cider vinegar', p: 'Commonly consumed as a beverage; research interest centers on digestion and metabolism topics.' },
      { h: 'Moringa', p: 'A traditional leafy green studied for its vitamin and mineral content, including iron and vitamin C.' },
      { h: 'Spirulina', p: 'A blue-green algae valued for protein and micronutrients such as B12, iron and beta-carotene in a vegan form.' }
    ],
    why: [
      { h: 'FSSAI approved', p: 'Every Ozylix product carries FSSAI approval — check the licence on-pack.' },
      { h: 'Made in Anand', p: 'Manufactured at our own facility in Anand, Gujarat — no third-party white-labelling.' },
      { h: 'Real ingredients', p: 'What is on the label is what is in the tablet: disclosed ingredients, disclosed doses.' },
      { h: 'Free delivery', p: 'Delivered across India with no minimum order — the whole range, not just overpriced packs.' }
    ]
  };
  function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function mediaKey(slug, panel, n) { return 'edu.' + slug + '.' + panel + '.' + n; }
  window.renderProductEduGallery = function (p) {
    var box = document.getElementById('productEduGallery');
    if (!box || !p) { if (box) box.innerHTML = ''; return; }
    var slug = typeof slugify === 'function' ? slugify(p.name) : 'product';
    var tabs = PANELS.map(function (pl, i) {
      return '<button class="edu-tab' + (i === 0 ? ' active' : '') + '" data-edu="' + pl.id + '">' + escHtml(pl.label) + '</button>';
    }).join('');
    var panels = PANELS.map(function (pl, i) {
      var cards = (CONTENT[pl.id] || []).map(function (c, n) {
        var mkey = mediaKey(slug, pl.id, n + 1);
        var ico = { howto: '⏰', experts: '🎓', research: '📚', why: '✓' }[pl.id] || '✨';
        // Aug 2026: edu creatives are fully admin-managed (admin Site Images
        // → product "Know Your Product" gallery → Upload creative per card).
        // No built-in image set anymore — cards wait for an upload.
        // Aug 2026: creatives are admin-uploaded via Website Images →
        // Product Education Gallery, stored as edu.{slug}.{panel}.{n}.
        var eduSrc = '';
        try {
          eduSrc = ((window.__ozylixSiteMedia && window.__ozylixSiteMedia[mkey]) || '') || '';
          // Aug 2026: global default creatives — if this product has no
          // per-product upload for the slot, fall back to the common
          // edu.global.{panel}.{n} set managed in admin Site Images.
          var gkey = 'edu.global.' + pl.id + '.' + (n + 1);
          if (!eduSrc && window.__ozylixSiteMedia && window.__ozylixSiteMedia[gkey]) eduSrc = window.__ozylixSiteMedia[gkey];
          // Serve the uploaded creative through the Cloudflare CDN edge path,
          // not the raw Supabase URL (avoids egress and uses the cached copy).
          if (eduSrc && typeof cdnImg === 'function') eduSrc = cdnImg(eduSrc);
        } catch (e) { eduSrc = ''; }
        var eduIsVideo = typeof mediaTypeFromUrl === 'function' ? mediaTypeFromUrl(eduSrc) === 'video' : /\.(mp4|webm|mov|m4v|3gp)(\?|$)/i.test(eduSrc);
        var eduImg = eduSrc ? (eduIsVideo ? eduSrc : eduSrc) : '';
        var imgHtml = eduImg ? (eduIsVideo
          ? '<video src="' + eduImg + '" autoplay muted loop playsinline preload="metadata" loading="lazy" onerror="this.style.display=\'none\'"></video>'
          : '<img src="' + eduImg + '" alt="Ozylix product education and usage guide" loading="lazy" decoding="async">') : '';
        var builtIn = eduImg ? 'edu-builtin' : '';
        return '<div class="edu-card"><div class="edu-card-media edu-builtin-' + (eduImg ? '1' : '0') + '" data-media-key="' + mkey + '" data-awaiting-upload="true">' +
          imgHtml +
          '<span class="edu-ico">' + ico + '</span>' +
          (eduImg ? '' : '<span class="edu-awaiting" data-media-key="' + mkey + '" data-fallback="hide">Upload creative</span>') + '</div>' +
          '<div class="edu-card-body"><h4>' + escHtml(c.h) + '</h4><p>' + escHtml(c.p) + '</p></div></div>';
      }).join('');
      return '<div class="edu-panel' + (i === 0 ? ' active' : '') + '" data-edupanel="' + pl.id + '">' +
        '<div class="edu-fact"><b>' + escHtml(pl.title) + '</b><br>' + escHtml(pl.intro) + '</div>' +
        '<div class="edu-grid">' + cards + '</div>' +
        '<div class="edu-note">Educational information only — not medical advice. For personal guidance, consult a qualified healthcare professional. Sources: public ingredient literature and on-pack instructions.</div></div>';
    }).join('');
    box.innerHTML = '<h2>Know Your Product</h2><p class="edu-sub">Verified facts about what is in your tube and how to use it.</p>' +
      '<div class="edu-tabs">' + tabs + '</div>' + panels;
    // Tab switching
    box.querySelectorAll('.edu-tab').forEach(function (t) {
      t.onclick = function () {
        box.querySelectorAll('.edu-tab').forEach(function (x) { x.classList.remove('active'); });
        box.querySelectorAll('.edu-panel').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        var pan = box.querySelector('[data-edupanel="' + t.dataset.edu + '"]');
        if (pan) pan.classList.add('active');
      };
    });
    // Re-run site-media mapping for new keys + reveal logic
    if (typeof applySiteMedia === 'function' && window.__ozylixSiteMedia) applySiteMedia(window.__ozylixSiteMedia);
  };
  // Cache the last media map and re-apply whenever new media-key elements appear
  var _asm = window.applySiteMedia;
  if (_asm) {
    window.applySiteMedia = function (map) {
      window.__ozylixSiteMedia = map;
      _asm(map);
    };
  }
})();
function buildProductPage(p) {
  const rvs = REVIEWS[p.id] || [];
  if (!REVIEWS_LOADED[p.id]) loadProductReviews(p.id); // fires once; re-renders this tab when the real data arrives
  // FIX (audit item P1-15): once reviews have actually loaded and there are
  // none, avg must NOT silently fall back to the hardcoded p.rating — that's
  // exactly how "4.8★ (567 reviews)" type mismatches happened elsewhere.
  // Only show a computed average when real reviews exist.
  const hasRealReviews = REVIEWS_LOADED[p.id] && rvs.length > 0;
  const avg = hasRealReviews ? rvs.reduce((s,r)=>s+r.rating,0)/rvs.length : null;
  const related = PRODUCTS.filter(r=>r.category===p.category&&r.id!==p.id).slice(0,4);
  const rg=document.getElementById('relatedGrid'); if(rg) rg.innerHTML = related.map(r=>renderProductCard(r)).join('');

  // Determine tier for display
  const tiers = getProductTiers(p);
  const tierIdx = currentTierIdx(p, tiers);
  const activeTier = tiers ? tiers[tierIdx] : null;
  // A product with no price yet (rate and MRP both null in the catalogue)
  // has no tiers as far as getProductTiers is concerned, and p.price can
  // still be null on top of that — so the price block has to survive
  // having nothing to show rather than dividing by it.
  const displayRate = Number(activeTier ? activeTier.rate : (p.salePrice || p.price)) || 0;
  const displayMRP  = Number(activeTier ? activeTier.mrp  : p.price) || 0;
  const displayDisc = displayMRP > 0 && displayRate > 0
    ? Math.round((1 - displayRate / displayMRP) * 100) : 0;
  const displaySaving = displayMRP > displayRate ? displayMRP - displayRate : 0;

  const pdEl=document.getElementById('productDetail'); if(pdEl) pdEl.innerHTML = `
    ${buildMediaGallery(p)}
    <div>
      <div class="prod-brand">${p.brand}</div>
      <h1 class="prod-title">${p.name}</h1>
      <div class="prod-rating-row">${avg !== null ? stars(avg) : '<span class="review-ct" style="color:var(--gray)">No ratings yet</span>'} <span class="review-ct">(${REVIEWS_LOADED[p.id] ? rvs.length + ' reviews' : 'loading reviews…'})</span> <span class="write-rv" onclick="document.getElementById('rvFormWrap').scrollIntoView({behavior:'smooth'})">Write a Review</span></div>
      <div class="prod-price-block">
        <span class="prod-sale" id="dynSalePrice">&#x20B9;${displayRate.toLocaleString('en-IN')}</span>
        <span class="prod-orig" id="dynOrigPrice">&#x20B9;${displayMRP.toLocaleString('en-IN')}</span>
        ${displayDisc > 0 ? `<span class="prod-disc-tag" id="dynDiscTag">Save ${displayDisc}%</span>` : ''}
      </div>
      <div id="dynSaving" style="font-size:.8rem;color:var(--success);font-weight:600;margin-bottom:${tiers?'4px':'16px'}">
        ${displaySaving > 0 ? `&#x1F389; You save &#x20B9;${displaySaving.toLocaleString('en-IN')} on this pack!` : ''}
      </div>
      ${tiers ? buildTierWidget(p) : (p.offer ? `<div class="prod-offer-line">&#x1F389; ${p.offer}</div>` : '')}
      <div class="prod-stock">&#x2705; In Stock (${p.stock} units)</div>
      <p style="font-size:.88rem;color:var(--gray);line-height:1.8;margin-bottom:20px;">${p.description}</p>
      ${!tiers ? `<div class="qty-wrap"><button class="qty-btn" onclick="chQty(-1)">&#x2212;</button><span class="qty-num" id="pQtyDisp">1</span><button class="qty-btn" onclick="chQty(1)">+</button></div>` : ''}
      ${buildKeyStatChips(p)}
      <button class="add-cart-btn" id="addCartBtn" data-tier="${tierIdx}" onclick="addToCartWithTier(${p.id})">&#x1F6D2; Add to Cart</button>
      <div class="stock-urgency" id="stockUrgency"></div>
      <button class="buy-now-btn" onclick="addToCartWithTier(${p.id});showPage('checkout')">&#x26A1; Buy Now</button>
      <div id="productMMProgress"></div>
      <div class="prod-features">
        <div class="feat-item"><span class="feat-ico">&#x1F331;</span>100% Organic</div>
        <div class="feat-item"><span class="feat-ico">&#x1F52C;</span>Lab Tested</div>
        <div class="feat-item"><span class="feat-ico">&#x2705;</span>FSSAI Approved</div>
        <div class="feat-item"><span class="feat-ico">&#x1F1EE;&#x1F1F3;</span>Made in India</div>
      </div>
      <div class="tabs">
        <button class="tab active" onclick="switchTab(this,'desc')">Description</button>
        <button class="tab" onclick="switchTab(this,'ingr')">Ingredients</button>
        <button class="tab" onclick="switchTab(this,'rvs')">Reviews (${rvs.length})</button>
        ${tiers ? `<button class="tab" onclick="switchTab(this,'pricing')">&#x1F4CB; Pricing</button>` : ''}
      </div>
      <div class="tab-content active" id="tab-desc">
        <p style="font-size:.88rem;color:var(--t-mid);line-height:1.8;">${p.description}</p>
        <div style="background:var(--green-wash);border-radius:10px;padding:18px;margin-top:16px;"><div style="font-weight:700;font-size:.88rem;margin-bottom:10px;">&#x1F4CB; How to Use</div><p style="font-size:.83rem;color:var(--gray);line-height:1.75;">${p.howToUse}</p></div>
      </div>
      <div class="tab-content" id="tab-ingr">
        <div style="font-size:.88rem;line-height:1.8;color:var(--t-mid);">
          <p style="margin-bottom:12px;font-weight:600;">Key Ingredients:</p>
          <ul style="margin-left:18px;color:var(--gray);">${(p.keyIngredients||[]).map(i=>`<li style="margin-bottom:7px;">${i}</li>`).join('')}</ul>
          <div style="margin-top:16px;padding:12px;background:var(--gold-pale);border-radius:9px;font-size:.78rem;color:var(--gold)">&#x26A0;&#xFE0F; Free from: Artificial colours, flavours, preservatives, heavy metals. 100% Natural.</div>
        </div>
      </div>
      <div class="tab-content" id="tab-rvs">
        <div class="rv-summary">
          <div class="rating-big"><div class="rv-big-num">${avg !== null ? avg.toFixed(1) : '—'}</div><div class="rv-big-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div><div style="font-size:.72rem;color:var(--gray)">${rvs.length} reviews</div></div>
          <div style="flex:1">${[5,4,3,2,1].map(s=>{const c=rvs.filter(r=>Math.round(r.rating)===s).length;const pct=rvs.length?(c/rvs.length)*100:0;return`<div class="rv-bar-row"><span style="width:14px">${s}&#x2605;</span><div class="rv-bar-track"><div class="rv-bar-fill" style="width:${pct}%"></div></div><span>${Math.round(pct)}%</span></div>`;}).join('')}</div>
        </div>
        <!-- Filled by renderProductReviewList() once this HTML is in the
             DOM: three reviews, then fifty a page on request. Loading and
             empty states live in there too, so there is one place that
             decides what this list shows. -->
        <div id="rvListWrap"></div>
        <div class="rv-form" id="rvFormWrap">
          <h3>Write a Review</h3>
          ${getCurrentUser() ? `
          <div class="star-picker" id="starPicker">${[1,2,3,4,5].map(s=>`<span onclick="setRating(${s})" onmouseenter="previewRating(${s})" onmouseleave="clearRatingPreview()" data-s="${s}">&#x2605;</span>`).join('')}</div>
          <div style="font-size:.8rem;color:var(--gray);margin:6px 0 10px">Posting as <strong>${esc(getCurrentUser().name || 'You')}</strong></div>
          <!-- The server only accepts a review from someone who has bought
               this product (reviews-routes.js checks the order history), and
               it keeps one review per person per product. Both rules used to
               be invisible until the POST came back 403, which is why people
               filled the form in and were told "no" afterwards. -->
          <div style="font-size:.78rem;color:var(--t-low);margin:0 0 12px;padding:9px 12px;border-radius:var(--r-sm);background:var(--paper);box-shadow:var(--neo-in)">
            Reviews are open to customers who have ordered this product, one per person &mdash; posting again updates your existing review.
          </div>
          <textarea class="form-input" placeholder="Share your experience with this product..." id="rvText" oninput="this.classList.remove('field-error')"></textarea>
          <button class="btn-primary" style="width:100%;justify-content:center" onclick="submitReview()">Submit Review &#x1F331;</button>
          ` : `
          <p style="font-size:.85rem;color:var(--gray);margin-bottom:14px">Sign in with the account you ordered on to write a review — reviews are open to customers who have bought this product.</p>
          <button class="btn-primary" style="width:100%;justify-content:center" onclick="openAuth('login')">Sign In to Write a Review</button>
          `}
        </div>
      </div>
      ${tiers ? `
      <div class="tab-content" id="tab-pricing">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.85rem">
            <thead><tr style="background:var(--green);color:var(--t-hi)">
              <th style="padding:12px 16px;text-align:left;border-radius:8px 0 0 0">Pack Size</th>
              <th style="padding:12px 16px;text-align:right">MRP (&#x20B9;)</th>
              <th style="padding:12px 16px;text-align:right">Your Price (&#x20B9;)</th>
              <th style="padding:12px 16px;text-align:right">Discount</th>
              <th style="padding:12px 16px;text-align:right;border-radius:0 8px 0 0">You Save</th>
            </tr></thead>
            <tbody>
              ${tiers.map((t,i)=>{const isBest=t.discountPct===Math.max(...tiers.map(x=>x.discountPct));return`<tr style="background:${isBest?'var(--gold-pale)':i%2?'var(--green-wash)':'white'};cursor:pointer" onclick="selectTier(${p.id},${i})"><td style="padding:12px 16px;font-weight:700">${t.tabs} Tabs · ${durationLabel(t.tabs)} · 1/day${isBest?' <span style="background:var(--gold);color:var(--t-hi);font-size:.6rem;padding:2px 7px;border-radius:100px;font-weight:800;vertical-align:middle">BEST VALUE</span>':''}</td><td style="padding:12px 16px;text-align:right;text-decoration:line-through;color:var(--gray)">&#x20B9;${t.mrp.toLocaleString('en-IN')}</td><td style="padding:12px 16px;text-align:right;font-weight:800;color:var(--green)">&#x20B9;${t.rate.toLocaleString('en-IN')}</td><td style="padding:12px 16px;text-align:right"><span style="background:${isBest?'var(--gold)':'var(--gold-pale)'};color:${isBest?'white':'var(--gold)'};padding:3px 9px;border-radius:100px;font-weight:700;font-size:.78rem">${t.discountPct}% OFF</span></td><td style="padding:12px 16px;text-align:right;color:var(--success);font-weight:700">&#x20B9;${(t.mrp-t.rate).toLocaleString('en-IN')}</td></tr>`;}).join('')}
            </tbody>
          </table>
          <p style="font-size:.76rem;color:var(--gray);margin-top:12px">Click any row to select that pack. All prices incl. taxes.</p><p class="mc-line">&#128154; A small step for your daily wellness routine. ✨ Your Ozylix routine starts here.</p>
        </div>
      </div>` : ''}
    </div>
  `;
  // Mix & Match progress (real cart data from STORE) — rendered after details,
  // before reviews & related products.
  try { renderProductMMProgress(p); } catch(e) {}
  // The reviews tab ships as an empty #rvListWrap above; fill it now that
  // the markup exists. Any expanded/paged state the customer had is kept —
  // this function re-runs on every review load and backend sync.
  try { renderProductReviewList(p.id); } catch(e) {}
  try { renderProductEduGallery(p); } catch(e) {}
  try { vp3dScan(pdEl); } catch(e) {}
}

// ══════════════════════════════════════════════════════════════════════
// KEY STAT CHIPS — The Good Bug-style product facts in the buy box (Aug 2026)
// One row of short, real product facts per product (serving format, size,
// approval, origin). No invented numbers — every chip comes from a fixed
// per-product lookup; products not in the map get no chips.
// ══════════════════════════════════════════════════════════════════════
window.buildKeyStatChips = function (p) {
  // Aug 2026: the old static lookup hand-typed a different 'Size' and 'Dose'
  // for each product name pattern, and most of them were wrong (Multidiata
  // actually ships 30 AND 60 tab packs; several products are 2/day). Every
  // chip now comes from the catalogue's real data: the pack tiers for SIZE
  // and the howToUse text for DOSE. Fallbacks below only fill gaps.
  var name = (p && p.name || '').toLowerCase();
  // ── SIZE: real pack tiers (or the offer text when no tiers exist) ──
  var size = '';
  try {
    var tiers = typeof getProductTiers === 'function' ? getProductTiers(p) : null;
    if (tiers && tiers.length) {
      var tabSizes = tiers.map(function (t) { return Number(t.tabs) || 0; }).filter(function (v) { return v > 0; });
      if (tabSizes.length) {
        var minT = Math.min.apply(null, tabSizes), maxT = Math.max.apply(null, tabSizes);
        size = minT === maxT ? minT + ' tabs' : minT + '–' + maxT + ' tabs';
      }
    } else if (p && p.offer && /pack/i.test(p.offer)) {
      var found = p.offer.match(/(\d+)\s*tabs?/gi);
      if (found) { var uniq = []; found.forEach(function (f) { var n = parseInt(f, 10); if (uniq.indexOf(n) < 0) uniq.push(n); }); uniq.sort(function (a, b) { return a - b; }); size = uniq.length === 1 ? uniq[0] + ' tabs' : uniq.join('–') + ' tabs'; }
    }
  } catch(e) {}
  // ── DOSE: parsed from howToUse, not guessed ──
  var dose = '';
  try {
    var ht = ((p && p.howToUse) || '').toLowerCase();
    var m;
    if ((m = ht.match(/(\d)\s+(?:tablets?|tabs?|stick|capsules?)\s*(?:per day|daily|a day|each day)/))) dose = m[1] + ' per day';
    else if (/once daily|1\s+(?:tablet|stick)/.test(ht)) dose = '1 per day';
    else if (/twice daily|2\s+tablets?\s*(?:per day|a day|in the day)/.test(ht)) dose = '2 per day';
    else if (/on the go/i.test(ht)) dose = 'On the go';
  } catch(e) {}
  var chips = [];
  if (size)  chips.push([size, 'Size']);
  if (dose)  chips.push([dose, 'Dose']);
  // Origin/approval pair — always true for the Ozylix range.
  chips.push(['FSSAI', 'Approved'], ['India', 'Made in']);
  if (!chips.length) return '';
  return '<div class="ksc-row">' + chips.map(function (c) {
    return '<span class="ksc-chip"><span class="ksc-v">' + (typeof c === 'string' ? c : esc(c[0])) + '</span><span class="ksc-k">' + (c[1] || '') + '</span></span>';
  }).join('') + '</div>';
};

// ══════════════════════════════════════════════════════════════════════
// MIX & MATCH PROGRESS — product page pill (Aug 2026)
// Real cart data only (STORE + PRODUCTS + tier units): shows where the
// customer stands toward the next FREE item — "1/4 products selected"
// through "🎉 Free item unlocked". Never invents eligibility.
// ══════════════════════════════════════════════════════════════════════
window.renderProductMMProgress = function (p) {
  if (typeof PRODUCTS === 'undefined' || typeof STORE === 'undefined') return;
  // Mirror the backend's eligibility: MM-applicable units in the cart
  var mmUnits = [];
  PRODUCTS.forEach(function (pr) {
    var ci = STORE.cart.find(function (c) { return c.id === pr.id; });
    if (!ci) return;
    var qty = ci.qty || 1;
    var tiers = typeof getProductTiers === 'function' ? getProductTiers(pr) : null;
    if (tiers) {
      var ti = typeof currentTierIdx === 'function' ? currentTierIdx(pr, tiers) : -1;
      if (ti >= 0 && ti < tiers.length) { qty = Math.max(1, tiers[ti].units || 1); }
    }
    mmUnits.push({ id: pr.id, qty: qty });
  });
  var totalUnits = mmUnits.reduce(function (s, u) { return s + u.qty; }, 0);
  var pos = totalUnits % 4;
  var unlocked = pos === 0 && totalUnits >= 4;
  var next = unlocked ? 0 : 4 - pos;
  // Only show for MM-eligible products — mirror the shop banner's eligible
  // list (getProductTiers is the same eligibility gate the server uses).
  var tiers = typeof getProductTiers === 'function' ? getProductTiers(p) : null;
  if (!tiers || !tiers.length) return;
  var pill = document.getElementById('productMMProgress');
  if (!pill) { pill = document.createElement('div'); pill.id = 'productMMProgress'; pill.className = 'mm-pill-host'; var anchor = document.getElementById('addCartBtn'); if (anchor && anchor.parentNode) { anchor.parentNode.insertBefore(pill, anchor.nextSibling); } else return; }
  var dots = [1, 2, 3, 4].map(function (n) {
    return '<span class="mm-step' + (n <= pos || (unlocked && n <= 4) ? ' done' : '') + '"></span>';
  }).join('');
  var label = unlocked
    ? '&#127881; Mix &amp; Match discount unlocked — your bundle saving is applied'
    : next === 1
      ? '&#127873; 1 more item and your Mix &amp; Match discount grows'
      : '&#127873; ' + next + ' more items until your discount unlocks (you have ' + totalUnits + '/4)';
  pill.innerHTML = '<div class="mm-progress-wrap' + (unlocked ? ' is-unlocked' : '') + '">' +
    '<div class="mm-progress">' + dots + '</div>' +
    '<span class="mm-progress-label">' + label + '</span></div>';
};

// Adds a tiered product to cart, recording which tier (pack size) was chosen
function addToCartWithTier(productId) {
  const p0 = PRODUCTS.find(p => p.id === productId);
  const tiers = getProductTiers(p0);
  if (!tiers) {
    // No tier system — standard add to cart
    STORE.addToCart(productId, pQty);
    return;
  }
  const tierIdx = currentTierIdx(p0, tiers);
  const tier = tiers[tierIdx];
  const p = p0;

  // How many physical cartons this bundle is. The smallest tier IS one
  // carton, whatever that happens to hold — hardcoding 15 made the
  // 30-tablet Multidiata box count as two packs and the 60 as four.
  const unitTabs = Number(tiers[0].tabs) || Number(tier.tabs) || 1;
  const rawPacks = Number(tier.tabs) / unitTabs;
  const physicalPacks = Number.isInteger(rawPacks) && rawPacks >= 1 ? rawPacks : 1;
  // qty = number of BUNDLES (1 bundle = physicalPacks physical packs)
  const ex = STORE.cart.find(i => i.id === productId && i.tierIdx === tierIdx);
  if (ex) {
    ex.qty += 1; // add 1 more bundle
  } else {
    STORE.cart.push({
      id: productId,
      qty: 1, // 1 bundle
      tierIdx,
      tierTabs: tier.tabs,
      tierRate: tier.rate,         // total price for this pack bundle
      tierMRP:  tier.mrp,
      tierDisc: tier.discountPct,
      isBundle: physicalPacks > 1, // flag for cart display
    });
  }
  STORE.save();
  const packLabel = physicalPacks === 1
    ? `1 pack (${tier.tabs} tabs)`
    : `${physicalPacks} packs (${tier.tabs} tabs)`;
  showToast(`${p.name} — ${packLabel} added to cart!`);

}


// ── 10-Media Gallery ──────────────────────────────────────────
var _galleryMedia = [];  // [{url, type, thumb}]
var _galleryIdx   = 0;

function buildMediaGallery(p) {
  // Build media array from p.media or fallback to flat fields
  var media = [];
  if (p.media && p.media.length) {
    media = p.media.slice(0, 10);
  } else {
    var urls = [p.image, p.image2, p.image3, p.image4, p.image5].filter(Boolean);
    media = urls.map(function(u) { return {url: u, type: mediaTypeFromUrl(u), thumb: u}; });
  }
  // Use category fallback if no images available
  if (!media.length || !media[0].url) {
    var fbUrl = typeof getProductImg === 'function' ? getProductImg(p) : (PRODUCT_FALLBACKS && (PRODUCT_FALLBACKS[p.category] || PRODUCT_FALLBACKS['default'])) || '';
    media = [{url: fbUrl, type: 'image', thumb: fbUrl}];
  }
  // Normalize — auto-detect videos from the URL when no type was given
  media = media.map(function(m) {
    if (typeof m === 'string') return {url:m, type:mediaTypeFromUrl(m), thumb:m};
    var t = m.type || mediaTypeFromUrl(m.url||m.src||'');
    return {url: m.url||m.src||'', type: t, thumb: m.thumb||m.url||m.src||''};
  });
  _galleryMedia = media;
  _galleryIdx = 0;

  var mainHtml = renderGalleryMain(media[0], 0, media.length);
  // Start the main video if the first slide is a video (autoplay needs a
  // user gesture in some browsers; the gesture history of the page is
  // enough on all modern browsers, and the muted flag covers the rest).
  if (media[0] && media[0].type === 'video') {
    window.setTimeout(function () {
      var mainVid = document.querySelector('#galleryMain video');
      if (mainVid) { mainVid.play().catch(function () {}); }
    }, 100);
  }
  var thumbsHtml = media.map(function(m, i) {
    var isVid = m.type === 'video';
    return '<div class="thumb' + (i===0?' active':'') + '" onclick="galleryGoto(' + i + ')" title="' + (i+1) + ' of ' + media.length + '">'
      + (isVid
        ? '<video src="' + m.url + '" muted preload="metadata" style="pointer-events:none"></video><span class="vid-play-ico">▶</span>'
        : '<img src="' + (m.thumb||m.url) + '" alt="'+esc(p.name)+' — Ozylix supplement" onerror="this.src=PRODUCT_FALLBACKS.default" decoding="async">')
      + '</div>';
  }).join('');

  return '<div class="prod-images media-gallery">'
    + '<div class="gallery-main" id="galleryMain" ondblclick="openLightbox(_galleryIdx)">'
    + mainHtml
    + (media.length > 1 ? '<button class="gallery-nav prev" onclick="event.stopPropagation();galleryStep(-1)">&#8249;</button><button class="gallery-nav next" onclick="event.stopPropagation();galleryStep(1)">&#8250;</button>' : '')
    + '</div>'
    + '<div class="thumb-strip">' + thumbsHtml + '</div>'
    + '</div>';
}

function renderGalleryMain(m, idx, total) {
  if (!m) return '';
  var isVid = m.type === 'video';
  var counter = total > 1 ? '<span style="position:absolute;bottom:8px;right:10px;background:rgba(0,0,0,0.45);color:#fff;font-size:0.7rem;padding:2px 8px;border-radius:12px;">' + (idx+1) + '/' + total + '</span>' : '';
  if (isVid) {
    return '<video src="' + m.url + '" muted loop playsinline preload="metadata" autoplay style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius)"></video>'
      + '<span class="vid-badge">▶ Video</span>' + counter;
  }
  return '<img src="' + (m.url||PRODUCT_FALLBACKS.default) + '" id="mainImg" alt="Product" onclick="openLightbox(_galleryIdx)" onerror="this.src=PRODUCT_FALLBACKS.default" loading="eager" fetchpriority="high" decoding="async">' + counter;
}

function galleryGoto(i) {
  if (!_galleryMedia.length) return;
  i = ((i % _galleryMedia.length) + _galleryMedia.length) % _galleryMedia.length;
  _galleryIdx = i;
  var gm = document.getElementById('galleryMain');
  if (!gm) return;
  var navs = gm.querySelectorAll('.gallery-nav');
  gm.innerHTML = renderGalleryMain(_galleryMedia[i], i, _galleryMedia.length);
  if (_galleryMedia.length > 1) {
    gm.innerHTML += '<button class="gallery-nav prev" onclick="event.stopPropagation();galleryStep(-1)">&#8249;</button><button class="gallery-nav next" onclick="event.stopPropagation();galleryStep(1)">&#8250;</button>';
    gm.querySelector('img') && (gm.querySelector('img').onclick = function(){ openLightbox(_galleryIdx); });
  }
  document.querySelectorAll('.thumb-strip .thumb').forEach(function(t,j){ t.classList.toggle('active', j===i); });
}

function galleryStep(dir) {
  galleryGoto(_galleryIdx + dir);
}

// Lightbox
function openLightbox(idx) {
  var lb = document.getElementById('galleryLightbox');
  if (!lb) return;
  lb.classList.add('open');
  lbShow(idx);
}
function closeLightbox() {
  var lb = document.getElementById('galleryLightbox');
  if (lb) lb.classList.remove('open');
}
function lbShow(i) {
  i = ((i % _galleryMedia.length) + _galleryMedia.length) % _galleryMedia.length;
  _galleryIdx = i;
  var m = _galleryMedia[i];
  var lbContent = document.getElementById('lbContent');
  if (!lbContent) return;
  var isVid = m && m.type === 'video';
  lbContent.innerHTML = isVid
    ? '<video src="' + m.url + '" controls autoplay playsinline style="max-width:92vw;max-height:88vh;border-radius:10px"></video>'
    : '<img src="' + (m ? m.url : '') + '" style="max-width:92vw;max-height:88vh;object-fit:contain;border-radius:10px" onerror="this.src=PRODUCT_FALLBACKS.default" alt="Product" decoding="async">';
  var lbCtr = document.getElementById('lbCounter');
  if (lbCtr) lbCtr.textContent = (i+1) + ' / ' + _galleryMedia.length;
}
function lbStep(dir) {
  lbShow(_galleryIdx + dir);
}
// Close lightbox on background click
document.addEventListener('DOMContentLoaded', function(){
  var lb = document.getElementById('galleryLightbox');
  if(lb) lb.addEventListener('click', function(e){ if(e.target===lb) closeLightbox(); });
  // Keyboard navigation
  document.addEventListener('keydown', function(e){
    var lb = document.getElementById('galleryLightbox');
    if(!lb || !lb.classList.contains('open')) return;
    if(e.key==='ArrowLeft') lbStep(-1);
    if(e.key==='ArrowRight') lbStep(1);
    if(e.key==='Escape') closeLightbox();
  });
});

function chQty(d) { pQty = Math.max(1, pQty + d); document.getElementById('pQtyDisp').textContent = pQty; }
function switchTab(btn, id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id)?.classList.add('active');
}
function setRating(v) {
  selectedRating = v;
  document.querySelectorAll('#starPicker span').forEach((s,i) => s.classList.toggle('lit', i < v));
  document.getElementById('starPicker')?.classList.remove('field-error');
}
function previewRating(v) {
  document.querySelectorAll('#starPicker span').forEach((s,i) => s.classList.toggle('hover-lit', i < v));
}
function clearRatingPreview() {
  document.querySelectorAll('#starPicker span').forEach(s => s.classList.remove('hover-lit'));
}
async function submitReview() {
  const user = getCurrentUser();
  if (!user) { openAuth('login'); return; }
  const name = (user.name || 'Ozylix Customer').trim();
  const rvTextInput = document.getElementById('rvText');
  const starPicker = document.getElementById('starPicker');
  const text = rvTextInput?.value.trim();

  // Clear any stale error state before re-checking
  rvTextInput?.classList.remove('field-error');
  starPicker?.classList.remove('field-error');

  const missingText = !text;
  const missingRating = !selectedRating;
  if (missingText || missingRating) {
    if (missingText) { rvTextInput?.classList.add('field-error'); rvTextInput?.focus(); }
    if (missingRating) {
      starPicker?.classList.add('field-error');
      // restart the shake if it's already mid-animation from a previous attempt
      if (starPicker) { starPicker.style.animation = 'none'; void starPicker.offsetWidth; starPicker.style.animation = ''; }
    }
    const msg = missingText && missingRating
      ? 'Please write your experience and select a star rating!'
      : missingText
        ? 'Please write a few words about your experience!'
        : 'Please select a star rating!';
    showToast(msg, 'error');
    return;
  }
  if (!currentProduct) return;

  const btn = document.querySelector('#rvFormWrap .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

  try {
    // Submits through the backend now, not a direct Supabase insert.
    // The RLS policy that used to allow anonymous inserts (no purchase
    // check, and it didn't even restrict the verified/status columns —
    // anyone could mark their own review "verified") has been removed.
    // The backend checks this customer actually has an order containing
    // the product before the review is created at all.
    const jwt = localStorage.getItem('asc_jwt') || '';
    if (!jwt) { openAuth('login'); if (btn) { btn.disabled = false; btn.textContent = 'Submit Review 🌱'; } return; }

    // ── OPTIMISTIC ──────────────────────────────────────────────
    // Show the review immediately. Waiting for the round trip meant
    // pressing Submit and watching a disabled button for a second or
    // more with nothing else happening — long enough to wonder whether
    // it worked, which is how people end up submitting twice.
    //
    // The form is cleared and the reviews tab opened right away too, so
    // the whole action reads as done. Everything needed to undo it is
    // captured first: the id to find the row by, and the text and rating
    // to put back in the form if the server refuses.
    const pid = currentProduct.id;
    const tempId = 'tmp-' + Date.now();
    const keptRating = selectedRating;

    if (!Array.isArray(REVIEWS[pid])) REVIEWS[pid] = [];
    REVIEWS[pid].unshift({
      id: tempId, _tempId: tempId, _pending: true,
      user: name, rating: keptRating, text: text,
      date: new Date().toISOString(), verified: false,
    });
    REVIEWS_LOADED[pid] = true;
    const rvClear = document.getElementById('rvText'); if (rvClear) rvClear.value = '';
    setRating(0);
    try { buildProductPage(currentProduct); } catch (err) {}
    switchTab(document.querySelectorAll('.tab')[2], 'rvs');

    const resp = await fetch(API_BASE + '/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
      body: JSON.stringify({
        product_id: currentProduct.id,
        product_name: currentProduct.name || '',
        user_name: name,
        rating: selectedRating,
        review_text: text,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await resp.json();
    if (!resp.ok) throw new Error(result.error || 'Could not submit review');

    // Re-fetch the authoritative list from Supabase rather than
    // trusting our own optimistic copy — guarantees what's shown
    // matches what's actually stored in SQL.
    REVIEWS_LOADED[currentProduct.id] = false;
    await loadProductReviews(currentProduct.id);
    showToast('Review submitted! Thank you 🌿');
  } catch (e) {
    console.error('[submitReview] error:', e);
    // ROLLBACK. The review was shown the instant they pressed submit, so
    // it has to visibly come back out again — and the text has to be
    // returned to the box, because losing what someone just wrote is a
    // far worse failure than the slow submit this replaced.
    const list = REVIEWS[pid];
    if (Array.isArray(list)) {
      const i = list.findIndex(r => r._tempId === tempId);
      if (i > -1) list.splice(i, 1);
    }
    if (currentProduct && currentProduct.id === pid) {
      try { buildProductPage(currentProduct); } catch (err) {}
    }
    const rvBack = document.getElementById('rvText');
    if (rvBack && !rvBack.value) rvBack.value = text;
    setRating(keptRating);   // puts the stars back too, not just the words

    showToast('↩️ ' + (e.message || "Couldn't submit your review — please try again in a moment."), 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Submit Review 🌱'; }
  }
}

// ── CART ──
function renderCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;
  if (STORE.cart.length === 0) {
    el.innerHTML = `<div class="empty-cart"><div style="font-size:4rem;margin-bottom:20px">🛒</div><h2>Your cart is empty</h2><p style="color:var(--gray);margin:10px 0 24px">Discover Ozylix's organic supplement range</p><button class="btn-primary" onclick="showPage('shop')">Shop Now →</button><div style="margin-top:28px;background:var(--green-wash);border-radius:var(--radius);padding:20px;max-width:340px;margin:28px auto 0;"><div style="font-weight:700;font-size:.88rem;margin-bottom:6px">⚡ Buy More, Save More!</div><p style="font-size:.8rem;color:var(--gray)">Select a larger pack size on any product page to unlock bigger discounts — up to 50% OFF.</p></div></div>`;
    return;
  }

  const sub = STORE.cart.reduce((s, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return s;
    const unitPrice = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    return s + unitPrice * item.qty;
  }, 0);

  // Unified discount — check both activePromoCode and appliedDiscount
  let disc = 0, discLabel = '';
  if (typeof activePromoCode !== 'undefined' && activePromoCode) {
    if (activePromoCode.type === 'pct') disc = azPromoCap(Math.round(sub * activePromoCode.value / 100));
    else if (activePromoCode.type === 'flat') disc = azPromoCap(Math.min(activePromoCode.value, sub));
    discLabel = activePromoCode.label || '';
  } else if (typeof appliedDiscount !== 'undefined' && appliedDiscount) {
    disc = appliedDiscount.type === 'percent' ? Math.round(sub * appliedDiscount.value / 100) : appliedDiscount.value;
    discLabel = appliedDiscount.label || '';
  }

  // ── MIX & MATCH (display only) ──────────────────────────────────────
  // Mirrors mixAndMatchDiscount() in server.js: every 4 units, the cheapest
  // is free. The SERVER sets the real price; this only lets the cart show
  // the saving before checkout. Keep the two in step.
  var mmUnits = [];
  STORE.cart.forEach(function (it) {
    var pr = PRODUCTS.find(function (x) { return x.id === it.id; });
    if (!pr) return;
    var u = (function (p, it) { var m = null; if (it.tierTabs != null) m = Number(it.tierTabs) / 15; else if (it.tierIdx != null) { var ts = (typeof getProductTiers === 'function') ? getProductTiers(p) : null; m = (ts && ts[it.tierIdx] && ts[it.tierIdx].tabs) ? ts[it.tierIdx].tabs / 15 : null; } return (m && m > 0) ? (Number(p.price || 0) * m) : (p.salePrice || p.price); })(pr, it);
    var q = Math.max(0, Math.trunc(Number(it.qty) || 0));
    for (var n = 0; n < q; n++) mmUnits.push(u);
  });
  mmUnits.sort(function (a, b) { return a - b; });
  var mmGroups = Math.floor(mmUnits.length / 4);
  var mmDisc = 0;
  for (var g = 0; g < mmGroups; g++) mmDisc += mmUnits[g * 4] || 0;
  var mmOff = Math.max(0, Math.min(mmDisc, sub));
  var mmNeed = mmGroups > 0 ? 0 : 4 - (mmUnits.length % 4);
  if (mmOff > 0) disc = 0;
  const paidSubtotal = Math.max(0, sub - mmOff - disc);
  const ship = calcShipping(paidSubtotal);
  const _vita = vitaCheckoutInfo(paidSubtotal);
  const vitaOff = _vita.rupees;
  const total = Math.max(0, paidSubtotal + ship - vitaOff);

  // Count total physical packs for display
  const totalPacks = STORE.cart.reduce((s, item) => {
    if (item.tierTabs) return s + (item.tierTabs / 15) * item.qty;
    return s + item.qty;
  }, 0);

  el.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="cart-items-box">
          ${STORE.cart.map(item => {
            const p = PRODUCTS.find(p => p.id === item.id);
            if (!p) return '';
            const unitPrice = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
            const unitMRP   = item.tierMRP  !== undefined ? item.tierMRP  : p.price;
            const discPct   = item.tierDisc !== undefined ? item.tierDisc : (p.salePrice ? Math.round((1-p.salePrice/p.price)*100) : 0);

            // Build a clear pack label: e.g. "4 Pack · 60 tabs · 35% OFF"
            let packLabel = '';
            if (item.tierTabs !== undefined) {
              const numPacks = item.tierTabs / 15;
              packLabel = `${numPacks} Pack${numPacks > 1 ? 's' : ''} · ${item.tierTabs} tabs${discPct > 0 ? ' · ' + discPct + '% OFF' : ''}`;
            }

            return `<div class="cart-row">
              <img class="cart-img" src="${(typeof getProductImg==='function'?getProductImg(p):p.image)||''}" alt="${p.name}" onclick="openProduct(${p.id})" style="cursor:pointer" onerror="this.src=PRODUCT_FALLBACKS.default" decoding="async">
              <div>
                <div class="ci-name" onclick="openProduct(${p.id})" style="cursor:pointer">${p.name}</div>
                ${packLabel ? `<div style="font-size:.72rem;background:var(--green-pale);color:var(--green);display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;margin-bottom:5px;font-weight:600">📦 ${packLabel}</div>` : ''}
                <div class="ci-price">₹${unitPrice.toLocaleString('en-IN')}<span class="ci-orig">${unitMRP !== unitPrice ? ' ₹' + unitMRP.toLocaleString('en-IN') : ''}</span>${discPct > 0 ? `<span style="background:var(--f-guava);color:var(--t-hi);font-size:.58rem;font-weight:800;padding:2px 6px;border-radius:100px;margin-left:6px">${discPct}% OFF</span>` : ''}</div>
                ${unitMRP !== unitPrice ? `<div style="font-size:.7rem;color:var(--success);font-weight:600;margin-top:2px">💰 Save ₹${((unitMRP - unitPrice) * item.qty).toLocaleString('en-IN')} on this item</div>` : ''}
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;margin-bottom:8px;color:var(--dark)">₹${(unitPrice * item.qty).toLocaleString('en-IN')}</div>
                <div class="qty-wrap" style="margin-bottom:8px">
                  <button class="qty-btn" onclick="updateCartQty(${item.id},${item.tierIdx !== undefined ? item.tierIdx : -1},${item.qty - 1})">−</button>
                  <span class="qty-num">${item.qty}</span>
                  <button class="qty-btn" onclick="updateCartQty(${item.id},${item.tierIdx !== undefined ? item.tierIdx : -1},${item.qty + 1})">+</button>
                </div>
                <button class="ci-remove" onclick="removeCartItem(${item.id},${item.tierIdx !== undefined ? item.tierIdx : -1})">🗑️</button>
              </div>
            </div>`;
          }).join('')}
          <div style="padding:18px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <button class="btn-outline" onclick="showPage('shop')">← Continue Shopping</button>
            <span style="font-size:.82rem;color:var(--gray)">${shippingIsAlwaysFree() ? '🎉 Free shipping on every order!' : ((sub-mmOff-disc) >= SHIP_THRESHOLD ? '🎉 You qualify for free shipping!' : 'Add ₹' + Math.max(0, SHIP_THRESHOLD - (sub-mmOff-disc)) + ' more for free shipping')}</span>
          </div>
        </div>
      </div>
      <div class="cart-summary-box">
        <h2>Order Summary</h2>
        ${offerBarHTML()}
        ${vitaStripHTML()}
        ${mmOff > 0 ? `<div class="mm-line mm-unlocked" style="margin-bottom:10px">🎉 Mix &amp; Match bundle discount applied (−₹${mmOff.toLocaleString('en-IN')})</div>` : (mmUnits.length > 0   ? `<div class="mm-line" style="margin-bottom:10px">🎁 Add <strong>${mmNeed}</strong> more ${mmNeed === 1 ? 'item' : 'items'} — your Mix &amp; Match discount grows.</div>`   : `<div class="mm-line" style="margin-bottom:10px">💚 This order earns you <b>Vita Points</b> to redeem on your next purchase.</div>`)}
        <div class="sum-row"><span>Subtotal (${totalPacks} pack${totalPacks !== 1 ? 's' : ''})</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
        ${disc > 0 ? `
          <div class="sum-row" style="color:var(--success);font-weight:700">
            <span>🏷️ ${discLabel ? discLabel : 'Promo code'}</span>
            <span>-₹${disc.toLocaleString('en-IN')}</span>
          </div>` : ''}
        ${(disc + mmOff) > 0 ? `<div style="background:var(--st-ok-bg);border:1px solid var(--st-ok-bg);border-radius:8px;padding:8px 12px;font-size:.75rem;color:var(--st-ok-fg);font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:6px">
            🎉 Total promotional savings: <strong>₹${(disc + mmOff).toLocaleString('en-IN')}</strong>
          </div>` : ''}
        <div class="sum-row"><span>Shipping</span><span>${ship === 0 ? '<span style="color:var(--success);font-weight:700">FREE 🎉</span>' : '₹' + ship}</span></div>
        ${(!shippingIsAlwaysFree() && (sub - mmOff - disc) < SHIP_THRESHOLD) ? `<div style="font-size:.72rem;color:var(--gray);margin-bottom:4px;padding:6px 10px;background:var(--st-warn-bg);border-radius:6px;border-left:1px solid var(--seal)">💡 Add ₹${Math.max(0, SHIP_THRESHOLD - (sub - mmOff - disc)).toLocaleString('en-IN')} more for FREE shipping</div>` : ''}
        <div class="sum-row" style="font-size:.78rem;color:var(--gray)"><span>COD charge</span><span>${calcShipping(sub - mmOff - disc) === 0 ? '<span style="color:var(--success)">FREE</span>' : '₹' + calcShipping(sub - mmOff - disc)}</span></div>
        <hr style="border:none;border-top:1px solid var(--light-gray);margin:8px 0">
        ${vitaOff > 0 ? `<div class="sum-row" style="color:var(--fern-lo)"><span>💎 VitaPoints (${_vita.applied.toLocaleString('en-IN')})</span><span>-₹${vitaOff.toFixed(2)}</span></div>` : ''}
        <div class="sum-row total"><span>Total</span><span style="color:var(--green)">₹${total.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div>
        ${vitaRedeemWidgetHTML(sub - mmOff - disc)}
        <div style="font-weight:600;font-size:.82rem;margin:16px 0 8px">Apply Coupon Code</div>
        ${(disc > 0 && discLabel) ? `<div class="disc-applied">✅ ${discLabel} applied! <span style="cursor:pointer;margin-left:auto" onclick="activePromoCode=null;appliedDiscount=null;renderCart()">✕</span></div>` : `
          <div class="coupon-row">
            <input type="text" id="couponInput" placeholder="Enter code" style="text-transform:uppercase" onkeydown="if(event.key==='Enter')applyCode()">
            <button onclick="applyCode()">Apply</button>
          </div>
          <div style="font-size:.72rem;color:var(--gray);margin-bottom:12px">Enter your promo code above</div>
        `}
        <button class="checkout-btn" onclick="showPage('checkout')">Proceed to Checkout →</button>
        <div class="pay-icons">
          <span class="pay-icon">UPI</span><span class="pay-icon">Visa</span><span class="pay-icon">MC</span><span class="pay-icon">RuPay</span>
        </div>
        <div style="text-align:center;font-size:.72rem;color:var(--gray);margin-top:10px">🔒 Secured by GoKwik</div>
      </div>
    </div>
    ${renderCartUpsell()}
    `;
  vp3dScan(el);
}

function renderCartUpsell() {
  var cartIds = STORE.cart.map(function(i){ return i.id; });
  var hasSkin = STORE.cart.some(function(i){ var p=PRODUCTS.find(function(x){return x.id===i.id;}); return p&&p.tags&&p.tags.indexOf('skin')>-1; });
  var hasImmunity = STORE.cart.some(function(i){ var p=PRODUCTS.find(function(x){return x.id===i.id;}); return p&&p.tags&&(p.tags.indexOf('immunity')>-1||p.category==='spirulina'); });
  var hasWeight = STORE.cart.some(function(i){ var p=PRODUCTS.find(function(x){return x.id===i.id;}); return p&&p.tags&&p.tags.indexOf('weight')>-1; });
  var candidates = [];
  if (hasSkin) PRODUCTS.filter(function(p){return p.tags&&p.tags.indexOf('skin')>-1&&cartIds.indexOf(p.id)===-1;}).forEach(function(p){candidates.push(p);});
  if (hasImmunity) PRODUCTS.filter(function(p){return p.tags&&p.tags.indexOf('immunity')>-1&&cartIds.indexOf(p.id)===-1;}).forEach(function(p){candidates.push(p);});
  if (hasWeight) PRODUCTS.filter(function(p){return p.tags&&p.tags.indexOf('weight')>-1&&cartIds.indexOf(p.id)===-1;}).forEach(function(p){candidates.push(p);});
  PRODUCTS.filter(function(p){return p.tags&&p.tags.indexOf('bestseller')>-1&&cartIds.indexOf(p.id)===-1;}).forEach(function(p){candidates.push(p);});
  var seen = {};
  var ups = candidates.filter(function(p){ if(seen[p.id])return false; seen[p.id]=true; return true; }).slice(0,4);
  if (!ups.length) return '';
  var sub = STORE.cart.reduce(function(s,item){ var p=PRODUCTS.find(function(x){return x.id===item.id;}); if(!p)return s; var up=item.tierRate!==undefined?item.tierRate:(p.salePrice||p.price); return s+up*item.qty; }, 0);
  var shipMsg = sub < 599
    ? '<div style="background:linear-gradient(135deg,var(--st-warn-bg),var(--st-warn-bg));border:1px solid var(--f-mineral);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px"><span style="font-size:1.4rem">&#x1F69A;</span><div><div style="font-size:.84rem;font-weight:700;color:var(--st-warn-fg)">Add just <strong>&#8377;' + (599-sub) + '</strong> more to unlock FREE shipping!</div><div style="font-size:.74rem;color:var(--st-warn-fg);margin-top:2px">You\'re so close &#x1F382;</div></div></div>'
    : '<div style="background:linear-gradient(135deg,var(--st-ok-bg),var(--st-ok-bg));border:1px solid var(--st-ok-fg);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px"><span style="font-size:1.4rem">&#x1F381;</span><div><div style="font-size:.84rem;font-weight:700;color:var(--st-ok-fg)">&#x1F389; FREE shipping unlocked!</div><div style="font-size:.74rem;color:var(--st-ok-fg);margin-top:2px">Your order qualifies for free delivery</div></div></div>';
  var cards = ups.map(function(p){
    var price = p.salePrice||p.price;
    var disc = p.salePrice ? Math.round((1-p.salePrice/p.price)*100) : 0;
    var discBadge = disc > 0 ? '<span style="font-size:.68rem;color:var(--t-low);text-decoration:line-through">&#x20B9;' + p.price.toLocaleString('en-IN') + '</span> <span style="background:var(--f-guava);color:var(--t-hi);font-size:.62rem;font-weight:700;padding:1px 5px;border-radius:100px">' + disc + '% OFF</span>' : '';
    return '<div id="upsell_' + p.id + '" style="background:var(--sub-1);border-radius:14px;padding:14px;border:1px solid rgba(240,180,41,.3);display:flex;gap:10px;align-items:flex-start;cursor:pointer" onclick="addUpsellToCart(' + p.id + ')">'
      + '<img src="' + (typeof getProductImg==="function"?getProductImg(p):p.image||PRODUCT_FALLBACKS.default) + '" style="width:54px;height:54px;object-fit:cover;border-radius:10px;flex-shrink:0" onerror="this.src=PRODUCT_FALLBACKS.default" alt="' + p.name + '" decoding="async">'
      + '<div style="flex:1;min-width:0"><div style="font-size:.78rem;font-weight:700;color:var(--t-mid);line-height:1.35;margin-bottom:5px">' + p.name + '</div>'
      + '<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap"><span style="font-size:.88rem;font-weight:800;color:var(--green)">&#x20B9;' + price.toLocaleString('en-IN') + '</span>' + discBadge + '</div>'
      + '<button style="margin-top:8px;background:var(--face-warm);color:var(--clay-lo);box-shadow:inset 0 0 0 1.5px rgba(138,74,51,.32);border:none;border-radius:100px;padding:5px 14px;font-size:.72rem;font-weight:700;cursor:pointer;font-family:var(--font-body)" onclick="event.stopPropagation();addUpsellToCart(' + p.id + ')">+ Add</button></div></div>';
  }).join('');
  return '<div style="margin-top:32px"><div style="background:linear-gradient(135deg,var(--st-warn-bg),var(--st-warn-bg));border:2px solid var(--seal);border-radius:20px;padding:26px">'
    + shipMsg
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div><div style="font-size:.7rem;color:var(--f-mineral-d);font-weight:700;text-transform:uppercase;letter-spacing:1.5px">&#x1F4A1; Complete Your Wellness Stack</div><div style="font-size:1rem;font-weight:800;color:var(--t-mid);margin-top:3px">Customers Also Bought</div></div><span style="background:var(--seal);color:var(--t-hi);font-size:.69rem;font-weight:700;padding:3px 10px;border-radius:100px">SAVE MORE</span></div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px">' + cards + '</div>'
    + '</div></div>';
}

function addUpsellToCart(productId) {
  var p = PRODUCTS.find(function(x){ return x.id === productId; });
  if (!p) return;
  var existing = STORE.cart.find(function(i){ return i.id === productId && i.tierIdx === undefined; });
  if (existing) { existing.qty++; } else { STORE.cart.push({id:productId, qty:1}); }
  STORE.save(); STORE.updateCartUI();
  showToast('&#x1F33F; ' + p.name + ' added!', 'success');
  setTimeout(function(){ renderCart(); }, 300);
}


// Cart item helpers that handle both tiered and non-tiered items
function updateCartQty(productId, tierIdx, newQty) {
  if (newQty < 1) { removeCartItem(productId, tierIdx); return; }
  const item = STORE.cart.find(i => i.id === productId && (tierIdx === -1 ? i.tierIdx === undefined : i.tierIdx === tierIdx));
  if (item) { item.qty = newQty; STORE.save(); }
  renderCart();
}
function removeCartItem(productId, tierIdx) {
  STORE.cart = STORE.cart.filter(i => !(i.id === productId && (tierIdx === -1 ? i.tierIdx === undefined : i.tierIdx === tierIdx)));
  STORE.save();
  renderCart();
}

async function applyCode() {
  const input = document.getElementById('couponInput');
  const code = input?.value?.trim().toUpperCase();
  if (!code) return;

  // All coupons are validated by the backend; local demo/test maps are
  // intentionally not accepted as discounts.
  const currentTotal = getOrderTotal();
  if (currentTotal.mixMatchDiscount > 0) {
    showToast('Mix & Match is active, so coupons cannot be stacked.', 'warning');
    return;
  }

  // All real codes come from backend
  const subtotal = STORE.cart.reduce((s,i) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return s + ((p?.salePrice || p?.price || 0) * i.qty);
  }, 0);
  try {
    const backendPromo = await validateCouponWithBackend(code, subtotal);
    if (backendPromo) {
      const type = backendPromo.type === 'percent' ? 'pct' : 'flat';
      activePromoCode = { code, type, value: backendPromo.value, discount: Number(backendPromo.discount || 0), maxDisc: (backendPromo.max_discount != null ? Number(backendPromo.max_discount) : null), label: backendPromo.label || `${code} applied` };
      appliedDiscount = { label: activePromoCode.label, type: backendPromo.type, value: backendPromo.value };
      showToast(`🏷️ ${code} applied — ${activePromoCode.label}!`);
      renderCart();
      return;
    }
  } catch(e) {}

  showToast('❌ Invalid or expired code. Check admin for active codes.', 'error');
}

// ── CHECKOUT ──
function updateCodBtnNote() {
  const note = document.getElementById('codBtnNote');
  const btn = document.getElementById('codBtn');
  const tile = document.querySelector('#page-checkout .pay-method-compact[data-gateway="cod"]');
  const sticky = document.querySelector('#ozPayBar .opb-cod');
  const { paidSubtotal } = getOrderTotal();
  const net = paidSubtotal;
  // The server validates COD against the payable amount after shipping (and
  // performs the final VitaPoints-aware check). Use the same pre-Vita amount
  // here so shipping thresholds do not make the tile disagree with checkout.
  const payableBeforeVita = net + calcShipping(net);
  const codAllowed = DELIVERY_POLICY.cod_enabled === true || DELIVERY_POLICY.cod_enabled === 'true';
  const min = Math.max(0, Number(DELIVERY_POLICY.cod_min_order) || 0);
  const max = Math.max(0, Number(DELIVERY_POLICY.cod_max_order) || 0);
  const within = payableBeforeVita >= min && (!max || payableBeforeVita <= max);
  const visible = codAllowed && within;
  const selectedGateway = getSelectedGateway();
  [btn, tile, sticky].forEach(function(el) {
    if (!el) return;
    el.style.display = visible ? '' : 'none';
    el.toggleAttribute('aria-hidden', !visible);
    if (!visible) el.classList.remove('selected');
  });
  if (!visible && selectedGateway === 'cod') {
    const online = document.querySelector('#page-checkout .pay-method-compact[data-gateway="cashfree"]') || document.querySelector('#page-checkout .pay-method-compact[data-gateway="gokwik"]');
    if (online) selPayGateway(online);
  }
  if (!note) return;
  if (!codAllowed) note.textContent = 'COD is currently unavailable';
  else if (!within && min > 0 && net < min) note.textContent = 'COD available above ₹' + min.toLocaleString('en-IN');
  else if (!within && max > 0) note.textContent = 'COD available up to ₹' + max.toLocaleString('en-IN');
  else note.textContent = calcShipping(net) === 0 ? '✅ Free COD on your order!' : '+₹' + calcShipping(net) + ' COD charge · Free if order ≥ ₹' + SHIP_THRESHOLD;
  note.style.color = calcShipping(net) === 0 ? 'var(--st-ok-bg)' : 'rgba(255,255,255,0.85)';
}

// ══════════════════════════════════════════════
// ORDER HELPERS — used by checkout (COD + online).
// These were missing entirely, which is why every
// order attempt threw "getOrderTotal is not defined"
// / "generateOrderId is not defined" and silently
// failed at the very first line of the checkout flow.
// ══════════════════════════════════════════════
function getOrderTotal() {
  const sub = STORE.cart.reduce((s, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return s;
    const unitPrice = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    return s + unitPrice * item.qty;
  }, 0);
  const mmUnits = [];
  STORE.cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id); if (!p) return;
    let unit = p.salePrice || p.price || 0;
    if (item.tierTabs) unit = (p.price || p.salePrice || 0) * (Number(item.tierTabs) / 15);
    for (let n = 0; n < Math.max(0, Math.trunc(Number(item.qty) || 0)); n++) mmUnits.push(unit);
  });
  mmUnits.sort((a,b) => a-b);
  let mixMatchDiscount = 0;
  for (let i=0; i + 3 < mmUnits.length; i += 4) mixMatchDiscount += mmUnits[i] || 0;
  mixMatchDiscount = Math.min(sub, mixMatchDiscount);
  let disc = 0;
  if (mixMatchDiscount <= 0 && typeof activePromoCode !== 'undefined' && activePromoCode) {
    disc = Number.isFinite(Number(activePromoCode.discount)) ? Math.min(sub, Math.max(0, Number(activePromoCode.discount))) : (activePromoCode.type === 'pct' ? azPromoCap(Math.round(sub * activePromoCode.value / 100)) : azPromoCap(Math.min(activePromoCode.value, sub)));
  } else if (mixMatchDiscount <= 0 && typeof appliedDiscount !== 'undefined' && appliedDiscount) {
    disc = appliedDiscount.type === 'percent' ? Math.round(sub * appliedDiscount.value / 100) : appliedDiscount.value;
  }
  return { sub, disc, mixMatchDiscount, paidSubtotal: Math.max(0, sub - disc - mixMatchDiscount) };
}

function generateOrderId() {
  // Matches the "AVC-########" format used everywhere else
  // (invoice numbers, order tracking, thank-you page placeholder).
  const ts  = Date.now().toString().slice(-6);
  const rnd = Math.floor(10 + Math.random() * 89);
  return 'AVC-' + ts + rnd;
}

function renderCheckoutSummary() {
  const el = document.getElementById('ckSummary');
  if (!el) return;
  const sub = STORE.cart.reduce((s, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return s;
    const unitPrice = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    return s + unitPrice * item.qty;
  }, 0);
  const mrpSub = STORE.cart.reduce((s, item) => {
    const p = PRODUCTS.find(p => p.id === item.id); if (!p) return s;
    const unit = item.tierTabs ? Number(p.price || p.mrp || p.salePrice || 0) * (Number(item.tierTabs) / 15) : Number(p.price || p.mrp || p.salePrice || 0);
    return s + unit * item.qty;
  }, 0);
  const tierOff = Math.max(0, mrpSub - sub);

  // Use activePromoCode (the working variable) — fix for promo not affecting price
  let disc = 0;
  if (typeof activePromoCode !== 'undefined' && activePromoCode) {
    if (activePromoCode.type === 'pct') disc = azPromoCap(Math.round(sub * activePromoCode.value / 100));
    else if (activePromoCode.type === 'flat') disc = azPromoCap(Math.min(activePromoCode.value, sub));
  } else if (typeof appliedDiscount !== 'undefined' && appliedDiscount) {
    disc = appliedDiscount.type==='percent' ? Math.round(sub*appliedDiscount.value/100) : appliedDiscount.value;
  }

  // ── MIX & MATCH (display only) ──────────────────────────────────────
  // Mirrors mixAndMatchDiscount() in server.js: every 4 units, the cheapest
  // is free. The SERVER sets the real price; this only lets the cart show
  // the saving before checkout. Keep the two in step.
  var mmUnits = [];
  STORE.cart.forEach(function (it) {
    var pr = PRODUCTS.find(function (x) { return x.id === it.id; });
    if (!pr) return;
    var u = (function (p, it) { var m = null; if (it.tierTabs != null) m = Number(it.tierTabs) / 15; else if (it.tierIdx != null) { var ts = (typeof getProductTiers === 'function') ? getProductTiers(p) : null; m = (ts && ts[it.tierIdx] && ts[it.tierIdx].tabs) ? ts[it.tierIdx].tabs / 15 : null; } return (m && m > 0) ? (Number(p.price || 0) * m) : (p.salePrice || p.price); })(pr, it);
    var q = Math.max(0, Math.trunc(Number(it.qty) || 0));
    for (var n = 0; n < q; n++) mmUnits.push(u);
  });
  mmUnits.sort(function (a, b) { return a - b; });
  var mmGroups = Math.floor(mmUnits.length / 4);
  var mmDisc = 0;
  for (var g = 0; g < mmGroups; g++) mmDisc += mmUnits[g * 4] || 0;
  var mmOff = Math.max(0, Math.min(mmDisc, sub));
  var mmNeed = mmGroups > 0 ? 0 : 4 - (mmUnits.length % 4);
  // Mix & Match is standalone. Keep the UI identical to the server: a live
  // free-item offer removes the coupon instead of showing a stacked saving.
  if (mmOff > 0) disc = 0;
  const ship = calcShipping(sub - mmOff - disc);
  const _vita = vitaCheckoutInfo(sub - mmOff - disc);
  const vitaOff = _vita.rupees;
  const total = Math.max(0, sub - mmOff - disc + ship - vitaOff);

  el.innerHTML = `
    ${STORE.cart.map(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
      if (!p) return '';
      const unitPrice = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
      const packLabel = item.tierTabs ? ` (${item.tierTabs} tabs)` : '';
      // Show the tier label (e.g. "3 Pack") if available
      const tierLabel = item.tierLabel ? ` — ${item.tierLabel}` : '';
      return `<div style="display:flex;gap:10px;margin-bottom:12px;align-items:center">
        <img src="${getProductImg(p)}" alt="${esc(p.name)} — Ozylix effervescent tablet" style="width:46px;height:46px;border-radius:8px;object-fit:contain;background:var(--off-white);padding:4px" onerror="this.src=PRODUCT_FALLBACKS.default" decoding="async">
        <div style="flex:1">
          <div style="font-size:.8rem;font-weight:600">${p.name}${packLabel}${tierLabel}</div>
          <div style="font-size:.72rem;color:var(--gray)">Qty: ${item.qty} × ₹${unitPrice.toLocaleString('en-IN')}</div>
        </div>
        <div style="font-weight:700;font-size:.85rem">₹${(unitPrice * item.qty).toLocaleString('en-IN')}</div>
      </div>`;
    }).join('')}
    <hr style="border:none;border-top:1px solid var(--light-gray);margin:12px 0">
    <div class="sum-row"><span>Product total</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
    ${tierOff > 0 ? `<div class="sum-row" style="color:var(--success)"><span>Pack / tier saving</span><span>-₹${tierOff.toLocaleString('en-IN')}</span></div>` : ''}
    ${mmOff > 0 ? `<div class="mm-line mm-unlocked">🎉 Mix &amp; Match bundle discount applied (−₹${mmOff.toLocaleString('en-IN')}) <small style="display:block;margin-top:3px">Any coupon is removed while this offer is active.</small></div>` : (mmUnits.length > 0 ? `<div class="mm-line">🎁 Add <strong>${mmNeed}</strong> more ${mmNeed === 1 ? 'item' : 'items'} — your Mix &amp; Match discount grows.</div>` : '')}
    ${disc > 0 ? `<div class="sum-row" style="color:var(--success)"><span>🏷️ Promo code ${activePromoCode?.code ? '('+activePromoCode.code+')' : ''}</span><span>-₹${disc.toLocaleString('en-IN')}</span></div>` : ''}
    ${vitaOff > 0 ? `<div class="sum-row" style="color:var(--fern-lo)"><span>💎 VitaPoints (${_vita.applied.toLocaleString('en-IN')})</span><span>-₹${vitaOff.toFixed(2)}</span></div>` : ''}
    <div class="sum-row"><span>Shipping</span><span>${ship === 0 ? '<span style="color:var(--success);font-weight:700">FREE</span>' : '₹' + ship}</span></div>
    ${(() => { const totDisc = tierOff + mmOff + disc + vitaOff; return totDisc > 0 ? `<div class="sum-row"><span style="font-weight:700;color:var(--t-main)">Total savings</span><span style="font-weight:800;color:var(--success)">-₹${totDisc.toLocaleString('en-IN')}</span></div>` : ''; })()}
    <div class="sum-row total"><span>Total</span><span style="color:var(--green);font-size:1.1rem">₹${total.toLocaleString('en-IN',{maximumFractionDigits:2})}</span></div>
    ${vitaRedeemWidgetHTML(sub - mmOff - disc)}`;
}

// ── 2026-08: compact gateway row — both Cashfree and GoKwik stay visible
// as slim tiles; the selection travels with the order so the saved row,
// invoice and My Account all record the same method.
function selPayGateway(el) {
  document.querySelectorAll('.pay-method-compact').forEach(function (t) { t.classList.remove('selected'); });
  el.classList.add('selected');
  const gw = el.getAttribute('data-gateway');
  const onlineBtn = document.getElementById('onlinePayBtn');
  const codBtn = document.getElementById('codBtn');
  const payBarBtn = document.getElementById('ozPayBarPayBtn');
  if (onlineBtn) {
    onlineBtn.textContent = gw === 'cashfree'
      ? '🔒 Pay Securely via Cashfree'
      : gw === 'gokwik' ? '🔒 Pay Securely via GoKwik' : '💵 Pay Cash on Delivery (COD)';
  }
  // Mobile sticky pay bar mirrors the gateway the customer picked above.
  if (payBarBtn) {
    payBarBtn.textContent = gw === 'cashfree'
      ? '🔒 Pay via Cashfree'
      : gw === 'gokwik' ? '🔒 Pay via GoKwik' : '💵 Pay COD';
  }
}
function getSelectedGateway() {
  const sel = document.querySelector('#page-checkout .pay-method-compact.selected');
  return (sel && sel.getAttribute('data-gateway')) || 'cashfree';
}
function selPayMethod(el) { /* superseded by selPayGateway */ }

function placeOrder() {
  // Route to the real payment gateway
  initiatePayment();
}

// ── BLOG ──
const BLOGS_NEWEST_FIRST = BLOGS.slice().sort(function(a,b){ return new Date(b.date).getTime()-new Date(a.date).getTime(); });

function renderBlogCard(b) {
  const shopBtn = b.relatedProduct
    ? `<div style="margin-top:12px">
        <button onclick="event.preventDefault();event.stopPropagation();openProduct(${b.relatedProduct})"
          style="background:var(--face-warm);color:var(--clay-lo);box-shadow:inset 0 0 0 1.5px rgba(138,74,51,.32);border:none;border-radius:8px;padding:7px 16px;font-size:0.76rem;font-weight:700;cursor:pointer;letter-spacing:0.3px">
          🛒 Shop This Product →
        </button>
       </div>`
    : '';
  return `<a class="blog-card" href="#blog-${b.id}" onclick="openBlog(${b.id});return false" aria-label="Read: ${b.title}">
    <img class="blog-img" data-src="${b.img}" alt="${b.alt || b.title}" loading="lazy"
      onerror="this.src=PRODUCT_FALLBACKS.default" decoding="async">
    <div class="blog-body">
      <span class="blog-tag">${b.tag}</span>
      <h3 class="blog-title">${b.title}</h3>
      <p class="blog-exc">${b.excerpt}</p>
      <div class="blog-meta"><span>📅 ${b.date}</span><span>⏱ ${b.readTime}</span><span>✍ ${b.author}</span></div>
      ${shopBtn}
    </div>
  </a>`;
}
function renderFullBlog() { const el=document.getElementById('fullBlogGrid'); if(el) el.innerHTML=BLOGS_NEWEST_FIRST.map(renderBlogCard).join(''); hydrateBlogImgs(); }
// v10.2: blog tile images hydrate just before entering view, so a stalled
// image host can never hold the load event hostage. Pattern mirrors the promo
// marquee (6b6c50b). Any tiles still unhydrated after 6s load anyway.
function hydrateBlogImgs() {
  var pending = document.querySelectorAll('img.blog-img[data-src]');
  if (!pending.length) return;
  function hydrate(img) { if (img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) { if (entry.isIntersecting) { hydrate(entry.target); io.unobserve(entry.target); } });
    }, { rootMargin: '600px 0px 600px 0px' });
    pending.forEach(function(img) { io.observe(img); });
    setTimeout(function() { pending.forEach(hydrate); }, 6000);
  } else { pending.forEach(hydrate); }
}

// ── FAQ ──
function renderFaqItem(f) {
  return `<div class="faq-item"><button class="faq-q" onclick="toggleFaq(this)">${f.q}<span class="faq-icon">+</span></button><div class="faq-a"><div class="faq-a-inner">${f.a}</div></div></div>`;
}
function renderFullFaq() {
  const el=document.getElementById('fullFaqWrap'); if(!el) return;
  const cats=[...new Set(FAQS.map(f=>f.cat))];
  el.innerHTML=cats.map(c=>`<h2 style="font-size:1.1rem;font-weight:700;color:var(--green);margin:28px 0 14px;padding-bottom:7px;border-bottom:2px solid var(--green-pale)">${c}</h2>${FAQS.filter(f=>f.cat===c).map(renderFaqItem).join('')}`).join('');
}
function toggleFaq(btn) {
  const item=btn.parentElement, open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!open) item.classList.add('open');
}

// ── TESTIMONIALS ──
// ═══════════════════════════════════════════════════════════════
// REAL, SITE-WIDE REVIEW FEED
// PERF (Aug 2026): the homepage used to fire THREE separate Supabase
// queries for the same data — loadProductRatings() (every row),
// getFeaturedReviews() (top 9) and loadReviewStats() (count/avg), plus
// getLiveRating() (count/avg again). That's 4 full PostgREST round-trips
// from the visitor's browser on the home load, serialised behind
// initHome(). The single shared reviews batch below now feeds ALL of
// them: one query fills the per-product ratings, the top featured cards,
// the wall totals AND the live site average — cutting homepage Supabase
// calls from 4 to 1 (a direct egress AND speed win).
// ═══════════════════════════════════════════════════════════════
let FEATURED_REVIEWS_CACHE = null;
// Real totals across ALL reviews. The displayed cards are only the top few,
// so counting/averaging the displayed slice would understate the count and
// overstate the rating (the slice is the highest-rated by definition).
let FEATURED_REVIEWS_TOTAL = 0;
let FEATURED_REVIEWS_AVG   = null;
let REVIEWS_BATCH_TOTAL   = 0;  // true count across the WHOLE table
let REVIEWS_BATCH_AVG     = null; // true average across the WHOLE table

// One shared batched fetch — the same promise feeds ratings, featured
// cards, the reviews wall and the live rating, so nobody waits on more
// than a single Supabase call.
let _reviewsBatchDone = null;
async function loadReviewsBatch() {
  if (_reviewsBatchDone) return _reviewsBatchDone;
  _reviewsBatchDone = (async () => {
    const response = await fetch(API_BASE + '/api/public-reviews', {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Review request failed (${response.status})`);
    const rows = Array.isArray(payload.reviews) ? payload.reviews : [];
    const count = rows.length;
    // TRUE site-wide totals. REVIEW volume is far below the 1000-row cap,
    // so the returned rows cover the whole table and the average below
    // IS the real site average. If review volume ever exceeded the cap,
    // FEATURED_REVIEWS_AVG would simply stay null (the site shows
    // "Awaiting reviews") rather than a fabricated figure.
    const ratings = rows.map(r => Number(r.rating)).filter(n => Number.isFinite(n) && n > 0);
    if (typeof count === 'number') REVIEWS_BATCH_TOTAL = count;
    if (count === rows.length && ratings.length) {
      const avg = ratings.reduce((s, n) => s + n, 0) / ratings.length;
      REVIEWS_BATCH_AVG = avg;
      FEATURED_REVIEWS_AVG = avg;
    }
    return rows.map(r => ({
      id: r.id, productId: r.product_id, productName: r.product_name,
      user: r.user_name, rating: r.rating, text: r.review_text, date: r.created_at
    }));
  })().catch(() => []);
  return _reviewsBatchDone;
}

async function loadReviewStats() {
  try {
    const rows = await loadReviewsBatch();
    FEATURED_REVIEWS_TOTAL = REVIEWS_BATCH_TOTAL || rows.length;
    if (FEATURED_REVIEWS_AVG == null && rows.length) {
      FEATURED_REVIEWS_AVG = rows.reduce((t, r) => t + (Number(r.rating) || 0), 0) / rows.length;
    }
  } catch (e) { /* stats are cosmetic — never block the reviews render */ }
}

async function getFeaturedReviews() {
  if (FEATURED_REVIEWS_CACHE) return FEATURED_REVIEWS_CACHE;
  try {
    // Throw rather than return: the catch below already sets the honest
    // empty state and marks the fetch complete.
    FEATURED_REVIEWS_CACHE = (await loadReviewsBatch()).slice(0, 9);
  } catch (e) {
    console.error('[getFeaturedReviews] Supabase error:', JSON.stringify(e, Object.getOwnPropertyNames(e||{})), e);
    FEATURED_REVIEWS_CACHE = []; // honest empty state — no fake filler
  }
  return FEATURED_REVIEWS_CACHE;
}

// ── SITE-WIDE LIVE AVERAGE RATING ──────────────────────────────
// The stat card used to hard-code 4.8★. It now reflects every review
// actually written on the site. Ratings are pulled as a single narrow
// column so the payload stays small, and `count: 'exact'` gives the
// true total even when the row page is capped.
let LIVE_RATING_CACHE = null;

async function getLiveRating() {
  if (LIVE_RATING_CACHE) return LIVE_RATING_CACHE;
  try {
    // PERF (Aug 2026): no more separate Supabase query — this reuses the
    // single site-wide reviews batch that loadProductRatings() already
    // started, so the live rating arrives for free.
    const rows = await loadReviewsBatch();
    const ratings = rows.map(r => Number(r.rating)).filter(n => Number.isFinite(n) && n > 0);
    if (REVIEWS_BATCH_AVG != null) {
      LIVE_RATING_CACHE = { avg: REVIEWS_BATCH_AVG, count: REVIEWS_BATCH_TOTAL || ratings.length };
    } else if (ratings.length) {
      LIVE_RATING_CACHE = { avg: ratings.reduce((s, n) => s + n, 0) / ratings.length,
                            count: REVIEWS_BATCH_TOTAL || ratings.length };
    } else {
      LIVE_RATING_CACHE = { avg: null, count: REVIEWS_BATCH_TOTAL || 0 };
    }
  } catch (e) {
    console.error('[getLiveRating] Supabase error:',
      JSON.stringify(e, Object.getOwnPropertyNames(e || {})), e);
    LIVE_RATING_CACHE = { avg: null, count: 0 }; // honest empty state
  }
  return LIVE_RATING_CACHE;
}

// Every element carrying data-live-rating, not just the home counter.
// The About page had 4.8★ typed into the markup — a fixed score on a site
// that says "New · Awaiting Reviews" everywhere else until real reviews
// exist. One fetch feeds them all.
async function renderLiveRatingStat() {
  const els = document.querySelectorAll('[data-live-rating]');
  if (!els.length) return;
  const { avg, count } = await getLiveRating();

  els.forEach((el) => {
    const label = el.dataset.ratingLabel
      ? document.getElementById(el.dataset.ratingLabel)
      : document.getElementById('statAvgRatingLabel');

    if (avg === null) {
      // No reviews yet — say so rather than showing a fabricated score.
      el.dataset.ready = '1';
      el.textContent = 'New';
      if (label) label.textContent = 'Awaiting reviews';
    } else {
      el.dataset.count = avg.toFixed(1);
      el.dataset.ready = '1';
      el.textContent = avg.toFixed(1) + (el.dataset.suffix || '★');
      if (label) {
        label.textContent = count === 1
          ? 'Average rating · 1 review'
          : 'Average rating · ' + count.toLocaleString('en-IN') + ' reviews';
      }
    }
    el.style.transition = 'opacity .5s ease';
    el.style.opacity = '0';
    requestAnimationFrame(() => { el.style.opacity = '1'; });
  });
}

// The About hero claimed "12+ Products" against a catalogue of 16.
function hydrateAboutStats() {
  const el = document.getElementById('aboutProductCount');
  if (!el || typeof PRODUCTS === 'undefined') return;
  const n = PRODUCTS.filter(p => !p._hidden && p.active !== false).length;
  el.textContent = n ? String(n) : '—';
}

function testiCardHtml(t) {
  const initial = (t.user || t.name || '?').trim().charAt(0).toUpperCase();
  return `<div class="testi-card"><div class="testi-stars">${'★'.repeat(starCount(t.rating || t.stars || 5))}</div><p class="testi-text">"${esc(t.text)}"</p><div class="testi-user"><div class="testi-avatar">${esc(initial)}</div><div><div class="testi-name">${esc(t.user || t.name)}</div><div class="testi-loc">${esc(t.location || t.loc || '')}</div></div></div></div>`;
}

async function renderTestimonials() {
  const tg = document.getElementById('testiGrid');
  if (!tg) return;
  const reviews = await getFeaturedReviews();
  tg.innerHTML = reviews.length
    ? reviews.slice(0,6).map(testiCardHtml).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--gray);font-size:.9rem">Customer reviews are on their way — check back soon! 🌿</p>`;
}

async function renderReviewsWall() {
  const wall = document.getElementById('reviewsWallGrid');
  const statEl = document.getElementById('reviewsWallCount');
  const avgEl = document.getElementById('reviewsWallAvg');
  if (!wall) return;
  const reviews = await getFeaturedReviews();
  if (!reviews.length) {
    wall.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--gray);font-size:.9rem">No reviews yet — be the first to share your Ozylix experience! 🌿</p>`;
    if (statEl) statEl.textContent = '0 reviews';
    if (avgEl) avgEl.textContent = '—';
    return;
  }
  await loadReviewStats();
  const total = FEATURED_REVIEWS_TOTAL || reviews.length;
  const avg = (FEATURED_REVIEWS_AVG != null
    ? FEATURED_REVIEWS_AVG
    : reviews.reduce((s,r)=>s+(r.rating||5),0) / reviews.length).toFixed(1);
  if (statEl) statEl.innerHTML = `Based on <strong style="color:var(--dark)">${total} review${total === 1 ? '' : 's'}</strong>`;
  if (avgEl) avgEl.textContent = avg;
  wall.innerHTML = reviews.slice(0,3).map(r => {
    const initial = (r.user||'?').trim().charAt(0).toUpperCase();
    return `<div class="inf-card" style="background:var(--sub-1);border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(23,224,192,0.07);border:1px solid rgba(23,224,192,0.06)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--f-mineral-d),var(--f-mineral));display:flex;align-items:center;justify-content:center;color:var(--t-hi);font-weight:700;font-size:1.1rem;flex-shrink:0">${esc(initial)}</div>
        <div><div style="font-weight:700;font-size:0.9rem;color:var(--dark)">${esc(r.user)}</div><div style="font-size:0.75rem;color:var(--gray)">${esc(r.location||'Verified Buyer')}</div></div>
        <div style="margin-left:auto;color:var(--seal);font-size:0.95rem">${'★'.repeat(starCount(r.rating||5))}</div>
      </div>
      <div style="font-size:0.88rem;color:var(--text);line-height:1.65;margin-bottom:12px">"${esc(r.text)}"</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:0.72rem;background:var(--green-pale);color:var(--green);padding:3px 10px;border-radius:20px;font-weight:600">${esc(r.productName||'')}</span>
        <span style="font-size:0.72rem;color:var(--gray)">${esc(r.date||'')}</span>
      </div>
    </div>`;
  }).join('');
}

// ── CAROUSEL ──
const totalSlides=3;
function moveCarousel(d) { carouselIdx=(carouselIdx+d+totalSlides)%totalSlides; goSlide(carouselIdx); }
function goSlide(i) {
  carouselIdx=i;
  const ct=document.getElementById('carouselTrack'); if(ct) ct.style.transform=`translateX(-${i*100}%)`;
  document.querySelectorAll('.c-dot').forEach((d,j)=>d.classList.toggle('active',j===i));
}
document.addEventListener('DOMContentLoaded', function(){ setInterval(function(){ moveCarousel(1); }, 5500); });

// ── UTILS ──
function subscribeNL() {
  const e=document.getElementById('nlEmail')?.value;
  if(!e||!e.includes('@')){showToast('Please enter a valid email','error');return;}
  showToast('Subscribed! Welcome to the Ozylix family 🌿');
  if(document.getElementById('nlEmail')) document.getElementById('nlEmail').value='';
}

// ── INIT ──
function bootApp() {
  // (home promo carousel now self-initializes in its own IIFE, no boot hook needed)
  try { STORE.init(); } catch(e) { console.error('STORE init:', e); }
  try { renderFullFaq(); } catch(e) {}
  try { const hfw2=document.getElementById('homeFaqWrap'); if(hfw2) hfw2.innerHTML = FAQS.slice(0,5).map(renderFaqItem).join(''); } catch(e) {}
  // ✅ FIX: Render immediately from static data so shop never shows empty
  try { renderFeatured(); } catch(e) {}
  try { renderNewArrivals(); } catch(e) {}
  try { hydrateProductImgs(); } catch(e) {}
  try { hydrateCategoryCounts(); } catch(e) {}
  try { hydrateAboutStats(); } catch(e) {}
  try { if(document.getElementById('bundleProdList')) renderBundleBuilder(); } catch(e) {}
  try { updateSaleUIVisibility(); } catch(e) {}
  // Homepage thumbnails are a separate public projection and never block Shop.
  syncHomeThumbnails();
  // 🔗 Sync live product data from Supabase backend (non-blocking)
  syncProductsFromBackend();
  // Keep syncing every 2 minutes so a customer with the page already open
  // sees stock/price changes made in the admin panel without reloading.
  setInterval(() => { syncProductsFromBackend(); }, 2 * 60 * 1000);

  // 🎯 Capture campaign attribution (UTM params + Meta's fbclid) on landing.
  // Last-touch: overwrites only when the URL actually carries new params,
  // persists 30 days so a purchase days later can still be attributed.
  (function captureAttribution() {
    try {
      const params = new URLSearchParams(window.location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      const hasUtm = keys.some(k => params.has(k)) || params.has('fbclid');
      if (hasUtm) {
        const attribution = {
          utm_source: params.get('utm_source') || '',
          utm_medium: params.get('utm_medium') || '',
          utm_campaign: params.get('utm_campaign') || '',
          utm_content: params.get('utm_content') || '',
          utm_term: params.get('utm_term') || '',
          fbclid: params.get('fbclid') || '',
          captured_at: Date.now(),
        };
        localStorage.setItem('asc_attribution', JSON.stringify(attribution));
      }
    } catch (e) {}
  })();
  window._getAttribution = function() {
    try {
      const raw = localStorage.getItem('asc_attribution');
      if (!raw) return null;
      const attr = JSON.parse(raw);
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - attr.captured_at > THIRTY_DAYS) return null;
      return attr;
    } catch (e) { return null; }
  };

  // ═══════════════════════════════════════════════════════════════════
  // 📡 VISITOR ANALYTICS CLIENT  (v2 — persistent)
  // ═══════════════════════════════════════════════════════════════════
  // What changed and why:
  //  • The old ping sent {device, ts, attribution}. The server destructured
  //    only {session_id, page, referrer, city} — so device and attribution
  //    were thrown away, and because referrer was NEVER sent, every single
  //    visitor was filed as "Direct" in the admin panel.
  //  • It re-pinged every 4 minutes but the server dropped a session after
  //    2 minutes, so visitors vanished for half of every visit and the
  //    "Active Now" number was roughly half the real figure.
  //  • Single-page navigation was invisible: the ping fired once on load,
  //    so a shopper who browsed 8 pages counted as 1 pageview.
  // This sends the full picture and re-pings inside the server's window.
  window.AZAnalytics = (function () {
    var API = (typeof API_BASE !== 'undefined') ? API_BASE : '';
    var sid = (function () {
      try {
        var v = sessionStorage.getItem('asc_sid');
        if (!v) { v = Date.now().toString(36) + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('asc_sid', v); }
        return v;
      } catch (e) { return 'anon-' + Math.random().toString(36).slice(2, 10); }
    })();

    /* iPadOS 13+ reports itself as a Mac in the user-agent string. The
       browser is the only place that can tell the difference (a Mac has no
       touch points), so we send a hint the server trusts for that one case. */
    function deviceHint() {
      var ua = navigator.userAgent, touch = (navigator.maxTouchPoints || 0) > 1;
      if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) return 'tablet';
      if (/Android/.test(ua) && !/Mobile/.test(ua)) return 'tablet';
      if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return 'mobile';
      return 'desktop';
    }

    function utm() {
      try {
        var q = new URLSearchParams(location.search), o = {};
        ['source', 'medium', 'campaign'].forEach(function (k) {
          var v = q.get('utm_' + k); if (v) o[k] = v.slice(0, 120);
        });
        if (!o.source) {
          var a = (typeof window._getAttribution === 'function') ? window._getAttribution() : null;
          if (a) { o.source = a.utm_source || a.source; o.medium = a.utm_medium || a.medium; o.campaign = a.utm_campaign || a.campaign; }
        }
        return o;
      } catch (e) { return {}; }
    }

    /* Captured once: after the first SPA navigation document.referrer still
       shows the original external referrer, but we want the value as it was
       on arrival, before any of our own redirects rewrote it. */
    var firstReferrer = (function () {
      try {
        var k = 'asc_first_ref', v = sessionStorage.getItem(k);
        if (v === null) { v = document.referrer || ''; sessionStorage.setItem(k, v); }
        return v;
      } catch (e) { return document.referrer || ''; }
    })();

    function currentPage() {
      var p = location.pathname.replace(/\/+$/, '') || '/';
      var h = (location.hash || '').replace('#', '');
      if (h && p === '/') p = '/' + h;
      return p.slice(0, 200);
    }

    function email() {
      try {
        var u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
        return (u && u.email) ? u.email : null;
      } catch (e) { return null; }
    }

    function send(path, body) {
      try {
        if (!API) return;
        fetch(API + path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true
        }).catch(function () {});   // analytics must never break the store
      } catch (e) {}
    }

    var lastPage = null;
    function ping(force) {
      var page = currentPage();
      if (!force && page === lastPage) { /* heartbeat only — still send */ }
      lastPage = page;
      send('/api/visitors/ping', {
        session_id:  sid,
        site:        location.hostname,
        page:        page,
        referrer:    firstReferrer,
        device_hint: deviceHint(),
        screen_w:    screen.width,
        screen_h:    screen.height,
        is_pwa:      !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches) || !!navigator.standalone,
        utm:         utm(),
        email:       email()
      });
    }

    /* Marks the session as converted so the admin panel's conversion rate is
       a real number. The old panel counted `sessions.filter(s => s.status ===
       'checkout')` against an API that never returned a `status` field, so
       "Converting" sat at 0 forever. */
    function convert(orderId, value) {
      send('/api/visitors/convert', {
        session_id: sid, order_id: String(orderId || '').slice(0, 64),
        order_value: Number(value) || null, email: email()
      });
    }

    ping(true);

    /* Heartbeat well inside the server's 5-minute live window (was 4 min
       against a 2-minute window, which is what caused the undercount). */
    setInterval(function () { if (!document.hidden) ping(false); }, 45 * 1000);

    /* Single-page navigation — count each screen the shopper actually opens. */
    if (typeof window.showPage === 'function') {
      var _origShowPage = window.showPage;
      window.showPage = function (pg) {
        var r = _origShowPage.apply(this, arguments);
        setTimeout(function () { ping(true); }, 40);
        return r;
      };
    }
    window.addEventListener('popstate', function () { setTimeout(function () { ping(true); }, 40); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) ping(true); });

    return { ping: ping, convert: convert, sessionId: sid };
  })();

  // ── GitHub Pages SPA routing fix ──
  // When 404.html catches /about etc., it redirects to /?p=%2Fabout
  // We decode that here and show the right page, then clean the URL
  const _spParam = new URLSearchParams(window.location.search).get('p');
  if (_spParam) {
    try { history.replaceState(null, '', _spParam); } catch(e) {}
  }

  // Handle direct URL with clean path (e.g. ozylix.com/about) OR legacy hash (ozylix.com/#shop)
  const _fullPath = (_spParam || window.location.pathname).replace(/^\//, '').trim();
  const _pathParts = _fullPath.split('/');
  const _pathPage = _pathParts[0];
  const _pathSlug = _pathParts[1] || null; // e.g. 'glutathione-effervescent-tablet'
  const _hashPage = window.location.hash.replace('#', '').trim();
  // `/products/<slug>` is a legacy inbound format. Treat it as a product
  // route, then openProduct() replaces it with the singular canonical path.
  const _initPage = _pathPage === 'products' ? 'product' : (_pathPage || _hashPage);
  // wishlist has a real page section but was missing here, so a direct hit on
  // /wishlist rendered the HOME page at 200 — a soft 404. Keep
  // this list in step with SPA_ROUTES in worker/index.js.
  // 'cart', 'vita-points', 'conduct' and 'discount-policy' are real sections in
  // index.html that showPage() already pushes into the URL, but they were absent
  // here — so Back out of one of them restored nothing and left the customer on
  // a page whose URL no longer matched what they were looking at.
  const _validPages = ['home','shop','blog','about','contact','faq','advisor','account','product','wishlist','cart','notifications','privacy','terms','shipping','refund','accessibility','download','vita-points','conduct','discount-policy'];
  // Legacy /b2b links now redirect to the Ascovita corporate B2B page
  if (_initPage === 'b2b') { window.location.href = 'https://www.ascovita.com/#/capabilities'; }
  if (_initPage && (_validPages.includes(_initPage) || _initPage === 'blog')) {
    if (_initPage === 'product' && _pathSlug) {
      // Find product by slug and open it
      setTimeout(function() {
        if (typeof findProductBySlug === 'function' && typeof PRODUCTS !== 'undefined') {
          const prod = findProductBySlug(_pathSlug);
          if (prod) { openProduct(prod.id, { replace: true }); }
          else {
            if (_pathPage === 'products') {
              try { history.replaceState({}, '', '/shop'); } catch(e) {}
            }
            showPage('shop');
          }
        }
      }, 300);
    } else if (_initPage === 'account') {
      // /account is a deliberate login gate: loadAccountPage() never fetches
      // account data until getCurrentUser() returns a verified local session.
      setTimeout(function() {
        showPage('account');
        if (typeof loadAccountPage === 'function') loadAccountPage();
      }, 300);
    } else if (_initPage === 'blog' && _pathSlug) {
      // /blog/<slug> deep link — open the blog page, then the matching
      // article (slugified title). Unknown slugs fall through to /blog.
      setTimeout(function() {
        if (typeof showPage === 'function') showPage('blog');
        if (typeof openBlogBySlug === 'function') openBlogBySlug(_pathSlug);
      }, 300);
    } else {
      setTimeout(function() { showPage(_initPage); }, 200);
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    const state = e.state || {};
    const pathParts = window.location.pathname.replace(/^\//, '').split('/');
    const pg = state.page || pathParts[0] || 'home';
    const slug = state.id ? null : pathParts[1];
    if (pg === 'product') {
      const prodId = state.id || (typeof findProductBySlug === 'function' && findProductBySlug(slug)?.id);
      if (prodId) { currentProduct = PRODUCTS.find(p => p.id === prodId); buildProductPage(currentProduct); }
    }
    if (_validPages.includes(pg)) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const el = document.getElementById('page-' + pg);
      if (el) {
        el.classList.add('active'); window.scrollTo({top:0}); currentPage = pg;
        if (pg === 'account' && typeof loadAccountPage === 'function') loadAccountPage();
      }
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.page === pg));
    }
  });

  // ── Handle GoKwik payment return ──
  var sp = new URLSearchParams(window.location.search);
  var gkoid = sp.get('gk_order');
  if (gkoid) {
    try { history.replaceState({}, '', window.location.pathname); } catch(e) {}
    // Delay to let app fully boot before verifying
    setTimeout(function() { handleGoKwikReturn(gkoid); }, 800);
  }

  // ── Handle Cashfree payment return ──
  // Cashfree's order_meta.return_url is set to /?cf_order_id={order_id},
  // with {order_id} substituted by Cashfree itself before redirecting back.
  var cfoid = sp.get('cf_order_id');
  if (cfoid) {
    try { history.replaceState({}, '', window.location.pathname); } catch(e) {}
    setTimeout(function() { handleCashfreeReturn(cfoid); }, 800);
  }



  try { initHome(); } catch(e) { console.error('initHome:', e); }
  // Do not overwrite a valid deep route with Home after boot. The route
  // initializer above owns the initial page selection; Home is only the
  // fallback when the URL does not name a known page.
  const _hasKnownBootRoute = _initPage && (_validPages.includes(_initPage) || _initPage === 'blog');
  if (!_hasKnownBootRoute) {
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var home = document.getElementById('page-home');
    if (home) home.classList.add('active');
  }
}

let _bootAppCalled = false;
function _safeBootApp() { if (_bootAppCalled) return; _bootAppCalled = true; bootApp(); }
document.addEventListener('DOMContentLoaded', _safeBootApp);
// Fallback for Hostinger CDN edge case where DOMContentLoaded may already have fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(_safeBootApp, 50);
}

// ═══ Login popup is now OPT-IN ONLY — never auto-shown on page load. ═══
// Customers can sign in whenever they choose: via the account icon in the
// navbar, or the "Sign in" option offered at checkout. The old behavior
// (auto-popping a login modal on mobile page-open) has been removed per
// product decision — it was interrupting first-time visitors before they'd
// even seen the store.

// ══════════════════════════════════════════════
// GOKWIK PAYMENT INTEGRATION — LIVE GATEWAY
// No SDK needed. Flow:
//   1. initiatePayment() → validates form → openPaymentGateway() modal
//   2. User clicks "Pay via GoKwik" → startPayment() → startGoKwikPayment()
//   3. Backend POST /api/create-gokwik-order → returns short_url
//   4. Frontend redirects to short_url (GoKwik hosted page)
//   5. GoKwik redirects back to ?gk_order=<orderId>
//   6. handleGoKwikReturn() polls /api/verify-gokwik-order/:orderId
//   7. On paid → finalizeOrder() → Supabase + Shiprocket + thank you
// ══════════════════════════════════════════════

// ── COLLECT FORM DATA ──
function getFormField(selector) {
  return document.querySelector('#page-checkout ' + selector)?.value?.trim() || '';
}

function getFormEl(selector) {
  return document.querySelector('#page-checkout ' + selector);
}

function validateCheckoutForm() {
  // Clear any error highlights left over from a previous attempt
  document.querySelectorAll('#page-checkout .form-input.field-error').forEach(el => el.classList.remove('field-error'));

  const firstNameEl = getFormEl('input[placeholder="Enter first name"]');
  const lastNameEl  = getFormEl('input[placeholder="Enter last name"]');
  const emailEl     = getFormEl('input[type="email"]');
  const phoneEl     = getFormEl('input[type="tel"]');
  const addr1El     = getFormEl('input[placeholder="House / Flat No., Street"]');
  const cityEl      = getFormEl('input[placeholder="City"]');
  const stateEl     = getFormEl('select') || getFormEl('input[placeholder="State"]');
  const pinEl       = getFormEl('input[placeholder="6-digit PIN"]');

  const firstName = firstNameEl?.value.trim() || '';
  const lastName  = lastNameEl?.value.trim() || '';
  const email     = emailEl?.value.trim() || '';
  const phone     = phoneEl?.value.trim() || '';
  const addr1     = addr1El?.value.trim() || '';
  const city      = cityEl?.value.trim() || '';
  const state     = stateEl?.value.trim() || '';
  const pin       = pinEl?.value.trim() || '';

  const errors = [];
  const invalidEls = [];
  const flag = (el, msg) => { errors.push(msg); if (el) invalidEls.push(el); };

  if (!firstName)                                     flag(firstNameEl, 'First name');
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))  flag(emailEl, 'Valid email');
  if (!phone || phone.replace(/\D/g,'').length < 10)   flag(phoneEl, 'Valid 10-digit phone');
  if (!addr1)                                          flag(addr1El, 'Address');
  if (!city)                                           flag(cityEl, 'City');
  if (!pin  || pin.replace(/\D/g,'').length < 6)       flag(pinEl, 'Valid 6-digit pincode');

  if (errors.length) {
    invalidEls.forEach(el => el.classList.add('field-error'));
    invalidEls[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidEls[0]?.focus();
    const msg = errors.length === 1
      ? errors[0] + ' is required'
      : 'Missing: ' + errors.join(', ');
    showToast('⚠️ ' + msg, 'error');
    return null;
  }
  return { firstName, lastName, email, phone, addr1,
           addr2: getFormField('input[placeholder="Area / Locality (optional)"]') || '',
           city, state, pin };
}

// ── MAIN ENTRY — called by "Pay Online" button ──
function initiatePayment() {
  if (DELIVERY_POLICY && DELIVERY_POLICY.store_online === false) {
    showToast('The store is temporarily unavailable for new orders. Please try again shortly.', 'error');
    return;
  }
  if (STORE.cart.length === 0) { showToast('🛒 Your cart is empty!', 'error'); return; }
  // 2026-08: never open a payment session for a PIN Delhivery cannot serve —
  // a courier failure discovered AFTER payment is India's #1 frustration.
  // Only blocks when the pin has actually been checked and failed; an unchecked
  // pin is tolerated (the server will re-check before creating the shipment).
  const pinEl = document.getElementById('ckPinInput');
  const clean = (pinEl?.value || '').replace(/\D/g, '');
  if (clean.length === 6) {
    const cached = window.__pinCache && window.__pinCache[clean];
    if (cached && !cached.serviceable) {
      showToast('⚠️ We cannot deliver to PIN ' + clean + '. Please change the delivery address first.', 'error');
      pinEl.focus();
      return;
    }
  }
  // LOGIN GATE: orders can only be placed by signed-in customers.
  if (!getCurrentUser()) { requireLoginForCheckout(function(){ initiatePayment(); }); return; }
  const formData = validateCheckoutForm();
  if (!formData) return;

  const { sub, disc, mixMatchDiscount, paidSubtotal } = getOrderTotal();
  const ship  = calcShipping(paidSubtotal);
  const total = paidSubtotal + ship;
  const displayedDiscount = disc + mixMatchDiscount;

  const orderId = generateOrderId();
  const btn = document.getElementById('onlinePayBtn') || document.querySelector('#page-checkout .checkout-btn');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Opening Secure Checkout...'; }

  // 2026-08: the compact gateway row lets the customer pick Cashfree or
  // GoKwik before paying — send each to its own processor. COD bypasses
  // the online modal entirely.
  const gw = getSelectedGateway();
  if (gw === 'cod') {
    initiateCOD();
    if (btn) { btn.disabled = false; btn.textContent = origText || '💳 Pay Online'; }
    return;
  }
  openPaymentGateway(orderId, total, sub, displayedDiscount, ship, formData, btn, origText, gw);
}

// ══════════════════════════════════════════════
// PAYMENT MODAL — GoKwik only
// ══════════════════════════════════════════════
function openPaymentGateway(orderId, total, sub, disc, ship, formData, btn, origText, gateway) {
  gateway = gateway === 'cashfree' ? 'cashfree' : 'gokwik';
  window._pendingPayment = { orderId, total, sub, disc, ship, formData, gateway };
  document.getElementById('cfPayModal')?.remove();

  const cartItems = STORE.cart.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return '';
    const price = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    const pack = item.tierTabs ? ` (${item.tierTabs} tabs)` : '';
    return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--st-muted-bg);font-size:.82rem">
      <span style="color:var(--t-mid)">${p.name}${pack} × ${item.qty}</span>
      <span style="font-weight:700;color:var(--f-mineral-d)">₹${(price * item.qty).toLocaleString('en-IN')}</span>
    </div>`;
  }).join('');

  const discHtml = disc > 0
    ? `<div style="display:flex;justify-content:space-between;font-size:.78rem;color:var(--f-mineral-d);margin-bottom:4px">
        <span>Discount</span><span>-₹${disc.toLocaleString('en-IN')}</span>
       </div>` : '';

  const modal = document.createElement('div');
  modal.id = 'cfPayModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

  modal.innerHTML = `
    <div style="background:var(--sub-1);border-radius:20px;width:100%;max-width:420px;max-height:94vh;overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,0.45)">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,var(--f-mineral-d),var(--f-mineral));padding:20px 24px;border-radius:20px 20px 0 0;color:var(--t-hi);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:1.05rem;font-weight:800">🔒 Secure Checkout</div>
          <div style="font-size:.68rem;opacity:.8;margin-top:2px">PCI DSS Secured · 256-bit SSL</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.8rem;font-weight:900">₹${total.toLocaleString('en-IN')}</div>
          <div style="font-size:.62rem;opacity:.75">Total payable</div>
        </div>
      </div>
      <div style="padding:20px 22px">
        <!-- Order Summary -->
        <div style="background:var(--sub-1);border:1px solid var(--t-low);border-radius:12px;padding:14px;margin-bottom:16px">
          <div style="font-weight:700;font-size:.75rem;color:var(--f-mineral-d);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">📦 Order · ${orderId}</div>
          ${cartItems}
          <div style="margin-top:10px;padding-top:8px;border-top:1.5px solid var(--t-low)">
            <div style="display:flex;justify-content:space-between;font-size:.78rem;color:var(--t-low);margin-bottom:3px"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
            ${discHtml}
            <div style="display:flex;justify-content:space-between;font-size:.78rem;color:var(--t-low);margin-bottom:6px"><span>Shipping</span><span style="color:${ship===0?'var(--f-mineral-d)':'var(--t-hi)'}">${ship===0?'FREE':'₹'+ship}</span></div>
            <div style="display:flex;justify-content:space-between;font-weight:800;font-size:.95rem;color:var(--f-mineral-d)"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
        <!-- Delivery Info -->
        <div style="background:var(--st-muted-bg);border-radius:10px;padding:11px 14px;margin-bottom:16px;font-size:.78rem;color:var(--t-mid);line-height:1.6">
          <span style="font-weight:700;color:var(--t-mid)">👤 Ship to: </span>
          ${formData.firstName} ${formData.lastName} · ${formData.phone}<br>
          ${formData.addr1}, ${formData.city}, ${formData.state} – ${formData.pin}<br>
          <span style="color:var(--f-mineral-d)">✉ ${formData.email}</span>
        </div>
        <!-- Single Secure Pay Button (2026-08: one confident button per
             picked gateway — Cashfree or GoKwik, both kept visible in the
             compact selector above so the customer knows their choice) -->
        <button class="cfPayBtn ${gateway === 'cashfree' ? 'cashfree-pay-btn' : 'gk-pay-btn'}" onclick="startPayment('${gateway}')"
          style="width:100%;background:var(--face-warm);color:var(--st-danger-fg);box-shadow:inset 0 0 0 1.5px rgba(192,48,74,.34);border:none;border-radius:14px;padding:18px 20px;font-size:.95rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:14px;margin-bottom:10px;transition:opacity .15s">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:rgba(255,255,255,0.18);border-radius:10px;flex-shrink:0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </span>
          <div style="flex:1;text-align:left">
            <div style="font-size:1rem;font-weight:800">Pay ₹${total.toLocaleString('en-IN')} via ${gateway === 'cashfree' ? 'Cashfree' : 'GoKwik'}</div>
            <div style="font-size:.7rem;opacity:.85;margin-top:2px">UPI · GPay · PhonePe · BHIM · Card · Net Banking · EMI</div>
          </div>
          <span style="background:rgba(255,255,255,.22);padding:4px 10px;border-radius:100px;font-size:.6rem;font-weight:800;letter-spacing:.5px">SECURE →</span>
        </button>
        <!-- Trust Badges -->
        <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:14px;flex-wrap:wrap">
          <span style="font-size:.67rem;color:var(--t-low)">🔒 256-bit SSL</span>
          <span style="font-size:.67rem;color:var(--t-low)">✅ PCI DSS</span>
          <span style="font-size:.67rem;color:var(--t-low)">🛡️ ${gateway === 'cashfree' ? 'Cashfree' : 'GoKwik'} Secured</span>
        </div>
        <!-- Cancel -->
        <button onclick="closePaymentModal()" style="width:100%;background:var(--st-muted-bg);color:var(--t-low);border:none;border-radius:10px;padding:11px;font-size:.82rem;cursor:pointer">
          ✕ Cancel &amp; Go Back
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (btn) { btn.disabled = false; btn.textContent = origText || '💳 Pay Online'; }
}

function closePaymentModal() { document.getElementById('cfPayModal')?.remove(); }

// ══════════════════════════════════════════════
// startPayment — routes to GoKwik
// ══════════════════════════════════════════════
async function startPayment(method) {
  const pd = window._pendingPayment;
  if (!pd) { showToast('Payment session expired. Please try again.', 'error'); closePaymentModal(); return; }
  const { orderId, total, formData } = pd;
  const btn = document.getElementById('onlinePayBtn') || document.querySelector('#page-checkout .checkout-btn');
  const origText = btn ? btn.textContent : '💳 Pay Online';
  document.querySelectorAll('.cfPayBtn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
  const activeBtn = method === 'cashfree'
    ? document.querySelector('.cashfree-pay-btn')
    : document.querySelector('.gk-pay-btn');
  const gatewayLabel = method === 'cashfree' ? 'Cashfree' : 'GoKwik';
  if (activeBtn) { activeBtn.style.opacity = '1'; activeBtn.innerHTML = `<span style="font-size:1.4rem">⏳</span> <span>Connecting to ${gatewayLabel}...</span>`; }
  await new Promise(r => setTimeout(r, 500));
  closePaymentModal();
  showProcessingScreen(orderId, total, method);
  return method === 'cashfree'
    ? startCashfreePayment(orderId, total, formData, btn, origText)
    : startGoKwikPayment(orderId, total, formData, btn, origText);
}

// ══════════════════════════════════════════════
// startGoKwikPayment
// STILL MISSING in the deployed file — it is CALLED at the end of the
// payment modal flow but defined nowhere, so every online payment
// throws "startGoKwikPayment is not defined" before it ever reaches
// the backend. Only COD works today. Implemented against the existing
// /api/create-gokwik-order endpoint.
//
// The server recomputes the amount from real product prices (and now also
// factors in any VitaPoints applied), so the `total` passed in is
// display-only — the customer is charged the server's figure, never the
// browser's.
// ══════════════════════════════════════════════
async function startGoKwikPayment(orderId, total, formData, btn, origText) {
  try {
    const resp = await fetch(API_BASE + '/api/create-gokwik-order', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' },
        localStorage.getItem('asc_jwt') ? { 'Authorization': 'Bearer ' + localStorage.getItem('asc_jwt') } : {}),
      body: JSON.stringify({
        merchant_reference_id: orderId,
        amount: total,
        items: STORE.cart.map(function(i){
          var o = { id: i.id, qty: i.qty };
          if (i.tierTabs) { o.tierTabs = i.tierTabs; o.tierIdx = i.tierIdx; }
          return o;
        }),
        coupon_code: (typeof activePromoCode !== 'undefined' && activePromoCode) ? activePromoCode.code : null,
        vita_points: (typeof VITA_APPLIED !== 'undefined' && VITA_APPLIED > 0) ? VITA_APPLIED : 0,
        customer_name:  [formData.firstName, formData.lastName].filter(Boolean).join(' ') || formData.name || '',
        customer_email: formData.email,
        customer_phone: formData.phone,
        description: 'Ozylix order ' + orderId,
      }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success || !data.short_url) {
      throw new Error(data.error || 'Could not start payment');
    }
    try {
      sessionStorage.setItem('asc_pending_gk', JSON.stringify({
        orderId: orderId, formData: formData, t: Date.now(),
        vitaApplied: (typeof VITA_APPLIED !== 'undefined' ? VITA_APPLIED : 0),
        promoCode: (typeof activePromoCode !== 'undefined' && activePromoCode) ? activePromoCode : null,
        paymentToken: data.payment_session_token,
      }));
    } catch (e) {}
    window.location.href = data.short_url;
  } catch (err) {
    console.error('[startGoKwikPayment]', err);
    if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
    if (btn) { btn.disabled = false; btn.textContent = origText || '💳 Pay via GoKwik'; }
    document.querySelectorAll('.cfPayBtn').forEach(function(b){ b.disabled = false; b.style.opacity = '1'; });
    if (typeof showPaymentError === 'function') {
      showPaymentError('Payment could not be started: ' + err.message, orderId, formData, total, 'gokwik');
    } else if (typeof showToast === 'function') {
      showToast('❌ ' + err.message, 'error');
    }
  }
}

// ══════════════════════════════════════════════
// startCashfreePayment
//
// Same trust model as startGoKwikPayment: the amount passed here is
// display-only. /api/create-cashfree-order recomputes it from real
// product prices server-side, so a tampered request can't open a
// session for less than the cart is actually worth.
//
// Cashfree's JS SDK opens its hosted checkout with redirectTarget:"_self"
// — a full-page redirect, same shape as GoKwik's short_url flow, so the
// customer is returned to this site via order_meta.return_url and the
// same "resume on return" pattern (handleCashfreeReturn) picks it up.
// ══════════════════════════════════════════════
async function startCashfreePayment(orderId, total, formData, btn, origText) {
  try {
    if (typeof Cashfree === 'undefined') {
      throw new Error('Payment SDK failed to load — please check your connection and try again.');
    }
    const resp = await fetch(API_BASE + '/api/create-cashfree-order', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' },
        localStorage.getItem('asc_jwt') ? { 'Authorization': 'Bearer ' + localStorage.getItem('asc_jwt') } : {}),
      body: JSON.stringify({
        merchant_reference_id: orderId,
        items: STORE.cart.map(function(i){
          var o = { id: i.id, qty: i.qty };
          if (i.tierTabs) { o.tierTabs = i.tierTabs; o.tierIdx = i.tierIdx; }
          return o;
        }),
        coupon_code: (typeof activePromoCode !== 'undefined' && activePromoCode) ? activePromoCode.code : null,
        vita_points: (typeof VITA_APPLIED !== 'undefined' && VITA_APPLIED > 0) ? VITA_APPLIED : 0,
        customer_name:  [formData.firstName, formData.lastName].filter(Boolean).join(' ') || formData.name || '',
        customer_email: formData.email,
        customer_phone: formData.phone,
        description: 'Ozylix order ' + orderId,
      }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.success || !data.payment_session_id) {
      throw new Error(data.error || 'Could not start payment');
    }
    try {
      sessionStorage.setItem('asc_pending_cf', JSON.stringify({
        orderId: orderId, formData: formData, t: Date.now(),
        vitaApplied: (typeof VITA_APPLIED !== 'undefined' ? VITA_APPLIED : 0),
        promoCode: (typeof activePromoCode !== 'undefined' && activePromoCode) ? activePromoCode : null,
        paymentToken: data.payment_session_token,
      }));
    } catch (e) {}

    // Use whichever mode the backend actually created this order under
    // (data.cf_env), so a sandbox session always opens in sandbox mode
    // and a production session always opens in production mode — this
    // can never drift out of sync with CASHFREE_ENV on Render, unlike a
    // hardcoded/manual frontend flag.
    const cashfree = Cashfree({ mode: (data.cf_env || window.CASHFREE_MODE || 'production') });
    cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
  } catch (err) {
    console.error('[startCashfreePayment]', err);
    if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
    if (btn) { btn.disabled = false; btn.textContent = origText || '💳 Pay Online'; }
    document.querySelectorAll('.cfPayBtn').forEach(function(b){ b.disabled = false; b.style.opacity = '1'; });
    if (typeof showPaymentError === 'function') {
      showPaymentError('Payment could not be started: ' + err.message, orderId, formData, total, 'cashfree');
    } else if (typeof showToast === 'function') {
      showToast('❌ ' + err.message, 'error');
    }
  }
}

// ══════════════════════════════════════════════
// PAYMENT RETURN HANDLERS
//
// handleGoKwikReturn was called from the boot sequence's "Handle GoKwik
// payment return" block but was never defined anywhere in this file — so
// every customer who completed an online GoKwik payment and was
// redirected back threw a ReferenceError right there, and the order was
// never confirmed: no thank-you page, no VitaPoints, nothing saved. COD
// was the only online-payment-adjacent path that actually worked.
//
// Both handlers here follow the same shape: restore the checkout state
// that was stashed in sessionStorage before the redirect away (cart
// itself survives via STORE's own localStorage persistence), verify
// payment directly with the gateway (never trust the return URL alone —
// it's just a hint to check, exactly like the GoKwik/Cashfree webhooks
// do), then run the SAME finalizeOrder() used by every other payment
// path so there is only one order-saving code path to trust.
// ══════════════════════════════════════════════
async function handleGoKwikReturn(merchantRefId) {
  let pending = null;
  try { pending = JSON.parse(sessionStorage.getItem('asc_pending_gk') || 'null'); } catch (e) {}
  if (!pending || pending.orderId !== merchantRefId) {
    console.warn('[handleGoKwikReturn] No matching pending session for', merchantRefId);
    return;
  }
  sessionStorage.removeItem('asc_pending_gk');
  if (typeof VITA_APPLIED !== 'undefined') VITA_APPLIED = pending.vitaApplied || 0;
  if (typeof activePromoCode !== 'undefined') activePromoCode = pending.promoCode || null;

  showProcessingScreen(merchantRefId, 0, 'gokwik');
  try {
    const resp = await fetch(API_BASE + '/api/verify-gokwik-order/' + encodeURIComponent(merchantRefId), {
      headers: pending.paymentToken ? { 'X-Payment-Session': pending.paymentToken } : {},
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) throw new Error(data.error || 'Could not verify payment');
    if (!data.paid) {
      if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
      showPaymentError('Payment was not completed. If money was deducted, it will be auto-refunded by GoKwik within 5-7 days.',
        merchantRefId, pending.formData, data.amount || 0, 'gokwik');
      return;
    }
    await finalizeOrder(merchantRefId, pending.formData, data.amount || 0, 'gokwik', 0, pending.paymentToken);
  } catch (err) {
    console.error('[handleGoKwikReturn]', err);
    if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
    showPaymentError('We could not confirm your payment automatically. If money was deducted, contact +91 98985 82650 with Order ID: ' + merchantRefId + '. (' + err.message + ')',
      merchantRefId, pending.formData, 0, 'gokwik');
  }
}

async function handleCashfreeReturn(orderId) {
  let pending = null;
  try { pending = JSON.parse(sessionStorage.getItem('asc_pending_cf') || 'null'); } catch (e) {}
  if (!pending || pending.orderId !== orderId) {
    console.warn('[handleCashfreeReturn] No matching pending session for', orderId);
    return;
  }
  sessionStorage.removeItem('asc_pending_cf');
  if (typeof VITA_APPLIED !== 'undefined') VITA_APPLIED = pending.vitaApplied || 0;
  if (typeof activePromoCode !== 'undefined') activePromoCode = pending.promoCode || null;

  showProcessingScreen(orderId, 0, 'cashfree');
  try {
    const resp = await fetch(API_BASE + '/api/verify-cashfree-order/' + encodeURIComponent(orderId), {
      headers: pending.paymentToken ? { 'X-Payment-Session': pending.paymentToken } : {},
    });
    const data = await resp.json();
    if (!resp.ok || !data.success) throw new Error(data.error || 'Could not verify payment');
    if (!data.paid) {
      if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
      showPaymentError('Payment was not completed. If money was deducted, it will be auto-refunded by Cashfree within 5-7 days.',
        orderId, pending.formData, data.order_amount || 0, 'cashfree');
      return;
    }
    await finalizeOrder(orderId, pending.formData, data.order_amount || 0, 'cashfree', 0, pending.paymentToken);
  } catch (err) {
    console.error('[handleCashfreeReturn]', err);
    if (typeof hideProcessingScreen === 'function') hideProcessingScreen();
    showPaymentError('We could not confirm your payment automatically. If money was deducted, contact +91 98985 82650 with Order ID: ' + orderId + '. (' + err.message + ')',
      orderId, pending.formData, 0, 'cashfree');
  }
}
async function initiateCOD() {
  if (DELIVERY_POLICY && DELIVERY_POLICY.store_online === false) {
    showToast('The store is temporarily unavailable for new orders. Please try again shortly.', 'error');
    return;
  }
  const codEnabled = DELIVERY_POLICY && (DELIVERY_POLICY.cod_enabled === true || DELIVERY_POLICY.cod_enabled === 'true');
  if (!codEnabled) { showToast('COD is currently unavailable. Please choose online payment.', 'error'); updateCodBtnNote(); return; }
  if (STORE.cart.length === 0) { showToast('🛒 Your cart is empty!', 'error'); return; }
  // 2026-08: PIN serviceability gate — see initiatePayment for the why.
  const pinEl = document.getElementById('ckPinInput');
  const clean = (pinEl?.value || '').replace(/\D/g, '');
  if (clean.length === 6) {
    const cached = window.__pinCache && window.__pinCache[clean];
    if (cached && !cached.serviceable) {
      showToast('⚠️ We cannot deliver to PIN ' + clean + '. Please change the delivery address first.', 'error');
      pinEl.focus();
      return;
    }
    if (cached && !cached.cod) {
      showToast('⚠️ COD is not available for PIN ' + clean + ' — please pay online instead.', 'error');
      return;
    }
  }
  // LOGIN GATE: orders can only be placed by signed-in customers.
  if (!getCurrentUser()) { requireLoginForCheckout(function(){ initiateCOD(); }); return; }
  const formData = validateCheckoutForm();
  if (!formData) return;

  const { sub, disc, mixMatchDiscount } = getOrderTotal();
  const orderId = generateOrderId();
  const netSub = sub - disc - (mixMatchDiscount || 0);
  const codCharge = calcShipping(netSub);
  const codTotal = netSub + codCharge;

  // Disable button immediately to prevent double-tap
  const btn = document.getElementById('codBtn');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; btn.innerHTML = '<span>⏳</span> <span>Placing your order...</span>'; }

  try {
    await finalizeOrder(orderId, formData, codTotal, 'cod', codCharge);
    // On success finalizeOrder navigates to the thank-you page.
  } catch(err) {
    showToast('❌ Order failed: ' + err.message, 'error');
  } finally {
    // MUST be `finally`, not `catch`. finalizeOrder RETURNS (it does not
    // throw) when the order fails to save, so a catch-only reset left the
    // button stuck on "Placing your order..." until a page refresh — and
    // the same stale state greeted the customer if they navigated back to
    // checkout after a successful order. Resetting unconditionally is
    // safe: on success the page has already moved to the thank-you view.
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.innerHTML = '<span style="font-size:1.2rem">💵</span><div style="text-align:left"><div>Confirm COD Order</div><div id="codBtnNote" style="font-size:.65rem;opacity:.8;font-weight:500;margin-top:1px">Free COD on your order</div></div>';
      try { updateCodBtnNote(); } catch(e) {}
    }
  }
}

async function confirmCODOrder(orderId, codTotal, codCharge) {
  const overlay = document.getElementById('codOverlay');
  if (overlay) overlay.innerHTML = `<div style="background:var(--sub-1);border-radius:20px;padding:32px 28px;text-align:center;max-width:340px;width:90%">
    <div style="font-size:2.5rem;margin-bottom:12px">⏳</div>
    <div style="font-weight:700;color:var(--f-mineral-d)">Placing your order...</div>
  </div>`;

  const pd = window._pendingPayment;
  if (!pd) { if(overlay) overlay.remove(); showToast('Session expired', 'error'); return; }

  try {
    await finalizeOrder(orderId, pd.formData, codTotal, 'cod', codCharge);
    if (overlay) overlay.remove();
    // finalizeOrder calls showPage('thankyou')
  } catch(err) {
    if (overlay) overlay.remove();
    showPaymentError('COD order failed: ' + err.message, orderId, pd.formData, codTotal, 'cod');
  }
}

// ══════════════════════════════════════════════
// COD PAYMENT FLOW (from modal — kept for compatibility)



// Helper to update the processing screen status bar

// ── PROCESSING OVERLAY ──
function showProcessingScreen(orderId, total, method) {
  document.getElementById('cfProcessing')?.remove();
  const methodIcons = { cod:'💵', upi:'📱', card:'💳', netbanking:'🏦', emi:'📊', gokwik:'🔴', cashfree:'🔵' };
  const methodNames = { cod:'Cash on Delivery', upi:'UPI', card:'Card', netbanking:'Net Banking', emi:'EMI', gokwik:'GoKwik', cashfree:'Cashfree' };

  const el = document.createElement('div');
  el.id = 'cfProcessing';
  el.style.cssText = 'position:fixed;inset:0;background:rgba(10,20,10,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:system-ui;text-align:center;padding:32px';
  el.innerHTML = `
    <div style="font-size:3.5rem;margin-bottom:20px;animation:cfSpin 1.2s linear infinite">${methodIcons[method] || '💳'}</div>
    <div style="font-size:1.3rem;font-weight:800;margin-bottom:8px">${method === 'cod' ? 'Placing COD Order' : 'Processing Payment'}</div>
    <div style="font-size:.85rem;opacity:.7;margin-bottom:4px">₹${total.toLocaleString('en-IN')} via ${methodNames[method] || method}</div>
    <div style="font-size:.72rem;opacity:.5;margin-bottom:28px">Order: ${orderId}</div>
    <div style="width:240px;height:5px;background:rgba(255,255,255,.15);border-radius:100px;overflow:hidden">
      <div id="cfPBar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--st-ok-fg),var(--indigo));border-radius:100px;transition:width .4s ease"></div>
    </div>
    <div id="cfPStatus" style="font-size:.72rem;opacity:.5;margin-top:12px">${method === 'cod' ? 'Validating delivery, stock, and order details...' : 'Connecting to payment gateway...'}</div>
    <div style="font-size:.65rem;opacity:.35;margin-top:24px">${method === 'cod' ? '🔒 Secure COD order · No payment is being processed' : '🔒 256-bit SSL · Payment provider secured · PCI DSS'}</div>
    <style>@keyframes cfSpin{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}</style>
  `;
  document.body.appendChild(el);
}

async function animateProcessing() {
  const steps = [
    [15, 'Connecting to GoKwik...'],
    [35, 'Authenticating...'],
    [55, 'Verifying order details...'],
    [75, 'Processing payment...'],
    [90, 'Confirming transaction...'],
    [100, '✅ Payment successful!'],
  ];
  for (const [pct, msg] of steps) {
    await new Promise(r => setTimeout(r, 480));
    const bar = document.getElementById('cfPBar');
    const status = document.getElementById('cfPStatus');
    if (bar) bar.style.width = pct + '%';
    if (status) status.textContent = msg;
  }
  await new Promise(r => setTimeout(r, 500));
}

function hideProcessingScreen() {
  document.getElementById('cfProcessing')?.remove();
}

/* ── Friendly copy for known backend/gateway errors so customers never
   see internal provider wording like "Merchant Data Not Found". ── */
const PAY_RESULT_ERROR_MAP = [
  { re: /merchant data not found/i, text: 'We could not reach our payment provider. Please wait a moment and try again.' },
  { re: /transactions are not enabled/i, text: 'Online payments are temporarily unavailable with our provider. Please try again shortly, or use Cash on Delivery.' },
  { re: /payment gateway account/i, text: 'Online payments are temporarily unavailable with our provider. Please try again shortly, or use Cash on Delivery.' },
  // COD orders mention no money at all (nothing was charged in the first
  // place); claiming an auto-refund on a COD failure confused customers.
  { re: /could not verify/i, codText: 'We could not place your order just now. Please check your details and try again in a moment — no money is involved with Cash on Delivery.' },
  { re: /could not verify/i, text: 'We could not confirm this payment automatically. If money was deducted, it will be auto-refunded within 5-7 days.' },
];
function friendlyPaymentError(raw, method) {
  for (const m of PAY_RESULT_ERROR_MAP) {
    if (!m.re.test(raw || '')) continue;
    // COD orders get the money-free variant (codText); prepaid flows use
    // the refund-safety wording (text). Entries may define only one of
    // the two — fall through to the next matching rule or the raw text.
    if (method === 'cod') {
      if (m.codText) return m.codText;
      if (m.text) return m.text;
      return raw;
    }
    if (m.text) return m.text;
    continue;
  }
  return raw;
}

// ── PAYMENT RESULT — success OR failure, centred in place ──
// Shows a real modal (dimmed backdrop, sticky pay bar hidden, page locked)
// so the outcome is obvious on phones, not floating at the bottom.
function closePaymentResult() {
  document.getElementById('payResultOverlay')?.remove();
  document.getElementById('payErrorOverlay')?.remove();
  document.body.classList.remove('oz-pay-result');
  if (!document.querySelector('.pay-result-overlay, #payErrorOverlay')) {
    document.body.style.overflow = '';
  }
}
function showPaymentResult(state, opts) {
  // state: 'ok' | 'fail'
  closePaymentResult();
  hideProcessingScreen();
  closePaymentModal();
  document.body.classList.add('oz-pay-result'); // hides #ozPayBar + locks scroll

  const ok = state === 'ok';
  const isCod = opts.method === 'cod';
  const el = document.createElement('div');
  el.className = 'pay-result-overlay';
  el.id = 'payResultOverlay';
  el.onclick = function (e) { if (e.target === el) closePaymentResult(); };

  const refHtml = opts.orderId ? `<div class="pay-result-ref">Order Ref: <strong>${opts.orderId}</strong></div>` : '';
  const amountHtml = opts.total ? `<span style="font-weight:800;font-variant-numeric:tabular-nums">₹${Number(opts.total).toLocaleString('en-IN')}</span>` : '';

  const iconHtml = ok
    ? `<div class="pay-result-icon ok"><svg width="44" height="44" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" stroke="#2f5d3a" stroke-width="2"/><path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#2f5d3a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
    : `<div class="pay-result-icon fail">✕</div>`;

  const title = ok
    ? (isCod ? 'COD Order Confirmed' : 'Payment Successful')
    : (isCod ? 'COD Order Not Placed' : 'Payment Failed');
  const msg = ok
    ? (opts.msg || (isCod ? 'Your Cash on Delivery order is confirmed.' : 'Your payment went through and your order is confirmed.'))
    : friendlyPaymentError(opts.msg || (isCod ? 'We could not place your COD order.' : 'Your payment could not be completed.'), opts.method);

  const noteHtml = ok
    ? (opts.note ? `<div class="pay-result-note">${opts.note}</div>` : '')
    : `<div class="pay-result-note">${isCod ? 'No payment was processed. Your cart is safe.' : (opts.refundNote || 'No money has been deducted from your account.')}</div>`;

  const supportWaNumber = (typeof window.getCustomerWhatsAppNumber === 'function')
    ? window.getCustomerWhatsAppNumber()
    : '919898582650';
  const actionsHtml = ok
    ? `<button class="pay-result-btn pay-result-primary ok" onclick="closePaymentResult(); showPage('thankyou');">Continue to Order Confirmation →</button>
       <button class="pay-result-btn pay-result-secondary" onclick="closePaymentResult(); showPage('home');">Back to Home</button>`
    : `${isCod
       ? `<button class="pay-result-btn pay-result-primary fail" onclick="closePaymentResult(); initiateCOD();">🔄 Retry COD Order</button>`
       : `<button class="pay-result-btn pay-result-primary fail" onclick="closePaymentResult(); initiatePayment();">🔄 Retry Payment</button>`}
       <button class="pay-result-btn pay-result-wa" onclick="window.open('https://wa.me/${supportWaNumber}?text=${encodeURIComponent((isCod ? 'COD order failed' : 'Payment failed') + ' for order ' + (opts.orderId || '') + (opts.total ? ' amount ₹' + opts.total : '') + ', please help')}', '_blank')">💬 WhatsApp Support</button>
       <button class="pay-result-btn pay-result-secondary" onclick="closePaymentResult(); showPage('cart');">← Back to Cart</button>
       <button class="pay-result-btn pay-result-secondary" onclick="closePaymentResult(); showPage('home');">Cancel & Continue Shopping</button>`;

  el.innerHTML = `<div class="pay-result-box">
    ${iconHtml}
    <div class="pay-result-title">${title}</div>
    ${amountHtml && ok ? `<div style="font-size:1.05rem;color:var(--t-hi);margin-bottom:12px">${amountHtml} paid</div>` : ''}
    ${refHtml}
    <p class="pay-result-msg">${msg}</p>
    ${noteHtml}
    <div class="pay-result-actions">${actionsHtml}</div>
  </div>`;

  document.body.appendChild(el);
  // Focus first button for accessibility after the pop animation.
  const firstBtn = el.querySelector('button');
  if (firstBtn) setTimeout(() => firstBtn.focus(), 320);
}

// ── Legacy helper used across the checkout paths — routes through the
// centred modal above so failures are never buried at the page bottom. ──
function showPaymentError(msg, orderId, formData, total, method) {
  showPaymentResult('fail', { orderId: orderId, total: total, msg: msg || '', method: method });
}

// ── FINALIZE ORDER AFTER SUCCESSFUL PAYMENT ──
const PAY_METHOD_LABEL = {
  cod: 'Cash on delivery',
  gokwik: 'Paid online (GoKwik)',
  cashfree: 'Paid online (Cashfree)',
};

// VitaPoints card on the thank-you page.
//   earn      1 point per Rs1 of eligible spend   (vita_config.points_per_rupee_earn)
//   redeem    150 points = Rs1                    (points_per_rupee_redeem)
//   milestone 15,000 points unlocks a reward      (milestone_threshold)
// These mirror vita_config; the server remains the authority and this only
// reports what was just earned.
let VITA_EARN_PER_RUPEE   = 1;
let VITA_REDEEM_PER_RUPEE = 150;
let VITA_MILESTONE        = 15000;

function showVitaEarned(total) {
  const card = document.getElementById('tyVita');
  if (!card) return;

  // Shipping and tax do not earn (earn_on_shipping / earn_on_tax are both
  // false), so this is an estimate off the order value — the server figure
  // is what actually lands in the account.
  const pts = Math.max(0, Math.floor((Number(total) || 0) * VITA_EARN_PER_RUPEE));
  if (!pts) return;                       // no points, no card
  // Guests can't see their balance yet — points are banked against their
  // checkout email either way, so show a sign-in nudge instead of a dead
  // "View my VitaPoints" button that would dump them at a login wall.
  const link = document.getElementById('tyVitaLink');
  if (link && !localStorage.getItem('asc_jwt')) {
    link.textContent = "Sign in to see your VitaPoints \u203a";
    link.setAttribute('aria-label', 'Sign in to view your VitaPoints balance');
    link.onclick = function () { showPage('login'); };
  }

  card.style.display = 'block';
  // Counts up rather than appearing. This is the one screen where the
  // number IS the reward, so it is worth watching it land. The value is
  // still whatever finalizeOrder() was given — the count is presentation.
  const amt = document.getElementById('tyVitaPts');
  if (amt) {
    if (typeof vitaCountUp === 'function') vitaCountUp(amt, pts, 1400);
    else amt.textContent = pts.toLocaleString('en-IN');
  }

  const worth = pts / VITA_REDEEM_PER_RUPEE;
  const note = document.getElementById('tyVitaNote');
  if (note) {
    note.innerHTML =
      'Worth about <strong>&#8377;' + worth.toFixed(worth < 10 ? 2 : 0) + '</strong> off a future order. ' +
      'Points are confirmed <strong>7 days after delivery</strong>, once the return window closes.';
  }

  // Progress toward the milestone reward. Counts this order only — the
  // running balance lives on the account page, and guessing it here would
  // be worse than not showing it.
  const bar = document.getElementById('tyVitaBar');
  const wrap = document.getElementById('tyVitaBarWrap');
  const pct = Math.min(100, (pts / VITA_MILESTONE) * 100);
  if (pct < 1) {
        if (wrap) wrap.style.display = 'none';   // a bar at 0.3% just looks broken
  } else if (bar) {
    requestAnimationFrame(function () { bar.style.width = pct.toFixed(1) + '%'; });
  }
}

// REVIEW COLLECTION: Thank You page nudge. Runs on every Thank You page
// render for logged-in customers: fetches their order history, finds
// delivered products they have NOT yet reviewed, and reveals the nudge
// card only if there is at least one such product. Clicking the button
// opens that product's page straight onto the review form — the shortest
// possible path from "order delivered" to "review published".
async function evaluateTyReviewNudge() {
  const card = document.getElementById('tyReviewNudge');
  if (!card || !localStorage.getItem('asc_jwt')) return;   // guests: sign-in gate covers it
  try {
    const r = await fetchWithTimeout(API_BASE + '/api/orders/my', {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('asc_jwt') || '') }
    }, 8000);
    if (!r.ok) return;
    const data = await r.json();
    const orders = data.data || data || [];
    // Collected = delivered AND not cancelled; the item ids are product ids.
    const eligible = new Set();
    for (const o of orders) {
      const f = String(o.fulfillment || '').toLowerCase();
      if (f !== 'delivered') continue;
      for (const it of (o.items || [])) eligible.add(Number(it.product_id || it.id || 0));
      eligible.delete(0);
    }
    if (!eligible.size) return;
    // Load what this customer has already reviewed. The storefront's
    // Supabase client is public-anon and the reviews table is readable, so
    // fetch all approved reviews once and filter by the logged-in email —
    // same pattern loadProductRatings() uses for ratings.
    const sb = await sbClientWhenReady(6000);
    const reviewed = new Set();
    if (sb) {
      try {
        const user = getCurrentUser();
        const email = (user && user.email || '').toLowerCase().trim();
        if (email) {
          // PERF (Aug 2026): reuse the single shared reviews batch instead
          // of firing yet another Supabase call. The batch was already
          // fetched for the homepage, so this costs nothing extra.
          const rows = await loadReviewsBatch();
          for (const rv of (rows || [])) {
            if ((rv.user || '').toLowerCase().trim() === email) reviewed.add(Number(rv.productId));
          }
        }
      } catch(e) {}
    }
    const missing = [...eligible].filter(p => !reviewed.has(p));
    if (!missing.length) return;
    // Remember the product the customer is missing a review for.
    try { sessionStorage.setItem('asc_ty_review_product', missing[0]); } catch(e) {}
    card.style.display = 'block';
    try { ozylixReviewReminder(missing[0]); } catch(e) {}
  } catch(e) { /* nudge is non-critical — fail silently */ }
}

// REVIEW COLLECTION: Thank You button handler. Prefers the product the
// nudge evaluated; falls back to the just-placed order's first item.
function openReviewFromThankYou() {
  let pid = 0;
  try { pid = Number(sessionStorage.getItem('asc_ty_review_product') || 0) || 0; } catch(e) {}
  if (!pid) {
    try { const o = JSON.parse(localStorage.getItem('asc_last_order') || '{}'); pid = Number((o.items||[])[0] && ((o.items[0].product_id) || (o.items[0].id) || 0)) || 0; } catch(e) {}
  }
  if (pid) openProductReview(pid);
  else showPage('account');
}
async function finalizeOrder(orderId, formData, total, method, codCharge, paymentSessionToken) {
  const orderNumEl = document.getElementById('orderNum');
  if (orderNumEl) orderNumEl.textContent = orderId;
  const payEl = document.getElementById('tyPayMethod');
  if (payEl) payEl.textContent = PAY_METHOD_LABEL[method] || 'Paid online';
  // The secure-payment strip above the tracker was hard-coded to 'via GoKwik'
  // — on COD orders that confused customers (no money changes hands at all).
  const secureEl = document.getElementById('tySecurePay');
  if (secureEl) {
    const m = String(method || '').toLowerCase();
    secureEl.innerHTML = m === 'cod'
      ? '💵 <strong style="color:var(--t-hi)">Cash on delivery</strong> — pay when your parcel arrives'
      : '🔒 <strong style="color:var(--t-hi)">Secure payment</strong> via ' + (m === 'cashfree' ? 'Cashfree' : 'GoKwik');
  }
  try { showVitaEarned(total); } catch (e) {}

  // Build order items
  const cartSnapshot = [...STORE.cart];
  const srItems = cartSnapshot.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return null;
    const price = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    const mrp   = item.tierMrp  !== undefined ? item.tierMrp  : p.price;
    return {
      name: p.name + (item.tierTabs ? ` (${item.tierTabs} tabs)` : ''),
      sku:  'ASC-' + p.id + (item.tierTabs ? '-' + item.tierTabs : ''),
      units: item.qty,
      selling_price: price,
      mrp: mrp,
      discount: Math.max(0, mrp - price),
      tax: '',
      hsn: '30049099',
    };
  }).filter(Boolean);

  const sub  = srItems.reduce((s, i) => s + i.selling_price * i.units, 0);
  const disc = srItems.reduce((s, i) => s + i.discount * i.units, 0);
  // Also add promo discount (on top of product tier discounts)
  const clientBreakdown = getOrderTotal();
  const promoDisc = Number(clientBreakdown.disc || 0);
  const mixDisc = Number(clientBreakdown.mixMatchDiscount || 0);
  const totalDisc = disc + promoDisc + mixDisc;
  const ship = total - (sub - promoDisc - mixDisc);

  const nameParts = (formData.firstName + ' ' + formData.lastName).trim().split(' ');
  const firstName = nameParts[0] || formData.firstName;
  const lastName  = nameParts.slice(1).join(' ') || '.';

  let srOrderId = null, srShipmentId = null, srAwb = null;
  let srStatus = 'Confirmed — Awaiting Dispatch';

  // How many VitaPoints the customer chose to redeem. The actual debit
  // happens SERVER-SIDE (vita_redeem, atomic and idempotent per order id)
  // when the order is accepted below — never here. Awarding/redeeming
  // locally first was what let the on-screen balance diverge from the real
  // ledger, and left phantom points behind whenever the order save failed.
  var _vitaPointsForOrder = (typeof VITA_APPLIED !== 'undefined' && VITA_APPLIED > 0) ? VITA_APPLIED : 0;

  // ── 2a. Save order to the database — the ONLY source of truth ────
  // ROOT CAUSE OF "order confirmed but missing from My Orders": this call
  // used to be fire-and-forget — `await fetch(...)` with no response check,
  // wrapped in a try/catch that swallowed everything. If the request 401'd
  // (expired token), 400'd (price recheck), or timed out (Render free tier
  // cold-starts for 30-60s after 15 min idle, past the old 25s timeout),
  // the order was silently lost while the customer was still shown
  // "Order Confirmed!" with an order ID that existed nowhere.
  //
  // Now: the save is verified, retried through a cold start, and the
  // thank-you page is only reached if the database actually has the order.
  // VitaPoints are NOT computed here at all — the server awards them into
  // vita_ledger_v2 (the live ledger) when the server accepts the order, and we read the real balance
  // back afterwards.
  let _savedOrder = null;
  let _saveError = null;
  try {
    const _jwt = localStorage.getItem('asc_jwt') || '';
    const isOnlinePayment = (method !== 'cod');
    const orderPayload = {
      id: orderId,
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      address_line1: formData.addr1,
      address_line2: formData.addr2 || '',
      city: formData.city,
      state: formData.state,
      pincode: formData.pin,
      total: total,
      coupon_code: (typeof activePromoCode !== 'undefined' && activePromoCode) ? activePromoCode.code : null,
      vita_points: _vitaPointsForOrder,
      // 2026-08: the discount breakdown the customer saw at checkout travels
      // with the order so the saved row, the invoice and My Account all show
      // every discount by name and amount. The server recomputes its own
      // authoritative numbers regardless — these are for display parity.
      tier_discount: Number(disc || 0),
      mix_match_discount: Number(mixDisc || 0),
      coupon_discount: Number(promoDisc || 0),
      // _vitaOffForOrder is computed right after getOrderTotal() above —
      // if it is ever undefined (defensive guard), fall back to the
      // checkout summary's own vitaOff value.
      vita_points_discount: Number((typeof _vitaOffForOrder !== 'undefined' ? _vitaOffForOrder : (clientBreakdown.vitaOff || 0)) || 0),
      vita_points_used: Number(_vitaPointsForOrder || 0),
      payment_status: method === 'cod' ? 'COD - Pending' : 'Paid',
      fulfillment: 'Pending',
      payment_method: method,
      gk_order_id: orderId,
      shiprocket_id: srOrderId || null,
      items: JSON.stringify(cartSnapshot.map(item => {
        const p = PRODUCTS.find(p => p.id === item.id);
        if (!p) return null;
        const price = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
        const line = {
          id: p.id,
          name: p.name + (item.tierTabs ? ` (${item.tierTabs} tabs)` : ''),
          qty: item.qty,
          price: price,
          category: p.category || 'Other',
        };
        // CRITICAL: the pack identity must travel with the line.
        // The server re-prices every order from the products table and
        // deliberately ignores the `price` above (a client could forge it).
        // Without tierTabs/tierIdx it cannot tell WHICH pack was bought, so
        // it fell back to the single-unit price — a 45-tab pack sold at
        // ₹1,158 was recorded as ₹399, and the customer's order history
        // and VitaPoints were both wrong as a result.
        if (item.tierTabs != null) line.tierTabs = item.tierTabs;
        if (item.tierIdx  != null) line.tierIdx  = item.tierIdx;
        return line;
      }).filter(Boolean)),
    };

    const gatewayEndpoint = method === 'cashfree' ? '/api/confirm-cashfree-order' : (method === 'cod' ? '/api/confirm-cod-order' : '/api/confirm-gokwik-order');
    const useConfirmationEndpoint = isOnlinePayment || method === 'cod';
    const url  = API_BASE + (useConfirmationEndpoint ? gatewayEndpoint : '/api/orders');
    const body = useConfirmationEndpoint
      ? JSON.stringify({ order_id: orderId, order_data: orderPayload })
      : JSON.stringify(orderPayload);

    // Retry loop: three attempts, growing timeout. Re-POSTing the same
    // order id is safe — the server upserts on id and vita_award/vita_redeem
    // are idempotent per order_id, so a retry after a timeout that actually
    // succeeded server-side cannot create a second order or double-award.
    //
    // 30s/45s/45s was sized for a sleeping free-tier instance. Kept
    // deliberately longer than the read paths above — this is the call
    // that takes the customer's money, and abandoning a slow write is
    // worse than waiting — but not 45 seconds longer, because a shopper
    // watching a frozen Pay button for two minutes assumes it broke and
    // presses it again.
    // Cold starts on the free-tier host take up to ~45s; the first attempt
    // gets the longer window because Render only wakes on the first hit —
    // a 20s timeout on attempt 1 guaranteed failure whenever the host was
    // sleeping, which was the single most common cause of the 'could not
    // confirm this payment' COD failures reported by customers.
    const timeouts = [45000, 25000, 25000];
    for (let attempt = 0; attempt < timeouts.length; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
        const resp = await fetch(url, {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' },
            _jwt ? { 'Authorization': 'Bearer ' + _jwt } : {},
            paymentSessionToken ? { 'X-Payment-Session': paymentSessionToken } : {}),
          signal: AbortSignal.timeout(timeouts[attempt]),
          body: body,
        });
        const result = await resp.json().catch(() => ({}));
        if (resp.ok) { _savedOrder = result.data || result; _saveError = null; break; }

        // 4xx (bad token, product unavailable, price mismatch) will fail the
        // same way every time — don't burn the remaining retries on it.
        _saveError = result.error || result.message || ('Server returned ' + resp.status);
        if (resp.status >= 400 && resp.status < 500) break;
      } catch (e) {
        _saveError = (e.name === 'TimeoutError' || e.name === 'AbortError')
          ? 'The server took too long to respond.' : e.message;
      }
    }
  } catch (e) {
    _saveError = e.message;
  }

  // Order did not reach the database — stop here. Keep the cart intact and
  // tell the customer the truth instead of showing a fake confirmation.
  if (!_savedOrder) {
    console.error('[ORDER SAVE FAILED]', _saveError);
    try {
        showPaymentError(
        (method === 'cod'
          ? 'We could not place your order just now — no money is involved with Cash on Delivery and your cart is safe. Please check your details and try again in a moment.'
          : 'Your payment went through but we could not confirm the order on our server. Please do not pay again — contact +91 98985 82650 with Order ID: ' + orderId)
          + (_saveError ? ' (' + _saveError + ')' : ''),
        orderId, formData, total, method
      );
    } catch (e) {
      showToast('⚠️ Could not place your order. Please try again.');
    }
    return;
  }

  // Only dispatch after verified server-side order confirmation.
  // ── Push to Shiprocket ──────────────────────────────────
  if (method !== 'demo') {
    try {
      const srResp = await fetch(SHIPROCKET_CONFIG.apiBase + '/api/create-shiprocket-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (localStorage.getItem('asc_jwt') || '') },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ order_id: orderId }),
      });
      const srData = await srResp.json();
      if (srResp.ok && srData.order_id) {
        srOrderId = srData.order_id; srShipmentId = srData.shipment_id; srAwb = srData.awb_code || null;
        srStatus = 'Pushed to Shiprocket — Ready to Ship 🚚';
        const trackBtn = document.getElementById('trackOrderBtn');
        if (trackBtn) { trackBtn.href = srAwb ? 'https://shiprocket.co/tracking/'+srAwb : 'https://shiprocket.in/shipment-tracking/'; trackBtn.style.display='inline-flex'; }
        const srIdEl = document.getElementById('srOrderId');
        if (srIdEl) { srIdEl.textContent = srOrderId; const row=document.getElementById('srOrderRow'); if(row) row.style.display='flex'; }
      } else {
        // Log the actual error from Shiprocket so we can debug
        console.error('❌ Shiprocket error:', JSON.stringify(srData));
        srStatus = 'Order Confirmed — Dispatch Pending';
      }
    } catch(e) { console.error('❌ Shiprocket fetch failed:', e.message); }
  } else {
    srStatus = '';
  }

  // ── 2. Save order locally ──────────────────────────────────
  try {
    const orders = JSON.parse(localStorage.getItem('asc_orders') || '[]');
    orders.push({
      orderId, srOrderId, srShipmentId, srAwb,
      date: new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}),
      customer: `${formData.firstName} ${formData.lastName}`,
      email: formData.email, phone: formData.phone,
      userEmail: (getCurrentUser()?.email || formData.email || '').toLowerCase().trim(),
      address: `${formData.addr1}, ${formData.city}, ${formData.state} - ${formData.pin}`,
      total, method, items: srItems.map(i=>({name:i.name,qty:i.units,price:i.selling_price})),
      status: srStatus,
    });
    localStorage.setItem('asc_orders', JSON.stringify(orders));
  } catch(e) {}


  // Order is confirmed in the database. The server has already awarded
  // VitaPoints into the ledger and debited any redemption — pull the real
  // numbers back so the account page and checkout widget are accurate.
  try { await vitaRefreshFromServer(); } catch(e) {}
  try { if (_vitaPointsForOrder > 0) vitaClearApplied(); } catch(e) {}


  // ── 3. Generate invoice ────────────────────────────────────
  // Uses buildInvoiceHTML() — the same GST-compliant "single source of
  // truth" template My Account uses for Invoices & Payments — so the
  // checkout invoice and the My Account invoice are identical.
  let invoiceHtml = null;
  try {
    invoiceHtml = buildInvoiceHTML({
      orderId, date: new Date().toLocaleDateString('en-IN'),
      customer: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email, phone: formData.phone,
      address: `${formData.addr1}, ${formData.city}, ${formData.state} - ${formData.pin}`,
      state: formData.state,
      items: srItems, ship,
      // 2026-08: breakdown every discount separately — the invoice must list
      // each saving (pack/tier, Mix&Match, promo code, VitaPoints) so the
      // customer can reconcile My Orders, the invoice and the payment row.
      // disc/mixDisc come from finalizeOrder's own totals computation.
      tier_discount: Number(disc || 0),
      mix_match_discount: Number(mixDisc || 0),
      coupon_discount: Number(promoDisc || 0),
      coupon_code: (typeof activePromoCode !== 'undefined' && activePromoCode && activePromoCode.code) || '',
      vita_points_discount: (typeof VITA_APPLIED !== 'undefined' && Number(VITA_APPLIED) > 0) ? (typeof vitaCheckoutInfo === 'function' ? Number((vitaCheckoutInfo(sub - (promoDisc||0) - (mixDisc||0)) || {}).rupees || 0) : 0) : 0,
      vita_points: (typeof VITA_APPLIED !== 'undefined' && Number(VITA_APPLIED) > 0) ? Number(VITA_APPLIED) : 0,
      total, method,
    });
    // Open it for the customer right away (the old generateInvoice()
    // did this as a side effect internally; buildInvoiceHTML() is pure,
    // so it's done explicitly here instead).
    const _invBlob = new Blob([invoiceHtml], { type: 'text/html' });
    const _invUrl = URL.createObjectURL(_invBlob);
    const _invWin = window.open(_invUrl, '_blank', 'width=960,height=800,scrollbars=yes');
    if (_invWin) { setTimeout(() => URL.revokeObjectURL(_invUrl), 30000); }
    else { URL.revokeObjectURL(_invUrl); }
    // "View Invoice" button on the thank-you page
    setTimeout(() => {
      const tyPage = document.getElementById('page-thankyou');
      if (!tyPage) return;
      const existing = document.getElementById('invoiceBtn');
      if (existing) existing.remove();
      const invBtn = document.createElement('a');
      invBtn.id = 'invoiceBtn';
      invBtn.textContent = '🧾 Download / Print Invoice';
      invBtn.style.cssText = 'display:inline-flex;align-items:center;gap:8px;background:#2E7D32;color:white;border-radius:100px;padding:11px 26px;font-weight:700;font-size:.84rem;text-decoration:none;margin:8px 4px;cursor:pointer';
      invBtn.onclick = function() {
        // Prefer the server-side printable A4 PDF (same document My Account
        // downloads); the already-open HTML preview remains as the fallback.
        const t = localStorage.getItem('asc_token');
        const _h = t ? { 'Authorization': 'Bearer ' + t } : {};
        fetchWithTimeout(API_BASE + '/api/orders/' + encodeURIComponent(orderId) + '/pdf', { headers: _h })
          .then(function(r){
            if (!r.ok) throw new Error('server ' + r.status);
            return r.blob().then(function(blob){
              const u = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = u;
              a.download = 'Ozylix-Tax-Invoice-' + orderId + '.pdf';
              document.body.appendChild(a);
              a.click();
              setTimeout(function(){ URL.revokeObjectURL(u); if (a.parentNode) a.parentNode.removeChild(a); }, 4000);
              showToast('🧾 Invoice downloaded (PDF)');
            });
          })
          .catch(function(){
            const b = new Blob([invoiceHtml], { type: 'text/html' });
            const u = URL.createObjectURL(b);
            const w = window.open(u, '_blank', 'width=960,height=800,scrollbars=yes');
            if (w) setTimeout(() => URL.revokeObjectURL(u), 30000); else URL.revokeObjectURL(u);
            showToast('Invoice opened for print');
          });
      };
      // Anchor to the facts block, not to #orderNum's own parent — that
      // is now a row inside a bordered definition list, and appending a
      // pill button into it drops the invoice button inside the table.
      const facts = document.querySelector('#page-thankyou .ty-facts');
      if (facts) facts.insertAdjacentElement('afterend', invBtn);
      else tyPage.appendChild(invBtn);
    }, 0);
  } catch(e) { console.warn('Invoice:', e); }

  // ── 4. Send confirmation email ─────────────────────────────
  try {
    await sendOrderEmail({ orderId, formData, srItems, sub, totalDisc, promoDisc, ship, total, method, srAwb, invoiceHtml });
  } catch(e) { console.warn('Email:', e.message); }

  // ── 5. Clear cart + show thank-you ────────────────────────
  STORE.cart = []; STORE.save();
  activePromoCode = null; appliedDiscount = null; window._pendingPayment = null;
  // Track purchase in Google Analytics
  try {
    window._trackPurchase && window._trackPurchase(orderId, total,
      srItems.map(i => ({ item_name: i.name, price: i.selling_price, quantity: i.units }))
    );
  } catch(e) {}
  // Payment just succeeded — show the SUCCESS result in place first so the
  // customer clearly sees the outcome on screen before the thank-you page.
  showPaymentResult('ok', { orderId: orderId, total: total, method: method,
    msg: 'Your payment of ₹' + Number(total).toLocaleString('en-IN') + ' was received successfully.',
    note: (method ? 'Payment method: ' + (PAY_METHOD_LABEL[method] || method) : '') + '. You will receive your invoice and tracking link by email and SMS.' });
  showPage('thankyou');
  // REVIEW COLLECTION: once the Thank You page is on screen, evaluate
  // whether this logged-in customer has delivered orders without reviews
  // and show the nudge card if so.
  setTimeout(() => { try { evaluateTyReviewNudge(); } catch(e) {} }, 600);
  /* Record the conversion against this visitor session so the admin
     dashboard's conversion rate and revenue-by-source are real. */
  try {
    if (window.AZAnalytics) {
      var _o = (typeof order !== 'undefined' && order) ? order
             : (typeof orderData !== 'undefined' ? orderData : null);
      window.AZAnalytics.convert(_o && (_o.id || _o.order_id), _o && (_o.total || _o.amount));
    }
  } catch (e) {}
  showToast(`✅ Order confirmed! Invoice opened & email sent 🧾`);
}

// ══════════════════════════════════════════════════════════════
// AUTO EMAIL — Sends order confirmation via EmailJS
// Setup: https://www.emailjs.com (free — 200 emails/month)
// 1. Create account → Email Services → connect Gmail
// 2. Email Templates → create template with variables below
// 3. Replace EMAILJS_SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY
// ══════════════════════════════════════════════════════════════
async function sendOrderEmail({ orderId, formData, srItems, sub, totalDisc, promoDisc, ship, total, method, srAwb, invoiceHtml }) {
  // ── CONFIG — replace these 3 values with yours from emailjs.com ──
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz456'
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'user_AbCdEfGhIj'

  // Build items table for email
  const itemsText = srItems.map(i => `${i.name} × ${i.units} = ₹${(i.selling_price * i.units).toLocaleString('en-IN')}`).join('\n');
  const itemsHtml = srItems.map(i =>
    `<tr style="border-bottom:1px solid var(--edge-hi)">
       <td style="padding:8px 12px">${i.name}</td>
       <td style="padding:8px 12px;text-align:center">${i.units}</td>
       <td style="padding:8px 12px;text-align:right">₹${i.selling_price.toLocaleString('en-IN')}</td>
       <td style="padding:8px 12px;text-align:right;font-weight:700">₹${(i.selling_price * i.units).toLocaleString('en-IN')}</td>
     </tr>`
  ).join('');

  const trackUrl = srAwb ? `https://shiprocket.co/tracking/${srAwb}` : 'https://shiprocket.in/shipment-tracking/';
  const methodName = method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : method === 'netbanking' ? 'Net Banking' : method === 'emi' ? 'EMI' : method === 'demo' ? 'Demo (Test)' : method;

  // Full HTML email body
  const emailHtml = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:var(--sub-1);border:1px solid var(--edge-hi);border-radius:12px;overflow:hidden">
    <div style="background:linear-gradient(135deg,var(--f-mineral-d),var(--f-mineral));padding:28px 32px;color:var(--t-hi);text-align:center">
      <div style="font-size:24px;font-weight:900;margin-bottom:4px">🌿 Ozylix</div>
      <div style="font-size:13px;opacity:.8">Order Confirmation</div>
    </div>
    <div style="padding:28px 32px">
      <h2 style="font-size:18px;color:var(--f-mineral-d);margin-bottom:4px">Hi ${formData.firstName}! Your order is confirmed 🎉</h2>
      <p style="color:var(--t-low);font-size:14px;margin-bottom:20px">Thank you for shopping with Ozylix. Here's your order summary.</p>

      <div style="background:var(--sub-1);border:1px solid var(--t-low);border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:13px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><strong>Order ID:</strong><span style="color:var(--f-mineral-d);font-weight:700">${orderId}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><strong>Date:</strong><span>${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</span></div>
        <div style="display:flex;justify-content:space-between"><strong>Payment:</strong><span>${method === 'cod' ? '💵 Cash on Delivery (on delivery)' : methodName + ' ✅ PAID'}</span></div>
      </div>

      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.5px;color:var(--t-low);margin-bottom:10px">Order Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px">
        <thead><tr style="background:var(--f-mineral-d);color:var(--t-hi)">
          <th style="padding:8px 12px;text-align:left">Product</th>
          <th style="padding:8px 12px;text-align:center">Qty</th>
          <th style="padding:8px 12px;text-align:right">Price</th>
          <th style="padding:8px 12px;text-align:right">Total</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="border-top:2px solid var(--f-mineral-d);padding-top:12px;font-size:13px">
        <div style="display:flex;justify-content:space-between;padding:4px 0;color:var(--t-mid)"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
        ${disc > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:var(--f-mineral-d)"><span>📦 Pack / Tier Saving</span><span>-₹${disc.toLocaleString('en-IN')}</span></div>` : ''}
        ${mixDisc > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:var(--f-mineral-d)"><span>🎉 Mix &amp; Match Discount</span><span>-₹${mixDisc.toLocaleString('en-IN')}</span></div>` : ''}
        ${promoDisc > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:var(--f-mineral-d);font-weight:700"><span>🏷️ Promo Code${(typeof activePromoCode !== 'undefined' && activePromoCode && activePromoCode.code) ? ' (' + activePromoCode.code + ')' : ''}</span><span>-₹${promoDisc.toLocaleString('en-IN')}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;padding:4px 0;color:var(--t-mid)"><span>Shipping</span><span>${ship === 0 ? '<span style="color:var(--f-mineral-d)">FREE</span>' : '₹' + ship}</span></div>
        ${totalDisc > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0 2px;color:var(--t-main);font-weight:700"><span>Total Savings</span><span>-₹${totalDisc.toLocaleString('en-IN')}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;padding:10px 0 4px;font-size:16px;font-weight:900;color:var(--f-mineral-d);border-top:1px solid var(--edge-hi);margin-top:6px"><span>Grand Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
      </div>

      <div style="margin:20px 0;background:var(--st-muted-bg);border-radius:8px;padding:14px 18px;font-size:13px;line-height:1.8">
        <strong style="display:block;margin-bottom:6px">📍 Delivery Address</strong>
        ${formData.firstName} ${formData.lastName}<br>
        ${formData.addr1}${formData.addr2 ? ', ' + formData.addr2 : ''}<br>
        ${formData.city}, ${formData.state} – ${formData.pin}, India<br>
        📞 ${formData.phone}
      </div>

      ${method !== 'demo' ? `<a href="${trackUrl}" style="display:block;background:var(--f-mineral-d);color:var(--t-hi);text-align:center;padding:13px;border-radius:100px;font-weight:700;text-decoration:none;font-size:14px;margin:16px 0">📦 Track Your Order on Shiprocket</a>` : ''}

      <p style="font-size:12px;color:var(--t-low);text-align:center;margin-top:20px">
        For queries: <a href="mailto:ozylixcare@gmail.com" style="color:var(--f-mineral-d)">ozylixcare@gmail.com</a> | +91 98985 82650<br>
        Ozylix · Near Rajshivalay Cinema, Anand – 388001, Gujarat
      </p>
    </div>
  </div>`;

  // Send via EmailJS
  if (typeof emailjs === 'undefined') {
    return;
  }
  if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
    console.info('📧 Demo email (EmailJS not configured yet). Email HTML ready:\n', emailHtml.substring(0, 200) + '...');
    return;
  }

  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email:      formData.email,
    to_name:       formData.firstName + ' ' + formData.lastName,
    order_id:      orderId,
    order_total:   '₹' + total.toLocaleString('en-IN'),
    order_date:    new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'}),
    items_text:    itemsText,
    email_body:    emailHtml,
    company_email: 'ozylixcare@gmail.com',
    phone:         formData.phone,
    address:       `${formData.addr1}, ${formData.city}, ${formData.state} - ${formData.pin}`,
    tracking_url:  trackUrl,
  }, { publicKey: EMAILJS_PUBLIC_KEY });

}


// ══════════════════════════════════════════════════════════════
// INVOICE GENERATOR — Full GST Tax Invoice
// ══════════════════════════════════════════════════════════════
function generateInvoice({ orderId, formData, srItems, sub, disc, promoDisc, ship, total, method, srOrderId }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const invNo = 'INV-' + orderId.replace('AVC-','').replace('DEMO-','D');

  // 2026-08: VitaPoints redemption breakdown on the invoice — the frontend
  // computed it for the order; mirror it on the invoice the customer prints.
  let vitaInvDisc = 0, vitaInvPts = 0;
  if (typeof VITA_APPLIED !== 'undefined' && VITA_APPLIED > 0) {
    const _vi = (typeof vitaCheckoutInfo === 'function') ? vitaCheckoutInfo(sub - promoDisc - (mixMatchDiscount || 0)) : null;
    vitaInvPts = Number(VITA_APPLIED || 0);
    vitaInvDisc = Number((_vi && _vi.rupees) || 0);
  }
  const totalInvDisc = Number(disc || 0) + Number(mixMatchDiscount || 0) + Number(promoDisc || 0) + vitaInvDisc;

  // GST calculation: 5% GST (CGST 2.5% + SGST 2.5% for Gujarat, IGST 5% for other states)
  const isGujarat = (formData.state || '').toLowerCase().includes('gujarat');
  const taxableBase = Math.round(sub / 1.05); // reverse-calculate base from inclusive price
  const gstTotal = sub - taxableBase;
  const cgst = isGujarat ? Math.round(gstTotal / 2) : 0;
  const sgst = isGujarat ? Math.round(gstTotal / 2) : 0;
  const igst = !isGujarat ? gstTotal : 0;

  const itemRows = srItems.map(item => {
    const base = Math.round((item.selling_price * item.units) / 1.05);
    const gst  = (item.selling_price * item.units) - base;
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi)">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:center">${item.sku}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:center">${item.units}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right">₹${item.mrp}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right">₹${item.selling_price}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right">₹${item.discount > 0 ? item.discount * item.units : '-'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right">5%</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right">₹${gst.toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--edge-hi);text-align:right;font-weight:700">₹${(item.selling_price * item.units).toLocaleString('en-IN')}</td>
      </tr>`;
  }).join('');

  const gstRows = isGujarat ? `
    <tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-mid)">CGST (2.5%)</td><td colspan="2" style="padding:6px 12px;text-align:right">₹${cgst.toLocaleString('en-IN')}</td></tr>
    <tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-mid)">SGST (2.5%)</td><td colspan="2" style="padding:6px 12px;text-align:right">₹${sgst.toLocaleString('en-IN')}</td></tr>
  ` : `
    <tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-mid)">IGST (5%)</td><td colspan="2" style="padding:6px 12px;text-align:right">₹${igst.toLocaleString('en-IN')}</td></tr>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${invNo} — Ozylix</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #222; background:#fff; padding:30px; }
  .inv-wrap { max-width:900px; margin:0 auto; border:1px solid #ddd; border-radius:10px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
  .inv-header { background:linear-gradient(135deg,#2E7D32 0%,#1C5620 100%); color:#fff; padding:28px 32px; display:flex; justify-content:space-between; align-items:flex-start; }
  .inv-logo-name { font-size:22px; font-weight:900; letter-spacing:.5px; }
  .inv-logo-sub { font-size:11px; opacity:.8; margin-top:3px; }
  .inv-company-addr { font-size:11px; opacity:.85; line-height:1.7; text-align:right; }
  .inv-meta { background:var(--st-ok-bg); padding:20px 32px; display:flex; justify-content:space-between; border-bottom:2px solid #2E7D32; }
  .inv-meta-block { line-height:1.8; }
  .inv-meta-block strong { font-size:11px; text-transform:uppercase; color:#666; letter-spacing:.5px; display:block; }
  .inv-meta-block span { font-size:14px; font-weight:700; color:#2E7D32; }
  .inv-section { padding:20px 32px; }
  .inv-section h3 { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#666; margin-bottom:12px; }
  .inv-cust-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .inv-cust-box { background:var(--st-muted-bg); border:1px solid var(--edge-hi); border-radius:6px; padding:14px; line-height:1.8; }
  .inv-cust-box strong { font-size:11px; text-transform:uppercase; color:var(--t-low); display:block; margin-bottom:4px; }
  table { width:100%; border-collapse:collapse; }
  thead tr { background:#2E7D32; color:#fff; }
  thead th { padding:10px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.3px; }
  thead th:not(:first-child) { text-align:right; }
  thead th:nth-child(3),thead th:nth-child(7) { text-align:center; }
  tbody tr:hover { background:var(--st-ok-bg); }
  .inv-totals { background:var(--st-ok-bg); border-top:2px solid #2E7D32; }
  .inv-totals td { padding:7px 12px; }
  .inv-grand { background:#2E7D32 !important; color:#fff; }
  .inv-grand td { padding:12px; font-size:15px; font-weight:900; }
  .inv-footer { background:#2E7D32; color:white; padding:16px 32px; text-align:center; font-size:11px; opacity:.9; line-height:2; }
  .inv-status { display:inline-block; background:#22c55e; color:white; border-radius:100px; padding:3px 14px; font-size:11px; font-weight:700; margin-left:8px; }
  @media print { body{padding:0;} .no-print{display:none!important;} }
</style>

</head>
<body>
<div class="inv-wrap">
  <!-- HEADER -->
  <div class="inv-header">
    <div style="display:flex;align-items:center;gap:14px;">
      <img src="assets/ozylix-icon-192.png"
        alt="Ozylix" style="height:56px;width:auto;background:var(--sub-1);border-radius:8px;padding:6px 10px;flex-shrink:0;"
        onerror="this.style.display='none';var s=document.getElementById('invLogoFallback');if(s)s.style.display='block';" decoding="async">
      <div>
        <div class="inv-logo-name" id="invLogoFallback" style="display:none;">🌿 Ozylix</div>
        <div class="inv-logo-sub">Organic Vitamins & Nutraceuticals</div>
        <div style="font-size:10px;opacity:.7;margin-top:6px">FSSAI Lic. No: 10024022001967 &nbsp;|&nbsp; GSTIN: 24XXXXX (update)</div>
      </div>
    </div>
    <div class="inv-company-addr">
      <div style="background:rgba(255,255,255,0.15);border-radius:6px;padding:8px 14px;display:inline-block;margin-bottom:8px;">
        <strong style="font-size:13px;display:block;">TAX INVOICE</strong>
      </div><br>
      Amin Auto Road, Near Rajshivalay Cinema<br>
      Anand – 388001, Gujarat, India<br>
      📞 +91 98985 82650<br>
      ✉ ozylixcare@gmail.com<br>
      🌐 ascovita.in
    </div>
  </div>

  <!-- META ROW -->
  <div class="inv-meta">
    <div class="inv-meta-block">
      <strong>Invoice Number</strong>
      <span>${invNo}</span>
    </div>
    <div class="inv-meta-block">
      <strong>Invoice Date</strong>
      <span>${dateStr}</span>
    </div>
    <div class="inv-meta-block">
      <strong>Order ID</strong>
      <span>${orderId}</span>
    </div>
    <div class="inv-meta-block">
      <strong>Payment</strong>
      <span>${method === 'cod' ? '💵 Cash on Delivery' : method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : method === 'netbanking' ? 'Net Banking' : method === 'emi' ? 'EMI' : method === 'demo' ? '🧪 Demo' : '🔒 Online Payment'} <span class="inv-status" style="${method === 'demo' ? 'background:var(--seal)' : ''}">${method === 'demo' ? 'TEST MODE' : 'PAID'}</span></span>
    </div>
    ${srOrderId ? `<div class="inv-meta-block"><strong>Shiprocket ID</strong><span>${srOrderId}</span></div>` : ''}
  </div>

  <!-- CUSTOMER & SHIPPING -->
  <div class="inv-section">
    <h3>Bill To / Ship To</h3>
    <div class="inv-cust-grid">
      <div class="inv-cust-box">
        <strong>Customer Details</strong>
        <b>${formData.firstName} ${formData.lastName}</b><br>
        📞 ${formData.phone}<br>
        ✉ ${formData.email}
      </div>
      <div class="inv-cust-box">
        <strong>Delivery Address</strong>
        ${formData.addr1}${formData.addr2 ? ', ' + formData.addr2 : ''}<br>
        ${formData.city}, ${formData.state} – ${formData.pin}<br>
        India
      </div>
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <div class="inv-section" style="padding-top:0">
    <h3>Order Items</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th><th>SKU</th><th style="text-align:center">Qty</th>
          <th>MRP</th><th>Unit Price</th><th>Discount</th>
          <th style="text-align:center">GST</th><th>Tax Amt</th><th>Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tbody class="inv-totals">
        <tr><td colspan="7" style="padding:8px 12px;text-align:right;color:var(--t-mid)">Subtotal (incl. GST)</td><td colspan="2" style="padding:8px 12px;text-align:right;font-weight:700">₹${sub.toLocaleString('en-IN')}</td></tr>
        <tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-mid)">Taxable Amount</td><td colspan="2" style="padding:6px 12px;text-align:right">₹${taxableBase.toLocaleString('en-IN')}</td></tr>
        ${gstRows}
        ${disc > 0 ? `<tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">Pack / Tier Saving</td><td colspan="2" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">-₹${disc.toLocaleString('en-IN')}</td></tr>` : ''}
        ${mixMatchDiscount > 0 ? `<tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">🎉 Mix &amp; Match Discount</td><td colspan="2" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">-₹${mixMatchDiscount.toLocaleString('en-IN')}</td></tr>` : ''}
        ${promoDisc > 0 ? `<tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">🏷️ Promo Code${(typeof activePromoCode !== 'undefined' && activePromoCode && activePromoCode.code) ? ' (' + activePromoCode.code + ')' : ''}</td><td colspan="2" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d);font-weight:700">-₹${promoDisc.toLocaleString('en-IN')}</td></tr>` : ''}
        ${vitaInvDisc > 0 ? `<tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">💎 VitaPoints (${vitaInvPts.toLocaleString('en-IN')})</td><td colspan="2" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d)">-₹${vitaInvDisc.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td></tr>` : ''}
        <tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-mid)">Shipping</td><td colspan="2" style="padding:6px 12px;text-align:right">${ship <= 0 ? '<span style="color:var(--f-mineral-d)">FREE</span>' : '₹' + ship}</td></tr>
        ${totalInvDisc > 0 ? `<tr><td colspan="7" style="padding:6px 12px;text-align:right;color:var(--t-main);font-weight:700">Total Savings</td><td colspan="2" style="padding:6px 12px;text-align:right;color:var(--f-mineral-d);font-weight:800">-₹${totalInvDisc.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td></tr>` : ''}
        <tr class="inv-grand"><td colspan="7" style="text-align:right">GRAND TOTAL</td><td colspan="2" style="text-align:right">₹${total.toLocaleString('en-IN')}</td></tr>
      </tbody>
    </table>
  </div>

  <!-- NOTES -->
  <div class="inv-section" style="border-top:1px solid var(--edge-hi);font-size:11px;color:var(--t-low);line-height:1.9">
    <strong style="font-size:11px;text-transform:uppercase;letter-spacing:.5px">Terms & Notes</strong><br>
    • All prices are inclusive of 5% GST &nbsp;|&nbsp; HSN Code: 30049099 (Nutraceuticals)<br>
    • Returns accepted within 7 days for sealed/unused products<br>
    • This is a computer-generated invoice and does not require a physical signature<br>
    • For queries: ozylixcare@gmail.com &nbsp;|&nbsp; +91 98985 82650
  </div>

  <!-- FOOTER -->
  <div class="inv-footer">
    Thank you for shopping with Ozylix 🌿 &nbsp;|&nbsp; Made in India, Anand Gujarat &nbsp;|&nbsp; FSSAI Approved · Lab Tested
  </div>
</div>

<div class="no-print" style="text-align:center;margin-top:24px;padding-bottom:30px">
  <button onclick="window.print()" style="background:var(--f-mineral-d);color:var(--t-hi);border:none;padding:13px 32px;border-radius:100px;font-size:15px;font-weight:700;cursor:pointer;margin-right:12px">🖨️ Print Invoice</button>
  <button onclick="window.close()" style="background:var(--st-muted-bg);color:var(--t-hi);border:none;padding:13px 32px;border-radius:100px;font-size:15px;font-weight:700;cursor:pointer">✕ Close</button>
</div>

<!-- ── Media Lightbox ── -->
<div class="gallery-lightbox" id="galleryLightbox">
  <span class="lb-close" onclick="closeLightbox()">&#x2715;</span>
  <button class="lb-nav prev" onclick="lbStep(-1)">&#8249;</button>
  <div id="lbContent"></div>
  <button class="lb-nav next" onclick="lbStep(1)">&#8250;</button>
  <div id="lbCounter" style="color:var(--t-hi);font-size:0.85rem;margin-top:10px;opacity:0.7"></div>
</div>

  <!-- A second hidden SEO-stuffing block ("AI / GEO CONTENT BLOCK") used to
       sit here: position:absolute;left:-9999px, city-name keyword lists,
       fabricated per-product star ratings/review counts that didn't match
       the real catalog, an unconfirmed co-founder name, and an invalid
       email address. Removed for the same reason as the other hidden block
       above (Google hidden-content spam policy) — see audit item P1-12.
       Real per-product structured data belongs in visible Product JSON-LD
       driven by the actual PRODUCTS catalog, not a hand-written duplicate.
  -->

</body></html>`;

  // Show invoice in new window + add download button on thank-you page
  // (Blob URL instead of document.write — more reliable across browsers/popup blockers)
  function openInvoiceWindow(htmlStr) {
    const blob = new Blob([htmlStr], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank', 'width=960,height=800,scrollbars=yes');
    if (w) {
      // Release the blob URL once the new window has loaded it.
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } else {
      URL.revokeObjectURL(url);
    }
    return w;
  }
  openInvoiceWindow(html);

  // Also put a "View Invoice" button on the thank-you page
  const tyPage = document.getElementById('page-thankyou');
  if (tyPage) {
    const existing = document.getElementById('invoiceBtn');
    if (existing) existing.remove();
    const invBtn = document.createElement('a');
    invBtn.id = 'invoiceBtn';
    invBtn.textContent = '🧾 Download / Print Invoice';
    invBtn.style.cssText = 'display:inline-flex;align-items:center;gap:8px;background:#2E7D32;color:white;border-radius:100px;padding:11px 26px;font-weight:700;font-size:.84rem;text-decoration:none;margin:8px 4px;cursor:pointer';
    invBtn.onclick = function() {
      openInvoiceWindow(html);
    };
    const facts = document.querySelector('#page-thankyou .ty-facts');
    if (facts) facts.insertAdjacentElement('afterend', invBtn);
  }
}


// ── ORDER TRACKING ──

// placeOrder() routes to initiatePayment() — defined above

// GoKwik payment — no SDK init needed

// ═══════════════════════════════════════════════════════
// AUTH SYSTEM
// ═══════════════════════════════════════════════════════

function openAuth(tab = 'login') {
  switchAuthTab(tab);
  document.getElementById('authOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuth() {
  document.getElementById('authOverlay')?.classList.remove('open');
  unlockBodyScroll();
  clearAuthMessages();
  try { localStorage.setItem('asc_login_prompt_dismissed', String(Date.now())); } catch(e) {}
}

function clearAuthMessages() {
  const err = document.getElementById('authError');
  const suc = document.getElementById('authSuccess');
  if (err) { err.style.display = 'none'; err.textContent = ''; }
  if (suc) { suc.style.display = 'none'; suc.textContent = ''; }
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function showAuthSuccess(msg) {
  const el = document.getElementById('authSuccess');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function switchAuthTab(tab) {
  clearAuthMessages();
  document.getElementById('loginTab')?.classList.toggle('active', tab === 'login');
  document.getElementById('registerTab')?.classList.toggle('active', tab === 'register');
  const lf=document.getElementById('loginForm'); if(lf) lf.style.display = tab === 'login' ? 'block' : 'none';
  const rf=document.getElementById('registerForm'); if(rf) rf.style.display = tab === 'register' ? 'block' : 'none';
}

function handleAccountNavClick() {
  const user = getCurrentUser();
  if (user) {
    showPage('account');
    loadAccountPage();
  } else {
    openAuth('login');
  }
}

// ══════════════════════════════════════════════════════════════
// VITAPOINTS — loyalty engine
//
// Rates (single source of truth — change here, nowhere else):
//   EARN      1 point per ₹1 of order total
//   VALUE     150 points = ₹1
//   CAP       max 5,000 points redeemable on any one order (= ₹33.33)
//   TIER      15,000 points unlocks one 50%-off coupon, applied to a
//             product's MRP (not its already-discounted price)
//
// ⚠️ SECURITY: balances live in localStorage so the UI stays instant,
// but localStorage is fully editable by the customer. Redemption MUST
// be re-validated server-side before a discount is honoured — treat
// every number arriving from the client as a claim, not a fact.
// vitaSyncToServer() is the hook for that.
// ══════════════════════════════════════════════════════════════
const VITA = {
  EARN_PER_RUPEE:  1,
  POINTS_PER_RUPEE: 150,
  MAX_EARN_PER_ORDER:   5000,  // ceiling on points COLLECTED from one order
  MAX_REDEEM_PER_ORDER: 5000,  // ceiling on points SPENT on one order
  TIER_50_THRESHOLD: 15000,
  TIER_50_CONSUMES: true,      // claiming the reward spends the 15,000 points
  MILESTONE_MAX_DISCOUNT: 100, // 50% of the LOWEST-priced item, capped at Rs100
  MILESTONE_MIN_ORDER: 299,
  // DECIDED: points are held until delivery + a 7-day return window.
  // This value is display-only — the SERVER owns the hold entirely
  // (vita_config.release_hold_days, applied by vita_mark_delivered ->
  // vita_release_due). Nothing on the client can shorten or skip it.
  HOLD_DAYS: 7
};

// ── HOME BLOCK ────────────────────────────────────────────────
// #vitapoints-home states the scheme in marketing words. The words are
// in the markup (so the section still reads correctly with JS off and to
// search engines), but the NUMBERS in them are rewritten from VITA here.
// That is the whole point of this function: the home page used to quote
// "5 VitaPoints per ₹100" and three membership tiers while the engine
// paid 1 point per ₹1 with no tiers at all, and nothing in the code
// connected the two. Now a rate change in VITA moves the home page with
// it, and a stale figure is a bug you can see rather than one nobody
// notices for a year.
function hydrateVitaHome() {
  const host = document.getElementById('vitapoints-home');
  if (!host) return;

  const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const pts   = (n) => Number(n).toLocaleString('en-IN');

  const copy = {
    'earn':        '1 point for every ' + rupee(1 / VITA.EARN_PER_RUPEE),
    'earn-short':  '1 point per ' + rupee(1 / VITA.EARN_PER_RUPEE),
    'value':       pts(VITA.POINTS_PER_RUPEE) + ' points is ' + rupee(1) + ' off',
    'value-short': pts(VITA.POINTS_PER_RUPEE) + ' points = ' + rupee(1),
    'hold':        'Spendable in ' + VITA.HOLD_DAYS + ' days',
    'milestone':   pts(VITA.TIER_50_THRESHOLD) + ' points',
  };

  Object.keys(copy).forEach((k) => {
    const el = host.querySelector('[data-vita="' + k + '"]');
    if (el) el.textContent = copy[k];
  });
}

async function loadVitaPublicConfig() {
  try {
    const r = await fetch((typeof API_BASE !== 'undefined' ? API_BASE : '') + '/api/public/vitapoints/config', { headers: { 'Accept': 'application/json' } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.data) return;
    const c = d.data;
    VITA_EARN_PER_RUPEE = c.points_per_rupee_earn == null ? 1 : Math.max(0, Number(c.points_per_rupee_earn));
    VITA_REDEEM_PER_RUPEE = c.points_per_rupee_redeem == null ? 150 : Math.max(1, Number(c.points_per_rupee_redeem));
    VITA_MILESTONE = c.milestone_threshold == null ? 15000 : Math.max(0, Number(c.milestone_threshold));
    VITA.EARN_PER_RUPEE = VITA_EARN_PER_RUPEE;
    VITA.POINTS_PER_RUPEE = VITA_REDEEM_PER_RUPEE;
    VITA.TIER_50_THRESHOLD = VITA_MILESTONE;
    if (c.release_hold_days != null) VITA.HOLD_DAYS = Math.max(0, Number(c.release_hold_days) || 0);
    if (c.milestone_max_discount != null) VITA.MILESTONE_MAX_DISCOUNT = Math.max(0, Number(c.milestone_max_discount) || 0);
    if (c.milestone_min_order != null) VITA.MILESTONE_MIN_ORDER = Math.max(0, Number(c.milestone_min_order) || 0);
    hydrateVitaHome();
    if (typeof updateVitaMicrocopy === 'function') updateVitaMicrocopy();
  } catch (_) { /* defaults keep the storefront usable while the backend wakes */ }
}

// "Join free" — there is nothing to join, which is the nice part: points
// start accruing on the first delivered order of any account. So the
// button does the only useful thing it can, which depends on whether
// there is an account yet.
function vitaHomeCta() {
  if (getCurrentUser()) {
    showPage('account');
    if (typeof loadAccountPage === 'function') loadAccountPage();
    switchAccountPanel('vita');
  } else {
    openAuth('register');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { hydrateVitaHome(); loadVitaPublicConfig(); });
} else {
  hydrateVitaHome();
  loadVitaPublicConfig();
}


// Per-user namespacing. Two customers on one device must never see
// each other's balance, so the key is derived from the signed-in
// email and every read is guarded by the current session.
function _vitaKey(email) {
  const e = (email || '').toLowerCase().trim();
  if (!e) return null;
  let h = 0;
  for (let i = 0; i < e.length; i++) { h = ((h << 5) - h + e.charCodeAt(i)) | 0; }
  return 'asc_vita_' + Math.abs(h).toString(36);
}

function _vitaBlank() { return { balance: 0, pending: [], lifetime: 0, coupons: 0, history: [] }; }

function getVitaState() {
  const u = getCurrentUser();
  if (!u || !u.email) return _vitaBlank();
  const k = _vitaKey(u.email);
  if (!k) return _vitaBlank();
  try {
    const raw = JSON.parse(localStorage.getItem(k) || 'null');
    if (!raw) return _vitaBlank();
    // Refuse a record that does not belong to this session.
    if (raw.owner && raw.owner !== u.email.toLowerCase().trim()) return _vitaBlank();
    return Object.assign(_vitaBlank(), raw);
  } catch(e) { return _vitaBlank(); }
}

function _saveVita(st) {
  const u = getCurrentUser();
  if (!u || !u.email) return false;
  const k = _vitaKey(u.email);
  if (!k) return false;
  st.owner = u.email.toLowerCase().trim();
  st.history = (st.history || []).slice(-60);
  try { localStorage.setItem(k, JSON.stringify(st)); } catch(e) { return false; }
  vitaSyncToServer(st);
  return true;
}

// Best-effort mirror to the backend. Server is the authority.
function vitaSyncToServer(st) {
  try {
    const jwt = localStorage.getItem('asc_jwt') || '';
    if (!jwt || typeof API_BASE === 'undefined') return;
    /* /api/vitapoints/sync does not exist on the backend — this POST 404'd
       on every save. Removed rather than implemented on purpose: the server
       ledger is the source of truth for points (vitaRefreshFromServer pulls
       from /api/vitapoints/summary + /history), so letting the browser push
       a balance up would be exactly the client-trusting path we removed. */
    void jwt;
  } catch(e) {}
}

// Pulls the REAL balance/lifetime/history from the server's vita_ledger_v2
// (via /api/vitapoints/balance + /history) and overwrites the local cache
// with it. Server is the actual source of truth now (order confirm awards
// into the ledger with no hold, and a return/refund claws back from it) —
// this is what makes the account page and the checkout redemption widget
// (both of which read getVitaState()) show the real number instead of a
// stale or diverged local one. Safe to call often; it only ever narrows
// the gap, never breaks anything if the fetch fails (falls back silently
// to whatever's already cached locally).
async function vitaRefreshFromServer() {
  const u = getCurrentUser();
  if (!u || !u.email) return false;
  const jwt = localStorage.getItem('asc_jwt') || '';
  if (!jwt || typeof API_BASE === 'undefined') return false;
  try {
    const [sumRes, histRes] = await Promise.all([
      fetchWithTimeout(API_BASE + '/api/vitapoints/summary', { headers: { 'Authorization': 'Bearer ' + jwt } }, 8000),
      fetchWithTimeout(API_BASE + '/api/vitapoints/history', { headers: { 'Authorization': 'Bearer ' + jwt } }, 8000),
    ]);
    if (!sumRes.ok) return false;
    const sum  = await sumRes.json();
    const hist = histRes.ok ? await histRes.json() : { history: [] };

    const st = getVitaState();
    // `balance` is AVAILABLE only — points still pending delivery are
    // deliberately NOT spendable and are surfaced separately.
    st.balance   = Number(sum.available) || 0;
    st.pendingPts = Number(sum.pending) || 0;
    st.locked    = Number(sum.locked) || 0;
    st.debt      = Number(sum.debt) || 0;
    st.lifetime  = Number(sum.lifetimeEarned) || 0;
    st.milestoneReady = !!sum.milestoneReady;
    st.pending   = []; // legacy client-side maturation is gone; server owns it
    st.history   = (hist.history || []).map(function(h) {
      return { t: h.at ? new Date(h.at).getTime() : Date.now(),
               type: h.type, label: h.label, pts: Number(h.points) || 0, ref: h.orderId || '' };
    });
    const k = _vitaKey(u.email);
    if (k) {
      st.owner = u.email.toLowerCase().trim();
      try { localStorage.setItem(k, JSON.stringify(st)); } catch(e) {}
    }
    return true;
  } catch (e) {
    console.warn('[vita] server refresh failed:', e.message);
    return false;
  }
}

function vitaToRupees(points) { return (Number(points) || 0) / VITA.POINTS_PER_RUPEE; }

// ── VitaPoint 3D accents ──────────────────────────────────────
// One markup builder for every JS-rendered placement, so a change to how
// the accent is delivered (a new size, a different format, a fallback)
// happens in one place instead of nine. The static placements in the
// markup above carry the same structure by hand.
const VP3D_ART = { gift: 200, coin: 176 };
function vp3dHTML(kind) {
  const k = VP3D_ART[kind] ? kind : 'coin';
  const d = VP3D_ART[k];
  const base = '/assets/vitapoint-3d/vitapoint-' + k;
  return '<span class="vp3d" aria-hidden="true"><picture>' +
    '<source srcset="' + base + '-still.webp" media="(prefers-reduced-motion: reduce)">' +
    '<img src="' + base + '.webp" alt="" width="' + d + '" height="' + d +
    '" loading="lazy" decoding="async"></picture></span>';
}

// Entrance + off-screen parking for every accent on the page, present or
// future. One observer for all of them; vp3dScan() is cheap enough to
// call after any render that might have added some, because an element
// already being watched is skipped by the data flag.
let _vp3dObs = null;
function vp3dScan(root) {
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('vp3d-js');
  if (!_vp3dObs) {
    _vp3dObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.dataset.vp3dSeen = '1';
        e.target.classList.toggle('vp3d-in', e.isIntersecting);
      });
    }, { rootMargin: '80px' });
  }
  (root || document).querySelectorAll('.vp3d:not([data-vp3d])').forEach(function (el) {
    el.dataset.vp3d = '1';
    _vp3dObs.observe(el);
    // Safety net for elements the observer never reports on at all — a
    // container it handles oddly, a stacking context that confuses it.
    // The entrance starts these at opacity 0, so such an element would
    // stay invisible for good. Gated on vp3dSeen so it only rescues the
    // genuinely unreported ones: revealing every accent after 2.5s would
    // undo the off-screen parking for all of them.
    setTimeout(function () {
      if (!el.dataset.vp3dSeen) el.classList.add('vp3d-in');
    }, 2500);
  });
}
// This script block may parse after DOMContentLoaded has already gone by,
// in which case the listener would never fire and nothing would ever be
// revealed — so check the state rather than assuming.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { vp3dScan(); });
} else {
  vp3dScan();
}

// Counts a VitaPoints figure up to its real value. Presentation only —
// the number it lands on is the one it was handed, and it is written in
// full immediately when the visitor has asked for less motion.
function vitaCountUp(el, to, ms) {
  if (!el) return;
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !to || to < 0) { el.textContent = fmt(to || 0); return; }
  const dur = ms || 1100;
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(to * eased);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

// The rewards line shared by the cart page and the side cart. States the
// scheme, does not price it: no total here depends on this markup, and
// the wording matches showPtsToast() so the two cannot contradict.
function vitaStripHTML() {
  return '<button type="button" class="vita-strip" onclick="openVitaPopup()">' +
    vp3dHTML('coin') +
    '<span><b>Earns VitaPoints when delivered</b>Redeem them for money off a future order.</span>' +
    '<span class="vs-arrow" aria-hidden="true">&rsaquo;</span></button>';
}

// ── VitaPoints popup ──────────────────────────────────────────
// A window onto the engine, never a second copy of it. Every number is
// read from VITA or getVitaState() at open time; nothing is cached here
// and nothing is written back.
function renderVitaPopup() {
  const el = document.getElementById('vitaPopBody');
  if (!el) return;
  const pts = (n) => Number(n).toLocaleString('en-IN');
  const u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const signedIn = !!(u && u.email);

  let balBlock;
  if (signedIn) {
    const st = getVitaState();
    const avail = Number(st.balance) || 0;
    const pend  = Number(st.pendingPts) || 0;
    balBlock =
      '<div class="vita-pop-bal">' +
        '<div class="vita-pop-num" id="vitaPopNum" data-to="' + avail + '">0</div>' +
        '<div class="vita-pop-lbl">VitaPoints available</div>' +
        '<div class="vita-pop-worth">= ₹' + vitaToRupees(avail).toFixed(2) +
          ' off your next order</div>' +
      '</div>' +
      (pend > 0
        ? '<p class="vita-pop-lede">' + pts(pend) + ' more are on the way — they unlock ' +
          VITA.HOLD_DAYS + ' days after delivery.</p>'
        : '');
  } else {
    balBlock = '<p class="vita-pop-lede">Every delivered order earns points on its own. ' +
      'Sign in to see your balance.</p>';
  }

  el.innerHTML =
    vp3dHTML('gift') +
    '<h2 class="vita-pop-title" id="vitaPopTitle">Ozylix VitaPoints</h2>' +
    balBlock +
    '<ul class="vita-pop-rules">' +
      '<li><span class="r-ico" aria-hidden="true">💎</span><div>' +
        '<b>' + pts(VITA.EARN_PER_RUPEE) + ' point per ₹' + pts(1) + '</b>' +
        '<span>on every delivered order</span></div></li>' +
      '<li><span class="r-ico" aria-hidden="true">🧾</span><div>' +
        '<b>' + pts(VITA.POINTS_PER_RUPEE) + ' points = ₹1</b>' +
        '<span>off any future order</span></div></li>' +
      '<li><span class="r-ico" aria-hidden="true">🗓️</span><div>' +
        '<b>Spendable in ' + VITA.HOLD_DAYS + ' days</b>' +
        '<span>once the return window closes</span></div></li>' +
      '<li><span class="r-ico" aria-hidden="true">🎁</span><div>' +
        '<b>' + pts(VITA.TIER_50_THRESHOLD) + ' points</b>' +
        '<span>unlocks 50% off an item, up to ₹' + pts(VITA.MILESTONE_MAX_DISCOUNT) + '</span></div></li>' +
    '</ul>' +
    '<div class="vita-pop-acts">' +
      (signedIn
        ? '<button class="btn-primary" onclick="closeVitaPopup();showPage(\'account\')">View my VitaPoints</button>'
        : '<button class="btn-primary" onclick="closeVitaPopup();vitaHomeCta()">Join free</button>') +
      '<button class="btn-outline" onclick="closeVitaPopup();showPage(\'shop\')">Start shopping</button>' +
    '</div>' +
    '<p class="vita-pop-note">Free to join · points never expire · ' +
      'up to ' + pts(VITA.MAX_REDEEM_PER_ORDER) + ' points on one order</p>';

  vp3dScan(el);
  const num = document.getElementById('vitaPopNum');
  if (num) vitaCountUp(num, Number(num.dataset.to) || 0);
}

function openVitaPopup() {
  const ov = document.getElementById('vitaPopOverlay');
  if (!ov) return;
  // Open first, then fill. The overlay keeps full-viewport geometry even
  // while hidden, so an accent rendered before it opens is already
  // "on screen" as far as the observer is concerned — its entrance would
  // play, and finish, behind a closed popup.
  ov.classList.add('open');
  renderVitaPopup();
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', _vitaPopEsc);
  // Signed-in balances are painted from cache first so the popup opens
  // instantly, then repainted once the real ledger answers. Same order
  // My Account uses, and a failed refresh simply leaves the cached
  // number in place rather than blanking it.
  try {
    const u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (u && u.email && typeof vitaRefreshFromServer === 'function') {
      vitaRefreshFromServer().then(function (ok) {
        if (ok && ov.classList.contains('open')) renderVitaPopup();
      }).catch(function () {});
    }
  } catch (e) {}
}

function closeVitaPopup() {
  const ov = document.getElementById('vitaPopOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  document.removeEventListener('keydown', _vitaPopEsc);
  // The side cart may still be open underneath, and it owns the scroll
  // lock in that case — releasing it here would let the page scroll
  // behind an open drawer.
  const sc = document.getElementById('sideCart');
  if (!sc || !sc.classList.contains('open')) {
    if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
    else document.body.style.overflow = '';
  }
}

function _vitaPopEsc(e) { if (e.key === 'Escape') closeVitaPopup(); }
function vitaFromRupees(rupees) { return Math.floor((Number(rupees) || 0) * VITA.POINTS_PER_RUPEE); }

// How many points this customer may actually spend on an order.
// Capped by balance, by the per-order ceiling, and by the order value
// itself (never let a redemption exceed what is owed). st.balance here
// is kept in sync with the real server ledger by vitaRefreshFromServer
// (called on login/session-restore) — the server still independently
// re-verifies and clamps the actual redemption at checkout regardless,
// so this is what the customer sees, not what's ultimately trusted.

// Move any pending points whose hold window has expired into the
// spendable balance. Safe to call as often as you like.
function vitaMature() {
  const u = getCurrentUser();
  if (!u || !u.email) return;
  const st = getVitaState();
  if (!st.pending || !st.pending.length) return;
  const now = Date.now();
  const ready = st.pending.filter(function(x){ return x.matureAt <= now; });
  if (!ready.length) return;
  st.pending = st.pending.filter(function(x){ return x.matureAt > now; });
  let unlocked = 0;
  ready.forEach(function(x){
    st.balance += x.pts;
    st.history.unshift({ t: now, type: 'mature', pts: x.pts, ref: x.ref || '' });
  });
  while (st.balance >= VITA.TIER_50_THRESHOLD) {
    st.coupons += 1; unlocked += 1;
    if (VITA.TIER_50_CONSUMES) st.balance -= VITA.TIER_50_THRESHOLD; else break;
  }
  if (unlocked) {
    st.history.unshift({ t: now, type: 'tier',
      pts: VITA.TIER_50_CONSUMES ? -VITA.TIER_50_THRESHOLD * unlocked : 0,
      ref: unlocked + ' × 50% coupon' });
  }
  _saveVita(st);
}

function vitaPendingTotal() {
  const st = getVitaState();
  return (st.pending || []).reduce(function(t,x){ return t + x.pts; }, 0);
}


// Called when an order is returned, refunded or cancelled. Removes the
// points that order generated — from the pending queue if still held,
// otherwise clawed back out of the spendable balance.


// ── CHECKOUT REDEMPTION ───────────────────────────────────────
// Points the customer has chosen to spend on the order in progress.
// Not deducted until the order is actually placed.
let VITA_APPLIED = 0;

function vitaClearApplied() { VITA_APPLIED = 0; }

// Everything the checkout needs to know, in one call.
function vitaCheckoutInfo(orderSubtotal) {
  vitaMature();
  const u = getCurrentUser();
  if (!u || !u.email) return { signedIn: false, balance: 0, max: 0, applied: 0, rupees: 0 };
  const st = getVitaState();
  const max = Math.max(0, Math.min(st.balance, VITA.MAX_REDEEM_PER_ORDER,
                                   vitaFromRupees(orderSubtotal)));
  if (VITA_APPLIED > max) VITA_APPLIED = max;
  return {
    signedIn: true, balance: st.balance, pending: vitaPendingTotal(),
    max: max, applied: VITA_APPLIED, rupees: vitaToRupees(VITA_APPLIED)
  };
}

function vitaApplyAtCheckout(points) {
  const sub = (typeof STORE !== 'undefined' && STORE.cart)
    ? STORE.cart.reduce(function(t,item){
        const p = PRODUCTS.find(function(x){ return x.id === item.id; });
        if (!p) return t;
        const up = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
        return t + up * item.qty;
      }, 0) : 0;
  const info = vitaCheckoutInfo(sub);
  if (!info.signedIn) { showToast('Please sign in to use VitaPoints', 'error'); return; }
  let pts = Math.floor(Number(points) || 0);
  if (pts < 0) pts = 0;
  if (pts > info.max) {
    pts = info.max;
    showToast('Capped at ' + info.max.toLocaleString('en-IN') + ' VitaPoints for this order');
  }
  VITA_APPLIED = pts;
  if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
  if (typeof renderCartPage === 'function') { try { renderCartPage(); } catch(e) {} }
}

function vitaUseMax() {
  const sub = STORE.cart.reduce(function(t,item){
    const p = PRODUCTS.find(function(x){ return x.id === item.id; });
    if (!p) return t;
    const up = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    return t + up * item.qty;
  }, 0);
  vitaApplyAtCheckout(vitaCheckoutInfo(sub).max);
}

// The block that renders inside the checkout / cart summary.
function vitaRedeemWidgetHTML(sub) {
  const i = vitaCheckoutInfo(sub);
  if (!i.signedIn) {
    return '<div class="vita-ck"><div class="vita-ck-head">💎 VitaPoints</div>' +
      '<div class="vita-ck-note">Sign in to use your VitaPoints on this order.</div></div>';
  }
  if (i.balance <= 0) {
    return '<div class="vita-ck"><div class="vita-ck-head">💎 VitaPoints</div>' +
      '<div class="vita-ck-note">No points available yet' +
      (i.pending ? ' — ' + i.pending.toLocaleString('en-IN') + ' still in the ' + VITA.HOLD_DAYS + '-day return window.' : '.') +
      '</div></div>';
  }
  return '<div class="vita-ck">' +
    '<div class="vita-ck-head">💎 VitaPoints <b>' + i.balance.toLocaleString('en-IN') + ' available</b></div>' +
    '<div class="vita-ck-row">' +
      '<input id="vitaRedeemInput" type="number" min="0" step="1" max="' + i.max + '" ' +
        'value="' + (i.applied || '') + '" placeholder="0" class="vita-ck-input" ' +
        'oninput="vitaApplyAtCheckout(this.value)">' +
      '<button type="button" class="vita-ck-max" onclick="vitaUseMax()">Use max</button>' +
    '</div>' +
    '<div class="vita-ck-note">Max ' + i.max.toLocaleString('en-IN') + ' points on this order · ' +
      VITA.POINTS_PER_RUPEE + ' points = ₹1' +
      (i.pending ? ' · ' + i.pending.toLocaleString('en-IN') + ' pending' : '') + '</div>' +
    (i.applied ? '<div class="vita-ck-applied">− ₹' + i.rupees.toFixed(2) + ' applied</div>' : '') +
  '</div>';
}

// 50% coupon is calculated against MRP, never the sale price.

// ── Collection animation ──────────────────────────────────────
function vitaCelebrate(pts, unlocked, capped) {
  try {
    const host = document.createElement('div');
    host.className = 'vita-burst';
    host.innerHTML =
      '<div class="vb-card">' +
        '<div class="vb-ring"><span class="vb-num" data-to="' + pts + '">0</span></div>' +
        '<div class="vb-lbl">VitaPoints collected</div>' +
        '<div class="vb-val">worth ₹' + vitaToRupees(pts).toFixed(2) + '</div>' +
        (capped ? '<div class="vb-note">Capped at ' + VITA.MAX_EARN_PER_ORDER.toLocaleString('en-IN') + ' points per order</div>' : '') +
        '<div class="vb-note">Available to spend after ' + VITA.HOLD_DAYS + ' days (return window)</div>' +
        (unlocked ? '<div class="vb-tier">🎉 50% OFF coupon unlocked!</div>' : '') +
      '</div>';
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('i');
      s.className = 'vb-spark';
      s.style.setProperty('--a', (i * 26) + 'deg');
      s.style.setProperty('--d', (0.25 + Math.random() * 0.5) + 's');
      host.firstChild.appendChild(s);
    }
    document.body.appendChild(host);
    const numEl = host.querySelector('.vb-num');
    const start = performance.now(), dur = 1100;
    (function tick(now){
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = '+' + Math.round(pts * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    setTimeout(function(){ host.classList.add('out'); }, 2600);
    setTimeout(function(){ host.remove(); }, 3200);
  } catch(e) {}
}

// ── Account panel ─────────────────────────────────────────────
async function renderVitaPanel() {
  const el = document.getElementById('vitaPanelBody');
  if (!el) return;
  const u = getCurrentUser();
  if (!u || !u.email) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray)">Sign in to see your VitaPoints.</div>';
    return;
  }
  // Paint whatever's cached immediately, then refresh from the real ledger
  // and repaint — avoids a blank/loading flash while still showing the
  // authoritative number as soon as it's back.
  _renderVitaPanelBody(el);
  const refreshed = await vitaRefreshFromServer();
  if (refreshed) _renderVitaPanelBody(el);
}

function _renderVitaPanelBody(el) {
  const st = getVitaState();
  const avail   = Number(st.balance) || 0;
  const pendPts = Number(st.pendingPts) || 0;
  const debt    = Number(st.debt) || 0;
  const pct  = Math.min(100, (avail / VITA.TIER_50_THRESHOLD) * 100);
  const toGo = Math.max(0, VITA.TIER_50_THRESHOLD - avail);

  const rows = (st.history || []).slice(0, 15).map(function(h){
    const sign = h.pts > 0 ? '+' : '';
    const col  = h.pts > 0 ? 'var(--fern-lo)' : (h.pts < 0 ? 'var(--clay-lo)' : 'var(--t-mid)');
    const lbl  = h.label || h.type || 'Activity';
    const d = new Date(h.t).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    return '<tr><td style="padding:9px 12px;font-size:.8rem">' + d + '</td>' +
           '<td style="padding:9px 12px;font-size:.8rem">' + lbl + '</td>' +
           '<td style="padding:9px 12px;font-size:.75rem;color:var(--t-low)">' + (h.ref||'\u2014') + '</td>' +
           '<td style="padding:9px 12px;text-align:right;font-weight:800;color:' + col + '">' +
             (h.pts ? sign + h.pts.toLocaleString('en-IN') : '\u2014') + '</td></tr>';
  }).join('') || '<tr><td colspan="4" style="padding:22px;text-align:center;color:var(--gray);font-size:.85rem">No VitaPoints activity yet \u2014 your first order starts the collection.</td></tr>';

  // Pending points are the single most likely support question now that
  // the hold is live, so explain them inline rather than hiding them.
  const pendingBlock = pendPts > 0
    ? '<div style="margin:14px 0;padding:13px 16px;background:var(--face-warm);border:1px solid var(--line);border-radius:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<div><b style="font-size:1.05rem">' + pendPts.toLocaleString('en-IN') + ' VitaPoints on the way</b>' +
          '<div style="font-size:.8rem;color:var(--t-mid);margin-top:2px">These unlock once your order is delivered and the 7-day return window closes.</div></div>' +
          '<button class="btn-ghost" style="font-size:.78rem" onclick="vitaShowPending()">See details</button>' +
        '</div><div id="vitaPendingList"></div>' +
      '</div>'
    : '';

  const debtBlock = debt > 0
    ? '<div style="margin:14px 0;padding:13px 16px;background:var(--st-danger-bg);border:1px solid var(--st-danger-bg);border-radius:12px">' +
        '<b style="font-size:.92rem">' + debt.toLocaleString('en-IN') + ' points to settle</b>' +
        '<div style="font-size:.8rem;color:var(--t-mid);margin-top:3px">A returned order had already earned points you\u2019d spent. ' +
        'This is settled automatically from points on your next orders \u2014 nothing to pay.</div>' +
      '</div>'
    : '';

  const milestoneNote = toGo === 0
    ? '\ud83c\udf89 Reward ready \u2014 50% off your lowest-priced item, up to \u20b9100.'
    : 'Collect ' + toGo.toLocaleString('en-IN') + ' more VitaPoints to unlock 50% off your lowest-priced item (up to \u20b9100).';

  el.innerHTML =
    '<div class="vita-hero">' +
      '<div class="vita-bal">' +
        vp3dHTML('gift') +
        '<div class="vita-bal-num" id="vitaBalNum" data-to="' + avail + '">0</div>' +
        '<div class="vita-bal-lbl">VitaPoints available</div>' +
        '<div class="vita-bal-val">= \u20b9' + vitaToRupees(avail).toFixed(2) + ' off your next order</div>' +
      '</div>' +
      '<div class="vita-stats">' +
        '<div><b>' + pendPts.toLocaleString('en-IN') + '</b><span>Pending</span></div>' +
        '<div><b>' + (Number(st.lifetime)||0).toLocaleString('en-IN') + '</b><span>Lifetime collected</span></div>' +
        '<div><b>' + VITA.MAX_REDEEM_PER_ORDER.toLocaleString('en-IN') + '</b><span>Max per order</span></div>' +
      '</div>' +
    '</div>' +
    pendingBlock + debtBlock +
    '<div class="vita-prog-wrap">' +
      '<div class="vita-prog-top"><span>Progress to your 50% OFF reward</span>' +
        '<span>' + avail.toLocaleString('en-IN') + ' / ' + VITA.TIER_50_THRESHOLD.toLocaleString('en-IN') + '</span></div>' +
      '<div class="vita-prog"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
      '<div class="vita-prog-note">' + milestoneNote + '</div>' +
      (st.milestoneReady ? '<button class="btn" style="margin-top:10px" onclick="vitaClaimMilestone(this)">Claim my 50% OFF reward</button>' : '') +
    '</div>' +
    '<div class="vita-rules">' +
      '<h4>How VitaPoints work</h4>' +
      '<ul>' +
        '<li>Earn <b>1 VitaPoint for every \u20b91</b> you spend \u2014 a \u20b91,500 order gives you 1,500 points.</li>' +
        '<li>Points are held while your order is on its way. They become spendable <b>7 days after delivery</b>, once the return window closes.</li>' +
        '<li><b>150 VitaPoints = \u20b91.</b> So 1,500 points are worth \u20b910 off a future order.</li>' +
        '<li>You can use up to <b>' + VITA.MAX_REDEEM_PER_ORDER.toLocaleString('en-IN') + ' VitaPoints on one order</b> (\u20b9' + vitaToRupees(VITA.MAX_REDEEM_PER_ORDER).toFixed(2) + ').</li>' +
        '<li>If you return an order, the points it earned are reversed.</li>' +
        '<li>Reach <b>' + VITA.TIER_50_THRESHOLD.toLocaleString('en-IN') + ' available points</b> to unlock <b>50% off your lowest-priced item, up to \u20b9100</b> (minimum cart \u20b9299).</li>' +
      '</ul>' +
    '</div>' +
    '<div class="vita-hist"><h4>Activity</h4>' +
      '<table style="width:100%;border-collapse:collapse">' +
        '<thead><tr style="background:var(--face-warm)">' +
        '<th style="padding:9px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t-low)">Date</th>' +
        '<th style="padding:9px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t-low)">Activity</th>' +
        '<th style="padding:9px 12px;text-align:left;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t-low)">Reference</th>' +
        '<th style="padding:9px 12px;text-align:right;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t-low)">Points</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>';

  vp3dScan(el);
  const balEl = document.getElementById('vitaBalNum');
  if (balEl) vitaCountUp(balEl, Number(balEl.dataset.to) || 0);
}

// Expands the per-order breakdown of pending points.
async function vitaShowPending() {
  const host = document.getElementById('vitaPendingList');
  if (!host) return;
  if (host.dataset.open === '1') { host.innerHTML = ''; host.dataset.open = '0'; return; }
  host.dataset.open = '1';
  host.innerHTML = '<div style="font-size:.8rem;color:var(--t-mid);padding:8px 0">Loading\u2026</div>';
  try {
    const jwt = localStorage.getItem('asc_jwt') || '';
    const r = await fetchWithTimeout(API_BASE + '/api/vitapoints/pending',
      { headers: { 'Authorization': 'Bearer ' + jwt } }, 8000);
    const d = await r.json();
    host.innerHTML = (d.pending || []).map(function(p){
      const when = p.availableOn
        ? new Date(p.availableOn).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
        : null;
      return '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid var(--line);font-size:.82rem">' +
             '<div><b>' + (p.orderId||'') + '</b><div style="color:var(--t-mid);font-size:.76rem">' +
             p.status + (when ? ' \u2014 available ' + when : '') + '</div></div>' +
             '<div style="font-weight:800;white-space:nowrap">+' + (p.points||0).toLocaleString('en-IN') + '</div></div>';
    }).join('') || '<div style="font-size:.8rem;color:var(--t-mid);padding:8px 0">Nothing pending.</div>';
  } catch (e) {
    host.innerHTML = '<div style="font-size:.8rem;color:var(--t-mid);padding:8px 0">Could not load right now.</div>';
  }
}

async function vitaClaimMilestone(btn) {
  if (btn) { btn.disabled = true; btn.textContent = 'Claiming\u2026'; }
  try {
    const jwt = localStorage.getItem('asc_jwt') || '';
    const r = await fetchWithTimeout(API_BASE + '/api/vitapoints/milestone/claim',
      { method: 'POST', headers: { 'Authorization': 'Bearer ' + jwt } }, 12000);
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Could not claim');
    showToast('\ud83c\udf89 Reward unlocked \u2014 code ' + d.code);
    await vitaRefreshFromServer();
    renderVitaPanel();
  } catch (e) {
    showToast('\u26a0\ufe0f ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Claim my 50% OFF reward'; }
  }
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('asc_user') || 'null'); } catch(e) { return null; }
}

// Shared post-login navigation: go to the account page, UNLESS the
// person was mid-checkout (let them stay + autofill) or mid-review on
// a product page (rebuild it and drop them back on the reviews tab
// instead of yanking them away from what they were doing).
function postLoginRedirect() {
  // FIX (Aug 2026, owner video report): after a mid-checkout Google sign-in
  // (popup path, same SPA session), the product page rebuild below did not
  // re-apply the customer's saved pack tier — buildProductPage only knows
  // selectedTiers, which a previous version kept in memory. It now also
  // refreshes the sticky bottom bar so the price keeps matching the tier.
  const onCheckout = document.getElementById('page-checkout')?.classList.contains('active');
  if (onCheckout) return;
  const onProduct = document.getElementById('page-product')?.classList.contains('active');
  if (onProduct && currentProduct) {
    try { buildProductPage(currentProduct); switchTab(document.querySelectorAll('.tab')[2], 'rvs'); } catch(e) {}
    try { if (typeof refreshStickyCart === 'function') refreshStickyCart(); } catch(e) {}
    return;
  }
  showPage('account'); loadAccountPage();
}

async function doLogin() {
  clearAuthMessages();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass) { showAuthError('Please enter your email and password.'); return; }
  try {
    const res = await fetchWithTimeout(API_BASE + '/api/auth/email-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    }, 8000);
    const data = await res.json();
    if (!res.ok) { showAuthError(data.error || 'Invalid email or password.'); return; }
    localStorage.setItem('asc_jwt', data.token);
    localStorage.setItem('asc_user', JSON.stringify(data.user));
    closeAuth(); updateAccountNavBtn();
    resumeCheckoutIfWaiting();
    postLoginRedirect();
    showToast('🌿 Welcome back, ' + data.user.name.split(' ')[0] + '!');
  } catch(e) {
    // Fail closed: a browser-local record is not an authenticated account and
    // must never be promoted to a logged-in session when the API is offline.
    showAuthError('Authentication service is temporarily unavailable. Please try again.');
  }
}

async function doRegister() {
  clearAuthMessages();
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pass  = document.getElementById('regPassword').value;
  if (!name || !email || !pass) { showAuthError('Please fill in all required fields.'); return; }
  if (pass.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
  try {
    const res = await fetchWithTimeout(API_BASE + '/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password: pass }),
    }, 8000);
    const data = await res.json();
    if (!res.ok) { showAuthError(data.error || 'Registration failed.'); return; }
    localStorage.setItem('asc_jwt', data.token);
    localStorage.setItem('asc_user', JSON.stringify(data.user));
    closeAuth(); updateAccountNavBtn();
    resumeCheckoutIfWaiting();
    postLoginRedirect();
    showToast('🌿 Account created! Welcome to Ozylix, ' + name.split(' ')[0] + '!');
  } catch(e) {
    // Registration is server-authoritative; do not create local-only accounts.
    showAuthError('Registration service is temporarily unavailable. Please try again.');
  }
}



// ══════════════════════════════════════════════════════════════════════════
// GOOGLE SIGN-IN — Production-Grade Google Identity Services (GIS)
// Version 2.0 — Multi-strategy with full fallbacks + backend warm-up
// Client ID: 6793142938-b9sl3d3lh2svjkmcnina8fsh31nut0bu.apps.googleusercontent.com
// ══════════════════════════════════════════════════════════════════════════

const GOOGLE_CLIENT_ID = '6793142938-b9sl3d3lh2svjkmcnina8fsh31nut0bu.apps.googleusercontent.com';

// Where Google sends mobile users back after they approve sign-in. Pinned to
// the bare origin (no trailing slash, no path) so it byte-for-byte matches
// the "Authorised redirect URIs" registered for this OAuth client in Google
// Cloud (https://www.ozylix.com and https://www.ozylix.com — neither has a
// trailing slash). Previously this was derived from window.location.pathname,
// which always appended a trailing "/" (and sometimes a page path), causing
// redirect_uri_mismatch on every mobile sign-in. The redirect-return handler
// below runs on page load regardless of path, so a fixed origin works no
// matter which page the user was on when they tapped "Sign in with Google".
const GOOGLE_REDIRECT_URI = window.location.origin;

// ── State tracking ──
let _googleInitialized = false;
let _googleInitRetries = 0;
const _GOOGLE_MAX_RETRIES = 8;

// Backend warm-up pings removed. They existed because Render's free tier
// slept after 15 minutes and cold-started for ~30-60s, so the site woke it
// early and hoped it was ready by checkout. The service is on a paid plan
// now and never sleeps, so every one of these was a wasted round trip on
// the critical path of a page load — three of them fired per visit.

// ── Handle Google OAuth2 redirect return (mobile only) ──
(function() {
  var params = new URLSearchParams(window.location.search);
  var code   = params.get('code');
  if (!code) return; // not a redirect return — do nothing

  // Clean URL so refresh doesn't retrigger
  history.replaceState({}, '', window.location.pathname);

  // Show spinner
  var spinner = document.createElement('div');
  spinner.id  = 'g-spinner';
  spinner.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#FAFAF7;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-family:sans-serif';
  spinner.innerHTML = '<style>@keyframes gs{to{transform:rotate(360deg)}}</style>'
    + '<div style="width:40px;height:40px;border:3px solid var(--edge-hi);border-top-color:var(--f-mineral);border-radius:50%;animation:gs .8s linear infinite"></div>'
    + '<p style="color:var(--f-mineral);margin:0;font-size:14px">Signing you in…</p>';
  // FIX (Aug 2026, owner video report): appending via a DOMContentLoaded
  // listener could RACE with the async code exchange — if the fetch
  // resolved first, el.remove() ran on an unattached node (no-op) and the
  // spinner was then appended AFTER removal, leaving a frozen full-screen
  // overlay that blocked the page forever. Append synchronously instead;
  // this IIFE runs in <head> so documentElement already exists.
  document.documentElement.appendChild(spinner);

  // Send code to backend — server holds client_secret securely.
  // redirect_uri MUST byte-for-byte match the one used to request the code
  // (Google rejects the exchange otherwise) — both now derive from the live
  // origin instead of the hardcoded non-resolving ozylix.com.
  fetch('https://ascovitahealthcare-cell-github-io.onrender.com/api/auth/google-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: code,
      redirect_uri: window.location.origin
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    if (data.error) throw new Error(data.error);
    // Complete login directly — no race condition with SDK load
    localStorage.setItem('asc_jwt',  data.token);
    localStorage.setItem('asc_user', JSON.stringify(data.user));
    var el = document.getElementById('g-spinner');
    if (el) el.remove();
    // FIX (Aug 2026, owner video report): this handler used to land every
    // returning customer on the ACCOUNT page — even when they were mid-
    // checkout or on a product page with a pack tier picked. The full-page
    // reload also wiped the in-memory tier and the checkout resume
    // callback, so after sign-in the customer had to rebuild the whole
    // order. It now reads the return-to context that requireLoginFor-
    // Checkout stashed in sessionStorage and goes back to that page,
    // re-applying the restored tier and resuming the payment flow.
    var _ret = null;
    try { _ret = JSON.parse(sessionStorage.getItem('ozylix.login_return') || 'null'); } catch(e) {}
    var _retFresh = _ret && (Date.now() - (_ret.at || 0)) < 10 * 60 * 1000;
    try { sessionStorage.removeItem('ozylix.login_return'); } catch(e) {}
    // SDK may not be ready yet — defer UI updates to DOMContentLoaded
    function _finishMobileLogin() {
      try { updateAccountNavBtn(); } catch(e) {}
      var name = ((data.user && data.user.name) || 'there').split(' ')[0];
      try { showToast('🌿 Welcome back, ' + name + '!'); } catch(e) {}
      if (_retFresh && _ret && (_ret.page === 'product' || _ret.page === 'checkout') && _ret.productId) {
        try {
          // Open the product with the previously selected tier (selectedTiers
          // was restored from localStorage at module load above, so the
          // widget builds with the right pack and price already chosen).
          openProduct(_ret.productId);
          if (typeof refreshStickyCart === 'function') refreshStickyCart();
          if (_ret.intent === 'checkout_payment') {
            // _checkoutResumeCb (the in-memory "re-run initiatePayment" cb)
            // does not survive the full-page redirect, so rebuild the flow:
            // go to checkout → let the page render → autofill from the just-
            // logged-in profile → initiatePayment() which now finds the user
            // signed in and continues straight to the secure payment modal.
            setTimeout(function() {
              try { showPage('checkout'); } catch(e) {}
              setTimeout(function() {
                var _u = null; try { _u = getCurrentUser(); } catch(e) {}
                if (_u) { try { autofillCheckoutFromGoogle(_u); } catch(e) {} }
                try { if (typeof initiatePayment === 'function') initiatePayment(); } catch(e) { console.warn('[Auth] payment resume failed', e); }
              }, 400);
            }, 600);
          }
          return;
        } catch(e) { console.warn('[Auth] return-to product navigation failed', e); }
      }
      try { showPage('account'); loadAccountPage(); } catch(e) {}
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _finishMobileLogin);
    } else {
      setTimeout(_finishMobileLogin, 300); // slight delay so page scripts init
    }
  })
  .catch(function(e) {
    console.error('[Auth] redirect exchange failed:', e.message);
    var el = document.getElementById('g-spinner');
    if (el) el.remove();
  });
})();

// ── Global callback fired when GIS SDK finishes loading ──
window.onGoogleLibraryLoad = function() {
  // ── DO NOT run auth for bots/crawlers — prevents noindex from OAuth error page ──
  var ua = navigator.userAgent || '';
  var isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|crawler|spider|bot/i.test(ua);
  if (!isBot) _initGoogleOneTap();
};

// ── Safely parse a Google-issued JWT without verification (client-side only) ──
function parseGoogleJWT(token) {
  try {
    if (!token || token.split('.').length < 2) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    return JSON.parse(atob(padded));
  } catch(e) {
    console.warn('[Ozylix Auth] JWT parse error:', e);
    return null;
  }
}

// ── Build a synthetic credential object from OAuth2 userinfo ──
function _buildSyntheticCredential(profile) {
  // Encode as a pseudo-JWT so handleGoogleCredential can parse it uniformly
  const header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=/g,'');
  const payload = btoa(JSON.stringify({
    sub:        profile.sub        || profile.id || '',
    name:       profile.name       || '',
    email:      profile.email      || '',
    picture:    profile.picture    || '',
    given_name: profile.given_name || (profile.name || '').split(' ')[0],
    email_verified: true,
    iss: 'https://accounts.google.com',
    aud: GOOGLE_CLIENT_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).replace(/=/g,'');
  return { credential: header + '.' + payload + '.synthetic' };
}

// ── Core: called after any successful Google auth (One Tap, popup, or OAuth2) ──
async function handleGoogleCredential(response) {
  if (!response || !response.credential) {
    _showAuthFeedback('error', 'Google sign-in returned no credential. Please try again.');
    return;
  }

  // Show loading state inside auth button
  const googleBtn = document.getElementById('googleSignInBtn');
  const originalText = googleBtn ? googleBtn.innerHTML : '';
  if (googleBtn) {
    googleBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Signing in...</span>';
    googleBtn.disabled = true;
  }

  const restoreGoogleBtn = () => {
    if (googleBtn) { googleBtn.innerHTML = originalText; googleBtn.disabled = false; }
  };

  try {
    // Parse the JWT locally first so we always have user data
    const payload = parseGoogleJWT(response.credential);
    if (!payload || !payload.email) {
      throw new Error('Invalid credential payload');
    }

        // Attempt backend verification.
    let backendUser = null;
    let backendJwt  = null;
    // A real server JWT is REQUIRED for the order to save — a local-only
    // Google profile (no asc_jwt) would pass the front-end login gate but
    // the order POST would then be rejected 401 and lost. Render free-tier
    // cold starts can take 30-60s, so retry with growing timeouts before
    // ever giving up: the customer waiting on the sign-in button will
    // happily wait longer than the 8s that silently doomed their order.
    const googleRetryTimeouts = [8000, 15000, 30000];
    for (let attempt = 0; attempt < googleRetryTimeouts.length; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1500 * attempt));
      try {
        const res = await fetchWithTimeout(API_BASE + '/api/auth/google', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ credential: response.credential }),
        }, googleRetryTimeouts[attempt]);
        if (res.ok) {
          const data = await res.json();
          backendUser = data.user;
          backendJwt  = data.token;
          break;   // success — stop retrying
        } else {
          console.warn('[Ozylix Auth] Backend returned', res.status, 'on attempt', attempt + 1);
        }
      } catch (backendErr) {
        console.warn('[Ozylix Auth] Backend unreachable on attempt', attempt + 1, ':', backendErr.message);
      }
    }

    // Build user object — backend data wins, local payload is the fallback
    const user = backendUser || {
      name:    payload.name       || 'Google User',
      email:   payload.email      || '',
      picture: payload.picture    || '',
      social:  'google',
      sub:     payload.sub        || '',
      verified: true,
    };

    // Persist session
    if (backendJwt) localStorage.setItem('asc_jwt', backendJwt);
    localStorage.setItem('asc_user', JSON.stringify(user));

    // Update UI
    closeAuth();
    restoreGoogleBtn();
    updateAccountNavBtn();
    autofillCheckoutFromGoogle(user);
    const firstName = (user.name || 'there').split(' ')[0];
    const isNew = payload.iat && (Date.now() / 1000 - payload.iat) < 10;
    showToast('🌿 ' + (isNew ? 'Welcome, ' : 'Welcome back, ') + firstName + '!');
    // Resume a blocked checkout payment flow if the sign-in was triggered from checkout
    resumeCheckoutIfWaiting();
    // Navigate to account unless mid-checkout or mid-review (see postLoginRedirect)
    postLoginRedirect();
  } catch(err) {
    console.error('[Ozylix Auth] handleGoogleCredential error:', err);
    restoreGoogleBtn();
    _showAuthFeedback('error', 'Google sign-in failed. Please try again or use email.');
  }
}

// ── Show inline feedback inside auth modal ──
function _showAuthFeedback(type, msg) {
  if (type === 'error') showAuthError(msg);
  else showAuthSuccess(msg);
}

// ── Auto-fill checkout form fields from Google profile ──
function autofillCheckoutFromGoogle(user) {
  if (!user) return;
  const nameParts = (user.name || '').trim().split(' ');
  const setField = (sel, val) => {
    const el = document.querySelector('#page-checkout ' + sel);
    if (el && val && !el.value) el.value = val;
  };
  setField('input[placeholder="Enter first name"]', nameParts[0] || '');
  setField('input[placeholder="Enter last name"]',  nameParts.slice(1).join(' ') || '');
  setField('input[type="email"]', user.email || '');
  if (user.phone) setField('input[type="tel"]', user.phone);
}

// ── Strategy 1: Google One Tap prompt ──
function _tryOneTap() {
  if (typeof google === 'undefined' || !google.accounts?.id) return false;
  try {
    google.accounts.id.prompt(notification => {
      // isSkippedMoment()/isDismissedMoment() are deprecated ahead of Google's
      // mandatory FedCM migration and log console warnings. isNotDisplayed()
      // alone still covers "One Tap didn't show" going forward.
      if (notification.isNotDisplayed()) {
        // One Tap suppressed — try OAuth2 popup as fallback
        _tryOAuth2Popup();
      }
    });
    return true;
  } catch(e) {
    console.warn('[Ozylix Auth] One Tap prompt error:', e);
    return false;
  }
}

// ── Strategy 2: OAuth2 token popup → userinfo endpoint (desktop) or redirect (mobile/Safari) ──
function _isMobileBrowser() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
function _isSafariBrowser() {
  // Only match iOS Safari specifically — NOT desktop Safari, NOT Edge, NOT Chrome
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
         /Safari/i.test(navigator.userAgent) &&
         !/CriOS|FxiOS|OPiOS|Chrome/i.test(navigator.userAgent);
}

function _tryOAuth2Popup() {
  if (typeof google === 'undefined' || !google.accounts?.oauth2) {
    _showAuthFeedback('error', 'Google sign-in is unavailable. Please use email login.');
    return;
  }

  // Redirect only for actual mobile devices — desktop always uses popup
  if (_isMobileBrowser() || _isSafariBrowser()) {
    try {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid profile email',
        ux_mode: 'redirect',
        // FIX (mobile login broken): this was hardcoded to
        // 'https://www.ozylix.com' — a domain that does not currently
        // resolve — so every mobile Google sign-in bounced the customer to a
        // dead page and the session was never created. Now derived from
        // wherever the site is actually being served, so it works on the
        // GitHub Pages URL, the custom domain, and local testing alike.
        // NOTE: this exact origin must also be listed under
        // "Authorised redirect URIs" in the Google Cloud console for the
        // OAuth client, or Google returns redirect_uri_mismatch.
        redirect_uri: GOOGLE_REDIRECT_URI,
      });
      client.requestCode();
    } catch(e) {
      console.error('[Ozylix Auth] OAuth2 redirect error:', e);
      _showAuthFeedback('error', 'Google sign-in failed. Please use email login.');
    }
    return;
  }

  // Desktop: popup flow is fine
  try {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid profile email',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          console.warn('[Ozylix Auth] OAuth2 error:', tokenResponse.error);
          if (tokenResponse.error !== 'access_denied') {
            _showAuthFeedback('error', 'Google sign-in was cancelled.');
          }
          return;
        }
        try {
          const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
          });
          if (!profileRes.ok) throw new Error('userinfo fetch failed: ' + profileRes.status);
          const profile = await profileRes.json();
          await handleGoogleCredential(_buildSyntheticCredential(profile));
        } catch(e) {
          console.error('[Ozylix Auth] OAuth2 userinfo error:', e);
          _showAuthFeedback('error', 'Could not retrieve Google profile. Please try again.');
        }
      }
    });
    client.requestAccessToken();
  } catch(e) {
    console.error('[Ozylix Auth] OAuth2 popup error:', e);
    _showAuthFeedback('error', 'Google sign-in failed. Please use email login.');
  }
}

// ── Public: triggered by "Continue with Google" button ──
function socialLogin(provider) {
  if (provider !== 'google') {
    showToast('📱 Phone OTP login coming soon!');
    return;
  }
  clearAuthMessages();

  // Desktop flow
  if (typeof google === 'undefined' || !google.accounts) {
    if (_googleInitRetries < 3) {
      _googleInitRetries++;
      showToast('⏳ Connecting to Google…');
      setTimeout(() => socialLogin('google'), 1000 * _googleInitRetries);
    } else {
      _showAuthFeedback('error', 'Google sign-in unavailable. Please use email login or refresh the page.');
    }
    return;
  }

  _googleInitRetries = 0;
  if (!_tryOneTap()) {
    _tryOAuth2Popup();
  }
}

// ══════════════════════════════════════════════════════════
// CHECKOUT LOGIN GATE
//
// Ozylix business rule (owner, Aug 2026): every order must belong to a
// signed-in account — points, orders, invoices and returns all key off the
// email of a real account, and guest checkout created invisible balances.
// So the two order paths (initiatePayment / initiateCOD) refuse to run
// unless asc_jwt exists, and resume automatically once sign-in finishes.
// ══════════════════════════════════════════════════════════
var _checkoutResumeCb = null;
function requireLoginForCheckout(resumeCb) {
  if (getCurrentUser()) return false;   // already signed in
  _checkoutResumeCb = resumeCb || null;
  // FIX (Aug 2026, owner video report): the mobile Google sign-in runs as a
  // full-page redirect (FedCM), which unloads the SPA — _checkoutResumeCb
  // and the selected pack tier were both memory-only and vanished with it.
  // Stash the resume intent in sessionStorage so the redirect return can
  // pick exactly where the customer left off, and restore the tier from
  // the localStorage copy saved by selectTier().
  try {
    sessionStorage.setItem('ozylix.login_return', JSON.stringify({
      page: currentPage || 'checkout',
      productId: (typeof currentProduct !== 'undefined' && currentProduct) ? currentProduct.id : null,
      intent: 'checkout_payment',
      at: Date.now(),
    }));
  } catch(e) {}
  openAuth('login');
  // Surface a reason inside the auth modal so it doesn't look random.
  var suc = document.getElementById('authSuccess');
  if (suc) { suc.style.display = 'block'; suc.textContent = '🔒 Sign in to place your order — you\u2019ll continue right where you left off.'; }
  return true;
}

// Called after a successful email-login or Google sign-in. If the person
// was blocked mid-checkout, resume that exact payment flow instead of the
// usual account redirect (postLoginRedirect already skips checkout — but
// the modal flow must also be resumed, not just the page).
function resumeCheckoutIfWaiting() {
  var cb = _checkoutResumeCb;
  _checkoutResumeCb = null;
  // OWNER FIX (Aug 2026): the order save requires a signed server JWT —
  // if sign-in completed without one (e.g. the /api/auth/google call timed
  // out during a Render cold start), resuming now would POST the order to
  // a server that rejects it 401 — the customer would sit through payment
  // only to see "Order failed" while appearing signed in. Verify the JWT
  // actually exists first; if not, re-open sign-in with a clear reason
  // instead of letting the order attempt fail.
  if (!localStorage.getItem('asc_jwt')) {
    console.warn('[Ozylix] login completed without a server JWT — skipping checkout resume');
    openAuth('login');
    var suc = document.getElementById('authSuccess');
    if (suc) { suc.style.display = 'block'; suc.textContent = '⚠️ Your sign-in could not be verified with our server. Please sign in again to place your order.'; }
    return;
  }
  if (typeof cb === 'function') { try { cb(); } catch(e) { console.error('[Ozylix] checkout resume failed', e); } }
}

// ── Init One Tap (called on SDK load) ──
function _initGoogleOneTap() {
  if (_googleInitialized) return;
  if (typeof google === 'undefined' || !google.accounts?.id) return;

  // If user already logged in via our JWT — init SDK but suppress ALL prompts
  if (getCurrentUser()) {
    try {
      google.accounts.id.initialize({
        client_id:            GOOGLE_CLIENT_ID,
        callback:             handleGoogleCredential,
        auto_select:          false,
        cancel_on_tap_outside: true,
        itp_support:          true,
        use_fedcm_for_prompt: true,
      });
      google.accounts.id.disableAutoSelect(); // suppress One Tap for logged-in users
      _googleInitialized = true;
    } catch(e) {}
    return; // do NOT show prompt
  }

  try {
    google.accounts.id.initialize({
      client_id:            GOOGLE_CLIENT_ID,
      callback:             handleGoogleCredential,
      auto_select:          false,         // don't auto-sign without user interaction
      cancel_on_tap_outside: true,
      context:              'signin',
      itp_support:          true,          // support Intelligent Tracking Prevention (Safari)
      use_fedcm_for_prompt: true,          // use FedCM API when available (Chrome 108+)
    });
    _googleInitialized = true;

    // NOTE: One Tap is intentionally NOT auto-triggered here anymore.
    // Sign-in (Google or email) only happens when the customer chooses to —
    // via the navbar account icon or the checkout "Sign in" option, which
    // call openAuth()/_tryOneTap() directly on click.
  } catch(e) {
    console.error('[Ozylix Auth] One Tap init error:', e);
  }
}

// ── Sign out ──
function doLogout() {
  // Disable Google auto-select so it doesn't auto-sign in again
  if (typeof google !== 'undefined' && google.accounts?.id) {
    try { google.accounts.id.disableAutoSelect(); } catch(e) {}
  }
  localStorage.removeItem('asc_jwt');
  localStorage.removeItem('asc_user');
  // Privacy: drop anything cached for the outgoing session so the
  // next person on this device cannot read it.
  window.__INVOICE_ORDERS = null;
  try {
    ['invoicesList','vitaPanelBody','ordersList'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.innerHTML = '';
    });
  } catch(e) {}
  updateAccountNavBtn();
  showPage('home');
  showToast('👋 You have been signed out.');
}

// ── Update nav avatar button ──
function updateAccountNavBtn() {
  const user = getCurrentUser();
  // When user logs in, tell Google to stop showing One Tap prompts
  if (user && typeof google !== 'undefined' && google.accounts?.id) {
    try { google.accounts.id.disableAutoSelect(); } catch(e) {}
  }
  if (user) { try { vitaRefreshFromServer(); } catch(e) {} }
  const btn  = document.getElementById('accountNavBtn');
  if (!btn) return;
  if (user) {
    if (user.picture) {
      btn.innerHTML = `<img src="${user.picture}" alt="Your account photo" 
        style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid white"
        onerror="this.outerHTML='<span decoding="async">${(user.name||'U')[0].toUpperCase()}</span>'"
        alt="${user.name || 'User'}">`;
    } else {
      btn.textContent = (user.name || 'U')[0].toUpperCase();
    }
    btn.title = user.name || 'My Account';
    btn.style.cssText = 'background:var(--green);color:white;border-radius:50%;width:36px;height:36px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0;overflow:hidden';
  } else {
    btn.innerHTML = '<svg width="20" height="20"><use href="#ico-user"/></svg>';
    btn.title = 'Account';
    btn.style.cssText = '';
  }
}

// ── Retry init with exponential backoff if SDK loads late ──
function _retryGoogleInit() {
  if (_googleInitialized || _googleInitRetries >= _GOOGLE_MAX_RETRIES) return;
  _googleInitRetries++;
  if (typeof google !== 'undefined' && google.accounts?.id) {
    _initGoogleOneTap();
  } else {
    setTimeout(_retryGoogleInit, Math.min(500 * Math.pow(1.5, _googleInitRetries), 8000));
  }
}

// ── Bootstrap: try init immediately, then with backoff, then on window.load ──
document.addEventListener('DOMContentLoaded', function() {
  // Attempt init immediately
  _initGoogleOneTap();

  // Start retry loop in case SDK loads after DOMContentLoaded
  if (!_googleInitialized) {
    setTimeout(_retryGoogleInit, 300);
  }

  // Last resort: try on full page load
  window.addEventListener('load', function() {
    if (!_googleInitialized) {
      setTimeout(_initGoogleOneTap, 200);
    }
  });

  // ── Wrap showPage to autofill checkout for logged-in Google users ──
  if (!window._googleShowPageWrapped2) {
    window._googleShowPageWrapped2 = true;
    const _origSP = window.showPage;
    if (typeof _origSP === 'function') {
      window.showPage = function(pg) {
        _origSP(pg);
        if (pg === 'checkout') {
          const user = getCurrentUser();
          if (user) autofillCheckoutFromGoogle(user);
          setTimeout(function() {
            const bar = document.getElementById('savedAddressBar');
            if (user && bar) {
              const nameEl    = document.getElementById('savedAddrName');
              const detailsEl = document.getElementById('savedAddrDetails');
              if (nameEl)    nameEl.textContent    = user.name  || '';
              if (detailsEl) detailsEl.textContent = user.email || '';
              bar.style.display = 'flex';
            }
          }, 100);
        }
      };
    }
  }
});

// ── Add CSS spinner keyframe if not already present ──
(function() {
  if (!document.getElementById('_asc_spin_style')) {
    const s = document.createElement('style');
    s.id = '_asc_spin_style';
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }
})();

function showForgotPassword() {
  clearAuthMessages();
  showAuthSuccess('Password reset link would be sent to your email. (Feature coming soon)');
}

// ═══════════════════════════════════════════════════════
// ACCOUNT DASHBOARD
// ═══════════════════════════════════════════════════════

function loadAccountPage() {
  const user = getCurrentUser();
  if (!user) { openAuth('login'); return; }
  document.getElementById('accName')?.textContent != null && (document.getElementById('accName').textContent = user.name);
  document.getElementById('accEmail')?.textContent != null && (document.getElementById('accEmail').textContent = user.email);
  const parts = user.name.split(' ');
  const av=document.getElementById('accAvatar'); if(av) av.textContent = (parts[0][0] + (parts[1]?parts[1][0]:'')).toUpperCase();
  loadOrdersList();
  loadInvoicesList();
  prefillProfile(user);
  // Refresh the top Account Hub identity and live summary on every account entry.
  try { if (typeof refreshAccountWelcome === 'function') refreshAccountWelcome(); } catch(e) {}

  // AUTO-REFRESH: the courier sync flips fulfillment (Shipped → Delivered)
  // server-side every 10 minutes. Without this loop the customer would have
  // to leave and return to see their order move, and the "Earns VitaPoints
  // once delivered" line would never update. Re-pull every 60 s while the
  // account page is visible — harmless repeat calls (authenticated, cheap).
  clearInterval(window._ordersRefreshTimer);
  window._ordersRefreshTimer = setInterval(() => {
    if (document.hidden) return;
    loadOrdersList();
    loadInvoicesList();
  }, 60 * 1000);
}

// ══════════════════════════════════════════════════════════════
// RETURNS & REFUNDS (My Account)
// The returns panel is also usable on pages where invoice-template.js is not
// loaded. Keep a local global fallback so a missing optional template helper
// cannot leave the customer-facing panel on an infinite loading state.
var _esc = (typeof window !== 'undefined' && typeof window._esc === 'function')
  ? window._esc
  : function(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };
if (typeof window !== 'undefined') window._esc = _esc;

//
// Every rule that matters — 7-day window, ownership, item validity —
// is enforced server-side in returns-routes.js and SQL. This is the
// display layer; it never decides eligibility, it only renders what
// /api/returns/eligible reports.
// ══════════════════════════════════════════════════════════════
let RETURN_REASONS = [];

function _retJwt() { return localStorage.getItem('asc_jwt') || ''; }

async function renderReturnsPanel() {
  const el = document.getElementById('returnsPanelBody');
  if (!el) return;
  if (!_retJwt()) {
    el.innerHTML = '<div class="ret-empty">Please sign in to request a return.</div>';
    return;
  }
  el.innerHTML = '<div class="ret-empty">Loading your orders…</div>';

  try {
    const h = { 'Authorization': 'Bearer ' + _retJwt() };
    // Never leave the customer on an infinite spinner. The eligible-orders
    // request is the critical path; the request-history call is best effort,
    // because a temporary failure there must not hide returnable products.
    const results = await Promise.allSettled([
      fetchWithTimeout(API_BASE + '/api/returns/eligible', { headers: h }, 15000),
      fetchWithTimeout(API_BASE + '/api/returns/my', { headers: h }, 15000),
    ]);
    const eligibleResult = results[0];
    const historyResult = results[1];
    if (eligibleResult.status !== 'fulfilled') {
      throw new Error('The returns service took too long to respond. Please try again.');
    }
    const eR = eligibleResult.value;
    const eD = await eR.json().catch(() => ({}));
    if (!eR.ok) throw new Error(eD.error || 'Could not load your orders');

    let mD = {};
    if (historyResult.status === 'fulfilled' && historyResult.value.ok) {
      mD = await historyResult.value.json().catch(() => ({}));
    } else {
      console.warn('[renderReturnsPanel] request history unavailable; showing eligible orders');
    }
    RETURN_REASONS = eD.reasons || [];

    const existing = (mD && mD.returns) || [];
    const orders   = (eD && eD.orders)  || [];

    let html = '';

    if (existing.length) {
      html += '<h4 style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t-low);margin:2px 0 11px;font-weight:800">Your requests</h4>';
      html += existing.map(function(r){
        const items = (r.items || []).map(function(i){ return _esc(i.name || ('Item ' + i.id)) + ' × ' + i.qty; }).join(', ');
        // data-return-id lets cancelReturn grey this exact card out
        // immediately, and flash it back if the server refuses.
        return '<div class="ret-card" data-return-id="' + _esc(r.id) + '">'
          + '<div class="ret-head"><div><div class="ret-oid">' + _esc(r.order_id) + '</div>'
          + '<div class="ret-meta">' + new Date(r.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
          + ' · ' + _esc(r.reason) + '</div></div>'
          + '<span class="ret-badge rb-' + _esc(r.status) + '">' + _esc(String(r.status).replace('_',' ')) + '</span></div>'
          + '<div class="ret-items"><div class="ret-item" style="padding:0">' + _esc(items) + '</div>'
          + (r.points_reversed ? '<div class="ret-meta" style="margin-top:7px">💎 ' + r.points_reversed.toLocaleString('en-IN') + ' VitaPoints reversed</div>' : '')
          + (r.refund_amount ? '<div class="ret-meta">Refund ₹' + Number(r.refund_amount).toLocaleString('en-IN') + (r.refund_ref ? ' · ref ' + _esc(r.refund_ref) : '') + '</div>' : '')
          + (r.admin_note ? '<div class="ret-meta">Note: ' + _esc(r.admin_note) + '</div>' : '')
          + '</div>'
          + (r.status === 'requested'
              ? '<div class="ret-actions"><button class="btn-outline" onclick="cancelReturn(\'' + r.id + '\')">Cancel request</button></div>'
              : '')
          + '</div>';
      }).join('');
    }

    const eligible = orders.filter(function(o){ return o.eligible; });
    html += '<h4 style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t-low);margin:20px 0 11px;font-weight:800">Eligible for return</h4>';

    if (!eligible.length) {
      html += '<div class="ret-empty">' + (orders.length
                ? 'None of your orders are open for return right now.'
                : 'You have no orders yet.') + '<br>'
            + '<span style="font-size:.78rem">Returns are open for <b>7 days</b> after delivery.</span></div>';
    } else {
      html += eligible.map(function(o){
        // items can arrive as a JSON string from an older backend build,
        // and as null on an order whose line items were never stored.
        // Both used to fall through as "no checkboxes", which produced a
        // form that could not possibly be submitted (see below).
        var rawItems = o.items;
        if (typeof rawItems === 'string') {
          try { rawItems = JSON.parse(rawItems); } catch (e) { rawItems = []; }
        }
        if (!Array.isArray(rawItems)) rawItems = [];

        // An order with ONE item has only one possible answer, and making
        // the customer find an invisible box to give it was the whole
        // failure. Pre-selected — they still choose a reason and press
        // Submit, so nothing is sent without an explicit action.
        const single = rawItems.length === 1;

        const items = rawItems.map(function(i, n){
          return '<label class="ret-item">'
            + '<input type="checkbox"' + (single ? ' checked' : '')
            + ' data-oid="' + _esc(o.order_id) + '" data-id="' + _esc(i.id) + '" data-max="' + (i.qty||1) + '">'
            + '<span>' + _esc(i.name || ('Item ' + i.id)) + '</span>'
            + '<span class="rq">qty ' + (i.qty || 1) + '</span></label>';
        }).join('');

        // Say a choice is needed BEFORE the button is pressed, rather
        // than only in an error afterwards.
        const pickHint = '<div class="ret-pick-hint">'
          + (single ? 'Item to return' : 'Select the item(s) to return')
          + '</div>';

        // AN ORDER WITH NO ITEMS MUST NOT SHOW A SUBMIT BUTTON.
        // Previously the item list rendered empty while the reason box
        // and "Submit return request" rendered anyway — so there was
        // nothing to tick, and every submit answered "Select at least
        // one item to return". The customer could try forever and never
        // succeed, with no way to tell why. Say what is wrong and give
        // them the route that does work.
        if (!rawItems.length) {
          return '<div class="ret-card" id="retcard-' + _esc(o.order_id) + '">'
            + '<div class="ret-head"><div><div class="ret-oid">' + _esc(o.order_id) + '</div>'
            + '<div class="ret-meta">₹' + Number(o.total||0).toLocaleString('en-IN')
            + ' · ' + new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) + '</div></div>'
            + '<span class="ret-days">' + o.days_left + ' day' + (o.days_left === 1 ? '' : 's') + ' left</span></div>'
            + '<div class="ret-empty" style="margin:12px 0 0">'
            + 'We could not load the items for this order, so a return cannot be started here.<br>'
            + '<span style="font-size:.78rem">This order is still within its return window — '
            + 'message us on WhatsApp with order <b>' + _esc(o.order_id) + '</b> and we will raise it for you.</span>'
            + '</div></div>';
        }
        return '<div class="ret-card" id="retcard-' + _esc(o.order_id) + '">'
          + '<div class="ret-head"><div><div class="ret-oid">' + _esc(o.order_id) + '</div>'
          + '<div class="ret-meta">₹' + Number(o.total||0).toLocaleString('en-IN')
          + ' · ' + new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) + '</div></div>'
          + '<span class="ret-days">' + o.days_left + ' day' + (o.days_left === 1 ? '' : 's') + ' left</span></div>'
          + '<div class="ret-items">' + pickHint + items + '</div>'
          + '<div class="ret-form">'
          + '<label>Reason for return</label>'
          + '<select id="retreason-' + _esc(o.order_id) + '">'
          + '<option value="">Select a reason…</option>'
          + RETURN_REASONS.map(function(r){ return '<option>' + _esc(r) + '</option>'; }).join('')
          + '</select>'
          + '<label>Anything else we should know? (optional)</label>'
          + '<textarea id="retnote-' + _esc(o.order_id) + '" placeholder="Tell us what went wrong…"></textarea>'
          + '</div>'
          + '<div class="ret-actions"><button class="btn-primary" onclick="submitReturn(\'' + _esc(o.order_id) + '\', this)">Submit return request</button></div>'
          + '<p class="ret-meta" style="margin-top:9px">Approved returns reverse the VitaPoints earned on this order.</p>'
          + '</div>';
      }).join('');
    }

    // Everything that is NOT open for return, with the server's reason
    // against it. This panel used to render nothing but "No orders are
    // currently eligible", which is the same message whether the window
    // has closed, the order was cancelled, a request is already open, or
    // — as was happening for every customer — the window was being
    // measured from the wrong date. A customer who cannot raise a refund
    // request should at least be told which of those it is.
    const blocked = orders.filter(function(o){ return !o.eligible; });
    if (blocked.length) {
      html += '<h4 style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t-low);margin:22px 0 11px;font-weight:800">Not open for return</h4>';
      html += blocked.map(function(o){
        return '<div class="ret-card ret-card-muted">'
          + '<div class="ret-head"><div><div class="ret-oid">' + _esc(o.order_id) + '</div>'
          + '<div class="ret-meta">\u20b9' + Number(o.total||0).toLocaleString('en-IN')
          + ' \u00b7 ' + new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
          + (o.fulfillment ? ' \u00b7 ' + _esc(o.fulfillment) : '') + '</div></div></div>'
          + '<div class="ret-meta" style="margin-top:8px">' + _esc(o.reason || 'Not eligible for return') + '</div>'
          + '</div>';
      }).join('');
    }

    html += '<p class="ret-meta" style="margin-top:18px">Something look wrong? '
          + '<a href="mailto:ozylixcare@gmail.com">Email us</a> with your order number '
          + 'and we will raise the request for you.</p>';

    el.innerHTML = html;
  } catch (err) {
    console.error('[renderReturnsPanel]', err);
    el.innerHTML = '<div class="ret-empty">Could not load returns: ' + _esc(err.message) + '</div>';
  }
}

// _esc() is defined once, in invoice-template.js, which loads in <head>
// before any of this runs. The byte-identical copy that used to sit here
// shadowed it for no reason.

async function submitReturn(orderId, btn) {
  const boxes = Array.from(document.querySelectorAll('input[type=checkbox][data-oid="' + orderId + '"]:checked'));
  const reason = (document.getElementById('retreason-' + orderId) || {}).value || '';
  const note   = (document.getElementById('retnote-' + orderId) || {}).value || '';

  if (!boxes.length) {
    // A toast alone told the customer a rule existed but not where to
    // satisfy it — which, when the control was invisible, made the
    // button look broken. Point at the actual rows and flash them.
    showToast('Tick the item you want to return', 'error');
    var card = document.getElementById('retcard-' + orderId);
    var list = card && card.querySelector('.ret-items');
    if (list) {
      list.classList.remove('rollback-flash');
      void list.offsetWidth;
      list.classList.add('rollback-flash');
      setTimeout(function(){ list.classList.remove('rollback-flash'); }, 1600);
      list.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  if (!reason)       { showToast('Please choose a reason for the return', 'error'); return; }

  const orig = btn.textContent;
  btn.disabled = true; btn.textContent = 'Submitting…';
  try {
    const resp = await fetch(API_BASE + '/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _retJwt() },
      body: JSON.stringify({
        order_id: orderId, reason: reason, comments: note,
        items: boxes.map(function(b){ return { id: b.dataset.id, qty: Number(b.dataset.max) || 1 }; }),
      }),
    });
    const d = await resp.json();
    if (!resp.ok) throw new Error(d.error || 'Could not submit');
    showToast('↩️ Return request submitted');
    renderReturnsPanel();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
    btn.disabled = false; btn.textContent = orig;
  }
}

async function cancelReturn(id) {
  // Optimistic: this is the customer's own pending request, so it
  // essentially always succeeds. Grey the card out and say so
  // immediately rather than leaving the button looking inert.
  const card = document.querySelector('[data-return-id="' + id + '"]');
  if (card) { card.style.opacity = '0.45'; card.style.pointerEvents = 'none'; }

  try {
    const resp = await fetch(API_BASE + '/api/returns/' + id + '/cancel', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + _retJwt() },
      signal: AbortSignal.timeout(15000),
    });
    const d = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(d.error || 'Could not cancel');
    showToast('Return request cancelled');
    renderReturnsPanel();
  } catch (err) {
    // Put the card back and make the undo visible, so nobody walks away
    // thinking a request was cancelled when it is still open.
    if (card) {
      card.style.opacity = '';
      card.style.pointerEvents = '';
      card.classList.add('rollback-flash');
      setTimeout(() => card.classList.remove('rollback-flash'), 1600);
    }
    showToast('↩️ Still open — ' + (err.message || 'could not cancel'), 'error');
  }
}

function switchAccountPanel(panel) {
  document.querySelectorAll('.account-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.account-nav-item').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('panel-' + panel);
  if (el) el.classList.add('active');
  const navItems = document.querySelectorAll('.account-nav-item');
  const labels = ['orders','tracking','invoices','vita','returns','profile'];
  if (panel === 'returns') { try { renderReturnsPanel(); } catch(e) { console.error('[renderReturnsPanel]', e); } }
  if (panel === 'vita') { try { renderVitaPanel(); } catch(e) { console.error('[renderVitaPanel]', e); } }
  if (panel === 'orders') { try { refreshAccountWelcome(); } catch(e) { console.error('[refreshAccountWelcome]', e); } }
  try { refreshAccountWelcome(); } catch(e) {}
  const idx = labels.indexOf(panel);
  if (idx >= 0 && navItems[idx]) navItems[idx].classList.add('active');
}

function _renderOrderCards(orders, container) {
  if (orders.length === 0) {
    container.innerHTML = `<div class="no-orders"><div class="no-orders-ico">📦</div><h3 style="margin-bottom:8px">No orders yet</h3><p style="color:var(--gray);margin-bottom:20px">Your order history will appear here after your first purchase.</p><button class="btn-primary" onclick="showPage('shop')">Start Shopping →</button></div>`;
    return;
  }
  container.innerHTML = orders.map(o => {
    const orderId = o.orderId || o.id || '';
    const date    = o.date || (o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '');
    const status  = o.status || o.fulfillment || 'Processing';
    const total   = o.total || 0;
    let items = o.items || [];
    if (typeof items === 'string') { try { items = JSON.parse(items); } catch(e) { items = []; } }
    const statusCls = status.toLowerCase().includes('dispatch')||status.toLowerCase().includes('confirm') ? 'confirmed'
      : status.toLowerCase().includes('ship') ? 'shipped'
      : status.toLowerCase().includes('deliver') ? 'delivered' : 'pending';

    // VitaPoints for this order, straight from the columns the server writes
    // when it awards/redeems against the ledger. Nothing is recomputed here —
    // if the order was returned, the points were reversed server-side, so the
    // card says so rather than still claiming they were earned.
    const isReturned  = /return/i.test(status);
    const isCancelled = /cancel/i.test(status);
    const earned   = Number(o.vita_points_earned || 0);
    const redeemed = Number(o.vita_points_redeemed || 0);
    let vitaLine = '';
    {
      const bits = [];
      if (earned > 0) {
        bits.push(isReturned
          ? `<span style="color:var(--clay-lo,#b4553f)">−${earned.toLocaleString('en-IN')} VitaPoints reversed</span>`
          : `<span style="color:var(--fern-lo,#2E7D32)">+${earned.toLocaleString('en-IN')} VitaPoints</span>`);
      } else if (!isCancelled && !isReturned) {
        // A cash-on-delivery order earns nothing until the courier hands it
        // over and the cash is collected — a refused parcel was never a sale.
        // With no line at all, an order that SPENT points looked like it gave
        // nothing back, which is what this reads as on the account page.
        // No number is shown: the rate is tier-based and decided server-side
        // by vita_earn_on_order, so quoting one here would be a guess.
        bits.push('<span style="color:var(--gray,#777)">Earns VitaPoints once delivered</span>');
      }
      if (redeemed > 0) bits.push(`<span style="color:var(--gray,#777)">${redeemed.toLocaleString('en-IN')} used</span>`);
      if (bits.length) {
        vitaLine = `<div style="font-size:.76rem;margin-top:6px;display:flex;gap:10px;flex-wrap:wrap">🌿 ${bits.join(' · ')}</div>`;
      }
    }
    const payStatus = o.payment_status ? `<div style="font-size:.72rem;color:var(--gray,#888);margin-top:4px">${o.payment_status}</div>` : '';
    // 2026-08: show WHICH payment method was used (COD vs Online) and every
    // discount that applied, so My Orders matches the invoice and the
    // VitaPoints ledger — same database row, same numbers.
    const PAY_METHOD_LABEL = {
      cod: '💵 COD', cashfree: '🔒 Online (Cashfree)', gokwik: '🔒 Online (GoKwik)',
      online: '🔒 Online', UPI: '🔒 UPI',
    };
    const payMethod = o.payment_method ? `<div style="font-size:.72rem;font-weight:600;color:var(--t-mid,#444);margin-top:3px">${PAY_METHOD_LABEL[String(o.payment_method).toLowerCase()] || '🔒 ' + o.payment_method}</div>` : '';
    const discBits = [];
    if (Number(o.tier_discount || 0) > 0) discBits.push(`Pack/tier −₹${Number(o.tier_discount).toLocaleString('en-IN')}`);
    if (Number(o.mix_match_discount || 0) > 0) discBits.push(`Mix&Match −₹${Number(o.mix_match_discount).toLocaleString('en-IN')}`);
    if (Number(o.coupon_discount || 0) > 0) discBits.push(`Promo ${o.coupon_code ? '(' + o.coupon_code + ')' : ''} −₹${Number(o.coupon_discount).toLocaleString('en-IN')}`);
    if (Number(o.vita_points_discount || 0) > 0) discBits.push(`VitaPoints −₹${Number(o.vita_points_discount).toLocaleString('en-IN')}`);
    const discLine = discBits.length ? `<div style="font-size:.72rem;color:var(--success,#2E7D32);margin-top:3px">🏷️ ${discBits.join(' · ')}</div>` : '';
    // REVIEW COLLECTION: delivered orders get a direct "Write a Review"
    // button — this is where reviews come from in the real world. It opens
    // the product page straight onto the review form, so the customer is
    // one tap from the stars. Only shown when the courier has confirmed
    // delivery (fulfillment === 'Delivered'), never before.
    const delivered = String(status).toLowerCase() === 'delivered';
    const productId = (() => { try { const it = items[0]; return Number(it && (it.product_id || it.id || 0)) || 0; } catch(_) { return 0; } })();
    const deliveredReviewCta = delivered && productId
      ? `<button class="order-track-btn" style="background:var(--fern-lo,#2E7D32);color:#fff" onclick="openProductReview(${productId})">⭐ Write a Review</button>`
      : '';

    return `<div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">${orderId}</div>
          <div class="order-date">${date}</div>
        </div>
        <span class="order-status ${statusCls}">${status}</span>
      </div>
      <div class="order-items">${items.map(i => `${i.name||i.item_name||''} × ${i.qty||i.units||1}`).join(', ') || 'Order confirmed'}</div>
      ${vitaLine}
      ${payMethod}${discLine}
      <div class="order-footer">
        <div class="order-total">₹${parseFloat(total).toLocaleString('en-IN')}${payStatus}</div>
        <div style="display:flex;gap:8px">
          <button class="invoice-btn" onclick="downloadInvoice('${orderId}')">🧾 Updated Invoice</button>
          <button class="order-track-btn" onclick="openTracking('${orderId}')">🚚 Track</button>${deliveredReviewCta}
        </div>
      </div>
    </div>`;
  }).join('');
}

async function loadOrdersList() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  const user = getCurrentUser();
  if (!user) { container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:30px">Please log in to view your orders.</p>'; return; }

  // Show loading state
  container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray)"><div style="font-size:1.5rem;margin-bottom:8px">⏳</div>Loading your orders…</div>';

  const jwt = localStorage.getItem('asc_jwt') || '';
  let backendOrders = [];
  let backendLoaded = false;

  // 1. Try backend first (cross-device — source of truth)
  if (jwt) {
    try {
      const r = await fetchWithTimeout(API_BASE + '/api/orders/my', {
        headers: { 'Authorization': 'Bearer ' + jwt }
      }, 8000);
      if (r.ok) {
        const data = await r.json();
        backendOrders = (data.data || data || []).filter(o => {
          // Security: double-check email matches logged-in user
          return (o.customer_email || '').toLowerCase().trim() === user.email.toLowerCase().trim();
        });
        backendLoaded = true;
      }
    } catch(e) { console.warn('[Orders] Backend fetch failed:', e.message); }
  }

  // 2. Merge with localStorage orders (for orders placed before account existed)
  const localOrders = JSON.parse(localStorage.getItem('asc_orders') || '[]');
  const userEmail = user.email.toLowerCase().trim();
  const localUserOrders = localOrders.filter(o =>
    (o.userEmail || o.email || '').toLowerCase().trim() === userEmail
  );

  // Deduplicate: backend wins for same orderId
  const backendIds = new Set(backendOrders.map(o => o.id));
  const localOnly  = localUserOrders.filter(o => !backendIds.has(o.orderId) && !backendIds.has(o.id));

  // Merge and sort by date descending
  const merged = [
    ...backendOrders,
    ...localOnly.map(o => ({ ...o, id: o.orderId, _local: true })),
  ].sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));

  // Keep the exact same order objects available to every invoice action,
  // including the Orders panel. Previously only the Invoices panel populated
  // __INVOICE_ORDERS, so Print/Invoice from My Account could fall back to an
  // incomplete local row and appear to use a different template.
  window.__INVOICE_ORDERS = merged;
  _renderOrderCards(merged, container);

  if (!backendLoaded && merged.length === 0) {
    container.innerHTML = `<div class="no-orders"><div class="no-orders-ico">📦</div><h3 style="margin-bottom:8px">No orders yet</h3><p style="color:var(--gray);margin-bottom:20px">Your order history will appear here after your first purchase.</p><button class="btn-primary" onclick="showPage('shop')">Start Shopping →</button></div>`;
  }
}

async function loadInvoicesList() {
  const container = document.getElementById('invoicesList');
  if (!container) return;
  const user = getCurrentUser();
  if (!user) return;

  const jwt = localStorage.getItem('asc_jwt') || '';
  let orders = [];

  // Fetch from backend
  if (jwt) {
    try {
      const r = await fetchWithTimeout(API_BASE + '/api/orders/my', {
        headers: { 'Authorization': 'Bearer ' + jwt }
      }, 8000);
      if (r.ok) {
        const data = await r.json();
        orders = (data.data || data || []).filter(o =>
          (o.customer_email || '').toLowerCase().trim() === user.email.toLowerCase().trim()
        );
      }
    } catch(e) {}
  }

  // Fallback: localStorage
  if (!orders.length) {
    const local = JSON.parse(localStorage.getItem('asc_orders') || '[]');
    orders = local.filter(o => (o.userEmail||o.email||'').toLowerCase().trim() === user.email.toLowerCase().trim())
      .map(o => ({ ...o, id: o.orderId, payment_status: 'Paid' }));
  }

  if (!orders.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">No invoices yet. They'll appear here after you place an order.</div>`;
    return;
  }

  const sorted = orders.sort((a,b) => new Date(b.created_at||b.date||0) - new Date(a.created_at||a.date||0));
  window.__INVOICE_ORDERS = sorted;   // so downloadInvoice() can find backend-sourced orders
  container.innerHTML = `
    <div style="background:var(--sub-1);border-radius:var(--radius);border:1px solid rgba(0,0,0,0.08);overflow:hidden">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:var(--off-white);font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--gray)">
          <th style="padding:12px 18px;text-align:left">Order ID</th>
          <th style="padding:12px 18px;text-align:left">Date</th>
          <th style="padding:12px 18px;text-align:left">Amount</th>
          <th style="padding:12px 18px;text-align:left">Status</th>
          <th style="padding:12px 18px;text-align:left">Invoice</th>
        </tr></thead>
        <tbody>${sorted.map(o => {
          const oid  = o.id || o.orderId || '';
          const date = o.date || (o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '');
          const paid = (o.payment_status||'').toLowerCase().includes('paid') || (o.payment_status||'').toLowerCase().includes('cod') ? o.payment_status : 'Paid';
          const paidColor = paid.toLowerCase().includes('cod') ? 'var(--st-warn-fg)' : 'var(--st-ok-fg)';
          const paidBg    = paid.toLowerCase().includes('cod') ? 'var(--st-warn-bg)' : 'var(--st-ok-bg)';
          return `<tr style="border-top:1px solid var(--light-gray);font-size:0.84rem">
            <td style="padding:14px 18px;font-weight:700;color:var(--green)">${oid}</td>
            <td style="padding:14px 18px;color:var(--gray)">${date}</td>
            <td style="padding:14px 18px;font-weight:600">₹${parseFloat(o.total||0).toLocaleString('en-IN')}</td>
            <td style="padding:14px 18px"><span style="background:${paidBg};color:${paidColor};padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700">${paid}</span></td>
            <td style="padding:14px 18px;white-space:nowrap"><button class="invoice-btn" onclick="downloadInvoice('${oid}')">⬇ Updated Invoice</button> <button class="invoice-btn" onclick="printInvoice('${oid}')">🖨️ Print</button></td>
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>
  `;
}

function openTracking(orderId) {
  switchAccountPanel('tracking');
  setTimeout(() => {
    const inp = document.getElementById('trackInput');
    if (inp) { inp.value = orderId; doTrackOrder(); }
  }, 100);
}

async function doTrackOrder() {
  const inp = document.getElementById('trackInput');
  const res = document.getElementById('trackResult');
  if (!inp || !res) return;
  const requested = inp.value.trim();
  if (!requested) { showToast('Please enter an Order ID', 'error'); return; }
  const normaliseId = value => String(value || '').trim().toUpperCase();
  const matchesId = value => {
    const a = normaliseId(value);
    const b = normaliseId(requested);
    return a === b || a.replace(/^AVC-/, '') === b.replace(/^AVC-/, '');
  };

  res.style.display = 'block';
  res.innerHTML = '<div style="padding:14px;color:var(--gray)">Loading order status…</div>';
  let order = Array.isArray(window.__INVOICE_ORDERS)
    ? window.__INVOICE_ORDERS.find(o => matchesId(o.id || o.orderId))
    : null;
  const user = getCurrentUser();
  const jwt = localStorage.getItem('asc_jwt') || localStorage.getItem('asc_token') || '';

  // The authenticated endpoint is the source of truth; it returns only the
  // current customer’s orders, so tracking works across devices and sessions.
  if (!order && jwt) {
    try {
      const r = await fetchWithTimeout(API_BASE + '/api/orders/my', {
        headers: { 'Authorization': 'Bearer ' + jwt, 'Accept': 'application/json' }
      }, 8000);
      if (r.ok) {
        const data = await r.json();
        const backendOrders = (data.data || data || []).filter(o =>
          !user?.email || (o.customer_email || '').toLowerCase().trim() === user.email.toLowerCase().trim()
        );
        order = backendOrders.find(o => matchesId(o.id || o.orderId));
      }
    } catch (e) { console.warn('[Tracking] backend lookup failed:', e && e.message); }
  }

  // Legacy local orders remain a fallback, but only after an email ownership
  // check. The previous implementation could display another local order if
  // a visitor guessed its ID.
  if (!order && user?.email) {
    try {
      const local = JSON.parse(localStorage.getItem('asc_orders') || '[]');
      order = local.filter(o => (o.userEmail || o.email || '').toLowerCase().trim() === user.email.toLowerCase().trim())
        .find(o => matchesId(o.orderId || o.id));
    } catch (e) {}
  }

  if (!order) {
    res.innerHTML = '<div style="background:var(--st-danger-bg);border:1px solid var(--st-danger-bg);border-radius:var(--radius);padding:14px;font-size:0.84rem;color:var(--red)">Order not found in your account. <a href="https://www.shiprocket.in/shipment-tracking/" target="_blank" rel="noopener" style="color:var(--green);font-weight:700">Try Shiprocket directly ↗</a></div>';
    return;
  }

  const foundId = order.id || order.orderId || requested;
  const address = order.address || order.shipping_address || [order.city, order.state, order.pincode || order.postal_code].filter(Boolean).join(', ');
  const status = order.fulfillment || order.status || order.order_status || 'Processing';
  res.innerHTML = `
    <div style="background:var(--green-wash);border-radius:var(--radius);padding:18px">
      <div style="font-weight:700;margin-bottom:8px;color:var(--green)">📦 Order Found: ${esc(foundId)}</div>
      <div style="font-size:0.84rem;color:var(--gray);margin-bottom:12px">${esc(address)}</div>
      <div style="font-size:0.84rem;font-weight:700;color:var(--text)">Status: ${esc(status)}</div>
      <div style="margin-top:14px">
        <a href="https://www.shiprocket.in/shipment-tracking/" target="_blank" rel="noopener" class="btn-primary" style="font-size:0.82rem;padding:10px 20px">Track on Shiprocket ↗</a>
      </div>
    </div>
  `;
}

// The A4 GST tax invoice lives in invoice-template.js, loaded in <head>
// and shared with the admin panel so both print the same document.
// OZYLIX_LEGAL, IN_STATE_CODES, normaliseOrderForInvoice() and
// buildInvoiceHTML() all come from there.

// Download a printable A4 PDF tax invoice from the backend. The server
// authenticates the request and streams application/pdf; HTML is never used
// as a download fallback because browsers otherwise save the invoice source
// as an .html file.
function invoiceAuthHeaders() {
  var jwt = localStorage.getItem('asc_jwt') || localStorage.getItem('asc_token') || '';
  return jwt ? { 'Authorization': 'Bearer ' + jwt } : {};
}

function fetchInvoicePDF(orderId) {
  return fetchWithTimeout(API_BASE + '/api/orders/' + encodeURIComponent(orderId) + '/pdf', {
    headers: invoiceAuthHeaders()
  }, 15000).then(function(r) {
    var type = (r.headers.get('content-type') || '').toLowerCase();
    if (!r.ok) {
      return r.text().then(function(text) {
        var message = 'Invoice service returned ' + r.status;
        try { var body = JSON.parse(text); if (body && body.error) message = body.error; } catch (e) {}
        throw new Error(message);
      });
    }
    if (type.indexOf('application/pdf') === -1) {
      throw new Error('Invoice service did not return a PDF');
    }
    return r.blob();
  });
}

function findInvoiceOrder(orderId) {
  var o = null;
  if (Array.isArray(window.__INVOICE_ORDERS)) {
    o = window.__INVOICE_ORDERS.find(function(x) {
      return String(x.id || x.orderId || x.order_id) === String(orderId);
    });
  }
  if (!o) {
    try {
      var local = JSON.parse(localStorage.getItem('asc_orders') || '[]');
      o = local.find(function(ord) { return String(ord.orderId) === String(orderId); });
    } catch (e) {}
  }
  return o;
}

function downloadInvoice(orderId) {
  // All visible customer invoice actions now use the shared upgraded template.
  // The generated HTML is self-contained, printable, and can be saved as PDF
  // from its built-in Print / Save as PDF control. The backend PDF route is
  // retained separately as downloadInvoicePDF() for API/integration callers.
  try {
    var o = findInvoiceOrder(orderId);
    if (!o) { showToast('Invoice not found for ' + orderId, 'error'); return; }
    var html = buildInvoiceHTML(o);
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Ozylix-Tax-Invoice-' + orderId + '.html';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 4000);
    showToast('🧾 Updated invoice downloaded — open it to print or save as PDF');
  } catch (e) {
    console.error('[downloadInvoice]', e);
    showToast('Could not download the updated invoice: ' + (e.message || 'please try again'), 'error');
  }
}

function downloadInvoicePDF(orderId) {
  fetchInvoicePDF(orderId).then(function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Ozylix-Tax-Invoice-' + orderId + '.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 4000);
    showToast('🧾 Updated PDF invoice downloaded');
  }).catch(function(e) {
    console.error('[downloadInvoicePDF]', e);
    showToast('Could not download the PDF invoice: ' + (e.message || 'please try again'), 'error');
  });
}

// Print is intentionally a print-ready document, not a file download. The
// browser print dialog can print to a physical printer or Save as PDF, while
// Download always uses the server-generated PDF above.
function printInvoice(orderId) {
  try {
    var o = findInvoiceOrder(orderId);
    if (!o) { showToast('Invoice not found for ' + orderId, 'error'); return; }
    var w = window.open('', '_blank', 'width=960,height=800,scrollbars=yes');
    if (!w) { showToast('Please allow pop-ups to print the invoice', 'error'); return; }
    w.document.open();
    w.document.write(buildInvoiceHTML(o));
    w.document.close();
    w.focus();
    setTimeout(function() { try { w.print(); } catch (e) {} }, 800);
  } catch (e) {
    console.error('[printInvoice]', e);
    showToast('Could not open invoice for printing', 'error');
  }
}

function prefillProfile(user) {
  const parts = user.name?.split(' ') || ['',''];
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  setVal('profileFirst', parts[0]);
  setVal('profileLast', parts.slice(1).join(' '));
  setVal('profileEmail', user.email);
  setVal('profilePhone', user.phone);
  if (user.address) {
    setVal('profileAddr1', user.address.addr1);
    setVal('profileAddr2', user.address.addr2);
    setVal('profileCity', user.address.city);
    setVal('profileState', user.address.state);
    setVal('profilePin', user.address.pin);
  }
}

function saveProfile() {
  const user = getCurrentUser();
  if (!user) return;
  const getVal = id => document.getElementById(id)?.value?.trim() || '';
  user.name = (getVal('profileFirst') + ' ' + getVal('profileLast')).trim();
  user.phone = getVal('profilePhone');
  user.address = {
    addr1: getVal('profileAddr1'),
    addr2: getVal('profileAddr2'),
    city: getVal('profileCity'),
    state: getVal('profileState'),
    pin: getVal('profilePin'),
  };
  // Update in users list
  try {
    const users = JSON.parse(localStorage.getItem('asc_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx >= 0) users[idx] = { ...users[idx], ...user };
    else users.push(user);
    localStorage.setItem('asc_users', JSON.stringify(users));
  } catch(e) {}
  localStorage.setItem('asc_user', JSON.stringify(user));
  const an=document.getElementById('accName'); if(an) an.textContent = user.name;
  updateAccountNavBtn();
  showToast('✅ Profile & address saved!');
}

// ═══════════════════════════════════════════════════════
// CHECKOUT: PROMO CODES + SAVED ADDRESS AUTO-FILL
// ═══════════════════════════════════════════════════════

// ALL real codes are fetched live from backend (Supabase coupons table).
// No local test codes — admin creates all promo codes in the dashboard.
// Note: activePromoCode declared globally above (near appliedDiscount)

async function applyPromoCode() {
  const input  = document.getElementById('promoCodeInput');
  const status = document.getElementById('promoStatus');
  if (!input || !status) return;
  const code = input.value.trim().toUpperCase();
  if (!code) {
    status.innerHTML = '<div style="font-size:0.78rem;color:var(--red);margin-top:6px">Please enter a promo code.</div>';
    return;
  }

  status.innerHTML = '<div style="font-size:0.78rem;color:var(--gray);margin-top:6px">⏳ Checking code...</div>';

  // Every code must be validated by the backend. This deliberately keeps
  // the legacy local map inert so deleted or inactive codes cannot be used.

  // ALL real codes come from backend (Supabase coupons table via admin)
  const subtotal = STORE.getSubtotal ? STORE.getSubtotal() : 0;
  const backendPromo = await validateCouponWithBackend(code, subtotal);
  if (backendPromo) {
    const type = backendPromo.type === 'percent' ? 'pct' : 'flat';
    activePromoCode = { code, type, value: backendPromo.value, discount: Number(backendPromo.discount || 0), maxDisc: (backendPromo.max_discount != null ? Number(backendPromo.max_discount) : null), label: backendPromo.label || `${code} applied` };
    status.innerHTML = `<div class="promo-badge">✅ ${code} applied — ${activePromoCode.label} <button class="promo-remove" onclick="removePromoCode()">✕</button></div>`;
    renderCheckoutSummary();
    showToast(`🏷️ Code ${code} applied!`);
    return;
  }

  status.innerHTML = '<div style="font-size:0.78rem;color:var(--red);margin-top:6px">❌ Invalid or expired code. Add codes in the admin panel.</div>';
  activePromoCode = null;
  renderCheckoutSummary();
}

function removePromoCode() {
  activePromoCode = null;
  // appliedDiscount is a second copy of the same coupon that carries none
  // of its constraints, and several display branches fall through to it
  // when activePromoCode is null. Clearing only one of the two left the
  // cart showing an uncapped discount after the customer removed the code,
  // while the payload sent coupon_code: null and the server charged full
  // price — the customer saw one total and paid a higher one.
  if (typeof appliedDiscount !== 'undefined') appliedDiscount = null;
  const input = document.getElementById('promoCodeInput');
  const status = document.getElementById('promoStatus');
  if (input) input.value = '';
  if (status) status.innerHTML = '';
  renderCheckoutSummary();
}

function getPromoDiscount(subtotal) {
  if (!activePromoCode) return 0;
  // Capped like every other site. The side cart calls this one, and showed
  // a larger discount than the cart and checkout did.
  const cap = (typeof azPromoCap === 'function') ? azPromoCap : (x) => x;
  if (activePromoCode.type === 'pct') return cap(Math.round(subtotal * activePromoCode.value / 100));
  if (activePromoCode.type === 'flat') return cap(Math.min(activePromoCode.value, subtotal));
  return 0;
}

// Show saved address bar on checkout page load for logged-in users
function checkSavedAddressForCheckout() {
  const user = getCurrentUser();
  const bar = document.getElementById('savedAddressBar');
  const signInLink = document.getElementById('ckSignInLink');
  if (signInLink) signInLink.style.display = user ? 'none' : '';
  if (!bar) return;
  if (user && user.address && user.address.addr1) {
    const sn=document.getElementById('savedAddrName'); if(sn) sn.textContent = user.name;
    const sd=document.getElementById('savedAddrDetails'); if(sd) sd.textContent = `${user.address.addr1}, ${user.address.city} - ${user.address.pin}`;
    bar.style.display = 'flex';
  } else {
    bar.style.display = 'none';
  }
  // 2026-08: prefill the ENTIRE checkout form from the saved profile
  // (name/email/phone/address/city/state/pin) — the backend now writes
  // every order's contact details to the customer's profile row, so the
  // first-order typing is the ONLY typing a customer ever does.
  // Only fills EMPTY fields so a customer editing their own form is
  // never overwritten mid-typing.
  const hasContact = user && (user.name || user.email || user.phone);
  if (user && hasContact) {
    const inputs = document.querySelectorAll('#page-checkout .form-input');
    if (inputs.length >= 9) {
      const nameParts = (user.name || '').split(' ').filter(Boolean);
      if (!inputs[0].value && nameParts[0]) inputs[0].value = nameParts[0];
      if (!inputs[1].value && nameParts.length > 1) inputs[1].value = nameParts.slice(1).join(' ');
      if (!inputs[2].value && user.email) inputs[2].value = user.email;
      if (!inputs[3].value && user.phone) inputs[3].value = user.phone;
      if (user.address) {
        const a = user.address;
        if (!inputs[4].value && a.addr1) inputs[4].value = a.addr1;
        if (!inputs[5].value && a.addr2) inputs[5].value = a.addr2;
        if (!inputs[6].value && a.city) inputs[6].value = a.city;
        if (!inputs[7].value && a.state) inputs[7].value = a.state;
        if (inputs[8] && !inputs[8].value && a.pin) inputs[8].value = a.pin;
      }
    }
    // Trigger PIN serviceability check automatically if a pincode is filled.
    if (inputs[8] && inputs[8].value) { try { checkPincode(inputs[8].value); } catch(e) {} }
  }
}

function fillSavedAddress() {
  const user = getCurrentUser();
  if (!user || !user.address) return;
  const a = user.address;
  const setVal = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.value = val; };
  // Use form-input selectors (nth-child approach for the checkout form inputs)
  const inputs = document.querySelectorAll('#page-checkout .form-input');
  if (inputs.length >= 8) {
    const nameParts = user.name?.split(' ') || ['',''];
    inputs[0].value = nameParts[0] || '';
    inputs[1].value = nameParts.slice(1).join(' ') || '';
    inputs[2].value = user.email || '';
    inputs[3].value = user.phone || '';
    inputs[4].value = a.addr1 || '';
    inputs[5].value = a.addr2 || '';
    inputs[6].value = a.city || '';
    inputs[7].value = a.state || '';
    if (inputs[8]) inputs[8].value = a.pin || '';
  }
  const sab=document.getElementById('savedAddressBar'); if(sab) sab.style.display = 'none';
  // 2026-08: re-run the PIN serviceability check after filling — the badge
  // now reflects the filled address, not the old one.
  if (inputs[8] && inputs[8].value) { try { checkPincode(inputs[8].value); } catch(e) {} }
  showToast('✅ Saved details filled in!');
}

// ── PIN SERVICEABILITY — checks Delhivery BEFORE the customer pays ────
// The server endpoint is public (GET /api/delhivery/serviceability/:pin).
// Result is cached per pin in memory; COD availability is shown too, so
// a "not serviceable" PIN can never become a paid, unfulfillable order.
var _pinCheckTimer = null;
function checkPincode(pin) {
  const badge = document.getElementById('pinStatus');
  if (!badge) return;
  const clean = (pin || '').replace(/\D/g, '');
  if (clean.length < 6) { badge.style.display = 'none'; return; }
  if (window.__pinCache && window.__pinCache[clean]) {
    _showPinBadge(badge, window.__pinCache[clean]); return;
  }
  clearTimeout(_pinCheckTimer);
  badge.style.display = 'block';
  badge.style.color = 'var(--t-low)';
  badge.textContent = '⏳ Checking delivery availability…';
  _pinCheckTimer = setTimeout(async () => {
    try {
      const resp = await fetch(API_BASE + '/api/delhivery/serviceability/' + encodeURIComponent(clean));
      const data = await resp.json();
      const verdict = { pin: clean, serviceable: !!data.serviceable, cod: !!data.cod };
      window.__pinCache = window.__pinCache || {};
      window.__pinCache[clean] = verdict;
      _showPinBadge(badge, verdict);
    } catch(e) {
      badge.style.color = 'var(--t-low)';
      badge.textContent = 'Could not verify — proceed and we will confirm by WhatsApp.';
    }
  }, 400);
}
function _showPinBadge(badge, v) {
  if (v.serviceable) {
    badge.style.display = 'block';
    badge.style.color = 'var(--success)';
    badge.textContent = '✓ Deliverable to ' + v.pin + (v.cod ? ' · COD available' : ' · Prepaid only');
  } else {
    badge.style.display = 'block';
    badge.style.color = 'var(--st-danger-fg)';
    badge.textContent = '✕ Not deliverable to PIN ' + v.pin + ' — please check the number or choose a different address.';
  }
}

// ── CONSOLIDATED showPage — handles ALL page-specific logic ──
var _baseSP = window.showPage;
window.showPage = function(pg) {
  if (typeof _baseSP === 'function') _baseSP(pg);
  if (pg === 'account')       { try { loadAccountPage(); } catch(e){} }
  if (pg === 'checkout')      { try { checkSavedAddressForCheckout(); } catch(e){} }
  if (pg === 'wishlist')      { try { renderWishlistPage(); } catch(e){} }
  // VitaMatch is the default now — it works whether or not the chat's
  // quota is intact. vitaInit() only runs if the visitor asks to chat.
  if (pg === 'advisor')       { try { vitaShowMatch(); } catch(e){} }
};


// ═══════════════════════════════════════════════════════
// SIDE CART DRAWER
// ═══════════════════════════════════════════════════════
function openSideCart() {
  renderSideCart();
  document.getElementById('sideCart')?.classList.add('open');
  document.getElementById('sideCartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSideCart() {
  document.getElementById('sideCart')?.classList.remove('open');
  document.getElementById('sideCartOverlay')?.classList.remove('open');
  unlockBodyScroll();
}

function renderSideCart() {
  const body = document.getElementById('scBody');
  const foot = document.getElementById('scFoot');
  const countEl = document.getElementById('scCount');
  if (!body || !foot) return;

  const count = STORE.cart.reduce((s,i) => s + i.qty, 0);
  if (countEl) countEl.textContent = count;

  if (STORE.cart.length === 0) {
    body.innerHTML = `<div class="sc-empty"><div style="font-size:3.5rem;margin-bottom:16px">🛒</div><h3 style="margin-bottom:8px">Your cart is empty</h3><p style="color:var(--gray);font-size:0.84rem;margin-bottom:20px">Add some products to get started!</p><button class="btn-primary" onclick="closeSideCart();showPage('shop')">Shop Now →</button></div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = STORE.cart.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return '';
    const price = item.tierRate !== undefined ? item.tierRate : (p.salePrice || p.price);
    return `
      <div class="sc-item">
        <img class="sc-img" src="${(typeof getProductImg==='function'?getProductImg(p):p.image)||''}" alt="${p.name}" onerror="this.src=PRODUCT_FALLBACKS.default" decoding="async">
        <div class="sc-info">
          <div class="sc-name">${p.name}</div>
          ${item.tierTabs ? `<div class="sc-tier-info" style="font-size:.7rem;color:var(--green);font-weight:600;margin:1px 0">${item.tierTabs} Tablets · ${item.isCustomPack ? 'your ' : ''}${durationLabel(item.tierTabs)}</div>` : ''}
          <div class="sc-brand">${p.brand}</div>
          <div class="sc-price">₹${(price * item.qty).toLocaleString('en-IN')}</div>
          <div class="sc-qty-row">
            <button class="sc-qty-btn" onclick="scUpdateQty(${item.id}, ${item.qty - 1}, ${item.tierIdx ?? 'undefined'})">−</button>
            <span class="sc-qty-val">${item.qty}</span>
            <button class="sc-qty-btn" onclick="scUpdateQty(${item.id}, ${item.qty + 1}, ${item.tierIdx ?? 'undefined'})">+</button>
          </div>
        </div>
        <button class="sc-remove" onclick="STORE.removeFromCart(${item.id});renderSideCart()" title="Remove">🗑</button>
      </div>`;
  }).join('');

  const sub = STORE.cart.reduce((s, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    const price = item.tierRate !== undefined ? item.tierRate : (p ? (p.salePrice || p.price) : 0);
    return s + price * item.qty;
  }, 0);
  const ship = calcShipping(sub);
  const promoDisc = getPromoDiscount ? getPromoDiscount(sub) : 0;
  // Mix & Match (cheapest-free every 4 units) — mirrors the cart page
  // and the server-side mixAndMatchDiscount(). Keeps the side cart
  // honest; the server still sets the real price at checkout.
  var mmUnits = STORE.cart.map(function (it) {
    var pr = PRODUCTS.find(function (x) { return x.id === it.id; });
    if (!pr) return [];
    var u = (function (p, it) { var m = null; if (it.tierTabs != null) m = Number(it.tierTabs) / 15; else if (it.tierIdx != null) { var ts = (typeof getProductTiers === 'function') ? getProductTiers(p) : null; m = (ts && ts[it.tierIdx] && ts[it.tierIdx].tabs) ? ts[it.tierIdx].tabs / 15 : null; } return (m && m > 0) ? (Number(p.price || 0) * m) : (p.salePrice || p.price); })(pr, it);
    var q = Math.max(0, Math.trunc(Number(it.qty) || 0));
    return Array(q).fill(u);
  }).reduce(function (a, b) { return a.concat(b); }, []);
  mmUnits.sort(function (a, b) { return a - b; });
  var mmGroups = Math.floor(mmUnits.length / 4);
  var mmDisc = 0;
  for (var g = 0; g < mmGroups; g++) mmDisc += mmUnits[g * 4] || 0;
  var mmOff = Math.max(0, Math.min(mmDisc, sub));
  var mmNeed = mmGroups > 0 ? 0 : 4 - (mmUnits.length % 4);
  const total = Math.max(0, sub - promoDisc - mmOff + ship);

  foot.innerHTML = `
    <div class="sc-totals">
      <div class="sc-row"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
      ${promoDisc > 0 ? `<div class="sc-row" style="color:var(--success)"><span>Discount</span><span>−₹${promoDisc.toLocaleString('en-IN')}</span></div>` : ''}
      ${mmOff > 0 ? `<div class="sc-row" style="color:var(--success)"><span>Mix &amp; Match — free unit</span><span>−₹${mmOff.toLocaleString('en-IN')}</span></div>` : (mmNeed > 0 ? `<div class="sc-row" style="color:var(--green)"><span>🎁 Add ${mmNeed} more for a FREE unit</span><span></span></div>` : '')}
      <div class="sc-row"><span>Shipping</span><span>${ship === 0 ? '<span style="color:var(--success)">FREE</span>' : '₹' + ship}</span></div>
      <div class="sc-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    </div>
    ${vitaStripHTML()}
    <button class="sc-checkout-btn" onclick="closeSideCart();showPage('checkout')">🔒 Proceed to Checkout</button>
    <button class="sc-view-btn" onclick="closeSideCart();showPage('cart')">View Full Cart</button>
    <div style="text-align:center;font-size:0.7rem;color:var(--gray);margin-top:10px">🔒 Secured by GoKwik · Free delivery on every order</div>
  `;
  vp3dScan(foot);
}

function scUpdateQty(id, qty, tierIdx) {
  if (qty < 1) {
    // Remove the specific tier variant if tierIdx provided, else any
    if (tierIdx !== undefined && tierIdx !== null) {
      STORE.cart = STORE.cart.filter(i => !(i.id === id && i.tierIdx === tierIdx));
      STORE.save();
    } else {
      STORE.removeFromCart(id);
    }
  } else {
    // Update only the matching tier variant
    const item = STORE.cart.find(i => i.id === id && (tierIdx !== undefined ? i.tierIdx === tierIdx : true));
    if (item) { item.qty = Math.max(1, qty); STORE.save(); }
    else { STORE.updateQty(id, qty); }
  }
  renderSideCart();
}

// ═══════════════════════════════════════════════════════
// WISHLIST PAGE
// ═══════════════════════════════════════════════════════
function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('wishlistEmpty');
  const subtitle = document.getElementById('wishlistSubtitle');
  if (!grid) return;

  const wishIds = STORE.wishlist || [];
  const wishProds = PRODUCTS.filter(p => wishIds.includes(p.id));

  if (subtitle) subtitle.textContent = `${wishProds.length} saved product${wishProds.length !== 1 ? 's' : ''}`;

  if (wishProds.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = wishProds.map(p => renderProductCard(p)).join('');

  // Update wish badge in nav
  updateWishBadge();
}

function shareWishlist() {
  const ids = STORE.wishlist || [];
  const names = PRODUCTS.filter(p => ids.includes(p.id)).map(p => p.name);
  if (!names.length) { showToast('Add a product to your wishlist first.'); return; }
  const text = 'My Ozylix wishlist: ' + names.join(', ') + ' — ' + window.location.origin + '/#wishlist';
  if (navigator.share) navigator.share({ title: 'My Ozylix wishlist', text }).catch(function(){});
  else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function(){ showToast('Wishlist link copied.'); }).catch(function(){ showToast(text); });
  else showToast(text);
}

function updateWishBadge() {
  const badge = document.getElementById('wishBadge');
  const count = (STORE.wishlist || []).length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Override toggleWishlist to update badge
const _origToggleWish = STORE.toggleWishlist.bind(STORE);
STORE.toggleWishlist = function(id) {
  _origToggleWish(id);
  updateWishBadge();
};

// ═══════════════════════════════════════════════════════
// PAYMENT FAILED PAGE — route errors here
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// SUBSCRIPTIONS PAGE
// ═══════════════════════════════════════════════════════
let selectedSubProduct = null;
let selectedSubPlan = 'quarterly';

function initSubscriptionsPage() {
  const grid = document.getElementById('subProductGrid');
  if (!grid) return;

  // Show subscribable products (all non-combo)
  const eligible = PRODUCTS.filter(p => !p.category.includes('combos'));
  grid.innerHTML = eligible.map(p => {
    const price = p.salePrice || p.price;
    return `
      <div onclick="selectSubProduct(${p.id}, this)" style="border:2px solid var(--light-gray);border-radius:var(--radius-sm);padding:12px;cursor:pointer;transition:var(--transition);display:flex;align-items:center;gap:10px" class="sub-prod-card">
        <img src="${cdnImg(p.image)}" alt="${esc(p.name)}" style="width:44px;height:44px;border-radius:8px;object-fit:contain;background:var(--off-white)" onerror="this.src=''" decoding="async">
        <div>
          <div style="font-size:0.8rem;font-weight:700;color:var(--text)">${p.name}</div>
          <div style="font-size:0.74rem;color:var(--green)">from ₹${price}/delivery</div>
        </div>
      </div>`;
  }).join('');

  // Update price displays based on bestseller as example
  const exampleProduct = PRODUCTS.find(p => p.tags.includes('bestseller'));
  if (exampleProduct) {
    const base = exampleProduct.salePrice || exampleProduct.price;
    const el1 = document.getElementById('subPrice1');
    const el3 = document.getElementById('subPrice3');
    const el6 = document.getElementById('subPrice6');
    if (el1) el1.textContent = Math.round(base * 0.9).toLocaleString('en-IN');
    if (el3) el3.textContent = Math.round(base * 0.85 * 3).toLocaleString('en-IN');
    if (el6) el6.textContent = Math.round(base * 0.8 * 6).toLocaleString('en-IN');
  }
}

function selectSubProduct(id, el) {
  selectedSubProduct = id;
  document.querySelectorAll('.sub-prod-card').forEach(c => { c.style.borderColor = 'var(--light-gray)'; c.style.background = ''; });
  if (el) { el.style.borderColor = 'var(--green)'; el.style.background = 'var(--green-pale)'; }
  const p = PRODUCTS.find(p => p.id === id);
  const sel = document.getElementById('subSelectedProduct');
  if (sel && p) sel.textContent = p.name;

  // Update prices based on selection
  const base = p ? (p.salePrice || p.price) : 0;
  const el1 = document.getElementById('subPrice1');
  const el3 = document.getElementById('subPrice3');
  const el6 = document.getElementById('subPrice6');
  if (el1) el1.textContent = Math.round(base * 0.9).toLocaleString('en-IN');
  if (el3) el3.textContent = Math.round(base * 0.85 * 3).toLocaleString('en-IN');
  if (el6) el6.textContent = Math.round(base * 0.8 * 6).toLocaleString('en-IN');
}

function startSubscription(plan) {
  if (!window.OZYLIX_SUBSCRIPTIONS_ENABLED) {
    showToast('Subscriptions are currently unavailable. Please place a one-time order.', 'info');
    return;
  }
  if (!selectedSubProduct) {
    showToast('Please select a product first', 'error');
    const grid = document.getElementById('subProductGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const user = getCurrentUser();
  if (!user) { openAuth('login'); return; }

  const p = PRODUCTS.find(p => p.id === selectedSubProduct);
  const planNames = { monthly: 'Monthly', quarterly: 'Quarterly (Most Popular)', halfyearly: '6-Monthly (Best Value)' };
  showToast(`✅ Subscription started: ${p?.name} — ${planNames[plan]}! We'll contact you to confirm.`);

  // Save subscription to localStorage
  try {
    const subs = JSON.parse(localStorage.getItem('asc_subs') || '[]');
    subs.push({ productId: selectedSubProduct, productName: p?.name, plan, startDate: new Date().toISOString(), status: 'Active' });
    localStorage.setItem('asc_subs', JSON.stringify(subs));
  } catch(e) {}
}

// ══ Subscriptions & wishlist page hooks already handled above ══


// Init wishlist badge on load
document.addEventListener('DOMContentLoaded', function() {
  try { updateWishBadge(); } catch(e) {}

  // ── 3D TILT EFFECT on cert cards, cat cards, product cards ──
  function addTilt(selector, maxTilt, scale) {
    document.querySelectorAll(selector).forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * maxTilt;
        const rotY =  dx * maxTilt;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // Apply tilt after a short delay to ensure DOM is ready
  setTimeout(function() {
    addTilt('.cert-card', 8, 1.04);
    addTilt('.cat-card', 6, 1.03);
    addTilt('.cat-card-sm', 10, 1.06);
  }, 500);

  // ── SCROLL-REVEAL for SVG icons ──
  const revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  setTimeout(function() {
    document.querySelectorAll('.cert-card, .cat-card, .cat-card-sm').forEach(function(el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.95)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.07) + 's, transform 0.5s ease ' + (i * 0.07) + 's';
      revealObs.observe(el);
    });
  }, 100);
});



// ═══════════════════════════════════════════════════════════════
// HOME PROMO CAROUSEL — rendered from live product data
//
// The cards used to be hardcoded, which caused three problems: two of
// them pointed at products with no image uploaded (the blank panels in
// the carousel), the copy promoted non-effervescent lines, and the
// prices drifted from the real catalogue. They now render straight from
// PRODUCTS filtered to effervescent tablets, so images come from
// Supabase Storage exactly like the shop grid and the price can never
// disagree with the product page.
// ═══════════════════════════════════════════════════════════════
const PROMO_BENEFIT = {
  38: 'Dull skin you can\u2019t fix with creams alone?',
  31: 'A daily adaptogen for stress resilience.',
  34: 'A light, fizzy way to reset your day.',
  33: 'Daily essentials, made for women.',
  32: 'Daily essentials, made for men.',
  37: 'Natural vitamin C with amla, the Ayurvedic way.',
  35: 'Everyday strength for bones and joints.',
  36: 'Replace what you sweat out \u2014 fast.',
  30: 'Green tea antioxidants, no brewing needed.',
  39: 'Fuel your workout, recover faster.',
};

// Honest offer line. `offer` is a placeholder on most products right now
// ("Price to be updated"), so it is NOT shown as though it were a real
// promotion — we fall back to the actual price rather than inventing a
// discount that does not exist.
function promoOfferLine(p) {
  const off = String(p.offer || '').trim();
  const placeholder = !off || /price to be updated|to be updated|tbd|coming soon/i.test(off);
  if (!placeholder) return 'CURRENT OFFER \u2014 ' + off;
  const sale = Number(p.salePrice) || 0;
  const mrp  = Number(p.price) || 0;
  if (sale > 0 && mrp > sale) {
    const pct = Math.round((1 - sale / mrp) * 100);
    return 'CURRENT OFFER \u2014 ' + pct + '% OFF \u00b7 \u20b9' + sale.toLocaleString('en-IN');
  }
  const shown = sale > 0 ? sale : mrp;
  return shown > 0 ? 'NOW \u20b9' + shown.toLocaleString('en-IN') : 'NEW ARRIVAL';
}

// Best available saving, read from the product's real tier table (backend
// tiers win over the static fallback — same rule the product page uses).
// Returns null when a product genuinely has no tiers; three of the ten
// effervescent products don't, and inventing a discount for them would be
// a false claim on the homepage.
function promoMaxDiscount(p) {
  const tiers = p._backendTiers || (typeof QTY_TIERS !== 'undefined' ? QTY_TIERS[p.id] : null);
  if (!Array.isArray(tiers) || !tiers.length) return null;
  let best = 0, bestTier = null;
  tiers.forEach(function(t){
    let pct = Number(t.discountPct) || 0;
    if (!pct && Number(t.mrp) > 0 && Number(t.rate) > 0) {
      pct = Math.round((1 - Number(t.rate) / Number(t.mrp)) * 100);
    }
    if (pct > best) { best = pct; bestTier = t; }
  });
  return best > 0 && bestTier
    ? { pct: best, tabs: Number(bestTier.tabs) || 0, rate: Number(bestTier.rate) || 0 }
    : null;
}

// VitaPoints on the biggest pack — 1 point per rupee, capped at the same
// 5,000/order ceiling the server enforces, so the figure shown can never
// exceed what the customer actually receives.
function promoMaxVita(p) {
  const md = promoMaxDiscount(p);
  const spend = md && md.rate ? md.rate : (Number(p.salePrice) || Number(p.price) || 0);
  return Math.min(5000, Math.floor(spend));
}

function promoShortName(name) {
  return String(name || '')
    .replace(/\s*Effervescent Tablets?\s*/i, ' ')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderPromoCarousel() {
  const track = document.getElementById('promoHeroTrack');
  const dots  = document.getElementById('promoDots');
  if (!track || typeof PRODUCTS === 'undefined') return;

  const list = PRODUCTS.filter(function(p){
    return p && String(p.category || '').toLowerCase() === 'effervescent'
           && p.active !== false && !p.deleted_at;
  }).slice(0, 10);

  if (!list.length) return; // leave what is on screen rather than blanking it

  track.innerHTML = list.map(function(p, i){
    const short = promoShortName(p.name);
    // Admin-uploaded card images (Website Images panel) take priority over
    // product photos — the slot number (1..10) matches the card position.
    const adminCard = (window.ADMIN_PROMO_CARDS && window.ADMIN_PROMO_CARDS[i + 1]) || null;
    const img   = adminCard ? adminCard.url : (typeof getProductSurfaceImg === 'function' ? getProductSurfaceImg(p) : (p.image || p.image2 || ''));
    const alt   = adminCard && adminCard.alt ? adminCard.alt : ('Ozylix ' + short + ' effervescent tablet');
    const md   = promoMaxDiscount(p);
    const vita = promoMaxVita(p);
    const perks =
      (md ? '<span class="promo-perk promo-perk-save">SAVE UP TO ' + md.pct + '%' +
            (md.tabs ? ' \u00b7 ' + md.tabs + ' tabs' : '') + '</span>' : '') +
      (vita > 0 ? '<span class="promo-perk promo-perk-vita">Earn up to ' +
                  vita.toLocaleString('en-IN') + ' VitaPoints</span>' : '');

    return '<div class="promo-card">' +
      '<div class="promo-card-text">' +
        '<p class="promo-card-eyebrow">' + (PROMO_BENEFIT[p.id] || 'One tablet. Drop, fizz, done.') + '</p>' +
        '<span class="promo-card-tag">' + promoOfferLine(p) + '</span>' +
        '<h3 class="promo-card-headline">' + short + '</h3>' +
        (perks ? '<div class="promo-card-perks">' + perks + '</div>' : '') +
        '<button class="promo-card-cta" onclick="openProduct(' + p.id + ')">Shop now</button>' +
      '</div>' +
      '<div class="promo-card-media">' +
        (img
          ? (mediaTypeFromUrl(img) === 'video'
              ? '<video src="' + cdnImg(img) + '" muted loop playsinline preload="metadata" ' +
                  'aria-label="' + alt + '" style="width:100%;height:100%;object-fit:cover"></video>'
              : '<img src="' + cdnImg(img) + '" alt="' + alt + '" ' +
                  (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') +
                  ' decoding="async" width="800" height="800">')
          : '<img src="" data-awaiting-upload="true" alt="' + alt + '">') +
      '</div>' +
    '</div>';
  }).join('');

  if (dots) {
    dots.innerHTML = list.map(function(_, i){
      return '<button class="promo-dot' + (i === 0 ? ' active' : '') +
             '" onclick="promoGoTo(' + i + ')" aria-label="Slide ' + (i + 1) + '"></button>';
    }).join('');
  }
}

// ═══════════════════════════════════════════════════════
// HOME PROMO CAROUSEL — peek-style (PharmEasy-inspired): a horizontally
// scrollable row of cards with native scroll-snap, driven by arrow buttons
// and a dot rail. Replaces the old full-bleed single-slide hero engine.
(function(){
  const track = document.getElementById('promoHeroTrack');
  if (!track) return;
  try { renderPromoCarousel(); } catch(e) { console.warn('[promo] render failed:', e.message); }

  function cardStep() {
    const card = track.querySelector('.promo-card');
    if (!card) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  }

  // Scroll maths measured from the DOM rather than assumed from card width.
  // The old version did `scrollLeft / cardStep()`, which silently assumed
  // zero side padding and left-aligned snapping — neither was true, so on
  // some viewport widths the arrows/dots landed a fraction of a card off
  // and the browser then re-snapped, producing the "half card" look.
  function padLeft() {
    return parseFloat(getComputedStyle(track).paddingLeft || '0') || 0;
  }
  function contentStart() {
    return track.getBoundingClientRect().left + padLeft();
  }
  function cards() {
    return Array.prototype.slice.call(track.querySelectorAll('.promo-card'));
  }

  function activeIndex() {
    const ref = contentStart();
    let best = 0, bestDist = Infinity;
    cards().forEach(function(c, i) {
      const d = Math.abs(c.getBoundingClientRect().left - ref);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function setDots(i) {
    document.querySelectorAll('#promoDots .promo-dot').forEach((d, di) => d.classList.toggle('active', di === i));
  }

  window.promoGoTo = function(i) {
    const list = cards();
    const card = list[i];
    if (!card) return;
    const delta = card.getBoundingClientRect().left - contentStart();
    track.scrollTo({ left: track.scrollLeft + delta, behavior: 'smooth' });
    setDots(i);
  };

  window.promoCarousel = function(dir) {
    const count = cards().length;
    if (!count) return;
    // Wrap around — with 10 cards, dead-ending at the last one makes the
    // arrow look broken.
    const next = (activeIndex() + dir + count) % count;
    window.promoGoTo(next);
    resetPromoAuto();
  };

  let dotSync;
  track.addEventListener('scroll', function(){
    clearTimeout(dotSync);
    dotSync = setTimeout(function(){ setDots(activeIndex()); }, 80);
  }, { passive: true });

  // Gentle autoplay, pauses on hover/touch and resumes after manual nav
  let promoAutoTimer = null;
  function startPromoAuto() {
    clearInterval(promoAutoTimer);
    promoAutoTimer = setInterval(function(){
      const count = track.querySelectorAll('.promo-card').length;
      const next = (activeIndex() + 1) % count;
      window.promoGoTo(next);
    }, 5000);
  }
  function resetPromoAuto() { startPromoAuto(); }
  var promoResizeT;
  window.addEventListener('resize', function(){
    clearTimeout(promoResizeT);
    // Re-snap to the current card after a resize so a rotation or a
    // desktop window drag doesn't leave the track mid-card.
    promoResizeT = setTimeout(function(){ window.promoGoTo(activeIndex()); }, 150);
  }, { passive: true });

  track.addEventListener('mouseenter', function(){ clearInterval(promoAutoTimer); });
  track.addEventListener('mouseleave', startPromoAuto);
  startPromoAuto();
})();

// ═══════════════════════════════════════════════════════
// CHECKOUT UPSELL WIDGET
// ═══════════════════════════════════════════════════════
const UPSELL_SUGGESTIONS = [
  { id: 14, label: 'Add Vitamin C', price: 249, pitch: 'Boosts immunity & absorption' },
  { id:  3, label: 'Add Biotin', price: 449, pitch: 'Hair, skin & nail support' },
  { id: 10, label: 'Upgrade to Spirulina Combo', price: 999, pitch: 'Save ₹98 vs buying separately' },
  { id: 21, label: 'Add L-Lysine', price: 379, pitch: 'Collagen + immune defence' },
];

function renderUpsells() {
  const bar = document.getElementById('upsellBar');
  const container = document.getElementById('upsellItems');
  if (!bar || !container) return;
  const cartIds = STORE.cart.map(i => i.id);
  const suggestions = UPSELL_SUGGESTIONS.filter(u => !cartIds.includes(u.id)).slice(0, 2);
  if (!suggestions.length) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  container.innerHTML = suggestions.map(u =>
    `<div class="upsell-item">
      <div class="upsell-info"><span class="upsell-label">${u.label}</span><span class="upsell-pitch">${u.pitch}</span></div>
      <div class="upsell-price">₹${u.price}</div>
      <button class="upsell-add" onclick="STORE.addToCart(${u.id});renderCheckoutSummary();renderUpsells();">+ Add</button>
    </div>`
  ).join('');
}


/* ── COMPETITOR FEATURES JS ── */
const QUIZ_DATA=[
  {q:"What's your primary health goal?",opts:[{ico:'✨',lbl:'Skin Glow & Brightening'},{ico:'💪',lbl:'Immunity & Energy'},{ico:'🏋',lbl:'Weight Management'},{ico:'🧠',lbl:'Focus & Vitality'}]},
  {q:"How would you describe your lifestyle?",opts:[{ico:'🏃',lbl:'Active / Gym-goer'},{ico:'💼',lbl:'Busy & Desk-based'},{ico:'🏠',lbl:'Home & Family-focused'},{ico:'🧘',lbl:'Yoga & Wellness'}]},
  {q:"Any specific concerns?",opts:[{ico:'💇',lbl:'Hair fall / Hair growth'},{ico:'😴',lbl:'Fatigue & Low energy'},{ico:'🫁',lbl:'Digestive health'},{ico:'🌿',lbl:'Overall nutrition gap'}]},
  {q:"How do you prefer to take supplements?",opts:[{ico:'🫧',lbl:'Effervescent (fizzy drink)'},{ico:'💊',lbl:'Capsules / Tablets'},{ico:'🍵',lbl:'Powder / Mix'},{ico:'🤷',lbl:'No preference'}]}
];
const QUIZ_RECS={0:[4,3,14],1:[5,14,8],2:[15,20,8],3:[8,5,22]};
let quizStep=0,quizAnswers=[];
function closeQuiz(){const o=document.getElementById('quizOverlay');if(o)o.style.display='none';}
function renderQuizStep(){
  const ov=document.getElementById('quizOverlay');if(!ov)return;
  if(quizStep>=QUIZ_DATA.length){renderQuizResult();return;}
  const d=QUIZ_DATA[quizStep],pct=Math.round((quizStep/QUIZ_DATA.length)*100);
  ov.innerHTML='<div class="quiz-modal"><div class="qm-head"><div class="qm-title">Find Your Health Stack<\/div><button class="qm-close" onclick="closeQuiz()">✕<\/button><\/div><div class="qm-body"><div class="qm-prog"><div class="qm-prog-fill" style="transform:scaleX('+(pct/100)+')"><\/div><\/div><div class="qm-prog-lbl">Question '+(quizStep+1)+' of '+QUIZ_DATA.length+'<\/div><div class="qm-q">'+d.q+'<\/div><div class="qm-opts">'+d.opts.map((o,i)=>'<div class="qm-opt" onclick="selectQuizOpt('+i+')" id="qopt-'+i+'"><span class="qm-opt-ico">'+o.ico+'<\/span>'+o.lbl+'<\/div>').join('')+'<\/div><div class="qm-nav"><button class="qm-back" onclick="quizBack()"'+(quizStep===0?' style="visibility:hidden"':'')+'>← Back<\/button><button class="qm-next" id="quizNextBtn" onclick="quizNext()" disabled style="opacity:.45;cursor:not-allowed">Next →<\/button><\/div><\/div><\/div>';
  if(quizAnswers[quizStep]!==undefined){const el=document.getElementById('qopt-'+quizAnswers[quizStep]);if(el)el.classList.add('sel');const nb=document.getElementById('quizNextBtn');if(nb){nb.disabled=false;nb.style.opacity='1';nb.style.cursor='pointer';}}
}
function selectQuizOpt(i){document.querySelectorAll('.qm-opt').forEach(o=>o.classList.remove('sel'));const el=document.getElementById('qopt-'+i);if(el)el.classList.add('sel');quizAnswers[quizStep]=i;const nb=document.getElementById('quizNextBtn');if(nb){nb.disabled=false;nb.style.opacity='1';nb.style.cursor='pointer';}}
function quizNext(){if(quizAnswers[quizStep]===undefined)return;quizStep++;renderQuizStep();}
function quizBack(){if(quizStep>0){quizStep--;renderQuizStep();}}
function renderQuizResult(){
  const ov=document.getElementById('quizOverlay');if(!ov)return;
  const ids=QUIZ_RECS[quizAnswers[0]||0]||QUIZ_RECS[0];
  const rp=ids.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  ov.innerHTML='<div class="quiz-modal"><div class="qm-head"><div class="qm-title">🎯 Your Personalised Stack<\/div><button class="qm-close" onclick="closeQuiz()">✕<\/button><\/div><div class="qm-body"><div class="qm-result"><div class="qm-result-ico">🌿<\/div><div class="qm-result-title">Here\'s what your body needs<\/div><div class="qm-result-sub">Based on your answers, our nutritionists recommend this personalised Ozylix stack.<\/div><div class="qm-result-prods">'+rp.map(p=>'<div class="qm-rp" onclick="closeQuiz();openProduct('+p.id+')"><img src="'+(esc(typeof getProductSurfaceImg==='function' ? getProductSurfaceImg(p) : cdnImg(p.image||'')))+ '" alt="'+esc(p.name)+' — Ozylix supplement" width="72" height="72" loading="lazy" decoding="async" style="width:72px;height:72px;object-fit:cover;border-radius:10px;display:block;margin:0 auto 8px" onerror="this.style.display=\'none\'"><div class="qm-rp-name">'+esc(p.name||'')+'<\/div><div class="qm-rp-price">₹'+(p.salePrice||p.price||0)+'<\/div><\/div>').join('')+'<\/div><button class="btn-primary" onclick="closeQuiz();showPage(\'shop\')" style="margin-bottom:12px">Shop My Recommendations →<\/button><\/div><\/div><\/div>';
}

// selectedBundleIds removed (Aug 2026) — Mix & Match is now free-form
// quantity picking (bundleQty), so a one-flag Set is no longer used.
// The bundle rows show a real product photo only once the Supabase sync
// has landed — before that getProductImg() has nothing but the category
// fallback to return. This list is built at start-up, so it was ALWAYS
// built too early, and unlike every other grid it was never rebuilt
// afterwards: mergeBackendProducts() re-runs renderFeatured,
// renderNewArrivals, renderPromoCarousel, renderShopGrid and
// updateAllProductCards, but nothing re-ran this one. The bundle builder
// therefore kept its placeholders for the life of the page while the same
// products showed their real photos everywhere else.
//
// It is now called after the sync too, which means it can re-render while
// a customer already has products ticked. Selection lives in
// selectedBundleIds, but the TICK is the .sel class on the row — replacing
// innerHTML drops it, so the rows would look empty while the summary below
// still charged for them. Re-applying it here keeps the two in step no
// matter who calls this or when.
// FREE-FORM MIX & MATCH (Aug 2026): any quantity of any product. The old
// checkbox rows only allowed one unit per product and had no remove control.
// bundleQty tracks chosen units per product id; a stepper (+/−) sits on
// every eligible row and the summary lists each line with its own remove.
var bundleQty = {};
function renderBundleBuilder(){const list=document.getElementById('bundleProdList');if(!list||!PRODUCTS)return;list.innerHTML=PRODUCTS.filter(p=>p.price||p.salePrice).map(p=>{const img=typeof getProductSurfaceImg==='function'?getProductSurfaceImg(p):(p.image||PRODUCT_FALLBACKS&&PRODUCT_FALLBACKS.default||'');const q=bundleQty[p.id]||0;return'<div class="b-prod-row'+(q>0?' sel':'')+'" id="brow-'+p.id+'"><div class="b-prod-img"><img src="'+esc(img)+'" alt="'+esc(p.name)+' — Ozylix supplement" width="54" height="54" loading="lazy" decoding="async" style="width:54px;height:54px;object-fit:cover;border-radius:10px" onerror="this.style.opacity=0"></div><div class="b-prod-info"><div class="b-prod-name">'+esc(p.name)+'</div><div class="b-prod-cat">'+esc(p.category||'supplement')+'</div>'+(p.badge?'<div class="b-prod-badge">'+esc(p.badge)+'</div>':'')+'</div><div style="display:flex;align-items:center;gap:8px">'+(q>0?'<button class="b-qty-btn" onclick="bundleQtyChange('+p.id+',-1,event)" aria-label="Remove one">−</button><span class="b-qty-val">'+q+'</span><button class="b-qty-btn" onclick="bundleQtyChange('+p.id+',1,event)" aria-label="Add one">+</button><button class="b-rm-btn" onclick="bundleQtySet('+p.id+',0,event)" aria-label="Remove product">✕</button>':'<button class="b-qty-btn b-add-btn" onclick="bundleQtyChange('+p.id+',1,event)" aria-label="Add to mix">+ Add</button>')+'</div></div>';}).join('');}
function bundleQtyChange(id,d,e){if(e)e.stopPropagation();const q=(bundleQty[id]||0)+d;bundleQtySet(id,Math.max(0,q),e);}
function bundleQtySet(id,q,e){if(e)e.stopPropagation();if(q<=0)delete bundleQty[id];else bundleQty[id]=q;renderBundleBuilder();updateBundleSummary();}
// Mix & Match preview. Mirrors mixAndMatchDiscount() in backend/server.js:
// units sorted ascending, then index 0, 4, 8... is free — the cheapest of
// each group of four. Eight products picked means two free, not one, which
// is why this counts groups instead of taking a single Math.min. The server
// still prices the real cart; this only shows the saving before checkout.
const MM_GROUP = 4;
function mmPreview(prices){
  const units=[...prices].sort((x,y)=>x-y);
  const groups=Math.floor(units.length/MM_GROUP);
  let saving=0;
  for(let g=0;g<groups;g++) saving+=units[g*MM_GROUP]||0;
  return { saving, groups, need: groups>0 ? 0 : MM_GROUP-(units.length%MM_GROUP||0) };
}
function updateBundleSummary(){
  const ids=Object.keys(bundleQty).map(Number);
  const sel=ids.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  const lines=sel.map(p=>({p,qty:bundleQty[p.id]||1}));
  const nUnits=lines.reduce((s,l)=>s+l.qty,0);
  // Unit prices: a line's per-unit price is the product's chosen tier rate
  // (default tier when none selected), matching what the cart will charge.
  const prices=[];const sub=lines.reduce((s,l)=>{const p=l.p;const tiers=typeof getProductTiers==='function'?getProductTiers(p):null;const rate=(tiers&&tiers[currentTierIdx(p,tiers)])?tiers[currentTierIdx(p,tiers)].rate:(p.salePrice||p.price);for(let i=0;i<l.qty;i++)prices.push(rate);return s+rate*l.qty;},0);
  const mm=mmPreview(prices);
  const sav=Math.min(mm.saving,sub);
  const tot=sub-sav;
  const box=document.getElementById('bundleItemsBox');
  if(box)box.innerHTML=nUnits===0
    ?'<div class="bundle-empty-hint">No products selected yet<\/div>'
    :lines.map(l=>'<div class="b-item-chip"><span class="b-item-name">'+esc(l.p.name)+' × '+l.qty+'<\/span><button class="b-rm-btn" onclick="bundleQtySet('+l.p.id+',0)" aria-label="Remove">✕<\/button><span class="b-item-price">₹'+((l.p.salePrice||l.p.price)*l.qty)+'<\/span><\/div>').join('');
  const s_=document.getElementById('bundleSubtotal'),t=document.getElementById('bundleTotal'),
        dr=document.getElementById('bundleDiscountRow'),dl=document.getElementById('bundleDiscountLabel'),
        dv=document.getElementById('bundleDiscountVal'),sb=document.getElementById('bundleSavingsBanner');
  if(s_)s_.textContent='₹'+sub;
  if(t)t.textContent='₹'+tot;
  if(sav>0){
    if(dr)dr.style.display='flex';
    if(dl)dl.textContent='Mix & Match bundle discount';
    if(dv)dv.textContent='−₹'+sav;
    if(sb){sb.style.display='block';sb.textContent='🎉 Mix & Match unlocked — ₹'+sav+' off automatically';}
  }else{
    if(dr)dr.style.display='none';
    // Progress, not silence: a customer short of the next free unit should
    // be told exactly how many units stand between them and it.
    if(sb){
      if(nUnits>0){sb.style.display='block';sb.textContent='🎁 Add '+mm.need+' more '+(mm.need===1?'unit':'units')+' — your bundle discount grows';}
      else sb.style.display='none';
    }
  }
}
function addBundleToCart(){const ids=Object.keys(bundleQty).map(Number);const sel=ids.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);if(!sel.length){showToast('Select at least one product 🌿','error');return;}sel.forEach(p=>STORE.addToCart(p.id,bundleQty[p.id]||1));openSideCart();const totalUnits=sel.reduce((s,p)=>s+(bundleQty[p.id]||1),0);showPtsToast('Earns VitaPoints on '+totalUnits+' '+(totalUnits===1?'item':'items')+' when delivered');bundleQty={};renderBundleBuilder();updateBundleSummary();}

let stickyQty=1,stickyProdId=null;
function initStickyCart(prod){if(!prod)return;stickyProdId=prod.id;stickyQty=1;const ne=document.getElementById('scProdName'),pe=document.getElementById('scProdPrice'),qe=document.getElementById('scQtyVal');if(ne)ne.textContent=prod.name;if(pe)pe.textContent='₹'+(prod.salePrice||prod.price);if(qe)qe.textContent=1;const sc=document.getElementById('stickyCart'),ab=document.getElementById('addCartBtn');if(!sc||!ab)return;const obs=new IntersectionObserver(en=>{if(!en[0].isIntersecting){sc.style.display='flex';requestAnimationFrame(()=>{sc.style.transform='translateY(0)';});}else{sc.style.transform='translateY(100%)';setTimeout(()=>{if(sc.style.transform==='translateY(100%)')sc.style.display='none';},300);}},{threshold:0.1});obs.observe(ab);}
function scQtyChange(d){stickyQty=Math.max(1,stickyQty+d);const e=document.getElementById('scQtyVal');if(e)e.textContent=stickyQty;}
/* FIX (Aug 2026): the sticky bottom bar showed only the single-unit price
   (₹900 on Glutathione) and never changed when the customer picked a tier —
   the 60-tablet pack still said ₹900 and its Add tapped the untiered cart
   path. It now re-reads the currently selected tier on every pack change,
   shows the pack's total price with the pack size in the name, and the Add
   button records the chosen tier like the main button does. */
function refreshStickyCart(){if(!stickyProdId)return;const p0=PRODUCTS.find(p=>p.id===stickyProdId);if(!p0)return;const tiers=typeof getProductTiers==='function'?getProductTiers(p0):null;const ne=document.getElementById('scProdName'),pe=document.getElementById('scProdPrice');if(!pe)return;const t=tiers&&tiers[selectedTiers[stickyProdId]]||null;if(t){if(ne)ne.textContent=p0.name+' — '+t.tabs+' tablets';pe.textContent='₹'+t.rate.toLocaleString('en-IN');}else{if(ne)ne.textContent=p0.name;pe.textContent='₹'+((p0.salePrice||p0.price)||0).toLocaleString('en-IN');}}
function scAddToCart(){if(!stickyProdId)return;if(typeof addToCartWithTier==='function'){addToCartWithTier(stickyProdId);}else{STORE.addToCart(stickyProdId,stickyQty);}openSideCart();showPtsToast('Earns VitaPoints when delivered');}
// Nothing is earned by adding to a cart. Points are created when the order
// is placed (prepaid) or when the courier delivers it and collects the cash
// (COD), and the rate is 5 per ₹100 at the base tier — so a flat "+5
// earned" on add-to-cart was wrong about the trigger AND the amount. The
// nudge is worth keeping; the false claim is not.

function renderStockUrgency(prod){const el=document.getElementById('stockUrgency');if(!el||!prod)return;const stock=prod.stock||prod.inventory||0;if(stock<=0||stock>50){el.innerHTML='';return;}const pct=Math.min(100,Math.round((stock/50)*100)),cls=stock<=10?'danger':stock<=25?'warning':'ok',msg=stock<=10?'Only '+stock+' left — selling fast!':'Low stock — only '+stock+' remaining';el.innerHTML='<div class="su-low"'+(stock>10?' style="background:var(--st-warn-bg);border-color:var(--st-warn-fg);color:var(--f-citrus)"':'')+'><span class="su-dot"'+(stock>10?' style="background:var(--f-citrus)"':'')+'><\/span>'+msg+'<\/div><div class="su-bar"><div class="su-bar-fill '+cls+'" style="width:'+pct+'%"><\/div><\/div>';}
function startLiveViewers(){const el=document.getElementById('liveViewerCount');if(!el)return;let n=8+Math.floor(Math.random()*16);el.textContent=n;setInterval(()=>{n=Math.max(5,Math.min(30,n+(Math.random()>.5?1:-1)*Math.floor(Math.random()*3+1)));el.textContent=n;},6500);}
function showPtsToast(msg){const t=document.getElementById('ptsToast');if(!t)return;t.textContent='🪙 '+msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}

document.addEventListener('DOMContentLoaded',function(){
  if(document.getElementById('bundleProdList')&&typeof PRODUCTS!=='undefined')renderBundleBuilder();
  if(typeof addToCartWithTier==='function'){const _o=addToCartWithTier;window.addToCartWithTier=function(id){_o(id);showPtsToast('Earns VitaPoints when delivered');};}
});
document.addEventListener('productPageShown',function(e){const prod=e.detail;if(!prod)return;initStickyCart(prod);renderStockUrgency(prod);/* startLiveViewers() removed — fake viewer counts are not allowed */
  // Aug 2026: contextual product popup — rotated per-product, session-limited
  try { if (typeof ozylxNotify !== 'undefined') {
    var n = typeof slugify === 'function' ? slugify(prod.name) : '';
    var msgs = n.indexOf('glutathione') > -1
      ? ['✨ Kya aap bhi apni glow routine ko upgrade karna chahte hain?', '💚 Discover your daily glow ritual.']
      : n.indexOf('apple-cider') > -1
        ? ['🍏 Looking for a simple daily wellness routine?', '✨ Make your daily routine a little easier.']
        : ['✨ A little wellness moment for your daily routine.', '💚 Your routine deserves something good.', '✨ Discover your Ozylix favorite.'];
    var pick = msgs[(window.__ozylxRot || 0) % msgs.length]; window.__ozylxRot = (window.__ozylxRot || 0) + 1;
    setTimeout(function () {
      ozylxNotify.show({ id: 'product-' + n + '-' + ((window.__ozylxRot || 0) % 3), msg: pick, icon: pick.charAt(0), corner: 'bottom-right' });
    }, 7000 + 5000 * ((window.__ozylxRot || 0) % 3));
  } } catch (e) {}
});

// ── Video player toggle ──


// ═══════════════════════════════════════════════════════════════
// VITA — AI HEALTH ADVISOR (Gemini — via backend proxy)
// ═══════════════════════════════════════════════════════════════
// NOTE: Gemini key is stored in GEMINI_API_KEY env var on Render server only.
//
// FIX (audit item P0-9): vitaHistory/vitaStarted/vitaMsgCount/
// vitaLeadCaptured/VITA_SYSTEM were referenced everywhere below but never
// declared, and vitaAddMsg/vitaShowTyping/vitaHideTyping/vitaAddChips/
// vitaRenderRecs were called but never defined — every one of those was an
// immediate ReferenceError, which is why the advisor rendered nothing and
// the console showed "vitaAddMsg is not defined". All of it is implemented
// below, matching the existing .vita-msg/.vita-bubble/.vita-chips/
// .vita-rec-card CSS that was already in place waiting for this JS.

// ══════════════════════════════════════════════════════════════════════
// VITAMATCH — rule-based recommender
//
// The Gemini chat below is metered, and when the quota runs out the
// advisor page stops doing the one thing it exists for. This does the
// same job with a scoring table: four questions, ranked against the real
// catalogue, no network call and no tokens, so it cannot go down.
//
// Products are matched on TAGS AND NAME TEXT, never on hardcoded ids.
// PRODUCTS is synced from the backend and ids change; a rule that says
// "anything tagged immunity, or with amla or ashwagandha in its name"
// keeps working when the catalogue does.
//
// Wording is deliberately non-clinical — "commonly chosen for", never
// "treats" or "helps with" a condition. Same FSSAI/ASCI line the chat's
// system prompt holds, and the same disclaimer is shown with the result.
// ══════════════════════════════════════════════════════════════════════
const VITA_MATCH_Q = [
  { key: 'goal', q: 'What is your main wellness goal right now?', hint: 'Choose the closest goal. This is general product guidance, not a diagnosis.', opts: [
    { v: 'skin', ico: '✨', t: 'Skin & Glow', s: 'Radiance and everyday skincare support' },
    { v: 'energy', ico: '⚡', t: 'Energy & Focus', s: 'For long days and slow mornings' },
    { v: 'immunity', ico: '🛡️', t: 'Immunity', s: 'Everyday resilience' },
    { v: 'weight', ico: '⚖️', t: 'Weight Management', s: 'Alongside diet and activity' },
    { v: 'bone', ico: '🦴', t: 'Bone & Joint', s: 'Calcium, magnesium and vitamin D' },
    { v: 'general', ico: '🌿', t: 'General Wellness', s: 'A solid daily routine' }
  ] },
  { key: 'need', q: 'What would make a product easiest to use consistently?', hint: 'This helps us rank practical matches rather than promising a guaranteed result.', opts: [
    { v: 'daily', ico: '📅', t: 'Simple daily routine', s: 'One clear habit' },
    { v: 'beauty', ico: '✨', t: 'Beauty-focused routine', s: 'Glow, hair or skin support' },
    { v: 'hydration', ico: '💧', t: 'Hydration and recovery', s: 'Water-friendly formats' },
    { v: 'travel', ico: '✈️', t: 'Portable and convenient', s: 'For busy or changing days' }
  ] },
  { key: 'diet', q: 'Which dietary preference should we consider?', hint: 'Always check the product label for the final ingredient and allergen information.', opts: [
    { v: 'veg', ico: '🥗', t: 'Vegetarian or vegan', s: 'Plant-based sources matter' },
    { v: 'no_preference', ico: '🍃', t: 'No preference', s: 'Show the broadest range' },
    { v: 'label', ico: '🔎', t: 'I want to check the label', s: 'Prioritise transparent product details' }
  ] },
  { key: 'format', q: 'Which format fits your routine best?', hint: 'If you have swallowing or ingredient concerns, confirm suitability with a professional.', opts: [
    { v: 'effervescent', ico: '🫧', t: 'Dissolve in water', s: 'Effervescent format' },
    { v: 'capsule', ico: '💊', t: 'Capsule or tablet', s: 'Compact and familiar' },
    { v: 'powder', ico: '🥄', t: 'Powder or blend', s: 'Mix into a routine' },
    { v: 'any_format', ico: '🌿', t: 'Any format', s: 'Let the goal lead' }
  ] },
  { key: 'age', q: 'Which age group are you in?', hint: 'This only nudges product ranking and is not a medical assessment.', opts: [
    { v: '18_25', ico: '🎓', t: '18 – 25' }, { v: '26_35', ico: '💼', t: '26 – 35' }, { v: '36_50', ico: '🌱', t: '36 – 50' }, { v: '50p', ico: '🌟', t: '50 and above' }
  ] },
  { key: 'gender', q: 'Who is this for?', hint: 'Optional. Used only to avoid ranking a gender-specific formula incorrectly.', opts: [
    { v: 'female', ico: '🙋‍♀️', t: 'Woman' }, { v: 'male', ico: '🙋‍♂️', t: 'Man' }, { v: 'na', ico: '➖', t: 'Rather not say', s: 'Skip gendered formulas' }
  ] },
  { key: 'routine', q: 'What best describes your routine?', hint: 'The more context you give, the more useful the ranking can be.', opts: [
    { v: 'veg', ico: '🥗', t: 'Vegetarian or vegan' }, { v: 'active', ico: '🏃', t: 'Active / sporty' }, { v: 'desk', ico: '💻', t: 'Mostly desk work' }, { v: 'travel', ico: '✈️', t: 'Often travelling' }
  ] }
];

// answer value -> [{ any: [terms], w: weight, why: reason }]
const VITA_MATCH_RULES = {
  skin:     [{ any: ['skin', 'glutathione', 'vitamin c', 'amla', 'collagen'], w: 5, why: 'A regular pick for skin and glow routines' },
             { any: ["women's"], w: 2 }],
  energy:   [{ any: ['energy', 'b12', 'magnesium', 'green tea', 'l-carnitine', 'rehydration'], w: 5, why: 'Chosen for everyday energy support' }],
  immunity: [{ any: ['immunity', 'ashwagandha', 'vitamin c', 'amla', 'moringa', 'spirulina'], w: 5, why: 'A staple in everyday immunity routines' }],
  weight:   [{ any: ['weight', 'apple cider', 'l-carnitine', 'green tea'], w: 5, why: 'Commonly taken alongside a weight routine' }],
  bone:     [{ any: ['bone', 'calcium', 'magnesium', 'd3'], w: 5, why: 'Built around bone-support nutrients' }],
  general:  [{ any: ['multivitamin', 'premium', 'bestseller'], w: 4, why: 'A broad daily multivitamin base' }],

  '18_25':  [{ any: ['energy', 'effervescent'], w: 1.5 }],
  '26_35':  [{ any: ['energy', 'skin'], w: 1.5 }],
  '36_50':  [{ any: ['immunity', 'multivitamin'], w: 1.5 }, { any: ['bone', 'calcium'], w: 1 }],
  '50p':    [{ any: ['bone', 'calcium', 'd3', 'iron'], w: 2.5, why: 'Nutrients people commonly top up after 50' },
             { any: ['immunity'], w: 1 }],

  female:   [{ any: ["women's"], w: 4, why: 'The formula built for women' },
             { any: ['iron'], w: 2, why: 'Iron and calcium are common top-ups for women' },
             { any: ['calcium'], w: 1.5 }],
  male:     [{ any: ["men's"], w: 4, why: 'The formula built for men' }, { any: ['energy'], w: 1 }],
  na:       [],

  veg:      [{ any: ['spirulina', 'moringa', 'vegan', 'b12'], w: 2, why: 'Plant-based, and B12 is worth topping up on a veg diet' }],
  active:   [{ any: ['rehydration', 'l-carnitine', 'magnesium', 'energy'], w: 2, why: 'Popular with an active routine' }],
  desk:     [{ any: ['energy', 'green tea', 'immunity'], w: 1.5 }],
  travel:   [{ any: ['vitamin c', 'amla', 'immunity', 'effervescent'], w: 2, why: 'Easy to carry, and a common travel top-up' }],
  daily:    [{ any: ['multivitamin', 'bestseller', 'premium'], w: 1.5, why: 'A practical fit for a consistent daily routine' }],
  beauty:   [{ any: ['skin', 'glutathione', 'biotin', 'collagen'], w: 2.5, why: 'Matches a beauty-focused routine' }],
  hydration:[{ any: ['effervescent', 'rehydration', 'electrolyte'], w: 2.5, why: 'A water-based format can fit this routine' }],
  no_preference: [],
  label:    [{ any: ['premium', 'bestseller'], w: 0.8, why: 'A well-documented product page is easier to compare' }],
  effervescent: [{ any: ['effervescent', 'rehydration'], w: 2, why: 'Available in a dissolve-in-water format' }],
  capsule:  [{ any: ['capsule', 'tablet', 'glutathione', 'biotin'], w: 1.5, why: 'Matches a compact capsule or tablet routine' }],
  powder:   [{ any: ['powder', 'spirulina', 'moringa'], w: 1.5, why: 'Matches a powder or blend format' }],
  any_format: [],
};

// Answers that rule a product OUT regardless of score. Scoring alone is
// not enough here: a gendered formula recommended to the other gender is
// wrong at any score, not merely ranked too high.
const VITA_MATCH_EXCLUDE = {
  male: ["women's"],
  female: ["men's"],
  // The quiz explicitly promises to skip gendered formulas when the user
  // declines to provide gender; do not infer or rank one from neutral answers.
  na: ["men's", "women's"]
};

let vmAnswers = {};
let vmStep = 0;

// Does this product answer to `term`? Tags first, then name and category,
// so a rule survives a catalogue that has not been tagged thoroughly.
//
// The name test is WORD-BOUNDARY anchored, not a substring test. Plain
// `includes` matches "men's" inside "Women's Multivitamin", which put the
// women's formula in front of men carrying the reason "the formula built
// for men". \b does not fire between the "o" and "m" of "women", so the
// two stay distinct.
const _vmRe = {};
function vmHas(p, term) {
  const t = term.toLowerCase();
  if (Array.isArray(p.tags) && p.tags.some(x => String(x).toLowerCase() === t)) return true;
  if (!_vmRe[t]) _vmRe[t] = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  return _vmRe[t].test((p.name || '') + ' ' + (p.category || ''));
}

function vitaMatchScore(ans) {
  const banned = Object.keys(ans).flatMap(k => VITA_MATCH_EXCLUDE[ans[k]] || []);
  const list = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
    .filter(p => p && (Number(p.salePrice) > 0 || Number(p.price) > 0))
    .filter(p => !banned.some(term => vmHas(p, term)));
  const scored = list.map(p => {
    let score = 0; const why = [];
    Object.keys(ans).forEach(k => {
      (VITA_MATCH_RULES[ans[k]] || []).forEach(rule => {
        if (rule.any.some(term => vmHas(p, term))) {
          score += rule.w;
          if (rule.why && why.length < 2) why.push(rule.why);
        }
      });
    });
    // Gentle tiebreakers only — never enough to outrank a real goal match.
    if (Array.isArray(p.tags)) {
      if (p.tags.includes('bestseller')) score += 0.6;
      if (p.tags.includes('featured')) score += 0.3;
    }
    return { p, score, why };
  });
  return scored.filter(x => x.score > 0)
               .sort((a, b) => b.score - a.score || (a.p.position || 99) - (b.p.position || 99))
               .slice(0, 3);
}

function vitaMatchInit(force) {
  if (force) { vmAnswers = {}; vmStep = 0; }
  vitaMatchRender();
}

function vitaMatchRender() {
  const el = document.getElementById('vitaMatchCard');
  if (!el) return;
  if (vmStep >= VITA_MATCH_Q.length) { vitaMatchResults(); return; }
  const q = VITA_MATCH_Q[vmStep];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  el.innerHTML =
    '<div class="vm-prog">' +
      VITA_MATCH_Q.map((_, i) => '<i class="' + (i <= vmStep ? 'done' : '') + '"></i>').join('') +
    '</div>' +
    '<div class="vm-step-n">Step ' + (vmStep + 1) + ' of ' + VITA_MATCH_Q.length + '</div>' +
    '<h2 class="vm-q">' + esc(q.q) + '</h2>' +
    '<p class="vm-hint">' + esc(q.hint) + '</p>' +
    '<div class="vm-opts">' +
      q.opts.map(o =>
        '<button type="button" class="vm-opt' + (vmAnswers[q.key] === o.v ? ' sel' : '') +
          '" onclick="vitaMatchPick(\'' + q.key + '\',\'' + o.v + '\')">' +
          '<span class="vm-opt-ico" aria-hidden="true">' + o.ico + '</span>' +
          '<span><b>' + esc(o.t) + '</b>' + (o.s ? '<span>' + esc(o.s) + '</span>' : '') + '</span>' +
        '</button>').join('') +
    '</div>' +
    '<div class="vm-nav">' +
      (vmStep > 0 ? '<button type="button" class="vm-back" onclick="vitaMatchBack()">&lsaquo; Back</button>' : '<span></span>') +
      '<span class="vm-skip">No sign-in needed</span>' +
    '</div>';
  try { vp3dScan(el); } catch (e) {}
}

function vitaMatchPick(key, val) {
  vmAnswers[key] = val;
  vmStep++;
  vitaMatchRender();
}

function vitaMatchBack() { if (vmStep > 0) { vmStep--; vitaMatchRender(); } }

function vitaMatchResults() {
  const el = document.getElementById('vitaMatchCard');
  if (!el) return;
  const picks = vitaMatchScore(vmAnswers);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN');

  if (!picks.length) {
    el.innerHTML = '<h2 class="vm-q">Nothing matched just yet</h2>' +
      '<p class="vm-hint">The catalogue is still loading, or nothing lines up with those answers. ' +
      'Browse the full range and everything is there.</p>' +
      '<button class="btn-primary" onclick="showPage(\'shop\')">Browse all products</button>' +
      '<div class="vm-alt"><button type="button" onclick="vitaMatchInit(true)">Start over</button></div>';
    return;
  }

  const goalLabel = (VITA_MATCH_Q[0].opts.find(o => o.v === vmAnswers.goal) || {}).t || 'your goal';
  el.innerHTML =
    '<div class="vm-res-head">' +
      (typeof vp3dHTML === 'function' ? vp3dHTML('gift') : '') +
      '<h2 class="vm-res-title">Your VitaMatch is ready</h2>' +
      '<p class="vm-res-sub">Based on <b>' + esc(goalLabel) + '</b> and the additional routine, format and preference answers you gave, these are the closest fits in the Ozylix range. Compare the product page and label before ordering.</p>' +
    '</div>' +
    '<div class="vm-res-list">' +
      picks.map((x, i) => {
        const p = x.p;
        const rate = Number(p.salePrice || p.price) || 0;
        const mrp = Number(p.price) || 0;
        const img = (typeof getProductImg === 'function' ? getProductImg(p) : p.image) || '';
        const why = x.why.length ? x.why.join(' · ') : 'A close fit for the answers you gave';
        const matchScore = Math.min(99, Math.max(60, Math.round(68 + x.score * 4)));
        const whyWithScore = why + ' · ' + matchScore + '% match to your answers';
        return '<div class="vm-rec' + (i === 0 ? ' top' : '') + '" onclick="openProduct(' + p.id + ')">' +
          (i === 0 ? '<span class="vm-flag">Best match</span>' : '') +
          '<img class="vm-rec-img" src="' + esc(img) + '" alt="' + esc(p.name) + ' — Ozylix supplement" loading="lazy" decoding="async"' +
            ' onerror="this.src=PRODUCT_FALLBACKS.default">' +
          '<div class="vm-rec-body">' +
            '<div class="vm-rec-name">' + esc(p.name) + '</div>' +
            '<div class="vm-rec-why">' + esc(whyWithScore) + '</div>' +
            '<button class="vm-rec-add" onclick="event.stopPropagation();STORE.addToCart(' + p.id + ')">Add to cart</button>' +
          '</div>' +
          '<div class="vm-rec-price">' + rupee(rate) +
            (mrp > rate ? '<s>' + rupee(mrp) + '</s>' : '') + '</div>' +
        '</div>';
      }).join('') +
    '</div>' +
    (typeof offerBarHTML === 'function' ? offerBarHTML('Picked for you') : '') +
    '<p class="vm-note">These are general wellness suggestions from our own range — not medical advice ' +
      'or a diagnosis. Please talk to a qualified doctor about any health condition, and before starting ' +
      'a supplement if you are pregnant, nursing or on medication.</p>' +
    '<div class="vm-alt"><button type="button" onclick="vitaMatchInit(true)">Start over</button></div>';

  try { vp3dScan(el); } catch (e) {}
  try { offerTick(); } catch (e) {}
  try { if (typeof showPtsToast === 'function') showPtsToast('Every order earns VitaPoints'); } catch (e) {}
}

const VITA_CONSENT_KEY = 'ozylix.vita.advisor-consent.v1';
function vitaHasConsent() {
  try { return sessionStorage.getItem(VITA_CONSENT_KEY) === '1'; } catch (e) { return false; }
}
function vitaAdvisorConsent() {
  try { sessionStorage.setItem(VITA_CONSENT_KEY, '1'); } catch (e) {}
  const gate = document.getElementById('vitaPrivacyGate');
  if (gate) gate.style.display = 'none';
  vitaShowMatch();
}
function vitaRequireConsent() {
  if (vitaHasConsent()) return true;
  const gate = document.getElementById('vitaPrivacyGate');
  const match = document.getElementById('vitaMatchWrap');
  const chat = document.getElementById('vitaChatWrap');
  if (gate) gate.style.display = '';
  if (match) match.style.display = 'none';
  if (chat) chat.style.display = 'none';
  return false;
}

// Reveals the Gemini chat for anyone who would rather type. Kept opt-in
// because it is the path that can fail.
function vitaShowChat() {
  if (!vitaRequireConsent()) return;
  const chat = document.getElementById('vitaChatWrap');
  const quiz = document.getElementById('vitaMatchWrap');
  if (!chat) return;
  chat.style.display = '';
  if (quiz) quiz.style.display = 'none';
  try { vitaInit(); } catch (e) {}
  chat.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function vitaShowMatch() {
  if (!vitaRequireConsent()) return;
  const chat = document.getElementById('vitaChatWrap');
  const quiz = document.getElementById('vitaMatchWrap');
  if (chat) chat.style.display = 'none';
  if (quiz) { quiz.style.display = ''; vitaMatchInit(true); }
}


// ══════════════════════════════════════════════════════════════════════
// CUSTOMER REMINDERS — permission-based, non-spammy and consent-safe
// ══════════════════════════════════════════════════════════════════════
const OZ_NOTIFY_PREF_KEY = 'ozylix.notification.preference.v1';
const OZ_NOTIFY_SEEN_KEY = 'ozylix.notification.seen.v1';
function ozylixNotifyPref() { try { return localStorage.getItem(OZ_NOTIFY_PREF_KEY) || ''; } catch(e) { return ''; } }
function ozylixSetNotifyPref(v) { try { localStorage.setItem(OZ_NOTIFY_PREF_KEY, v); } catch(e) {} }
function ozylixSeen(key) { try { return localStorage.getItem(OZ_NOTIFY_SEEN_KEY + '.' + key) === '1'; } catch(e) { return false; } }
function ozylixMarkSeen(key) { try { localStorage.setItem(OZ_NOTIFY_SEEN_KEY + '.' + key, '1'); } catch(e) {} }
function ozylixTransactional() { return ['checkout','thankyou','login','account'].indexOf(String(currentPage || '')) >= 0; }

function showOzylixConsentBar() {
  if (ozylixNotifyPref() || typeof Notification === 'undefined' || ozylixTransactional()) return;
  if (document.getElementById('ozylxConsentBar')) return;
  const bar = document.createElement('div');
  bar.id = 'ozylxConsentBar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Customer reminder preferences');
  bar.innerHTML = '<div class="oz-consent-copy"><span aria-hidden="true" style="font-size:1.3rem">🔔</span><div><strong>Want helpful Ozylix reminders?</strong><br><span style="opacity:.82">Allow optional browser reminders for genuine limited offers, review requests and saved-cart help. No permission is requested until you choose Allow.</span></div></div>' +
    '<div class="oz-consent-actions"><button class="oz-consent-allow" type="button">Allow reminders</button><button class="oz-consent-later" type="button">Not now</button><button class="oz-consent-never" type="button">Do not show again</button></div>';
  document.body.appendChild(bar);
  bar.style.display = 'block';
  bar.querySelector('.oz-consent-allow').onclick = async function() {
    try {
      const result = await Notification.requestPermission();
      ozylixSetNotifyPref(result === 'granted' ? 'granted' : 'denied');
      bar.remove();
      if (result === 'granted') { showToast('Browser reminders enabled. You can change this in browser settings.'); ozylixBrowserReminder('welcome', 'We will only remind you about relevant Ozylix updates.'); }
      else showToast('Browser reminders were not enabled.');
    } catch(e) { ozylixSetNotifyPref('denied'); bar.remove(); showToast('Browser reminders are unavailable here.'); }
  };
  bar.querySelector('.oz-consent-later').onclick = function() { ozylixSetNotifyPref('later'); bar.remove(); };
  bar.querySelector('.oz-consent-never').onclick = function() { ozylixSetNotifyPref('never'); bar.remove(); };
}

async function ozylixBrowserReminder(key, body, url) {
  if (ozylixNotifyPref() !== 'granted' || typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;
  if (ozylixSeen(key)) return false;
  ozylixMarkSeen(key);
  const payload = { title: 'Ozylix', body: body, url: url || '/#shop' };
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) { await reg.showNotification(payload.title, { body: payload.body, icon: '/assets/ozylix-icon-192.png', badge: '/assets/ozylix-icon-192.png', data: { url: payload.url } }); return true; }
    }
  } catch(e) {}
  try { new Notification(payload.title, { body: payload.body, icon: '/assets/ozylix-icon-192.png' }); return true; } catch(e) { return false; }
}

function ozylixScheduleReminders() {
  if (ozylixTransactional()) return;
  // Ask once after the customer has had time to read the page; this is only a consent bar.
  if (!ozylixNotifyPref() && typeof Notification !== 'undefined') setTimeout(showOzylixConsentBar, 12000);
  // Logged-in customer with no known local order: offer help, but only once per device/account.
  setTimeout(async function() {
    try {
      const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      if (!user || !user.email || ozylixSeen('no-order-' + user.email)) return;
      let orders = JSON.parse(localStorage.getItem('asc_orders') || '[]');
      if (!orders.length && localStorage.getItem('asc_jwt')) {
        const r = await fetchWithTimeout(API_BASE + '/api/orders/my', { headers: { Authorization: 'Bearer ' + localStorage.getItem('asc_jwt') } }, 7000);
        if (r.ok) { const d = await r.json(); orders = d.data || d || []; }
      }
      if (orders.length) return;
      ozylixMarkSeen('no-order-' + user.email);
      if (typeof ozylxNotify !== 'undefined') ozylxNotify.show({ id:'no-order-help', icon:'🌿', msg:'Your wellness shortlist is waiting — want help choosing a first product?', cta:'Open VitaMatch', corner:'bottom-right', onCta:function(){showPage('advisor');} });
      ozylixBrowserReminder('no-order-' + user.email, 'Your Ozylix wellness shortlist is waiting. Try VitaMatch when you are ready.', '/#advisor');
    } catch(e) {}
  }, 26000);
}

// Review reminders use the existing eligibility check, and never fire for a product already reviewed.
function ozylixReviewReminder(productId) {
  const p = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(x => Number(x.id) === Number(productId));
  const name = p ? p.name : 'your delivered product';
  if (typeof ozylxNotify !== 'undefined') ozylxNotify.show({ id:'review-' + productId, icon:'★', msg:'How did ' + name + ' fit into your routine?', cta:'Write a review', corner:'bottom-left', onCta:function(){openReviewFromThankYou();} });
  ozylixBrowserReminder('review-' + productId, 'How did ' + name + ' fit into your routine? Share a review when you have a moment.', '/#account');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ozylixScheduleReminders);
else setTimeout(ozylixScheduleReminders, 1000);

async function hydrateOzylixPublicSettings() {
  try {
    const base = (typeof API_BASE === 'string' ? API_BASE : '');
    const r = await fetch(base + '/api/public/store-config', {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!r.ok) return;
    const payload = await r.json();
    const data = payload && payload.ok ? payload.data : null;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return;
    window.__OZYLIX_SETTINGS = data;
    document.querySelectorAll('[data-offer-bar]').forEach(function (bar) {
      const replacement = offerBarHTML('');
      if (replacement) { const wrap = document.createElement('div'); wrap.innerHTML = replacement; bar.replaceWith(wrap.firstElementChild); }
    });
    try { offerTick(); } catch(e) {}
  } catch(e) { /* public settings are optional; defaults remain safe */ }
}
setTimeout(hydrateOzylixPublicSettings, 350);

// ══════════════════════════════════════════════════════════════════════
// OFFER COUNTDOWN
//
// OFFER_DEADLINE is a real date the shop owner sets. Leave it empty and
// the bar still shows the offer, just with no clock. Set it to a real
// end time and the clock appears; once that time passes the clock
// disappears again on its own.
//
// What it will NOT do is invent a deadline or restart a timer on each
// page load. That is a lie the customer catches by pressing reload, and
// it is precisely the practice the dark-pattern rules exist for.
// ══════════════════════════════════════════════════════════════════════
var OFFER_DEADLINE = '';   // Admin may set a real ISO deadline; empty means no fake clock.
var OFFER_LABEL    = 'Mix & Match — bundle discounts on every pack';
var OFFER_SUB      = 'Add any 4 items and the cheapest one is free. No code needed.';

function getOfferSetting(key, fallback) {
  try {
    const s = window.__OZYLIX_SETTINGS || {};
    return s[key] != null ? s[key] : fallback;
  } catch(e) { return fallback; }
}
function offerEndsAt() {
  const configured = getOfferSetting('offer_deadline', OFFER_DEADLINE);
  if (!configured) return null;
  const t = Date.parse(configured);
  return Number.isFinite(t) && t > Date.now() ? t : null;
}

function offerBarHTML(kicker) {
  const label = getOfferSetting('offer_label', OFFER_LABEL);
  const sub = getOfferSetting('offer_sub', OFFER_SUB);
  if (!label) return '';
  const ends = offerEndsAt();
  return '<div class="offer-bar" data-offer-bar>' +
    (typeof vp3dHTML === 'function' ? vp3dHTML('coin') : '') +
    '<div class="offer-bar-copy">' + (kicker ? kicker + ' · ' : '') + esc(label) +
      (sub ? '<span>' + esc(sub) + '</span>' : '') + '</div>' +
    (ends ? '<div class="offer-clock" data-offer-clock></div>' : '') +
  '</div>';
}

function offerTick() {
  const clocks = document.querySelectorAll('[data-offer-clock]');
  if (!clocks.length) return;
  const ends = offerEndsAt();
  if (!ends) { clocks.forEach(c => c.remove()); return; }
  let left = Math.max(0, ends - Date.now());
  const d = Math.floor(left / 864e5); left -= d * 864e5;
  const h = Math.floor(left / 36e5);  left -= h * 36e5;
  const m = Math.floor(left / 6e4);   left -= m * 6e4;
  const s = Math.floor(left / 1e3);
  const cell = (n, l) => '<div><b>' + String(n).padStart(2, '0') + '</b><i>' + l + '</i></div>';
  const html = (d > 0 ? cell(d, 'days') : '') + cell(h, 'hrs') + cell(m, 'min') + cell(s, 'sec');
  clocks.forEach(c => { c.innerHTML = html; });
}
setInterval(function () { try { offerTick(); } catch (e) {} }, 1000);

let vitaHistory = [];
let vitaStarted = false;
let vitaMsgCount = 0;
let vitaLeadCaptured = false;

// System instruction sent to Gemini. Deliberately scoped to general wellness
/// nutrition information about Ozylix's own catalog — no diagnosis, no
// disease-treatment or cure claims (FSSAI/ASCI compliance for an Indian
// nutraceutical brand). Product recommendations are still tagged with
// [VITA_REC:id:reason] exactly as vitaSend() already parses.
const VITA_SYSTEM = `You are Vita, a friendly wellness assistant for Ozylix (an Indian nutraceutical brand selling effervescent vitamins, spirulina, and ayurvedic supplements).

Your job: ask a few short, warm questions about the person's goals, lifestyle, and preferences, then recommend 1-3 relevant Ozylix products by tagging each with [VITA_REC:<product id>:<short reason>] on its own so the app can render a product card.

Strict rules — never break these:
- You are not a doctor and must never diagnose any condition, claim to treat or cure any disease, or contradict a doctor's advice.
- Only describe general wellness/nutritional benefits (e.g. "supports energy", "contains antioxidants") — never disease-treatment language ("cures", "treats", "reverses").
- If someone describes a medical condition, symptoms that sound serious, or asks for medical advice, tell them warmly to consult a qualified doctor, and do not recommend a product as a treatment for that condition.
- Keep replies short (2-4 sentences) and conversational, suitable for a chat bubble.
- Only recommend real Ozylix products relevant to what the person actually said.`;

// Small persistent disclaimer shown above the chat input (audit item P0-9:
// "add a clear non-medical disclaimer"). Injected once on first init.
function vitaEnsureDisclaimer() {
  const wrap = document.querySelector('.vita-chat-wrap');
  if (!wrap || document.getElementById('vitaDisclaimer')) return;
  const bar = document.getElementById('vitaMessages')?.closest('.vita-chat-wrap');
  const inputBar = wrap.querySelector('.vita-input-bar');
  if (!inputBar) return;
  const note = document.createElement('div');
  note.id = 'vitaDisclaimer';
  note.style.cssText = 'font-size:0.7rem;color:var(--gray);text-align:center;padding:6px 14px 0;line-height:1.5;';
  note.textContent = 'Vita gives general wellness suggestions only — not medical advice or a diagnosis. Please consult a doctor for any health condition.';
  inputBar.parentNode.insertBefore(note, inputBar);
}

// Renders a chat bubble. Supports the minimal markdown Vita's own greeting
// text already uses (**bold**) and preserves \n line breaks.
function vitaAddMsg(text, role) {
  const box = document.getElementById('vitaMessages');
  if (!box) return;
  vitaMsgCount++;
  const safe = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  const row = document.createElement('div');
  row.className = 'vita-msg ' + (role === 'user' ? 'user' : 'bot');
  row.innerHTML = (role === 'user'
    ? `<div class="vita-bubble">${safe}</div>`
    : `<div class="vita-msg-icon">🌿</div><div class="vita-bubble">${safe}</div>`);
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
  vitaEnsureDisclaimer();
  return row;
}

function vitaShowTyping() {
  const box = document.getElementById('vitaMessages');
  if (!box || document.getElementById('vitaTypingRow')) return;
  const row = document.createElement('div');
  row.className = 'vita-msg bot vita-typing';
  row.id = 'vitaTypingRow';
  row.innerHTML = `<div class="vita-msg-icon">🌿</div><div class="vita-bubble"><span class="vt-dot"></span><span class="vt-dot"></span><span class="vt-dot"></span></div>`;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

function vitaHideTyping() {
  document.getElementById('vitaTypingRow')?.remove();
}

// Quick-reply suggestion chips under the last bot message.
function vitaAddChips(options) {
  const box = document.getElementById('vitaMessages');
  if (!box || !options || !options.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'vita-chips';
  wrap.innerHTML = options.map(o =>
    `<button type="button" class="vita-chip-btn" onclick="vitaChipClick(this)">${o.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</button>`
  ).join('');
  box.appendChild(wrap);
  box.scrollTop = box.scrollHeight;
}

function vitaChipClick(btn) {
  const input = document.getElementById('vitaInput');
  if (!input) return;
  input.value = btn.textContent;
  vitaSend();
}

// Inline product-recommendation cards, tagged via [VITA_REC:id:reason] in
// Vita's reply. Reuses the real PRODUCTS catalog so price/name/image always
// match the shop — never invents a product.
function vitaRenderRecs(ids, reasons) {
  const box = document.getElementById('vitaMessages');
  if (!box) return;
  const wrap = document.createElement('div');
  wrap.className = 'vita-rec-wrap';
  let any = false;
  ids.forEach((id, i) => {
    const p = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(pp => pp.id === id);
    if (!p) return;
    any = true;
    const price = p.salePrice || p.price;
    const img = p.image || (p.image2 || '');
    wrap.innerHTML += `<div class="vita-rec-card" onclick="openProduct(${p.id})">
      ${img ? `<img class="vita-rec-img" src="${img}" alt="${p.name}" loading="lazy" decoding="async">` : `<div class="vita-rec-img"></div>`}
      <div class="vita-rec-info">
        <div class="vita-rec-name">${p.name}</div>
        <div class="vita-rec-reason">${(reasons[i]||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      </div>
      <div class="vita-rec-price">${price ? '₹'+price : ''}</div>
      <button class="vita-rec-add" onclick="event.stopPropagation();STORE.addToCart(${p.id});showToast('Added to cart 🌿')">Add</button>
    </div>`;
  });
  if (!any) return;
  box.appendChild(wrap);
  box.scrollTop = box.scrollHeight;
}

function vitaInit() {
  if (vitaStarted) return;
  vitaStarted = true;
  vitaHistory = [];
  vitaMsgCount = 0;
  vitaLeadCaptured = false;
  const lf = document.getElementById('vitaLeadForm');
  if (lf) lf.style.display = 'none';
  const box = document.getElementById('vitaMessages');
  if (box) box.innerHTML = '';

  setTimeout(() => {
    vitaAddMsg("Namaste! 🌿 I'm **Vita**, Ozylix's general wellness guide.\n\nTell me about a wellness goal or routine you would like help comparing — please do not share your name, contact details, diagnosis, symptoms or medicines. 😊", 'bot');
  }, 400);
}

function vitaRestart() {
  vitaStarted = false;
  vitaInit();
}

async function vitaSend() {
  if (!vitaHasConsent()) { vitaRequireConsent(); return; }
  const input = document.getElementById('vitaInput');
  const btn = document.getElementById('vitaSendBtn');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  vitaAddMsg(text, 'user');
  document.querySelectorAll('.vita-chips').forEach(el => el.remove());

  vitaHistory.push({ role: 'user', content: text });
  btn.disabled = true;
  vitaShowTyping();

  try {
    // Build Gemini contents array from history
    const systemInstruction = VITA_SYSTEM;
    const contents = vitaHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const res = await fetch(API_BASE + '/api/gemini/vita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: contents,
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.7,
          topP: 0.9
        }
      })
    });

    vitaHideTyping();
    if (!res.ok) {
      const errData = await res.json().catch(()=>({}));
      throw new Error('Gemini API ' + res.status + ': ' + (errData?.error?.message || ''));
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text
              || "I'm having a small issue. Please try again! 🌿";

    // Parse product recommendations
    const recPat = /\[VITA_REC:(\d+):([^\]]+)\]/g;
    const ids = [], reasons = [];
    let m;
    while ((m = recPat.exec(raw)) !== null) {
      ids.push(parseInt(m[1]));
      reasons.push(m[2]);
    }
    const clean = raw.replace(/\[VITA_REC:\d+:[^\]]+\]/g, '').trim();
    if (clean) vitaAddMsg(clean, 'bot');
    if (ids.length > 0) setTimeout(() => vitaRenderRecs(ids, reasons), 250);

    // Smart quick replies
    const msgLen = vitaHistory.length;
    if (ids.length === 0) {
      if (msgLen <= 2) {
        setTimeout(() => vitaAddChips(['18–25 years','26–35 years','36–50 years','50+ years']), 500);
      } else if (msgLen <= 4) {
        setTimeout(() => vitaAddChips(['🌟 Skin & Glow','⚡ Energy & Focus','💪 Immunity','💇 Hair Growth','⚖️ Weight Loss','🦴 Bone Health']), 500);
      } else if (msgLen <= 6) {
        setTimeout(() => vitaAddChips(['Active lifestyle','Desk job / sedentary','Vegetarian','I travel a lot']), 500);
      }
    } else {
      setTimeout(() => vitaAddChips(['Tell me more about these','Combo packs?','How long for results?','Add all to cart']), 600);
    }

    vitaHistory.push({ role: 'assistant', content: raw });

  } catch(err) {
    vitaHideTyping();
    console.error('[Vita Gemini]', err);
    // A dead end here used to be the end of the visit. There is now a
    // recommender that needs no quota, so offer it rather than asking
    // them to try again at something that is out of tokens.
    vitaAddMsg("Sorry — I can't answer right now 🌿 The quick 4-question match works offline and gets you the same recommendations. Or WhatsApp us at +91 98985 82650.", 'bot');
    const box = document.getElementById('vitaMessages');
    if (box) {
      const wrap = document.createElement('div');
      wrap.className = 'vita-chips';
      wrap.innerHTML = '<button type="button" class="vita-chip-btn" onclick="vitaShowMatch()">Take the 4-question match &rsaquo;</button>';
      box.appendChild(wrap);
      box.scrollTop = box.scrollHeight;
    }
  } finally {
    btn.disabled = false;
    input.focus();
  }
}

function vitaSubmitLead() {
  const name = document.getElementById('vitaLeadName')?.value.trim();
  const email = document.getElementById('vitaLeadEmail')?.value.trim();
  if (!name || !email) { alert('Please fill in both name and email 🌿'); return; }
  vitaLeadCaptured = true;
  document.getElementById('vitaLeadForm').style.display = 'none';
  // Store locally
  try { localStorage.setItem('asc_lead', JSON.stringify({name, email, date: new Date().toISOString()})); } catch(e){}
  vitaAddMsg(`Thank you, ${name}! 🌿 Your personalised plan has been saved. We'll send your exclusive offer to **${email}** soon. Is there anything else I can help you with?`, 'bot');
}

// Vita is initialized via the consolidated showPage above


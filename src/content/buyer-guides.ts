export const buyerGuides = [
  {
    slug: 'website-redesign-cost-india',
    title: 'Website Redesign Cost in India: How to Compare Quotes',
    description:
      'Compare a focused website refresh with a full rebuild. Work out which pages, content, redirects and recurring costs belong in your redesign quote.',
    intro:
      'Two quotes for a five-page website can cover very different jobs. Before comparing the totals, ask each studio to price the same pages, the same content work and the same launch checks.',
    sections: [
      [
        'Start with the job your website needs to do',
        'Suppose customers call to ask which areas you serve, even though the information is somewhere on your site. A clearer service page and an enquiry form that works on a phone may solve that problem. List the questions your next customer needs answered and the action they should take afterwards.',
      ],
      [
        'Count layouts as well as pages',
        'A home page, three service pages using one layout, and a contact page give you five pages to populate and three layouts to design. Five pages with different layouts, new photography and copy written from interviews take a different amount of work. Ask the proposer to list the layouts, who supplies content and how many review rounds are included.',
      ],
      [
        'Put launch and running costs on separate lines',
        'Ask for the one-time design and build cost, any migration or integration work, and the annual cost of the domain, hosting, email and maintenance you choose. For illustration, a ₹20,000 build with ₹4,000 in annual running costs totals ₹24,000 in year one before applicable taxes. Those figures illustrate the calculation. StemAGH quotes each project after reviewing the scope.',
      ],
      [
        'Protect the pages customers already visit',
        'Export the important URLs from your current site and Search Console. Mark each as keep, move or retire. If a service changes address, include its replacement URL in the scope. Specify who will test those redirects, phone links, enquiry delivery and the mobile layout before launch.',
      ],
      [
        'Send the same brief to each studio',
        'Include your site address, priority services, pages to keep, content you already have, any integrations and your intended launch date. Ask for the deliverables, payment milestones, handover access and recurring charges in writing. You can then compare the first-year total and see which tasks your team will still own.',
      ],
    ],
    links: [
      ['/services/website-redesign', 'Discuss a website redesign'],
      ['/insights/stemagh-website-redesign', 'See how StemAGH redesigned its own enquiry journey'],
    ],
  },
  {
    slug: 'real-estate-crm-evaluation-checklist',
    title: 'Real Estate CRM Checklist for Indian Developers',
    description:
      'Evaluate a real estate CRM using one sample lead, unit, booking and receipt. Check follow-ups, payment schedules, buyer access and self-hosting before a pilot.',
    intro:
      'Bring one sample sale to your CRM demo. Ask a salesperson, a collections colleague and the person responsible for IT to follow the same booking through the system. Use fictional names and amounts so everyone can repeat the exercise.',
    sections: [
      [
        '1. Capture a lead and hand it over',
        'Enter a fictional enquiry for a plotted project. Enter it again using the same phone number. Can the team see the earlier contact, identify the owner, schedule a site visit and find the next follow-up? Ask a second salesperson to show which records their role can see.',
      ],
      [
        '2. Book the property your team actually sells',
        'Choose a sample plot or apartment. Ask the salesperson to find available inventory, record a booking, attach its payment plan and show the resulting availability. Check that the agreed price, unit of area and applicant details carry through to the booking documents.',
      ],
      [
        '3. Reconcile a partial payment',
        'Use two instalments of ₹50,000 and a receipt of ₹60,000. For a plan allocating to the oldest dues first, expect ₹50,000 against the first instalment and ₹10,000 against the second, leaving ₹40,000 outstanding. Ask collections to show the receipt, schedule and ledger together. Then reverse the test receipt and check that the original entry and correction are both visible.',
      ],
      [
        '4. Check what a buyer and broker can see',
        'Open the sample buyer account and locate the schedule and receipt. Switch to a separate test buyer and confirm that their account shows only their own booking. If channel sales matter, ask a broker to locate the commission statement for a sample transaction.',
      ],
      [
        '5. Decide who will operate the pilot',
        'For a self-hosted CRM, assign a person to backups, restore testing, updates and user access. Record each requirement as demonstrated, needs configuration or missing. Pick one project for the pilot and agree who will decide whether sales and collections can use it day to day.',
      ],
    ],
    links: [
      ['/products/openestate#tour-title', 'Explore the OpenEstate product walkthrough'],
      ['/products/openestate/install', 'Review the self-hosted installation guide'],
      ['/contact?service=openestate#project-brief', 'Discuss an OpenEstate implementation'],
    ],
  },
  {
    slug: 'stemagh-website-redesign',
    title: 'Website Redesign Case Study: StemAGH’s Enquiry Journey',
    description:
      'See how StemAGH changed its own website from a shared services overview to dedicated buyer pages, with before-and-after screenshots and a tested enquiry flow.',
    intro:
      'On our own studio website, a visitor considering a redesign used to land on the same overview as someone looking for custom software. We wanted a business owner to be able to answer one question before contacting us: what would changing my current site involve?',
    sections: [
      [
        'Before: one overview for several services',
        'Our website development card described responsive layouts, search metadata and launch checks. It worked as a summary. A buyer with an existing website still had to work out whether they could keep their domain, preserve important links or commission a smaller update.',
      ],
      [
        'After: a page for the redesign decision',
        'We kept the overview and added a dedicated redesign page. It explains how we review an existing site, preserve useful URLs and test the enquiry form. Its questions ask what should be replaced and what should be kept. The “Discuss my website redesign” link opens the brief with Business website selected.',
      ],
      [
        'What we could verify at launch',
        'We checked the public page, its canonical address and its sitemap entry. Desktop and mobile tests followed the enquiry link and checked the service and page-source label sent with a test brief. That gives the person replying context about the project.',
      ],
      [
        'What we still need to measure',
        'The release established that the journey works. Its business impact needs search impressions, clicks and qualified enquiries over time. For the next review, we can compare the redesign page’s Google clicks with the briefs that identify it as their source.',
      ],
    ],
    links: [
      ['/services/website-redesign', 'View the finished redesign service page'],
      ['/insights/website-redesign-cost-india', 'Compare the scope and cost of a redesign'],
    ],
  },
] as const;

-- Deusy & Planners Services: starter content.
-- Run after 0001_init.sql. Safe to re-run: content is upserted by slug or key.

-- ---------------------------------------------------------------- settings

insert into settings (key, value) values
  ('site', '{
    "name": "Deusy & Planners Services",
    "tagline": "Building people. Planning solutions. Creating value.",
    "phone": "",
    "email": "",
    "whatsapp": "",
    "addressLines": [
      "Pantang Shalom Junction, Accra, Ghana",
      "P.O. Box AF 1921, Adenta, Ghana"
    ],
    "hours": "",
    "logoUrl": "",
    "socials": []
  }'::jsonb),
  ('home', '{
    "heroTitle": "We build people, plan solutions and create value.",
    "heroIntro": "Construction, real estate, human resources and business consultancy for individuals and organisations across Ghana.",
    "servicesHeading": "Three practices, one accountable team.",
    "agencyHeading": "Buy, sell or rent property and vehicles through people who handle the paperwork.",
    "closingHeading": "Tell us what you are planning."
  }'::jsonb)
on conflict (key) do update set value = excluded.value;

-- ---------------------------------------------------------------- services

insert into services (kind, title, slug, summary, scope, sort_order) values
  ('practice', 'Construction and real estate', 'construction-and-real-estate',
   'Practical, professional construction and real estate solutions, planned properly and delivered dependably.',
   array['Construction', 'Real estate'], 1),
  ('practice', 'Human resources management', 'human-resources-management',
   'Human resources support that helps organisations recruit, manage and look after the people who do the work.',
   array['Human resources management'], 2),
  ('practice', 'Consultancy', 'consultancy',
   'Practical advice on staying compliant and on making sound financial and business decisions.',
   array[
     'Labour compliance and inspection readiness',
     'Budgeting, finance and business advisory'
   ], 3),
  ('agency', 'Property sales, rentals and agency', 'property-sales-and-rentals',
   'Buy, sell or rent with us as the people in the middle, from the first conversation to the paperwork.',
   array['Land', 'Houses', 'Commercial property', 'Apartments', 'Rooms'], 1),
  ('agency', 'Automobile sales and agency', 'automobile-sales-and-agency',
   'Buy or sell a car with us sourcing the vehicle and bringing buyers and sellers together.',
   array['Cars', 'Vehicle sourcing', 'Buyer and seller coordination'], 2)
on conflict (slug) do update
  set kind = excluded.kind,
      title = excluded.title,
      summary = excluded.summary,
      scope = excluded.scope,
      sort_order = excluded.sort_order;

-- ---------------------------------------------------------------- pages

insert into pages (title, slug, subtitle, template, content, published, show_in_nav, nav_label, nav_order) values
  ('About', 'about', 'Who we are and how we work.', 'standard', $json$
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Who we are" }]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Deusy & Planners Services is a multidisciplinary Ghanaian business. We build people, plan solutions and create value."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "What we do" }]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "We work across three practices and two agency services."
        }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                { "type": "text", "text": "Construction and real estate." }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                { "type": "text", "text": "Human resources management." }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                { "type": "text", "text": "Consultancy, covering labour compliance and inspection readiness, and budgeting, finance and business advisory." }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                { "type": "text", "text": "Property sales, rentals and agency for land, houses, commercial property, apartments and rooms." }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                { "type": "text", "text": "Automobile sales and agency, covering cars, vehicle sourcing and buyer and seller coordination." }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Our mission" }]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "To provide reliable, practical and professional construction, real estate, human resources and consultancy solutions that create value for our clients and contribute to sustainable business development."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Our vision" }]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "To become a trusted and respected Ghanaian service provider in construction, real estate, human resources and business consultancy, recognised for professionalism, integrity, efficiency and client-focused solutions."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Our values" }]
    },
    {
      "type": "bulletList",
      "content": [
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Integrity" }] }] },
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Professionalism" }] }] },
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Reliability" }] }] },
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Accountability" }] }] },
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Excellence" }] }] },
        { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Client satisfaction" }] }] }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "What you can expect" }]
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Every client deserves practical advice, proper planning and dependable service. We work closely with clients to understand their needs and provide solutions that are efficient, transparent and results-oriented."
            }
          ]
        }
      ]
    }
  ]
}
$json$::jsonb, true, true, 'About', 1),
  ('FAQ', 'faq', 'Straight answers to the questions we are asked most.', 'faq', $json$
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "These are the questions we are asked most. If your question is not answered here, send it to us through the contact page and we will answer it directly."
        }
      ]
    }
  ]
}
$json$::jsonb, true, true, 'FAQ', 2),
  ('Contact', 'contact', 'Tell us what you are planning.', 'contact', $json$
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Tell us what you are planning and we will take it from there. Give us a short description of the property, the vehicle or the business problem you are dealing with, and the team will come back to you."
        }
      ]
    }
  ]
}
$json$::jsonb, true, true, 'Contact', 3)
on conflict (slug) do update
  set title = excluded.title,
      subtitle = excluded.subtitle,
      template = excluded.template,
      content = excluded.content,
      published = excluded.published,
      show_in_nav = excluded.show_in_nav,
      nav_label = excluded.nav_label,
      nav_order = excluded.nav_order;

-- ---------------------------------------------------------------- faqs

insert into faqs (question, answer, sort_order) values
  ('What does Deusy & Planners Services do?',
   'We work across construction and real estate, human resources management, and consultancy, where consultancy covers labour compliance and inspection readiness as well as budgeting, finance and business advisory. We also act as agents for property sales and rentals, and for automobile sales.',
   1),
  ('Who do you work with?',
   'Individuals and organisations across Ghana. That includes people buying, selling or renting property, people looking for a vehicle, and businesses that need construction, real estate, human resources or consultancy support.',
   2),
  ('How does your property service work?',
   'We act as the agent between the two sides. We handle land, houses, commercial property, apartments and rooms, for sale and for rent, and we take care of the coordination and the paperwork around the transaction. The contact page is the fastest way to start.',
   3),
  ('How does your automobile service work?',
   'We source the vehicle and bring buyers and sellers together so the deal moves through one point of contact instead of several. Start on the contact page with the make and model you are looking for, or the vehicle you are selling.',
   4),
  ('How do I start a consultation?',
   'Use the contact page. Choose the topic that matches your need, describe the situation in your own words and send it. The enquiry reaches the team directly and someone will pick it up from there.',
   5),
  ('Where are you based?',
   'We are at Pantang Shalom Junction, Accra, Ghana, and our postal address is P.O. Box AF 1921, Adenta, Ghana.',
   6),
  ('What does your human resources practice cover?',
   'Human resources management for organisations that need support with the people side of running a business. The contact page is the quickest way to describe what your team needs.',
   7),
  ('What do you stand for?',
   'Integrity, professionalism, reliability, accountability, excellence and client satisfaction. Those values shape how we take on work and how we report back to the people who trust us with it.',
   8);

-- ---------------------------------------------------------------- team

-- The team table is intentionally empty. Add people from the admin panel.

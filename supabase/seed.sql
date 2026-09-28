-- Deusy & Planners Services: starter content.
-- Run after 0001_init.sql. Safe to re-run: content is upserted by slug or key.

-- Small builders for the rich-text documents below, so the content stays
-- readable. They live in pg_temp and disappear when the session ends.
create or replace function pg_temp.t(text) returns jsonb
  language sql immutable as $$ select jsonb_build_object('type','text','text',$1) $$;

create or replace function pg_temp.h(text, int default 2) returns jsonb
  language sql immutable as $$
  select jsonb_build_object(
    'type','heading',
    'attrs', jsonb_build_object('level',$2),
    'content', jsonb_build_array(pg_temp.t($1))
  )
$$;

create or replace function pg_temp.p(text) returns jsonb
  language sql immutable as $$
  select jsonb_build_object('type','paragraph','content', jsonb_build_array(pg_temp.t($1)))
$$;

create or replace function pg_temp.items(text[], text) returns jsonb
  language sql immutable as $$
  select jsonb_build_object(
    'type', $2,
    'content', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'type','listItem',
          'content', jsonb_build_array(pg_temp.p(item))
        )
      ) from unnest($1) as item
    ), '[]'::jsonb)
  )
$$;

create or replace function pg_temp.ul(text[]) returns jsonb
  language sql immutable as $$ select pg_temp.items($1, 'bulletList') $$;

create or replace function pg_temp.ol(text[]) returns jsonb
  language sql immutable as $$ select pg_temp.items($1, 'orderedList') $$;

create or replace function pg_temp.quote(text) returns jsonb
  language sql immutable as $$
  select jsonb_build_object('type','blockquote','content', jsonb_build_array(pg_temp.p($1)))
$$;

create or replace function pg_temp.doc(jsonb[]) returns jsonb
  language sql immutable as $$
  select jsonb_build_object('type','doc','content', coalesce($1, '[]'::jsonb))
$$;

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
    "heroIntro": "Construction and real estate, human resources management, business consultancy, and agency services for individuals, businesses, institutions and organisations across Ghana.",
    "servicesHeading": "Three practices, one accountable team.",
    "agencyHeading": "Property, vehicles and business facilitation, handled by people who keep the paperwork moving.",
    "closingHeading": "Tell us what you are planning."
  }'::jsonb)
on conflict (key) do update set value = excluded.value;

-- ---------------------------------------------------------------- services

insert into services (kind, title, slug, summary, scope, body, sort_order) values
  ('practice', 'Construction and real estate', 'construction-and-real-estate',
   'Building and construction services, project planning and coordination, property development and management support, real estate consultancy and project supervision.',
   array[
     'Building and construction services',
     'Project planning and coordination',
     'Property development support',
     'Property management',
     'Real estate consultancy',
     'Land and property advisory',
     'Project supervision'
   ],
   pg_temp.doc(array[
     pg_temp.h('What we deliver'),
     pg_temp.p('We provide practical solutions across construction, property development and real estate, planned properly and supervised properly.'),
     pg_temp.ul(array[
       'Building and construction services',
       'Construction project planning and coordination',
       'Property development and management support',
       'Real estate consultancy',
       'Building and construction advisory',
       'Project supervision and general construction support'
     ]),
     pg_temp.h('How we work'),
     pg_temp.p('Every project starts with the site, the drawings and the money. We plan the sequence of work, coordinate the people on site, keep the documentation in order and report progress honestly, so the client knows where the project stands at any point.'),
     pg_temp.h('Property development and management'),
     pg_temp.p('For clients who are developing or holding property, we support the work around the building: development decisions, management of the property, and the advisory that keeps value from leaking away through neglect or poor records.')
   ]), 1),

  ('practice', 'Human resources management', 'human-resources-management',
   'Recruitment, employee management, HR policies, staff training, performance management and workplace relations support for organisations.',
   array[
     'Recruitment and staffing support',
     'Employee management',
     'HR policies and procedures',
     'Staff training and development',
     'Performance management',
     'Employee documentation',
     'Workplace relations advisory',
     'HR compliance support'
   ],
   pg_temp.doc(array[
     pg_temp.h('Our people service'),
     pg_temp.p('Our human resources services support organisations in effectively managing their workforce. The work is practical: the policies, the records and the day-to-day handling of the people side of running a business.'),
     pg_temp.ul(array[
       'Recruitment and staffing support',
       'Employee management',
       'HR policy development',
       'Staff training and development',
       'Performance management support',
       'Employee documentation',
       'Workplace relations advisory',
       'HR compliance support'
     ]),
     pg_temp.h('Compliance and documentation'),
     pg_temp.p('Good human resources management is also compliance management. We build the documentation an organisation needs to survive an inspection, keep employee records that are actually usable, and put policies in place that staff can follow.'),
     pg_temp.h('Who we support'),
     pg_temp.p('Small and growing businesses, NGOs, churches and institutions that need a functioning people function but do not yet have a full human resources department.')
   ]), 2),

  ('practice', 'Consultancy', 'consultancy',
   'Training, inspection readiness and labour compliance, plus budgeting, finance, human resources and general business advisory.',
   array[
     'Labour compliance advisory',
     'Inspection-readiness training',
     'Workplace documentation',
     'Staff orientation and compliance training',
     'Budgeting and financial planning',
     'Finance and cost-management advisory',
     'Business planning',
     'General management consultancy',
     'Business growth and development support'
   ],
   pg_temp.doc(array[
     pg_temp.h('Training, inspection readiness and labour compliance'),
     pg_temp.p('We assist businesses and organisations to prepare for inspections and improve compliance with applicable labour requirements.'),
     pg_temp.ul(array[
       'Labour compliance advisory',
       'Inspection-readiness training',
       'Workplace documentation and compliance preparation',
       'Human resources policies and procedures',
       'Employee records and documentation',
       'Workplace practices assessment',
       'Compliance training and staff orientation'
     ]),
     pg_temp.h('Budgeting, finance, human resources and general business advisory'),
     pg_temp.p('We provide practical business advisory services that help an organisation plan its money, manage its people and run its operations properly.'),
     pg_temp.ul(array[
       'Business budgeting and financial planning',
       'Budget preparation and monitoring',
       'Basic financial management advisory',
       'Human resources management',
       'Staff planning and organisational development',
       'Business planning',
       'Business operations advisory',
       'General management consultancy',
       'Business improvement and growth strategies'
     ]),
     pg_temp.h('How a consultancy engagement runs'),
     pg_temp.ol(array[
       'A short conversation about the business and what is actually in the way.',
       'A written scope, so both sides know what is included.',
       'The work: documents, training, plans, reviews and follow-up.',
       'A plain report of what was done and what to do next.'
     ])
   ]), 3),

  ('agency', 'Property sales, rentals and agency', 'property-sales-and-rentals',
   'Professional property agency and brokerage for clients looking to buy, sell, rent or manage land, houses, commercial property, apartments and rooms.',
   array[
     'Land',
     'Houses for sale and rent',
     'Commercial property',
     'Apartments and rooms',
     'Property searches and sourcing',
     'Landlord and owner support'
   ],
   pg_temp.doc(array[
     pg_temp.h('Land'),
     pg_temp.ul(array[
       'Land sales and acquisition support',
       'Land sourcing',
       'Property searches',
       'Buyer and seller coordination',
       'Land transaction facilitation',
       'Property documentation support'
     ]),
     pg_temp.h('Houses and buildings'),
     pg_temp.ul(array[
       'Houses for sale',
       'Houses for rent',
       'Commercial properties',
       'Apartments and rooms',
       'Property sourcing and viewing coordination',
       'Buyer and tenant representation',
       'Landlord and property owner support'
     ]),
     pg_temp.h('How we work as agents'),
     pg_temp.p('We connect property owners, buyers, landlords and prospective tenants, and we support the transaction process with proper documentation and professional coordination. One point of contact, from the first viewing to the paperwork.')
   ]), 1),

  ('agency', 'Automobile sales and agency', 'automobile-sales-and-agency',
   'Cars, vehicle sourcing and buyer and seller agency for individuals and businesses, including corporate and personal vehicle sourcing.',
   array[
     'Cars for sale',
     'Vehicle sourcing',
     'Buyer and seller agency',
     'Vehicle marketing',
     'Inspection and documentation support',
     'Negotiation and transaction coordination'
   ],
   pg_temp.doc(array[
     pg_temp.h('Our services'),
     pg_temp.ul(array[
       'Cars for sale',
       'Vehicle sourcing',
       'Buyer and seller agency',
       'Vehicle sales facilitation',
       'Vehicle advertising and marketing',
       'Assistance with vehicle inspection and documentation',
       'Corporate and personal vehicle sourcing',
       'Negotiation and transaction coordination'
     ]),
     pg_temp.h('Our role'),
     pg_temp.p('We help clients find suitable vehicles and facilitate communication and transactions between buyers and vehicle owners or sellers. You tell us the make, model and budget; we do the searching and the dealing.')
   ]), 2),

  ('agency', 'General agency and business facilitation', 'general-agency-and-business-facilitation',
   'Connecting clients with suitable contractors, professionals, suppliers and business opportunities, with proper coordination from start to finish.',
   array[
     'Contractor sourcing',
     'Professional referrals',
     'Supplier connections',
     'Business opportunities',
     'Facilitation and coordination'
   ],
   pg_temp.doc(array[
     pg_temp.h('What we facilitate'),
     pg_temp.p('General agency and business facilitation means putting the right client in front of the right counterparty, and keeping the process moving. We connect clients with suitable properties, vehicles, contractors, professionals, suppliers and business opportunities.'),
     pg_temp.ul(array[
       'Contractors and service providers for building and maintenance work',
       'Professionals for accounting, legal, engineering and advisory work',
       'Suppliers for materials, equipment and office needs',
       'Business opportunities, partnerships and introductions',
       'Facilitation, follow-up and coordination between the parties'
     ]),
     pg_temp.h('How our approach works'),
     pg_temp.p('Every facilitation is built on trust, transparency, professionalism, proper coordination and client satisfaction. We introduce both sides, we stay involved until the arrangement is settled, and we keep the record of what was agreed.')
   ]), 3)
on conflict (slug) do update
  set kind = excluded.kind,
      title = excluded.title,
      summary = excluded.summary,
      scope = excluded.scope,
      body = excluded.body,
      sort_order = excluded.sort_order;

-- ---------------------------------------------------------------- pages

insert into pages (title, slug, subtitle, template, content, published, show_in_nav, nav_label, nav_order) values
  ('About', 'about', 'Who we are, what we do, and how we work.', 'standard',
   pg_temp.doc(array[
     pg_temp.h('Who we are'),
     pg_temp.p('Deusy & Planners Services is a multidisciplinary business providing construction and real estate, human resources management, and business consultancy services to individuals, businesses, institutions and organisations.'),
     pg_temp.p('Our goal is to provide practical, professional and reliable solutions that help our clients plan effectively, comply with applicable requirements, manage resources efficiently, and achieve sustainable business growth.'),
     pg_temp.h('Our core services'),
     pg_temp.h('Construction and real estate', 3),
     pg_temp.p('We provide services in the construction and real estate sector, including:'),
     pg_temp.ul(array[
       'Building and construction services',
       'Construction project planning and coordination',
       'Property development and management support',
       'Real estate consultancy',
       'Building and construction advisory',
       'Project supervision and general construction support'
     ]),
     pg_temp.h('Consultancy services', 3),
     pg_temp.p('We provide professional consultancy and advisory services in two areas: training, inspection readiness and labour compliance; and budgeting, finance, human resources and general business advisory.'),
     pg_temp.h('Human resources management', 3),
     pg_temp.p('Our human resources services support organisations in effectively managing their workforce, from recruitment and staffing to policies, training, performance management and workplace relations.'),
     pg_temp.h('Agency services', 3),
     pg_temp.p('Alongside the practices we run property sales, rentals and agency, automobile sales and agency, and general agency and business facilitation.'),
     pg_temp.h('Our mission'),
     pg_temp.p('To provide reliable, practical, and professional construction, real estate, human resources, and consultancy solutions that create value for our clients and contribute to sustainable business development.'),
     pg_temp.h('Our vision'),
     pg_temp.p('To become a trusted and respected Ghanaian service provider in construction, real estate, human resources, and business consultancy, recognized for professionalism, integrity, efficiency, and client-focused solutions.'),
     pg_temp.h('Our values'),
     pg_temp.ul(array[
       'Integrity',
       'Professionalism',
       'Reliability',
       'Accountability',
       'Excellence',
       'Client satisfaction'
     ]),
     pg_temp.h('Our service promise'),
     pg_temp.quote('At Deusy & Planners Services, we believe that every client deserves practical advice, proper planning, and dependable service. We work closely with our clients to understand their needs and provide solutions that are efficient, transparent, and results-oriented.')
   ]), true, true, 'About', 1),

  ('Our team', 'team', 'The people behind the work, and how the company is structured.', 'standard',
   pg_temp.doc(array[
     pg_temp.h('Our people'),
     pg_temp.p('Deusy & Planners Services is run by people who have spent their careers in finance, administration, human resources, business development, real estate and education. The profiles below are the people clients deal with directly.'),
     pg_temp.h('How we are structured'),
     pg_temp.p('One managing director sets the direction. Three managers, administration, finance and liaison, carry the day-to-day work. Under them sit the service lines: construction and real estate, human resources, and consultancy, alongside the agency services.'),
     pg_temp.h('Managing Director', 3),
     pg_temp.p('Overall leadership, strategy and business performance. Sets the vision and objectives, supervises all departments and senior staff, approves major projects, contracts and budgets, develops relationships with clients, investors, contractors and institutions, identifies new business and investment opportunities, and ensures the company complies with applicable laws, regulations and professional standards.'),
     pg_temp.h('Administrator', 3),
     pg_temp.p('Day-to-day administrative operations. Maintains company records, correspondence, files and official documents, coordinates office activities and schedules, prepares agendas, minutes, reports and letters, supports recruitment, onboarding, attendance and employee records, coordinates meetings between management, staff, clients and service providers, and assists the managing director and managers in implementing company decisions.'),
     pg_temp.h('Finance Manager', 3),
     pg_temp.p('Financial management, budgeting, controls and reporting. Prepares and manages annual and project budgets, monitors income, expenditure, cash flow and financial commitments, maintains accurate financial records, prepares management accounts and financial reports, monitors project costs, prepares quotations, invoices and payment schedules, monitors receivables and payables, establishes financial controls to protect company funds and assets, and coordinates with accountants, auditors, banks, suppliers and relevant authorities.'),
     pg_temp.h('Liaison Manager', 3),
     pg_temp.p('Coordination between the company, clients, government agencies, contractors, consultants and other stakeholders. Serves as the key communication link to external parties, follows up on permits, approvals, registrations, inspections and official correspondence, assists with labour and workplace inspection-readiness activities, coordinates meetings and appointments with external stakeholders, monitors outstanding requests and approvals, and resolves communication and coordination problems before they cost the company a project.')
   ]), true, true, 'Our team', 2),

  ('FAQ', 'faq', 'Straight answers to the questions we are asked most.', 'faq',
   pg_temp.doc(array[
     pg_temp.p('These are the questions we are asked most. If your question is not answered here, send it to us through the contact page and we will answer it directly.')
   ]), true, true, 'FAQ', 3),

  ('Contact', 'contact', 'Tell us what you are planning.', 'contact',
   pg_temp.doc(array[
     pg_temp.p('Tell us what you are planning and we will take it from there. Give us a short description of the property, the vehicle or the business problem you are dealing with, and the team will come back to you.')
   ]), true, true, 'Contact', 4)
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
   'We are a multidisciplinary business providing construction and real estate, human resources management, and business consultancy services, alongside property sales, rentals and agency, automobile sales and agency, and general agency and business facilitation.',
   1),
  ('Who do you work with?',
   'Individuals, businesses, institutions and organisations across Ghana. That includes people buying, selling or renting property, people looking for a vehicle, and organisations that need construction, real estate, human resources or consultancy support.',
   2),
  ('What does your construction and real estate practice cover?',
   'Building and construction services, construction project planning and coordination, property development and management support, real estate consultancy, building and construction advisory, and project supervision and general construction support.',
   3),
  ('What does your consultancy practice cover?',
   'Two areas. First, training, inspection readiness and labour compliance, covering labour compliance advisory, inspection-readiness training, workplace documentation, HR policies and procedures, employee records and staff orientation. Second, budgeting, finance, human resources and general business advisory, covering budgeting and financial planning, financial management advisory, business planning, operations advisory, general management consultancy and business growth strategies.',
   4),
  ('What does your human resources practice cover?',
   'Recruitment and staffing support, employee management, HR policy development, staff training and development, performance management support, employee documentation, workplace relations advisory and HR compliance support.',
   5),
  ('How does your property service work?',
   'We act as the agent between the two sides, covering land, houses, commercial property, apartments and rooms, for sale and for rent. We handle property searches, sourcing, viewing coordination, negotiation, transaction facilitation and the documentation around the deal.',
   6),
  ('How does your automobile service work?',
   'We source the vehicle and bring buyers and sellers together so the deal moves through one point of contact instead of several. Start on the contact page with the make, model and budget you are working with, or the vehicle you are selling. We also handle vehicle marketing, inspection and documentation support, and negotiation.',
   7),
  ('What is general agency and business facilitation?',
   'It is the work of connecting clients with suitable contractors, professionals, suppliers and business opportunities, and then coordinating the arrangement properly. We introduce both sides, stay involved until it is settled, and keep the record of what was agreed.',
   8),
  ('How do I start a consultation?',
   'Use the contact page. Choose the topic that matches your need, describe the situation in your own words and send it. The enquiry reaches the team directly and someone will pick it up from there.',
   9),
  ('Can you help with labour inspection readiness?',
   'Yes. We prepare workplaces for inspections by reviewing labour compliance, building the required workplace documentation, putting HR policies and procedures in place, organising employee records and running compliance training and staff orientation.',
   10),
  ('Who will be working on my project?',
   'Our people. The company is led by a managing director, supported by an administrator, a finance manager and a liaison manager, and organised around our three practices: construction and real estate, human resources, and consultancy. You can read the profiles on the team page.',
   11),
  ('Where are you based?',
   'We are at Pantang Shalom Junction, Accra, Ghana, and our postal address is P.O. Box AF 1921, Adenta, Ghana.',
   12),
  ('What do you stand for?',
   'Integrity, professionalism, reliability, accountability, excellence and client satisfaction. Our service promise is simple: every client deserves practical advice, proper planning and dependable service, delivered efficiently, transparently and with results in mind.',
   13);

-- ---------------------------------------------------------------- team

-- Names are matched instead of a unique constraint, so re-running the seed
-- does not duplicate people who are already listed.
insert into team_members (name, role, bio, sort_order)
select seed.name, seed.role, seed.bio, seed.sort_order
from (values
  ('Eric Semanu-Uzziah Dornyo',
   'Managing Director',
   'Results-oriented entrepreneur, marketing and business development professional, financial services practitioner and consultant with over 20 years of experience spanning microfinance, sales and marketing, real estate, entrepreneurship, business consultancy and strategic planning. He holds a degree in marketing, a postgraduate certificate in banking and finance, a professional certificate in stock market practice and a certificate in real estate development, alongside a diploma in theology. His career includes direct sales at Barclays Bank Ghana and co-founding Besworth Investments Services and Barak Deusy Services. He advises businesses, NGOs and churches on growth, structure and opportunity, and works on the principle that there is an opportunity in every difficult situation.',
   1),
  ('Raphael Cameron Etse',
   'Finance, Administration and Operations Manager',
   'Ghanaian finance, administration and operations leader with more than 20 years of progressive experience bridging international humanitarian operations and private sector management. He spent eight years with the United Nations as Administrative and Finance Officer with OCHA, Finance Officer with ONUCI in Cote d''Ivoire and UNMIK Kosovo, and Assistant Admin and Finance Officer with UNESCO, supervising finance, human resources, logistics, procurement, travel and general administration for missions of over 160 national and international staff across 15 field duty stations. He prepared and managed annual cost plans from 2010 to 2017, established internal controls that achieved full compliance, led the deployment of the UN Secretariat ERP in Niger in 2015, and delivered measurable efficiencies including monthly savings in the Democratic Republic of the Congo and debt recovery in Chad. He coordinated administrative operations for the L3 emergency response in the Central African Republic in 2014 and led the full closure and liquidation of OCHA offices in Uganda and Zimbabwe. Since January 2019 he has been finance and administrative manager at Deusy Investment Services Ltd in Ghana, leading financial management, budgeting, cash flow forecasting, contractor and procurement management and full human resources operations for a construction and real estate portfolio, and he leads the firm''s business consultancy practice. He is fluent in English and French.',
   2),
  ('Courage Sena Kwame Godzo',
   'French Instructor, Educator and Community Development Advocate',
   'An experienced French instructor with over 20 years of professional teaching experience and a Diplome Universitaire des Etudes Francaises from the Centre Beninois des Langues Etrangeres, Cotonou. He also pursued a degree in French and Information Studies at the University of Ghana, Legon. Courage is passionate about education, language development, youth empowerment, leadership and community development, and has dedicated his career to helping learners develop real French language and communication skills while promoting cultural understanding and academic excellence. His interests extend to educational advocacy, public communication, community development, entrepreneurship and leadership, and he is committed to using his experience, knowledge and leadership to inspire individuals, strengthen communities and create opportunities for sustainable development.',
   3)
) as seed(name, role, bio, sort_order)
where not exists (select 1 from team_members t where t.name = seed.name);

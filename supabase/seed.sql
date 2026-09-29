-- Deusy & Planners Services: the FAQ list.
-- Run after 0001_init.sql.
--
-- The pages, services, team and settings are written in the frontend
-- (src/lib/content/fallback.ts), so this file only seeds the one thing the
-- admin panel manages: the FAQ list. Safe to re-run, matched on the question.

insert into faqs (question, answer, sort_order)
select seed.question, seed.answer, seed.sort_order
from (values
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
   13)
) as seed(question, answer, sort_order)
where not exists (
  select 1 from faqs f where f.question = seed.question
);

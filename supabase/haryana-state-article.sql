-- ============================================================================
-- Haryana STATE page blog article, full text
-- ============================================================================
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- This targets the STATE page only:  /virtual-office/haryana
--
-- StateTemplate.jsx reads its article with:
--     useBlogArticle({ pageType: 'city', citySlug: stateSlug })
-- ...where stateSlug is 'haryana'. So the row below uses
--     page_type = 'city'  AND  city_slug = 'haryana'
--
-- Only ONE row is inserted (no 'coworking' row), because the state page is the
-- only page that reads city_slug = 'haryana'. Individual Haryana city pages
-- (Gurgaon, Faridabad, ...) read their own city_slug and are NOT affected.
--
-- Before this row exists the state page falls back to auto-generated default
-- content; inserting it replaces that default.
--
-- The content column may be JSONB or TEXT depending on how the table was
-- created, so this script checks the column type and inserts the correct form.
-- Re-running it is safe: the DELETE clears the old row first.
-- ============================================================================

DO $do$
DECLARE
  col_type text;
  md text := $md$
# AI Overview

A Virtual Office in Haryana provides businesses with a professional commercial address that can be used for official business correspondence and, where applicable, for company and GST registration with the required documentation. It allows startups, freelancers, consultants, MSMEs, and expanding companies to establish a credible business presence without the cost of renting a traditional office.

As one of India's fastest-growing industrial and commercial states, Haryana offers excellent opportunities for businesses across sectors such as IT, manufacturing, logistics, e-commerce, consulting, healthcare, and professional services. Cities like Gurugram, Faridabad, Sonipat, Panipat, Karnal, Ambala, Hisar, Rohtak, and Manesar have become attractive destinations for businesses due to their connectivity, infrastructure, and proximity to Delhi.

Whether you're launching a new venture or expanding into North India, a virtual office in Haryana helps you reduce operational costs while building a strong professional image.

# Why Haryana Is One of India's Best Business Destinations

Haryana has transformed into one of India's leading business and industrial hubs over the past two decades.

Its strategic location around the National Capital Region (NCR), strong infrastructure, industrial corridors, and excellent connectivity have attracted thousands of domestic and international businesses.

## Key Advantages of Haryana

- Strategic location adjoining Delhi
- Well-developed industrial infrastructure
- Excellent road connectivity through national highways
- Strong manufacturing ecosystem
- Growing IT and startup ecosystem
- Availability of skilled workforce
- Presence of multinational corporations
- Excellent logistics network

These advantages make Haryana an ideal location for companies looking to establish a business presence without necessarily investing in expensive office infrastructure.

# What Is a Virtual Office?

A Virtual Office is a business solution that provides a company with a professional commercial business address and related office services without requiring a dedicated physical workspace.

Instead of leasing a traditional office, businesses can use a commercial address for official correspondence and branding while operating remotely or through hybrid work models.

Depending on the provider and plan, a virtual office may include:

- Professional business address
- Registered office address
- Documentation for company registration (where applicable)
- Documentation for GST registration (where applicable)
- Mail and courier handling
- Reception support
- Meeting room access
- Business correspondence management

This enables businesses to project a professional image while significantly reducing operational expenses.

# Why Businesses Are Choosing Virtual Offices in Haryana

The modern workplace has changed significantly.

Remote work, digital collaboration tools, and cloud-based operations mean many businesses no longer need permanent office space. However, they still require a credible business address for customers, vendors, and regulatory purposes.

A virtual office bridges this gap by offering:

- Professional branding
- Cost savings
- Operational flexibility
- Market expansion opportunities
- Improved business credibility

# Benefits of a Virtual Office in Haryana

## 1. Professional Business Address

Your business address is often one of the first things customers notice.

A commercial address in Haryana creates a stronger first impression than a residential address and enhances your brand's credibility.

## 2. Significant Cost Savings

A virtual office eliminates many of the costs associated with maintaining a traditional office, including:

- Office rent
- Security deposits
- Furniture
- Utilities
- Internet
- Office maintenance

Businesses can redirect these savings toward growth initiatives such as marketing, hiring, and technology.

## 3. Ideal for Startups

New businesses often operate with limited budgets.

A virtual office allows startups to establish a professional presence while preserving capital for product development and customer acquisition.

## 4. Supports Business Expansion

Companies looking to enter the Haryana market can establish a local presence without opening a full-fledged branch office.

This makes expansion faster and more cost-effective.

## 5. Better Customer Confidence

Customers and partners are more likely to trust businesses that operate from a recognized commercial location.

A professional business address contributes to a stronger corporate image.

## 6. Flexibility for Remote Teams

Many organizations now operate with distributed teams.

A virtual office allows employees to work from anywhere while maintaining a consistent business identity.

## 7. Privacy Protection

Entrepreneurs working from home can keep their residential address private by using a commercial business address for official purposes.

# Why Haryana Is Ideal for Business Expansion

Haryana's strategic location provides access to one of India's largest consumer and business markets.

Businesses benefit from proximity to:

- Delhi
- Noida
- Ghaziabad
- Greater Noida
- Gurugram
- Faridabad

This allows companies to serve clients across the NCR while maintaining a professional presence in Haryana.

# Major Business Cities in Haryana

## Gurugram

Known as the corporate capital of Haryana, Gurugram is home to multinational companies, IT firms, startups, and Fortune 500 organizations.

It is ideal for businesses seeking a premium commercial presence.

## Faridabad

One of Haryana's oldest industrial cities, Faridabad offers opportunities in manufacturing, engineering, logistics, and services.

## Manesar

A major industrial hub with a strong automotive and manufacturing ecosystem.

## Sonipat

Rapidly developing due to its proximity to Delhi and growing industrial infrastructure.

## Panipat

Well-known for textiles, manufacturing, and export-oriented businesses.

## Karnal

Emerging as an important commercial and agricultural business center.

## Ambala

Strategically located with strong logistics and wholesale trade activity.

## Hisar

A growing business destination for education, healthcare, and regional commerce.

## Rohtak

An expanding commercial city with increasing opportunities in education, healthcare, retail, and services.

# Who Can Benefit from a Virtual Office in Haryana?

A virtual office is suitable for businesses of all sizes and across various industries.

## Startups

Establish credibility without investing heavily in office infrastructure.

## Freelancers

Present a professional image while working remotely.

## Consultants

Use a commercial address for proposals, invoices, and client communication.

## IT & Software Companies

Support remote teams while maintaining a corporate identity.

## Digital Marketing Agencies

Operate efficiently without maintaining a physical office.

## E-commerce Businesses

Expand into Haryana without opening a traditional office.

## Chartered Accountants & Company Secretaries

Use a professional business address for official communication and client interactions.

## Law Firms

Strengthen brand perception with a recognized commercial address.

## Manufacturers

Create administrative or sales offices before investing in larger operational facilities.

## International Companies

Establish a local business presence while exploring opportunities in the Indian market.

# Why a Professional Business Address Matters

A business address influences how customers, investors, vendors, and financial institutions perceive your company.

A professional commercial address can:

- Enhance credibility
- Improve brand image
- Build customer trust
- Strengthen corporate identity
- Support long-term business growth

For many businesses, it becomes an important part of their overall branding strategy.

# Key Takeaways

- A virtual office in Haryana provides a professional commercial address without the need for a permanent office.
- Haryana's strategic location, strong infrastructure, and thriving industrial ecosystem make it an attractive destination for businesses.
- Startups, freelancers, consultants, MSMEs, and expanding enterprises can all benefit from a virtual office.
- Businesses can reduce operational costs while maintaining a credible and professional presence.
- Choosing the right provider ensures access to reliable documentation, business support services, and flexible plans.

# Why Businesses Choose a Virtual Office in Haryana

Businesses today are increasingly focused on reducing operational costs while maintaining professionalism.

Instead of investing in expensive office rentals, companies are choosing virtual office solutions because they offer:

- Professional commercial business address
- Improved brand credibility
- Business expansion without physical offices
- Flexible work environment
- Lower operating costs
- Access to office support services

This makes virtual offices particularly attractive for startups, digital-first businesses, consultants, and companies entering the Haryana market.

# Virtual Office for Company Registration in Haryana

Every company registered in India must provide an official registered office address.

A virtual office can often be used as the registered office, provided:

- The provider offers a legitimate commercial address.
- The required documentation is available.
- The business complies with the applicable Ministry of Corporate Affairs (MCA) regulations.

Many entrepreneurs prefer this approach because it allows them to establish a legal business presence without leasing a permanent office.

## Businesses That Commonly Use Virtual Offices

- Private Limited Companies
- One Person Companies (OPC)
- Limited Liability Partnerships (LLPs)
- Partnership Firms
- Proprietorships
- Startups
- MSMEs
- Consulting Firms

# Virtual Office for GST Registration in Haryana

GST registration is often required for businesses based on turnover, interstate operations, or the nature of their activities.

Many virtual office providers supply documentation that may support GST registration, subject to current GST rules and local verification requirements.

Typical provider documents include:

- Rent Agreement
- No Objection Certificate (NOC)
- Utility Bill
- Address Proof

Before proceeding, always confirm that your provider offers documentation suitable for your intended registration purpose.

# Documents Required

The exact requirements depend on the type of business and the intended use of the virtual office.

## Documents Commonly Required from the Customer

- PAN Card
- Aadhaar Card
- Passport-size Photograph
- Mobile Number
- Email Address
- Business incorporation documents (if applicable)

## Documents Typically Provided by the Virtual Office Provider

- Rent Agreement
- No Objection Certificate (NOC)
- Utility Bill
- Commercial Address Proof

Requirements may change based on government regulations, so verify the latest documentation before applying.

# Step-by-Step Process to Get a Virtual Office in Haryana

## Step 1: Select Your Preferred Business Location

Choose a location based on your target customers, industry, and branding goals.

Popular commercial locations include:

- Gurugram
- Faridabad
- Manesar
- Sonipat
- Panipat
- Karnal
- Ambala
- Hisar
- Rohtak

## Step 2: Choose a Suitable Plan

Compare plans based on:

- Business address
- Mail handling
- Meeting room access
- Documentation support
- Customer assistance

Select a plan that aligns with your current business needs and future growth.

## Step 3: Complete KYC Verification

Submit the required identity and business documents for verification.

## Step 4: Receive Documentation

Once verification is complete, the provider issues the relevant documentation included with your plan.

## Step 5: Start Using Your Business Address

You can then use your virtual office address on:

- Business registration documents (where applicable)
- GST registration (subject to compliance)
- Website
- Business cards
- Invoices
- Letterheads
- Marketing materials
- Email signatures

# Top Commercial Locations for Virtual Offices in Haryana

## Gurugram

Gurugram is one of India's leading corporate destinations, home to multinational companies, startups, IT firms, and financial institutions. A business address here enhances credibility and brand value.

Best for:

- IT Companies
- Startups
- Consulting Firms
- SaaS Businesses
- International Companies

## Faridabad

Faridabad has a strong industrial base and is ideal for manufacturing, engineering, logistics, and trading businesses.

Best for:

- Manufacturers
- Exporters
- Engineering Firms
- Logistics Companies

## Manesar

Known for its industrial parks and automotive sector, Manesar is a strategic location for businesses involved in manufacturing and supply chains.

## Sonipat

Sonipat is rapidly developing due to its proximity to Delhi and improved infrastructure.

Best for:

- Warehousing
- Education
- Retail
- E-commerce

## Panipat

Panipat is famous for textiles, carpets, and manufacturing.

Businesses targeting export markets often choose this region.

## Karnal

Karnal offers opportunities in agriculture, food processing, healthcare, and regional commerce.

## Ambala

Ambala's strategic location makes it a key center for logistics, wholesale trade, and regional distribution.

## Hisar

Hisar is an emerging commercial city with growing opportunities in education, healthcare, agriculture, and professional services.

## Rohtak

Rohtak is becoming an important destination for educational institutions, healthcare providers, and service-based businesses.

# Industries That Benefit from Virtual Offices

## Information Technology (IT)

Remote teams can maintain a professional presence without leasing office space.

## Startups

Early-stage companies can reduce overhead while building credibility.

## Consulting Services

Consultants gain a commercial business address for proposals, invoices, and client communication.

## Digital Marketing Agencies

Operate remotely while presenting a professional corporate identity.

## Chartered Accountants & Company Secretaries

Enhance client confidence with a recognized business address.

## Legal Services

Law firms can strengthen their professional image while keeping operational costs manageable.

## E-commerce

Expand into Haryana without establishing a traditional office.

## Manufacturing

Set up administrative or sales operations before investing in larger facilities.

# Compliance Tips Before Choosing a Virtual Office

To avoid future issues, businesses should:

- Verify the provider's reputation.
- Confirm the address is a genuine commercial location.
- Ensure required documentation is included.
- Understand renewal terms and pricing.
- Review mail handling and meeting room policies.
- Check whether additional services are available as your business grows.

Choosing a reliable provider helps ensure smoother registration processes and long-term business support.

# Why a Commercial Address Matters

A professional business address can influence how customers, investors, banks, and partners perceive your company.

Benefits include:

- Stronger brand image
- Improved customer trust
- Better corporate identity
- Professional communication
- Enhanced credibility

For businesses operating remotely, a commercial address often serves as an important part of their overall branding strategy.

# Key Takeaways

- A virtual office in Haryana can support company registration, GST registration, and professional business communication when used in accordance with applicable regulations.
- Haryana offers multiple business-friendly cities suited to different industries and business models.
- Selecting the right location and provider is just as important as choosing the right plan.
- A virtual office helps businesses establish a credible presence while reducing operational expenses.
- Proper documentation and compliance are essential for a smooth registration process.

# Benefits of a Virtual Office in Haryana

A virtual office provides more than just a commercial address. It supports branding, operational efficiency, and business expansion, making it an attractive solution for businesses of all sizes.

## 1. Build a Professional Brand Image

Your business address is often one of the first details potential customers, investors, and partners notice.

A commercial address in a recognized business location projects professionalism and helps establish trust from the very beginning.

A premium business address can enhance:

- Customer confidence
- Corporate reputation
- Brand perception
- Investor trust
- Vendor relationships

For startups and small businesses, this professional image can make a significant difference when competing with larger organizations.

## 2. Reduce Business Expenses

One of the biggest advantages of a virtual office is the substantial reduction in operational costs.

With a traditional office, businesses typically incur expenses such as:

- Office rent
- Security deposits
- Interior setup
- Furniture
- Utility bills
- Internet charges
- Office maintenance
- Reception staff
- Cleaning services

A virtual office eliminates most of these costs, allowing businesses to invest more in growth-oriented activities.

## 3. Expand Into New Markets Easily

If your business plans to serve customers across North India, establishing a presence in Haryana can improve market reach without requiring a physical office.

A virtual office enables businesses to:

- Enter new cities quickly
- Build regional credibility
- Test new markets with lower risk
- Support local sales operations
- Strengthen customer confidence

This flexibility is particularly useful for growing startups, consulting firms, and e-commerce businesses.

## 4. Support Remote and Hybrid Teams

Many organizations now operate with employees working from different locations.

A virtual office complements this model by providing:

- A centralized business address
- Mail handling services
- Meeting room access (depending on the plan)
- A professional identity for official communication

This allows businesses to maintain consistency while giving employees the flexibility to work remotely.

## 5. Improve Privacy

Using your residential address for business purposes may expose personal information on invoices, websites, and official documents.

A virtual office helps separate your personal and professional identities, enhancing both privacy and professionalism.

## 6. Enhance Customer Confidence

Clients often associate a recognized commercial address with reliability and business stability.

A professional address can positively influence:

- Customer trust
- Vendor confidence
- Partnership opportunities
- Brand recognition

This is especially important for service-based businesses where first impressions matter.

# Virtual Office vs Traditional Office

Choosing between a virtual office and a traditional office depends on your business model and operational needs.

The following comparison highlights the key differences.

| Feature | Virtual Office | Traditional Office |
|---|---|---|
| Professional Business Address | ✔ | ✔ |
| Daily Workspace | Optional | ✔ |
| Office Rent | Low | High |
| Security Deposit | Usually Not Required | Required |
| Furniture Investment | Not Required | Required |
| Utility Bills | Usually Included | Separate Expense |
| Mail Handling | ✔ | Self Managed |
| Meeting Rooms | Available on Demand | Permanent |
| Flexibility | High | Limited |
| Suitable for Remote Teams | ✔ | Limited |
| Scalability | High | Moderate |

For businesses operating remotely or with hybrid teams, a virtual office often provides greater value and flexibility.

# Pricing Comparison

While pricing varies by city, location, and provider, a virtual office is generally much more affordable than leasing and maintaining a conventional office.

## Estimated Cost Comparison

| Expense | Virtual Office | Traditional Office |
|---|---|---|
| Office Rent | Low | High |
| Security Deposit | Minimal or None | High |
| Furniture | Not Required | Required |
| Utilities | Often Included | Paid Separately |
| Internet | Often Included | Separate Expense |
| Office Maintenance | Included in Many Plans | Business Responsibility |
| Reception Services | Included in Some Plans | Additional Cost |
| Mail Handling | Included | Self Managed |
| Overall Operating Cost | Low | High |

By reducing fixed overhead, businesses can allocate more resources toward marketing, hiring, technology, and customer acquisition.

# Real Business Scenarios

## Scenario 1: Startup Launch

A technology startup based in Haryana wanted a professional business address but preferred to keep its team fully remote.

Instead of leasing office space, the founders chose a virtual office, allowing them to:

- Establish a credible business presence
- Reduce monthly operating costs
- Invest additional funds into product development and marketing

## Scenario 2: Consultant Expanding Across NCR

A business consultant serving clients across Delhi NCR wanted a commercial address in Haryana to strengthen local credibility.

By using a virtual office, the consultant gained:

- A professional business address
- Access to meeting facilities when required
- Improved brand image without long-term lease commitments

## Scenario 3: E-commerce Business Expansion

An online retailer expanded into Haryana to improve regional operations.

Rather than opening a full branch office immediately, the company established a virtual office to create a local presence while evaluating market demand.

# Common Mistakes to Avoid

Choosing the wrong virtual office provider can affect your business operations and customer experience.

Avoid these common mistakes:

## Choosing Only Based on Price

The lowest-cost option may not include essential services such as documentation support, mail handling, or meeting room access.

## Ignoring Business Location

Select a location that aligns with your target customers and strengthens your brand image.

## Not Reviewing the Service Agreement

Understand what services are included, renewal terms, and any additional charges before making a decision.

## Overlooking Future Growth

Choose a provider that offers scalable solutions, allowing you to upgrade services as your business expands.

# Why Virtual Offices Represent the Future of Business

The way businesses operate continues to evolve.

Organizations increasingly value:

- Flexibility
- Digital collaboration
- Cost efficiency
- Sustainable growth
- Geographic expansion

Virtual offices support these trends by enabling businesses to operate professionally without unnecessary infrastructure costs.

As hybrid and remote work become more common, virtual offices are expected to remain an important part of modern business strategies.

# Why Choose Ease My Office

Ease My Office helps businesses establish a professional presence with flexible virtual office solutions tailored to different business needs.

## Key Features

- Premium commercial addresses in leading business locations
- Documentation support for company and GST registration (subject to applicable regulations)
- Mail and courier handling
- Access to meeting rooms
- Flexible plans for startups, freelancers, SMEs, and enterprises
- Dedicated customer support

Whether you're starting a new business or expanding into Haryana, Ease My Office provides solutions designed to support long-term growth.

# Key Takeaways

- A virtual office helps businesses build credibility while reducing operational costs.
- Haryana's strategic location and business-friendly environment make it an ideal destination for startups and expanding companies.
- Virtual offices are particularly valuable for remote businesses, consultants, freelancers, and e-commerce companies.
- Choosing a reputable provider ensures reliable documentation, professional support, and flexibility as your business grows.
- Investing in a virtual office is not just about saving money—it's about creating a scalable, professional foundation for future success.

# Frequently Asked Questions (FAQs)

## 1. What is a virtual office in Haryana?

A virtual office in Haryana is a service that provides businesses with a professional commercial address and supporting office services without requiring them to rent a permanent physical office. Depending on the provider and plan, services may include mail handling, meeting room access, and documentation for business registrations.

## 2. Is a virtual office legal in Haryana?

Yes. Virtual offices are legal when they operate from legitimate commercial premises and are used in accordance with applicable laws and regulations. Businesses should always choose a trusted provider that offers compliant documentation and transparent services.

## 3. Can I use a virtual office for company registration in Haryana?

Yes. Many businesses use a virtual office as their registered office, provided the provider supplies the required documentation and the arrangement complies with Ministry of Corporate Affairs (MCA) requirements.

## 4. Can a virtual office be used for GST registration?

Many virtual office providers offer documentation that supports GST registration. However, GST applications are subject to verification and compliance with current GST regulations. Always confirm with your provider that the required documents are included.

## 5. What documents are generally required?

Customer Documents

- PAN Card
- Aadhaar Card
- Passport-size Photograph
- Mobile Number
- Email Address

Documents Commonly Provided by the Provider

- Rent Agreement
- No Objection Certificate (NOC)
- Utility Bill
- Commercial Address Proof

Documentation requirements may vary depending on the business structure and applicable regulations.

## 6. How much does a virtual office cost in Haryana?

The cost depends on factors such as:

- City and location
- Services included
- Plan duration
- Meeting room access
- Mail handling
- Documentation support

When comparing providers, focus on overall value rather than the lowest price.

## 7. Is a virtual office suitable for startups?

Yes. Virtual offices are especially beneficial for startups because they reduce fixed costs while helping establish a professional business presence. This allows founders to invest more in product development, marketing, and customer acquisition.

## 8. Can freelancers use a virtual office?

Absolutely. Freelancers benefit from:

- A professional commercial address
- Better brand perception
- Greater privacy
- Improved client confidence
- A dedicated business identity

## 9. Can I open a bank account using a virtual office address?

Banks have their own documentation and verification requirements. Many businesses successfully use their registered business address during account opening, but you should confirm the latest requirements with your chosen bank.

## 10. Which city in Haryana is best for a virtual office?

The best location depends on your target customers and business goals.

Popular business destinations include:

- Gurugram
- Faridabad
- Manesar
- Sonipat
- Panipat
- Karnal
- Ambala
- Hisar
- Rohtak

Choose a location that aligns with your industry, market, and expansion strategy.

## 11. How quickly can I receive my virtual office documents?

After completing KYC verification and submitting the required information, many providers issue documentation within a few working days. Timelines may vary depending on the provider and application details.

## 12. Is a virtual office better than a coworking space?

If your business primarily needs a professional address, mail handling, and occasional meeting room access, a virtual office is often the more cost-effective option.

If you require a dedicated workspace every day, a coworking space may be more suitable.

## 13. Can I change my registered office later?

Yes. Businesses can change their registered office by following the applicable legal procedures and updating the relevant authorities as required.

## 14. Can one company have multiple office locations?

Yes. Many companies operate with:

- One Registered Office
- One Corporate Office
- Multiple Branch Offices
- Several Virtual Offices in different cities

This helps businesses expand while maintaining operational efficiency.

## 15. Why should I choose a virtual office instead of renting a traditional office?

A virtual office offers several advantages:

- Lower operating costs
- Professional commercial address
- Greater flexibility
- Easy expansion into new cities
- Better brand credibility
- Reduced administrative burden

For many startups and service-based businesses, it provides the ideal balance between professionalism and affordability.

# Summary

A Virtual Office in Haryana is an excellent solution for businesses looking to establish a professional presence without the high costs of traditional office space.

Whether you're a startup, freelancer, consultant, MSME, or expanding enterprise, a virtual office can help you:

- Build credibility with a commercial business address.
- Reduce operational expenses.
- Support remote and hybrid work models.
- Expand into Haryana's growing business ecosystem.
- Access essential office services such as mail handling and meeting rooms.
- Obtain documentation commonly required for company and GST registration, subject to applicable regulations.

With its strategic location, strong infrastructure, and rapidly growing commercial centers, Haryana offers an ideal environment for businesses seeking sustainable growth and regional expansion.

# Why Choose Ease My Office?

Ease My Office provides flexible virtual office solutions tailored to the needs of modern businesses.

## Our Key Advantages

- Premium business addresses in leading commercial locations across Haryana.
- Documentation support for company and GST registration (subject to regulatory requirements).
- Professional mail and courier handling.
- Access to meeting rooms for client interactions and presentations.
- Flexible plans designed for startups, freelancers, SMEs, and enterprises.
- Responsive customer support throughout your business journey.

Whether you're launching a new venture or expanding into Haryana, Ease My Office helps you establish a credible and professional business presence.

# Ready to Establish Your Business in Haryana?

A professional business address can make a lasting impression on customers, investors, and partners while helping you reduce costs and operate more efficiently.

Contact Ease My Office today to explore virtual office solutions in Haryana and choose a plan that matches your business goals.
$md$;

  article_title text := 'Virtual Office in Haryana: Complete 2026 Guide for GST Registration, Company Registration & Business Growth';
  article_subtitle text := 'A Virtual Office in Haryana provides businesses with a professional commercial address that can be used for official business correspondence and, where applicable, for company and GST registration with the required documentation. It allows startups, freelancers, consultants, MSMEs, and expanding companies to establish a credible business presence without the cost of renting a traditional office.';
BEGIN
  -- Clear any previous Haryana state row so this script can be re-run safely.
  -- Scoped to city_slug = 'haryana' only: individual Haryana city pages
  -- (gurgaon, faridabad, ...) use their own city_slug and are untouched.
  DELETE FROM blog_articles
   WHERE city_slug = 'haryana';

  SELECT data_type INTO col_type
    FROM information_schema.columns
   WHERE table_name = 'blog_articles'
     AND column_name = 'content';

  IF col_type = 'jsonb' OR col_type = 'json' THEN
    INSERT INTO blog_articles
      (page_type, city_slug, title, eyebrow, subtitle, content, content_format)
    VALUES
      ('city', 'haryana', article_title, 'Guide', article_subtitle, to_jsonb(md), 'markdown');
  ELSE
    INSERT INTO blog_articles
      (page_type, city_slug, title, eyebrow, subtitle, content, content_format)
    VALUES
      ('city', 'haryana', article_title, 'Guide', article_subtitle, md, 'markdown');
  END IF;

  RAISE NOTICE 'Haryana state article inserted. content column type: %', col_type;
END
$do$;

-- Verify: should return exactly 1 row with a large character_count.
SELECT page_type,
       city_slug,
       title,
       length(content::text) AS character_count
  FROM blog_articles
 WHERE city_slug = 'haryana';

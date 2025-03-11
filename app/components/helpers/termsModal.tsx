'use client'

import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { PolicyState } from '../atoms/atoms';
import { motion, AnimatePresence } from 'framer-motion';

const policyText = `privacy policy
Cookies Policy, Privacy Policy and POPIA disclaimer
Cookie policy
We use cookies to make your experience with us better. By continuing to use our website without changing the settings, you are agreeing to our use of cookies.
introduction
Need to Fuel Proprietary Limited (NtF or we) respects the right to privacy and confidentiality and is committed to protecting your privacy, by ensuring that your personal information is collected and processed properly, lawfully and transparently. We subscribe to the conditions of the Protection of Personal Information Act (POPIA) to ensure that you are always protected when providing us with personal information.
This Privacy Statement serves as a notification to you as required by Section 18 of POPIA, it explains the steps we take to protect personal information we collect and is addressed to you as a customer, business partner and a user of our website or business processes. The Privacy Policy is available at https://www.needtofuel.com (Website). It describes the manner in which we collect, process, store, use and protect personal information which we collect, the purposes for which we use it, your rights regarding your personal information, our security measures, and how you can review and correct your personal information.
data collection
When used in this Privacy Policy, the term "personal information" has the meaning given to it in the POPIA. Generally speaking, personal information is any information relating to an identifiable, living natural person or an existing juristic person. If any information that we collect personally identifies you, or you are reasonably identifiable from it, we will treat it as personal information.
We will collect your personal information in a number of ways, including:
directly from you (where it is practicable to do so);
from third parties including employers, authorised representatives, agents or third parties who are authorised to share personal information, and publicly available sources of information; and
from third parties (some of whom may be our agents) who have identified you as someone who may wish to purchase our products or provide services to NtF.
In the course of business engagements, promotional competitions and on some pages of our Website, we may ask you for personal information for the purpose of entering into a business or employment relationship, providing a service, conducting a promotional competition or carrying out a transaction requested by you. The personal information that we collect and process will be provided by you voluntarily and may include:
contact details, such as your name, title, company/organization name, email address, telephone and fax numbers, and physical address;
information about your company and job position;
information about your company directors, officers, employees, beneficial owners or other associated individuals your preferences with respect to email marketing; 
financial information, including credit card numbers, bank or customer account information and, in connection with credit requests, identity number or other national/tax identification number;
 your gender or marital status;
in certain instances, sensitive personal information may be required, for example, race or ethnicity, medical information, criminal information, employment information and beliefs;
information such as your nationality and country of residence that allows us to determine your eligibility under export control regulations to receive information about certain technologies;
your enquiries about and orders for our products and services, as well as information that assists us in identifying the best products and services for you;
we may monitor and record telephone calls you make to us, unless you specifically request us not to;
 competition entry and event registration information; and
 surveys or feedback from you about our products and services, including our Website. 
You are not required to provide this information. However, if you choose not to, we may not be able to provide you the requested service or complete your transaction. If you provide us with personal information of third parties, please make sure that you are authorised to do so.
AUTOMATIC COLLECTION OF DATA
We collect certain data about all visitors to our Website, including what pages they view, the number of bytes transferred, the links they click, and other actions taken within our Website. When you browse our Website, we may also collect information about your computer and your visits to our Website such as your IP address, geographical location, browser type, computing device for example tablet, personal computer, web-enabled phone, the website you came from, length of visit and number of page views. We use this information to better understand how visitors use our Website and how they can be improved to better meet your needs, as well as to gauge interest in our products and services and to improve our security measures. In some cases, when you click on a link in an email or submit a web form such as to request more information, like product or promotional information we can link this data to your email address. 
Our use of personal information
We will use and process personal information only for the purposes set forth below.
Business Engagements - We use personal information for proposed and actual transactions, to enter into contracts, to support our procurement and on-boarding processes, including complying with our internal policies (particularly policies designed to prevent money laundering and sanctions violations).
 Services and transactions - We use personal information to deliver services or execute transactions you request, such as providing information about NtF's products and services, processing orders, answering customer service requests, facilitating use of our Website, and so forth. In order to offer you a more consistent experience in interacting with NtF, information collected by our Website may be combined with information we collect by other means.
Website improvement - We may use personal information about you to improve our Website (including our security measures) and related products or services, or to make our Website easier to use by eliminating the need for you to repeatedly enter the same information, or by customizing our Website to your particular preference or interests.
Marketing Communications - We may use personal information to inform you of products or services available from NtF. You will receive marketing communications from us if you have requested information from us or if you have previously purchased products from us or made use of our services and you have not opted out of receiving such marketing. 
Our use of cookies
Cookies are small files that websites save to your hard disk or to your browser's memory. Our Website may use them to track the number of times you have visited the Website, to track the number of visitors to the Website, to determine and analyse visitors' use of our Website, to store data that you provide (such as your preferences), and to store technical information related to your interactions with our Website. We may also use session cookies, to store your user ID, to facilitate your movement around our Website (particularly in connection with information searches and order placement) and other information useful in administering the session.
Most Internet browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies or to notify you when a cookie is being placed on your computer. If you choose not to accept cookies, you may not be able to experience all of the features of our Website. Internet browsers also enable you to delete existing cookies, although this means that your existing settings (including stored user IDs and other preferences) will be lost.
Disclosure of personal information
Except as described below, personal information that you provide to NtF via our Website or any other means will not be shared outside of NtF without your consent. Access to personal information is only authorised for those employees who require it to fulfil their job responsibilities.
Disclosure to service providers - NtF contracts with other companies to provide services on our behalf, such as outsourcing, hosting websites, sending out information, processing transactions and analysing our Website. We provide these companies with only those elements of personal information they need to deliver those services. These companies and their employees are prohibited from using this personal information for any other purposes.
Disclosure in connection with transactions - In connection with certain transactions, we may disclose some or all of the personal information you provide, to financial institutions, government entities and shipping companies or postal services involved in fulfilling the transaction.
Disclosure for other reasons - We may disclose personal information if required to do so by law or in the good-faith belief that such action is necessary to comply with legal requirements or with legal process served on us, to protect and defend our rights or property, or in urgent circumstances to protect the personal safety of any individual.
Where appropriate, we ask third parties to whom personal information is disclosed to use and process your personal information in accordance with any laws applicable to the protection of personal information.
Security
NtF is committed to protecting the security of personal information. While no security measure can guarantee against compromise, we use a variety of security technologies and procedures to help protect personal information from unauthorized access, use, or disclosure.
For sites to which you log in, it is your responsibility to ensure the security of your password and to not reveal this information to others. If you are sharing a computer with anyone, you should always log out before leaving a website so that subsequent users will not be able to access your personal information.
Questions about our privacy practices
If you have questions regarding this Privacy Statement or our handling of personal information, please contact us by email at support@needtofuel.com.
Changes to this privacy POLICY
We may occasionally update this Privacy POLICY. You should revisit this page periodically to become aware of the most recent terms.
Acceptance
By accepting this Privacy POLICY, you are deemed to have read, understood, accepted, and agreed to be bound by all of its terms. 
`;

const termsText = `Terms and Conditions of Fuel Sale
General 
These Terms and Conditions govern and are incorporated in to the Buyer's purchase of Fuel as specified in each Fuel Sale Agreement. It is Your responsibility to review these Terms and Conditions carefully before entering into any Fuel Sale Agreement. 
Need to Fuel Proprietary Limited is an agent and authorised reseller of Bonolo Service Station CC and is selling fuel and fuel products on behalf of, under the authorisation of and through the licence of Bonolo Service Station CC. 
The Buyer, to the extent that it is a juristic person, confirms that it has had sight of, acknowledges and agrees to the provisions of clause ‎7. 
IT IS AGREED AS FOLLOWS
DEFINITIONS AND INTERPRETATION
Definitions
In this Agreement, except where a different interpretation is necessary in the context, the words and expressions set out below shall have the following meanings:
Affiliate means in respect of:
the Buyer, any of its Group Companies; and 
the Seller, any of its Group Companies.
Balance the excess amount paid by the Buyer for Fuel. 
Buyer means the party defined as such in the Fuel Sale Agreement. 
Data Protection Legislation:  the Protection of Personal Information Act, 2013 and any other directly applicable regulation relating to privacy. 
Fuel means petroleum products sold by the Seller to the Buyer under the Fuel Sale Agreement. 
Fuel Sale Agreement means collectively:
the Seller's application form for sale of fuel completed and signed by the Buyer and delivered to the Seller, which incorporates these Terms and Conditions; 
each Purchase Order, which incorporates these Terms and Conditions; and 
the Seller's form of invoice issued by the Seller to the Buyer pursuant to each Purchase Order, which incorporates these Terms and Conditions.
Group Company means any subsidiary, subsidiary undertaking, holding company or holding undertaking of a relevant company, or any company or undertaking which has the same ultimate holding company or parent undertaking as such relevant company (whether directly or indirectly) as defined in the Companies Act 71 of 2008. 
Posted Price means the standard price for Fuel quoted by the Seller. 
Purchase Order means communication electronically by way of an order on the Seller's website or software application, in writing, by telephone or by email from the Buyer to the Seller to purchase Fuel, setting out:
the premises for delivery of Fuel; and 
the volume of Fuel to be delivered.
Seller means the party defined as such in the Fuel Sale Agreement. 
Seller's Suppliers means Bonolo Service Station CC, a close corporation with registration number 2005/030086/23, or any body or person by whom directly or indirectly the Fuel to be purchased and sold under the Fuel Sale Agreement is supplied to the Seller. 
Tanks means storage tanks, containers or other receptacles to be used for storing Fuel provided by the Buyer to the Seller for the collection of Fuel. 
You or Your means the Buyer. 
Interpretation
Unless expressly provided to the contrary or inconsistent with the context, a reference in this Agreement to: 
any one gender, whether masculine, feminine or neuter, includes the other two;
the singular includes the plural and vice versa;
a word or expression given a particular meaning includes cognate words or expressions;
any number of days prescribed shall be determined by excluding the first and including the last day or, where the last day is a day that is not a Business Day, the next Business Day;
references to a person include a natural person, company, close corporation or any other juristic person or other corporate entity, a charity, trust, partnership, joint venture, syndicate, or any other association of persons;
references to a subsidiary or a holding company shall be references to a subsidiary or holding company as defined in the Companies Act; and
references to any amount shall mean that amount exclusive of VAT, unless the amount expressly includes VAT.
All the headings and sub-headings in this Agreement are for convenience and reference only and shall be ignored for the purposes of interpreting it.
A term defined in a particular clause or annexure in this Agreement, unless it is clear from the clause or annexure in question that application of the term is to be limited to the relevant clause or annexure bears the meaning ascribed to it for all purposes of in this Agreement, notwithstanding that that term has not been defined in clause 2.1 (Definitions) and, where there is any inconsistency between any term defined in clause 2.1 (Definitions) and any term defined in any clause or schedule in this Agreement, then, for the purposes of construing such clause or schedule the term as defined in such clause or schedule prevails. 
No rule of construction may be applied to the disadvantage of a Party because that Party was responsible for or participated in the preparation of this Agreement or any part of it.
The clause and paragraph headings and the table of contents used in this Agreement are inserted for ease of reference only and shall not affect construction.
These express Terms and Conditions shall apply in place of all guaranties, warranties, other conditions, other terms, representations, statements, undertakings and obligations whether expressed or implied by statute, common law, custom, usage or otherwise, all of which are excluded to the fullest extent permitted by law. 
DELIVERY 
Unless otherwise agreed, Fuel supplied under the Fuel Sale Agreement shall be delivered into the Tanks at the premises specified in the Purchase Order provided that the Buyer:
provides adequate and appropriate Tanks for accepting delivery; 
ensures access to the Tanks is clear and available; 
ensures the Tanks are safe and suitable for the Fuel; and 
ensures the Tanks comply with any and all applicable laws and regulations. 
Risk in and benefit to Fuel supplied under the Fuel Sale Agreement shall pass to the Buyer as the Fuel supplied passes the hose connection of the receiving Tank which the Buyer has provided for receiving delivery; or at the point otherwise agreed by Seller and Buyer in writing prior to delivery. 
The Seller shall use all reasonable endeavours to deliver the Fuel by the date specified in the Purchase Order or, if no date is specified, within a reasonable period of time subject to operational requirements imposed by other delivery commitments. 
In respect of any delivery made by the Seller, the Seller's measurements and quality analysis of the Fuel supplied shall be treated as conclusive, however, the conclusiveness of the results may be displaced to the extent that it can be shown that the results are incorrect. Any claim or complaint in respect of a shortage in quantity or defect in the quality of any Fuel supplied under the Fuel Sale Agreement shall only be considered by the Seller if notice in writing of such claim is received by the Seller within 14 days of the date of the delivery in question and such notice is followed by a fully documented claim to be received by the Seller within 60 days of the date of the delivery in question. If the Buyer fails to give notice or to submit any such claim within the time limits, the Buyer's claim shall be deemed to be waived and any liability on the part of the Seller extinguished. 
Unless otherwise agreed, the Seller shall provide the Buyer at the time of delivery with a copy of a delivery receipt specifying the grade and quantity of Fuel delivered. Where possible, the delivery receipt shall be signed by the representatives of the Seller and the Buyer. 
PRICES, DUTIES, TAXES AND CHARGES 
Subject to the following provisions of this clause ‎3, the prices payable for Fuels to be supplied under the Fuel Sale Agreement shall be (as applicable) either: 
those specified in the relevant Fuel Sale Agreement; 
the Posted Price; or 
as otherwise agreed by the Seller and Buyer in writing; and, in each case, shall, unless otherwise stated, be exclusive of applicable consumption tax, sales tax or any other tax of a similar nature that may be levied in the jurisdiction of the delivery premises. 
Buyer shall (against the production of a valid tax or other invoice) pay any duty, tax, fee or charge of any kind imposed by any national, local or other authority on the supply, delivery, sale, inspection, storage or use of Fuels, or in respect of payment for Fuels supplied under the Fuel Sale Agreement and not included in the price for the Fuels, except for taxes on Seller's income and taxes on raw material. These duties, taxes, fees and other charges shall be charged in accordance with the relevant regulations in force, and at the rate current, at the time of making the supply and, to the extent allowed, stated by the Seller as separate items on the invoice for the account of Buyer. 
Third party charges included in the price of Fuels at the date of this Agreement shall be as stated in the applicable Fuel Sale Agreement (if any) or as otherwise agreed between the parties from time to time in writing ‎3.4 The prices of Fuels may be varied by the Seller to reflect wholly, and from the effective date, any changes in any duty, tax, fee or charge of any kind included in the prices of Fuels (or any new duty, tax, fee or charge of any kind to be included in the price of Fuels) that the Seller incurs in order to fulfil its obligations under this Agreement 
The Seller shall endeavour promptly to advise the Buyer of the imposition, or increase in, any duty, tax, fee or charge payable by the Buyer pursuant to clauses ‎3.2 or ‎3.4 when such information becomes known to the Seller but the Seller's inability so to do shall not excuse the Buyer from its obligation to pay any such duty, tax, fee or charge from its effective date of application 
In cases where the Buyer is entitled to a complete or partial exemption from or refund of any duty, tax, fee or charge referred to in clauses ‎3.2 or ‎3.4 deliveries shall, so far as may be reasonably practicable, be made by the Seller in the manner required for obtaining such exemptions or refund and the Buyer shall deliver to the Seller a valid exemption certificate in respect of the same. 
PAYMENT 
Subject only to the deduction of any amount in dispute, which shall be notified before the due date for payment by the Buyer to the Seller in writing, payment of the full amounts shown on all invoices rendered by the Seller to the Buyer under the Fuel Sale Agreement shall be made in accordance with the Terms and Conditions set out in the applicable Fuel Sale Agreement (if any), failing which payment shall be due within fourteen days of the date of the invoice. 
Unless required by law and unless the parties agree otherwise, all payments made by either party under the Fuel Sale Agreement shall be made in ZAR, free and clear of and without any deduction for or on account of any tax, set-off or counterclaim. 
Refund for unused fuel
The Buyer shall place orders under the Fuel Sale Agreement on an estimated requirement.
If the Buyer requires less Fuel than ordered, the excess amount paid by the Buyer (the Balance) will be created to the Buyer's account.
Upon the Buyer's request through the Seller's application or website, the Balance will be Refunded to the Buyer's bank card, subject to deduction of any applicable taxes, fees, or charges incurred in processing the refund.
The refund will be processes within [insert time frame] working days of the request being made.
Alternatively, the Buyer may choose to retain the Balance as a credit in their account. This credit can be applied toward future orders placed by the Buyer with the Seller. 
The Balance will not accrue any interest.
The Seller reserves the right to amend processing fees or conditions of refunds or credits or without prior notice to the Buyer.
DELIVERIES OUTSIDE NORMAL ARRANGEMENTS 
If the Buyer requests the Seller to make deliveries: 
by a different method than the one normally used for supplies of Fuels to the Buyer's tanks; or 
outside the Seller's normal service hours (as published by the Seller from time to time), 
then the Seller reserves the right to charge the Buyer the additional costs and expenses incurred by the Seller in making such deliveries. 
LIABILITY
Except where expressly provided in these Terms and Conditions, neither the Seller nor the Buyer shall be liable to the other under or in connection with any Fuel Sale Agreement for the other party's: 
loss of actual or anticipated profit; 
losses caused by business interruption; 
loss of goodwill or reputation; or 
for any indirect, special or consequential cost, expense, loss or damage, even if such cost, expense, loss or damage was reasonably foreseeable or might reasonably have been contemplated by the parties and whether arising from breach of contract, tort, negligence, breach of statutory duty or otherwise. 
DECLARATION AND WARRANTY
The Buyer hereby declares and warrants that it is a juristic person whose asset value or annual turnover (calculated in accordance with the prevailing method of calculation prescribed pursuant to the provisions of section 6 of the Consumer Protection Act, No. 68 of 2008), at the time that it enters into this Agreement, equals or exceeds R2 000 000,00 (two million Rand) which is the prevailing threshold value determined by the Minister in terms of the said section 6.
FORCE MAJEURE 
Neither the Seller nor the Buyer shall be responsible for any failure to fulfil their respective obligations under this Agreement (other than the payment of money) if fulfilment has been delayed, hindered, interfered with, curtailed or prevented by: 
any circumstances whatsoever which are not within the reasonable control of the Seller or of the Seller's Suppliers or of the Buyer as the case may be; or 
any curtailment, failure or cessation of the supplies of the Fuels from any of the Seller's or the Seller's Suppliers' sources of supply (whether in fact sources of supply for the purposes of the Fuel Sale Agreement or not); or
any compliance with any order, demand or request of any international, national, port, transportation, local or other authority or agency or of any body or person purporting to be or to act for such authority or agency; or 
any strike, lock-out or labour dispute (whether or not the Seller, the Seller's Suppliers or the Buyer as the case may be are party to the same or would be able to influence or procure the settlement of the same). 
If by reason of any of the causes referred to in clause ‎7.1 either the availability from any of the Seller's or the Seller's Suppliers' sources of supply of the Fuels or the normal means of transport of such Fuels is delayed, hindered, interfered with, curtailed, or prevented, the Seller shall be at liberty either to:
withhold, reduce or suspend deliveries under the Fuel Sale Agreement to such extent as the Seller may in its absolute discretion think fit in which case the Seller shall not be bound to purchase or otherwise make good shortages resulting from any such cause, although the Seller will endeavour to arrange an equitable distribution of supplies which continue to be normally available in the events referred to above; or 
offer the Buyer a restated price for supplies of the Fuels for deliveries with effect from the date (whether or not before the date of such restatement) on which the circumstances specified in clause ‎7.1 affected the deliveries concerned. If within 10 days of such notice the Buyer does not accept any restated price then the Seller may immediately terminate deliveries to the Buyer's premises but any such restated price shall, notwithstanding any failure to agree, be payable in respect of any Fuel delivered under the Fuel Sale Agreement from the date of the Seller's notice. 
If the circumstances which have given rise to the operation of clause ‎7.2.2 become improved or cease, thereby enabling a revision to be made in whole or in part to the Seller's or the Seller's Suppliers' normal sources of supply and/or routes and means of transportation, the Seller shall give written notice of the same to the Buyer together with appropriate adjustments to the restated price. 
The performance of any obligation, whether arising out of any contract, arrangement or otherwise, by which any authority, agency, body or person is entitled to require and does require any of the Fuels by way of royalty in kind, shall be deemed to constitute a compliance with an order or request as provided in clause ‎7.1.3, notwithstanding any agreement on the part of the Seller or the Seller's Suppliers to repurchase the same or any part of the same. 
If the Seller withholds, reduces or suspends deliveries of Fuels under the Fuel Sale Agreement pursuant to clause ‎7.2.1 the Buyer shall be free, for so long as deliveries under the Fuel Sale Agreement are withheld, suspended or reduced, to purchase from other suppliers on its own account any deficiencies in the supply of Fuels arising as a result. 
TERMINATION 
The Seller may terminate this Agreement by notice to the Buyer, without prejudice to any rights of action or claims that it may have under this Agreement or otherwise, if: 
subject to clause ‎4.1, the Buyer: 
fails to pay any invoice by its due date for payment; and/or 
commits a breach of any of the other conditions or any other term of the Fuel Sale Agreement, the effect of which breach is material, and which is either incapable of remedy, or, if capable of remedy is not remedied within 30 days of service of notice by the Seller requiring remedy, whether or not such event or breach would otherwise qualify as a repudiatory breach at common law.  
ASSIGNMENT 
The Buyer shall not transfer or assign the Fuel Sale Agreement or any benefit or rights under the Fuel Sale Agreement without the consent in writing of the Seller. The Seller may assign its rights and obligations under this Agreement to its Affiliate. Any such assignment shall be effected by notice in writing from the assignor countersigned by the assignee to signify its acceptance of the obligations under the Fuel Sale Agreement. 
Except as provided in clause ‎9.1 the Seller shall not transfer or assign the Fuel Sale Agreement  or any benefit or rights under the Fuel Sale Agreement without the consent in writing of the Buyer.  
CONFIDENTIALITY 
The Fuel Sale Agreement, the information that it contains and all information exchanged relating to it are confidential between the Buyer and the Seller. Neither the Buyer nor the Seller shall, without the other's written consent, disclose such information on any basis to any person other than its employees, its Affiliates or its Affiliates' employees except to the extent that disclosure may be compulsory under applicable law or to any governmental authority. Any disclosure by the Buyer or the Seller to their employees, or their Affiliates shall be on a confidential basis. 
INFORMATION, DATA PROTECTION & DATA PROCESSING 
Where the Seller or the Seller's Affiliates receive, collect or handle personal information or data in the course of processing and administering the Buyer's account, the Seller shall ensure that it and its Affiliates have taken and continue to take all reasonable technical and organisational measures against unauthorised or unlawful processing or disclosure of the personal information and data. 
All personal information and data supplied by You and/or collected by the Seller or the Seller's Affiliates will be used and processed: 
in accordance with applicable laws; 
with these Terms and Conditions; and 
with the Seller's Privacy Policy [insert link to Privacy Policy].  You warrant that any data provided by You is accurate. 
Both parties will comply with all applicable requirements of the Data Protection Legislation.
The Buyer hereby gives consent to the Seller and its Affiliates to process their personal information for all purposes related to this Agreement, in accordance with the provisions of the Data Protection Legislation.
WAIVER 
The rights, powers and remedies conferred on any party by the Fuel Sale Agreement and the remedies available to any party are cumulative and are additional to any right, power or remedy which it may have under general law or otherwise.  
Any party may, in whole or in part, release, compound, compromise, waive or postpone, in its absolute discretion, any liability owed to it or right granted to it in the Fuel Sale Agreement by the other party without in any way prejudicing or affecting its rights in respect of that or any other liability or right not so released, compounded, compromised, waived or postponed. 
No single or partial exercise, or failure or delay in exercising any right, power or remedy by any party shall constitute a waiver by that party of, or impair or preclude any further exercise of, that or any right, power or remedy arising under the Fuel Sale Agreement or otherwise.  
VARIATIONS 
No purported variation of the Fuel Sale Agreement shall be effective unless it is in writing and signed by or on behalf of each of the parties. 
NOTICES
Every notice or other communication made under a Fuel Sale Agreement shall unless otherwise stated be in writing (including by written electronic communication) in English and shall be given to the respective party at its address, email, or facsimile number set out in the Purchase Order, or such other contact address or details as advised from time to time by one party to the other. 
Every notice or other communication shall be deemed to have been received: 
in the case of a letter when delivered personally or two days after its posting by first class post; and 
in the case of an electronic communication when sent. 
GOVERNING LAW
Unless otherwise agreed between the Seller and the Buyer in writing, these Terms and Conditions, any Fuel Sale Agreement and any dispute or claim of whatever nature, whether contractual or non-contractual, arising out of or in connection with it is to be governed by the laws of the Republic of South Africa.
Nothing contained in this Agreement shall prohibit a Party from approaching any court of competent jurisdiction for urgent relief. 
THIRD PARTY RIGHTS 
No term or condition contained in the Fuel Sale Agreement shall be enforceable by any person who is not a party to this Agreement. 
The Fuel Sale Agreement may be varied or terminated by the parties without notice to or the consent of any third party. 
ENTIRE AGREEMENT 
The Fuel Sale Agreement and all of the documents referred to in it, in the agreed form, sets out the entire agreement and understanding between the parties and supersedes all prior agreements, understandings or arrangements (whether oral or written) in respect of the subject matter of the Fuel Sale Agreement.
© 2025, all rights reserved, Need for Fuel Proprietary Limited
`;

// Helper function to determine if a line is a heading
const isHeading = (line: string): boolean => {
  // Heading detection logic:
  // 1. Shorter lines (typically headings are shorter)
  // 2. Lines with all caps
  // 3. Lines that don't end with typical sentence punctuation
  // 4. Known heading patterns from the content
  
  const line_trimmed = line.trim();
  
  // If line is empty, it's not a heading
  if (line_trimmed.length === 0) return false;
  
  // Check for common heading patterns in this specific content
  if (
    line_trimmed.toUpperCase() === line_trimmed && line_trimmed.length > 3 || // All caps with minimum length
    /^[A-Z][a-z]+ (and|of|in) [A-Z][a-z]+/.test(line_trimmed) || // "Terms and Conditions", "Definitions and Interpretation"
    /^[A-Za-z]+ [A-Za-z]+:$/.test(line_trimmed) || // Lines ending with colon
    line_trimmed.endsWith(':') || // Another colon check
    line_trimmed.startsWith('DEFINITIONS AND') ||
    line_trimmed.startsWith('IT IS AGREED') ||
    line_trimmed.startsWith('PAYMENT') ||
    line_trimmed.startsWith('DELIVERY') ||
    line_trimmed.startsWith('PRICES,') ||
    line_trimmed.startsWith('TERMINATION') ||
    line_trimmed.startsWith('ASSIGNMENT') ||
    line_trimmed.startsWith('CONFIDENTIALITY') ||
    line_trimmed.startsWith('WAIVER') ||
    line_trimmed.startsWith('VARIATIONS') ||
    line_trimmed.startsWith('NOTICES') ||
    line_trimmed.startsWith('GOVERNING LAW') ||
    line_trimmed.startsWith('THIRD PARTY') ||
    line_trimmed.startsWith('ENTIRE AGREEMENT') ||
    line_trimmed.startsWith('Data Protection') ||
    line_trimmed.startsWith('Introduction') ||
    line_trimmed.startsWith('Cookie policy') ||
    line_trimmed.startsWith('data collection') ||
    line_trimmed.startsWith('Security') ||
    line_trimmed.startsWith('AUTOMATIC COLLECTION')
  ) {
    return true;
  }
  
  // If it's short and doesn't end with punctuation, likely a heading
  if (line_trimmed.length < 50 && 
      !line_trimmed.endsWith('.') && 
      !line_trimmed.endsWith(';') && 
      !line_trimmed.endsWith('?') &&
      !line_trimmed.includes(' the ') &&
      !line_trimmed.includes(' and ')) {
    return true;
  }
  
  return false;
};

const TermsModal = () => {
  const [isOpen, setIsOpen] = useAtom(PolicyState);
  const [activeTab, setActiveTab] = React.useState<'terms' | 'privacy'>('terms');
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const toggleTab = (tab: 'terms' | 'privacy') => {
    setActiveTab(tab);
  };

  // Format the content with styled headings
  const renderContentWithStyledHeadings = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (isHeading(line)) {
        return (
          <h3 
            key={i} 
            className="text-amber-400 font-bold text-base mb-3 mt-5 first:mt-0"
          >
            {line}
          </h3>
        );
      }
      return line.trim() ? (
        <p key={i} className="mb-3 text-white/70 leading-relaxed">
          {line}
        </p>
      ) : null;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-lg shadow-2xl overflow-hidden relative z-10"
          >
            {/* Subtle background elements */}
            <div className="absolute inset-0 bg-[url('/assets/images/main_logo.png')] bg-repeat opacity-[0.02] bg-[length:200px_200px] pointer-events-none"></div>
            
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, rgba(217,119,6,0.04) 40%, rgba(0,0,0,0) 70%)'
                }}
              ></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-amber-400">
                {activeTab === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
              </h2>
              <div
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-amber-400 transition-colors cursor-pointer p-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(false);
                  }
                }}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>

            {/* Content with styled headings */}
            <div className="h-[60vh] overflow-y-auto custom-scrollbar p-5 text-sm">
              {activeTab === 'terms' ? (
                <div>
                  {renderContentWithStyledHeadings(termsText)}
                </div>
              ) : (
                <div>
                  {renderContentWithStyledHeadings(policyText)}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between items-center">
              <div
                onClick={() => toggleTab(activeTab === 'terms' ? 'privacy' : 'terms')}
                className="text-amber-500 hover:text-amber-400 transition-colors text-sm font-medium cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTab(activeTab === 'terms' ? 'privacy' : 'terms');
                  }
                }}
              >
                View {activeTab === 'terms' ? 'Privacy Policy' : 'Terms & Conditions'}
              </div>
              <div
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-md px-4 py-2 transition-all cursor-pointer text-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(false);
                  }
                }}
              >
                ACCEPT & CONTINUE
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Add custom scrollbar styles
const CustomScrollbarStyles = () => (
  <style jsx global>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(217, 119, 6, 0.3);
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(217, 119, 6, 0.5);
    }
  `}</style>
);

// Include the custom scrollbar styles
export default TermsModal;
export { CustomScrollbarStyles };
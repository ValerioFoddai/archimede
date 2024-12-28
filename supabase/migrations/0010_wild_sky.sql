/*
  # Update expense categories

  1. Changes
    - Add missing sub-categories to each main category
    - Ensure all categories are properly linked

  2. Data
    - Add complete list of sub-categories for each main category
    - Maintain existing category relationships
*/

-- Insert missing sub-categories
INSERT INTO sub_expense_categories (id, main_category_id, name) VALUES
  -- Income
  (104, 1, 'Business Income'),
  (105, 1, 'Interest'),
  (106, 1, 'Other Income'),
  (107, 1, 'Paychecks'),
  (108, 1, 'Rent Income'),

  -- Auto & Transport
  (205, 2, 'Auto Insurance'),
  (206, 2, 'Car Loan'),
  (207, 2, 'Car Maintenance'),
  (208, 2, 'Parking & Tolls'),
  (209, 2, 'Taxi & Ride Shares'),
  (210, 2, 'Vehicle Registration & Taxes'),

  -- Bills
  (305, 3, 'Cable TV'),
  (306, 3, 'Garbage'),
  (307, 3, 'Gas'),
  (308, 3, 'Home Security'),
  (309, 3, 'Streaming Services'),

  -- Children
  (404, 4, 'Baby Supplies'),
  (405, 4, 'Child Care'),
  (406, 4, 'Clothing & Accessories'),
  (407, 4, 'Healthcare'),
  (408, 4, 'Toys & Games'),

  -- Education
  (504, 5, 'Books & Supplies'),
  (505, 5, 'Extracurricular Activities'),
  (506, 5, 'Online Learning'),
  (507, 5, 'Student Loans'),
  (508, 5, 'Tuition Fees'),

  -- Financial
  (604, 6, 'Banking Services'),
  (605, 6, 'Cash & ATM'),
  (606, 6, 'Debt Payments'),
  (607, 6, 'Financial & Legal Services'),
  (608, 6, 'Financial Fees'),
  (609, 6, 'Investments'),
  (610, 6, 'Loan Interest'),
  (611, 6, 'Loan Repayment'),
  (612, 6, 'Savings Contributions'),
  (613, 6, 'Taxes'),

  -- Food
  (704, 7, 'Restaurants & Bars'),

  -- Health & Wellness
  (804, 8, 'Alternative Medicine'),
  (805, 8, 'Dentist'),
  (806, 8, 'Health Insurance'),
  (807, 8, 'Medical'),
  (808, 8, 'Mental Health'),
  (809, 8, 'Pharmacy & Medications'),
  (810, 8, 'Vision Care'),
  (811, 8, 'Wellness & Spa'),

  -- House
  (904, 9, 'Condominium Fees'),
  (905, 9, 'Home Improvement'),
  (906, 9, 'Home Insurance'),
  (907, 9, 'Mortgage'),
  (908, 9, 'Property Tax'),
  (909, 9, 'Rent'),

  -- Shopping
  (1004, 10, 'Beauty & Personal Care'),
  (1005, 10, 'Books & Stationery'),
  (1006, 10, 'Furniture'),
  (1007, 10, 'Home & Garden'),
  (1008, 10, 'Sports & Outdoor'),

  -- Transfer
  (1104, 11, 'Balance Adjustments'),
  (1105, 11, 'External Transfer'),
  (1106, 11, 'Internal Transfer'),
  (1107, 11, 'Loan Transfers'),
  (1108, 11, 'Peer-to-Peer Transfers'),
  (1109, 11, 'Savings Transfer'),

  -- Travel & Lifestyle
  (1204, 12, 'Accommodation'),
  (1205, 12, 'Cultural Experiences'),
  (1206, 12, 'Flight'),
  (1207, 12, 'Hobbies'),
  (1208, 12, 'Tours & Activities'),
  (1209, 12, 'Vacations'),
  (1210, 12, 'Fitness & Wellness')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name;
Refactor the entire application to operate as a production system using real Supabase data.

The UI pages already exist.
The database tables already exist.
Do not create new pages.
Do not redesign the layout.
Do not use dummy data.

The goal is to connect the existing UI to the existing Supabase tables and restore the full navigation and workflow logic.

---------------------------------------
SECTION 1 — AUTHENTICATION FLOW
---------------------------------------

When the application loads:

1) Check the Supabase session using:

supabase.auth.getSession()

2) If no session exists:

Navigate to:

Sign In page

3) If a session exists:

Get the authenticated user id:

user.id

4) Fetch the user's profile:

SELECT * FROM profiles
WHERE user_id = authenticated user id

5) Read:

profiles.user_type

---------------------------------------
SECTION 2 — ROLE-BASED LANDING PAGES
---------------------------------------

If:

profiles.user_type = client

Navigate to:

My Profile page

If:

profiles.user_type = stylist

Navigate to:

Dashboard page

Never navigate to dummy pages.
Never reset to Sign In after refresh.

---------------------------------------
SECTION 3 — DATABASE TABLES (SOURCE OF TRUTH)
---------------------------------------

Use ONLY these existing tables.

Table:

access_requests

Purpose:

Store initial application data.

Fields:

id
user_type
name
email
location
professional_title
years_experience
website
areas_of_practice
approach
stylist_client_context
client_context
seeking
status
created_at

---------------------------------------

Table:

users

Purpose:

Approved members.

Fields:

id
email
role
status
created_at

---------------------------------------

Table:

profiles

Purpose:

User identity and profile display.

Fields:

id
user_id
user_type
name
city
country
bio
style_preferences
professional_title
years_experience
availability
profile_status
created_at

---------------------------------------

Table:

introductions

Purpose:

Client requests to stylists.

Fields:

id
client_id
stylist_id
service_type
message
status
created_at

---------------------------------------

Table:

messages

Purpose:

Conversation between client and stylist.

Fields:

id
introduction_id
sender_id
message
created_at

---------------------------------------

Table:

saved_stylists

Purpose:

Client favorites.

Fields:

id
client_id
stylist_id
created_at

---------------------------------------
SECTION 4 — CLIENT FLOW
---------------------------------------

After login:

Client lands on:

My Profile

---------------------------------------

MY PROFILE PAGE

Load data from:

profiles

Query:

SELECT * FROM profiles
WHERE user_id = authenticated user id

Display:

Name → profiles.name
City → profiles.city
Country → profiles.country
Bio → profiles.bio
Style Preferences → profiles.style_preferences
Member Since → profiles.created_at
Availability → profiles.availability

If field is empty:

Display:

Not yet provided

Never display dummy values.

---------------------------------------

SAVED STYLISTS PAGE

Load data from:

saved_stylists

Query:

SELECT *
FROM saved_stylists
WHERE client_id = authenticated user id

If no rows:

Display:

No saved stylists yet

---------------------------------------

MY REQUESTS PAGE

Load data from:

introductions

Query:

SELECT *
FROM introductions
WHERE client_id = authenticated user id

Display:

Service Type
Status
Created Date

If empty:

Display:

No requests yet

---------------------------------------

REQUEST DETAILS PAGE

Load data from:

introductions

Query:

SELECT *
FROM introductions
WHERE id = selected request id

Also load messages:

SELECT *
FROM messages
WHERE introduction_id = selected request id

---------------------------------------
SECTION 5 — STYLIST FLOW
---------------------------------------

After login:

Stylist lands on:

Dashboard

---------------------------------------

DASHBOARD PAGE

Load data from:

profiles

Query:

SELECT *
FROM profiles
WHERE user_id = authenticated user id

Display:

Profile Status → profiles.profile_status
Availability → profiles.availability
Member Since → profiles.created_at

---------------------------------------

DASHBOARD METRICS

Count introductions:

SELECT COUNT(*)
FROM introductions
WHERE stylist_id = authenticated user id

Display:

Introductions this month

If empty:

Display:

0

---------------------------------------

INTRODUCTIONS PAGE

Load data from:

introductions

Query:

SELECT *
FROM introductions
WHERE stylist_id = authenticated user id

Display:

Client name
Service type
Status
Created date

---------------------------------------

VIEW DETAILS PAGE

Load:

Introduction:

SELECT *
FROM introductions
WHERE id = selected introduction id

Messages:

SELECT *
FROM messages
WHERE introduction_id = selected introduction id

---------------------------------------

MESSAGES PAGE

Load:

SELECT *
FROM messages
WHERE introduction_id = selected introduction id

---------------------------------------

EDIT PROFILE PAGE

Update:

profiles table

Where:

user_id = authenticated user id

---------------------------------------
SECTION 6 — NAVIGATION STRUCTURE
---------------------------------------

Shared navigation:

Home
Narrative
Platform
Journal
Concierge
Sign In / Sign Out

Client navigation:

My Profile
Saved Stylists
My Requests

Stylist navigation:

Dashboard
Introductions
Messages
Edit Profile

---------------------------------------
SECTION 7 — SESSION BEHAVIOR
---------------------------------------

On page refresh:

Check session
Load profile
Restore correct page

Never:

Reset to Sign In
Reset to dummy data

---------------------------------------
SECTION 8 — DATA RULES
---------------------------------------

Use real Supabase data only.

If table has no rows:

Display:

0

If field is empty:

Display:

Not yet provided

Never:

Use dummy data
Generate fake numbers
Insert placeholder names

---------------------------------------
SECTION 9 — DO NOT CHANGE
---------------------------------------

Do not change:

UI layout
Design
Typography
Spacing
Navigation structure
Page names

Only connect existing pages to real Supabase data.
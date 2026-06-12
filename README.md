This full-stack production-grade application is a comprehensive MERN platform designed within a clean, decoupled workspace infrastructure dividing the client interface from backend data management. The architecture moves beyond basic data models to implement secure, state-managed tracking systems mapping interactive operations between candidates and recruiters.  
The platform supports an incremental learning roadmap. It shifts smoothly from basic CRUD data structures to role-based system authorization workflows powered by secure JSON Web Tokens (JWT) and persistent browser storage.  
#Implemented Core Features
1. Dual-Workspace Authentication and Role Guards
Identity Management: Registration and login endpoints utilize bcryptjs to enforce strict salt hashing parameters on user password signatures.  
JWT Access Pipelines: Secured routes authenticate standard HTTP authorization headers using an explicit Bearer token verification schema.  
Authorization guards: Structural middleware isolates administrative access privileges. Candidates are blocked from executing recruiter management endpoints, and recruiters are restricted from candidate-exclusive workspace elements.  
2. Advanced Job Lifecycle Matrix (Recruiter Suite)
Full CRUD Functionality: Authorized recruiters can construct, review, modify, or permanently delete their own job postings from the centralized cluster database.  
Live Operational Metrics: The recruiter dashboard displays live analytics, showing specific counters for overall postings and relational applications linked to unique recruiter tokens.  
Relational Database Sub-tables: Selecting individual position listings queries the network to return full applicant sub-tables containing name entries, valid email formats, telephone inputs, and precise submission timestamps.  
3. Interactive Candidate Placement Workspace
Stateful Bookmarking Features: Candidates can save or remove job bookmarks. The dashboard tracks these relationships continuously using unified state sync methods.  
Submission Engine and Tracking History: Candidates can route their validated data profiles straight to explicit vacancies. The system tracks their submission records under a persistent, relational timeline layout.  
4. Unified Interface Quality and Bonus Logic
Dynamic Search Toolbar: Supports real-world lookup operations using composite regular expression filters for job title text, partner company keywords, geographic node areas, and min/max salary ranges.  
Performance Pagination: Features Next, Previous, and explicit page counter boundaries to divide heavy database data streams into lightweight segments of six items per layout block.  
Advanced Compensation Sorting: Users can sort active vacancy grids from lowest to highest or highest to lowest annual pay, with all amounts explicitly formatted in Indian Rupees (₹).  
Asynchronous UX Loading: Built with a global unified stylesheet handling dark and light layout contexts. The client utilizes animated state components for network sync times, user verification errors, or empty results.  
System Validation and Data Guardrails
To prevent backend corruption, the layers enforce these strict parsing guidelines:  
Required Properties: Input schemas reject form data containing blank fields or undefined parameters with an HTTP 400 status code.  
Strict Email Mapping: Applicant input strings are verified against standard regex layout boundaries before hitting database indexes.  
Numerical Bounds: Salary parameters are verified as positive integers. Negative allocations or non-numeric inputs are instantly dropped by the controller.  
#Operational Execution Guide
Step 1: Initialize the Database Services
Make sure your local MongoDB Community Server is active and listening for communication on port 27017. The server initialization sequence will automatically create a secure database instance named jobportalpro on your local cluster.  
Step 2: Launch the Backend Infrastructure Engine
Open your system terminal window, move straight into your server workspace directory, pull down the required node packages, and run the nodemon automation script:
Bash
cd server
npm install
npm run dev
Check the output logs to confirm that the server and database instances have connected successfully:
Plaintext
Application layer core runtime running on port 5000
MongoDB Connected: localhost
Step 3: Launch the User Interface Client
Open a completely new, separate secondary terminal pane (leaving your backend server runtime uninterrupted).
Path straight into your client directory, configure the necessary modules, and initialize the Webpack compiler:
Bash
cd client
npm install
npm start
Your web browser will open a fresh session routing straight to http://localhost:3000.
Step 4: Perform End-to-End Operational Testing
Click Register on the navigation bar to configure a clean user profile with the role set to Recruiter.
Access the Recruiter Console and use the creation form to deploy an entry (e.g., Senior Full Stack Engineer, CTC: 2400000).
Create a separate secondary user account with the role set to Candidate.
Test the search and sorting toolbar filters on the main dashboard to locate the new job card, click the save button to bookmark it, and click Apply to submit a test application.
Switch back to the recruiter profile, pull up the workspace console, click Applications next to the job card, and verify that the candidate's relational details update on screen inside the data table view.
#Screenshorts
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/87cc61c7-8c00-4024-9d3d-b8ecb78025d5" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/db42798c-664c-471e-9f02-c1661325c4ff" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/4cb9af2c-50c0-4e92-9ad8-b491b3c25cbd" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/2e3cb67d-daa4-4af4-999d-af789456bf4f" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/76b908ea-c9f1-4bb4-8878-8f19116cb303" />






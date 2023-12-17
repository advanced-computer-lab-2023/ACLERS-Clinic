# ACLERS

## Project title

Welcome to our Platform – a cutting-edge healthcare solution designed to connect doctors and patients seamlessly. Our platform facilitates efficient communication, appointment scheduling, and comprehensive health management. Whether you're a healthcare professional or a patient seeking efficient healthcare services, our Doctor-Patient Platform is designed to elevate your experience. Join us on this journey towards a healthier and more connected future!

## Motivation

Our motivation stems from the desire to bridge the gap between healthcare providers and patients, fostering a collaborative and accessible healthcare ecosystem.

## Build Status

Dashboards need improvement
Responsiveness needs improvement

## Code Style

Follow [JavaScript Standard Style](https://standardjs.com/) for code styling.

## Screenshots

![Screenshot 2023-12-15 153201](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/8f141981-a099-4e1f-b1cb-3d02483a17fb)
![Screenshot 2023-12-16 150723](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/333290db-6bcf-414e-99ff-d9ee98c9f8d8)
![Screenshot 2023-12-16 150752](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/274e1c43-0be4-4e44-a070-bce726fdf980)
![Screenshot 2023-12-17 050528](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/8d55d9c5-744a-40fb-b682-b1b8de5955b9)
![Screenshot 2023-12-17 050333](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/0412d1de-f938-4a9d-8383-7512f4b1e9a0)
![Screenshot 2023-12-17 050402](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/fd5fd43d-8498-4fc9-8606-c06e9075910a)
![Screenshot 2023-12-17 050422](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/assets/121206244/375d9e6f-ee9f-498b-9db7-2c9bbb513878)

## Tech/Framework used

- React.js for the frontend
- Node.js for the backend
- Express.js as the backend framework
- MongoDB as the database

## Features

### For Doctors

1. _Comprehensive Patient Management:_
   Ability to view and manage patient information and health records, including adding new health records for patients.
2. _Appointment Scheduling and Filtering:_
   Doctors can add available time slots, filter appointments by date/status, and manage scheduling, rescheduling, or cancelling appointments.

3. _Prescription Handling:_
   Capability to add, delete, and update prescriptions, including managing medicine dosages and downloading prescriptions.

4. _Communication and Notification System:_
   Features to start/end a video call with patients, chat functionality, and receive notifications about appointments via system and email.

5. _Patient Interaction Tools:_
   Options to view a list of all patients, search for a patient by name, and filter patients based on upcoming appointments.

### For Patients

1. _Document Management:_
   Patients can upload/remove documents (PDF, JPEG, JPG, PNG) for their medical history.
2. _Family Member Management:_
   Ability to add family members to the patient's account, enhancing family healthcare management.
3. _Appointment Management:_
   Features to view upcoming/past appointments, request follow-ups, and receive refunds in the wallet when an appointment is cancelled by a doctor.
4. _Interactive Communication:_
   Options to start/end a video call with the doctor and chat functionalities.
5. _Prescription Access:_
   Patients can view their prescriptions, including the details and statuses (filled/not filled).

### For Administrators

1. _User Account Management:_
   Administrators can manage user accounts, including doctors and patients.
2. _System Oversight:_
   Overseeing the overall functioning of the virtual clinic platform.
3. _Security and Access Control:_
   Ensuring secure access and managing the permissions for different user roles.
4. _Data Management:_
   Handling sensitive patient and doctor data with confidentiality and integrity.
5. _Operational Efficiency:_
   Monitoring and enhancing the operational aspects of the virtual clinic, such as appointment scheduling and document management.

### General Features

1. _User-Friendly Interface:_
   An intuitive and easy-to-navigate interface for all types of users.
2. _Real-Time Updates:_
   Keeping users informed with real-time updates on appointments, prescriptions, and other relevant information.
3. _Integrated Communication Tools:_
   Seamless integration of communication tools like video calls and chat within the platform.
4. _Secure and Private:_
   Strong focus on security and privacy, particularly important in healthcare settings.
5. _Flexibility and Customization:_
   The ability for users to customize aspects of their interaction with the system, such as appointment settings and document management.

## Code Examples

Login authentication:

FRONTEND:

const handleSubmit = async (event) => {
event.preventDefault();
const data = new FormData(event.currentTarget);

    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    try {
      // Send a POST request to your API
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        // Login successful
        setLoginSuccess(true);
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        console.log("Login successful");
        console.log("Token:", token);

        const decodedToken = jwt.decode(token);
        console.log("decoded Token:", decodedToken);
        console.log("hello");

        if (decodedToken.role === "patient") {
          // Redirect to patient home page
          navigate("/patient/dashboard", {
            state: { id: decodedToken.id },
          });
        } else if (decodedToken.role === "doctor") {
          // Redirect to doctor home page
          navigate("/doctor/dashboard", { state: { id: decodedToken.id } });
        } else if (decodedToken.role === "admin") {
          // Redirect to doctor home page
          navigate("/admin/dashboard", { state: { id: decodedToken.id } });
        } else if (decodedToken.role === "applicant") {
          navigate("/applicant/contract", { state: { id: decodedToken.id } });
        }
      } else {
        // Login failed
        console.error("Login failed");
        setLoginSuccess(false);
        setErrorMessage("Invalid email or password. Please try again.");
        setOpenDialog(true);

      }
    } catch (error) {
      console.error("Error during login:", error);
    }

};

BACKEND:
const login = asyncHandler(async (req, res) => {
const { email, password } = req.body;
const patient = await Patient.findOne({ email });

const doctor = await Doctor.findOne({ email });
const applicant = await Applicant.findOne({ email });
const admin = await Admin.findOne({ username: email });
if (patient && (await bcrypt.compare(password, patient.password))) {
return res.json({
token: generateToken(patient.\_id, "patient",patient.email),
});
}
if (doctor && (await bcrypt.compare(password, doctor.password))) {
return res.json({
token: generateToken(doctor.\_id, "doctor",doctor.email),
});
}
if (applicant && (await bcrypt.compare(password, applicant.password))) {
return res.json({
token: generateToken(applicant.\_id, "applicant",applicant.email),
});
}
if (admin && (await bcrypt.compare(password, admin.password))) {
return res.json({
token: generateToken(admin.\_id, "admin",admin.username),
});
}
return res.status(400).send("invalid credentials");
});

const logout = asyncHandler(async (req, res) => {
const token = req.headers.authorization.split(" ")[1];

// Add the token to the blacklistedTokens list
blacklistedTokens.push(token);

res.status(200).json({ message: "Logout successful" });
});

const generateToken = (id, role,email) => {
return jwt.sign({ id, role ,email}, process.env.JWT_SECRET, { expiresIn: "2h" });
};

VIEW DOCTORS:

 <div className="doctorviewer" style={{ marginLeft: "240px" }}>
      <AdminNavbar />

      <Box
        sx={{
          backgroundImage: 'url("https://source.unsplash.com/random?doctor")',
          backgroundSize: "cover", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
          bgcolor: "background.paper",

          pt: 8,
          pb: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha value for transparency
              padding: "20px", // Adjust as needed
              maxWidth: "1000px", // Set the maximum width as needed
              width: "100%",
              borderRadius: "8px", // Optional: Add border-radius for rounded corners
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Doctors
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                El7a2ni streamlines doctor oversight, providing you with a
                user-friendly platform to view and manage doctors, facilitating
                quick inspections and employment management.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              ></Stack>
            </Container>
          </div>
        </div>
      </Box>
      <div
        style={{
          marginLeft: "40px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <Grid container spacing={4}>
          {doctors && Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Grid item key={doctor._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={getRandomImageURL()}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doctor.username} ({doctor.speciality})
                    </Typography>
                    <Typography>Hourly Rate: {doctor.hourlyRate}</Typography>
                    <Typography>Affiliation: {doctor.affiliation}</Typography>
                    <Typography>
                      Education: {doctor.educationalBackground}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#851414", // red
                        color: "white",
                        fontWeight: "bold",
                        padding: "8px 16px", // Add padding here
                        width: "100%",
                      }}
                      size="small"
                      onClick={() => handleClick(doctor)}
                      startIcon={<CancelIcon />}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <p>No doctors available.</p>
          )}
        </Grid>
        <Dialog
          open={dialogOpen}
          TransitionComponent={Slide}
          keepMounted
          onClose={() => setDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <Typography variant="h6" color="primary">
              Doctor removed successfully!
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </div>

VIEW PATIENTS:

<div className="patientviewer" style={{ marginLeft: "240px" }}>
      <AdminNavbar />
      <Box
        sx={{
          backgroundImage: 'url("https://source.unsplash.com/random?doctor")',
          backgroundSize: "cover", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
          bgcolor: "background.paper",

          pt: 8,
          pb: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha value for transparency
              padding: "20px", // Adjust as needed
              maxWidth: "1000px", // Set the maximum width as needed
              width: "100%",
              borderRadius: "8px", // Optional: Add border-radius for rounded corners
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Patients
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                El7a2ni streamlines patient oversight, providing you with a
                user-friendly platform to view and manage patient, facilitating
                quick inspections and account management.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              ></Stack>
            </Container>
          </div>
        </div>
      </Box>
      <div
        style={{
          marginLeft: "40px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <Grid container spacing={4}>
          {patients && Array.isArray(patients) && patients.length > 0 ? (
            patients.map((patient) => {
              if (patient) {
                return (
                  <Grid item key={patient._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          // 16:9
                          pt: "56.25%",
                        }}
                        image={getRandomImageURL()}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {patient.name}
                        </Typography>
                        <Typography>Email: {patient.email}</Typography>
                        <Typography>
                          Mobile Number: {patient.mobileNumber}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#851414", // red
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 16px", // Add padding here
                            width: "100%",
                          }}
                          size="small"
                          onClick={() => handleClick(patient)}
                          startIcon={<CancelIcon />}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              } else {
              }
            })
          ) : (
            <p>No doctors available.</p>
          )}
        </Grid>
        <Dialog
          open={dialogOpen}
          TransitionComponent={Slide}
          keepMounted
          onClose={() => setDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <Typography variant="h6" color="primary">
              Patient removed successfully!
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </div>

ADMIN NAVBAR:

const menuItems = [
"Doctors",
"Patients",
"Admin",
"Applicants",
"AddHealthPackage",
"ViewHealthPackages",
"ChangePassword",
];

return (
<div>
<Drawer variant="permanent">
<div style={{ width: "100%" }}>
<Link to="/admin/dashboard">
<img
src={logoImageUrl}
alt="Drawer Logo"
style={{ width: "260px" }}
/>
</Link>
</div>
<List>
{menuItems.map((item) => (
<ListItem
button
key={item}
component={Link}
to={`/admin/${item.toLowerCase()}`} >
<ListItemIcon>{iconMap[item]}</ListItemIcon>
<ListItemText
primary={item.replace(/([a-z])([A-Z])/g, "$1 $2")}
/>
</ListItem>
))}
</List>
<Divider />
<List>
<ListItem button onClick={handleLogout}>
<ListItemIcon>
<ExitToAppIcon />
</ListItemIcon>
<ListItemText primary="Logout" />
</ListItem>
</List>
</Drawer>
</div>
);
}

## Installation

### Prerequisites:

Before you begin the installation process, make sure you have the following software and tools installed on your system:

1. _Node.js and npm:_
   Install Node.js and npm by visiting Node.js official website (https://nodejs.org/) and following the installation instructions for your operating system.
2. _Git:_
   Install Git by visiting Git official website (https://git-scm.com/) and following the installation instructions for your operating system.

3. _Database Server:_

Set up a database server (https://www.mongodb.com/)

### cloning

1. _Clone the repository:_
   git clone https://github.com/advanced-computer-lab-2023/ACLERS-Clinic.git
2. _Install dependencies:_ npm install
3. _start the application:_ npm start

### create .env file and add:

MONGO_URI = mongodb+srv://omar:omarwael@cluster0.lgb4yus.mongodb.net/virtualClinic?retryWrites=true&w=majority

## API References

### Admin routes

- Add Admin: post /api/add-admin
- Remove Admin: delete/api/remove-admin
- Remove Doctor:delete /api/remove-doctor
- Remove Patient:delete /api/remove-patient
- View Admins:get /api/view-admins
- View Doctors: get /api/view-doctors
- View Patients: get /api/view-patients
- View Health Packages:get /api/view-HealthPackage
- Add Health Package: post /api/add-HealthPackage
- Delete Health Package:delete /api/delete-HealthPackage
- Update Health Package: put /api/update-HealthPackage
- Approve Doctor Request: post /api/approve-doctor
- Reject Doctor Request:delete /api/reject-doctor
- View Applicants:get /api/view-applicants
- View Health Package: get /api/view-HealthPackage

### Patient routes

- Add Family Member:post /api/add-family-member
- View Family Member:get /api/view-fam-member
- Book Appointment: post /api/book-appointment
- View Appointments:get /api/appointments
- View Doctors: get/api/view-doctors
- View Health Packages: get /api/view-healthPackages
- Subscribe to Health Package: post /api/subscribe-healthPackage
- View Doctor: get /api/view-doctor
- View Prescriptions: get /api/view-perscriptions
- View Prescription: get /api/view-perscription
- Search for Doctor:get /api/search
- Book Appointment for Family Member: post /api/book-appointment-fam
- View My Health Records:get /api/viewMyHealthRecords
- View My Balance:get /api/viewMyBalance
- View Subscribed Health Packages: get /api/viewSubscribedHealthPackage
- Cancel Subscription: post /api/cancel-subscription
- Cancel Subscription for Family Member: post /api/cancel-subscription-famMem
- View Appointments of a Doctor: get /api/view-appointments
- View Subscribed Health Packages of Family Member: get /api/view-HealthPack-FamMember
- Upload Document: post /api/upload
- Link Family Member's Account:post /api/link-fam-member
- Remove Health Record Attachment:delete /api/removeAttachment
- Pay Using Stripe:post /api/pay
- Subscribe Health Package for Family Member: post /api/subscribe-healthpack-famMem

### doctor routes

- Edit Doctor Email:put /api/editDocEmail
- View Appointments: get /api/view-appointments
- View Patients:get /api/view-patients
- View Patient:get /api/view-patient
- Search for Patient: get /api/search
- Write Prescription: post /api/write-perscription
- View My Info: get /api/view-my-info
- Add Doctor Time Slot:post /api/add-doctor-time-slot
- View Patient Records: get /api/viewPatientRecords
- View My Balance:get /api/viewMyBalance
- Add Health Record:post /api/addHealthRecord
- View My Contract: get /api/viewMyContract
- Accept Contract:post /api/acceptContract
- Deny Contract: post/api/denyContract
- Set Appointment or Follow-up: post /api/setAppointment

### auth routes

- Change Password: post /api/change-password
- Register Patient:post /api/register-patient
- Logout: /api/logout
- Register Doctor: post /api/register-doctor
- Login: /api/login
- Send OTP Email: post /api/sendOTPEmail
- Reset Password: post /api/resetPassword

## Tests

## How to Use

This guide provides step-by-step instructions on how to use the Virtual Clinic website for different user groups: doctors, patients, and administrators.

1. _Registration and Login:_

- Patients: Start by creating your account. Provide necessary details like username, name, email, and  
  password to register securely.
- Doctors: Undergo a registration process, including providing credentials and necessary documents for verification to ensure trust and credibility.
- Administrators: Log in with your administrator credentials to access the admin panel and oversee the platform.

2. _Setting Up the Profile:_

- Patients: Complete your profile by adding personal details and medical history. Upload relevant documents for a comprehensive health record.
- Doctors: Set up your professional profile, including specialties, qualifications, and available time slots for appointments.
- Administrators: Review and manage the profiles of doctors and patients, ensuring accuracy and completeness of information.

3. _Managing Appointments:_

- Patients: Browse available time slots to book appointments with doctors. View and manage your upcoming and past appointments.
- Doctors: View and manage your appointment schedule. Reschedule or cancel appointments as needed, and view patient histories prior to appointments.
- Administrators: Monitor and manage the appointment system, ensuring smooth operation and efficient scheduling.

4. _Communication and Interaction:_

- Patients: Communicate with doctors using the video call or chat feature. Request follow-ups and manage family member accounts.
- Doctors: Use communication tools to engage with patients, manage follow-ups, and provide medical advice or consultations.
- Administrators: Ensure the effective functioning of communication tools and address any technical issues that arise.

5. _Prescription Management:_

- Patients: Access and view your prescriptions, including details about medication and fill status.
- Doctors: Create, update, and manage prescriptions for patients. Provide clear instructions and dosages for medications.
- Administrators: Oversee the prescription management system, ensuring its accuracy and integration with the pharmacy if applicable.

6. _Security and Data Management:_

- Patients: Ensure your account's security by managing your login credentials and privacy settings.
- Doctors: Handle patient data with confidentiality, adhering to privacy laws and ethical guidelines.
- Administrators: Maintain the security of the platform, manage data access permissions, and ensure compliance with data protection regulations.

7. _Feedback and Support:_

- All Users: Utilize the feedback or help section for any queries or issues. Provide feedback to help improve the platform’s functionality and user experience.

## Contribute

Follow these guidelines if you would like to contribute:

### Code Contributions

1. Fork the repository.
2. Create a new branch for your feature or bug fix: git checkout -b feature-name.
3. Implement your changes and commit them: git commit -m 'Add new feature'.
4. Push to your branch: git push origin feature-name.
5. Open a pull request on our [GitHub repository](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic.git) with a clear description of your changes.

### Documentation

Help improve our documentation by fixing typos, clarifying instructions, or adding missing information. Submit a pull request with your documentation changes.

### Testing

If you're contributing code changes, ensure that your modifications include relevant tests to maintain the stability of the platform.

### Reporting Issues

please open an issue on the [issue tracker](https://github.com/advanced-computer-lab-2023/ACLERS-Clinic/issues).

## Credits

Special thanks to the following resources that contributed to the development of this project:

- [YouTube Tutorial Playlist](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)

Feel free to check out the playlist for additional insights and tutorials.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT)

### Third-Party Licenses

Certain components and dependencies used in this project are subject to their own licenses:

- _Stripe:_ The use of Stripe is subject to the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review the license terms for more information.

- _Socket.io:_ The use of Socket.io is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- _MongoDB:_ The use of MongoDB is subject to the [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license). Please review the license terms for more information.

- _nodemon:_ The use of nodemon is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- _Redux:_ The use of Redux is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- _Bootstrap:_ The use of Bootstrap is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- _JWT Authentication:_ The specific implementation or library used for JWT authentication is subject to its own license. Please review the license terms for more information.

Refer to the respective licenses of these components for details about permissions and restrictions. Ensure compliance with the terms of each license when using or contributing to this project.

# 🌱 EcoCycle - Collector Backend API (Node.js + Express + MongoDB + JWT)

This is the backend server built for the **Collector** module of the **EcoCycle** plastic recycling and logistics platform.

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection logic (Mongoose)
├── controllers/
│   ├── authController.js     # Register, Login (JWT), Profile
│   ├── collectorController.js# Stats, District Requests, Status progression
│   └── facilityController.js # Facilities listing
├── middleware/
│   └── authMiddleware.js     # JWT Bearer Token verification & Role authorization
├── models/
│   ├── Facility.js           # Recycling Plant schema
│   ├── Request.js            # Pickup Request schema (Lifecycle: Pending -> Completed)
│   └── User.js               # Collector / User schema with Bcrypt password hashing
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── collectorRoutes.js    # /api/collector routes (Protected)
│   └── facilityRoutes.js     # /api/facilities routes
├── seed/
│   └── seedData.js           # Database seeder (Pre-populates demo accounts & requests)
├── .env                      # Environment configuration (Port, MongoDB URI, JWT Secret)
├── .env.example              # Environment template
├── package.json              # Server dependencies & scripts
├── postman_collection.json   # Exported Postman collection for 1-click testing
├── requests.http             # In-editor REST API test script (VS Code REST Client)
└── server.js                 # Main Express server entry point
```

---

## ⚙️ Prerequisites & Setup

### 1. Install Dependencies
Open a terminal in the `server` folder and run:
```bash
npm install
```

### 2. Configure MongoDB in `.env`
Open the `.env` file in `server/.env`:
* **If using MongoDB locally:**
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/ecocycle
  ```
* **If using MongoDB Atlas (Cloud with `afiajabin12@gmail.com`):**
  1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and log in.
  2. Click **Connect** on your Database Cluster $\rightarrow$ Choose **Drivers** (Node.js).
  3. Copy your connection string and paste it into `.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecocycle?retryWrites=true&w=majority
     ```
     *(Replace `<username>` and `<password>` with your database user credentials).*

---

## 🚀 Running the Server

### 1. Seed Initial Data (Recommended for first run)
This seeds the initial collector account (`afiajabin12@gmail.com`), recycling facilities, and Bangladesh pickup requests:
```bash
npm run seed
```

> **Default Seeded Collector Account:**
> - **Email:** `afiajabin12@gmail.com`
> - **Password:** `password123`
> - **Role:** `collector`
> - **Assigned Districts:** `['Dhaka', 'Gazipur']`

### 2. Start the Server
* **Development mode (auto-reload on code changes with nodemon):**
  ```bash
  npm run dev
  ```
* **Production mode:**
  ```bash
  npm start
  ```

The server will start at: `http://localhost:5000`

---

## 🧪 Testing with Postman or VS Code

### Option A: Using Postman
1. Open **Postman**.
2. Click **Import** (top left) and choose `server/postman_collection.json`.
3. In the imported collection:
   1. Run `1. Authentication -> Login (Get JWT Token)`. It will automatically store the JWT in Postman.
   2. Run `2. Collector Operations -> Get Collector Dashboard Stats`.
   3. Run `Get District Pickup Requests` and execute the 4-step collection lifecycle!

### Option B: Using VS Code REST Client
1. Install the **REST Client** extension in VS Code.
2. Open `server/requests.http`.
3. Click **"Send Request"** above any endpoint.

---

## 📑 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new collector / user | No |
| `POST` | `/api/auth/login` | Login and receive JWT access token | No |
| `GET` | `/api/auth/me` | Get logged-in user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update profile / vehicle info | Yes (Bearer Token) |

### 🚛 Collector Operations (`/api/collector`)
*All collector endpoints require `Authorization: Bearer <token>` and `role: "collector"`.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/collector/stats` | Get KPI metrics (Pending, Accepted, Total kg, Deliveries) |
| `GET` | `/api/collector/requests` | Get pickup requests in assigned territory (supports `?status=`, `?district=`, `?search=`) |
| `GET` | `/api/collector/requests/:id` | Get single pickup request by `_id` or `requestId` |
| `PATCH` | `/api/collector/requests/:id/accept` | **Step 1:** Accept a pickup request |
| `PATCH` | `/api/collector/requests/:id/collect` | **Step 2:** Record verified scale weight (`verifiedKg`) & mark Collected |
| `PATCH` | `/api/collector/requests/:id/deliver` | **Step 3:** Select recycling facility (`facilityId`) & mark Delivered |
| `PATCH` | `/api/collector/requests/:id/complete` | **Step 4:** Finalize recycling lifecycle |

### 🏭 Recycling Facilities (`/api/facilities`)
| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/facilities` | List all recycling plants across Bangladesh | No |
| `GET` | `/api/facilities/:id` | Get single facility details | No |

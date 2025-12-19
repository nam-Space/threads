# Threads – Mạng Xã Hội Thời Gian Thực (Fullstack)

## 📌 Tổng quan dự án

**Threads** là một dự án **mạng xã hội fullstack** được xây dựng theo mô hình **Single Repository (Monorepo)**, trong đó **Frontend và Backend được tích hợp trong cùng một project**. Dự án mô phỏng các chức năng cốt lõi của một nền tảng mạng xã hội hiện đại như Threads / Twitter / Instagram, tập trung vào trải nghiệm thời gian thực và khả năng tương tác giữa người dùng.

Hệ thống cho phép người dùng:

* Đăng bài viết (text / hình ảnh)
* Like, comment bài viết
* Follow / unfollow người dùng
* Nhắn tin realtime
* Nhận thông báo theo thời gian thực

---

## 🎯 Mục tiêu dự án

* Xây dựng một **mạng xã hội hoàn chỉnh** từ frontend đến backend
* Áp dụng **Realtime Communication** với Socket.IO
* Quản lý media hiệu quả bằng **Cloudinary**
* Thiết kế hệ thống **scalable – maintainable – secure**
* Phù hợp để làm **portfolio cá nhân / đồ án / demo phỏng vấn**

---

## 🧩 Kiến trúc tổng thể hệ thống

Dự án được thiết kế theo mô hình **Client – Server – Realtime Layer**:

```
React (Vite)  ⇄  Node.js (Express)  ⇄  MongoDB
       ↓                 ↓
   Chakra UI        Socket.IO
       ↓                 ↓
   Cloudinary   (Realtime Message / Notification)
```

---

## 🚀 Công nghệ & Thư viện sử dụng

### Frontend

* **ReactJS 18** – Xây dựng UI
* **Vite** – Build tool hiệu năng cao
* **Chakra UI** – UI Component Library
* **Axios** – Gọi REST API
* **Socket.IO Client** – Realtime communication
* **React Router DOM** – Routing SPA

### Backend

* **Node.js**
* **Express.js** – RESTful API
* **MongoDB** – NoSQL Database
* **Mongoose** – ODM cho MongoDB
* **Socket.IO** – Realtime server
* **JWT (JSON Web Token)** – Authentication
* **bcrypt** – Mã hoá mật khẩu

### Media & Storage

* **Cloudinary** – Upload & quản lý hình ảnh

### Dev Tools

* **ESLint**
* **Environment Variables (.env)**

---

## 📂 Cấu trúc thư mục dự án

```bash
threads/
├── frontend/                    # React + Vite + Chakra UI
│   ├── src/
│   │   ├── components/          # Component tái sử dụng
│   │   ├── pages/               # Các trang chính
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── context/             # Global state (Auth, Socket, ...)
│   │   ├── routes/              # Routing
│   │   ├── theme/               # Chakra UI theme
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── backend/                     # Node.js + Express + MongoDB
│   ├── controllers/             # Xử lý request
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── middlewares/             # Auth, error handling
│   ├── socket/                  # Socket.IO handlers
│   ├── config/                  # DB, Cloudinary config
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## 👥 Vai trò & Chức năng người dùng

### 👤 User (Người dùng)

* Đăng ký / đăng nhập tài khoản
* Cập nhật hồ sơ cá nhân
* Follow / unfollow người dùng khác
* Xem feed bài viết từ người đã follow

### 📝 Bài viết (Post)

* Tạo bài viết (text / image)
* Like / unlike bài viết
* Comment bài viết
* Xoá bài viết của chính mình

### 💬 Nhắn tin Realtime

* Gửi / nhận tin nhắn realtime
* Hiển thị trạng thái online
* Lưu lịch sử chat

---

## 🔐 Authentication & Authorization

### Cơ chế xác thực

1. Người dùng đăng ký / đăng nhập
2. Backend xác thực và trả về **JWT Token**
3. Token được lưu tại `localStorage`
4. Mỗi request gửi kèm token trong header

```http
Authorization: Bearer <access_token>
```

### Bảo mật

* Mật khẩu được hash bằng **bcrypt**
* Token có thời hạn
* Middleware bảo vệ API private

---

## 📝 Luồng hoạt động chính

### Luồng đăng bài

1. User tạo bài viết
2. Upload ảnh lên Cloudinary
3. Lưu thông tin bài viết vào MongoDB
4. Cập nhật feed realtime

### Luồng chat realtime

1. User kết nối Socket.IO
2. Join room chat
3. Gửi tin nhắn
4. Server broadcast tin nhắn realtime

---

## 🔔 Realtime & Socket.IO

Socket.IO được sử dụng cho:

* Nhắn tin realtime
* Thông báo like / comment
* Trạng thái online/offline

Luồng Socket:

```
Client → Socket Server → Other Clients
```

---

## 🖼️ Upload & Quản lý hình ảnh (Cloudinary)

* Ảnh bài viết được upload trực tiếp lên Cloudinary
* Backend chỉ lưu URL hình ảnh
* Tối ưu performance & storage

---

## ⚙️ Cài đặt & Chạy project

### 1️⃣ Clone repository

```bash
git clone https://github.com/nam-Space/threads.git
cd threads
```

---

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

---

### 3️⃣ Cấu hình môi trường (.env)

```env
# Backend
PORT=5000
MONGO_URI=mongodb://localhost:27017/threads
JWT_SECRET=threads_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
VITE_API_URL=http://localhost:5000
```

---

### 4️⃣ Chạy development

```bash
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Scripts

```bash
npm run dev        # Chạy cả FE & BE
npm run server     # Chạy backend
npm run client     # Chạy frontend
npm run build      # Build frontend
```

---

## 🚀 Build & Deploy

### Deploy gợi ý

* **Frontend**: Vercel / Netlify
* **Backend**: VPS (PM2) / Render / Railway
* **Database**: MongoDB Atlas

---

## 🔒 Security Considerations

* Hash mật khẩu
* Validate dữ liệu đầu vào
* Giới hạn quyền truy cập
* Bảo vệ socket events

---

## Một số giao diện chính

### Giao diện trang chủ
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7de89cbc-9b68-49a1-be5b-06dc10f77361" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/03326a5a-e62e-4232-ae4e-a43a269ff1be" />

---

### Giao diện profile người dùng
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/1f1db1a5-be3c-4c90-b994-35bf7ad70922" />

---

### Giao diện nhắn tin
<img width="1919" height="1029" alt="image" src="https://github.com/user-attachments/assets/46d1bed0-8b13-435c-a5ab-8491aa4bedc6" />

---

## 🔒 Security Considerations

* Hash mật khẩu
* Validate dữ liệu đầu vào
* Giới hạn quyền truy cập
* Bảo vệ socket events

---

## 🔮 Hướng phát triển tương lai

* Story / Status
* Notification center
* Search người dùng & bài viết
* Media video
* Scale realtime server

---

## 👨‍💻 Tác giả

* **Nam Nguyen**
* GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 📄 License

Dự án phục vụ mục đích **học tập, nghiên cứu và xây dựng mạng xã hội thời gian thực**.

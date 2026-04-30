<div align="center">

# 🦐 AquaMonitor
### Hệ thống giám sát và dự đoán môi trường ao nuôi tôm thông minh

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

</div>

---

## 📌 Giới thiệu

**AquaMonitor** là hệ thống giám sát ao nuôi tôm thông minh kết hợp công nghệ **IoT** và **Trí tuệ nhân tạo (AI)**, giúp người nuôi tôm theo dõi môi trường nước theo thời gian thực, nhận cảnh báo sớm và dự đoán nguy cơ dịch bệnh.

> 📘 Đồ án tốt nghiệp — Phương thức 2 | Ngành Công nghệ thông tin

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🌡️ **Giám sát realtime** | Theo dõi pH, nhiệt độ, oxy hòa tan, độ đục mỗi 30 giây |
| 🗺️ **Pond Map** | Bản đồ ao trực quan, kéo thả thiết bị IoT |
| 🤖 **AI dự đoán** | Dự đoán nguy cơ dịch bệnh bằng Machine Learning |
| 🔔 **Cảnh báo tự động** | Tự động cảnh báo khi thông số vượt ngưỡng |
| 👥 **Cộng đồng** | Chia sẻ kinh nghiệm nuôi tôm |
| 🔐 **Bảo mật** | JWT Authentication |
| 🤖 **IoT Simulator** | Giả lập thiết bị ESP32 gửi dữ liệu tự động |

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│              React 18 — port 3000                   │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│                 Java Spring Boot                     │
│            Main Backend — port 8080                 │
│     Auth │ Pond │ Sensor │ Alert │ Post │ Comment   │
└──────┬───────────────────────────┬───────────────────┘
       │ JDBC                      │ HTTP
┌──────▼──────┐           ┌────────▼────────┐
│  SQL Server │           │  Python FastAPI │
│   port 1433 │           │   AI Service    │
│             │           │   port 8000     │
└─────────────┘           └─────────────────┘
                                   ▲
                          ┌────────┴────────┐
                          │  IoT Simulator  │
                          │ simulator.py    │
                          │ (giả lập ESP32) │
                          └─────────────────┘
```

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** — Giao diện người dùng
- **React Router DOM** — Điều hướng trang
- **React Konva** — Pond Map canvas kéo thả
- **Recharts** — Biểu đồ dữ liệu sensor
- **Axios** — Gọi REST API
- **React Hot Toast** — Thông báo

### Backend (Java)
- **Spring Boot 3.5** — REST API chính
- **Spring Security + JWT** — Xác thực và phân quyền
- **Spring Data JPA + Hibernate** — ORM
- **SQL Server 2022** — Cơ sở dữ liệu
- **Lombok** — Giảm boilerplate code
- **Swagger / OpenAPI** — Tài liệu API

### AI Service (Python)
- **FastAPI** — AI microservice
- **scikit-learn** — Machine Learning model
- **pandas + numpy** — Xử lý dữ liệu
- **IoT Simulator** — Giả lập thiết bị cảm biến

---

## 📁 Cấu trúc project

```
shrimp-farm/
├── frontend/                  # React 18
│   └── src/
│       ├── pages/             # LoginPage, PondListPage, PondDetailPage
│       ├── components/        # Navbar, PondCard, PondMap, SensorPanel...
│       ├── context/           # AuthContext (JWT)
│       └── services/          # api.js (axios)
│
├── backend/                   # Java Spring Boot
│   └── src/main/java/com/shrimpfarm/backend/
│       ├── entity/            # User, Pond, Device, SensorData, Prediction, Alert, Post, Comment
│       ├── repository/        # JPA Repositories
│       ├── service/           # Business Logic
│       ├── controller/        # REST Controllers
│       ├── config/            # SecurityConfig, JwtFilter, JwtUtils, CORS
│       └── dto/               # Data Transfer Objects
│
├── ai-service/                # Python
│   ├── simulator.py           # IoT Simulator (giả lập ESP32)
│   ├── app/                   # FastAPI AI Service
│   └── requirements.txt
│
└── docs/                      # Tài liệu, UML, ERD
```

---

## 🗄️ Database Schema

```
users ──────┬──── ponds ────┬──── devices
            │               ├──── sensor_data
            ├──── posts      ├──── predictions
            │    └── comments└──── alerts
            └──── comments
```

**8 bảng chính:** `users`, `ponds`, `devices`, `sensor_data`, `predictions`, `alerts`, `posts`, `comments`

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Java 21+
- Node.js 20+
- Python 3.11+
- SQL Server 2022

### 1. Clone repository
```bash
git clone https://github.com/chauminhtrung/shrimp-farm.git
cd shrimp-farm
```

### 2. Cài đặt Backend (Java)
```bash
cd backend

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn

# Chạy Spring Boot
mvn spring-boot:run
# Server chạy tại http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### 3. Cài đặt Frontend (React)
```bash
cd frontend
npm install
npm start
# Chạy tại http://localhost:3000
```

### 4. Cài đặt AI Service (Python)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Linux/Mac

pip install -r requirements.txt
```

### 5. Chạy IoT Simulator
```bash
cd ai-service
python simulator.py
# Tự động gửi dữ liệu sensor mỗi 15 giây
```

---

## 🔑 Biến môi trường

### Backend (`backend/.env`)
```env
DB_URL=jdbc:sqlserver://localhost:1433;databaseName=shrimp_farm;encrypt=false;trustServerCertificate=true
DB_USERNAME=sa
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
```

### AI Service (`ai-service/.env`)
```env
JAVA_API_URL=http://localhost:8080
SIMULATE_INTERVAL=15
```

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/ponds?userId={id}` | Danh sách ao | ✅ |
| POST | `/api/ponds` | Tạo ao mới | ✅ |
| GET | `/api/sensor/latest/{pondId}` | Sensor mới nhất | ❌ |
| POST | `/api/sensor` | Nhận dữ liệu IoT | ❌ |
| POST | `/api/predict` | Chạy AI dự đoán | ✅ |
| GET | `/api/alerts?pondId={id}` | Danh sách cảnh báo | ❌ |
| GET | `/api/posts` | Bài viết cộng đồng | ❌ |

> 📖 Xem đầy đủ tại: `http://localhost:8080/swagger-ui.html`

---

## 🤖 AI Prediction

Hệ thống dự đoán nguy cơ dịch bệnh dựa trên các thông số môi trường:

| Thông số | Ngưỡng an toàn | Đơn vị |
|----------|---------------|--------|
| Nhiệt độ | 25 – 32 | °C |
| pH | 6.5 – 8.5 | — |
| Oxy hòa tan | > 4.0 | mg/L |
| Độ đục | 0 – 5 | NTU |

**Kết quả dự đoán:**
- 🟢 `LOW` — Môi trường ổn định
- 🟡 `MEDIUM` — Cần theo dõi thêm
- 🔴 `HIGH` — Cần can thiệp ngay

---

## 👨‍💻 Tác giả

**Châu Minh Trung**
- GitHub: [@chauminhtrung](https://github.com/chauminhtrung)

---

## 📄 License

MIT License — Đồ án tốt nghiệp 2025–2026

---

<div align="center">
  Made with ❤️ for smart shrimp farming 🦐
</div>

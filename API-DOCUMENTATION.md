# 🔌 EcoFusion API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.ecofusion.com/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "SecurePass123!",
  "phone": "+91-9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "level": "Bronze",
      "tokens": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "arjun@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "level": "Silver",
      "tokens": 245.50
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Endpoints

### Get User Profile
```http
GET /users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Arjun Sharma",
    "email": "arjun@example.com",
    "phone": "+91-9876543210",
    "level": "Silver",
    "tokens": 245.50,
    "totalWasteKg": 45.8,
    "co2Saved": 114.5,
    "submissions": 12,
    "achievements": ["first_submission", "eco_warrior"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update User Profile
```http
PATCH /users/me
```

**Request Body:**
```json
{
  "name": "Arjun Kumar Sharma",
  "phone": "+91-9876543211",
  "address": {
    "street": "123 Green Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Arjun Kumar Sharma",
    "phone": "+91-9876543211",
    "address": {
      "street": "123 Green Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }
}
```

---

## ♻️ Waste Submission Endpoints

### Submit Waste
```http
POST /submissions
```

**Request Body (multipart/form-data):**
```
wasteType: "Plastic PET"
weight: 5.5
image: <file>
location: {
  "latitude": 19.0760,
  "longitude": 72.8777
}
notes: "Clean plastic bottles"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub_456",
    "wasteType": "Plastic PET",
    "weight": 5.5,
    "tokensEarned": 55,
    "status": "pending",
    "imageUrl": "https://cdn.ecofusion.com/submissions/sub_456.jpg",
    "createdAt": "2024-04-22T14:30:00Z"
  }
}
```

### Get Submission History
```http
GET /submissions?page=1&limit=10&status=verified
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, verified, rejected)

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "sub_456",
        "wasteType": "Plastic PET",
        "weight": 5.5,
        "tokensEarned": 55,
        "status": "verified",
        "imageUrl": "https://cdn.ecofusion.com/submissions/sub_456.jpg",
        "createdAt": "2024-04-22T14:30:00Z",
        "verifiedAt": "2024-04-22T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### Get Submission Details
```http
GET /submissions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub_456",
    "wasteType": "Plastic PET",
    "weight": 5.5,
    "tokensEarned": 55,
    "status": "verified",
    "imageUrl": "https://cdn.ecofusion.com/submissions/sub_456.jpg",
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "notes": "Clean plastic bottles",
    "createdAt": "2024-04-22T14:30:00Z",
    "verifiedAt": "2024-04-22T15:00:00Z",
    "verifiedBy": "admin_789"
  }
}
```

---

## 🚚 Pickup Endpoints

### Request Pickup
```http
POST /pickups
```

**Request Body:**
```json
{
  "wasteTypes": ["Plastic", "Paper", "Metal"],
  "estimatedWeight": 15.0,
  "address": {
    "street": "123 Green Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "preferredDate": "2024-04-25",
  "preferredTime": "10:00-12:00",
  "notes": "Please call before arriving"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pickup_789",
    "status": "scheduled",
    "scheduledDate": "2024-04-25T10:00:00Z",
    "estimatedWeight": 15.0,
    "address": {
      "street": "123 Green Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "trackingNumber": "ECO-2024-789"
  }
}
```

### Get Pickup History
```http
GET /pickups?status=completed
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pickups": [
      {
        "id": "pickup_789",
        "status": "completed",
        "scheduledDate": "2024-04-25T10:00:00Z",
        "completedDate": "2024-04-25T11:30:00Z",
        "actualWeight": 16.5,
        "tokensEarned": 165,
        "trackingNumber": "ECO-2024-789"
      }
    ]
  }
}
```

### Track Pickup
```http
GET /pickups/:id/track
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pickup_789",
    "status": "in_transit",
    "trackingNumber": "ECO-2024-789",
    "timeline": [
      {
        "status": "scheduled",
        "timestamp": "2024-04-24T10:00:00Z"
      },
      {
        "status": "assigned",
        "timestamp": "2024-04-25T09:00:00Z",
        "driver": "Rajesh Kumar"
      },
      {
        "status": "in_transit",
        "timestamp": "2024-04-25T10:15:00Z"
      }
    ],
    "estimatedArrival": "2024-04-25T11:00:00Z"
  }
}
```

---

## 🎁 Marketplace Endpoints

### Get Rewards
```http
GET /marketplace/rewards?category=vouchers&minTokens=50&maxTokens=500
```

**Query Parameters:**
- `category` (optional): Filter by category
- `minTokens` (optional): Minimum token cost
- `maxTokens` (optional): Maximum token cost
- `available` (optional): Only show available rewards

**Response:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": "reward_101",
        "name": "Amazon ₹100 Voucher",
        "description": "Redeemable on Amazon.in",
        "category": "vouchers",
        "tokenCost": 100,
        "imageUrl": "https://cdn.ecofusion.com/rewards/amazon-100.jpg",
        "available": true,
        "stock": 50
      },
      {
        "id": "reward_102",
        "name": "Plant a Tree",
        "description": "We'll plant a tree in your name",
        "category": "environmental",
        "tokenCost": 10,
        "imageUrl": "https://cdn.ecofusion.com/rewards/tree.jpg",
        "available": true,
        "stock": 1000
      }
    ]
  }
}
```

### Redeem Reward
```http
POST /marketplace/redeem
```

**Request Body:**
```json
{
  "rewardId": "reward_101",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "redemption_555",
      "rewardId": "reward_101",
      "rewardName": "Amazon ₹100 Voucher",
      "tokensCost": 100,
      "voucherCode": "AMZN-XXXX-XXXX-XXXX",
      "status": "completed",
      "redeemedAt": "2024-04-22T16:00:00Z",
      "expiresAt": "2025-04-22T23:59:59Z"
    },
    "remainingTokens": 145.50
  }
}
```

### Get Redemption History
```http
GET /marketplace/redemptions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "id": "redemption_555",
        "rewardName": "Amazon ₹100 Voucher",
        "tokensCost": 100,
        "status": "completed",
        "redeemedAt": "2024-04-22T16:00:00Z"
      }
    ]
  }
}
```

---

## 🏆 Leaderboard Endpoints

### Get Global Leaderboard
```http
GET /leaderboard/global?period=monthly&limit=100
```

**Query Parameters:**
- `period` (optional): daily, weekly, monthly, all-time (default: monthly)
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_999",
        "name": "Priya S.",
        "tokens": 892,
        "wasteKg": 89.2,
        "level": "Gold"
      },
      {
        "rank": 2,
        "userId": "user_888",
        "name": "Rahul M.",
        "tokens": 674,
        "wasteKg": 67.4,
        "level": "Silver"
      }
    ],
    "userRank": {
      "rank": 45,
      "tokens": 245.50,
      "percentile": 85
    }
  }
}
```

### Get Local Leaderboard
```http
GET /leaderboard/local?city=Mumbai&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_777",
        "name": "Amit K.",
        "tokens": 456,
        "city": "Mumbai"
      }
    ]
  }
}
```

---

## 📊 Analytics Endpoints

### Get User Stats
```http
GET /analytics/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTokens": 245.50,
    "totalWasteKg": 45.8,
    "co2Saved": 114.5,
    "submissions": 12,
    "pickups": 3,
    "redemptions": 2,
    "streak": 7,
    "level": "Silver",
    "nextLevelTokens": 254.50,
    "achievements": 8
  }
}
```

### Get Impact Timeline
```http
GET /analytics/timeline?period=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2024-04-22",
        "wasteKg": 5.5,
        "tokensEarned": 55,
        "co2Saved": 13.75
      },
      {
        "date": "2024-04-21",
        "wasteKg": 3.2,
        "tokensEarned": 32,
        "co2Saved": 8.0
      }
    ]
  }
}
```

---

## 🎯 Achievements Endpoints

### Get User Achievements
```http
GET /achievements
```

**Response:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first_submission",
        "name": "First Step",
        "description": "Made your first waste submission",
        "icon": "🎯",
        "unlockedAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "eco_warrior",
        "name": "Eco Warrior",
        "description": "Recycled 100kg of waste",
        "icon": "🏆",
        "unlockedAt": "2024-03-20T14:00:00Z"
      }
    ],
    "locked": [
      {
        "id": "consistency_king",
        "name": "Consistency King",
        "description": "30-day submission streak",
        "icon": "👑",
        "progress": 7,
        "target": 30
      }
    ]
  }
}
```

---

## 🌍 Global Impact Endpoints

### Get Global Stats
```http
GET /global/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 12847,
    "totalWasteKg": 340000,
    "totalCO2Saved": 850000,
    "totalTokensIssued": 4200000,
    "activeCountries": 15,
    "treesPlanted": 5000
  }
}
```

### Get Hotspots
```http
GET /global/hotspots
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hotspots": [
      {
        "city": "Mumbai",
        "country": "India",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "activeUsers": 1250,
        "wasteKg": 45000
      }
    ]
  }
}
```

---

## ❌ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid login credentials |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INSUFFICIENT_TOKENS` | 400 | Not enough tokens for redemption |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 🔄 Rate Limiting

- **Authentication**: 5 requests per minute
- **Submissions**: 10 requests per hour
- **General API**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619712000
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary values are in INR
- All weights are in kilograms
- Token values are decimal numbers with 2 decimal places
- Image uploads support: JPG, PNG, WEBP (max 5MB)

---

**API Version**: 1.0.0  
**Last Updated**: April 22, 2024

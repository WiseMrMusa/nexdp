# NexDP API Endpoints

## Authentication

### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "username",
  "fullName": "Full Name"
}

Response (201 Created):
{
  "id": "user123",
  "email": "user@example.com",
  "username": "username",
  "fullName": "Full Name",
  "token": "jwt_token_here"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200 OK):
{
  "id": "user123",
  "email": "user@example.com",
  "username": "username",
  "token": "jwt_token_here"
}
```

## Templates

### Create Template
```http
POST /api/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Template Title",
  "description": "Template Description",
  "elements": [
    {
      "type": "text",
      "content": "Sample Text",
      "position": { "x": 100, "y": 100 }
    },
    {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "position": { "x": 200, "y": 200 }
    }
  ]
}

Response (201 Created):
{
  "id": "template123",
  "title": "Template Title",
  "description": "Template Description",
  "elements": [...],
  "createdAt": "2024-03-20T10:00:00Z",
  "userId": "user123"
}
```

### Get Template
```http
GET /api/templates/:templateId

Response (200 OK):
{
  "id": "template123",
  "title": "Template Title",
  "description": "Template Description",
  "elements": [...],
  "createdAt": "2024-03-20T10:00:00Z",
  "userId": "user123",
  "likes": 42,
  "comments": [...]
}
```

### Update Template
```http
PUT /api/templates/:templateId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "elements": [...]
}

Response (200 OK):
{
  "id": "template123",
  "title": "Updated Title",
  "description": "Updated Description",
  "elements": [...],
  "updatedAt": "2024-03-20T11:00:00Z"
}
```

### Delete Template
```http
DELETE /api/templates/:templateId
Authorization: Bearer <token>

Response (204 No Content)
```

## Social Features

### Like Template
```http
POST /api/templates/:templateId/like
Authorization: Bearer <token>

Response (200 OK):
{
  "liked": true,
  "likesCount": 43
}
```

### Comment on Template
```http
POST /api/templates/:templateId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great template!"
}

Response (201 Created):
{
  "id": "comment123",
  "content": "Great template!",
  "userId": "user123",
  "username": "username",
  "createdAt": "2024-03-20T12:00:00Z"
}
```

### Follow User
```http
POST /api/users/:userId/follow
Authorization: Bearer <token>

Response (200 OK):
{
  "following": true,
  "followersCount": 123
}
```

## Search

### Search Templates
```http
GET /api/search/templates?q=query&page=1&limit=10

Response (200 OK):
{
  "templates": [
    {
      "id": "template123",
      "title": "Template Title",
      "description": "Template Description",
      "userId": "user123",
      "username": "username",
      "likes": 42
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### Search Users
```http
GET /api/search/users?q=query&page=1&limit=10

Response (200 OK):
{
  "users": [
    {
      "id": "user123",
      "username": "username",
      "fullName": "Full Name",
      "followersCount": 123
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

## User Profile

### Get User Profile
```http
GET /api/users/:userId

Response (200 OK):
{
  "id": "user123",
  "username": "username",
  "fullName": "Full Name",
  "templatesCount": 10,
  "followersCount": 123,
  "followingCount": 45,
  "templates": [
    {
      "id": "template123",
      "title": "Template Title",
      "likes": 42
    }
  ]
}
```

### Get User Templates
```http
GET /api/users/:userId/templates?page=1&limit=10

Response (200 OK):
{
  "templates": [
    {
      "id": "template123",
      "title": "Template Title",
      "description": "Template Description",
      "likes": 42
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

## Image Management

### Upload Image
```http
POST /api/images/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>

Response (201 Created):
{
  "id": "image123",
  "url": "https://cdn.nexdp.xyz/images/image123.jpg",
  "size": 1024,
  "type": "image/jpeg"
}
```

### Download Template as Image
```http
GET /api/templates/:templateId/download
Authorization: Bearer <token>

Response (200 OK):
Content-Type: image/png
Content-Disposition: attachment; filename="template123.png"
``` 
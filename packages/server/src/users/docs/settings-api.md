# Settings API Documentation

This document outlines the comprehensive settings API endpoints that correspond to the frontend settings flow.

## Base URL

```
/api/settings
```

## Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header.

## Endpoints

### 1. Get User Profile and Settings

**GET** `/settings/profile`

Retrieves the complete user profile and settings information.

**Response:**

```json
{
  "profile": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "country": "US",
    "city": "San Francisco",
    "bio": "User bio...",
    "avatar": "avatar_url",
    "interestsCategories": ["FITNESS", "TECHNOLOGY"],
    "interestsCommodities": ["Running", "Programming"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "settings": {
    "userId": "user_id",
    "dashboardLayout": "detailed",
    "activityDisplay": "cards",
    "buddyRadius": 25,
    "autoAcceptBuddies": false,
    "emailNotifications": true,
    "pushNotifications": true,
    "buddyRequestNotifications": true,
    "activityReminderNotifications": true,
    "milestoneNotifications": true,
    "newsletterNotifications": false,
    "quietHours": false,
    "quietHoursStart": "22:00",
    "quietHoursEnd": "08:00",
    "publicProfile": true,
    "showActivity": true,
    "showLocation": false,
    "showInterests": true,
    "profileVisibility": "public",
    "locationSharing": "city",
    "twoFactorAuth": false,
    "loginNotifications": true,
    "sessionTimeout": 30,
    "dataRetention": "indefinite",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Update Profile Information

**PUT** `/settings/profile`

Updates user profile information including name, bio, phone, location, interests, and avatar.

**Request Body:**

```json
{
  "name": "John Doe",
  "bio": "Updated bio...",
  "phoneNumber": "+1234567890",
  "avatar": "new_avatar_url",
  "country": "US",
  "city": "San Francisco",
  "interestsCategories": ["FITNESS", "TECHNOLOGY"],
  "interestsCommodities": ["Running", "Programming", "New Interest"]
}
```

**Response:**

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Updated bio...",
  "phoneNumber": "+1234567890",
  "avatar": "new_avatar_url",
  "country": "US",
  "city": "San Francisco",
  "interestsCategories": ["FITNESS", "TECHNOLOGY"],
  "interestsCommodities": ["Running", "Programming", "New Interest"],
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Update Preferences

**PUT** `/settings/preferences`

Updates user app preferences including dashboard layout, activity display, buddy radius, and auto-accept settings.

**Request Body:**

```json
{
  "dashboardLayout": "compact",
  "activityDisplay": "list",
  "buddyRadius": 50,
  "autoAcceptBuddies": true
}
```

**Response:**

```json
{
  "userId": "user_id",
  "dashboardLayout": "compact",
  "activityDisplay": "list",
  "buddyRadius": 50,
  "autoAcceptBuddies": true,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Notification Settings

**PUT** `/settings/notifications`

Updates notification preferences including email, push, and specific notification types.

**Request Body:**

```json
{
  "emailNotifications": true,
  "pushNotifications": false,
  "buddyRequestNotifications": true,
  "activityReminderNotifications": true,
  "milestoneNotifications": false,
  "newsletterNotifications": true,
  "quietHours": true,
  "quietHoursStart": "23:00",
  "quietHoursEnd": "07:00"
}
```

**Response:**

```json
{
  "userId": "user_id",
  "emailNotifications": true,
  "pushNotifications": false,
  "buddyRequestNotifications": true,
  "activityReminderNotifications": true,
  "milestoneNotifications": false,
  "newsletterNotifications": true,
  "quietHours": true,
  "quietHoursStart": "23:00",
  "quietHoursEnd": "07:00",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Update Privacy Settings

**PUT** `/settings/privacy`

Updates privacy preferences including profile visibility and data sharing settings.

**Request Body:**

```json
{
  "publicProfile": false,
  "showActivity": true,
  "showLocation": false,
  "showInterests": true,
  "profileVisibility": "friends",
  "locationSharing": "country"
}
```

**Response:**

```json
{
  "userId": "user_id",
  "publicProfile": false,
  "showActivity": true,
  "showLocation": false,
  "showInterests": true,
  "profileVisibility": "friends",
  "locationSharing": "country",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Update Account Settings

**PUT** `/settings/account`

Updates account security and management settings.

**Request Body:**

```json
{
  "twoFactorAuth": true,
  "loginNotifications": false,
  "sessionTimeout": 60,
  "dataRetention": "1year"
}
```

**Response:**

```json
{
  "userId": "user_id",
  "twoFactorAuth": true,
  "loginNotifications": false,
  "sessionTimeout": 60,
  "dataRetention": "1year",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 7. Change Password

**POST** `/settings/change-password`

Changes the user's password with proper validation.

**Request Body:**

```json
{
  "currentPassword": "current_password",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

### 8. Export User Data

**GET** `/settings/export-data`

Exports all user data including profile and settings for data portability.

**Response:**

```json
{
  "profile": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
    // ... complete profile data
  },
  "settings": {
    "userId": "user_id"
    // ... complete settings data
  },
  "exportDate": "2024-01-01T00:00:00.000Z"
}
```

### 9. Delete Account

**DELETE** `/settings/account`

Permanently deletes the user account and all associated data.

**Response:**

```json
{
  "message": "Account deleted successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **404 Not Found**: User or resource not found
- **500 Internal Server Error**: Server-side errors

**Error Response Format:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/settings/profile"
}
```

## Validation Rules

### Profile Updates

- `name`: Required string
- `bio`: Optional string, max 500 characters
- `phoneNumber`: Optional string
- `avatar`: Optional valid URL
- `country`: Optional enum value
- `city`: Optional string
- `interestsCategories`: Optional array of enum values
- `interestsCommodities`: Optional array of strings

### Password Changes

- `currentPassword`: Required string
- `newPassword`: Required string, min 8 characters, must contain uppercase, lowercase, number, and special character
- `confirmPassword`: Required string, must match newPassword

### Notification Settings

- `quietHoursStart` and `quietHoursEnd`: Must be in HH:MM format (24-hour)

### Account Settings

- `sessionTimeout`: Number between 5 and 1440 minutes
- `dataRetention`: Must be one of: '30days', '90days', '1year', 'indefinite'

## Frontend Integration

These endpoints directly correspond to the frontend settings tabs:

1. **Profile Tab** → `/settings/profile` (GET/PUT)
2. **Preferences Tab** → `/settings/preferences` (PUT)
3. **Notifications Tab** → `/settings/notifications` (PUT)
4. **Privacy Tab** → `/settings/privacy` (PUT)
5. **Account Tab** → `/settings/account` (PUT), `/settings/change-password` (POST), `/settings/export-data` (GET), `/settings/account` (DELETE)

The API provides a complete backend implementation that supports all the functionality shown in the frontend settings interface.

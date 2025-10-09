# 🚀 Complete ASP.NET Core Stack for Taba3ni Dairy

## 📦 **Tech Stack Overview**

```
├── Backend: ASP.NET Core 8.0 (C#)
├── Database: PostgreSQL 15+
├── ORM: Entity Framework Core 8
├── Authentication: JWT + ASP.NET Identity
├── Real-time: SignalR
├── File Storage: Azure Blob Storage / AWS S3
├── Caching: Redis
├── Background Jobs: Hangfire
├── API Documentation: Swagger/OpenAPI
├── Logging: Serilog
├── Testing: xUnit
└── Deployment: Docker + Azure/AWS
```

---

## 🛠️ **Step 1: Installation Requirements**

### **Install .NET 8 SDK**

```bash
# Windows (via winget)
winget install Microsoft.DotNet.SDK.8

# macOS (via Homebrew)
brew install dotnet@8

# Linux (Ubuntu/Debian)
wget https://dot.net/v1/dotnet-install.sh
sudo chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0

# Verify installation
dotnet --version  # Should show 8.0.x
```

### **Install PostgreSQL**

```bash
# Windows: Download from https://www.postgresql.org/download/windows/

# macOS
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
```

### **Install Redis (Optional but recommended)**

```bash
# Windows: Download from https://github.com/microsoftarchive/redis/releases

# macOS
brew install redis
brew services start redis

# Linux
sudo apt install redis-server
sudo systemctl start redis
```

### **Install IDE**

- **Visual Studio 2022** (Windows) - Best for .NET
- **JetBrains Rider** (Cross-platform) - Excellent paid option
- **VS Code** (Cross-platform) - Free with C# extension

---

## 🏗️ **Step 2: Create Project Structure**

### **1. Create Solution & Projects**

```bash
# Create solution folder
mkdir Taba3niDairy
cd Taba3niDairy

# Create solution
dotnet new sln -n Taba3niDairy

# Create API project
dotnet new webapi -n Taba3niDairy.API
dotnet sln add Taba3niDairy.API/Taba3niDairy.API.csproj

# Create Core/Domain project (Business Logic)
dotnet new classlib -n Taba3niDairy.Core
dotnet sln add Taba3niDairy.Core/Taba3niDairy.Core.csproj

# Create Infrastructure project (Data Access)
dotnet new classlib -n Taba3niDairy.Infrastructure
dotnet sln add Taba3niDairy.Infrastructure/Taba3niDairy.Infrastructure.csproj

# Project structure
Taba3niDairy/
├── Taba3niDairy.sln
├── Taba3niDairy.API/              # API Controllers, Middleware
├── Taba3niDairy.Core/             # Entities, Interfaces, DTOs
└── Taba3niDairy.Infrastructure/   # EF Core, Repositories
```

---

## 📦 **Step 3: Install NuGet Packages**

### **Taba3niDairy.API**

```bash
cd Taba3niDairy.API

# Database
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.0

# Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.0

# Real-time (SignalR is built-in, no package needed)

# File Upload
dotnet add package Azure.Storage.Blobs --version 12.19.1
# OR for AWS
dotnet add package AWSSDK.S3 --version 3.7.300

# Caching
dotnet add package StackExchange.Redis --version 2.7.10
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis --version 8.0.0

# Background Jobs
dotnet add package Hangfire.Core --version 1.8.6
dotnet add package Hangfire.PostgreSql --version 1.20.8
dotnet add package Hangfire.AspNetCore --version 1.8.6

# API Documentation
dotnet add package Swashbuckle.AspNetCore --version 6.5.0

# Logging
dotnet add package Serilog.AspNetCore --version 8.0.0
dotnet add package Serilog.Sinks.PostgreSQL --version 2.3.0
dotnet add package Serilog.Sinks.Console --version 5.0.1

# Utilities
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection --version 12.0.1
dotnet add package FluentValidation.AspNetCore --version 11.3.0
dotnet add package BCrypt.Net-Next --version 4.0.3
```

### **Taba3niDairy.Infrastructure**

```bash
cd ../Taba3niDairy.Infrastructure

dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0

# Add reference to Core project
dotnet add reference ../Taba3niDairy.Core/Taba3niDairy.Core.csproj
```

### **Taba3niDairy.Core**

```bash
cd ../Taba3niDairy.Core

# No additional packages needed (pure domain logic)
```

---

## 🗄️ **Step 4: Database Setup**

### **1. Create PostgreSQL Database**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE taba3ni_dairy;

-- Create user
CREATE USER taba3ni_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taba3ni_dairy TO taba3ni_user;

-- Connect to the database
\c taba3ni_dairy

-- Run the schema from the previous artifact (complete PostgreSQL schema)
-- Copy and paste the entire schema SQL script
```

### **2. Connection String**

Add to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=taba3ni_dairy;Username=taba3ni_user;Password=your_secure_password"
  }
}
```

---

## 📁 **Step 5: Project Structure**

### **Taba3niDairy.Core/** (Domain Layer)

```
Core/
├── Entities/
│   ├── User.cs
│   ├── Product.cs
│   ├── Order.cs
│   ├── Client.cs
│   ├── Delivery.cs
│   ├── Distributor.cs
│   └── ...
├── Interfaces/
│   ├── IRepository.cs
│   ├── IUnitOfWork.cs
│   ├── IAuthService.cs
│   └── ...
├── DTOs/
│   ├── OrderDto.cs
│   ├── ProductDto.cs
│   └── ...
├── Enums/
│   ├── OrderStatus.cs
│   ├── PaymentStatus.cs
│   └── ...
└── Specifications/
    └── ...
```

### **Taba3niDairy.Infrastructure/** (Data Layer)

```
Infrastructure/
├── Data/
│   ├── ApplicationDbContext.cs
│   ├── UnitOfWork.cs
│   └── Configurations/
│       ├── UserConfiguration.cs
│       ├── OrderConfiguration.cs
│       └── ...
├── Repositories/
│   ├── Repository.cs
│   ├── OrderRepository.cs
│   └── ...
├── Services/
│   ├── AuthService.cs
│   ├── FileStorageService.cs
│   └── ...
└── Migrations/
    └── (auto-generated)
```

### **Taba3niDairy.API/** (Presentation Layer)

```
API/
├── Controllers/
│   ├── AuthController.cs
│   ├── OrdersController.cs
│   ├── ProductsController.cs
│   ├── ClientsController.cs
│   ├── DeliveriesController.cs
│   └── DistributorsController.cs
├── Hubs/ (SignalR)
│   └── DeliveryTrackingHub.cs
├── Middleware/
│   ├── ExceptionMiddleware.cs
│   └── JwtMiddleware.cs
├── Filters/
│   └── ValidationFilter.cs
├── Extensions/
│   └── ServiceExtensions.cs
├── Program.cs
└── appsettings.json
```

---

## ⚙️ **Step 6: appsettings.json Configuration**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=taba3ni_dairy;Username=taba3ni_user;Password=your_password",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-min-256-bits-long-change-in-production",
    "Issuer": "Taba3niDairy",
    "Audience": "Taba3niDairyUsers",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "AzureStorage": {
    "ConnectionString": "your-azure-storage-connection
```

# ZeeroMarket - B2B Marketplace & Auction Prototype

ZeeroMarket is a cross-platform mobile application prototype built using **React Native (TypeScript)** and **Redux Toolkit**. The platform seamlessly integrates three distinct user roles—Buyers, Suppliers, and System Administrators—into a unified commerce engine featuring direct fixed-price wholesale purchasing and live bidding auction rooms.

---

## Features Implemented

1. **Role-Based Authentication**
   * Dynamic interface layout switching depending on the logged-in role (`buyer`, `supplier`, `admin`).
   * Secure, local state tracking powered by Redux slices.

2. **B2B Marketplace Module**
   * **Suppliers:** Dedicated inventory upload suite tracking custom item details (Title, Description, Price).
   * **Buyers:** Streamlined item catalogs filtering out unapproved stock items.

3. **Live Auction Module**
   * Real-time ticking countdown displays.
   * Validation layers rejecting bids lower than or equal to the current leading bid.
   * Automatic component lockouts preventing bids once the countdown timer expires.

4. **Supplier Hub & Catalog Dashboard**
   * Aggregated performance metric blocks tracking inventory status.
   * Lifecycle filters sorting products by state: All, Pending Verification, and Published Live.

5. **Admin Control Room Panel**
   * Overview grid mapping active platform user accounts.
   * Moderation pipeline queue enabling immediate Approve or Reject overrides on incoming items.

---

## Technical Architecture Choices
* **Framework:** React Native (TypeScript) for modular, typed UI components.
* **State Management:** Redux Toolkit for unified global data tracking.
* **Navigation:** React Navigation (Native Stack) for role-restricted UI branching.

---

## Local Installation & Running Guide

### 1. Project Initialization
Clone the repository and install the dependencies from the project root folder:
```bash
npm install
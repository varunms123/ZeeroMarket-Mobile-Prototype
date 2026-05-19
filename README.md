# ZeeroMarket - B2B Marketplace & Auction Prototype

[cite_start]ZeeroMarket is a cross-platform mobile application prototype built using **React Native (TypeScript)** and **Redux Toolkit**[cite: 3, 17, 70]. [cite_start]The platform seamlessly integrates three distinct user roles—Buyers, Suppliers, and System Administrators—into a unified commerce engine featuring direct fixed-price wholesale purchasing and live bidding auction rooms.

---

## Features Implemented

1. **Role-Based Authentication**
   * [cite_start]Dynamic interface layout switching depending on the logged-in role (`buyer`, `supplier`, `admin`)[cite: 18, 23].
   * [cite_start]Secure, local state tracking powered by Redux slices[cite: 70].

2. **B2B Marketplace Module**
   * [cite_start]**Suppliers:** Dedicated inventory upload suite tracking custom item details (Title, Description, Price)[cite: 33, 37, 38, 39].
   * [cite_start]**Buyers:** Streamlined item catalogs filtering out unapproved stock items[cite: 42].

3. **Live Auction Module**
   * [cite_start]Real-time ticking countdown displays[cite: 49].
   * [cite_start]Validation layers rejecting bids lower than or equal to the current leading bid[cite: 47, 48].
   * Automatic component lockouts preventing bids once the countdown timer expires.

4. **Supplier Hub & Catalog Dashboard**
   * [cite_start]Aggregated performance metric blocks tracking inventory status.
   * [cite_start]Lifecycle filters sorting products by state: All, Pending Verification, and Published Live.

5. **Admin Control Room Panel**
   * [cite_start]Overview grid mapping active platform user accounts[cite: 52, 53].
   * [cite_start]Moderation pipeline queue enabling immediate Approve or Reject overrides on incoming items[cite: 52, 55].

---

## Technical Architecture Choices
* [cite_start]**Framework:** React Native (TypeScript) for modular, typed UI components.
* [cite_start]**State Management:** Redux Toolkit for unified global data tracking[cite: 70].
* [cite_start]**Navigation:** React Navigation (Native Stack) for role-restricted UI branching[cite: 60].

---

## Local Installation & Running Guide

### 1. Project Initialization
Clone the repository and install the dependencies from the project root folder:
```bash
npm install

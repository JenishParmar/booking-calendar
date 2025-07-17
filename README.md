# Booking Calendar UI with Pricing

A responsive booking calendar built using **React + TypeScript + Tailwind CSS**, inspired by the provided UI screenshot.

---

## Features

- Fully responsive **April 2024** calendar (hardcoded)
- Select/Unselect available dates with real-time visual feedback
- Shows **total nights** and **total price** dynamically
- Disabled dates are non-interactive and greyed out
- Clean, accessible, and responsive UI using Tailwind CSS

---

## Project Objective

Replicate a booking calendar interface with pricing and selection functionality.

### Requirements

- Use **React (TypeScript)** and **Tailwind CSS**
- Implement calendar for **April 2024 only**
- Dates are categorised:
  - **Selected**: Purple background
  - **Available**: White background (selectable)
  - **Disabled**: Grey background (non-interactive)
- Clicking a date:
  - Selects or deselects it
  - Recalculates **total nights** and **total cost**
- Price per day is hardcoded (based on design)

---

## Functionality Logic

| Action                      | Result                                      |
| --------------------------- | ------------------------------------------- |
| Click on **Available Date** | Selected (purple), adds to state            |
| Click on **Selected Date**  | Unselected (white), removed from state      |
| Click on **Disabled Date**  | No action (greyed out)                      |
| Below the calendar          | Displays total nights and cost in real-time |

---

## Tech Stack

- React (with TypeScript)
- Tailwind CSS
- React Hooks (useState)

---

## Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/HarshAntalaTechier/booking-calendar.git
cd booking-calendar

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```
# booking-calendar

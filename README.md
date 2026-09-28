# Expense Tracker

A simple expense tracker built with vanilla HTML, CSS and JavaScript (ES modules). Data is saved in the browser's Local Storage, so it stays after a refresh.

## Features

- Add, edit and delete income and expense transactions
- Amount, category, date and description for each transaction
- Total income, total expenses and current balance
- Filter by type (income or expense) and by category
- Data persisted in Local Storage
- Responsive layout for desktop and mobile
- Bonus: monthly summary, category-wise expense chart, form validation with error messages

## Tech Stack

- HTML5, CSS3, JavaScript (ES modules, no framework)
- `serve` for a local static server, `prettier` for formatting

## Getting Started

Prerequisite: [Node.js](https://nodejs.org/) 18 or later.

```bash
git clone https://github.com/ardrapadmakumar/expense-tracker-ardra.git
cd expense-tracker-ardra
npm install
npm start
```

Open the URL printed in the terminal (usually http://localhost:3000).

The app uses ES modules, so it must be served over HTTP. Opening `index.html` directly from the file system will not work. The VS Code "Live Server" extension also works.

## Scripts

| Command          | Description                 |
| ---------------- | --------------------------- |
| `npm start`      | Start the local dev server  |
| `npm run format` | Format all files (Prettier) |

## Project Structure

```
index.html
css/
  base.css          reset, variables, typography
  layout.css        grid and responsive breakpoints
  components.css    cards, buttons, form, list, chart
js/
  main.js           entry point, wires services and UI
  config/           constants (categories, storage key, limits)
  services/         storage (Local Storage) and transaction logic
  ui/               form, list, summary, filters, chart modules
  utils/            DOM helpers, formatters, validators
```

## Design Notes

- Services hold data and business logic and never touch the DOM.
- UI modules only render and handle events, and receive callbacks from `main.js`.
- `TransactionService` receives its storage via the constructor, so it can be tested with a fake storage.
- User input is rendered with `textContent`, never `innerHTML`, to avoid XSS.
- Amounts are rounded to 2 decimals to avoid floating point errors.

## Author

Ardra

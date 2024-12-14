# Dynamic Event Calendar

A React-based dynamic event calendar application built with Vite, Tailwind CSS, and shadcn/ui components.

## Features

- Monthly calendar view with navigation
- Add, edit, and delete events
- View events for a specific day
- Filter events by keyword
- Data persistence using localStorage
- Drag and drop events between dates
- Allow exporting events as JSON or CSV
- Check for Clashing of Events
- Light and dark mode support

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build for production: `npm run build`

## Deployment

This project is deployed at: [https://dynamic-drag-and-drop-event-calendar-2vb3.vercel.app/]

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- react-beautiful-dnd for drag and drop functionality

## Working

- This is a single-page project where the calendar is displayed using custom-built code without using any library.
- On the calendar, the current date will be displayed by default. You can add, update, or delete an event for a particular date by simply clicking on the date.
- You can download the list of events as a JSON or CSV file using the buttons provided at the bottom, and the events can also be viewed directly.
- If you wish to change the position of an event from one date to another, you can simply drag the event. If the event clashes with another, an alert dialog will appear.
- Similarly, if you try to add an event on a date that clashes with a predefined event, the alert dialog will appear.
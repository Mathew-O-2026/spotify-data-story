# Spotify Data Story

A web-based visualization of personal Spotify listening history, showing how music tastes have evolved over the years.

## Description

This project takes Spotify streaming data and creates interactive charts to explore my listening habits. It displays the top 10 artists overall, and breaks down the top 10 artists and songs for each year from 2022 to 2025. Clicking on song bars opens the track on Spotify (or searches if unavailable).

The story it tells: My music preferences started with mainstream pop and hip-hop in 2022, but by 2025, I leaned towards indie and electronic genres, reflecting personal growth through new experiences.

## Features

- **Overall Top 10 Artists**: Bar chart of most listened-to artists across all data.
- **Yearly Breakdowns**: Separate charts for top 10 artists and songs per year (2022-2025).
- **Interactive Songs**: Click song bars to open Spotify links in a new tab.
- **Responsive Design**: Charts adapt to different screen sizes.
- **Data Aggregation**: Automatically processes milliseconds played into minutes.

## Technologies Used

- **HTML/CSS**: Structure and styling.
- **JavaScript**: Data processing and interactivity.
- **Chart.js**: For creating bar charts.
- **Spotify Data**: Exported listening history in JSON format.

## Data Source

The data comes from Spotify's "Extended Streaming History" export (available in Privacy Settings). It includes fields like timestamps, track names, artists, and play times. Files used:
- `Streaming_History_Audio_2022-2024_0.json`
- `Streaming_History_Audio_2025_4.json`

## License

This project is for personal use. Spotify data is private—do not share without permission.

## Author

Mathew-O-2026

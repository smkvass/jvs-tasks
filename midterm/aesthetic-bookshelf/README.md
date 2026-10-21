# Aesthetic Bookshelf

A React single-page app for browsing recent books about fashion, photography,
art, design and magazines, and for keeping a personal shelf.

**Live demo:** https://jvs-tasks-8p1y.vercel.app

## Features
- Catalog of books from the Open Library API (published 2010 and later)
- Search, category filter, sorting (relevance, newest, oldest, top rated)
- Server-side pagination
- Book detail view with description loaded from the API
- "My shelf": controlled form to add your own books (title, author, year, cover URL), saved in localStorage
- Loading, error, empty and success states
- Responsive layout

## Tech
- React (Vite), JavaScript
- Open Library API (https://openlibrary.org/developers/api)
- `useState`, `useEffect` with `AbortController` cleanup to avoid race conditions

## Components
`Catalog`, `SearchBar`, `BookCard`, `BookDetail`, `Pagination`, `AddBookForm`

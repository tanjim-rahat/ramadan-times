# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-22

### Added
- **Remember Location Feature**: The app now saves and automatically restores the user's previously selected Division and District using localStorage
  - Division selections are stored with the key `selectedDivisionId`
  - District selections are stored with the key `selectedDistrictName`
  - Saved selections are restored automatically when users return to the app
- **Labels for Selectors**: Added shadcn Label components on top of both Division and District selectors for improved clarity and accessibility

### Fixed
- Fixed controlled/uncontrolled Select component warnings by providing consistent default values

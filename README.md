# vue-photo-video-camera

A Vue 3 web application for capturing photos and recording videos from the device camera (webcam or smartphone camera). Captured media can be previewed and uploaded to a server via a REST API.

## Description

The app provides a simple device manager interface with a transition to a full-screen camera mode. Media handling is implemented using the browser [`MediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) and [`MediaRecorder`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) APIs.

### Key Features

- **Photo mode** — capture a frame from the video stream via `<canvas>` (JPEG, 600×450 px)
- **Video mode** — record in WebM format with optional audio
- **Camera switching** — front (`user`) / rear (`environment`), when the device provides multiple video inputs
- **Preview** — display captured photos or recorded videos before upload
- **Save to server** — upload files via `POST /file` (multipart/form-data)
- **Delete** — discard the result without uploading

### Screens

| Route     | Title           | Description                                      |
|-----------|-----------------|--------------------------------------------------|
| `/`       | Device Manager  | Home page with a button to launch the camera     |
| `/camera` | Video Camera    | Full-screen capture and control interface        |

## Tech Stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Vue Router 4](https://router.vuejs.org/) — routing and dynamic layouts
- [Element Plus](https://element-plus.org/) — UI components
- [Axios](https://axios-http.com/) — HTTP client for the API
- [Sass](https://sass-lang.com/) — styles

## Project Structure

```
src/
├── api/                    # HTTP client and API methods
├── assets/style/           # Global SCSS styles
├── components/
│   └── VideoCamera/        # Main camera component
├── constants/              # Constants (layouts, env)
├── helpers/                # Utility functions
├── layouts/                # DefaultLayout, WithoutHeaderLayout
├── router/                 # Routes and layout middleware
└── views/                  # HomeScreen, CameraScreen
```

## Requirements

- Node.js 20+
- A modern browser with `getUserMedia` and `MediaRecorder` support
- **HTTPS** or **localhost** is required for camera access (browser security restriction)
- A backend API to receive uploaded files (see the API section)

## Installation and Setup

```sh
npm install
```

Copy the environment file and set the API URL:

```sh
cp .env.example .env
```

In `.env`, configure:

```
VITE_API_URL=http://localhost:5005/test-api
```

### Development

```sh
npm run dev
```

The app will be available at the URL printed by Vite (usually `http://localhost:5173`).

### Production Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Type Checking

```sh
npm run type-check
```

### Linting and Formatting

```sh
npm run lint
npm run format
```

## API

The client uploads captured files to the backend endpoint:

```
POST {VITE_API_URL}/file
Content-Type: multipart/form-data

file: <Blob>   # photo (JPEG) or video (WebM)
```

On error, the server may return JSON with an `error.error_message` field — the message is shown to the user via Element Plus.

## Usage

1. Open the home page and click the **Launch Camera** card.
2. Allow the browser access to the camera (and microphone, if audio recording is enabled).
3. Select **photo** or **video** mode using the mode switch button.
4. Press **Capture** or **Record** (press again to stop video recording).
5. In the preview window, click **Save** to upload to the server or **Delete** to discard.
6. Click **Close** to return to the home page and release the camera.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if installed).

TypeScript type checking for `.vue` files uses `vue-tsc` instead of the standard `tsc`.

## Configuration

Build settings are in [vite.config.ts](./vite.config.ts). See the [Vite Configuration Reference](https://vitejs.dev/config/).

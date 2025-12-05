# ThinkFlow AI

![ThinkFlow Logo](ThinkFlow.png)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Mermaid](https://img.shields.io/badge/Mermaid-ff3670?style=for-the-badge&logo=mermaid&logoColor=white)](https://mermaid.js.org/) 
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)

## About

ThinkFlow AI is a web application designed to enable users to create, visualize, and analyze flow diagrams. Powered by the advanced capabilities of **Mermaid.js** and **Google Gemini AI**, ThinkFlow AI transforms natural language descriptions into diagrams instantly.

Whether you are documenting complex system architectures or brainstorming workflows, ThinkFlow provides a free environment equipped with tools like real-time visualization, customizable themes, and comprehensive export options to enhance your productivity.

## Features

- **Diagram Generation**: Generate complex diagrams using Mermaid.js from text descriptions.
- **AI Analysis**: Analyze and explain diagrams using Google Gemini API.
- **Export Options**: Download diagrams as SVG, PNG, or JPG.
- **Fullscreen Mode**: Edit and view diagrams in distraction-free fullscreen mode.
- **Slideshow Mode**: Present diagrams effectively with slide navigation.
- **Real-time Updates**: Instant visual feedback on diagram changes.
- **Undo/Redo**: Easily correct mistakes with full history support.
- **Local Storage Management**: Save progress and clear local storage as needed.

## Supported Diagrams

ThinkFlow AI supports a wide range of diagram types to suit various needs:

- **Flowchart**
- **Sequence Diagram**
- **Class Diagram**
- **State Diagram**
- **Entity Relationship Diagram**
- **User Journey**
- **Gantt**
- **Pie Chart**
- **Quadrant Chart**
- **Requirement Diagram**
- **GitGraph (Git) Diagram**
- **C4 Diagram** (Experimental)
- **Mindmaps**
- **Timeline**
- **ZenUML**
- **Sankey** (New)
- **XY Chart** (New)
- **Block Diagram** (New)
- **Packet** (New)
- **Kanban** (New)
- **Architecture** (New)
- **Radar** (New)
- **Treemap** (New)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adityaj08/thinkflow-ai.git
   cd thinkflow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY1=your_api_key_1
   VITE_GEMINI_API_KEY2=your_api_key_2
   VITE_AUTH0_DOMAIN=your_auth0_domain
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173`

## Usage

1. Enter your diagram description in the input field.
2. Click "Generate Diagram" or press Enter.

### Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Toggle slideshow mode |
| `F` | Toggle fullscreen |
| `←` / `J` | Previous slide |
| `→` / `L` | Next slide |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset zoom |
| `D` | Toggle dark mode |
| `S` | Save diagram |
| `T` | Toggle orientation |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Mermaid.js** for the amazing diagramming library.
- **Google Gemini** for the AI capabilities.
- All contributors and users of the project.

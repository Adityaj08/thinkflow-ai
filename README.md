# ThinkFlow AI

ThinkFlow AI is a modern web application that helps users create, visualize, and analyze flow diagrams using Mermaid.js. The application provides a user-friendly interface for generating diagrams from natural language descriptions and offers various features like dark mode, export options, and diagram analysis.

<div align="center">
  <img src="ThinkFlow.png" alt="ThinkFlow Logo" width="300" style="border-radius: 12px;"/>
  
  <p>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://mermaid.js.org/">
      <img src="https://img.shields.io/badge/Mermaid-ff3670?style=for-the-badge&logo=mermaid&logoColor=white" alt="Mermaid" />
    </a>
    <a href="https://ai.google.dev/">
      <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
    </a>
  </p>
</div>

## Features

- **Intuitive User Interface**: Clean and responsive design for seamless diagram creation.
- **Dark/Light Mode Support**: Toggle between themes for visual comfort.
- **Diagram Generation**: Generate complex diagrams using Mermaid.js from text descriptions.
- **AI Analysis**: Analyze and explain diagrams using Google Gemini API.
- **Export Options**: Download diagrams as SVG, PNG, or JPG.
- **Keyboard Shortcuts**: Efficient navigation with shortcuts for zoom, undo/redo, and mode toggling.
- **Fullscreen Mode**: Edit and view diagrams in distraction-free fullscreen mode.
- **Slideshow Mode**: Present diagrams effectively with slide navigation.
- **Real-time Updates**: Instant visual feedback on diagram changes.
- **Undo/Redo**: Easily correct mistakes with full history support.
- **Local Storage Management**: Save progress and clear local storage as needed.

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
   GEMINI_API_KEY1=your_api_key_1
   GEMINI_API_KEY2=your_api_key_2
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
3. Use the controls to:
   - Toggle dark/light mode
   - Change diagram orientation
   - Adjust zoom level
   - Export the diagram
   - Analyze the diagram
   - Enter fullscreen mode
   - Start slideshow mode
   - Undo/Redo changes

## Keyboard Shortcuts

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

## Built With

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next Generation Frontend Tooling.
- **Mermaid.js**: Diagramming and charting tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **Google Gemini API**: AI model for diagram generation.

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

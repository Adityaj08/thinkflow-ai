# ThinkFlow AI


ThinkFlow AI is a modern web application that helps users create, visualize, and analyze flow diagrams using Mermaid.js. The application provides a user-friendly interface for generating diagrams from natural language descriptions and offers various features like dark mode, export options, and diagram analysis.

<div align="center" >
  <img src="ThinkFlow.png" alt="ThinkFlow Logo" width="300" style="border-radius: 12px;"/>
</div>

## Features

- 🎨 Beautiful and intuitive user interface
- 🌓 Dark/Light mode support
- 📊 Mermaid.js diagram generation and visualization
- 🔍 Diagram analysis and explanation
- 📥 Multiple export options (SVG, PNG, JPG)
- ⌨️ Keyboard shortcuts for quick navigation
- 🎯 Fullscreen mode for better focus
- 🎞️ Slideshow mode for presentations
- 🔄 Real-time diagram updates
- 🎨 Customizable themes

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

1. Enter your diagram description in the input field
2. Click "Generate Diagram" or press Enter
3. Use the controls to:
   - Toggle dark/light mode
   - Change diagram orientation
   - Adjust zoom level
   - Export the diagram
   - Analyze the diagram
   - Enter fullscreen mode
   - Start slideshow mode

## Keyboard Shortcuts

- `Space`: Toggle slideshow mode
- `F`: Toggle fullscreen
- `←` or `J`: Previous slide
- `→` or `L`: Next slide
- `+` or `=`: Zoom in
- `-`: Zoom out
- `0`: Reset zoom
- `D`: Toggle dark mode
- `S`: Save diagram
- `T`: Toggle orientation

## Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Mermaid.js](https://mermaid.js.org/) - Diagramming and charting tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Google Gemini API](https://ai.google.dev/) - AI model for diagram generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) for the amazing diagramming library
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- All contributors and users of the project

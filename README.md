# KSEA NFT Gallery

A modern NFT gallery application featuring deterministic NFT generation with unique color schemes.

## Project Overview

This project combines a React-based frontend with NFT technology to create a visually appealing gallery of NFTs. The application features:

- Geometric NFT designs with deterministic color generation
- Mock blockchain integration for development and demonstration
- Interactive minting functionality
- Responsive gallery layout
- Klimt-inspired artwork

## Features

- **Deterministic NFT Generation**: Colors are mathematically derived from inputs like wallet address and timestamp
- **Mock Blockchain Mode**: Fully functional without requiring an actual blockchain connection
- **Interactive Gallery**: View and mint NFTs with a clean, modern interface
- **Responsive Design**: Works on various screen sizes

## Project Structure

```
KSEA/
├── my-nft-project/
│   ├── nft-frontend/           # React frontend application
│   │   ├── public/             # Static assets and HTML
│   │   └── src/                # React source code
│   │       ├── components/     # React components
│   │       └── utils/          # Utility functions
│   └── contracts/              # Smart contract code (for future implementation)
└── index.js                    # Original p5.js sketch that inspired the project
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ch3fC0d3/Ksea.git
   cd Ksea
   ```

2. Install dependencies:
   ```
   cd my-nft-project/nft-frontend
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- **View NFTs**: Browse the gallery to see existing NFTs
- **Mint NFTs**: Use the form at the bottom of the page to mint new NFTs with unique color schemes
- **Reset Gallery**: Click the "Reset Gallery" button to start fresh

## Development Mode

The application runs in mock mode by default, which simulates blockchain interactions without requiring an actual connection. This allows for easy development and demonstration.

## Future Enhancements

- Full Hardhat blockchain integration
- Actual NFT minting on Ethereum or other networks
- Enhanced visual designs and animations
- User accounts and collections

## License

MIT

## Acknowledgments

- Inspired by Gustav Klimt's artistic style
- Built with React and modern web technologies

# Block Cipher Modes Simulator

This application provides animated simulations of various block cipher modes of operation. It serves as an educational tool to help understand the logic and comparison of symmetric key block cipher modes.

## Live Demo

You can access the live demo of this application at:
[https://jhonylemon.github.io/block-cipher-modes-animations/](https://jhonylemon.github.io/block-cipher-modes-animations/)

## Instructions

![Instructions](https://github.com/JhonyLemon/block-cipher-modes-animations/blob/9f6172dd929f38980c9b56e29be996324edbbfef/AES-Instruction%20-%20ENG.drawio.png)

## Supported Modes

The simulator currently supports the following block cipher modes:

- Electronic Codebook (ECB)
- Cipher Block Chaining (CBC)
- Cipher Feedback (CFB)
- Output Feedback (OFB)
- Propagating Cipher Block Chaining (PCBC)
- Counter (CTR)
- Galois/Counter Mode (GCM)

## Features

- Interactive animations for each supported block cipher mode
- Educational descriptions of each mode
- Customizable input parameters (data, key, IV, block size, padding)

## Purpose

The main objectives of this project are:

1. To conduct a literature review to explain the logic and compare various symmetric key block cipher modes (CBC, GCM, XTR, etc.).
2. To develop an educational application that simulates the operation of these symmetric key cipher modes.

## Usage

To use the simulator:

1. Visit the live demo URL
2. Select a block cipher mode from the available options
3. Input the required parameters (data, key, IV, block size, padding)
4. Observe the animated simulation of the selected mode

## Technologies Used

This project is built using:

- JavaScript
- React
- Crypto-JS
- p5.js

## Development

To set up the development environment:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm start`

## Contributing

Contributions to improve the simulator or add new block cipher modes are welcome. Please feel free to submit pull requests for any bugs or feature requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

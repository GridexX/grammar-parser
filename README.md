<div align="center">
  <img src="./assets/logo.png" width="300">
  <h1>
    <span style="color:#4A6EE0">Grammar</span>Parser <b style="color:orange">Checker</b>
  </h1>
  <h4>Check if an input file adheres to a set of grammar rules.</h4>
  <p align="center">
    <a href="https://github.com/GridexX/grammar-parser/actions"><img src="https://img.shields.io/github/actions/workflow/status/GridexX/grammar-parser/ci.yml?label=tests&logo=jest&style=flat" alt="ci"></a>
    <a href="https://github.com/GridexX/grammar-parser"><img src="https://img.shields.io/github/stars/GridexX/grammar-parser.svg?style=flat" alt="stars"></a>
    <a href="https://github.com/GridexX/grammar-parser"><img src="https://img.shields.io/github/license/GridexX/grammar-parser.svg?style=flat" alt="license"></a>
  </p>
</div>

## How to Launch

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version > 18)
- npm or yarn installed (version > 9)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/GridexX/grammar-parser.git
    ```

2. Navigate to the project directory:

    ```bash
    cd grammar-parser
    ```

3. Install dependencies:

    ```bash
    npm install   # or use yarn: yarn install
    ```

### Usage

To check if an input file adheres to a set of grammar rules, run:

```bash
npm run start -- -i path/to/your/input-file.txt -r path/to/your/rules-file.json
```

The script will output the result of the grammar check.
You can use the examples from the `examples` directory.

### License

This project is licensed under the MIT License - see the LICENSE file for details.


### Author

Made by [GridexX](https://github.com/GridexX) during January 2024 🌟
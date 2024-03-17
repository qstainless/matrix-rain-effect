# Matrix Rain Effect

This script is my attempt to create a visual effect inspired by the "digital rain" seen in the Matrix film series.

## Features:
- Displays a continuous stream of falling characters on a canvas element.
- Allows for customization of character sets and falling speed.
- Dynamically adjusts to the size of the browser window and responds to resizing events.
- Shows varying degrees of brightness, providing a simplistic 3D effect.

## Dependencies:
- A modern web browser with support for HTML5 canvas and JavaScript ES6 features.

## Global Functions:
- `getRandomCharacter()`: Selects a random character from a predefined set, including Katakana, Chinese, Vietnamese, and Korean characters.
- `draw()`: The main loop function that updates the canvas with the falling characters. It checks each drop's position and decides whether to display a random character or a part of the "WITS" pattern based on the drop's current column.

## Setup:
- The script requires an HTML document with a canvas element of id 'matrix-rain'.
- CSS should be configured to ensure the canvas covers the entire viewport for full effect.

## Usage:
- Include this script in an HTML file with a properly configured canvas element.
- Customize the character set or adjust the falling speed as desired by modifying the script's variables.

### Example HTML element:
```html
<canvas id="matrix-rain"></canvas>
```

<a href="https://codepen.io/gce517/pen/poBNpba" rel="nofollow">Live demo</a>

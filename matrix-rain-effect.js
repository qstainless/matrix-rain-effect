/**
 * Matrix Rain Effect
 *
 * This script creates a visual effect inspired by the "digital rain" seen in the Matrix film series.
 *
 * Features:
 * - displays a continuous stream of falling characters on a canvas element.
 * - allows for customization of character sets and falling speed.
 * - dynamically adjusts to the size of the browser window and responds to resizing events.
 * - shows varying degrees of brightness, providing a simplistic 3D effect.
 *
 * Dependencies:
 * - A modern web browser with support for HTML5 canvas and JavaScript ES6 features.
 *
 * Global Functions:
 * - getRandomCharacter(): Selects a random character from a predefined set, including Katakana,
 *   Chinese, Vietnamese, and Korean characters.
 * - draw(): The main loop function that updates the canvas with the falling characters. It checks
 *   each drop's position and decides whether to display a random character or a part of the "WITS"
 *   pattern based on the drop's current column.
 *
 * Setup:
 * - The script requires an HTML document with a canvas element of id 'matrix-rain'.
 * - CSS should be configured to ensure the canvas covers the entire viewport for full effect.
 *
 * Usage:
 * - Include this script in an HTML file with a properly configured canvas element.
 * - Customize the character set or adjust the falling speed as desired by modifying the script's
 *   variables.
 *
 * Example HTML element:
 * <canvas id="matrix-rain"></canvas>
 *
 * Author: Guillermo Castaneda Echegaray
 * Version: 1.0
 */
class MatrixRain {

    // Constructor: initializes the Matrix rain effect
    constructor(canvasId) {
        // Get the canvas element by ID and its drawing context
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set the font size for the rain characters
        this.fontSize = 12;

        // Initialize an array to keep track of each drop's position and properties
        this.drops = [];

        // Variables for controlling the animation speed
        this.lastFrameTime = Date.now();
        this.frameInterval = 1000 / 15; // Target frame rate to control speed

        // Initial setup: Set canvas size and initialize drops
        this.initializeCanvas();
        this.initializeDrops();

        // Handle window resizing to adjust the canvas and drops
        window.addEventListener('resize', () => this.onResize());

        // Let's go!
        this.startRain();
    }

    initializeCanvas() {
        // Sets the canvas size to fill the entire viewport
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Calculate the number of columns based on the font size
        this.columns = this.canvas.width / this.fontSize;
    }

    // Initializes or resets drops for each column with random speed and brightness
    initializeDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = {
                y: 1,
                speed: 0.5 + Math.random(), // Random speed between 0.5 and 1.5
                brightness: 0.3 + Math.random() * 0.7 // Random brightness between 0.3 and 1.0
            };
        }
    }

    // Handles browser window resize events
    onResize() {
        // Re-initialize canvas and drops to adjust to new size
        this.initializeCanvas();
        this.initializeDrops();
    }

    // Generates and returns a random character from a predefined set of Unicode ranges
    getRandomCharacter() {
        // Define character ranges from various scripts
        const ranges = [
            [0x30A0, 0x30FF], // Katakana
            [0x4E00, 0x4F80], // Subset of Chinese
            [0x00C0, 0x00FF], // Latin-1 Supplement for Vietnamese
            [0x1E00, 0x1EFF], // Latin Extended Additional for Vietnamese
            [0xAC00, 0xADFF]  // Subset of Korean (Hangul)
        ];

        // Select a random range and character within that range
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const codePoint = Math.floor(Math.random() * (range[1] - range[0])) + range[0];

        // Return the character for the selected code point
        return String.fromCharCode(codePoint);
    }

    // The main drawing function for the rain effect
    draw() {
        const now = Date.now();
        const elapsed = now - this.lastFrameTime;

        // Only update the canvas if enough time has passed based on the target frame rate
        if (elapsed > this.frameInterval) {
            // Set the canvas background and text properties
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = this.fontSize + 'px monospace';

            // Draw each drop
            for (let i = 0; i < this.drops.length; i++) {
                const drop = this.drops[i];
                this.ctx.fillStyle = `rgba(0, 255, 0, ${drop.brightness})`; // Varying brightness for each drop
                const text = this.getRandomCharacter();
                this.ctx.fillText(text, i * this.fontSize, drop.y * this.fontSize);

                // Reset the drop when it reaches the bottom of the canvas
                if (drop.y * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    drop.y = 0;
                    drop.brightness = 0.3 + Math.random() * 0.6; // Also reset brightness
                }

                // Increment the drop's position based on its speed
                drop.y += drop.speed;

                // Adjust last frame time for the next iteration
                this.lastFrameTime = now - (elapsed % this.frameInterval);
            }
        }
        // Request the next frame to continue the animation
        requestAnimationFrame(() => this.draw());
    }

    // Starts the rain effect by requesting the first animation frame
    startRain() {
        requestAnimationFrame(() => this.draw());
    }
}

// Create a new MatrixRain instance to start the effect on the canvas with the specified element ID
const matrixRain = new MatrixRain('matrix-rain');

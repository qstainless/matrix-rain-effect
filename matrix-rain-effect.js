'use strict';

/**
 * Matrix Rain Effect
 *
 * This script creates a visual effect inspired by the "digital rain" seen in the Matrix film series.
 *
 * Features:
 * - displays a continuous stream of falling characters on a canvas element.
 * - allows for customization of character sets and falling speed.
 * - dynamically adjusts to the size of the browser window and responds to resizing events.
 * - varies character scale, brightness, and speed to create a lightweight 3D effect.
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
 * Version: 2.3
 * License: MIT License (feel free to use and modify this script as per the MIT License conditions)
 * @link https://github.com/qstainless/matrix-rain-effect
 */
class MatrixRain {

    // Constructor: initializes the Matrix rain effect
    constructor(canvasId) {
        // Get the canvas element by ID and its drawing context
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.trailCanvas = document.createElement('canvas');
        this.trailCtx = this.trailCanvas.getContext('2d');

        // Set the font size for the rain characters
        this.fontSize = 12;

        // Perspective range: distant streams are smaller and slower than foreground streams.
        this.minDepth = 0.35;
        this.maxDepth = 1;
        this.minCharacterSize = 6;
        this.maxCharacterSize = 14;
        this.layersPerColumn = 3;
        this.leadingCharacterColor = '220, 255, 220';
        this.leadingCharacterChance = 0.25;
        this.trailLength = 3;

        // Initialize an array to keep track of each drop's position and properties
        this.drops = [];

        // Variables for controlling the animation speed
        this.lastFrameTime = Date.now();
        this.frameInterval = 1000 / 15; // Target frame rate to control speed

        // Set a time interval for the trail color to change
        this.colorChangeInterval = 1000 * 60; // 1 minute
        this.lastColorChangeTime = Date.now();
        this.colors = [
            '0, 255, 0', // Green
            '255, 0, 0', // Red
            '255, 191, 0', // Amber
            '255, 255, 255' // White
        ];
        this.currentColorIndex = 0; // Yeah, start with green, why not?

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
        this.trailCanvas.width = this.canvas.width;
        this.trailCanvas.height = this.canvas.height;

        // Calculate the number of columns based on the font size
        this.columns = this.canvas.width / this.fontSize;
    }

    // Initializes or resets drops for each column with random depth, speed, and brightness
    initializeDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            for (let layer = 0; layer < this.layersPerColumn; layer++) {
                const layerPosition = this.layersPerColumn === 1
                    ? 0.5
                    : layer / (this.layersPerColumn - 1);
                const depth = this.minDepth + layerPosition * (this.maxDepth - this.minDepth);

                this.drops.push({
                    // Start each layer at a different point so the streams overlap over time.
                    y: Math.random() * (this.canvas.height / this.fontSize + 4) - 4,
                    x: x * this.fontSize + (Math.random() - 0.5) * this.fontSize * 0.9,
                    depth,
                    scale: (this.minCharacterSize +
                        ((depth - this.minDepth) / (this.maxDepth - this.minDepth)) *
                        (this.maxCharacterSize - this.minCharacterSize)) / this.fontSize,
                    speed: 0.35 + depth * 0.9,             // Far streams move more slowly
                    brightness: Math.min(1, 0.2 + Math.random() * 0.45 + depth * 0.35),
                    hasLeadingCharacter: Math.random() < this.leadingCharacterChance,
                    color: this.colors[this.currentColorIndex] // Set initial color
                });
            }
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
            [0x21, 0x30],   // ASCII punctuation and symbols: ! through /
            [0x30, 0x3A],   // ASCII digits: 0 through 9
            [0x3A, 0x41],   // ASCII punctuation and symbols: : through @
            [0x5B, 0x61],   // ASCII punctuation and symbols: [ through `
            [0x7B, 0x7F],   // ASCII punctuation and symbols: { through ~
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
            // Fade only the colored trail layer; leaders never become part of it.
            this.trailCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            this.trailCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.trailCtx.font = this.fontSize + 'px monospace';

            // Paint distant drops first so foreground drops can cover them.
            const dropsByDepth = [...this.drops].sort((a, b) => a.depth - b.depth);
            for (const drop of dropsByDepth) {
                const x = drop.x;
                const y = drop.y * this.fontSize;

                // Draw trails on their own persistent layer.
                for (let trailIndex = this.trailLength; trailIndex > 0; trailIndex--) {
                    const trailAlpha = drop.brightness * 0.70 *
                        (1 - trailIndex / (this.trailLength + 1));
                    this.trailCtx.fillStyle = `rgba(${this.colors[this.currentColorIndex]}, ${trailAlpha})`;
                    this.trailCtx.save();
                    this.trailCtx.translate(x, y - trailIndex * this.fontSize * 1.1);
                    this.trailCtx.scale(drop.scale, drop.scale);
                    this.trailCtx.fillText(this.getRandomCharacter(), 0, 0);
                    this.trailCtx.restore();
                }
            }

            // Composite the trail, then draw leaders on a clean foreground layer.
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.trailCanvas, 0, 0);
            this.ctx.font = this.fontSize + 'px monospace';

            for (const drop of dropsByDepth) {
                const x = drop.x;
                const y = drop.y * this.fontSize;

                // Leaders are drawn only on the foreground layer.
                const headColor = drop.hasLeadingCharacter
                    ? this.leadingCharacterColor
                    : this.colors[this.currentColorIndex];
                this.ctx.fillStyle = `rgba(${headColor}, ${Math.min(1, drop.brightness + 0.35)})`;
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.scale(drop.scale, drop.scale);
                this.ctx.fillText(this.getRandomCharacter(), 0, 0);
                this.ctx.restore();

                // Reset the drop when it reaches the bottom of the canvas
                if (drop.y * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    drop.y = 0;
                    drop.brightness = Math.min(1, 0.2 + Math.random() * 0.45 + drop.depth * 0.35);
                    drop.hasLeadingCharacter = Math.random() < this.leadingCharacterChance;
                    drop.color = this.colors[this.currentColorIndex]; // Reset color when the drop resets
                }

                // Increment the drop's position based on its speed
                drop.y += drop.speed;
            }

            // Update the current color index once per frame
            if (now - this.lastColorChangeTime > this.colorChangeInterval) {
                this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
                this.lastColorChangeTime = now;
            }

            // Adjust last frame time once after the complete frame has been rendered
            this.lastFrameTime = now - (elapsed % this.frameInterval);
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

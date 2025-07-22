<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixel Art Maker</title>
    <style>/* Pixel Art Maker Styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f5f5;
    margin: 0;
    padding: 20px;
    color: #333;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 5px;
}

.size-controls, .color-controls, .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

label {
    font-weight: bold;
}

input[type="number"] {
    width: 60px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

input[type="color"] {
    width: 40px;
    height: 40px;
    border: none;
    cursor: pointer;
}

button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #45a049;
}

.tools button {
    font-size: 1.2rem;
    padding: 8px 12px;
    background: #f1f1f1;
    color: #333;
}

.tools button.active {
    background: #4CAF50;
    color: white;
}

.grid-container {
    overflow: auto;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    background: white;
}

#pixel-canvas {
    display: block;
    background: white;
    cursor: crosshair;
}

.export-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
}

@media (max-width: 768px) {
    .controls {
        flex-direction: column;
    }
}</style>
</head>
<body>
    <div class="container">
        <h1>Pixel Art Maker</h1>
        
        <div class="controls">
            <div class="size-controls">
                <label for="grid-width">Width:</label>
                <input type="number" id="grid-width" min="1" max="50" value="16">
                
                <label for="grid-height">Height:</label>
                <input type="number" id="grid-height" min="1" max="50" value="16">
                
                <button id="create-grid">Create Grid</button>
            </div>
            
            <div class="color-controls">
                <label for="color-picker">Color:</label>
                <input type="color" id="color-picker" value="#000000">
                
                <button id="fill-all">Fill All</button>
                <button id="clear-grid">Clear Grid</button>
            </div>
            
            <div class="tools">
                <button id="paint-tool" class="active" title="Paint">🖌️</button>
                <button id="erase-tool" title="Erase">🧽</button>
                <button id="eyedropper-tool" title="Eyedropper">🔍</button>
            </div>
        </div>
        
        <div class="grid-container">
            <canvas id="pixel-canvas"></canvas>
        </div>
        
        <div class="export-controls">
            <button id="save-png">Save as PNG</button>
            <button id="save-svg">Save as SVG</button>
        </div>
    </div>

    <script >class PixelArt {
    constructor() {
        this.canvas = document.getElementById('pixel-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.colorPicker = document.getElementById('color-picker');
        this.gridWidthInput = document.getElementById('grid-width');
        this.gridHeightInput = document.getElementById('grid-height');
        this.createGridBtn = document.getElementById('create-grid');
        this.fillAllBtn = document.getElementById('fill-all');
        this.clearGridBtn = document.getElementById('clear-grid');
        this.savePngBtn = document.getElementById('save-png');
        this.saveSvgBtn = document.getElementById('save-svg');
        this.toolButtons = document.querySelectorAll('.tools button');
        
        this.currentColor = this.colorPicker.value;
        this.currentTool = 'paint';
        this.cellSize = 20;
        this.gridData = [];
        
        this.initEventListeners();
        this.createGrid(16, 16);
    }
    
    initEventListeners() {
        this.colorPicker.addEventListener('input', () => {
            this.currentColor = this.colorPicker.value;
        });
        
        this.createGridBtn.addEventListener('click', () => {
            const width = parseInt(this.gridWidthInput.value);
            const height = parseInt(this.gridHeightInput.value);
            this.createGrid(width, height);
        });
        
        this.fillAllBtn.addEventListener('click', () => this.fillAll());
        this.clearGridBtn.addEventListener('click', () => this.clearGrid());
        this.savePngBtn.addEventListener('click', () => this.saveAsPng());
        this.saveSvgBtn.addEventListener('click', () => this.saveAsSvg());
        
        this.toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentTool = button.id.replace('-tool', '');
                this.toolButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    }
    
    createGrid(width, height) {
        // Limit grid size
        width = Math.min(50, Math.max(1, width));
        height = Math.min(50, Math.max(1, height));
        
        this.gridWidthInput.value = width;
        this.gridHeightInput.value = height;
        
        this.canvas.width = width * this.cellSize;
        this.canvas.height = height * this.cellSize;
        
        // Initialize grid data
        this.gridData = Array(height).fill().map(() => 
            Array(width).fill('#FFFFFF')
        );
        
        this.drawGrid();
    }
    
    drawGrid() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let y = 0; y < this.gridData.length; y++) {
            for (let x = 0; x < this.gridData[y].length; x++) {
                this.ctx.fillStyle = this.gridData[y][x];
                this.ctx.fillRect(
                    x * this.cellSize, 
                    y * this.cellSize, 
                    this.cellSize, 
                    this.cellSize
                );
                
                // Grid lines
                this.ctx.strokeStyle = '#ddd';
                this.ctx.strokeRect(
                    x * this.cellSize, 
                    y * this.cellSize, 
                    this.cellSize, 
                    this.cellSize
                );
            }
        }
    }
    
    handleMouseDown(e) {
        this.isDrawing = true;
        this.handlePixelClick(e);
    }
    
    handleMouseMove(e) {
        if (this.isDrawing) {
            this.handlePixelClick(e);
        }
    }
    
    handlePixelClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        
        if (x >= 0 && x < this.gridData[0].length && y >= 0 && y < this.gridData.length) {
            switch (this.currentTool) {
                case 'paint':
                    this.gridData[y][x] = this.currentColor;
                    break;
                case 'erase':
                    this.gridData[y][x] = '#FFFFFF';
                    break;
                case 'eyedropper':
                    this.currentColor = this.gridData[y][x];
                    this.colorPicker.value = this.currentColor;
                    break;
            }
            
            this.drawGrid();
        }
    }
    
    fillAll() {
        for (let y = 0; y < this.gridData.length; y++) {
            for (let x = 0; x < this.gridData[y].length; x++) {
                this.gridData[y][x] = this.currentColor;
            }
        }
        this.drawGrid();
    }
    
    clearGrid() {
        for (let y = 0; y < this.gridData.length; y++) {
            for (let x = 0; x < this.gridData[y].length; x++) {
                this.gridData[y][x] = '#FFFFFF';
            }
        }
        this.drawGrid();
    }
    
    saveAsPng() {
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
    
    saveAsSvg() {
        const width = this.gridData[0].length;
        const height = this.gridData.length;
        
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * this.cellSize}" height="${height * this.cellSize}" viewBox="0 0 ${width * this.cellSize} ${height * this.cellSize}">\n`;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.gridData[y][x] !== '#FFFFFF') {
                    svgContent += `  <rect x="${x * this.cellSize}" y="${y * this.cellSize}" width="${this.cellSize}" height="${this.cellSize}" fill="${this.gridData[y][x]}" />\n`;
                }
            }
        }
        
        svgContent += '</svg>';
        
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = 'pixel-art.svg';
        link.href = URL.createObjectURL(blob);
        link.click();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PixelArt();
});</script>
</body>
</html>
# Toolbox Tool Styling Guidelines

To ensure a consistent and premium experience across all tools in the toolbox, please use the shared CSS and recommended DOM structures.

## Shared CSS
Every tool should link to the shared stylesheet:

```html
<link rel="stylesheet" href="shared.css">
```

This file provides:
- **Design Tokens**: Standard colors, spacing, and typography (DM Sans).
- **Utility Classes**: Pre-styled buttons, inputs, and layout components.
- **Resets**: Standardized resets for cross-browser consistency.

---

## Recommended DOM Structures

### 1. Simple Card Layout (Default)
Best for single-purpose tools (like the Pixel Art Upscaler).

```html
<div class="tool-container">
  <h1>Tool Title</h1>
  
  <div class="tool-card">
    <!-- Tool controls here -->
    <div id="dropzone" class="tool-section">...</div>
    
    <div class="toolbar">
      <label class="label-caps">Options</label>
      <select>...</select>
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
  
  <div id="results-list">
    <!-- Dynamic content here using .tool-card or .row -->
  </div>
</div>
```

### 2. Full-App Grid Layout
Best for complex tools with sidebars (like the SVG Renderer).

```html
<body class="tool-grid-body">
  <div class="tool-grid">
    <aside class="tool-sidebar">
      <div class="tool-section">
        <div class="tool-section-title">Editor</div>
        <textarea class="tool-input-full"></textarea>
      </div>
      ...
    </aside>
    
    <main class="tool-main">
      <div class="toolbar">...</div>
      <div class="tool-preview-area">...</div>
    </main>
  </div>
</body>
```

---

## Shared CSS Classes Reference

| Category | Classes |
| :--- | :--- |
| **Buttons** | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success` |
| **Containers**| `.tool-container`, `.tool-card`, `.tool-section` |
| **Components**| `.badge`, `.badge-accent`, `.toggle`, `.upload-zone` |
| **Output**    | `.tool-list-row`, `.tool-list-row-thumb` |
| **Layout** | `.tool-grid`, `.tool-sidebar`, `.tool-main`, `.row-flex` |
| **Typography**| `.tool-section-title`, `.label-caps`, `.muted` |
| **Forms** | `.tool-input`, `.tool-select`, `.form-row` |

---

## Component Snippets

### List Row (Dynamic Results)
```html
<div class="tool-list-row">
  <img class="tool-list-row-thumb" src="...">
  <div class="name-group">
    <span class="name">Filename.png</span>
    <span class="dims">128x128</span>
  </div>
  <button class="btn btn-success">Save</button>
</div>
```

### Toggle Switch
```html
<div class="form-row">
  <label>Feature Toggle</label>
  <label class="toggle">
    <input type="checkbox" checked>
    <div class="toggle-track"></div>
  </label>
</div>
```

### Upload Zone
```html
<div class="upload-zone" onclick="...">
  <p><strong>Drop files here</strong> or click to browse</p>
</div>
```

### Color Palette (Swatches)
```html
<div class="tool-palette-grid">
  <div class="tool-palette-swatch">
    <div class="tool-swatch-dot" style="background: #3b82f6">
      <input type="color" value="#3b82f6" onchange="...">
    </div>
    <div class="tool-swatch-label">Accent Color</div>
  </div>
</div>
```

### Theme Presets
```html
<div class="tool-preset-grid">
  <button class="tool-preset-btn active">Default</button>
  <button class="tool-preset-btn">Modern</button>
  <button class="tool-preset-btn">Glass</button>
</div>
```

---

## Customizing Accents
If a tool requires a specific accent color, you can override the variable in a local `<style>` block *after* the link to `shared.css`:

```css
:root {
  --accent: #f59e0b; /* Amber accent */
}
```

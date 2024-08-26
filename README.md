# ngx-flickering-grid

`@omnedia/ngx-flickering-grid` is an Angular library that renders a dynamic flickering grid background with customizable square size, grid gaps, flicker behavior, and color. This component is perfect for adding a unique animated grid effect behind content in your Angular application.

## Features

- Dynamic flickering grid effect rendered on an HTML5 canvas.
- Customizable grid parameters, including square size, grid gap, flicker chance, and maximum opacity.
- Easy to integrate as a standalone component with optional viewport-based animation triggering.

## Installation

Install the library using npm:

```bash
npm install @omnedia/ngx-flickering-grid
```

## Usage

Import the `NgxFlickeringGridComponent` in your Angular module or component:

```typescript
import { NgxFlickeringGridComponent } from '@omnedia/ngx-flickering-grid';

@Component({
  ...
  imports: [
    ...
    NgxFlickeringGridComponent,
  ],
  ...
})
```

Use the component in your template:

```html
<om-flickering-grid
  [squareSize]="6"
  [gridGap]="8"
  [flickerChance]="0.5"
  [color]="'#ffcc00'"
  [maxOpacity]="0.4"
  styleClass="custom-flickering-grid"
>
  <h1>Your Content Here</h1>
</om-flickering-grid>
```

## How It Works

- Dynamic Flickering Grid: The grid's squares will flicker at random intervals, controlled by the flickerChance input. You can adjust the size, gap, and opacity of the squares for different visual effects.
- Viewport Animation: The grid animation is only triggered when the component enters the viewport, enhancing performance by preventing unnecessary rendering.
- Global and Custom Styling: You can style the .om-flickering-grid container globally or apply custom styles using the styleClass input.

## API

```html
<om-flickering-grid
  [squareSize]="squareSize"
  [gridGap]="gridGap"
  [flickerChance]="flickerChance"
  [color]="color"
  [maxOpacity]="maxOpacity"
  styleClass="your-custom-class"
>
  <ng-content></ng-content>
</om-flickering-grid>
```

- `squareSize` (optional): Size of each square in pixels. Defaults to 4px.
- `gridGap` (optional): Gap between the squares in pixels. Defaults to 6px.
- `flickerChance` (optional): Probability of squares flickering, represented as a value between 0 and 1. Defaults to 0.3.
- `color` (optional): The color of the grid squares. Accepts any valid CSS color value. Defaults to '#6B7280'.
- `maxOpacity` (optional): Maximum opacity level of the squares. Accepts a value between 0 and 1. Defaults to 0.3.
- `styleClass` (optional): Custom CSS class to apply to the .om-flickering-grid container.

## Example

```html
<om-flickering-grid [squareSize]="8" [gridGap]="10" [flickerChance]="0.4" [color]="'#3498db'" [maxOpacity]="0.5">
  <div class="content">
    <p>Flickering Grid Background Content</p>
  </div>
</om-flickering-grid>
```

This will create a flickering grid with larger squares, more pronounced gaps, and a blue color, while the content inside remains unaffected by the animation.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.
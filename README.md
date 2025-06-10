# Liquid Glass Vue

Apple's Liquid Glass effect for Vue. Forked from [liquid-glass-react](https://github.com/rdev/liquid-glass-react)

Card Example              |  Button Example
:-------------------------:|:-------------------------:
![](https://github.com/rdev/liquid-glass-react/raw/master/assets/card.png)  |  ![](https://github.com/rdev/liquid-glass-react/raw/master/assets/button.png)

## Video

[See it in action](https://raw.githubusercontent.com/rdev/liquid-glass-react/refs/heads/master/assets/video.mov?token=GHSAT0AAAAAACPNNASADXWXU2ZZA2OCMJ3W2CIWMMA)

## Demo

[See it in action but touch it](https://liquid-glass.maxrovensky.com)


## Features

- Proper edgy bending and refraction
- Configurable frosty level
- Supports arbitrary child elements
- Configurable paddings
- Correct hover and click effects
- Edges and highlights take on the underlying light like Apple's does
- Configurable chromatic aberration
- Configurable elasticity, to mimic Apple's "liquid" feel

**⚠️ NOTE:** Safari only partially supports the effect (no displacement) and Firefox does not support it at all.

## Usage

### Installation

```bash
npm install liquid-glass-vue
```

### Basic Usage

```vue
<script lang="ts" setup>
  import LiquidGlass from 'liquid-glass-vue'
</script>

<template>
    <LiquidGlass>
      <div class="p-6">
        <h2>Your content here</h2>
        <p>This will have the liquid glass effect</p>
      </div>
    </LiquidGlass>
</template>
```

### Button Example

```vue
<LiquidGlass
  :displacementScale="64"
  :blurAmount="0.1"
  :saturation="130"
  :aberrationIntensity="2"
  :elasticity="0.35"
  :cornerRadius="100"
  padding="8px 16px"
  @lick={() => console.log('Button clicked!')}
>
  <span class="text-white font-medium">Click Me</span>
</LiquidGlass>
```

### Mouse Container Example

When you want the glass effect to respond to mouse movement over a larger area (like a parent container), use the `mouseContainer` prop:

```vue
<script lang="ts" setup>
  const containerRef = ref<HTMLDivElement>()
</script>

<template>
  <div ref="containerRef" class="w-full h-screen bg-image">
    <LiquidGlass
      :mouseContainer="containerRef"
      :elasticity="0.3"
      :style="{ position: 'fixed', top: '50%', left: '50%' }"
    >
      <div class="p-6">
        <h2>Glass responds to mouse anywhere in the container</h2>
      </div>
    </LiquidGlass>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displacementScale` | `number` | `70` | Controls the intensity of the displacement effect |
| `blurAmount` | `number` | `0.0625` | Controls the blur/frosting level |
| `saturation` | `number` | `140` | Controls color saturation of the glass effect |
| `aberrationIntensity` | `number` | `2` | Controls chromatic aberration intensity |
| `elasticity` | `number` | `0.15` | Controls the "liquid" elastic feel (0 = rigid, higher = more elastic) |
| `cornerRadius` | `number` | `999` | Border radius in pixels |
| `class` | `string` | `""` | Additional CSS classes |
| `padding` | `string` | - | CSS padding value |
| `style` | `React.CSSProperties` | - | Additional inline styles |
| `overLight` | `boolean` | `false` | Whether the glass is over a light background |
| `onClick` | `() => void` | - | Click handler |
| `mouseContainer` | `React.RefObject<HTMLElement \| null> \| null` | `null` | Container element to track mouse movement on (defaults to the glass component itself) |

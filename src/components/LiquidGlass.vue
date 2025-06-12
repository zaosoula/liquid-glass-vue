<script lang="ts" setup>
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, onWatcherCleanup, ref, watch, type Ref } from 'vue'
import GlassContainer from './GlassContainer.vue'

interface LiquidGlassProps {
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  globalMousePos?: { x: number, y: number }
  mouseOffset?: { x: number, y: number }
  mouseContainer?: Ref<HTMLElement | null> | null
  class?: string
  padding?: string
  style?: Record<string, any>
  overLight?: boolean
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
}

const props = withDefaults(defineProps<LiquidGlassProps>(), {
  displacementScale: 70,
  blurAmount: 0.0625,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.15,
  cornerRadius: 999,
  mouseContainer: null,
  class: '',
  padding: '24px 32px',
  overLight: false,
  style: () => {},
  mode: 'standard',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const glassRef = ref<HTMLDivElement>(null)
const isHovered = ref(false)
const isActive = ref(false)
const glassSize = ref({ width: 270, height: 69 })
const internalGlobalMousePos = ref({ x: 0, y: 0 })
const internalMouseOffset = ref({ x: 0, y: 0 })

// Use external mouse position if provided, otherwise use internal
const globalMousePos = computed(() => props.globalMousePos || internalGlobalMousePos.value)
const mouseOffset = computed(() => props.mouseOffset || internalMouseOffset.value)

// Internal mouse tracking
function handleMouseMove(e: MouseEvent) {
  const container = props.mouseContainer || glassRef.value
  if (!container)
    return

  const rect = container.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  internalMouseOffset.value = ({
    x: ((e.clientX - centerX) / rect.width) * 100,
    y: ((e.clientY - centerY) / rect.height) * 100,
  })

  internalGlobalMousePos.value = ({
    x: e.clientX,
    y: e.clientY,
  })
}

// Set up mouse tracking if no external mouse position is provided
watch([() => props.mouseContainer, () => props.globalMousePos, () => props.mouseOffset], () => {
  if (props.globalMousePos && props.mouseOffset) {
    // External mouse tracking is provided, don't set up internal tracking
    return
  }

  const container = props.mouseContainer || glassRef.value
  if (!container)
    return

  container.addEventListener('mousemove', handleMouseMove)

  onWatcherCleanup(() => {
    container.removeEventListener('mousemove', handleMouseMove)
  })
})

// Calculate directional scaling based on mouse position
function calculateDirectionalScale() {
  if (!globalMousePos.value.x || !globalMousePos.value.y || !glassRef.value) {
    return 'scale(1)'
  }

  const rect = glassRef.value.$el.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2
  const pillWidth = glassSize.value.width
  const pillHeight = glassSize.value.height

  const deltaX = globalMousePos.value.x - pillCenterX
  const deltaY = globalMousePos.value.y - pillCenterY

  // Calculate distance from mouse to pill edges (not center)
  const edgeDistanceX = Math.max(0, Math.abs(deltaX) - pillWidth / 2)
  const edgeDistanceY = Math.max(0, Math.abs(deltaY) - pillHeight / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  // Activation zone: 200px from edges
  const activationZone = 200

  // If outside activation zone, no effect
  if (edgeDistance > activationZone) {
    return 'scale(1)'
  }

  // Calculate fade-in factor (1 at edge, 0 at activation zone boundary)
  const fadeInFactor = 1 - edgeDistance / activationZone

  // Normalize the deltas for direction
  const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (centerDistance === 0) {
    return 'scale(1)'
  }

  const normalizedX = deltaX / centerDistance
  const normalizedY = deltaY / centerDistance

  // Calculate stretch factors with fade-in
  const stretchIntensity = Math.min(centerDistance / 300, 1) * props.elasticity * fadeInFactor

  // X-axis scaling: stretch horizontally when moving left/right, compress when moving up/down
  const scaleX = 1 + Math.abs(normalizedX) * stretchIntensity * 0.3 - Math.abs(normalizedY) * stretchIntensity * 0.15

  // Y-axis scaling: stretch vertically when moving up/down, compress when moving left/right
  const scaleY = 1 + Math.abs(normalizedY) * stretchIntensity * 0.3 - Math.abs(normalizedX) * stretchIntensity * 0.15

  return `scaleX(${Math.max(0.8, scaleX)}) scaleY(${Math.max(0.8, scaleY)})`
}

// Helper function to calculate fade-in factor based on distance from element edges
function calculateFadeInFactor() {
  if (!globalMousePos.value.x || !globalMousePos.value.y || !glassRef.value) {
    return 0
  }

  const rect = glassRef.value.$el.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2
  const pillWidth = glassSize.value.width
  const pillHeight = glassSize.value.height

  const edgeDistanceX = Math.max(0, Math.abs(globalMousePos.value.x - pillCenterX) - pillWidth / 2)
  const edgeDistanceY = Math.max(0, Math.abs(globalMousePos.value.y - pillCenterY) - pillHeight / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  const activationZone = 200
  return edgeDistance > activationZone ? 0 : 1 - edgeDistance / activationZone
}

// Helper function to calculate elastic translation
function calculateElasticTranslation() {
  if (!glassRef.value) {
    return { x: 0, y: 0 }
  }

  const fadeInFactor = calculateFadeInFactor()
  const rect = glassRef.value.$el.getBoundingClientRect()
  const pillCenterX = rect.left + rect.width / 2
  const pillCenterY = rect.top + rect.height / 2

  return {
    x: (globalMousePos.value.x - pillCenterX) * props.elasticity * 0.1 * fadeInFactor,
    y: (globalMousePos.value.y - pillCenterY) * props.elasticity * 0.1 * fadeInFactor,
  }
}

function updateGlassSize() {
  if (glassRef.value) {
    const rect = glassRef.value.$el.getBoundingClientRect()
    glassSize.value = ({ width: rect.width, height: rect.height })
  }
}

// Update glass size whenever component mounts or window resizes
onMounted(() => {
  updateGlassSize()
  window.addEventListener('resize', updateGlassSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGlassSize)
})

const hasClickEventListener = computed(
  () => !!getCurrentInstance()?.vnode.props?.onClick,
)
const transformStyle = computed(() => `translate(calc(-50% + ${calculateElasticTranslation().x}px), calc(-50% + ${calculateElasticTranslation().y}px)) ${(isActive.value && hasClickEventListener.value) ? 'scale(0.96)' : calculateDirectionalScale()}`)

const baseStyle = computed(() => ({
  ...props.style,
  transform: transformStyle.value,
  transition: 'all ease-out 0.2s',
}))

const positionStyles = computed(() => ({
  position: baseStyle.value.position || 'relative',
  top: baseStyle.value.top || '50%',
  left: baseStyle.value.left || '50%',
}))
</script>

<template>
  <!-- {/* Over light effect */} -->
  <div
    :class="`bg-black transition-all duration-150 ease-in-out pointer-events-none ${overLight ? 'opacity-20'
      : 'opacity-0'}`" :style="{
      ...positionStyles,
      height: `${glassSize.height}px`,
      width: `${glassSize.width}px`,
      borderRadius: `${cornerRadius}px`,
      transform: baseStyle.transform,
      transition: baseStyle.transition,
    }"
  />
  <div
    :class="`bg-black transition-all duration-150 ease-in-out pointer-events-none mix-blend-overlay ${overLight
      ? 'opacity-100' : 'opacity-0'}`" :style="{
      ...positionStyles,
      height: `${glassSize.height}px`,
      width: `${glassSize.width}px`,
      borderRadius: `${cornerRadius}px`,
      transform: baseStyle.transform,
      transition: baseStyle.transition,
    }"
  />

  <GlassContainer
    ref="glassRef" :class="props.class" :style="baseStyle" :corner-radius="cornerRadius"
    :displacement-scale="overLight ? displacementScale * 0.5 : displacementScale" :blur-amount="blurAmount"
    :saturation="saturation" :aberration-intensity="aberrationIntensity" :glass-size="glassSize" :padding="padding"
    :mouse-offset="mouseOffset" :active="isActive" :over-light="overLight" :mode="mode" @mouse-enter="() => setIsHovered(true)"
    @mouse-leave="() => setIsHovered(false)" @mouse-down="() => setIsActive(true)" @mouse-up="() => setIsActive(false)"
    @click="emit('click', $event)"
  >
    <slot />
  </GlassContainer>

  <!-- {/* Border layer 1 - extracted from glass container */} -->
  <span
    :style="{
      ...positionStyles,
      height: `${glassSize.height}px`,
      width: `${glassSize.width}px`,
      borderRadius: `${cornerRadius}px`,
      transform: baseStyle.transform,
      transition: baseStyle.transition,
      pointerEvents: ' none',
      mixBlendMode: 'screen',
      opacity: 0.2,
      padding: '1.5px',
      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)',
      background: `linear-gradient( ${135 + mouseOffset.x * 1.2}deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255,
    ${0.12 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%, rgba(255, 255, 255, ${0.4
      + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%, rgba(255, 255, 255, 0.0) 100% )`,
    }"
  />

  <!-- {/* Border layer 2 - duplicate with mix-blend-overlay */} -->
  <span
    :style="{
      ...positionStyles,
      height: `${glassSize.height}px`,
      width: `${glassSize.width}px`,
      borderRadius: `${cornerRadius}px`,
      transform: baseStyle.transform,
      transition: baseStyle.transition,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      padding: '1.5px',
      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)',
      background: `linear-gradient( ${135 + mouseOffset.x * 1.2}deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255,
    ${0.32 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%, rgba(255, 255, 255, ${0.6
      + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%, rgba(255, 255, 255, 0.0) 100% )`,
    }"
  />

  <!-- {/* Hover effects */}! -->
  <template v-if="hasClickEventListener">
    <div
      :style="{
        ...positionStyles,
        height: `${glassSize.height}px`,
        width: `${glassSize.width + 1}px`,
        borderRadius:
          `${cornerRadius}px`,
        transform: baseStyle.transform,
        pointerEvents: 'none',
        transition: 'all 0.2s ease-out',
        opacity: isHovered || isActive ? 0.5 : 0,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)',
        mixBlendMode: 'overlay',
      }"
    />
    <div
      :style="{
        ...positionStyles,
        height: `${glassSize.height}px`,
        width: `${glassSize.width + 1}px`,
        borderRadius:
          `${cornerRadius}px`,
        transform: baseStyle.transform,
        pointerEvents: 'none',
        transition: 'all 0.2s ease-out',
        opacity: isActive ? 0.5 : 0,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)',
        mixBlendMode: 'overlay',
      }"
    />
    <div
      :style="{
        ...baseStyle,
        height: `${glassSize.height}px`,
        width: `${glassSize.width + 1}px`,
        borderRadius: `${cornerRadius}px`,
        position: baseStyle.position,
        top: baseStyle.top,
        left: baseStyle.left,
        pointerEvents: 'none',
        transition: 'all 0.2s ease-out',
        opacity: isHovered ? 0.4 : isActive ? 0.8 : 0,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
        mixBlendMode: 'overlay',
      }"
    />
  </template>
</template>

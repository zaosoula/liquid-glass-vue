<script setup lang="tsx">
import { computed, getCurrentInstance, ref, useId, useTemplateRef, watch } from 'vue'
import GlassFilter from './GlassFilter.vue'
import { generateShaderDisplacementMap } from './utils'

const props = withDefaults(defineProps<{
  class?: string
  style?: React.CSSProperties
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  mouseOffset?: { x: number, y: number }
  active?: boolean
  overLight?: boolean
  cornerRadius?: number
  padding?: string
  glassSize?: { width: number, height: number }
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
}>(), {
  class: '',
  displacementScale: 25,
  blurAmount: 12,
  saturation: 180,
  aberrationIntensity: 2,
  active: false,
  overLight: false,
  cornerRadius: 999,
  padding: '24px 32px',
  glassSize: () => ({ width: 270, height: 69 }),
  mode: 'standard',
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'mouseEnter'): void
  (e: 'mouseLeave'): void
  (e: 'mouseDown'): void
  (e: 'mouseUp'): void
}>()

const $el = useTemplateRef('dom')
defineExpose({ $el })

const filterId = useId()
const shaderMapUrl = ref<string>('')
const isFirefox = computed(() => navigator.userAgent.toLowerCase().includes('firefox'))

const backdropStyle = computed(() => ({
  filter: isFirefox.value ? null : `url(#${filterId})`,
  backdropFilter: `blur(${(props.overLight ? 20 : 4) + props.blurAmount * 32}px) saturate(${props.saturation}%)`,
}))

const hasClickEventListener = computed(
  () => !!getCurrentInstance()?.vnode.props?.onClick,
)

watch([() => props.mode, () => props.glassSize, () => props.glassSize?.height, () => props.glassSize.width], () => {
  if (props.mode === 'shader') {
    const url = generateShaderDisplacementMap(props.glassSize.width, props.glassSize.height)
    shaderMapUrl.value = (url)
  }
}, {
  immediate: true,
})
</script>

<template>
  <div
    ref="dom" :class="`relative ${props.class} ${active ? 'active' : ''} ${hasClickEventListener ? 'cursor-pointer' : ''
    }`" :style="style" @click="emit('click', $event)"
  >
    <GlassFilter
      :id="filterId" :displacement-scale="displacementScale" :aberration-intensity="aberrationIntensity"
      :width="glassSize.width" :height="glassSize.height" :mode="mode" :shader-map-url="shaderMapUrl"
    />

    <div
      class="glass" :style="{
        borderRadius: `${cornerRadius}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '24px',
        padding,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        boxShadow:
          overLight ? '0px 16px 70px rgba(0, 0, 0, 0.75)' : '0px 12px 40px rgba(0, 0, 0, 0.25)',
      }" @mouseEnter="emit('mouseEnter', $event)" @mouseLeave="emit('mouseLeave', $event)"
      @mouseDown="emit('mouseDown', $event)" @mouseUp="emit('mouseUp', $event)"
    >
      <!-- {/* backdrop layer that gets wiggly */} -->
      <span className="glass__warp" :style="{ ...backdropStyle, position: 'absolute', inset: '0' }" />

      <!-- {/* user content stays sharp */} -->
      <div
        className="transition-all duration-150 ease-in-out text-white" :style="{
          position: 'relative',
          zIndex: 1,
          font: '500 20px/1 system-ui',
          textShadow: overLight ? '0px 2px 12px rgba(0, 0, 0, 0)'
            : '0px 2px 12px rgba(0, 0, 0, 0.4)',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

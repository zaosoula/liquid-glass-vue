<script lang="ts" setup>
import { Github, LogOutIcon } from 'lucide-vue-next'
import { ref, watchEffect, computed } from 'vue'

// User Info Card Controls
const displacementScale = ref(100)
const blurAmount = ref(0.5)
const saturation = ref(140)
const aberrationIntensity = ref(2)
const elasticity = ref(0)
const cornerRadius = ref(32)
const userInfoOverLight = ref(false)
const userInfoMode = ref<'standard' | 'polar'>('standard')

// Log Out Button Controls
const logoutDisplacementScale = ref(64)
const logoutBlurAmount = ref(0.1)
const logoutSaturation = ref(130)
const logoutAberrationIntensity = ref(2)
const logoutElasticity = ref(0.35)
const logoutCornerRadius = ref(100)
const logoutOverLight = ref(false)
const logoutMode = ref<'standard' | 'polar'>('standard')

// Shared state
const activeTab = ref<'userInfo' | 'logOut'>('userInfo')
const containerRef = ref<HTMLDivElement>(null)

const scroll = ref(0)

const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
  requestAnimationFrame(() => {
    scroll.value = ((event?.target as any)?.scrollTop)
  })
}

const scrollingOverBrightSection = computed(() => scroll.value > 230 && scroll.value < 500)
</script>

<template>
  <div class="grid grid-cols-3 shadow-2xl w-full max-w-5xl mx-auto my-10 h-screen max-h-[calc(100vh-5rem)]
    rounded-3xl overflow-hidden">
    <!-- {/* Left Panel - Glass Effect Demo */} -->
    <div ref="containerRef" class=" flex-1 relative overflow-auto col-span-2" @scroll="handleScroll">
      <div class="w-full min-h-[200vh] absolute top-0 left-0 pb-96 mb-96">
        <!-- <img src="https://random-image-pepebigotes.vercel.app/api/random-image" class="w-full h-96 object-cover"> -->
        <img src="https://picsum.photos/2000/2000" class="w-full h-96 object-cover">
        <div class="flex flex-col gap-2" id="bright-section">
          <h2 class="text-2xl font-semibold my-5 text-center">Some Heading</h2>
          <p class="px-10">Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger <br />Bacon ipsum dolor
            amet hamburger Bacon ipsum dolor amet hamburger<br />Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet
            hamburger<br />Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />Bacon ipsum dolor amet
            hamburger Bacon ipsum dolor amet hamburger<br />Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet
            hamburger</p>

        </div>

        <img src="https://picsum.photos/1200/1200" class="w-full h-80 object-cover my-10">
        <img src="https://picsum.photos/1400/1300" class="w-full h-72 object-cover my-10">
        <img src="https://picsum.photos/1100/1200" class="w-full h-96 object-cover my-10 mb-96">
      </div>

      <LiquidGlass v-if="activeTab === 'userInfo'" :displacement-scale="displacementScale" :blur-amount="blurAmount"
        :saturation="saturation" :aberration-intensity="aberrationIntensity" :elasticity="elasticity"
        :corner-radius="cornerRadius" :mouse-container="containerRef"
        :over-light="scrollingOverBrightSection || userInfoOverLight" :mode="userInfoMode" :style="{
          position: 'fixed',
          top: '25%',
          left: '40%',
        }">
        <div class="w-72 text-shadow-lg">
          <h3 class="text-xl font-semibold mb-4">
            User Info
          </h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <p class="font-medium">
                  John Doe
                </p>
                <p class="text-sm text-white">
                  Software Engineer
                </p>
              </div>
            </div>
            <div class="pt-2 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-white">Email:</span>
                <span class="text-sm">john.doe@example.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-white">Location:</span>
                <span class="text-sm">San Francisco, CA</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-white">Joined:</span>
                <span class="text-sm">March 2023</span>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>

      <LiquidGlass v-if="activeTab === 'logOut'" :displacement-scale="logoutDisplacementScale"
        :blur-amount="logoutBlurAmount" :saturation="logoutSaturation" :aberration-intensity="logoutAberrationIntensity"
        :elasticity="logoutElasticity" :corner-radius="logoutCornerRadius" :mouse-container="containerRef"
        :over-light="scrollingOverBrightSection || logoutOverLight" :mode="logoutMode" padding="8px 16px"
        :style="{ position: 'fixed', top: '20%', left: '40%' }" @click="() => alert('Logged out!')">
        <h3 class="text-lg font-medium flex items-center gap-2">
          Log Out
          <LogOutIcon class-name="w-5 h-5" />
        </h3>
      </LiquidGlass>
    </div>

    <!-- {/* Right Panel - Control Panel */} -->
    <div
      class="col-start-3 bg-gray-900/80 h-full overflow-y-auto backdrop-blur-md border-l border-white/10 p-8 flex flex-col">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-white">
            Liquid Glass Vue
          </h2>
          <a href="https://github.com/zaosoula/liquid-glass-vue" target="_blank" rel="noopener noreferrer"
            class="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            title="View on GitHub">
            <Github class-name="w-6 h-6" />
          </a>
        </div>
        <p class="text-white/60 text-sm">
          Liquid Glass container effect for Vue. With settings and effects and
          stuff. Based on <a href="https://github.com/rdev/liquid-glass-react"
            target="_blank">@rdev/liquid-glass-react</a>
        </p>
      </div>

      <!-- {/* Tab Switcher */} -->
      <div class="flex mb-6 bg-white/5 rounded-lg p-1">
        <button :class="`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'userInfo'
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-white/70 hover:text-white hover:bg-white/10'
          }`" @click="() =>
            activeTab = 'userInfo'">
          User Info Card
        </button>
        <button :class="`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'logOut'
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-white/70 hover:text-white hover:bg-white/10'
          }`" @click="() =>
            activeTab = 'logOut'">
          Log Out Button
        </button>
      </div>

      <div class="space-y-8 flex-1">
        <template v-if="activeTab === 'userInfo'">
          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Refraction Mode</span>
            <div class="space-y-2">
              <div class="flex items-center space-x-3">
                <input type="radio" id="userInfoModeStandard" name="userInfoMode" value="standard"
                  :checked="userInfoMode === 'standard'" @click="(e) => userInfoMode = 'standard'"
                  class="w-4 h-4 accent-blue-500" />
                <label htmlFor="userInfoModeStandard" class="text-sm text-white/90">
                  Standard
                </label>
              </div>
              <div class="flex items-center space-x-3">
                <input type="radio" id="userInfoModePolar" name="userInfoMode" value="polar"
                  :checked="userInfoMode === 'polar'" @click="(e) => userInfoMode = 'polar'"
                  class="w-4 h-4 accent-blue-500" />
                <label htmlFor="userInfoModePolar" class="text-sm text-white/90">
                  Polar
                </label>
              </div>
            </div>
            <p class="text-xs text-white/50 mt-2">Controls the refraction calculation method</p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Displacement Scale</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-blue-300">{{ displacementScale }}</span>
            </div>
            <input v-model.number="displacementScale" type="range" min="0" max="200" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls the intensity of edge distortion
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Blur Amount</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-green-300">{{ blurAmount.toFixed(1) }}</span>
            </div>
            <input v-model.number="blurAmount" type="range" min="0" max="1" step="0.01" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls backdrop blur intensity
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Saturation</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-purple-300">{{ saturation }}%</span>
            </div>
            <input v-model.number="saturation" type="range" min="100" max="300" step="10" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls color saturation of the backdrop
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Chromatic Aberration</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-cyan-300">{{ aberrationIntensity }}</span>
            </div>
            <input v-model.number="aberrationIntensity" type="range" min="0" max="20" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls RGB channel separation intensity
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Elasticity</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-orange-300">{{ elasticity.toFixed(2) }}</span>
            </div>
            <input v-model.number="elasticity" type="range" min="0" max="1" step="0.05" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls how much the glass reaches toward the cursor
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Corner Radius</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-pink-300">{{ cornerRadius === 999 ? "Full"
                : `${cornerRadius}px` }}</span>
            </div>
            <input v-model.number="cornerRadius" type="range" min="0" max="100" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls the roundness of the glass corners
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Over Light</span>
            <div class="flex items-center space-x-3">
              <input id="userInfoOverLight" v-model="userInfoOverLight" type="checkbox" class="w-5 h-5 accent-blue-500">
              <label htmlFor="userInfoOverLight" class="text-sm text-white/90">
                Tint liquid glass dark (use for bright backgrounds)
              </label>
            </div>
            <p class="text-xs text-white/50 mt-2">
              Makes the glass darker for better visibility on light backgrounds
            </p>
          </div>
        </template>

        <template v-if="activeTab === 'logOut'">
          <div>Add commentMore actions
            <span class="block text-sm font-semibold text-white/90 mb-3">Refraction Mode</span>
            <div class="space-y-2">
              <div class="flex items-center space-x-3">
                <input type="radio" id="logoutModeStandard" name="logoutMode" value="standard"
                  :checked="logoutMode === 'standard'" @click="(e) => logoutMode = 'standard'"
                  class="w-4 h-4 accent-blue-500" />
                <label htmlFor="logoutModeStandard" class="text-sm text-white/90">
                  Standard
                </label>
              </div>
              <div class="flex items-center space-x-3">
                <input type="radio" id="logoutModePolar" name="logoutMode" value="polar"
                  :checked="logoutMode === 'polar'" @click="(e) => logoutMode = 'polar'"
                  class="w-4 h-4 accent-blue-500" />
                <label htmlFor="logoutModePolar" class="text-sm text-white/90">
                  Polar
                </label>
              </div>
            </div>
            <p class="text-xs text-white/50 mt-2">Controls the refraction calculation method</p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Displacement Scale</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-blue-300">{{ logoutDisplacementScale }}</span>
            </div>
            <input v-model.number="logoutDisplacementScale" type="range" min="0" max="200" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls the intensity of edge distortion
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Blur Amount</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-green-300">{{ logoutBlurAmount.toFixed(1) }}</span>
            </div>
            <input v-model.number="logoutBlurAmount" type="range" min="0" max="1" step="0.01" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls backdrop blur intensity
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Saturation</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-purple-300">{{ logoutSaturation }}%</span>
            </div>
            <input v-model.number="logoutSaturation" type="range" min="100" max="300" step="10" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls color saturation of the backdrop
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Chromatic Aberration</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-cyan-300">{{ logoutAberrationIntensity }}</span>
            </div>
            <input v-model.number="logoutAberrationIntensity" type="range" min="0" max="20" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls RGB channel separation intensity
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Elasticity</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-orange-300">{{ logoutElasticity.toFixed(2) }}</span>
            </div>
            <input v-model.number="logoutElasticity" type="range" min="0" max="1" step="0.05" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls how much the glass reaches toward the cursor
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Corner Radius</span>
            <div class="mb-2">
              <span class="text-xl font-mono text-pink-300">{{ logoutCornerRadius === 999 ? "Full"
                : `${logoutCornerRadius}px` }}</span>
            </div>
            <input v-model.number="logoutCornerRadius" type="range" min="0" max="100" step="1" class="w-full">
            <p class="text-xs text-white/50 mt-2">
              Controls the roundness of the glass corners
            </p>
          </div>

          <div>
            <span class="block text-sm font-semibold text-white/90 mb-3">Over Light</span>
            <div class="flex items-center space-x-3">
              <input id="logoutOverLight" v-model="logoutOverLight" type="checkbox" class="w-5 h-5 accent-blue-500">
              <label htmlFor="logoutOverLight" class="text-sm text-white/90">
                Tint liquid glass dark (use for bright backgrounds)
              </label>
            </div>
            <p class="text-xs text-white/50 mt-2">
              Makes the glass darker for better visibility on light backgrounds
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

import { displacementMap, polarDisplacementMap, prominentDisplacementMap } from './displacement-maps'
import { fragmentShaders, ShaderDisplacementGenerator } from './shader-utils'

export function getMap(mode: 'standard' | 'polar' | 'prominent' | 'shader', shaderMapUrl?: string) {
  switch (mode) {
    case 'standard':
      return displacementMap
    case 'polar':
      return polarDisplacementMap
    case 'prominent':
      return prominentDisplacementMap
    case 'shader':
      return shaderMapUrl || displacementMap
    default:
      throw new Error(`Invalid mode: ${mode}`)
  }
}

export function generateShaderDisplacementMap(width: number, height: number): string {
  const generator = new ShaderDisplacementGenerator({
    width,
    height,
    fragment: fragmentShaders.liquidGlass,
  })

  const dataUrl = generator.updateShader()
  generator.destroy()

  return dataUrl
}

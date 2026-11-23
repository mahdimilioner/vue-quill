<template>
  <section ref="track" class="track" aria-labelledby="turntable-title">
    <div class="stage">
      <div class="stage-head">
        <h2 id="turntable-title">دریل سه‌بعدی در حال چرخش</h2>
        <p>
          این یک مدل واقعاً سه‌بعدی است، نه عکس. اسکرول به پایین بدنه را از پایین به بالا می‌چرخاند
          و اسکرول به بالا همان مسیر را برمی‌گرداند؛ وقتی دست نزنی، خودش آرام می‌چرخد.
        </p>
      </div>

      <div class="viewport">
        <div class="shadow" :style="shadowStyle"></div>
        <Drill3D :progress="progress" @angle="onAngle" />
      </div>

      <div class="readout">
        <div class="readout-top">
          <span class="deg">{{ degrees }}°</span>
          <span class="phase">{{ phaseLabel }}</span>
        </div>
        <div class="bar">
          <span :style="{ width: progress * 100 + '%' }"></span>
        </div>
        <p class="scroll-hint">برای چرخش، اسکرول کن</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import Drill3D from './Drill3D.vue'

const persianNumber = new Intl.NumberFormat('fa-IR')

export default defineComponent({
  name: 'ProductTurntable',
  components: { Drill3D },
  setup() {
    const track = ref<HTMLElement | null>(null)
    const progress = ref(0)
    const angle = ref(0)
    let frame = 0

    const measure = () => {
      const el = track.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      const next = span > 0 ? -rect.top / span : 0
      progress.value = Math.min(1, Math.max(0, next))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    onMounted(() => {
      measure()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    })

    const onAngle = (value: number) => {
      angle.value = value
    }

    const normalized = computed(() => ((angle.value % 360) + 360) % 360)

    const degrees = computed(() => persianNumber.format(Math.round(normalized.value)))

    const phaseLabel = computed(() => {
      const value = normalized.value
      if (value < 30 || value >= 330) return 'نمای روبه‌رو'
      if (value < 150) return 'از بالا'
      if (value < 210) return 'پشت دستگاه'
      return 'از پایین'
    })

    const shadowStyle = computed(() => {
      const spread = Math.abs(Math.cos((normalized.value * Math.PI) / 180))
      return {
        opacity: String(0.08 + spread * 0.4),
        transform: 'scale(' + (0.78 + 0.22 * spread) + ')',
      }
    })

    return { track, progress, degrees, phaseLabel, shadowStyle, onAngle }
  },
})
</script>

<style scoped>
.track {
  position: relative;
  height: 260vh;
}

.stage {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 100vh;
  padding: 32px 0;
  overflow: hidden;
}

.stage-head {
  max-width: 600px;
  text-align: center;
}

.stage-head h2 {
  margin: 0 0 8px;
  font-size: clamp(1.3rem, 2.5vw, 1.75rem);
  font-weight: 700;
  color: var(--ink);
}

.stage-head p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.85;
  color: var(--muted);
}

.viewport {
  position: relative;
  flex: 1;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 820px;
  min-height: 0;
}

.shadow {
  position: absolute;
  bottom: 14%;
  width: min(420px, 62vw);
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.85), transparent 72%);
  filter: blur(6px);
  transition: opacity 0.2s linear;
}

.readout {
  width: min(560px, 84vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.readout-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.deg {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--orange);
  font-variant-numeric: tabular-nums;
}

.phase {
  font-size: 0.85rem;
  color: var(--muted);
}

.bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ffb066, var(--orange));
  transition: width 0.1s linear;
}

.scroll-hint {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

@media (max-width: 640px) {
  .stage {
    gap: 10px;
    padding: 20px 0;
  }

  .stage-head p {
    font-size: 0.82rem;
  }

  .viewport {
    max-height: 52vh;
  }
}
</style>

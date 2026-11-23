<template>
  <section ref="track" class="track" aria-labelledby="turntable-title">
    <div class="stage">
      <div class="stage-head">
        <h2 id="turntable-title">با اسکرول بچرخان</h2>
        <p>
          اسکرول به پایین، دستگاه را از پایین به بالا می‌چرخاند؛ اسکرول به بالا همان مسیر را
          برمی‌گرداند.
        </p>
      </div>

      <div class="viewport">
        <div class="shadow" :style="shadowStyle"></div>
        <div class="object" :style="objectStyle">
          <img :src="render" alt="دریل Pittools در حال چرخش سه‌بعدی" />
        </div>
        <div class="edge" :style="edgeStyle"></div>
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

const persianNumber = new Intl.NumberFormat('fa-IR')

export default defineComponent({
  name: 'ProductTurntable',
  props: {
    render: { type: String, required: true },
    baseX: { type: Number, default: 0 },
  },
  setup(props) {
    const track = ref<HTMLElement | null>(null)
    const progress = ref(0)
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

    // Scroll down tips the product up: bottom face first, then the top.
    const rotation = computed(() => props.baseX + progress.value * 180)

    const degrees = computed(() => persianNumber.format(Math.round(rotation.value)))

    const phaseLabel = computed(() => {
      const value = rotation.value
      if (value < -14) return 'نمای از بالا'
      if (value < 20) return 'نمای روبه‌رو'
      if (value < 70) return 'از پایین به بالا'
      if (value < 110) return 'لبهٔ دستگاه'
      if (value < 160) return 'از بالا'
      return 'پشت دستگاه'
    })

    const objectStyle = computed(() => ({
      transform: 'rotateX(' + rotation.value + 'deg) rotateY(-10deg)',
    }))

    const shadowStyle = computed(() => {
      const radians = (rotation.value * Math.PI) / 180
      const spread = Math.abs(Math.cos(radians))
      return {
        opacity: String(0.16 + spread * 0.44),
        transform: 'scale(' + (1 - 0.22 * Math.abs(Math.sin(radians))) + ')',
      }
    })

    // The flat render vanishes for a moment when it turns edge-on;
    // a thin product edge keeps the stage from going empty.
    const edgeStyle = computed(() => {
      const facing = Math.abs(Math.cos((rotation.value * Math.PI) / 180))
      return {
        opacity: String(Math.max(0, 1 - facing * 2.4)),
        transform: 'scaleX(' + (0.62 + 0.38 * (1 - facing)) + ')',
      }
    })

    return { track, progress, degrees, phaseLabel, objectStyle, shadowStyle, edgeStyle }
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
  gap: 18px;
  height: 100vh;
  padding: 40px 0;
  overflow: hidden;
}

.stage-head {
  max-width: 560px;
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
  max-width: 760px;
  perspective: 1500px;
}

.object {
  width: min(560px, 78vw);
  transform-style: preserve-3d;
  will-change: transform;
}

.object img {
  display: block;
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55);
}

.shadow {
  position: absolute;
  bottom: 12%;
  width: min(420px, 62vw);
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.85), transparent 72%);
  filter: blur(6px);
  transition: opacity 0.15s linear;
}

.edge {
  position: absolute;
  width: min(520px, 74vw);
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 120, 0, 0) 0%,
    #ff7800 18%,
    #ffd0a1 50%,
    #ff7800 82%,
    rgba(255, 120, 0, 0) 100%
  );
  box-shadow: 0 0 26px rgba(255, 120, 0, 0.5);
  pointer-events: none;
  transition: opacity 0.12s linear;
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
    gap: 12px;
    padding: 24px 0;
  }

  .object {
    width: 86vw;
  }
}
</style>

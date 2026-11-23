<template>
  <section class="gallery" aria-labelledby="gallery-title">
    <div class="gallery-head">
      <h2 id="gallery-title">نمونه‌های رندر با زاویه‌های مختلف</h2>
      <p>
        هر نمونه یک نمای پیشنهادی از همین رندر است. زاویه‌ای که انتخاب کنی، نقطهٔ شروع چرخش
        بخش بعدی می‌شود.
      </p>
    </div>

    <div class="grid">
      <article
        v-for="angle in angles"
        :key="angle.id"
        class="card"
        :class="{ 'is-selected': angle.id === modelValue }"
      >
        <div class="shot">
          <div
            class="shot-frame"
            :style="{
              transform:
                'rotateX(' + angle.rotateX + 'deg) rotateY(' + angle.rotateY + 'deg) scale(' + angle.scale + ')',
            }"
          >
            <img :src="render" :alt="'رندر سه‌بعدی دریل Pittools، ' + angle.label" />
          </div>
          <span v-if="angle.id === modelValue" class="badge">انتخاب شد</span>
        </div>

        <div class="card-body">
          <h3>{{ angle.label }}</h3>
          <p>{{ angle.hint }}</p>
          <button type="button" class="pick" @click="select(angle.id)">
            {{ angle.id === modelValue ? 'انتخاب‌شده' : 'انتخاب این زاویه' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { RenderAngle } from './productRender'

export default defineComponent({
  name: 'AngleGallery',
  props: {
    render: { type: String, required: true },
    angles: { type: Array as PropType<RenderAngle[]>, required: true },
    modelValue: { type: String, required: true },
  },
  emits: ['update:modelValue'],
  methods: {
    select(id: string) {
      this.$emit('update:modelValue', id)
    },
  },
})
</script>

<style scoped>
.gallery {
  padding: 8px 0 72px;
}

.gallery-head {
  max-width: 640px;
  margin-bottom: 28px;
}

.gallery-head h2 {
  margin: 0 0 10px;
  font-size: clamp(1.35rem, 2.6vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.gallery-head p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
  gap: 18px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  border-radius: 20px;
  background: var(--panel);
  border: 1px solid var(--line);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.card.is-selected {
  border-color: rgba(255, 120, 0, 0.75);
  box-shadow: 0 18px 44px rgba(255, 120, 0, 0.16);
  transform: translateY(-2px);
}

.shot {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: radial-gradient(120% 90% at 50% 20%, #2c2c31 0%, #131316 70%);
  perspective: 900px;
}

.shot-frame {
  position: absolute;
  inset: 0;
  transform-origin: 50% 50%;
  transition: transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}

.shot-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #1b1204;
  background: var(--orange);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 4px 4px;
}

.card-body h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink);
}

.card-body p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.75;
  color: var(--muted);
  min-height: 2.9em;
}

.pick {
  margin-top: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.pick:hover {
  border-color: rgba(255, 120, 0, 0.6);
  color: var(--orange);
}

.card.is-selected .pick {
  background: var(--orange);
  border-color: var(--orange);
  color: #1b1204;
  font-weight: 700;
}
</style>

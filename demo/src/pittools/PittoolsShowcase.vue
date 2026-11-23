<template>
  <div class="pittools" dir="rtl">
    <header class="bar">
      <span class="brand">PITTOOLS</span>
      <span class="bar-note">رندر سه‌بعدی دریل شارژی</span>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">دریل شارژی ۱۸ ولت — سری کارگاهی</p>
        <h1>دریل <span>PITTOOLS</span> در نور کارگاه</h1>
        <p class="lede">
          این رندر سه‌بعدی از دریل با لوگوی PITTOOLS ساخته شده است. زاویه‌ها را ببین، یکی را
          برای نهایی کردن انتخاب کن و بعد با اسکرول، بدنهٔ دستگاه را از پایین به بالا بچرخان.
        </p>
        <ul class="specs">
          <li>بدنهٔ نارنجی مات</li>
          <li>گریپ لاستیکی مشکی</li>
          <li>متهٔ طلایی تیتانیوم</li>
        </ul>
      </div>

      <figure class="hero-visual">
        <img :src="render" alt="رندر سه‌بعدی دریل Pittools روی میز کارگاه" />
      </figure>
    </section>

    <AngleGallery v-model="selectedId" :render="render" :angles="angles" />

    <ProductTurntable :render="render" :base-x="baseX" />

    <footer class="foot">
      <span>PITTOOLS</span>
      <span>رندر سه‌بعدی محصول — نسخهٔ پیش‌نمایش</span>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import AngleGallery from './AngleGallery.vue'
import ProductTurntable from './ProductTurntable.vue'
import { PRODUCT_RENDER, RENDER_ANGLES } from './productRender'

export default defineComponent({
  name: 'PittoolsShowcase',
  components: { AngleGallery, ProductTurntable },
  setup() {
    const selectedId = ref(RENDER_ANGLES[1].id)

    const baseX = computed(() => {
      const angle = RENDER_ANGLES.find((item) => item.id === selectedId.value)
      return angle ? angle.rotateX : 0
    })

    return {
      render: PRODUCT_RENDER,
      angles: RENDER_ANGLES,
      selectedId,
      baseX,
    }
  },
})
</script>

<style scoped>
.pittools {
  --ink: #f5efe8;
  --muted: #b6a99d;
  --panel: #17171a;
  --line: rgba(255, 255, 255, 0.08);
  --orange: #ff7800;
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px 64px;
  color: var(--ink);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
}

.brand {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--ink);
}

.brand::first-letter {
  color: var(--orange);
}

.bar-note {
  font-size: 0.8rem;
  color: var(--muted);
}

.hero {
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  align-items: center;
  gap: 44px;
  padding: 56px 0 64px;
}

.eyebrow {
  margin: 0 0 14px;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: var(--orange);
}

.hero-copy h1 {
  margin: 0 0 18px;
  font-size: clamp(1.9rem, 4.2vw, 2.9rem);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.hero-copy h1 span {
  color: var(--orange);
  letter-spacing: 0.06em;
}

.lede {
  margin: 0 0 24px;
  max-width: 46ch;
  font-size: 0.96rem;
  line-height: 2;
  color: var(--muted);
}

.specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.specs li {
  padding: 6px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--muted);
}

.hero-visual {
  margin: 0;
  position: relative;
}

.hero-visual::before {
  content: '';
  position: absolute;
  inset: 8% 10%;
  background: radial-gradient(closest-side, rgba(255, 120, 0, 0.32), transparent 70%);
  filter: blur(38px);
  z-index: 0;
}

.hero-visual img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  border-radius: 22px;
  border: 1px solid var(--line);
  box-shadow: 0 34px 70px rgba(0, 0, 0, 0.6);
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 26px;
  border-top: 1px solid var(--line);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.42);
}

.foot span:first-child {
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--muted);
}

@media (max-width: 820px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 36px 0 44px;
  }

  .hero-visual {
    order: -1;
  }
}
</style>

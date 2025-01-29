<template>
  <div class="donut-chart-container">
    <svg class="donut-chart" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference - offset"
        stroke-linecap="round"
      />
      <text
        :x="size / 2"
        :y="size / 2"
        text-anchor="middle"
        dy=".3em"
        :font-size="fontSize"
        fill="#000"
        :font-family="'montserrat, Arial, sans-serif'"
      >
        {{ isDataAvailable ? percentage + '%' : 'N/A' }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import {type  IDonutChart } from '../../assets/ts/interfaces/chart'

const props = defineProps({
  configChart: { type: Object as PropType<IDonutChart>, required: true }
})

const defaultValues = {
  size: 60,
  strokeWidth: 4,
  color: '#3f556d',
  backgroundColor: '#c9d6e7',
  maxValue: 100
}

function getPropValue<T>(prop: T | undefined, defaultValue: T): T {
  return prop ?? defaultValue
}

const size = computed(() => getPropValue(props.configChart.size, defaultValues.size))
const max = computed(() => getPropValue(props.configChart.maxValue, defaultValues.maxValue))
const strokeWidth = computed(() => getPropValue(props.configChart.strokeWidth, defaultValues.strokeWidth))
const color = computed(() => getPropValue(props.configChart.color, defaultValues.color))
const backgroundColor = computed(() =>
  getPropValue(props.configChart.backgroundColor, defaultValues.backgroundColor)
)

const radius = computed(() => (size.value - strokeWidth.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => {
  if (props.configChart.value === 0 && max.value === 0) return 0
  return (props.configChart.value / max.value) * circumference.value
})

const percentage = computed(() => {
  if (props.configChart.value === 0 && max.value === 0) return 0
  return Math.round((props.configChart.value / max.value) * 100)
})

const isDataAvailable = computed(() => props.configChart.value !== 0 || max.value !== 0)

const fontSize = computed(() => size.value / 5)
</script>

<style scoped>
.donut-chart-container {
  text-align: center;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-data i {
  font-size: 2em;
  margin-bottom: 0.5em;
}

circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(90deg);
  transform-origin: 50% 50%;
}
</style>

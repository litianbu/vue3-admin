<template>
  <div class="box4" ref="map">我是地图</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaJSON from './china.json'
const map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  const myCharts = echarts.init(map.value)
  myCharts.setOption({
    geo: {
      map: 'china',
      roam: true,
      //地图的位置调试
      left: 150,
      top: 150,
      right: 150,
      zoom: 1.2,
      bottom: 0,
      label: {
        show: true,
        color: 'white',
        fontSize: 14,
      },
      itemStyle: {
        //每一个多边形的样式
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 35,
        },
      },
    },
    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 5,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'yellow',
              width: 5,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'black',
          symbolSize: 10,
        },
      },
    ],
  })
})
</script>

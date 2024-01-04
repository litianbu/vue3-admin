# Vue 3 + TypeScript + Vite

# 后台管理系统

## API文档地址
[地址一](http://139.198.104.58:8212/swagger-ui.html)
[地址二](http://39.98.123.211:8510/swagger-ui.html)

## 地图经纬度JSON 获取
[阿里云](https://datav.aliyun.com/portal/school/atlas/area_selector?spm=a2crr.23498931.0.0.4ad815ddfFByvF)
[获取JSON接口](https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json)

## Echarts国内镜像
[Echarts](https://www.isqqw.com/)


### 菜单权限
超级管理员: admin atguigu123 拥有全部的菜单、按钮的权限

一共多少个路由！！！
login(登陆页面)、
404、
任意路由、
首页、
数据大屏、
权限管理(三个子路由)、
商品管理(四个子路由)

1.1 开发菜单权限
---第一步: 拆分路由
静态路由: 大家都可以拥有
login(登陆页面)、404、首页、数据大屏、

异步路由：不同身份拥有的路由
权限管理(三个子路由)、
商品管理(四个子路由)

任意路由: 任意路由
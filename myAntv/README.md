<!--
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 16:29:17
 * @LastEditors: liang
 * @LastEditTime: 2020-05-01 17:10:46
 -->

## antv

antv 是阿里出品的一套数据可视化的开源库，我们可以把它注入到我们到 react 项目中。

## G2-可视化引擎

> G2 一套面向常规统计图表，以数据驱动的高交互可视化图形语法，具有高度的易用性和扩展性。使用 G2，你可以无需关注图表各种繁琐的实现细节，一条语句即可使用 Canvas 或 SVG 构建出各种各样的可交互的统计图表。

### Bizcharts

要在 react 中使用`antv/g2`,我们可以使用 bizcharts。

```js
yarn add @antv/g2 bizcharts
```

#### 构成

> 在 BizCharts 中，图表是由各个组件组合而成的。组件有两种类型，实体组件和抽象组件.

- 实体组件：在图表上有对应的图形、文本显示。
- 抽象组件：没有显示，是一种概念抽象组件。

##### 实体组件

**charts**
图表的父组件，所有的其他组件都必须由 `<Chart>` 包裹。简单来说就是一个绘图容器。
**Axis**
坐标轴组件,`<Chart><Axis /></Chart>`用于定义 x 轴和 y 轴
**Geom**
几何标记组件, `<Chart><Geom /></Chart>`。即我们所说的点、线、面这些几何图形。
**Label**
几何标记的辅助文本组件, `<Chart><Geom><Label /></Geom></Chart>`。该组件必须作为`<Geom/>` 的子组
件。
**ToolTip**
提示框组件, `<Chart><Tooltip /></Chart>`。

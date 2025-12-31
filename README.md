# 文本展示实体生成工具

一个[网页](https://c20c01.github.io/TextDisplayGenerator/)，可以比较方便地生成召唤文本展示实体的命令。

## 文本展示实体

![介绍文本展示实体](img/textDisplay.png)

```text
/summon minecraft:text_display ~0 ~0.5 ~-0.49 {text:'["", {"text":"文本展示实体（Text Display）", "color":"dark_green","bold":true}, "\\n\\n于", {"text":"1.19.4", "italic":true,"color":"dark_blue"}, "版本中加入，为展示", {"text":"大量文本", "bold":true,"color":"gold"}, "提供了新的手段。\\n\\n它支持基本的", {"text":"文本效果", "bold":true,"color":"gold"}, "（", {"text":"颜", "color":"dark_red"}, {"text":"色", "color":"light_purple"}, "、", {"text":"粗体", "bold":true}, "、", {"text":"斜体", "italic":true}, "等），同时提供了许多", {"text":"个性化选项", "bold":true,"color":"gold"}, "（", {"text":"背景颜色", "underlined":true,"color":"light_purple"}, "、", {"text":"文本对齐的方式", "underlined":true,"color":"yellow"}, "、", {"text":"整体的缩放", "underlined":true,"color":"aqua"}, "等），适用于公示信息、展示说明等需要大量文本的场景。"]', brightness:{block:15,sky:15}, background:-1778384896, alignment:"left", see_through:true, width:1f, height:1f, view_range:0.5f}
```

从1.12.5开始，文本组件不再使用Json，所以要用下面的命令：

```text
/summon minecraft:text_display ~0 ~0.5 ~-0.49 {text:["", {"text":"文本展示实体（Text Display）", "color":"dark_green","bold":true}, "\n\n于", {"text":"1.19.4", "italic":true,"color":"dark_blue"}, "版本中加入，为展示", {"text":"大量文本", "bold":true,"color":"gold"}, "提供了新的手段。\n\n它支持基本的", {"text":"文本效果", "bold":true,"color":"gold"}, "（", {"text":"颜", "color":"dark_red"}, {"text":"色", "color":"light_purple"}, "、", {"text":"粗体", "bold":true}, "、", {"text":"斜体", "italic":true}, "等），同时提供了许多", {"text":"个性化选项", "bold":true,"color":"gold"}, "（", {"text":"背景颜色", "underlined":true,"color":"light_purple"}, "、", {"text":"文本对齐的方式", "underlined":true,"color":"yellow"}, "、", {"text":"整体的缩放", "underlined":true,"color":"aqua"}, "等），适用于公示信息、展示说明等需要大量文本的场景。"], brightness:{block:15,sky:15}, background:-1778384896, alignment:"left", see_through:true, width:1f, height:1f, view_range:0.5f}
```

## 提示

* 将鼠标悬停在画着点点线的文本上，可以获得对应的提示信息。
* `行宽`为文本的最大宽度，单位长度约为`1/40`格。
* `文本`栏中可以粘贴外部富文本，但可能无法正确生成。
* 自带的富文本编辑器可能无法正确显示复杂文本的实际效果。
* 使用`Unifont`字体可以让`文本`栏的预览效果更加接近实际效果。

![使用Unifont字体](img/unifont.png)

## 其他用法

* 纯色背景：将`文本不透明度`调为`0`，并将`背景颜色`调为所需的颜色。
* 标记点：勾选`隔墙可见`，并将`背景`的不透明度调为`0`，将`固定轴`设为`center`，适当调整`文本不透明度`和`剔除条件`。
* ......

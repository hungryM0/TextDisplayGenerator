function faceTo (deg) {
  if (parseFloat(document.getElementById("yaw").value) === deg) {
    setPitch(0);
  } else {
    setYaw(deg);
  }
}

function fitOnWall () {
  const pitch_input = document.getElementById("pitch");
  if (parseFloat(pitch_input.value) === 0) {
    const x_input = document.getElementById("x");
    const z_input = document.getElementById("z");
    const yaw = document.getElementById("yaw").value % 360;
    const fun = (v, p) => String(Math.floor(parseFloat(v) + 0.5) + (p ? 0.49 : -0.49));
    switch (yaw) {
      case 0:// south
        z_input.value = fun(z_input.value, false);
        break;
      case 90:// west
        x_input.value = fun(x_input.value, true);
        break;
      case 180:// north
        z_input.value = fun(z_input.value, true);
        break;
      case 270:// east
        x_input.value = fun(x_input.value, false);
        break;
    }
  }
}

function resetPos () {
  document.getElementById("x").value = 0;
  document.getElementById("y").value = 0.5;
  document.getElementById("z").value = 0;

  document.getElementById("pitch").value = 0;
  faceTo(0);
}

function setYaw (deg) {
  document.getElementById("yaw").value = deg;
  rotationChanged();
}

function setPitch (deg) {
  document.getElementById("pitch").value = deg;
  rotationChanged();
}

function rotationChanged () {
  const yaw = parseFloat(document.getElementById("yaw").value) % 360;
  const pitch = parseFloat(document.getElementById("pitch").value);
  const buttons = {
    0: document.getElementById("south_button"),
    90: document.getElementById("west_button"),
    180: document.getElementById("north_button"),
    270: document.getElementById("east_button")
  };
  Object.values(buttons).forEach(button => button.disabled = false);
  if (pitch === 0) {
    if (buttons[yaw]) {
      buttons[yaw].disabled = true;
      document.getElementById("on_wall_button").disabled = false;
    }
  } else {
    document.getElementById("on_wall_button").disabled = true;
  }
}

function format_tag (input) {
  input.value = input.value.replace(/[^a-zA-Z0-9_]/g, "");
}

function updateBg () {// 通过取色和透明度更新十六进制颜色
  const alpha = parseInt(document.getElementById("bg_alpha").value);
  const alphaHex = alpha <= 0 ? "00" : alpha >= 255 ? "ff" : alpha.toString(16);
  const colorHex = document.getElementById("bg_color_picker").value;
  document.getElementById("bg_color").value = `#${alphaHex}${colorHex.slice(1)}`;
  updateInputBoxBg();
}

function bgChanged () {// 通过十六进制颜色更新取色和透明度
  const input = document.getElementById("bg_color");
  input.value = input.value.replace(/[^#0-9a-fA-F]/g, "");
  const hexValue = input.value;
  if (hexValue.length === 9 && hexValue.startsWith("#")) {
    document.getElementById("bg_alpha").value = parseInt(hexValue.substring(1, 3), 16);
    document.getElementById("bg_color_picker").value = `#${hexValue.substring(3)}`;
  } else {
    updateBg();
  }
  updateInputBoxBg();
}

function updateInputBoxBg () {
  const argb = document.getElementById("bg_color").value;
  document.getElementById("text_input_area").style.backgroundColor = `#${argb.substring(3) + argb.substring(1, 3)}`;
}

function updateBgSize (zoom) {
  const defaultSize = 172;
  document.getElementById("text_input_box").style.backgroundSize = `${defaultSize * Math.max(0.1, zoom)}px`;
}

function generatePos () {
  const x = document.getElementById("x").value;
  const y = document.getElementById("y").value;
  const z = document.getElementById("z").value;
  return `~${x} ~${y} ~${z}`;
}

function generateNBT () {
  // 文本展示实体的参数，详见(https://zh.minecraft.wiki/w/%E5%B1%95%E7%A4%BA%E5%AE%9E%E4%BD%93)
  const args = [];

  setTextComponentFormater(document.getElementById("mc_version").value);
  const text = new TextNBTGenerator().generate();
  if (text) {
    args.push(textComponentHelper[0](text));
  }

  const light = document.getElementById("light").value;
  if (parseFloat(light) !== -1) {
    args.push(`brightness:{block:${light},sky:${light}}`);
  }

  const scale = document.getElementById("scale").value;
  if (parseFloat(scale) !== 1) {
    args.push(`transformation:[${scale}f,0f,0f,0f,0f,${scale}f,0f,0f,0f,0f,${scale}f,0f,0f,0f,0f,1f]`);
  }

  const background = parseInt(document.getElementById("bg_color").value.substring(1), 16);
  if (background !== 0x40000000) {
    args.push(`background:${background > 0x7fffffff ? background - 0x100000000 : background}`);
  }

  const billboard = document.getElementById("billboard").value;
  if (billboard !== "fixed") {
    args.push(`billboard:"${billboard}"`);
  }

  const alignment = document.getElementById("alignment").value;
  if (alignment !== "center") {
    args.push(`alignment:"${alignment}"`);
  }

  const see_through = document.getElementById("see_through").checked;
  if (see_through) {
    args.push("see_through:true");
  }

  const shadow = document.getElementById("shadow").checked;
  if (shadow) {
    args.push("shadow:true");
  }

  const text_opacity = parseInt(document.getElementById("text_opacity").value);
  if (text_opacity !== 255) {
    args.push(`text_opacity:${text_opacity > 127 ? text_opacity - 256 : text_opacity < 25 ? 25 : text_opacity}`);
  }

  const line_width = document.getElementById("line_width").value;
  if (parseFloat(line_width) !== 200) {
    args.push(`line_width:${line_width}`);
  }

  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  if (parseFloat(width) !== 0 && parseFloat(height) !== 0) {
    args.push(`width:${width}f`);
    args.push(`height:${height}f`);
  }

  const view_range = document.getElementById("view_range").value;
  if (parseFloat(view_range) !== 1) {
    args.push(`view_range:${view_range}f`);
  }

  const rotation_yaw = document.getElementById("yaw").value;
  const rotation_pith = document.getElementById("pitch").value;
  if (parseFloat(rotation_yaw) !== 0 || parseFloat(rotation_pith) !== 0) {
    args.push(`Rotation:[${rotation_yaw}f,${rotation_pith}f]`);
  }

  const tag = document.getElementById("tag").value;
  if (tag !== "") {
    args.push(`Tags:[${tag}]`);
  }

  return `${args.join(", ")}`;
}

function generate () {
  const command = `${commandPrefix} ${generatePos()} {${generateNBT()}}`;
  print(command);
  saveHistory(command);
  window.scrollTo(0, document.body.scrollHeight);
}

function print (command) {
  const text_output = document.getElementById("text_output");
  text_output.value = command;
  text_output.style.color = "white";
}

function copy () {
  const text_output = document.getElementById("text_output");
  const command = text_output.value;
  if (command.startsWith(commandPrefix)) {
    navigator.clipboard.writeText(command).then(() => text_output.style.color = "gray");
  }
}

// 文本转换====================================================
class Text {
  static bold = "b";
  static italic = "i";
  static underlined = "u";
  static strikethrough = "s";

  constructor (content, styles = []) {
    this.content = content;
    this.styles = styles;
  }

  tryToMerge (other) {
    if (this.styles.length !== other.styles.length) {
      return false;
    }
    if (this.styles.sort().join() !== other.styles.sort().join()) {
      return false;
    }
    this.content += other.content;
    return true;
  }

  get formattedText () {
    const args = this.#formattedArgs;
    return args ? `{"text":"${this.content}", ${args}}` : `"${this.content}"`;
  }

  get #formattedArgs () {
    const args = [];
    for (const style of this.styles) {
      switch (style) {
        case Text.bold:
          args.push("\"bold\":true");
          break;
        case Text.italic:
          args.push("\"italic\":true");
          break;
        case Text.underlined:
          args.push("\"underlined\":true");
          break;
        case Text.strikethrough:
          args.push("\"strikethrough\":true");
          break;
        default:
          if (style.startsWith("#")) {
            args.push(`"color":"${commonColorNames[style] || style}"`);
            break;
          }
          if (style.startsWith("rgb(")) {
            const rgb = style.substring(4, style.length - 1).split(",");
            args.push(`"color":"#${rgb.map(v => parseInt(v).toString(16).padStart(2, "0")).join("")}"`);
            break;
          }
      }
    }
    return args.length === 0 ? null : `${args.join(",")}`;
  }
}

class TextNBTGenerator {
  constructor () {
    this.texts = [];
    this.currentStyles = [];
    this.hadContent = false;
    this.newLine = false;
  }

  #onTagStart (node) {
    switch (node.tagName) {
      case "B":
      case "STRONG":
        this.currentStyles.push(Text.bold);
        break;
      case "I":
      case "EM":
        this.currentStyles.push(Text.italic);
        break;
      case "U":
        this.currentStyles.push(Text.underlined);
        break;
      case "STRIKE":
        this.currentStyles.push(Text.strikethrough);
        break;
      case "FONT":
        this.currentStyles.push(node.color);
        break;
      case "SPAN":
        this.currentStyles.push(node.style.color);
        break;
      case "DIV":
        this.newLine = this.hadContent;
        this.hadContent = false;
        break;
    }
  }

  #onTagEnd (node) {
    this.currentStyles.pop();
    if (node.tagName === "DIV") {
      this.newLine = this.hadContent;
    }
  }

  #addText (s) {
    const text = new Text(s, [...this.currentStyles]);
    if (this.texts.length === 0 || !this.texts[this.texts.length - 1].tryToMerge(text)) {
      this.texts.push(text);
    }
  }

  #onInput () {
    this.hadContent = true;
    if (this.newLine) {
      this.newLine = false;
      this.#addText(textComponentHelper[2]);
    }
  }

  #onTextInput (text) {
    this.#onInput();
    this.#addText(textComponentHelper[1](text));
  }

  #onBrInput () {
    this.#onInput();
    this.newLine = true;
  }

  #handleNode (node) {
    if (node.childNodes.length === 0) {
      if (node.nodeType === 3) {
        this.#onTextInput(node.textContent);
        return;
      }
      if (node.tagName === "BR") {
        this.#onBrInput();
      }
    } else {
      this.#onTagStart(node);
      for (const child of node.childNodes) {
        this.#handleNode(child);
      }
      this.#onTagEnd(node);
    }
  }

  get #formattedText () {
    if (this.texts.length === 0) {
      return "";
    }
    if (this.texts.length === 1) {
      return this.texts[0].formattedText;
    }
    if (this.texts[0].styles.length !== 0) {
      return `["", ${this.texts.map(text => text.formattedText).join(", ")}]`;
    } else {
      return `[${this.texts.map(text => text.formattedText).join(", ")}]`;
    }
  }

  generate () {
    for (const node of editor.input.childNodes) {
      this.#handleNode(node);
    }
    return this.#formattedText;
  }
}

// 文本编辑====================================================
class PoorTextEditor {
  constructor () {
    this.colorPicker = document.getElementById("text_color_picker");
    this.input = document.getElementById("text_input");
    this.input.addEventListener("keydown", (event) => this.handleInput(event));
  }

  setStyle (key, value) {
    this.input.style[key] = value;
  }

  setTextOpacity (value) {
    const opacity = value / 255;
    this.setStyle("opacity", String(opacity <= 0.1 ? 0 : opacity));
  }

  handleInput (event) {
    if (!event.ctrlKey) return;
    if (event.key === "s") {
      event.preventDefault();
      this.handleCommand("strikethrough");
    }
    if (event.key === "d") {
      event.preventDefault();
      this.color();
    }
  }

  handleCommand (command, value = null) {
    // noinspection JSDeprecatedSymbols
    document.execCommand(command, false, value);
  }

  color () {
    this.handleCommand("foreColor", this.colorPicker.value);
  }

  wash () {
    this.handleCommand("foreColor", "white");
  }

  clear () {
    const range = document.createRange();
    range.selectNodeContents(this.input);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.handleCommand("delete");
    this.input.innerHTML = "";
  }
}

// 网页初始化====================================================
const commonColorNames = {
  "#000000": "black",
  "#0000aa": "dark_blue",
  "#00aa00": "dark_green",
  "#00aaaa": "dark_aqua",
  "#aa0000": "dark_red",
  "#aa00aa": "dark_purple",
  "#ffaa00": "gold",
  "#aaaaaa": "gray",
  "#555555": "dark_gray",
  "#5555ff": "blue",
  "#55ff55": "green",
  "#55ffff": "aqua",
  "#ff5555": "red",
  "#ff55ff": "light_purple",
  "#ffff55": "yellow",
  "#ffffff": "white"
};
const commandPrefix = "/summon minecraft:text_display";
const editor = new PoorTextEditor();

let textComponentHelper; // [0]: 组件包装函数，[1]: 内容转义函数，[2]: 换行符

function summonTextCommonColor () {
  const textCommonColor = document.getElementById("text_common_color");
  for (const [color, name] of Object.entries(commonColorNames)) {
    const box = document.createElement("div");
    box.className = "color_box";
    box.title = name;
    box.style.backgroundColor = color;
    box.addEventListener("click", () => {
      document.getElementById("text_color_picker").value = color;
    });
    textCommonColor.appendChild(box);
  }
}

function setTextComponentFormater (key) {
  switch (key) {
    case "1.21.5-":
      textComponentHelper = [(t) => `text:'${t}'`, (t) => t.replace(/\\/g, "\\\\\\\\").replace(/'/g, "\\'").replace(/"/g, "\\\\\""), "\\\\n"];
      break;
    case "1.21.5+":
      textComponentHelper = [(t) => `text:${t}`, (t) => t.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "\\\""), "\\n"];
      break;
  }
}

summonTextCommonColor();
setYaw(0);
updateBg();
updateBgSize(1);

// 历史记录管理====================================================
function getFormParams() {
  return {
    x: document.getElementById("x").value,
    y: document.getElementById("y").value,
    z: document.getElementById("z").value,
    yaw: document.getElementById("yaw").value,
    pitch: document.getElementById("pitch").value,
    width: document.getElementById("width").value,
    height: document.getElementById("height").value,
    view_range: document.getElementById("view_range").value,
    alignment: document.getElementById("alignment").value,
    billboard: document.getElementById("billboard").value,
    scale: document.getElementById("scale").value,
    line_width: document.getElementById("line_width").value,
    light: document.getElementById("light").value,
    tag: document.getElementById("tag").value,
    see_through: document.getElementById("see_through").checked,
    shadow: document.getElementById("shadow").checked,
    bg_color: document.getElementById("bg_color").value,
    text_opacity: document.getElementById("text_opacity").value,
    mc_version: document.getElementById("mc_version").value
  };
}

function setFormParams(params) {
  if (!params) return;
  document.getElementById("x").value = params.x ?? 0;
  document.getElementById("y").value = params.y ?? 0.5;
  document.getElementById("z").value = params.z ?? 0;
  document.getElementById("yaw").value = params.yaw ?? 0;
  document.getElementById("pitch").value = params.pitch ?? 0;
  document.getElementById("width").value = params.width ?? 1;
  document.getElementById("height").value = params.height ?? 1;
  document.getElementById("view_range").value = params.view_range ?? 0.5;
  document.getElementById("alignment").value = params.alignment ?? "left";
  document.getElementById("billboard").value = params.billboard ?? "fixed";
  document.getElementById("scale").value = params.scale ?? 1;
  document.getElementById("line_width").value = params.line_width ?? 200;
  document.getElementById("light").value = params.light ?? 15;
  document.getElementById("tag").value = params.tag ?? "";
  document.getElementById("see_through").checked = params.see_through ?? false;
  document.getElementById("shadow").checked = params.shadow ?? false;
  document.getElementById("bg_color").value = params.bg_color ?? "#40000000";
  document.getElementById("text_opacity").value = params.text_opacity ?? 255;
  document.getElementById("mc_version").value = params.mc_version ?? "1.21.5+";
  // 更新相关UI
  bgChanged();
  rotationChanged();
  updateBgSize(1 / parseFloat(params.scale ?? 1));
  editor.setStyle('textAlign', params.alignment ?? "left");
  editor.setTextOpacity(params.text_opacity ?? 255);
}

function saveHistory(command) {
  const inputHtml = editor.input.innerHTML;
  if (!inputHtml.trim()) return;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = inputHtml;
  document.body.appendChild(tempDiv);
  const textContent = tempDiv.innerText;
  document.body.removeChild(tempDiv);
  
  const history = {
    id: Date.now(),
    previewText: textContent,
    html: inputHtml,
    params: getFormParams(),
    command: command
  };
  
  const historyList = getHistoryList();
  historyList.unshift(history);
  localStorage.setItem('textDisplayHistory', JSON.stringify(historyList));
  loadHistoryList();
}

function getHistoryList() {
  const data = localStorage.getItem('textDisplayHistory');
  return data ? JSON.parse(data) : [];
}

function loadHistoryList() {
  const historyList = getHistoryList();
  const container = document.getElementById('history_list');
  if (!container) return;
  
  container.innerHTML = '';
  historyList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history_item';
    
    const preview = document.createElement('div');
    preview.className = 'history_preview collapsed';
    preview.innerHTML = item.html || '';
    
    const btnExpand = document.createElement('button');
    btnExpand.className = 'expand_btn';
    btnExpand.textContent = '展开全部';
    btnExpand.style.display = 'none';
    btnExpand.onclick = () => {
      const isCollapsed = preview.classList.toggle('collapsed');
      btnExpand.textContent = isCollapsed ? '展开全部' : '收起';
    };
    
    const btnRestore = document.createElement('button');
    btnRestore.textContent = '恢复';
    btnRestore.onclick = () => restoreFromHistory(item.id);
    
    const btnDelete = document.createElement('button');
    btnDelete.textContent = '删除';
    btnDelete.onclick = () => deleteHistory(item.id);
    
    div.appendChild(preview);
    div.appendChild(btnExpand);
    div.appendChild(btnRestore);
    div.appendChild(btnDelete);
    container.appendChild(div);
    
    // 检查是否需要展开按钮
    if (preview.scrollHeight > preview.clientHeight) {
      btnExpand.style.display = '';
    }
  });
}

function restoreFromHistory(id) {
  const historyList = getHistoryList();
  const item = historyList.find(h => h.id === id);
  if (item) {
    // 恢复左侧参数
    setFormParams(item.params);
    // 使用 execCommand 支持撤销
    editor.input.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertHTML', false, item.html);
    // 使用保存的命令
    if (item.command) {
      print(item.command);
    }
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function deleteHistory(id) {
  const historyList = getHistoryList();
  const filtered = historyList.filter(h => h.id !== id);
  localStorage.setItem('textDisplayHistory', JSON.stringify(filtered));
  loadHistoryList();
}

function clearAllHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    localStorage.removeItem('textDisplayHistory');
    loadHistoryList();
  }
}

window.addEventListener('load', loadHistoryList);

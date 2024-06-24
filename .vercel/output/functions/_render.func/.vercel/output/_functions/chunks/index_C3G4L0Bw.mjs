/* empty css                         */
import { p as createComponent, q as renderTemplate, s as maybeRenderHead, t as spreadAttributes, u as addAttribute, v as renderComponent, w as createAstro, x as unescapeHTML, F as Fragment, z as renderHead, B as renderSlot } from './astro/server_BsFHC7v3.mjs';
import { $ as $$Image } from './_astro_assets_7wbpKPGR.mjs';


const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});

const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});

function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}

function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}

function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}

function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse(name);
  tree.forEach(parse);
  return mergeIconData(data, currentProps);
}
function getIconData(data, name) {
  if (data.icons[name]) {
    return internalGetIconData(data, name, []);
  }
  const tree = getIconsTree(data, [name])[name];
  return tree ? internalGetIconData(data, name, tree) : null;
}

const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}

function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}

const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro$1 = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
    }
  }
  const req = Astro2.request;
  const { name = "", title, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "xlink:href")}></use> ` })}`} </svg>`;
}, "/home/toni/astro-invertifast/node_modules/.pnpm/astro-icon@1.1.0/node_modules/astro-icon/components/Icon.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const navItems = [
    { title: "Nosotros", url: "#nosotros" },
    { title: "Propuesta", url: "#propuesta" },
    { title: "Galeria", url: "#galeria" },
    { title: "Preguntas frecuentes", url: "#preguntas" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 bg-default text-white" id="page-header" data-astro-cid-j2devmb2> <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4" data-astro-cid-j2devmb2> <ul class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4" data-astro-cid-j2devmb2> <li data-astro-cid-j2devmb2> <a class="flex items-center gap-3 hover:!text-default" href="/" data-astro-cid-j2devmb2> <h1 class="sr-only" data-astro-cid-j2devmb2>Invertefast</h1> ${renderComponent($$result, "Icon", $$Icon, { "name": "logomark", "class": "h-10 w-36", "data-astro-cid-j2devmb2": true })} </a> </li> <li data-astro-cid-j2devmb2> <button id="open-nav-button" type="button" class="btn sm:hidden" aria-label="Navigation" data-astro-cid-j2devmb2> ${renderComponent($$result, "Icon", $$Icon, { "name": "mdi:menu", "class": "size-8", "data-astro-cid-j2devmb2": true })} </button> </li> <li class="hidden md:flex" data-astro-cid-j2devmb2> <ul class="flex space-x-5" data-astro-cid-j2devmb2> ${navItems.map(({ title, url }) => renderTemplate`<li data-astro-cid-j2devmb2> <a class="hover:border-b hover:border-primary hover:text-primary"${addAttribute(url, "href")} data-astro-cid-j2devmb2> ${title} </a> </li>`)} </ul> </li> </ul> <div id="menu-modal" class="modal hidden" aria-hidden="true" data-astro-cid-j2devmb2> <div class="fixed inset-0 bg-default px-8 py-4 text-default" data-astro-cid-j2devmb2> <div class="space-y-4" role="dialog" aria-modal="true" data-astro-cid-j2devmb2> <header class="text-right" data-astro-cid-j2devmb2> <button id="close-nav-button" type="button" class="btn" aria-label="Close navigation" data-astro-cid-j2devmb2> ${renderComponent($$result, "Icon", $$Icon, { "name": "mdi:close", "class": "size-8 text-white", "data-astro-cid-j2devmb2": true })} </button> </header> <div class="justify-center" data-astro-cid-j2devmb2> ${renderComponent($$result, "Icon", $$Icon, { "name": "logomark", "class": "h-10 w-36", "data-astro-cid-j2devmb2": true })} </div> <nav data-astro-cid-j2devmb2> <ul class="flex flex-col" data-astro-cid-j2devmb2> ${navItems.map(({ title, url }) => renderTemplate`<li data-astro-cid-j2devmb2> <a class="text-white"${addAttribute(url, "href")} data-astro-cid-j2devmb2> ${title} </a> </li>`)} </ul> </nav> </div> </div> </div> </nav> </header>  <noscript> <style>
    #open-nav-button {
      display: none;
    }
  </style> </noscript> `;
}, "/home/toni/astro-invertifast/src/components/shared/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-default"> <h2 id="footer-heading" class="sr-only">Footer</h2> <div class="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32"> <div class="space-global flex flex-col justify-between lg:flex-row"> <div class="space-y-8"> <a class="flex items-center gap-3 hover:!text-default" href="/"> <h1 class="sr-only">Invertefast</h1> ${renderComponent($$result, "Icon", $$Icon, { "name": "logomark", "class": "h-10 w-36" })} </a> <p class="leading-6 text-gray-300 text-sm">
INMOBILIARIA HUERTAS GRUPO INV. S.R.L. <br> 20601000939 <br> Calle
          Luis Espejo 1097 Int. 802 Urb. Santa Catalina, La Victoria 15034
</p> <div class="flex flex-col items-start gap-4 text-gray-300 text-sm"> <a href="mailto:contacto@invertifast.pe" class="border-b hover:text-primary" target="_blank" rel="noopener noreferrer">
contacto@invertifast.pe
</a> <a href="https://api.whatsapp.com/send?phone=51945743060&text=Hola%20Invertifast" class="border-b hover:text-primary" target="_blank" rel="noopener noreferrer">
+51 945 743 060
</a> </div> </div> <div class="space-y-8"> <p class="max-w-xl leading-6 text-gray-300 text-sm">
InvertiFast es una alternativa de inversión aprobada por Inversiones
          IO, una plataforma de financiamiento que opera bajo la estricta
          supervisión de la Sociedad de Mercados de Valores (SMV). Esta
          regulación garantiza que todas nuestras operaciones cumplen con los
          más altos estándares de transparencia y seguridad. Además, cuenta con
          el sólido respaldo de Huertas Inmobiliaria, una empresa con amplia
          trayectoria y reconocimiento en el sector inmobiliario. Este apoyo no
          solo refuerza nuestra estabilidad financiera, sino que también nos
          permite ofrecer oportunidades de inversión con un alto potencial de
          rentabilidad y crecimiento.
</p> </div> </div> <div class="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24"> <p class="leading-5 text-gray-400 text-xs">
&copy; 2024 Invertifast. Todos los derechos reservados.
<strong> | Hecho por Agencia Belmont </strong> </p> </div> </div> </footer>`;
}, "/home/toni/astro-invertifast/src/components/shared/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="es" data-astro-cid-sckkx6r4> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description" content="Descripción de tu sitio web"><meta name="keywords" content="palabras, clave, relacionadas, con, tu, sitio"><meta name="author" content="Tu Nombre"><title>Invertifast - Invierte en tu futuro</title>${renderHead()}</head> <body class="bg-default text-default text-base selection:bg-secondary selection:text-white" data-astro-cid-sckkx6r4>  ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-sckkx6r4": true })} <main data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-sckkx6r4": true })}  </body> </html>`;
}, "/home/toni/astro-invertifast/src/layouts/Layout.astro", void 0);

const heroImage = new Proxy({"src":"/_astro/hero-image.Xy4JM3UD.webp","width":1200,"height":800,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/toni/astro-invertifast/src/assets/hero-image.webp";
							}
							
							return target[name];
						}
					});

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="bg-img-wape section_height flex items-start justify-start" data-astro-cid-anhloy43> <div class="space-global mx-auto flex max-w-7xl flex-col items-center justify-center space-y-5 overflow-hidden text-center lg:flex-row lg:items-center lg:justify-between" data-astro-cid-anhloy43> <div class="flex flex-col space-y-5 lg:max-w-lg lg:text-left" data-astro-cid-anhloy43> <h1 data-aos="fade-up" data-aos-delay="300" class="font-extrabold leading-10 text-white text-4xl sm:leading-none sm:text-5xl" data-astro-cid-anhloy43>
Tu camino hacia un futuro
<br data-astro-cid-anhloy43> <span class="text-primary" data-astro-cid-anhloy43>Financiero seguro.</span> </h1> <p class="text-white text-lg" data-aos="fade-right" data-aos-delay="400" data-astro-cid-anhloy43>
Ofrecemos soluciones personalizadas y estratégicas financieras
        innovadoras diseñadas para maximizar el rendimiento de tu inversión.
</p> <div class="mt-6 flex justify-center space-x-4 sm:mt-8 lg:justify-start" data-astro-cid-anhloy43> <a href="#proximamente" class="hover:bg-primary-dark flex items-center justify-center rounded-md bg-primary px-6 py-3 font-bold uppercase text-secondary text-base" data-aos="zoom-in-down" data-aos-delay="300" data-astro-cid-anhloy43>
Invierte ahora
</a> </div> </div> <figure class="mt-10 lg:ml-10 lg:mt-0" data-aos="zoom-out" data-aos-delay="600" data-astro-cid-anhloy43> ${renderComponent($$result, "Image", $$Image, { "src": heroImage, "alt": "Invertifast - Inversiones inteligentes", "class": "w-full max-w-xl rounded-lg shadow-lg", "data-astro-cid-anhloy43": true })} </figure> </div> </section> `;
}, "/home/toni/astro-invertifast/src/components/sections/Hero.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ` })}`;
}, "/home/toni/astro-invertifast/src/pages/index.astro", void 0);

const $$file = "/home/toni/astro-invertifast/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
// Custom Scripts
// Мобильное меню бургер
function burgerMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const body = document.querySelector("body");
  const navBtns = document.querySelector(".navbar__btns");

  burger.addEventListener("click", () => {
    if (!menu.classList.contains("active")) {
      menu.classList.add("active");
      burger.classList.add("active");
      body.classList.add("locked");
      navBtns.classList.add("active");
    } else {
      menu.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
      navBtns.classList.remove("active");
    }
  });
  // Вот тут мы ставим брейкпоинт навбара
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768.98) {
      menu.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
      navBtns.classList.remove("active");
    }
  });
}
burgerMenu();

// Select
const getTemplate = (data = [], placeholder, selectedId, withImg) => {
  let text = placeholder ?? "";

  const items = data.map((item) => {
    let cls = "";

    if (item.id === selectedId) {
      text = item.value;
      cls = "selected";
    }

    if (withImg) {
      return `
            <li class="select__item ${cls}" data-type="item" data-id="${item.id}">
                <img src="./img/select/${item.image}" class="select__img" />
                ${item.value}
            </li>
        `;
    }

    return `
            <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
        `;
  });

  if (withImg) {
    return `
            <input type="hidden" class="hidden__input">
            <div class="select__backdrop" data-type="backdrop"></div>
            <div class="select__input" data-type="input">
                <img class="select__img" src="./img/select/${selectedId}.png"/>
                <span data-type="value">${text}</span>
                <img src="./img/down-arrow.svg" alt="arrow" data-type="arrow" class="select__arrow">
            </div>
            <div class="select__dropdown">
                <ul class="select__list">
                    ${items.join("")}
                </ul>
            </div>
        `;
  }

  return `
        <input type="hidden" class="hidden__input">
        <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
            <span data-type="value">${text}</span>
            <img src="./img/down-arrow.svg" alt="arrow" data-type="arrow" class="select__arrow">
        </div>
        <div class="select__dropdown">
            <ul class="select__list">
                ${items.join("")}
            </ul>
        </div>
    `;
};
class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = options.selectedId;
    this.render();
    this.setup();
  }

  render() {
    const { placeholder, data, withImg } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(
      data,
      placeholder,
      this.selectedId,
      withImg
    );
  }
  setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);
    this.$arrow = this.$el.querySelector('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }

  clickHandler(event) {
    const { type } = event.target.dataset;

    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      const id = event.target.dataset.id;

      this.select(id);
    } else if (type === "backdrop") {
      this.close();
    }
  }

  get isOpen() {
    return this.$el.classList.contains("open");
  }

  get current() {
    return this.options.data.find((item) => item.id === this.selectedId);
  }

  select(id) {
    this.selectedId = id;
    this.$value.textContent = this.current.value;

    this.$el
      .querySelectorAll(`[data-type="item"]`)
      .forEach((el) => el.classList.remove("selected"));
    this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected");

    // [ENG] If you are using not png just replace down png on type what you need
    // [RU] Если используете другой формат то просто нужно изменить ниже png на нужный формат
    if (this.options.withImg === true) {
      this.$el.querySelector(
        `.select__img`
      ).src = `./img/select/${this.selectedId}.png`;
    }

    this.options.onSelect ? this.options.onSelect(this.current) : null;
    this.close();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add("open");
    this.$arrow.classList.add("open");
  }

  close() {
    this.$el.classList.remove("open");
    this.$arrow.classList.remove("open");
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = "";
  }
}
// Select Init
const selectLang = new Select("#select", {
  // [ENG] Placeholder
  placeholder: "EN",

  // [ENG] If you need image set this option to true
  // [RU] Если нужно изображение то измините параметр false на true
  withImg: false,

  // [ENG] Required if withImg === true
  // [ENG] selectedId must be === image

  // [RU] Обязательный параметр если withImg === true
  // [RU] selectedId должен быть равен полю image
  // selectedId: 'En',
  data: [
    {
      // [ENG] Option id
      id: "En",
      // [ENG] Image fullname (if yon don't use png type you will need to change method select() path to img)
      // [RU] Имя изображения (если используется формат не png то нужно в классе Select(выше в коде) -> и методе select() изменить путь к картинке )
      image: "En.png",
      // [ENG] Text content
      // [RU] Отображаемый текст
      value: "EN",
    },
    {
      // [ENG] Option id
      id: "Ua",
      // [ENG] Image fullname (if yon don't use png type need to change method select() path to img)
      // [RU] Имя изображения (если используется формат не png то нужно в классе Select(выше в коде) -> и методе select() изменить путь к картинке )
      image: "Es.png",
      // [ENG] Text content
      // [RU] Отображаемый текст
      value: "UA",
    },
  ],
  onSelect(item) {
    // [ENG] Form logic after choosing option
    // [RU] Обработка формы после выбора
    document.querySelector(".hidden__input").value = item.value;
    console.log(item.value);
  },
});

// Аккордеон
function accordion() {
  const items = document.querySelectorAll(".accordion__item-trigger");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const parent = item.parentNode;
      if (parent.classList.contains("accordion__item-active")) {
        parent.classList.remove("accordion__item-active");
      } else {
        document
          .querySelectorAll(".accordion__item")
          .forEach((child) => child.classList.remove("accordion__item-active"));
        parent.classList.add("accordion__item-active");
      }
    });
  });
}
accordion();

// Pricing Switch

function pricingSwitch() {
  const switchItem = document.querySelector(".pricing__switcher-switch");
  const switchText = document.querySelectorAll(".pricing__switcher-text");

  const oldPrice = document.querySelectorAll(".pricing__oldprice");
  const curentPrice = document.querySelectorAll(".pricing__curentprice");
  const priceTime = document.querySelectorAll(".pricing__main-year");
  const lastListPrice = document.querySelector(".pricing__last-list");
  const lastListPriceItem = Array.from(lastListPrice.children);
  const activeItem = lastListPriceItem.filter((el) =>
    el.classList.contains("active")
  );

  const curentPriceMonth = [55.99, 193.99];
  const curentPriceYear = [540.99, 1899.99];
  const oldPriceMonth = [119.99, 249.99];
  const oldPriceYear = [841.99, 2230.99];

  switchItem.addEventListener("click", function () {
    const switchRount = this.children[0];
    if (switchRount.classList.contains("active")) {
      switchRount.classList.remove("active");
      switchText[0].classList.add("active");
      switchText[1].classList.remove("active");
      oldPrice.forEach(
        (element, index) => (element.textContent = `${oldPriceMonth[index]}$`)
      );
      curentPrice.forEach(
        (element, index) =>
          (element.innerHTML = `${curentPriceMonth[index]}$ <span>/mo</span>`)
      );
      priceTime.forEach((el) => (el.textContent = "1 month"));
      activeItem.forEach((el) => el.classList.add("active"));
    } else {
      switchRount.classList.add("active");
      switchText[0].classList.remove("active");
      switchText[1].classList.add("active");
      oldPrice.forEach(
        (element, index) => (element.textContent = `${oldPriceYear[index]}$`)
      );
      curentPrice.forEach(
        (element, index) =>
          (element.innerHTML = `${curentPriceYear[index]}$ <span>/ye</span>`)
      );
      priceTime.forEach((el) => (el.textContent = "1 year"));
      activeItem.forEach((el) => el.classList.remove("active"));
    }
  });
}

pricingSwitch();


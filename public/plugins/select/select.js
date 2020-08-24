const getTemplate = (data = [], selectedValue, nullable) => {
  let text = nullable;
  let value = "";
  const items = data.map((item) => {
    let clas = "";
    if (item.value === selectedValue) {
      text = item.text ?? item.value;
      value = item.value;
      clas = "selected";
    }
    return `
    <li class="select__item ${clas}" data-type="item" 
    data-value="${item.value}">${item.text ?? item.value}</li>`;
  });
  if (nullable !== undefined) {
    items.unshift(`
      <li class="select__item ${
        selectedValue ? "" : "selected"
      }" data-type="item"  data-value="">${nullable}</li>
    `);
  }

  return ` 
  <div class="select__backdrop" data-type="backdrop"></div>
  <div class="select__input" data-type='input'>
  <span data-type="value" data-value="${value}">${text}</span>
  <i class="fa fa-chevron-down" data-type='arrow'></i>
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
    this.selectedValue = options.selectedValue;
    this.#render();
    this.#setup();
    const input = this.$el.querySelector(".select__input span");
    Object.defineProperty(this.$el, "value", {
      get: () => input.dataset.value,
      set: (value) => {
        const option = this.$el.querySelector(`[data-value="${value}"]`);
        if (!option) {
          return false;
        }
        this.select(option);
      },
    });
  }

  #render() {
    const { data, nullable } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, this.selectedValue, nullable);
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);
    this.$arrow = this.$el.querySelector('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }

  clickHandler(e) {
    const { type } = e.target.dataset;

    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      this.select(e.target);
      this.close();
    } else if (type === "backdrop") {
      this.close();
    }
  }

  get isOpen() {
    return this.$el.classList.contains("open");
  }

  select($option) {
    this.$value.innerText = $option.innerText;
    this.$value.dataset.value = $option.dataset.value;
    this.$el.querySelectorAll('[data-type="item"]').forEach((item) => {
      item.classList.remove("selected");
    });
    $option.classList.add("selected");
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add("open");
    this.$arrow.classList.remove("fa-chevron-down");
    this.$arrow.classList.add("fa-chevron-up");
  }

  close() {
    this.$el.classList.remove("open");
    this.$arrow.classList.add("fa-chevron-down");
    this.$arrow.classList.remove("fa-chevron-up");
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = "";
  }
}

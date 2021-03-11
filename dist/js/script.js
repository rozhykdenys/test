const checkInput = (function(){
  const btn = document.querySelector('.filter__form-btn'),
        inputValue = document.querySelector('.filter__form-inpt');

        inputValue.addEventListener('input', () => {
          if(inputValue.value.length !== 0){
            btn.removeAttribute('disabled');
          }else{
            btn.setAttribute('disabled', 'disabled');
          }
        });
}());


const multiItemSlider = (function () {
  return function (selector, config) {
    
    const  mainElement = document.querySelector(selector), // основный элемент блока
           sliderWrapper = mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
           sliderItems = mainElement.querySelectorAll('.slider__item'); // элементы (.slider-item)

    let  wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width), // ширина обёртки
         itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width), // ширина одного элемента    
         positionLeftItem = 0, // позиция левого активного элемента
         transform = 0, // значение транфсофрмации .slider_wrapper
         step = itemWidth / wrapperWidth * 100, // величина шага (для трансформации)
         items = [], // массив элементов
         interval = 0,
         configuration = {
            isCycling: false, // автоматическая смена слайдов
            direction: 'right', // направление смены слайдов
            interval: 5000 // интервал между автоматической сменой слайдов
          };

    for (let key in config) {
      if (key in configuration) {
        configuration[key] = config[key];
      }
    }

    // наполнение массива _items
    sliderItems.forEach((item, index) => {
      items.push({ item: item, position: index, transform: 0 });
    });

    const position = {
      getItemMin() {
        let indexItem = 0;
        items.forEach((item, index) => {
          if (item.position < items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax() {
        let indexItem = 0;
        items.forEach((item, index) => {
          if (item.position > items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin() {
        return items[position.getItemMin()].position;
      },
      getMax() {
        return items[position.getItemMax()].position;
      }
    }

    function transformItem(direction) {
      let nextItem;
      if (direction === 'right') {
        positionLeftItem++;
        if ((positionLeftItem + wrapperWidth / itemWidth - 1) > position.getMax()) {
          nextItem = position.getItemMin();
          items[nextItem].position = position.getMax() + 1;
          items[nextItem].transform += items.length * 100;
          items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
        }
        transform -= step;
      }
      if (direction === 'left') {
        positionLeftItem--;
        if (positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          items[nextItem].position = position.getMin() - 1;
          items[nextItem].transform -= items.length * 100;
          items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
        }
        transform += _step;
      }
      sliderWrapper.style.transform = 'translateX(' + transform + '%)';
    }

    function cycle(direction) {
      if (!configuration.isCycling) {
        return;
      }
      interval = setInterval(() => {
        transformItem(direction);
      }, configuration.interval);
    }

    // инициализация
    
    cycle(configuration.direction);

    return {
      right() { // метод right
        transformItem('right');
      },
      left(){ // метод left
        transformItem('left');
      },
      stop() { // метод stop
        configuration.isCycling = false;
        clearInterval(interval);
      },
      cycle() { // метод cycle 
        configuration.isCycling = true;
        clearInterval(interval);
        cycle();
      }
    }

  }
}());

const slider = multiItemSlider('.slider__block', {
  isCycling: true
})
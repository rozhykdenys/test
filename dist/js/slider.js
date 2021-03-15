const multiItemSlider = (function () {
    return function (selector, config) {
      
      const  mainElement = document.querySelector(selector), // main item 
             sliderWrapper = mainElement.querySelector('.slider__wrapper'), // wrapper for .slider-item
             sliderItems = mainElement.querySelectorAll('.slider__item'); // elements (.slider-item)
  
      let  wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width), // wrapper width
           itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width), // single width  
           positionLeftItem = 0, // position of left active element
           transform = 0, // transformation .slider_wrapper
           step = itemWidth / wrapperWidth * 100, // step
           items = [], 
           interval = 0,
           configuration = {
              isCycling: false, // automatic slider change
              direction: 'right', // direction
              interval: 5000 // inreval
            };
  
      for (let key in config) {
        if (key in configuration) {
          configuration[key] = config[key];
        }
      }
  
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
  
      // initionalidation
      
      cycle(configuration.direction);
  
      return {
        right() { // method right
          transformItem('right');
        },
        left(){ // method left
          transformItem('left');
        },
        stop() { // method stop
          configuration.isCycling = false;
          clearInterval(interval);
        },
        cycle() { // method cycle 
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
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

        btn.addEventListener('click', (e) => {
          e.preventDefault();

          inputValue.value = '';
          btn.setAttribute('disabled', 'disabled');
        })
}());

function pagination(products, allItems){
    const pagination = document.querySelectorAll('.catalogue__pagination')[0],
          count = 8;//products on page
    let pageNum = 1,//page start
        countPages = Math.ceil(products.length / count),//count of pages
        liButtons = [];
    
    console.log('pages: '+ countPages + ': products length: ' + products.length);
  
    //create buttons
    for (let page of [...document.querySelectorAll(".catalogue__pagination-item")]) {
      page.remove();
    }
  
    for (let i = 1; i <= countPages; i++) {
      const li = document.createElement("li");
      li.classList.add("catalogue__pagination-item");
      li.innerHTML = i;
      pagination.appendChild(li);
      liButtons.push(li);
    }
  
    //fill pages
  
    //clear
    function fillPage(pageNum) {
      for (let clr1 of [...allItems.children]) {
        clr1.classList.remove("hide-pagin");
        clr1.classList.remove("show-pagin");
      }
  
      for(let singleLi of liButtons){
          if ([...singleLi.classList].includes('active-page')){
              singleLi.classList.remove('active-page')
          }
      }
  
      let start = (pageNum - 1) * count,
          end = start + count;
  
          let strNote = [...products].slice(0, start),
              delNote = [...products].slice(end),
              notes = [...products].slice(start, end);
          
          
        for (let note of notes) {
       
        if (![...note.classList].includes("hide")) {
            note.classList.remove("hide-pagin");
            note.classList.add("show-pagin");
          }
              }
          for (let del of delNote) {
            del.classList.remove("show-pagin");
            del.classList.add("hide-pagin");
          }
          for (let str of strNote) {
            str.classList.remove("show-pagin");
            str.classList.add("hide-pagin");
          }
          let currentPage = liButtons[pageNum - 1];
          currentPage.classList.add("active-page");
     
    }
    fillPage(pageNum);
  
    //click events
    for (let li of liButtons) {
      li.addEventListener("click", () => {
        pageNum = +li.innerHTML;
        fillPage(pageNum);
      });
    }
  }

  function parentNode(buttons){
    buttons.forEach(item => item.addEventListener('click', function(){
      console.log(this.parentNode.parentNode.parentNode);
      this.parentNode.parentNode.parentNode.remove(this);
    }))
  }
  

const makeProducts = (function(){
  class CardItem {
    constructor(src, alt, title, price, parent, ...classess){
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.price = price;
      this.parent = document.querySelector(parent);
      this.classess = classess;
    }
    render(){
      const elem = document.createElement('div');
      elem.classList.add('catalogue__item', 'show');
  
      elem.innerHTML = `
                        <div class="catalogue__item-img">
                            <div class="catalogue__item-picture">
                                <img src="${this.src}" alt="${this.alt}">
                            </div>
                            <div class="catalogue__item-hiden active_item">
                                <button class="button">remove from list</button>
                            </div>
                        </div>
                        <div class="catalogue__item-text catalogue__item-text--active">
                            <div class="catalogue__item-text--info">
                                <h3 class='title_item'>${this.title}</h3>
                                <p>$${this.price}</p>
                            </div>
                            <div class="catalogue__item-text--buttons">
                                <button class="catalogue__item-text--remove active_btn""><i class="fas fa-trash-alt"></i></button>
                                <button class="catalogue__item-text--add active_btn"><i class="fas fa-shopping-cart"></i></button>
                            </div>
                        </div>
                       `
  
                      this.parent.append(elem);
    }
  }
  
  const getItems = async(url) => {
    const res = await fetch(url);
  
      if(!res.ok){
        throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
      }
  
    return await res.json();
  };
  
  getItems('js/products.json')
    .then(data => { 
      data.items.forEach(({img, alt, title, price}) => {
       new CardItem(img, alt, title, parseInt(price).toFixed(2), '.catalogue__products').render();

       
      })
    })
    .then(() => {
       const items = document.querySelectorAll('.show'),
             productsDOM = document.querySelector('.catalogue__products'),
             removeFromList = document.querySelectorAll('.button'),
             removeBtn = document.querySelectorAll('.catalogue__item-text--remove');
       
       pagination(items, productsDOM);
       parentNode(removeFromList);
       parentNode(removeBtn);  

    })  

}());

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

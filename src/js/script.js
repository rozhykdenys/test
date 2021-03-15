//Creating products items
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
             removeBtn = document.querySelectorAll('.catalogue__item-text--remove'),
             title = document.querySelectorAll('.title_item');

       pagination(items, productsDOM);
       parentNode(removeFromList);
       parentNode(removeBtn); 
       filter(title);

    })  

}());

//Creating paginations
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

  //Remove buttons
  function parentNode(buttons){
    buttons.forEach(item => item.addEventListener('click', function(){
      console.log(this.parentNode.parentNode.parentNode);
      this.parentNode.parentNode.parentNode.remove(this);
    }))
  }

  //Items filter
  function filter (filter){
    const btn = document.querySelector('.filter__form-btn'),
          inputValue = document.querySelector('.filter__form-inpt');

    function makeActive(){
      filter.forEach(elem => {
        elem.parentNode.parentNode.parentNode.classList.remove('hide');
      })
    }

  inputValue.addEventListener('input', function() {
    let val = this.value.toLowerCase();
    
      if(val != ''){
        btn.removeAttribute('disabled');
        filter.forEach(elem => {
          if(elem.innerText.toLowerCase().search(val) == -1){
            elem.parentNode.parentNode.parentNode.classList.add('hide');
          }else{
            elem.parentNode.parentNode.parentNode.classList.remove('hide');
          }
        })
      }else{
        btn.setAttribute('disabled', 'disabled');
        makeActive()
      }
  })

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      inputValue.value = '';
      makeActive()
      btn.setAttribute('disabled', 'disabled');
    })
  }

//hamburger 
function hamburger(){
  const hamburger = document.querySelector('.hamburger'),
        close = document.querySelector('.close'),
        lists = document.querySelector('.header__nav-lists');

  hamburger.addEventListener('click', () => {
    lists.classList.add('active_lists');
  })
  
  close.addEventListener('click', () => {
    lists.classList.remove('active_lists');
  })

}

hamburger()
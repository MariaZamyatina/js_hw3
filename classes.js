class Good {
    constructor(id,name_good,description,sizes,price,available) {
        this.id = id;
        this.name = name_good;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(new_status) {
        this.available = new_status    
    }
}

class GoodsList {
    #goods;
    constructor(goods,filter,sortPrice,sortDir) { 
        this.#goods = goods;
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }
    get list() {
        const regexp = new RegExp(this.filter,'gmi'); 
        const arr = this.#goods.filter(good => regexp.test(good.name) ? good.name :null);
        const sorted = this.sortDir ? (this.sortPrice ? arr.sort((a, b) => a.price - b.price):arr) : 
        (this.sortPrice ? arr.sort((a, b) => b.price - a.price):arr) ;       
        return sorted
    }
    add(new_good) {
        const flag = this.#goods.includes(new_good);
        flag === true ? console.log('товар уже есть в каталоге'):this.#goods.push(new_good);
    }
    remove(id) {
        return this.#goods.splice(id,1);    
    }
}

class BasketGood extends Good {
    constructor(good,amount) {
    super(good.id,good.name,good.description,good.sizes,good.price,good.available);
    this.amount = amount;
    }
}

//класс для хранения данных о корзине товаров
class Basket {
    constructor (...basket) {
        this.goods = basket;
    }
    get totalAmount() {
        return this.goods.reduce((acc,element) => acc + element.amount,0);    
    }
    get totalSum() {
        return this.goods.reduce((acc,element) => acc + element.amount*element.price,0);
    }
    //Добавляет товар в корзину, если товар уже есть увеличивает количество
    add(good, amount) {
        const el = (element) => element.name == good.name;
        const index = this.goods.findIndex(el);
        if (index != -1) {
            this.goods[index].amount += amount;
        }
        else {
            const BasketGood = {};
            BasketGood.id=good.id;
            BasketGood.name=good.name;
            BasketGood.description=good.description;
            BasketGood.sizes=good.sizes;
            BasketGood.price=good.price;
            BasketGood.available=good.available;
            BasketGood.amount=amount;
            this.goods.push(BasketGood);
        }
    }
    //Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
    remove(good, amount) {
        const el = (element) => element.name == good.name;
        const index = this.goods.findIndex(el);
        if (index != -1) {
            this.goods[index].amount = this.goods[index].amount - amount;
            if (this.goods[index].amount <= 0) {
                this.goods.splice(index,1);
            }
        }
        else {
            console.log(`товар ${good.name} не найден`)
        }
    }
    //удаление корзины
    clear() {
        this.goods = [];
    }
    //Удаляет из корзины товары, имеющие признак available === false (использовать filter())
    removeUnavailable() {
        const arr = this.goods.filter(element => element.available == false);
        if (arr.length > 0) {
            arr.map( x => {
                const el = (element) => element.name == x.name;
                const index = this.goods.findIndex(el);
                this.goods.splice(index,1);
            })
        }
        else {
            console.log(`товары с признаком available = false не найдены`)
        }                        
    }    
}


//создание экземпляров товаров
good1 = new Good(0,"good1","good1",22,10,false);
good2 = new Good(1,"good2","good2",23,20,true);
good3 = new Good(2,"item3","good3",24,30,false);
good4 = new Good(3,"good4","good4",25,40,true);
good5 = new Good(4,"item5","good5",26,50,true);


const goods = [];
goods.push(good1,good3,good4,good5);
console.log('Goods:',goods);

//создание каталога товаров, отфильтрованного по вхождению названия товара 
l = new GoodsList(goods,"goo",true,true); //сортировка по возрастнаю значения price
console.log('list',l.list);
l1 = new GoodsList(goods,"ite",true,false); //сортировка по убыванию price
console.log('list 1',l1.list);

//добавление в каталог нового товара
l.add(good4); //товар есть в каталоге, выдаст сообщение
l.add(good2); //товара нет в каталоге
console.log('catalog',l.list);

//удаление элемента по его индексу
l.remove(3);
console.log('remove from list',l.list);

//добавление товара в корзину
basket_good1 = new BasketGood(good1,5);
basket_good2 = new BasketGood(good2,13);
basket_good3 = new BasketGood(good4,3);

//список товаров в корзине
basket_list = new Basket(basket_good1,basket_good3);
console.log('basket_list:', basket_list);

//общее количество товаров в корзине
console.log('total amount in basket: ',basket_list.totalAmount);

//общая стоимость товаров в корзине
console.log('total summ in basket: ',basket_list.totalSum);

//добавление товара в корзину
basket_list.add(good4,60); //когда такой товар уже есть в корзине
console.log('add good to basket: ',basket_list);
basket_list.add(good3,100); //когда такого товара еще нет в корзине
console.log('add good to basket: ',basket_list);

//уменьшение количества товара в корзине
basket_list.remove(good1,4); 
console.log("basket after good's amount removing: ",basket_list);
basket_list.remove(good3,100); //уменьшение количества товара до 0
console.log("basket after good's amount removing: ",basket_list);
basket_list.remove(good3,4); //если такого товара нет в корзине

//Удаляет из корзины товары, имеющие признак available === false
basket_list.removeUnavailable();
console.log("basket after removing goods whith status available=false: ",basket_list);

//Очищает содержимое корзины
basket_list.clear();
console.log("basket after clearing: ",basket_list);
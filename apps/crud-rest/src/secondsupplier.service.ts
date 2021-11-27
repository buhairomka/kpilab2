import {Injectable} from '@nestjs/common';

const localStorage = {
    products: [
        {id: 1, category: 't-short', price: 20, color: 'black', size: 'l', discount: 1, amount: 54,},
        {id: 2, category: 't-short', price: 20, color: 'white', size: 'xl', discount: 2, amount: 23,},
        {id: 3, category: 't-short', price: 20, color: 'red', size: 'l', discount: 4, amount: 54,},
        {id: 4, category: 't-short', price: 20, color: 'yellow', size: 'xxl', discount: 1, amount: 32,},
        {id: 5, category: 't-short', price: 20, color: 'red', size: 'l', discount: 0, amount: 43,},
        {id: 6, category: 't-short', price: 20, color: 'brown', size: 'm', discount: 4, amount: 23,},
        {id: 7, category: 't-short', price: 20, color: 'blue', size: 'm', discount: 30, amount: 76,},
        {id: 8, category: 't-short', price: 20, color: 'red', size: 'm', discount: 5, amount: 34,},
        {id: 9, category: 't-short', price: 20, color: 'red', size: 'l', discount: 5, amount: 66,},
        {id: 10, category: 't-short', price: 20, color: 'white', size: 'l', discount: 23, amount: 4,},
        {id: 11, category: 't-short', price: 20, color: 'purple', size: 'm', discount: 0, amount: 3,},
    ]
}

@Injectable()
export class SecondSupplierService {
    all(){
        return localStorage.products
    }
    findProductsById(id) {
        console.log(id)
        if (id) {
            return localStorage.products.find((row) => {
            console.log('row id is',row.id)
            if (row.id == id){
                return true
            }
            return false
        })
        }

    }
}

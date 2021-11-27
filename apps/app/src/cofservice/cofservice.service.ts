import {Injectable} from '@nestjs/common';
import {QueryBuilderService} from "../querybuilder/querybuilder.service";
import {DbSingletonService} from "../dbsingleton/dbsingleton.service";
const fetch = require("node-fetch")

interface Handler {
    setNext(handler: Handler): Handler;
    handle(request);
}

abstract class AbstractHandler implements Handler {
    static res = []
    private nextHandler: Handler;

    static getRes() {
        let [...res] = this.res
        this.res = []
        return res
    }

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    public async handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return null;
    }
}

class DBHandler extends AbstractHandler {
    qb: QueryBuilderService
    db = DbSingletonService.getClient()

    async handle(query) {
        console.log(query)
        this.qb = new QueryBuilderService()
        this.db = await DbSingletonService.getClient()
        if (query) {
            this.qb.select(['*']).from('product')

            const keys = Object.keys(query)
            console.log(keys)
            if (keys.length != 0){
                this.qb.where()
            }

            for (const key of keys) {
                if (key == keys[keys.length - 1]) {
                    this.qb.whereExpr(key, JSON.parse(query[key])[0], JSON.parse(query[key])[1])
                } else {
                    this.qb.whereExpr(key, JSON.parse(query[key])[0], JSON.parse(query[key])[1]).and()
                }
            }
            const qbres = this.qb.getRes()
            console.log(qbres)
            const res = (await this.db.query(qbres)).rows
            AbstractHandler.res.push(res)
        }
        return await super.handle(query);
    }
}

class Supplier1Handler extends AbstractHandler {
    public async handle(request) {

        console.log(AbstractHandler.res)
        if (request) {
            let url = ''
            for (const key in request) {
                url += '&' + key.toString() + '=' + request[key].toString()
            }

            let ress = await fetch(`http://localhost:3000/search?${url}`).then(async response=> await response.json())
            AbstractHandler.res.push(ress)

        }
        return await super.handle(request);

    }
}



class Supplier2Handler extends AbstractHandler {
    public async handle(query) {
        if (query) {
            let ress = await fetch(`http://localhost:3000/price-list`).then(async response=> await response.json())

            ress = ress.filter((row) => {
                    for (const key of Object.keys(query)) {
                        console.log(`'${row[key]}' ${JSON.parse(query[key])[0]=='='?'==':JSON.parse(query[key])[0]} '${JSON.parse(query[key])[1]}'`)
                        return (eval(`'${row[key]}' ${JSON.parse(query[key])[0]=='='?'==':JSON.parse(query[key])[0]} '${JSON.parse(query[key])[1]}'`))
                    }
                    return true
                })

            console.log('ress',ress)
            AbstractHandler.res.push(ress)
        }
        return await super.handle(query);

    }
}


@Injectable()
export class CoFService {

    async findItems(query) {

        const dbhandler = await new DBHandler()
        const fstsupp = await new Supplier1Handler()
        const scndsupp = await new Supplier2Handler()
        dbhandler.setNext(fstsupp)
        fstsupp.setNext(scndsupp)
        await dbhandler.handle(query)
        return await AbstractHandler.getRes()
    }
}
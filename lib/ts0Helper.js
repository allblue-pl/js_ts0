                                                               
import ts0, {                   } from "./index.js";

export class ts0Helper_Class {
    constructor() {
        
    }

    copyRawArray(arr             )              {
        let arr_New = new Array();
        for (let val of arr) {
            if (val === null) {
                arr.push(null);
                continue;
            }

            if (ts0.checkType(val, ts0.TRawObject)) {
                arr_New.push(this.copyRawObject(val                ));
                continue;
            }

            if (Array.isArray(val)) {
                arr_New.push(this.copyRawArray(val));
                continue;
            }

            arr_New.push(val);
        }

        return arr_New;
    }

    copyRawObject                        (obj   )    {
        let obj_New               = {};
        for (let prop in obj) {
            if (obj[prop] === null) {
                obj_New[prop] = null;
                continue;
            }

            if ((typeof obj[prop]) === 'symbol') {
                obj_New[prop] = obj[prop];
                continue;
            }

            if (ts0.checkType(obj[prop], ts0.TRawObject)) {
                obj_New[prop] = this.copyRawObject(obj[prop]                );
                continue;
            }

            if (Array.isArray(obj[prop])) {
                obj_New[prop] = this.copyRawArray(obj[prop]);
                continue;
            }

            obj_New[prop] = obj[prop];
        }

        return obj_New     ;
    }
}
const ts0Helper = new ts0Helper_Class();
export default ts0Helper;
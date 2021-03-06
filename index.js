
function _isType(obj, type) {
    return (
        Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']'
    );
}

function _type(obj) {
    return (
        Object.prototype.toString.call(obj).toLowerCase().split(' ')[1].replace(']','')
    );
}

function quickCloneObject (input) {
    const output = {};
    Object.keys(input).forEach((key)=> {
        output[key] = cloneValue(input[key]);
    });
    return output;
}

function quickCloneArray (input) {
    return input.map(cloneValue);
}

function cloneValue (value) {
    if (_isType(value, 'object')) {
        return quickCloneObject(value);
    }
    else if (_isType(value, 'array')) {
        return quickCloneArray(value);
    }
    return value;
}

function executeF (target, obs = []) {
    // 若传入有不合理数据，都转为对象
    const objects = obs.map(object => object || {});
    const output = target || {};

    objects.forEach((item) => {
        const keys = Object.keys(item);
        keys.forEach((key) => {
            const value = item[key];
            const type = _type(value);
            const targetValueType = _type(output[key]);
            if (type === 'object') {
                if (targetValueType !== 'undefined') {
                    // 这里是用item去覆盖target，item已经为object，若target为object则需要去混合属性否则直接替换
                    const targetValue = (targetValueType === 'object' ? output[key] : {});
                    output[key] = executeF({}, [targetValue, quickCloneObject(value)]);
                } else {
                    output[key] = quickCloneObject(value);
                }
            }
            else if (type === 'array') {
                output[key] = quickCloneArray(value);
            }
            else if (type === 'undefined' || type === 'null'){
                // do nothing
            }
            else {
                // merge
                output[key] = value;
            }
        });
    });
    return output;
}

/*
 *@fillJsonData: 填充json数据
 *@param {object || array} target 目标的数据格式
 *@param {object || array} object 目前还只是当前残缺的数据
*/
function fillJsonData (target, ...objects) {
    return executeF(target, objects);
}

window.fillJsonData = fillJsonData;

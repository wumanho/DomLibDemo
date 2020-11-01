window.dom = {
    /*=========================↓增↓=========================*/
    create(string) {
        //创建一个容器template标签
        let container = document.createElement("template")
        //将用户写的元素插入到template容器中
        container.innerHTML = string.trim()
        //返回除template容器外的内容
        return container.content.firstChild
    },
    after(node,node2){
        node.parentNode.insertBefore(node2,node.nextSibling)
    },
    before(node,node2){
        node.parentNode.insertBefore(node2,node)
    },
    append(parent,node){
        parent.appendChild(node)
    },
    //wrap用于为node属性创建一个parent元素，将 Node 包裹
    wrap(node,parent){
        //在node前面插入parent元素
        dom.before(node,parent)
        //由于append会将原本的元素移除，再插入，所以只要直接调用append即可
        dom.append(parent,node)
    },
    /*=========================↑增↑=========================*/

    /*=========================↓删↓=========================*/
    remove(node){
        node.parentNode.removeChild(node)
        //为用户返回引用
        return node
    },
    empty(node) {
        //获取node的所有孩子
        const {childNodes} = node
        //用于记录所有删除的元素
        let arr = []
        //当node还有孩子的时候
        while(node.firstChild){
            //移除他并添加到数组
            arr.push(dom.remove(node.firstChild))
        }
        return arr
    },
    /*=========================↑删↑=========================*/

    /*=========================↓改↓=========================*/
    attr(node,name,value){
        //判断参数长度，如果三个参数，就是设置一个属性，如果两个参数，就是查询属性值，其实就是重载
        if (arguments.length === 3){
            node.setAttribute(name,value)
        }else if (arguments.length === 2){
            return node.getAttribute(name)
        }
    },
    text(node,string){ //适配各个浏览器的实现
        if(arguments.length === 2){
            //修改元素的文本内容
            if ('innerText' in node){
                node.innerText = string
            }else{
                node.textContent = string
            }
        }else if (arguments.length === 1){
            //返回元素的文本内容
            if ('innerText' in node){
               return  node.innerText
            }else{
                return node.textContent
            }
        }
    },
    html(node,string){
        if (arguments.length === 2){
            node.innerHTML = string
        }else if (arguments.length === 1){
            return node.innerHTML
        }
    },
    style(node,name,value){   //用户可以以多种方法设置style
        if (arguments.length === 3){
            // dom.style(div,"color","red")
            node.style[name] = value
        }else if (arguments.length === 2){
            if (typeof name === "string"){
                // dom.style(div,"color")
                return node.style[name]
            }
            if (name instanceof Object){
                // dom.style(div,{border:"1px solid red", color:"blue"})
                for (let key in name){
                    node.style[key] = name[key]
                }
            }
        }
    },
    on(node,event,fn){
        node.addEventListener(event,fn)
    },
    off(node,event,fn){
        node.removeEventListener(enent,fn)
    },
    class:{
        add(node,className){
            node.classList.add(className)
        },
        remove(node,className){
            node.classList.remove(className)
        },
        has(node,className){
            return node.classList.contains(className)
        }
    },
    /*=========================↑改↑=========================*/

    /*=========================↓查↓=========================*/
    find(selector,scope){
        //如果有两个参数，意味着用户指定了查找的范围，默认在document里面找，如果有第二个参数就从
        //第二个参数里面找
        return (scope || document).querySelectorAll(selector)
    },
    parent(node){
        return node.parentNode
    },
    children(node){
        return node.children
    },
    siblings(node){
        //返回同一个父节点下的兄弟节点，主要是需要排除掉自己
        //将父节点的所有子节点找出来，转成数组，用filter将node移除即可
        return Array.from(node.parentNode.children).filter(n=>n!==node)
    },
    next(node){
        //获取下一个节点
        let nextNode = node.nextSibling
        //判断下一个节点是否存在，并且判断下一个节点是否文本节点
        while(nextNode && nextNode.nodeType === 3){
            //如果是文本节点，则继续下一个循环，直到找到不是文本的节点
            nextNode = nextNode.nextSibling
        }
        return nextNode
    },
    previous(node){
        //获取上一个节点
        let preNode = node.previousSibling
        //判断上一个节点是否存在，并且判断上一个节点是否文本节点
        while(preNode && preNode.nodeType === 3){
            //如果是文本节点，则继续下一个循环，直到找到不是文本的节点
            preNode = preNode.previousSibling
        }
        return preNode
    },
    each(nodes,fn){
        //遍历每个子节点，调用方法
        for (let i = 0; i < nodes.length; i++) {
            fn(nodes[i])
        }
    },
    index(node){
        //先获取节点的父节点的所有子节点
        let childrens = dom.children(dom.parent(node))
        //然后遍历判断，将下标返回即可
        for (let i = 0; i < childrens.length; i++) {
            if(childrens[i] === node){
                return i+1
            }
        }
    }
}
let highlightedElement = null;

document.addEventListener('mouseover', (event) => {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    highlightedElement = event.target;
    highlightedElement.style.outline = '2px solid red';
});

document.addEventListener('mouseout', (event) => {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
        highlightedElement = null;
    }
});

document.addEventListener('click', (event) => {
    if (highlightedElement) {
        // 获取并打印 XPath 和 CSS 选择器路径
        const xpath = getXPath(highlightedElement);
        const cssSelector = getCSSSelector(highlightedElement);
        console.log('XPath:', xpath);
        console.log('CSS Selector:', cssSelector);

        // 停止事件传播，防止触发其他点击事件
        event.stopPropagation();
        event.preventDefault();
    }
});

// 获取 XPath 路径的函数
function getXPath(element) {
    if (element.id !== '') {
        return 'id("' + element.id + '")';
    }
    if (element === document.body) {
        return element.tagName.toLowerCase();
    }

    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// 获取 CSS 选择器路径的函数
function getCSSSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    const path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.split(' ').join('.');
        }
        path.unshift(selector);
        element = element.parentNode;
    }
    return path.join(' > ');
}
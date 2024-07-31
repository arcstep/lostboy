// 读取content.js保存的内容
const get_content = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['extractedContent'], (result) => {
            if (result.extractedContent) {
                resolve(result.extractedContent);
            } else {
                reject("未找到提取的内容");
            }
        });
    });
}

document.getElementById('focusButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['popup/focus.js']
        });
    });
});

document.getElementById('removeFocusButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: removeInjectedScript
        });
    });
});

document.getElementById('getContentButton').addEventListener('click', () => {
    get_content().then(content => {
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = ''; // 清空之前的内容

        // 创建一个<pre>元素来保持文本格式
        const preElement = document.createElement('pre');

        // 检查content是否为数组
        if (Array.isArray(content)) {
            // 如果是数组，将每个项添加到preElement的textContent
            content.forEach(item => {
                preElement.textContent += item + '\n'; // 添加换行符以分隔数组中的项
            });
        } else {
            preElement.textContent = content;
        }

        contentDisplay.appendChild(preElement);
    }).catch(error => {
        console.error(error);
    });
});

// 定义一个函数来移除注入的脚本
function removeInjectedScript() {
    // 移除所有添加的事件监听器
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('click', handleClick);

    // 清除所有红色边框
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        element.style.outline = '';
    });
}

// 定义事件处理函数
function handleMouseOver(event) {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    highlightedElement = event.target;
    highlightedElement.style.outline = '2px solid red';
}

function handleMouseOut(event) {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
        highlightedElement = null;
    }
}

function handleClick(event) {
    if (highlightedElement) {
        const xpath = getXPath(highlightedElement);
        const cssSelector = getCSSSelector(highlightedElement);
        console.log('XPath:', xpath);
        console.log('CSS Selector:', cssSelector);
        event.stopPropagation();
        event.preventDefault();
    }
}

// 定义获取 XPath 和 CSS 选择器路径的函数
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
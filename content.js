console.log("我是一个小飞侠")

console.log("当前页面的完整 URL:", window.location.href); // 获取完整的 URL
console.log("协议:", window.location.protocol); // 例如 "http:"
console.log("主机名:", window.location.hostname); // 例如 "www.example.com"
console.log("端口号:", window.location.port); // 如果有指定端口号的话
console.log("路径:", window.location.pathname); // 例如 "/path/to/page"

// 优化配置对象，使用全路径作为键，并使用 CSS 选择器
const config = {
    "https://open.bigmodel.cn/dev/howuse": {
        "selector": '#app > div.page-doc > div > div > div.page-how-use-right',
        "seconds": 3
    },
    "https://open.bigmodel.cn/dev/api": {
        "selector": '#app > div.page-doc > div > div > div.page-api-right',
        "seconds": 3
    }
};

function extractContentBasedOnConfig() {
    const currentUrl = window.location.href; // 使用完整的 URL 来匹配
    const configEntry = Object.entries(config).find(([url, _]) => currentUrl.startsWith(url));

    setTimeout(() => {
        if (configEntry) {
            const [_, { selector, seconds }] = configEntry;
            // 查找目标元素
            const targetNode = document.querySelector(selector);
            console.log('当前 URL:', currentUrl);
            console.log('配置:', selector);
            console.log('目标元素:', targetNode);

            if (targetNode) {
                let lastContent = ""; // 在外部维护一个变量来记录上一次的内容

                const observer = new MutationObserver(mutations => {
                    let hasSignificantChange = false; // 标记是否有实质性变化

                    // 检查所有变化，确定是否有实质性内容变化
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            const currentContent = targetNode.innerText;
                            if (currentContent !== lastContent) {
                                hasSignificantChange = true;
                                lastContent = currentContent; // 更新记录的内容
                                break; // 一旦发现实质性变化，就跳出循环
                            }
                        }
                    }

                    // 如果有实质性变化，执行所需操作
                    if (hasSignificantChange) {
                        console.log('检测到 DOM 实质性变化，提取并转换内容');
                        const markdownContent = convertToMarkdown(lastContent);
                        console.log(formatString(markdownContent));
                    }
                });

                // 配置 MutationObserver 的选项，以观察子节点的变化或节点属性的变化
                const config = { childList: true, attributes: true, subtree: true };
                observer.observe(targetNode, config);

                // 使用 setTimeout 来处理初始加载
                setTimeout(() => {
                    const content = targetNode.innerText;
                    const markdownContent = convertToMarkdown(content);
                    console.log(formatString(markdownContent));
                }, seconds * 1000);
            } else {
                console.log("指定的 CSS 选择器未找到对应元素");
            }
        }
    }, 3000);
}

// 将文本内容转换为 Markdown 的函数
function convertToMarkdown(text) {
    // 根据实际的 HTML 结构和样式定制转换逻辑
    return text.split('\n').map(line => `* ${line}`).join('\n');
}

function formatString(str) {
    const omittedLength = str.length > 50 ? str.length - 50 : 0;
    const formattedStr = str.substring(0, 50) + (omittedLength > 0 ? "..." : "");
    return `${formattedStr}(省略${omittedLength}个字)`;
}

// 调用函数
extractContentBasedOnConfig();
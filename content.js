// 优化配置对象，使用全路径作为键，并使用 CSS 选择器
const get_all = function () {
    return {
        "https://open.bigmodel.cn/dev": {
            "selector": '#app > div.page-doc',
            "seconds": 3
        },
    }
};

function extractContentBasedOnConfig() {
    console.log("我是一个小飞侠")

    console.log("当前页面的完整 URL:", window.location.href); // 获取完整的 URL
    console.log("协议:", window.location.protocol); // 例如 "http:"
    console.log("主机名:", window.location.hostname); // 例如 "www.example.com"
    console.log("端口号:", window.location.port); // 如果有指定端口号的话
    console.log("路径:", window.location.pathname); // 例如 "/path/to/page"


    const currentUrl = window.location.href;

    // 检查当前 URL 是否以 "chrome://" 开始
    if (currentUrl.startsWith("chrome://")) {
        console.log("在chrome://路径中，不运行插件");
        return;
    }

    all = get_all(); // 获取所有配置
    const configEntry = Object.entries(all).find(([url, _]) => currentUrl.startsWith(url));

    setTimeout(() => {
        if (configEntry) {
            const [_, { selector, seconds }] = configEntry;
            const targetNode = document.querySelector(selector);
            console.log('当前 URL:', currentUrl);
            console.log('配置:', selector);
            console.log('目标元素:', targetNode);

            if (targetNode) {
                let lastContent = "";

                const observer = new MutationObserver(mutations => {
                    let hasSignificantChange = false;

                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            const currentContent = targetNode.innerText;
                            if (currentContent !== lastContent) {
                                hasSignificantChange = true;
                                lastContent = currentContent;
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

function convertToMarkdown(text) {
    // 将提取的内容保存到chrome.storage.local中
    chrome.storage.local.set({ extractedContent: text }, () => {
        console.log('内容已保存');
    });
    return text.split('\n').map(line => `* ${line}`).join('\n');
}

function formatString(str) {
    const omittedLength = str.length > 50 ? str.length - 50 : 0;
    const formattedStr = str.substring(0, 50) + (omittedLength > 0 ? "..." : "");
    return `${formattedStr}(省略${omittedLength}个字)`;
}

// 调用函数
extractContentBasedOnConfig();
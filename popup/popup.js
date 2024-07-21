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
            // 如果不是数组，直接将content作为文本内容
            preElement.textContent = content;
        }

        // 将preElement添加到contentDisplay中
        contentDisplay.appendChild(preElement);
    }).catch(error => {
        // 使用<pre>标签显示错误信息，保持格式
        const preElement = document.createElement('pre');
        preElement.textContent = error;
        document.getElementById('contentDisplay').appendChild(preElement);
    });
});
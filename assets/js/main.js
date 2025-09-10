// main.js - JS chung cho toàn bộ website

const $ = document.querySelector.bind(document);
// chọn phần tử đầu tiên phù hợp với selector
const $$ = document.querySelectorAll.bind(document);
// chọn tất cả phần tử phù hợp với selector

/**
 * Hàm tải template
 *      
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 * Sau đó trang từ đường dẫn trên sẽ được load vào trong div có id="parent"
 */
function load(selector, path) {
    const cachedTemplates = localStorage.getItem(path);
    if(cachedTemplates){
        $(selector).innerHTML = cachedTemplates;
    }

    fetch(path)
        .then(response => response.text())
        .then(data => {
            $(selector).innerHTML = data;
            localStorage.setItem(path, data);
        })
        .catch(error => console.error('Error loading template:', error));
}
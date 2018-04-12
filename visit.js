// 全局变量
var page,
    system = require('system'),
    fs = require('fs'),
    parent = system.args[1],
    fileName = system.args[2],
    flag = {};

// 创建空文件
fs.write(fileName, '', 'w');

// 处理页面
function handlePage(url) {
  // 创建新的页面
  page = require('webpage').create();

  // 访问该页面
  console.log('Visiting URL: ' + url);

  // 处理重定向
  page.onNavigationRequested = function(url_, type, willNavigate, main) {
    // 发现重定向
    if (main && url_ != url && url_.substr(0, 5) == 'http:') {
      flag[url] = false;
      console.log('Redirect caught: ' + url_);
      page.close();
      // 访问新的页面
      setTimeout(function(url_) {
        handlePage(url_);
      }, 1, url_);
    // 没有重定向
    } else if (main && url_ == url && flag[url] != false) {
      flag[url] = true;
    }
  }

  // 没有重定向后再打开页面
  function checkFlag(status) {
    if (flag[url] != true) {
      setTimeout(function(status) {
        checkFlag(status);
      }, 100, status);
    } else {
      // 页面打开失败，退出程序
      if (status !== 'success') {
        console.log('Error loading URL: ' + url + '\n');
        phantom.exit();
      // 页面成功打开
      } else {
        console.log('Successfully loaded URL: ' + url);
        console.log('Content: ' + page.content.substr(0, 20) + '...\n');
        // 找出 <a> 标签
        var urls = page.evaluate(function() {
          var aTags = document.getElementsByTagName('a');
          var urls_ = [];
          for (var i = 0; i < aTags.length; i++) {
            var a = document.createElement('a');
            a.href = aTags[i].href;
            var href = a.href;
            if (urls_.indexOf(href) == -1 && href.substr(0, 5) == 'http:')
              urls_.push(href);
          }
          urls_.sort(function() { return 0.5 - Math.random() });
          return urls_.slice(0, 5);
        });
        // 输出寻找到的 URL
        var content = '';
        for (var i = 0; i < urls.length; i++)
          content = content + urls[i] + '\n';
        fs.write(fileName, content, 'w');
        // 退出程序
        phantom.exit();
      }
    }
  }

  // 打开该页面
  page.open(url, function(status) {
    checkFlag(status);
  });
}

// 访问父页面
handlePage(parent);

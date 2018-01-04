# homebridge-phicomm-air_detector
[![npm version](https://badge.fury.io/js/homebridge-phicomm-air_detector.svg)](https://badge.fury.io/js/homebridge-phicomm-air_detector)

斐讯的空气检测仪悟空M1的HomeBridge插件。
   
感谢[Zack](#)，感谢每一位开发者和测试人员。   
   
**注: 如果你发现bug， 请提交到[issues](https://github.com/YinHangCode/homebridge-phicomm-air_detector/issues)或加[QQ群: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d).**   

![](https://raw.githubusercontent.com/YinHangCode/homebridge-phicomm-air_detector/master/images/M1.jpg)

## 前置工作
程序需要数据主动推送过来，可以做DNS欺骗(域名是aircat.phicomm.com)让M1设备直接发包过来，也可以tcpdump截取包再转发过来。    

## 安装
1. 安装HomeBridge，具体参考[README](https://github.com/nfarina/homebridge/blob/master/README.md).   
2. 确保你可以在家庭app添加设备界面中看见桥配件，否则返回第一步。   
3. 执行下列命令安装该插件.   
```
npm install -g homebridge-phicomm-air_detector
```
## 配置说明
listenPort是监听端口，如果让M1直接发包过来写9000。    
forwardAddress是转发地址，可以转发给斐讯服务器或者其它需要用数据的地方。    
```
"platforms": [{
    "platform": "PhicommAirDetectorPlatform",
    "listenPort": 9000,
    "forwardAddress": "220.181.112.244:9000",
    "deviceCfgs": [{
        "temperatureDisable": false,
        "temperatureName": "客厅温度",
        "humidityDisable": false,
        "humidityName": "客厅湿度",
        "ledBulbDisable": true,
        "ledBulbName": "客厅空气检测仪屏幕",
        "airQualityDisable": false,
        "airQualityName": "客厅空气质量"
    }]
}]
```

## 更新日志
### 0.0.1
1.支持斐讯空气检测仪悟空M1.   
